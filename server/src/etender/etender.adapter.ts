import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EtenderTradeFilter, NormalizedEtenderLot, RawEtenderLot } from './etender.types';

// EtenderAdapter — the only thing in the codebase that talks to the upstream
// UZEX e-tender API. Endpoint WAS found in the site bundle, so this is a JSON
// API adapter (no HTML parsing needed): POST /api/common/TradeList.
//
// Responsibilities: build the request, fetch with timeout+retry, tolerate the
// upstream returning either a bare array or a { list: [...] } wrapper, map
// snake_case rows to our normalized shape, and short-TTL cache identical
// requests so repeated syncs / retries don't hammer the upstream.

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

  private cacheKey(filter: EtenderTradeFilter): string {
    return JSON.stringify(filter);
  }

  // Raw POST to /api/common/TradeList with timeout + one retry, short-TTL cached.
  private async fetchPage(filter: EtenderTradeFilter): Promise<RawEtenderLot[]> {
    const key = this.cacheKey(filter);
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
            // Mimic the browser origin the API expects.
            Origin: 'https://etender.uzex.uz',
            Referer: 'https://etender.uzex.uz/',
            'User-Agent': 'Mozilla/5.0 (compatible; SoiEtenderSync/1.0)',
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
        this.log.warn(`TradeList fetch failed (attempt ${attempt + 1}) TypeId=${filter.TypeId}: ${(e as Error).message}`);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new ServiceUnavailableException(`e-tender upstream unavailable: ${(lastErr as Error)?.message || 'unknown'}`);
  }

  // Fetch a single page of normalized lots plus the upstream total_count.
  // page is 1-based; pageSize maps to inclusive From/To row-number bounds.
  async fetchLots(
    typeId: number,
    page: number,
    pageSize: number,
    extra: Partial<EtenderTradeFilter> = {},
  ): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const from = (page - 1) * pageSize + 1;
    const to = page * pageSize;
    const filter: EtenderTradeFilter = { System_Id: 0, ...extra, TypeId: typeId, From: from, To: to };
    const rows = await this.fetchPage(filter);
    const total = rows.length ? Number(rows[0].total_count ?? rows.length) : 0;
    return { lots: rows.map((r) => this.normalize(r, typeId)), total };
  }

  // Page through the whole result set for a typeId (bounded by maxPages).
  async fetchAllLots(
    typeId: number,
    pageSize: number,
    maxPages: number,
    extra: Partial<EtenderTradeFilter> = {},
  ): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const first = await this.fetchLots(typeId, 1, pageSize, extra);
    const total = first.total;
    const byId = new Map<number, NormalizedEtenderLot>();
    for (const l of first.lots) byId.set(l.externalId, l);
    const pages = Math.min(maxPages, Math.max(1, Math.ceil(total / pageSize)));
    for (let p = 2; p <= pages; p++) {
      const next = await this.fetchLots(typeId, p, pageSize, extra);
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

  normalize(r: RawEtenderLot, typeId: number): NormalizedEtenderLot {
    return {
      externalId: Number(r.id),
      displayNo: this.str(r.display_no),
      typeId,
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
