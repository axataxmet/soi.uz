import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
// Types come from the ISOLATED etender client, not the main @prisma/client.
import { EtenderSyncStatus, Prisma } from '../../prisma/etender/generated/client';
import { EtenderPrismaService } from './etender-prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { EtenderAdapter } from './etender.adapter';
import { GovUzAdapter } from './govuz.adapter';
import { XaridAdapter } from './xarid.adapter';
import { XtXaridAdapter } from './xtxarid.adapter';
import { FarmaAdapter } from './farma.adapter';
import { MedicalFilter } from './medical-filter';
import { MED_CATEGORIES, MedCategoryClassifier } from './med-category';
import { EtenderLotQueryDto } from './dto/etender-query.dto';
import { NormalizedEtenderLot, UzexTradeSource } from './etender.types';
import { FARMA_SOURCES, FarmaSource, GOVUZ_SOURCES, GovUzSource, TENDER_PLATFORMS, UZEX_SOURCES, XARID_SOURCES, XaridSource, XT_SOURCES, XtSource } from './tender-sources';

const CRON_NAME = 'etender-daily-sync';

// EtenderService — owns the daily multi-source sync, the isolated Postgres cache
// (etender_lots) and the sync log (etender_sync_logs). Public reads come from the
// cache; only this service reaches upstream, once a day, across all sources.
@Injectable()
export class EtenderService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(EtenderService.name);
  private readonly enabledSources: Set<string> | null;
  private readonly pageSize: number;
  private readonly maxPages: number;
  private readonly cron: string;
  private readonly tz: string;
  private readonly enabled: boolean;
  private readonly listCacheTtlMs: number;
  private booting?: NodeJS.Timeout;
  private running = false;
  private readonly listCache = new Map<string, { at: number; data: unknown }>();

  constructor(
    private readonly prisma: EtenderPrismaService,
    private readonly adapter: EtenderAdapter,
    private readonly govuz: GovUzAdapter,
    private readonly xarid: XaridAdapter,
    private readonly xt: XtXaridAdapter,
    private readonly farma: FarmaAdapter,
    private readonly medical: MedicalFilter,
    private readonly medCat: MedCategoryClassifier,
    private readonly scheduler: SchedulerRegistry,
    config: ConfigService,
  ) {
    // Optional allow-list of source ids; empty/unset = all.
    const raw = (config.get<string>('ETENDER_SYNC_SOURCES') || '').split(',').map((s) => s.trim()).filter(Boolean);
    this.enabledSources = raw.length ? new Set(raw) : null;
    this.pageSize = Number(config.get('ETENDER_SYNC_PAGE_SIZE')) || 50;
    this.maxPages = Number(config.get('ETENDER_SYNC_MAX_PAGES')) || 40;
    this.cron = config.get<string>('ETENDER_SYNC_CRON') || '0 8,20 * * *'; // twice a day: 08:00 and 20:00
    this.tz = config.get<string>('ETENDER_SYNC_TZ') || 'Asia/Tashkent';
    this.enabled = String(config.get('ETENDER_SYNC_ENABLED') ?? 'true') !== 'false';
    this.listCacheTtlMs = Number(config.get('ETENDER_LIST_CACHE_TTL_MS')) || 300_000; // 5 min
  }

  private isOn(source: string): boolean {
    return !this.enabledSources || this.enabledSources.has(source);
  }

  onModuleInit() {
    if (!this.enabled) {
      this.log.log('e-tender sync disabled (ETENDER_SYNC_ENABLED=false)');
      return;
    }
    const job = CronJob.from({ cronTime: this.cron, timeZone: this.tz, onTick: () => void this.syncAll('cron'), start: true });
    this.scheduler.addCronJob(CRON_NAME, job as any);
    const active = [...UZEX_SOURCES, ...XARID_SOURCES, ...XT_SOURCES, ...GOVUZ_SOURCES, ...FARMA_SOURCES].filter((s) => this.isOn(s.source)).map((s) => s.source);
    this.log.log(`tender sync scheduled: cron "${this.cron}" (${this.tz}) — sources: ${active.join(', ')}`);

    this.booting = setTimeout(() => {
      void (async () => {
        try {
          if ((await this.prisma.etenderLot.count()) === 0) {
            this.log.log('tender cache empty on boot — running initial sync');
            await this.syncAll('boot');
          }
        } catch (e) {
          this.log.warn(`boot cache check failed: ${(e as Error).message}`);
        }
      })();
    }, 8_000);
  }

  onModuleDestroy() {
    if (this.booting) clearTimeout(this.booting);
    try {
      if (this.scheduler.doesExist('cron', CRON_NAME)) this.scheduler.getCronJob(CRON_NAME).stop();
    } catch {
      /* ignore */
    }
  }

  // Sync every enabled source. Overlap-guarded so a slow run can't stack.
  async syncAll(trigger = 'manual'): Promise<{ ran: boolean; results: unknown[] }> {
    if (this.running) {
      this.log.warn(`sync skipped (${trigger}) — previous run still in progress`);
      return { ran: false, results: [] };
    }
    this.running = true;
    const results: unknown[] = [];
    try {
      for (const cfg of UZEX_SOURCES) {
        if (this.isOn(cfg.source)) results.push(await this.syncUzexSource(cfg, trigger));
      }
      if (this.xarid.enabled) {
        for (const cfg of XARID_SOURCES) {
          if (this.isOn(cfg.source)) results.push(await this.syncXaridSource(cfg, trigger));
        }
      }
      if (this.xt.enabled) {
        for (const cfg of XT_SOURCES) {
          if (this.isOn(cfg.source)) results.push(await this.syncXtSource(cfg, trigger));
        }
      }
      // gov.uz sources only run when the API route is configured (adapter enabled).
      if (this.govuz.enabled) {
        for (const cfg of GOVUZ_SOURCES) {
          if (this.isOn(cfg.source)) results.push(await this.syncGovUzSource(cfg, trigger));
        }
      }
      if (this.farma.enabled) {
        for (const cfg of FARMA_SOURCES) {
          if (this.isOn(cfg.source)) results.push(await this.syncFarmaSource(cfg, trigger));
        }
      }
    } finally {
      this.running = false;
      this.listCache.clear(); // fresh data → drop cached read responses
    }
    return { ran: true, results };
  }

  private async syncUzexSource(cfg: UzexTradeSource, trigger: string) {
    return this.runSync(cfg.source, cfg.typeId, trigger, () => this.adapter.fetchAllLots(cfg, this.pageSize, this.maxPages));
  }

  private async syncGovUzSource(cfg: GovUzSource, trigger: string) {
    return this.runSync(cfg.source, null, trigger, async () => {
      const lots = await this.govuz.fetch(cfg);
      return { lots, total: lots.length };
    });
  }

  private async syncXaridSource(cfg: XaridSource, trigger: string) {
    return this.runSync(cfg.source, null, trigger, async () => {
      const lots = await this.xarid.fetch(cfg, this.pageSize, cfg.maxPages ?? this.maxPages);
      return { lots, total: lots.length };
    });
  }

  private async syncXtSource(cfg: XtSource, trigger: string) {
    return this.runSync(cfg.source, null, trigger, async () => {
      const lots = await this.xt.fetch(cfg, this.pageSize, this.maxPages);
      return { lots, total: lots.length };
    });
  }

  private async syncFarmaSource(cfg: FarmaSource, trigger: string) {
    return this.runSync(cfg.source, null, trigger, () => this.farma.fetchAllLots(cfg, this.pageSize, this.maxPages));
  }

  // Shared per-source sync: fetch → upsert → deactivate vanished/expired → log.
  private async runSync(
    source: string,
    typeId: number | null,
    trigger: string,
    fetcher: () => Promise<{ lots: NormalizedEtenderLot[]; total: number }>,
  ) {
    const startedAt = new Date();
    let fetched = 0;
    let upserted = 0;
    let deactivated = 0;
    let total: number | null = null;
    try {
      const { lots, total: t } = await fetcher();
      total = t;
      const pulled = lots.length;
      // Systematic medical filter BEFORE persisting — only medical procurement is
      // stored, so the DB and the showcase stay on-domain.
      const kept = this.medical.apply(lots, source);
      fetched = kept.length;
      for (const lot of kept) {
        await this.upsertLot(lot);
        upserted++;
      }
      // "Only active": a lot is active while it stays in the open feed. It leaves
      // when it vanishes from the feed OR (for lots) its deadline passes. Non-medical
      // rows are never in `kept`, so any previously-stored ones get deactivated too.
      const seen = kept.map((l) => l.externalId);
      const now = new Date();
      const gone = await this.prisma.etenderLot.updateMany({
        where: {
          source,
          active: true,
          OR: [{ externalId: { notIn: seen.length ? seen : ['__none__'] } }, { endDate: { lt: now } }],
        },
        data: { active: false },
      });
      deactivated = gone.count;

      const logRow = await this.prisma.etenderSyncLog.create({
        data: {
          source,
          typeId,
          status: EtenderSyncStatus.SUCCESS,
          fetched,
          upserted,
          deactivated,
          totalCount: total,
          durationMs: Date.now() - startedAt.getTime(),
          startedAt,
          finishedAt: new Date(),
        },
      });
      this.log.log(`sync ${source} (${trigger}): pulled=${pulled} medical=${fetched} upserted=${upserted} deactivated=${deactivated} total=${total}`);
      return logRow;
    } catch (e) {
      const message = (e as Error)?.message || 'unknown error';
      const logRow = await this.prisma.etenderSyncLog.create({
        data: {
          source,
          typeId,
          status: fetched > 0 ? EtenderSyncStatus.PARTIAL : EtenderSyncStatus.FAILED,
          fetched,
          upserted,
          deactivated,
          totalCount: total,
          durationMs: Date.now() - startedAt.getTime(),
          error: message.slice(0, 500),
          startedAt,
          finishedAt: new Date(),
        },
      });
      this.log.error(`sync ${source} (${trigger}) failed: ${message}`);
      return logRow;
    }
  }

  private async upsertLot(lot: NormalizedEtenderLot) {
    const data = {
      source: lot.source,
      kind: lot.kind,
      medCategory: this.medCat.classify(lot),
      sourceUrl: lot.sourceUrl,
      displayNo: lot.displayNo,
      typeId: lot.typeId,
      name: lot.name,
      startDate: lot.startDate,
      endDate: lot.endDate,
      clarificDate: lot.clarificDate,
      cost: lot.cost as unknown as Prisma.Decimal | null,
      sellerId: lot.sellerId,
      sellerName: lot.sellerName,
      sellerTin: lot.sellerTin,
      regionName: lot.regionName,
      districtName: lot.districtName,
      categoryName: lot.categoryName,
      currencyId: lot.currencyId,
      currencyName: lot.currencyName,
      currencyCode: lot.currencyCode,
      raw: lot.raw as unknown as Prisma.InputJsonValue,
      active: true,
      syncedAt: new Date(),
    };
    return this.prisma.etenderLot.upsert({
      where: { source_externalId: { source: lot.source, externalId: lot.externalId } },
      create: { externalId: lot.externalId, ...data },
      update: data,
    });
  }

  // ── Public reads (served from the isolated DB cache, with a short TTL cache) ──
  async listLots(q: EtenderLotQueryDto) {
    const key = JSON.stringify(q);
    const hit = this.listCache.get(key);
    if (hit && Date.now() - hit.at < this.listCacheTtlMs) return hit.data;

    const where: Prisma.EtenderLotWhereInput = {};
    if (q.source) where.source = q.source;
    if (q.kind) where.kind = q.kind;
    if (q.medCategory) {
      const wanted = q.medCategory.split(',').map((v) => v.trim()).filter(Boolean);
      where.medCategory = wanted.length > 1 ? { in: wanted } : wanted[0];
    }
    // A platform is several feeds; filter by the sources it publishes through.
    if (q.platform) {
      const p = TENDER_PLATFORMS.find((x) => x.id === q.platform);
      if (p) where.source = { in: p.sources };
    }
    if (q.state === 'active') where.active = true;
    else if (q.state === 'closed') where.active = false;
    if (q.regionName) where.regionName = { contains: q.regionName, mode: 'insensitive' };
    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: 'insensitive' } },
        { sellerName: { contains: q.search, mode: 'insensitive' } },
        { displayNo: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    /* Default keeps live lots (with a deadline) first and news last. The two
       explicit orders exist because "latest" and "closing soonest" are different
       lots, and a caller that says one and shows the other is simply wrong. */
    if (q.sort === 'closing') where.endDate = { gte: new Date(), ...(where.endDate as object) };
    const orderBy: Prisma.EtenderLotOrderByWithRelationInput[] =
      q.sort === 'fresh'
        ? [{ startDate: { sort: 'desc', nulls: 'last' } }, { syncedAt: 'desc' }]
        : q.sort === 'closing'
          ? [{ endDate: { sort: 'asc', nulls: 'last' } }]
          : [{ endDate: { sort: 'desc', nulls: 'last' } }, { syncedAt: 'desc' }];

    const [data, total] = await this.prisma.$transaction([
      this.prisma.etenderLot.findMany({
        where,
        orderBy,
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.etenderLot.count({ where }),
    ]);
    const result = paginate(data, total, q.page, q.limit);
    this.listCache.set(key, { at: Date.now(), data: result });
    return result;
  }

  // Registry + live counts, for the frontend source tabs/filter.
  async sources() {
    const grouped = await this.prisma.etenderLot.groupBy({
      by: ['source'],
      where: { active: true },
      _count: true,
    });
    const counts = new Map(grouped.map((g) => [g.source, g._count]));
    const uzex = UZEX_SOURCES.map((s) => ({ source: s.source, kind: s.kind, label: s.label, site: s.site, count: counts.get(s.source) || 0, ready: true }));
    const xarid = XARID_SOURCES.map((s) => ({ source: s.source, kind: s.kind, label: s.label, site: s.site, count: counts.get(s.source) || 0, ready: this.xarid.enabled }));
    const xt = XT_SOURCES.map((s) => ({ source: s.source, kind: s.kind, label: s.label, site: s.site, count: counts.get(s.source) || 0, ready: this.xt.enabled }));
    const gov = GOVUZ_SOURCES.map((s) => ({ source: s.source, kind: s.kind, label: s.label, site: 'https://gov.uz', count: counts.get(s.source) || 0, ready: this.govuz.enabled }));
    return [...uzex, ...xarid, ...xt, ...gov];
  }

  /* Platforms as a visitor understands them: four names, each summing the feeds
     underneath it. `ready` says the connector runs, which is not the same as
     having lots — Farma is wired but currently publishes none. */
  async platforms() {
    const grouped = await this.prisma.etenderLot.groupBy({ by: ['source'], where: { active: true }, _count: true });
    const counts = new Map(grouped.map((g) => [g.source, g._count]));
    const wired = new Set([
      ...UZEX_SOURCES.map((s) => s.source),
      ...(this.xarid.enabled ? XARID_SOURCES.map((s) => s.source) : []),
      ...(this.xt.enabled ? XT_SOURCES.map((s) => s.source) : []),
      ...(this.govuz.enabled ? GOVUZ_SOURCES.map((s) => s.source) : []),
      ...(this.farma.enabled ? FARMA_SOURCES.map((s) => s.source) : []),
    ]);
    return TENDER_PLATFORMS.map((p) => ({
      id: p.id,
      name: p.name,
      site: p.site,
      description: p.description,
      count: p.sources.reduce((a, s) => a + (counts.get(s) || 0), 0),
      ready: p.sources.some((s) => wired.has(s)),
    }));
  }

  /* Medical categories with live counts and money. The homepage shows both —
     they tell different stories: consumables are 4 lots but the second-largest
     budget. Aggregated here so the tile never pulls every lot to add them up. */
  async categories() {
    const grouped = await this.prisma.etenderLot.groupBy({
      by: ['medCategory'],
      where: { active: true },
      _count: true,
      _sum: { cost: true },
    });
    const counts = new Map(grouped.map((g) => [g.medCategory ?? 'other', g._count]));
    const sums = new Map(grouped.map((g) => [g.medCategory ?? 'other', Number(g._sum.cost ?? 0)]));
    return MED_CATEGORIES.map((c) => ({
      category: c.id,
      label: c.label,
      count: counts.get(c.id) || 0,
      sum: sums.get(c.id) || 0,
    }));
  }

  /* Compact counters for the homepage tile. The same figures could be derived by
     pulling every active lot, but that is ~87 KB over the wire for three numbers —
     these are four aggregate queries and a payload under 1 KB. */
  async stats() {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAhead = new Date(dayStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const activeLot = { active: true };

    const weekAgo = new Date(dayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [active, newToday, newWeek, endingWeek, platforms, totalSum, lastSync] = await Promise.all([
      this.prisma.etenderLot.count({ where: activeLot }),
      this.prisma.etenderLot.count({ where: { ...activeLot, startDate: { gte: dayStart } } }),
      this.prisma.etenderLot.count({ where: { ...activeLot, startDate: { gte: weekAgo } } }),
      this.prisma.etenderLot.count({ where: { ...activeLot, endDate: { gte: now, lte: weekAhead } } }),
      this.prisma.etenderLot.groupBy({ by: ['source'], where: activeLot, _count: true }),
      this.prisma.etenderLot.aggregate({ where: activeLot, _sum: { cost: true } }),
      this.prisma.etenderSyncLog.findFirst({
        where: { finishedAt: { not: null } },
        orderBy: { finishedAt: 'desc' },
        select: { finishedAt: true },
      }),
    ]);

    return {
      active,
      newToday,
      newWeek,
      endingWeek,
      platforms: platforms.length,
      totalSum: Number(totalSum._sum.cost ?? 0),
      lastSyncAt: lastSync?.finishedAt ?? null,
    };
  }

  getLot(source: string, externalId: string) {
    return this.prisma.etenderLot.findUnique({ where: { source_externalId: { source, externalId } } });
  }

  recentSyncLogs(limit = 60) {
    return this.prisma.etenderSyncLog.findMany({ orderBy: { startedAt: 'desc' }, take: limit });
  }
}
