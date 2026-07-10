import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { NormalizedEtenderLot } from './etender.types';
import { XtSource } from './tender-sources';

// XtXaridAdapter — xt-xarid.uz (Hayot Birja). Confirmed live & anonymous
// (2026-07-11): the public procedure lists come from a JSON-RPC endpoint, NOT the
// JWT-gated api.mocrm host:
//   POST https://api.xt-xarid.uz/rpc
//   headers { Content-Type, X-DBRPC-Language, x-idempotency-key: <uuid> }
//   body { id, jsonrpc:"2.0", method:"ref", params:{ ref, op:"read", limit, offset, filters, fields } }
//   → { result: [ { id, name, status, totalcost, currency, close_at, lot_count, ... } ] }
// ref: ref_tender_public (tenders), ref_selection_public (selections).
const FIELDS = ['id', 'name', 'status', 'publicated_at', 'close_at', 'totalcost', 'currency', 'lot_count'];

@Injectable()
export class XtXaridAdapter {
  private readonly log = new Logger(XtXaridAdapter.name);
  private readonly base: string;
  private readonly lang: string;
  private readonly timeoutMs: number;
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    this.base = (config.get<string>('ETENDER_XT_API_BASE') || 'https://api.xt-xarid.uz').replace(/\/$/, '');
    this.lang = config.get<string>('ETENDER_XT_LANG') || 'ru';
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.enabled = String(config.get('ETENDER_XT_ENABLED') ?? 'true') !== 'false';
  }

  private async rpcRead(ref: string, limit: number, offset: number): Promise<any[]> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.base}/rpc`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-DBRPC-Language': this.lang,
          'x-idempotency-key': randomUUID(),
          Origin: 'https://xt-xarid.uz',
          Referer: 'https://xt-xarid.uz/',
        },
        body: JSON.stringify({ id: 1, jsonrpc: '2.0', method: 'ref', params: { ref, op: 'read', limit, offset, filters: {}, fields: FIELDS } }),
      });
      if (!res.ok) throw new Error(`xt-xarid HTTP ${res.status}`);
      const data = await res.json();
      if (data?.error) throw new Error(`xt-xarid RPC error: ${data.error.message || 'unknown'}`);
      return Array.isArray(data?.result) ? data.result : [];
    } finally {
      clearTimeout(timer);
    }
  }

  async fetch(cfg: XtSource, pageSize: number, maxPages: number): Promise<NormalizedEtenderLot[]> {
    if (!this.enabled) {
      this.log.warn(`xt-xarid source ${cfg.source} skipped (ETENDER_XT_ENABLED=false)`);
      return [];
    }
    try {
      const byId = new Map<string, NormalizedEtenderLot>();
      for (let page = 0; page < maxPages; page++) {
        const rows = await this.rpcRead(cfg.ref, pageSize, page * pageSize);
        if (!rows.length) break;
        for (const r of rows) { const n = this.map(r, cfg); if (n) byId.set(n.externalId, n); }
        if (rows.length < pageSize) break;
      }
      return [...byId.values()];
    } catch (e) {
      this.log.warn(`xt-xarid fetch failed for ${cfg.source}: ${(e as Error).message}`);
      throw e;
    }
  }

  private parseDate(v: unknown): Date | null {
    if (!v || typeof v !== 'string') return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  private map(r: any, cfg: XtSource): NormalizedEtenderLot | null {
    if (r.id === undefined || r.id === null) return null;
    const id = String(r.id);
    return {
      source: cfg.source,
      kind: 'lot',
      externalId: id,
      sourceUrl: `${cfg.site}/procedure/${cfg.pathSegment}/${id}`,
      displayNo: id,
      typeId: null,
      name: (r.name && String(r.name).trim()) || `${cfg.pathSegment} № ${id}`,
      startDate: this.parseDate(r.publicated_at),
      endDate: this.parseDate(r.close_at),
      clarificDate: null,
      cost: r.totalcost === null || r.totalcost === undefined ? null : String(r.totalcost),
      sellerId: null,
      sellerName: null,
      sellerTin: null,
      regionName: null,
      districtName: null,
      categoryName: null,
      currencyId: null,
      currencyName: r.currency ?? null,
      currencyCode: r.currency ?? null,
      raw: r,
    };
  }
}
