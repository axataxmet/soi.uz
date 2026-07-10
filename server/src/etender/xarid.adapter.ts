import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NormalizedEtenderLot } from './etender.types';
import { XaridSource } from './tender-sources';

// XaridAdapter — xarid.uzex.uz "Электронная система государственных закупок".
// Confirmed live (anonymous, no JWT):
//   POST https://xarid-api-purchase.uzex.uz/Common/GetCompetitions
//   header { Language: <lang> }, body { from, to } (inclusive row-number bounds,
//   like the etender TradeList) → bare array of rows with total_count on each.
// Row: { id, end_date_submitting_offers, customer_region_name, customer_district_name,
//        category_name, cost, currency_name, rn, total_count }. Item page:
//   /purchase/competition/detail/{id}.
@Injectable()
export class XaridAdapter {
  private readonly log = new Logger(XaridAdapter.name);
  private readonly base: string;
  private readonly lang: string;
  private readonly timeoutMs: number;
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    this.base = (config.get<string>('ETENDER_XARID_API_BASE') || 'https://xarid-api-purchase.uzex.uz').replace(/\/$/, '');
    this.lang = config.get<string>('ETENDER_XARID_LANG') || 'ru';
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.enabled = String(config.get('ETENDER_XARID_ENABLED') ?? 'true') !== 'false';
  }

  private async fetchPage(path: string, from: number, to: number): Promise<any[]> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.base}${path}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Language: this.lang, Origin: 'https://xarid.uzex.uz', Referer: 'https://xarid.uzex.uz/' },
        body: JSON.stringify({ from, to }),
      });
      if (!res.ok) throw new Error(`xarid HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.list) ? data.list : [];
    } finally {
      clearTimeout(timer);
    }
  }

  async fetch(cfg: XaridSource, pageSize: number, maxPages: number): Promise<NormalizedEtenderLot[]> {
    if (!this.enabled) {
      this.log.warn(`xarid source ${cfg.source} skipped (ETENDER_XARID_ENABLED=false)`);
      return [];
    }
    try {
      const first = await this.fetchPage(cfg.path, 1, pageSize);
      const total = first.length ? Number(first[0].total_count ?? first.length) : 0;
      const byId = new Map<string, NormalizedEtenderLot>();
      for (const r of first) { const n = this.map(r, cfg); if (n) byId.set(n.externalId, n); }
      const pages = Math.min(maxPages, Math.max(1, Math.ceil(total / pageSize)));
      for (let p = 2; p <= pages; p++) {
        const rows = await this.fetchPage(cfg.path, (p - 1) * pageSize + 1, p * pageSize);
        if (!rows.length) break;
        for (const r of rows) { const n = this.map(r, cfg); if (n) byId.set(n.externalId, n); }
      }
      return [...byId.values()];
    } catch (e) {
      this.log.warn(`xarid fetch failed for ${cfg.source}: ${(e as Error).message}`);
      throw e;
    }
  }

  private parseDate(v: unknown): Date | null {
    if (!v || typeof v !== 'string') return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private map(r: any, cfg: XaridSource): NormalizedEtenderLot | null {
    if (r.id === undefined || r.id === null) return null;
    const id = String(r.id);
    return {
      source: cfg.source,
      kind: 'lot',
      externalId: id,
      sourceUrl: `${cfg.site}/purchase/competition/detail/${id}`,
      displayNo: id,
      typeId: null,
      name: (r.category_name && String(r.category_name).trim()) || `Лот № ${id}`,
      startDate: null,
      endDate: this.parseDate(r.end_date_submitting_offers ?? r.end_date),
      clarificDate: null,
      cost: r.cost === null || r.cost === undefined ? null : String(r.cost),
      sellerId: null,
      sellerName: null,
      sellerTin: null,
      regionName: r.customer_region_name ?? null,
      districtName: r.customer_district_name ?? null,
      categoryName: r.category_name ?? null,
      currencyId: null,
      currencyName: r.currency_name ?? null,
      currencyCode: r.currency_name ?? null,
      raw: r,
    };
  }
}
