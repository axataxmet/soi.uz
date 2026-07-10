// Shapes for the upstream UZEX e-tender API (etender.uzex.uz).
// Reverse-engineered from the site's Angular bundle: the /lots/:typeId/:regId
// route calls getLots() -> POST {ETENDER_API_BASE}/api/common/TradeList with a
// filter body, and receives a bare JSON array of lot rows.

// Filter body accepted by POST /api/common/TradeList.
// From/To are INCLUSIVE 1-based row-number bounds (not offset/limit):
// From=1,To=20 -> rows 1..20; From=21,To=40 -> rows 21..40.
export interface EtenderTradeFilter {
  TypeId: number;
  RegionId?: number;
  DistrictId?: number;
  StatusId?: number;
  CategoryId?: number;
  CurrencyId?: number;
  CustomerTin?: string;
  ProviderTin?: string;
  ProductCode?: string;
  Keyword?: string;
  PriceMin?: number;
  PriceMax?: number;
  DeadlineStart?: string;
  DeadlineEnd?: string;
  System_Id?: number;
  From: number;
  To: number;
}

// One row as returned by the upstream (snake_case). total_count is repeated on
// every row and is the grand total for the filter (used for pagination).
export interface RawEtenderLot {
  rn?: number;
  id: number;
  display_no?: string | number;
  total_count?: number;
  name?: string;
  start_date?: string | null;
  end_date?: string | null;
  clarific_date?: string | null;
  cost?: number | null;
  seller_id?: number | null;
  seller_name?: string | null;
  seller_tin?: string | null;
  region_name?: string | null;
  district_name?: string | null;
  category_name?: string | null;
  currency_id?: number | null;
  currency_name?: string | null;
  currency_code123?: string | null;
  currency_codeabc?: string | null;
  [k: string]: unknown;
}

export type SourceKind = 'lot' | 'news';

// Config for a UZEX TradeList-backed source (etender, biznesxarid — same API,
// distinguished by systemId/typeId). `site` builds the item link + Origin header.
export interface UzexTradeSource {
  source: string;
  kind: 'lot';
  systemId: number;
  typeId: number;
  site: string;
  label: { ru: string; uz: string; en: string };
}

// Our normalized shape, ready to persist to the etender_lots table. Multi-source:
// natural key is (source, externalId). Lot-only fields are nullable so news-type
// sources (gov.uz) fit the same shape.
export interface NormalizedEtenderLot {
  source: string;
  kind: SourceKind;
  externalId: string;
  sourceUrl: string | null;
  displayNo: string | null;
  typeId: number | null;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  clarificDate: Date | null;
  cost: string | null;
  sellerId: number | null;
  sellerName: string | null;
  sellerTin: string | null;
  regionName: string | null;
  districtName: string | null;
  categoryName: string | null;
  currencyId: number | null;
  currencyName: string | null;
  currencyCode: string | null;
  raw: unknown;
}
