/* UzMedEx — shared UI atoms */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  /* Те же начертания, что в наборе шапки (SI_ICONS в certificates.jsx):
     иначе на странице каталога в шапке было бы одно сердце, а на карточках
     товара — другое. heartFill повторяет контур heart, чтобы переключение
     «в избранном / не в избранном» не меняло форму знака. */
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18.5" cy="20" r="1.5"/><path d="M2.5 3h2.2l2.6 11.6a1.7 1.7 0 0 0 1.7 1.3h9.3a1.7 1.7 0 0 0 1.7-1.3L21.5 7H5.3"/>',
  heart: '<path d="M19 13.6c1.4-1.4 2.8-3 2.8-5.2A5.2 5.2 0 0 0 16.6 3c-1.7 0-2.9.5-4.6 2-1.7-1.5-2.9-2-4.6-2A5.2 5.2 0 0 0 2.2 8.4c0 2.2 1.4 3.8 2.8 5.2L12 20.6Z"/>',
  heartFill: '<path d="M19 13.6c1.4-1.4 2.8-3 2.8-5.2A5.2 5.2 0 0 0 16.6 3c-1.7 0-2.9.5-4.6 2-1.7-1.5-2.9-2-4.6-2A5.2 5.2 0 0 0 2.2 8.4c0 2.2 1.4 3.8 2.8 5.2L12 20.6Z" fill="currentColor" stroke="none"/>',
  compare: '<path d="M12 4v16M8.5 20h7"/><path d="M4 8h16"/><path d="m4 8-2.4 6.2a4.2 4.2 0 0 0 4.8 0Z"/><path d="m20 8 2.4 6.2a4.2 4.2 0 0 1-4.8 0Z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m6 15 6-6 6 6"/>',
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
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  /* Пузырь реплики с хвостом влево-вниз — знак плавающего виджета связи.
     Один замкнутый контур: дуга круга, затем хвост, затем замыкание. */
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8"/>',
  wrench: '<path d="M14.5 6a4 4 0 0 0-5.3 5.3L4 16.5 7.5 20l5.2-5.2A4 4 0 0 0 18 9.5L15.5 12 12 8.5 14.5 6Z"/>',
  doc: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
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

  /* Глифы разделов каталога — по одному на подкатегорию (см. SUBCAT_ICON в
     catalog.jsx). Рисуются в той же манере, что и набор выше: сетка 24×24,
     только обводка, никаких заливок, чтобы цвет наследовался от карточки. */
  stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M4.5 3h3M12.5 3h3"/><path d="M10 12v2.5a4.5 4.5 0 0 0 9 0V13"/><circle cx="19" cy="11" r="2"/>',
  venus: '<circle cx="12" cy="9" r="5.5"/><path d="M12 14.5V21M9 18h6"/>',
  lungs: '<path d="M12 3.2v8.3"/><path d="M9.4 7.2h5.2"/><path d="M9.8 11.5c0-1.2-1-2.1-2.2-2.1-1.7 0-2.7 1.5-3.1 3.4-.4 2-.8 4.2-.8 5.6 0 1.6 1 2.5 2.5 2.5 2 0 3.6-1.7 3.6-3.8v-5.6Z"/><path d="M14.2 11.5c0-1.2 1-2.1 2.2-2.1 1.7 0 2.7 1.5 3.1 3.4.4 2 .8 4.2.8 5.6 0 1.6-1 2.5-2.5 2.5-2 0-3.6-1.7-3.6-3.8v-5.6Z"/>',
  face: '<circle cx="11" cy="12.5" r="7.5"/><path d="M8.5 11h.01M13.5 11h.01"/><path d="M8.5 15s1 1.6 2.5 1.6 2.5-1.6 2.5-1.6"/><path d="M20 3v3.5M18.2 4.7h3.6"/>',
  flask: '<path d="M9.5 3h5M11 3v6.2l-5.2 9A2 2 0 0 0 7.5 21h9a2 2 0 0 0 1.7-2.8L13 9.2V3"/><path d="M8.6 15h6.8"/>',
  /* Кувез, а не младенец и не бутылочка: лицо ребёнка в контурной сетке 24×24
     неотличимо от глифа косметологии, а бутылочка — от лабораторной колбы,
     которая стоит в соседней карточке. */
  incubator: '<path d="M2.8 20.2h18.4"/><path d="M4.8 20.2v-6.2h14.4v6.2"/><path d="M6.2 14a5.8 5.8 0 0 1 11.6 0"/><path d="M9.4 20.2v-3.5h5.2v3.5"/>',
  /* Позвоночник — самый узнаваемый глиф ортопедии; кость в один контур на этом
     размере читается как звено цепи. */
  spine: '<path d="M12 2.8v18.4"/><path d="M8.8 4.6h6.4M8.2 8.2h7.6M8 11.8h8M8.2 15.4h7.6M8.8 19h6.4"/>',
  blood: '<path d="M12 3.5s6 6.4 6 10.3a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z"/><path d="M12 10.5v5M9.5 13h5"/>',
  ambulance: '<path d="M2.5 7h11.5v9H2.5z"/><path d="M14 10.5h3.6l3.4 3.4V16H14z"/><circle cx="7" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/><path d="M8.2 9.4v3.4M6.5 11.1h3.4"/>',
  cabinet: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M4 12h16"/><path d="M10 7.8h4M10 16.2h4"/>',
  scissors: '<circle cx="6" cy="6.2" r="2.4"/><circle cx="6" cy="17.8" r="2.4"/><path d="M8 7.6 19.5 18M8 16.4 19.5 6"/>',
  magnifierPlus: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m19.8 19.8-4.7-4.7"/><path d="M10.5 8v5M8 10.5h5"/>',
  plaster: '<rect x="2.2" y="8" width="19.6" height="8" rx="4"/><path d="M8.2 8v8M15.8 8v8"/><path d="M11 11.2h.01M13 11.2h.01M11 13.4h.01M13 13.4h.01"/>',
  mask: '<path d="M4 9.5v3.2a8 8 0 0 0 16 0V9.5"/><path d="M4 9.5c0-1.1 2.2-2 8-2s8 .9 8 2"/><path d="M1.8 10.6H4M20 10.6h2.2"/><path d="M7.5 12.2h9M7.5 15h9"/>',
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
  if (n == null || isNaN(n)) return ""; // \u0442\u043E\u0432\u0430\u0440\u044B \u00AB\u0446\u0435\u043D\u0430 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443\u00BB \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0441 price=null
  return n.toLocaleString("ru-RU").replace(/,/g, " ").replace(/\u00A0/g, " ");
}

// 3-language picker: en falls back to ru when missing
function tri(lang, ru, uz, en) {
  return lang === "uz" ? (uz != null ? uz : ru) : lang === "en" ? (en != null ? en : ru) : ru;
}

// hue per category for placeholder tint
/* Оттенки заглушек — в синей гамме фирменного стиля: разделы различимы между
   собой, но не выпадают из палитры. */
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
  /* Категория без своего оттенка получает стабильный, выведенный из её id, но
     в пределах синего сектора 188…236 — иначе новый раздел мог бы выпасть в
     произвольный цвет мимо палитры. */
  const hashHue = (s) => { let h = 0; for (let i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) % 48; return 188 + h; };
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
  if (value == null || isNaN(value)) {
    // товар с priceOnRequest (price=null в API) — показываем «Цена по запросу»
    return (
      <div className={"price price-" + size}>
        <div className="price-now" style={{ fontSize: "0.9em" }}>{t.price_on_request || "Цена по запросу"}</div>
      </div>
    );
  }
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
          <span className="cb2b-it" style={{ color: hasDocs ? "var(--success,var(--success))" : "var(--slate-500)" }}>
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

/* Карточка товара в раскладке medcomp: артикул и «сравнить» сверху, фото,
   строка наличия, название в две строки, цена, кнопка «Купить» во всю ширину.
   Отдельный компонент, а не вариант ProductCard: у того другой порядок блоков
   (чипы поверх фото, артикул с наличием одной строкой под фото, блок сроков и
   документов, две кнопки в подвале), и переставлять его CSS-ом пришлось бы
   через order — а он живёт на главной, в корзине, у брендов и в сравнении. */
function ProductTile({ product, t, lang, store, onOpen }) {
  const p = product;
  const inCart = store.cart.some((c) => c.id === p.id);
  const inCmp = store.compare.includes(p.id);
  const name = tri(lang, p.ru, p.uz, p.en);
  const stockTxt = p.stock === "order" ? t.on_order : p.stock === "preorder" ? t.preorder : t.in_stock;
  return (
    <article className="ptile">
      <div className="ptile-top">
        <span className="ptile-sku mono">{t.sku} {p.sku}</span>
        <button className={"ptile-cmp " + (inCmp ? "on" : "")} title={t.add_compare}
          onClick={(e) => { e.stopPropagation(); store.toggleCompare(p.id); }}>
          <Icon name="compare" size={16} />
        </button>
      </div>
      <div className="ptile-media" onClick={() => onOpen(p)}>
        <ProductPlaceholder product={p} t={t} lang={lang} />
      </div>
      <div className={"ptile-stock stk-" + (p.stock || "in")}>{stockTxt}</div>
      <h3 className="ptile-name" onClick={() => onOpen(p)}>{name}</h3>
      <div className="ptile-price"><Price value={p.price} old={p.old} t={t} size="sm" /></div>
      <button className={"ptile-buy " + (inCart ? "added" : "")}
        onClick={(e) => { e.stopPropagation(); store.addToCart(p.id, 1); }}>
        {inCart ? t.in_cart : t.buy}
      </button>
    </article>
  );
}

/* Compact single-line row for a category listing — артикул, наличие, название,
   цена, «Купить», no photo. ProductCard (the tile with the picture, badges and
   KP button) stays as it was everywhere else; this is scoped to the catalog
   listing page only, once a subcategory has been picked. */
/* Строка списка на странице товарной группы: снимок, артикул, наличие,
   название, затем цена, счётчик количества и «Купить» — раскладка референса,
   утверждённая заказчиком. Количество живёт в самой строке, поэтому в корзину
   уходит выбранное число, а не единица. */
function ProductRow({ product, t, lang, store, onOpen }) {
  const p = product;
  // React.useState напрямую: ui-atoms грузится раньше файлов, которые
  // раскладывают хуки в глобальные имена, и своей деструктуризации не имеет.
  const [qty, setQty] = React.useState(1);
  const inCart = store.cart.some((c) => c.id === p.id);
  const name = tri(lang, p.ru, p.uz, p.en);
  const stop = (e) => e.stopPropagation();
  return (
    <article className="prow" onClick={() => onOpen(p)}>
      {/* Левая колонка: артикул над снимком — так в референсе, и так он не
          конкурирует с названием за первую строку описания. */}
      <div className="prow-left">
        <span className="prow-sku mono">{t.sku} {p.sku}</span>
        <div className="prow-media">
          {p.img ? <img src={p.img} alt="" loading="lazy" />
                 : <ProductPlaceholder product={p} t={t} lang={lang} />}
        </div>
      </div>
      <div className="prow-main">
        <h3 className="prow-name">{name}</h3>
      </div>
      {/* Правая колонка сверху вниз: наличие, количество, цена, «Купить». */}
      <div className="prow-buybox" onClick={stop}>
        <StockTag stock={p.stock} t={t} />
        <QtyStepper value={qty} onChange={setQty} size="sm" />
        <div className="prow-price"><Price value={p.price} old={p.old} t={t} size="sm" /></div>
        <button className={"prow-buy " + (inCart ? "added" : "")}
          onClick={() => store.addToCart(p.id, qty)}>
          <Icon name={inCart ? "check" : "cart"} size={16} />
          <span>{inCart ? t.in_cart : t.buy}</span>
        </button>
      </div>
    </article>
  );
}

Object.assign(window, {
  Icon, ICONS, fmtPrice, tri, ProductPlaceholder, brandName,
  StockTag, Badge, QtyStepper, Price, ProductCard, ProductRow, ProductTile, CAT_HUE,
});
