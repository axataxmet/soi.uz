import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NormalizedEtenderLot } from './etender.types';
import { XaridSource } from './tender-sources';

// XaridAdapter — xarid.uzex.uz. Confirmed live & anonymous (no JWT). Two modes:
//   competitions: POST xarid-api-purchase.uzex.uz/Common/GetCompetitions
//     body { from, to } → [{ id, end_date_submitting_offers, customer_region_name,
//            category_name, cost, currency_name, total_count }]
//   deals: POST xarid-api-auction.uzex.uz/Common/GetNotCompletedLots
//     body { region_ids, display_on_shop, display_on_national, from, to }
//     → [{ lot_id, lot_display_no, lot_end_date, category_name, deal_cost,
//          customer_name, customer_region, currency_name, deal_status_name, total_count }]
// NOTE: GetNotCompletedLots rejects a short/empty User-Agent (500 "Missing
// User-Agent header"), so we always send a browser UA.
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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

  private body(cfg: XaridSource, from: number, to: number): Record<string, unknown> {
    if (cfg.mode === 'deals') return { region_ids: [], display_on_shop: 0, display_on_national: 0, from, to };
    return { from, to };
  }

  private async fetchPage(cfg: XaridSource, from: number, to: number): Promise<any[]> {
    const base = (cfg.apiBase || this.base).replace(/\/$/, '');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${base}${cfg.path}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Language: this.lang, 'User-Agent': BROWSER_UA, Origin: 'https://xarid.uzex.uz', Referer: 'https://xarid.uzex.uz/' },
        body: JSON.stringify(this.body(cfg, from, to)),
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
      const first = await this.fetchPage(cfg, 1, pageSize);
      const total = first.length ? Number(first[0].total_count ?? first.length) : 0;
      const byId = new Map<string, NormalizedEtenderLot>();
      for (const r of first) { const n = this.map(r, cfg); if (n) byId.set(n.externalId, n); }
      const pages = Math.min(maxPages, Math.max(1, Math.ceil(total / pageSize)));
      for (let p = 2; p <= pages; p++) {
        const rows = await this.fetchPage(cfg, (p - 1) * pageSize + 1, p * pageSize);
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
    return isNaN(d.getTime()) || d.getFullYear() < 2000 ? null : d;
  }

  private map(r: any, cfg: XaridSource): NormalizedEtenderLot | null {
    if (cfg.mode === 'deals') {
      const id = r.lot_id ?? r.deal_id;
      if (id === undefined || id === null) return null;
      return {
        source: cfg.source,
        kind: 'lot',
        externalId: String(id),
        sourceUrl: `${cfg.site}/not-completed-deals`,
        displayNo: r.lot_display_no != null ? String(r.lot_display_no) : String(id),
        typeId: null,
        name: (r.category_name && String(r.category_name).trim()) || `Лот № ${id}`,
        startDate: this.parseDate(r.lot_start_date),
        endDate: this.parseDate(r.lot_end_date),
        clarificDate: null,
        cost: r.deal_cost != null ? String(r.deal_cost) : r.start_cost != null ? String(r.start_cost) : null,
        sellerId: null,
        sellerName: r.customer_name ?? null,
        sellerTin: r.customer_inn ?? null,
        regionName: r.customer_region ?? null,
        districtName: null,
        categoryName: r.category_name ?? null,
        currencyId: null,
        currencyName: r.currency_name ?? null,
        currencyCode: r.currency_name ?? null,
        raw: r,
      };
    }
    // competitions
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
