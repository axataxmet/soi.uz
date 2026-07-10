import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EtenderTradeFilter, NormalizedEtenderLot, RawEtenderLot, UzexTradeSource } from './etender.types';

// EtenderAdapter — client for the UZEX TradeList API that backs the etender and
// biznesxarid front-ends (both POST {apiBase}/api/common/TradeList; a source is
// just a (systemId, typeId) pair). Endpoint was found in the site bundles, so
// this is a JSON adapter (no HTML parsing). Handles timeout+retry, tolerates a
// bare array or { list: [...] }, maps snake_case rows to our normalized shape,
// and short-TTL caches identical requests.
interface CacheEntry {
  at: number;
  rows: RawEtenderLot[];
}

@Injectable()
export class EtenderAdapter {
  private readonly log = new Logger(EtenderAdapter.name);
  private readonly base: string;
  private readonly timeoutMs: number;
  private readonly cacheTtlMs: number;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(config: ConfigService) {
    this.base = (config.get<string>('ETENDER_API_BASE') || 'https://apietender.uzex.uz').replace(/\/$/, '');
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.cacheTtlMs = Number(config.get('ETENDER_FETCH_CACHE_TTL_MS')) || 60_000;
  }

  private async fetchPage(filter: EtenderTradeFilter, origin: string): Promise<RawEtenderLot[]> {
    const key = origin + '|' + JSON.stringify(filter);
    const hit = this.cache.get(key);
    if (hit && Date.now() - hit.at < this.cacheTtlMs) return hit.rows;

    const url = `${this.base}/api/common/TradeList`;
    let lastErr: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
      try {
        const res = await fetch(url, {
          method: 'POST',
          signal: ctrl.signal,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Origin: origin,
            Referer: origin + '/',
            'User-Agent': 'Mozilla/5.0 (compatible; SoiTenderSync/1.0)',
          },
          body: JSON.stringify(filter),
        });
        if (!res.ok) throw new Error(`upstream HTTP ${res.status}`);
        const data = await res.json();
        const rows: RawEtenderLot[] = Array.isArray(data) ? data : Array.isArray(data?.list) ? data.list : [];
        this.cache.set(key, { at: Date.now(), rows });
        return rows;
      } catch (e) {
        lastErr = e;
        this.log.warn(`TradeList fetch failed (attempt ${attempt + 1}) ${filter.System_Id}/${filter.TypeId}: ${(e as Error).message}`);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new ServiceUnavailableException(`UZEX upstream unavailable: ${(lastErr as Error)?.message || 'unknown'}`);
  }

  // One page for a source. page is 1-based; pageSize maps to inclusive From/To.
  async fetchLots(cfg: UzexTradeSource, page: number, pageSize: number): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const from = (page - 1) * pageSize + 1;
    const to = page * pageSize;
    const filter: EtenderTradeFilter = { System_Id: cfg.systemId, TypeId: cfg.typeId, From: from, To: to };
    const rows = await this.fetchPage(filter, cfg.site);
    const total = rows.length ? Number(rows[0].total_count ?? rows.length) : 0;
    return { lots: rows.map((r) => this.normalize(r, cfg)), total };
  }

  // Page through a source's whole result set (bounded by maxPages).
  async fetchAllLots(cfg: UzexTradeSource, pageSize: number, maxPages: number): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const first = await this.fetchLots(cfg, 1, pageSize);
    const total = first.total;
    const byId = new Map<string, NormalizedEtenderLot>();
    for (const l of first.lots) byId.set(l.externalId, l);
    const pages = Math.min(maxPages, Math.max(1, Math.ceil(total / pageSize)));
    for (let p = 2; p <= pages; p++) {
      const next = await this.fetchLots(cfg, p, pageSize);
      for (const l of next.lots) byId.set(l.externalId, l);
      if (!next.lots.length) break;
    }
    return { lots: [...byId.values()], total };
  }

  private parseDate(v: unknown): Date | null {
    if (!v || typeof v !== 'string') return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  private str(v: unknown): string | null {
    if (v === null || v === undefined || v === '') return null;
    return String(v);
  }
  private num(v: unknown): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }

  normalize(r: RawEtenderLot, cfg: UzexTradeSource): NormalizedEtenderLot {
    return {
      source: cfg.source,
      kind: 'lot',
      externalId: String(r.id),
      sourceUrl: `${cfg.site}/lot/${r.id}`,
      displayNo: this.str(r.display_no),
      typeId: cfg.typeId,
      name: this.str(r.name) ?? '',
      startDate: this.parseDate(r.start_date),
      endDate: this.parseDate(r.end_date),
      clarificDate: this.parseDate(r.clarific_date),
      cost: r.cost === null || r.cost === undefined ? null : String(r.cost),
      sellerId: this.num(r.seller_id),
      sellerName: this.str(r.seller_name),
      sellerTin: this.str(r.seller_tin),
      regionName: this.str(r.region_name),
      districtName: this.str(r.district_name),
      categoryName: this.str(r.category_name),
      currencyId: this.num(r.currency_id),
      currencyName: this.str(r.currency_name),
      currencyCode: this.str(r.currency_codeabc),
      raw: r,
    };
  }
}
