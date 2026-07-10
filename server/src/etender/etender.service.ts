import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
// Types come from the ISOLATED etender client, not the main @prisma/client.
import { EtenderSyncStatus, Prisma } from '../../prisma/etender/generated/client';
import { EtenderPrismaService } from './etender-prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { EtenderAdapter } from './etender.adapter';
import { EtenderLotQueryDto } from './dto/etender-query.dto';
import { NormalizedEtenderLot } from './etender.types';

const CRON_NAME = 'etender-daily-sync';

// EtenderService — owns the daily sync, the isolated etender Postgres cache
// (etender_lots) and the sync log (etender_sync_logs). Public reads come from
// this cache; only this service reaches the upstream, once a day.
@Injectable()
export class EtenderService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(EtenderService.name);
  private readonly typeIds: number[];
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
    private readonly scheduler: SchedulerRegistry,
    config: ConfigService,
  ) {
    this.typeIds = (config.get<string>('ETENDER_SYNC_TYPES') || '1,2')
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n));
    this.pageSize = Number(config.get('ETENDER_SYNC_PAGE_SIZE')) || 50;
    this.maxPages = Number(config.get('ETENDER_SYNC_MAX_PAGES')) || 40;
    this.cron = config.get<string>('ETENDER_SYNC_CRON') || '0 20 * * *'; // daily 20:00
    this.tz = config.get<string>('ETENDER_SYNC_TZ') || 'Asia/Tashkent';
    this.enabled = String(config.get('ETENDER_SYNC_ENABLED') ?? 'true') !== 'false';
    this.listCacheTtlMs = Number(config.get('ETENDER_LIST_CACHE_TTL_MS')) || 300_000; // 5 min
  }

  onModuleInit() {
    if (!this.enabled) {
      this.log.log('e-tender sync disabled (ETENDER_SYNC_ENABLED=false)');
      return;
    }
    const job = CronJob.from({
      cronTime: this.cron,
      timeZone: this.tz,
      onTick: () => void this.syncAll('cron'),
      start: true,
    });
    this.scheduler.addCronJob(CRON_NAME, job as any);
    this.log.log(`e-tender daily sync scheduled: cron "${this.cron}" (${this.tz}) for types [${this.typeIds.join(', ')}]`);

    // On a fresh deploy the cache is empty and the next 20:00 could be far off —
    // populate once shortly after boot if there's nothing yet.
    this.booting = setTimeout(() => {
      void (async () => {
        try {
          const count = await this.prisma.etenderLot.count();
          if (count === 0) {
            this.log.log('e-tender cache empty on boot — running initial sync');
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

  // Sync every configured type. Overlap-guarded so a slow run can't stack.
  async syncAll(trigger = 'manual'): Promise<{ ran: boolean; results: unknown[] }> {
    if (this.running) {
      this.log.warn(`sync skipped (${trigger}) — previous run still in progress`);
      return { ran: false, results: [] };
    }
    this.running = true;
    const results: unknown[] = [];
    try {
      for (const typeId of this.typeIds) {
        results.push(await this.syncType(typeId, trigger));
      }
    } finally {
      this.running = false;
      this.listCache.clear(); // fresh data → drop cached read responses
    }
    return { ran: true, results };
  }

  // Pull all lots for one typeId, upsert them, mark vanished/expired ones inactive,
  // and record a sync-log row whatever the outcome.
  async syncType(typeId: number, trigger = 'manual') {
    const startedAt = new Date();
    let fetched = 0;
    let upserted = 0;
    let deactivated = 0;
    let total: number | null = null;
    try {
      const { lots, total: t } = await this.adapter.fetchAllLots(typeId, this.pageSize, this.maxPages);
      total = t;
      fetched = lots.length;
      for (const lot of lots) {
        await this.upsertLot(lot);
        upserted++;
      }
      // "Only active": the upstream getLots/TradeList feed is itself the open-lots
      // feed (closed lots live behind separate getDeals/getFails endpoints), so a
      // lot is active exactly while it stays in the feed. Two ways it leaves:
      //   1) it vanishes from the feed, or 2) its bidding deadline (endDate) passes.
      const seen = lots.map((l) => l.externalId);
      const now = new Date();
      const gone = await this.prisma.etenderLot.updateMany({
        where: {
          typeId,
          active: true,
          OR: [{ externalId: { notIn: seen.length ? seen : [-1] } }, { endDate: { lt: now } }],
        },
        data: { active: false },
      });
      deactivated = gone.count;

      const logRow = await this.prisma.etenderSyncLog.create({
        data: {
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
      this.log.log(`sync type=${typeId} (${trigger}): fetched=${fetched} upserted=${upserted} deactivated=${deactivated} total=${total}`);
      return logRow;
    } catch (e) {
      const message = (e as Error)?.message || 'unknown error';
      const logRow = await this.prisma.etenderSyncLog.create({
        data: {
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
      this.log.error(`sync type=${typeId} (${trigger}) failed: ${message}`);
      return logRow;
    }
  }

  private async upsertLot(lot: NormalizedEtenderLot) {
    const data = {
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
      where: { externalId: lot.externalId },
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
    if (q.typeId !== undefined) where.typeId = q.typeId;
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
    const [data, total] = await this.prisma.$transaction([
      this.prisma.etenderLot.findMany({
        where,
        orderBy: [{ endDate: 'desc' }, { syncedAt: 'desc' }],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.etenderLot.count({ where }),
    ]);
    const result = paginate(data, total, q.page, q.limit);
    this.listCache.set(key, { at: Date.now(), data: result });
    return result;
  }

  getLot(externalId: number) {
    return this.prisma.etenderLot.findUnique({ where: { externalId } });
  }

  recentSyncLogs(limit = 50) {
    return this.prisma.etenderSyncLog.findMany({ orderBy: { startedAt: 'desc' }, take: limit });
  }
}
