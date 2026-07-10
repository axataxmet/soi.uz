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
  path: string;
  site: string;
  label: { ru: string; uz: string; en: string };
}

export const XARID_SOURCES: XaridSource[] = [
  {
    source: 'XARID_COMPETITION',
    kind: 'lot',
    path: '/Common/GetCompetitions',
    site: 'https://xarid.uzex.uz',
    label: { ru: 'Xarid — Конкурсы', uz: 'Xarid — Tanlovlar', en: 'Xarid — Competitions' },
  },
];

// ── Sources still blocked behind external auth (pending a live capture) ────────
// xarid.uzex.uz /not-completed-deals: endpoint not yet captured.
// xt-xarid.uz: api.mocrm.xt-xarid.uz responds "Access denied jwt" — requires a
//   token; server-side sync is only possible if a public/guest token exists.
export const PENDING_SOURCES = [
  { source: 'XARID_DEALS', site: 'https://xarid.uzex.uz', reason: 'not-completed-deals endpoint pending capture' },
  { source: 'XT_TENDER', site: 'https://xt-xarid.uz', reason: 'API is JWT-gated (Access denied jwt)' },
  { source: 'XT_SELECTION', site: 'https://xt-xarid.uz', reason: 'API is JWT-gated (Access denied jwt)' },
] as const;
