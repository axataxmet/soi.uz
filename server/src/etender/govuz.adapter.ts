import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NormalizedEtenderLot } from './etender.types';
import { GovUzSource } from './tender-sources';

// GovUzAdapter — pulls UzMedImpex procurement NEWS from gov.uz. The front-end is
// Next.js fed by a Yii2 REST API at api-portal.gov.uz; the exact list route needs
// a live capture, so this adapter is activated by ETENDER_GOVUZ_NEWS_API — a URL
// template with {authority}/{category} placeholders, e.g.
//   https://api-portal.gov.uz/api/v1/<route>?authority={authority}&category={category}&per-page=30
// Until it's set, gov.uz sources are skipped cleanly (logged, no error). The
// response mapping is defensive so it tolerates the usual Yii2 shapes.
@Injectable()
export class GovUzAdapter {
  private readonly log = new Logger(GovUzAdapter.name);
  private readonly apiTemplate: string;
  private readonly timeoutMs: number;
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    this.apiTemplate = (config.get<string>('ETENDER_GOVUZ_NEWS_API') || '').trim();
    this.timeoutMs = Number(config.get('ETENDER_HTTP_TIMEOUT_MS')) || 25_000;
    this.enabled = !!this.apiTemplate;
  }

  async fetch(cfg: GovUzSource): Promise<NormalizedEtenderLot[]> {
    if (!this.enabled) {
      this.log.warn(`gov.uz source ${cfg.source} skipped — set ETENDER_GOVUZ_NEWS_API to enable`);
      return [];
    }
    const url = this.apiTemplate
      .replace('{authority}', encodeURIComponent(cfg.authority))
      .replace('{category}', encodeURIComponent(cfg.categorySlug));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`gov.uz HTTP ${res.status}`);
      const data = await res.json();
      const items = this.extractItems(data);
      return items.map((it) => this.mapItem(it, cfg)).filter((x): x is NormalizedEtenderLot => !!x);
    } catch (e) {
      this.log.warn(`gov.uz fetch failed for ${cfg.source}: ${(e as Error).message}`);
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  // Yii2 REST responses come as an array, or { items|data|result: [...] }.
  private extractItems(data: any): any[] {
    if (Array.isArray(data)) return data;
    for (const k of ['items', 'data', 'result', 'list', 'news']) {
      if (Array.isArray(data?.[k])) return data[k];
      if (Array.isArray(data?.[k]?.items)) return data[k].items;
    }
    return [];
  }

  private mapItem(it: any, cfg: GovUzSource): NormalizedEtenderLot | null {
    const id = it.id ?? it.code ?? it.slug ?? it.news_code ?? it.uuid;
    const title = it.title ?? it.name ?? it.header ?? it.subject;
    if (id === undefined || id === null || !title) return null;
    const dateRaw = it.published_at ?? it.publish_date ?? it.date ?? it.created_at ?? it.updated_at ?? null;
    const d = dateRaw ? new Date(dateRaw) : null;
    const code = it.code ?? it.slug ?? it.news_code ?? id;
    return {
      source: cfg.source,
      kind: 'news',
      externalId: String(id),
      sourceUrl: `${cfg.pageUrl}/${code}`,
      displayNo: null,
      typeId: null,
      name: String(title),
      startDate: d && !isNaN(d.getTime()) ? d : null,
      endDate: null,
      clarificDate: null,
      cost: null,
      sellerId: null,
      sellerName: 'UzMedImpex',
      sellerTin: null,
      regionName: null,
      districtName: null,
      categoryName: cfg.label.ru,
      currencyId: null,
      currencyName: null,
      currencyCode: null,
      raw: it,
    };
  }
}
