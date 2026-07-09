import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EtenderSyncStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { EtenderAdapter } from './etender.adapter';
import { EtenderLotQueryDto } from './dto/etender-query.dto';
import { NormalizedEtenderLot } from './etender.types';

// EtenderService — owns the sync loop, the PostgreSQL cache (etender_lots),
// and the sync log (etender_sync_logs). The public API reads only from the DB;
// only this service ever reaches the upstream, on a schedule.
@Injectable()
export class EtenderService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(EtenderService.name);
  private readonly typeIds: number[];
  private readonly pageSize: number;
  private readonly maxPages: number;
  private readonly intervalMs: number;
  private readonly enabled: boolean;
  private timer?: NodeJS.Timeout;
  private booting?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly adapter: EtenderAdapter,
    config: ConfigService,
  ) {
    this.typeIds = (config.get<string>('ETENDER_SYNC_TYPES') || '1,2')
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n));
    this.pageSize = Number(config.get('ETENDER_SYNC_PAGE_SIZE')) || 50;
    this.maxPages = Number(config.get('ETENDER_SYNC_MAX_PAGES')) || 40;
    this.intervalMs = (Number(config.get('ETENDER_SYNC_INTERVAL_MIN')) || 30) * 60_000;
    this.enabled = String(config.get('ETENDER_SYNC_ENABLED') ?? 'true') !== 'false';
  }

  onModuleInit() {
    if (!this.enabled) {
      this.log.log('e-tender sync disabled (ETENDER_SYNC_ENABLED=false)');
      return;
    }
    // First run shortly after boot (don't block startup), then on an interval.
    this.booting = setTimeout(() => void this.syncAll('boot'), 8_000);
    this.timer = setInterval(() => void this.syncAll('interval'), this.intervalMs);
    this.log.log(`e-tender sync scheduled every ${this.intervalMs / 60_000} min for types [${this.typeIds.join(', ')}]`);
  }

  onModuleDestroy() {
    if (this.booting) clearTimeout(this.booting);
    if (this.timer) clearInterval(this.timer);
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
    }
    return { ran: true, results };
  }

  // Pull all lots for one typeId, upsert them, mark vanished ones inactive,
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

  // ── Public reads (served from DB cache) ──────────────────────
  async listLots(q: EtenderLotQueryDto) {
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
    return paginate(data, total, q.page, q.limit);
  }

  getLot(externalId: number) {
    return this.prisma.etenderLot.findUnique({ where: { externalId } });
  }

  recentSyncLogs(limit = 50) {
    return this.prisma.etenderSyncLog.findMany({ orderBy: { startedAt: 'desc' }, take: limit });
  }
}
