/* UzMedEx — shared UI atoms */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  cart: '<path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6.5"/><circle cx="9.5" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/>',
  heart: '<path d="M12 21C11 20 4 15.5 4 9.5C4 6.5 6 4 9 4C10.5 4 11.5 4.8 12 6C12.5 4.8 13.5 4 15 4C18 4 20 6.5 20 9.5C20 15.5 13 20 12 21Z"/>',
  heartFill: '<path d="M12 21C11 20 4 15.5 4 9.5C4 6.5 6 4 9 4C10.5 4 11.5 4.8 12 6C12.5 4.8 13.5 4 15 4C18 4 20 6.5 20 9.5C20 15.5 13 20 12 21Z" fill="currentColor" stroke="none"/>',
  compare: '<rect x="2" y="5" width="7" height="14" rx="1.5"/><rect x="15" y="5" width="7" height="14" rx="1.5"/><path d="M9 12h6M11 10l-2 2 2 2M13 10l2 2-2 2"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  truck: '<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.2 2.8 7.5 7 9 4.2-1.5 7-4.8 7-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M6 3h3l1.5 5-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2L20 19v3a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8Z"/>',
  star: '<path d="m12 4 2.3 4.8 5.2.7-3.8 3.6 1 5.1L12 15.8 7.3 18.2l1-5.1L4.5 9.5l5.2-.7Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8"/>',
  wrench: '<path d="M14.5 6a4 4 0 0 0-5.3 5.3L4 16.5 7.5 20l5.2-5.2A4 4 0 0 0 18 9.5L15.5 12 12 8.5 14.5 6Z"/>',
  doc: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-4 4 4 4V8Z"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  // category glyphs
  pulse: '<path d="M3 12h4l2-5 3 10 2.5-7 1.5 2H21"/>',
  scalpel: '<path d="M4 20 14 10M14 10l5-5a2.5 2.5 0 0 0-3.5-3.5L10 7l4 3ZM4 20l1.5-4 3 .5.5 3Z"/>',
  'shield-cross': '<path d="M12 3 5 6v5c0 4.2 2.8 7.5 7 9 4.2-1.5 7-4.8 7-9V6Z"/><path d="M12 8v6M9 11h6"/>',
  wave: '<path d="M3 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 4 4 4"/>',
  'cross-pulse': '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>',
  bed: '<path d="M3 18v-7h13a4 4 0 0 1 4 4v3M3 18v-8M21 18v-3M3 14h18M8 11V9h4v2"/>',
  eye: '<circle cx="12" cy="12" r="3.5"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>',
};

function Icon({ name, size = 20, sw = 1.7, className = "", style = {} }) {
  const d = ICONS[name] || "";
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
      strokeLinejoin="round" style={style} dangerouslySetInnerHTML={{ __html: d }} />
  );
}

function fmtPrice(n) {
  return n.toLocaleString("ru-RU").replace(/,/g, " ").replace(/\u00A0/g, " ");
}

// 3-language picker: en falls back to ru when missing
function tri(lang, ru, uz, en) {
  return lang === "uz" ? (uz != null ? uz : ru) : lang === "en" ? (en != null ? en : ru) : ru;
}

// hue per category for placeholder tint
const CAT_HUE = {
  diagnostics: 210, surgery: 198, sterilization: 188,
  physio: 222, emergency: 232, furniture: 204,
};

function ProductPlaceholder({ product, t, lang, big = false }) {
  const cat = product.cat;
  // resolve the (possibly normalized) category so admin-added products get
  // a proper tint, glyph and type label even with new-model IDs (e.g. "C01").
  const catObj = (window.DATA && window.DATA.CATEGORIES || []).find((c) => c.id === cat);
  // hue: known legacy categories use the curated palette; everything else gets
  // a stable hue derived from the category id (so categories stay distinct).
  const hashHue = (s) => { let h = 0; for (let i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };
  const hue = CAT_HUE[cat] != null ? CAT_HUE[cat] : hashHue(cat || "x");
  // glyph: explicit product glyph → category icon → pulse fallback
  const glyph = (product.glyph && product.glyph in ICONS) ? product.glyph
    : (catObj && catObj.icon && catObj.icon in ICONS) ? catObj.icon
    : "pulse";
  // type label: explicit short label → model → category name
  const catName = catObj ? tri(lang, catObj.ru, catObj.uz, catObj.en) : "";
  const label = (product.tr != null && (product.tr || product.tu || product.te))
    ? tri(lang, product.tr, product.tu, product.te)
    : (product.model || catName || "");
  const bg = `linear-gradient(150deg, hsl(${hue} 46% 96%) 0%, hsl(${hue + 8} 40% 91%) 60%, hsl(${hue + 14} 38% 88%) 100%)`;
  // real product photo if provided, otherwise branded technical graphic
  if (product.img) {
    return (
      <div className={"ph ph-photo " + (big ? "ph-big" : "")} style={{ background: "#fff" }}>
        <img src={product.img} alt={tri(lang, product.ru, product.uz, product.en)} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={"ph " + (big ? "ph-big" : "")} style={{ background: bg }}>
      <div className="ph-grid" />
      <div className="ph-glyph" style={{ color: `hsl(${hue} 55% 42% / .9)` }}>
        <Icon name={glyph} size={big ? 120 : 64} sw={1.1} />
      </div>
      <div className="ph-meta">
        <span className="ph-brand">{brandName(product.brand)}</span>
        {label && <span className="ph-type mono">{label}</span>}
      </div>
    </div>
  );
}

function brandName(id) {
  const b = (window.DATA.BRANDS || []).find((x) => x.id === id);
  return b ? b.name : id;
}

function StockTag({ stock, t, dot = true }) {
  const map = {
    in: { cls: "stk-in", txt: t.in_stock },
    order: { cls: "stk-order", txt: t.on_order },
    preorder: { cls: "stk-pre", txt: t.preorder },
  };
  const s = map[stock] || map.in;
  return (
    <span className={"stk " + s.cls}>
      {dot && <span className="stk-dot" />}
      {s.txt}
    </span>
  );
}

function Badge({ kind, t }) {
  if (!kind) return null;
  const map = {
    hit: { cls: "bdg-hit", txt: lang_badge(t, "hit") },
    new: { cls: "bdg-new", txt: lang_badge(t, "new") },
    sale: { cls: "bdg-sale", txt: lang_badge(t, "sale") },
  };
  const b = map[kind];
  if (!b) return null;
  return <span className={"bdg " + b.cls}>{b.txt}</span>;
}
function lang_badge(t, k) {
  const c = t.code;
  if (k === "hit") return c === "UZ" ? "Hit" : c === "EN" ? "Top" : "Хит";
  if (k === "new") return c === "UZ" ? "Yangi" : c === "EN" ? "New" : "Новинка";
  if (k === "sale") return c === "UZ" ? "Aksiya" : c === "EN" ? "Sale" : "Акция";
  return "";
}

function QtyStepper({ value, onChange, size = "md" }) {
  return (
    <div className={"qty qty-" + size}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="-">
        <Icon name="minus" size={16} />
      </button>
      <input type="text" value={value} onChange={(e) => {
        const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
        onChange(isNaN(v) ? 1 : Math.max(1, v));
      }} />
      <button type="button" onClick={() => onChange(value + 1)} aria-label="+">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

function Price({ value, old, t, size = "md" }) {
  return (
    <div className={"price price-" + size}>
      <div className="price-now">
        {fmtPrice(value)} <span className="price-cur">{t.currency}</span>
      </div>
      {old && <div className="price-old">{fmtPrice(old)} {t.currency}</div>}
    </div>
  );
}

function ProductCard({ product, t, lang, store, onOpen }) {
  const p = product;
  const inCart = store.cart.some((c) => c.id === p.id);
  const inWish = store.wishlist.includes(p.id);
  const inCmp = store.compare.includes(p.id);
  const name = tri(lang, p.ru, p.uz, p.en);
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const delivery = p.stock === "in" ? lv("1–2 дня", "1–2 kun", "1–2 days")
    : p.stock === "order" ? lv("5–10 дней", "5–10 kun", "5–10 days")
    : lv("по запросу", "so'rov bo'yicha", "on request");
  const hasDocs = p.stock === "in" || p.badge === "hit";
  return (
    <article className="card">
      <div className="card-badges">
        <Badge kind={p.badge} t={t} />
      </div>
      <div className="card-tools">
        <button className={"tool " + (inWish ? "on" : "")} title={t.wishlist}
          onClick={(e) => { e.stopPropagation(); store.toggleWish(p.id); }}>
          <Icon name={inWish ? "heartFill" : "heart"} size={18} />
        </button>
        <button className={"tool " + (inCmp ? "on" : "")} title={t.add_compare}
          onClick={(e) => { e.stopPropagation(); store.toggleCompare(p.id); }}>
          <Icon name="compare" size={18} />
        </button>
      </div>
      <div className="card-media" onClick={() => onOpen(p)}>
        <ProductPlaceholder product={p} t={t} lang={lang} />
        <button className="qv-btn"
          onClick={(e) => { e.stopPropagation(); window.__openQuickView && window.__openQuickView(p); }}>
          <Icon name="eye" size={15} />
          <span>{lang==="uz"?"Tez ko\u02bbish":lang==="en"?"Quick view":"\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440"}</span>
        </button>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="card-sku mono">{t.sku} {p.sku}</span>
          <StockTag stock={p.stock} t={t} />
        </div>
        <h3 className="card-title" onClick={() => onOpen(p)}>{name}</h3>
        <div className="card-b2b">
          <span className="cb2b-it"><Icon name="truck" size={14} />{delivery}</span>
          <span className="cb2b-it" style={{ color: hasDocs ? "var(--success,#0f9960)" : "var(--slate-500)" }}>
            <Icon name={hasDocs ? "check" : "doc"} size={14} />
            {hasDocs ? lv("Документы", "Hujjatlar", "Documents") : lv("Док. по запросу", "So'rov bo'yicha", "Docs on request")}
          </span>
        </div>
        <div className="card-foot">
          <Price value={p.price} old={p.old} t={t} size="sm" />
          <div className="card-foot-btns">
            <button className="btn-kp" title={lv("Получить КП", "Taklif olish", "Get a quote")}
              onClick={(e) => { e.stopPropagation(); window.__openQuote && window.__openQuote(p); }}>
              <Icon name="doc" size={16} /><span>{lv("КП", "Taklif", "Quote")}</span>
            </button>
            <button className={"btn-buy " + (inCart ? "added" : "")}
              onClick={() => store.addToCart(p.id, 1)}>
              <Icon name={inCart ? "check" : "cart"} size={18} />
              <span>{inCart ? t.in_cart : t.buy}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, {
  Icon, ICONS, fmtPrice, tri, ProductPlaceholder, brandName,
  StockTag, Badge, QtyStepper, Price, ProductCard, CAT_HUE,
});
