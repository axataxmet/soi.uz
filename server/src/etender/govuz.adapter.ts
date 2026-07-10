import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NormalizedEtenderLot } from './etender.types';
import { GovUzSource } from './tender-sources';

// GovUzAdapter — pulls UzMedImpex procurement NEWS from gov.uz. The Next.js
// front-end is fed by a Yii2 REST API at api-portal.gov.uz. Confirmed live:
//   GET /authorities/news/category?code_name={category}
//   headers: { code: <authority>, language: <lang> }
//   → { data: [ { id, date, title, anons, category_title, activity_title, ... } ], total_page, ... }
// A news item's public page is /<lang>/<authority>/news/view/{id}.
@Injectable()
export class GovUzAdapter {
  private readonly log = new Logger(GovUzAdapter.name);
  private readonly base: string;
  private readonly lang: string;
  private readonly timeoutMs: number;
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    this.base = (config.get<string>('ETENDER_GOVUZ_API_BASE') || 'https://api-portal.gov.uz').replace(/\/$/, '');
    this.lang = config.get<string>('ETENDER_GOVUZ_LANG') || 'ru';
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.enabled = String(config.get('ETENDER_GOVUZ_ENABLED') ?? 'true') !== 'false';
  }

  async fetch(cfg: GovUzSource): Promise<NormalizedEtenderLot[]> {
    if (!this.enabled) {
      this.log.warn(`gov.uz source ${cfg.source} skipped (ETENDER_GOVUZ_ENABLED=false)`);
      return [];
    }
    const url = `${this.base}/authorities/news/category?code_name=${encodeURIComponent(cfg.categorySlug)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json', code: cfg.authority, language: this.lang },
      });
      if (!res.ok) throw new Error(`gov.uz HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data?.data) ? data.data : this.extractItems(data);
      return items.map((it: any) => this.mapItem(it, cfg)).filter((x: NormalizedEtenderLot | null): x is NormalizedEtenderLot => !!x);
    } catch (e) {
      this.log.warn(`gov.uz fetch failed for ${cfg.source}: ${(e as Error).message}`);
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  private extractItems(data: any): any[] {
    if (Array.isArray(data)) return data;
    for (const k of ['items', 'data', 'result', 'list', 'news']) {
      if (Array.isArray(data?.[k])) return data[k];
      if (Array.isArray(data?.[k]?.items)) return data[k].items;
    }
    return [];
  }

  // News detail page, e.g. https://gov.uz/ru/uzmedimpex/news/view/188579
  private detailUrl(cfg: GovUzSource, id: string | number): string {
    return cfg.pageUrl.replace(/\/[^/]+$/, `/view/${id}`);
  }

  private mapItem(it: any, cfg: GovUzSource): NormalizedEtenderLot | null {
    const id = it.id ?? it.code ?? it.slug ?? it.news_code;
    const title = it.title ?? it.name ?? it.header;
    if (id === undefined || id === null || !title) return null;
    const dateRaw = it.date ?? it.published_at ?? it.publish_date ?? it.created_at ?? null;
    const d = dateRaw ? new Date(String(dateRaw).replace(' ', 'T')) : null;
    return {
      source: cfg.source,
      kind: 'news',
      externalId: String(id),
      sourceUrl: this.detailUrl(cfg, id),
      displayNo: null,
      typeId: null,
      name: String(title).trim(),
      startDate: d && !isNaN(d.getTime()) ? d : null, // publication date
      endDate: null,
      clarificDate: null,
      cost: null,
      sellerId: null,
      sellerName: 'UzMedImpex',
      sellerTin: null,
      regionName: null,
      districtName: null,
      categoryName: it.category_title || cfg.label.ru,
      currencyId: null,
      currencyName: null,
      currencyCode: null,
      raw: it,
    };
  }
}
