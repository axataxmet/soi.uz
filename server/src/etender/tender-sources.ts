import { UzexTradeSource } from './etender.types';

// ── Sources backed by the UZEX TradeList API (etender + biznesxarid) ──────────
// Same endpoint (apietender.uzex.uz/api/common/TradeList); a source is just a
// (systemId, typeId) pair. Confirmed live: System_Id=0 for etender (types 1,2);
// System_Id=1 for biznesxarid (currently returns 0 lots — platform is dormant,
// but the adapter is ready and will populate once it has open lots).
export const UZEX_SOURCES: UzexTradeSource[] = [
  {
    source: 'ETENDER_SELECTION',
    kind: 'lot',
    systemId: 0,
    typeId: 1,
    site: 'https://etender.uzex.uz',
    label: { ru: 'Etender — Отбор наилучшего предложения', uz: 'Etender — Eng yaxshi taklifni tanlash', en: 'Etender — Best-offer selection' },
  },
  {
    source: 'ETENDER_TENDER',
    kind: 'lot',
    systemId: 0,
    typeId: 2,
    site: 'https://etender.uzex.uz',
    label: { ru: 'Etender — Тендеры', uz: 'Etender — Tenderlar', en: 'Etender — Tenders' },
  },
  {
    source: 'BIZNESXARID',
    kind: 'lot',
    systemId: 1,
    typeId: 1,
    site: 'https://biznesxarid.uzex.uz',
    label: { ru: 'Biznesxarid — Тендеры и отборы', uz: 'Biznesxarid — Tender va tanlovlar', en: 'Biznesxarid — Tenders & selections' },
  },
];

// ── gov.uz / UzMedImpex news categories ──────────────────────────────────────
// gov.uz is a Next.js front-end fed by a Yii2 REST API at api-portal.gov.uz
// (authority "uzmedimpex" = id 128). The list route needs a live capture; once
// known, set ETENDER_GOVUZ_NEWS_API (see GovUzAdapter) and these light up.
export interface GovUzSource {
  source: string;
  kind: 'news';
  authority: string;
  categorySlug: string;
  pageUrl: string;
  label: { ru: string; uz: string; en: string };
}

export const GOVUZ_SOURCES: GovUzSource[] = [
  {
    source: 'UZMEDIMPEX_TENDER',
    kind: 'news',
    authority: 'uzmedimpex',
    categorySlug: 'tenderlar_',
    pageUrl: 'https://gov.uz/ru/uzmedimpex/news/tenderlar_',
    label: { ru: 'UzMedImpex — Тендеры', uz: 'UzMedImpex — Tenderlar', en: 'UzMedImpex — Tenders' },
  },
  {
    source: 'UZMEDIMPEX_SELECTION',
    kind: 'news',
    authority: 'uzmedimpex',
    categorySlug: 'eng-yaxshi-takliflarni-tanlab-olish',
    pageUrl: 'https://gov.uz/ru/uzmedimpex/news/eng-yaxshi-takliflarni-tanlab-olish',
    label: { ru: 'UzMedImpex — Отбор наилучших предложений', uz: 'UzMedImpex — Eng yaxshi takliflarni tanlash', en: 'UzMedImpex — Best-offer selection' },
  },
  {
    source: 'UZMEDIMPEX_MARKETING',
    kind: 'news',
    authority: 'uzmedimpex',
    categorySlug: 'marketing-tadqiqotlari',
    pageUrl: 'https://gov.uz/ru/uzmedimpex/news/marketing-tadqiqotlari',
    label: { ru: 'UzMedImpex — Маркетинговые исследования', uz: 'UzMedImpex — Marketing tadqiqotlari', en: 'UzMedImpex — Marketing research' },
  },
];

// ── xarid.uzex.uz (Электронная система государственных закупок) ────────────────
// Confirmed live & anonymous (2026-07-11): POST xarid-api-purchase.uzex.uz{path}
// with { from, to }. See XaridAdapter.
export interface XaridSource {
  source: string;
  kind: 'lot';
  mode: 'competitions' | 'deals';
  path: string;
  apiBase?: string; // host override (deals live on a different sub-API)
  maxPages?: number; // per-source page cap (deals report a huge total_count on a slow API)
  site: string;
  label: { ru: string; uz: string; en: string };
}

export const XARID_SOURCES: XaridSource[] = [
  {
    source: 'XARID_COMPETITION',
    kind: 'lot',
    mode: 'competitions',
    path: '/Common/GetCompetitions',
    site: 'https://xarid.uzex.uz',
    label: { ru: 'Xarid — Конкурсы', uz: 'Xarid — Tanlovlar', en: 'Xarid — Competitions' },
  },
  {
    source: 'XARID_DEALS',
    kind: 'lot',
    mode: 'deals',
    path: '/Common/GetNotCompletedLots',
    apiBase: 'https://xarid-api-auction.uzex.uz',
    maxPages: 4, // this API is slow and reports a huge total_count — only take the latest few pages
    site: 'https://xarid.uzex.uz',
    label: { ru: 'Xarid — Незавершённые сделки', uz: 'Xarid — Yakunlanmagan bitimlar', en: 'Xarid — Not-completed deals' },
  },
];

// ── xt-xarid.uz (Hayot Birja) ─────────────────────────────────────────────────
// Confirmed live & anonymous (2026-07-11) via JSON-RPC POST api.xt-xarid.uz/rpc
// (method "ref", ref_tender_public / ref_selection_public). The JWT wall was a
// different host (api.mocrm), not the public procedure lists. See XtXaridAdapter.
export interface XtSource {
  source: string;
  kind: 'lot';
  ref: string;
  pathSegment: string;
  site: string;
  label: { ru: string; uz: string; en: string };
}

export const XT_SOURCES: XtSource[] = [
  {
    source: 'XT_TENDER',
    kind: 'lot',
    ref: 'ref_tender_public',
    pathSegment: 'tender',
    site: 'https://xt-xarid.uz',
    label: { ru: 'XT-Xarid — Тендеры', uz: 'XT-Xarid — Tenderlar', en: 'XT-Xarid — Tenders' },
  },
  {
    source: 'XT_SELECTION',
    kind: 'lot',
    ref: 'ref_selection_public',
    pathSegment: 'selection',
    site: 'https://xt-xarid.uz',
    label: { ru: 'XT-Xarid — Отборы', uz: 'XT-Xarid — Tanlovlar', en: 'XT-Xarid — Selections' },
  },
];

// All requested sources are now wired. (Sub-systems of xarid's not-completed-deals
// beyond auction — shop/national — and etender's fail-list can be added later as
// extra XaridSource / UZEX entries if needed.)
export const PENDING_SOURCES = [] as const;
