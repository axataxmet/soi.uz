import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EtenderAdapter } from './etender.adapter';
import { FarmaSource } from './tender-sources';
import { NormalizedEtenderLot, RawEtenderLot, UzexTradeSource } from './etender.types';

/* FarmaAdapter — client for farma.uzex.uz, the medicines and medical-devices
   procurement platform.

   Its API is a different host and a different call shape from the rest of UZEX
   (POST api-farma.uzex.uz/ETenderCommon/GetList with {status_id, from, to},
   answering {status, data, message}), but the rows themselves are byte-for-byte
   the TradeList shape — same snake_case keys, same total_count paging. So the
   fetch lives here and the field mapping is delegated to EtenderAdapter rather
   than copied. */
@Injectable()
export class FarmaAdapter {
  private readonly log = new Logger(FarmaAdapter.name);
  private readonly base: string;
  private readonly timeoutMs: number;
  readonly enabled: boolean;

  constructor(
    config: ConfigService,
    private readonly etender: EtenderAdapter,
  ) {
    this.base = (config.get<string>('ETENDER_FARMA_API_BASE') || 'https://api-farma.uzex.uz').replace(/\/$/, '');
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.enabled = String(config.get('ETENDER_FARMA_ENABLED') ?? 'true') !== 'false';
  }

  private async fetchPage(cfg: FarmaSource, from: number, to: number): Promise<RawEtenderLot[]> {
    const url = `${this.base}/ETenderCommon/GetList`;
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
            Origin: cfg.site,
            Referer: cfg.site + '/',
            'User-Agent': 'Mozilla/5.0 (compatible; SoiTenderSync/1.0)',
          },
          body: JSON.stringify({ status_id: cfg.statusId, from, to }),
        });
        if (!res.ok) throw new Error(`upstream HTTP ${res.status}`);
        const data = await res.json();
        return Array.isArray(data?.data) ? (data.data as RawEtenderLot[]) : [];
      } catch (e) {
        lastErr = e;
        this.log.warn(`Farma GetList failed (attempt ${attempt + 1}) ${from}-${to}: ${(e as Error).message}`);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new ServiceUnavailableException(`Farma upstream unavailable: ${(lastErr as Error)?.message || 'unknown'}`);
  }

  /* EtenderAdapter.normalize is keyed off a UzexTradeSource; Farma has no
     System_Id/Type_Id of its own, so it borrows the fields that matter — the
     source id and the site the lot URL is built from. */
  private asTradeSource(cfg: FarmaSource): UzexTradeSource {
    return { source: cfg.source, kind: cfg.kind, systemId: -1, typeId: cfg.statusId, site: cfg.site, label: cfg.label };
  }

  async fetchLots(cfg: FarmaSource, page: number, pageSize: number): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const from = (page - 1) * pageSize + 1;
    const rows = await this.fetchPage(cfg, from, page * pageSize);
    const total = rows.length ? Number(rows[0].total_count ?? rows.length) : 0;
    const src = this.asTradeSource(cfg);
    return { lots: rows.map((r) => this.etender.normalize(r, src)), total };
  }

  async fetchAllLots(cfg: FarmaSource, pageSize: number, maxPages: number): Promise<{ lots: NormalizedEtenderLot[]; total: number }> {
    const first = await this.fetchLots(cfg, 1, pageSize);
    const all = [...first.lots];
    const pages = Math.min(Math.ceil(first.total / pageSize) || 1, maxPages);
    for (let p = 2; p <= pages; p++) {
      const next = await this.fetchLots(cfg, p, pageSize);
      if (!next.lots.length) break;
      all.push(...next.lots);
    }
    return { lots: all, total: first.total };
  }
}
