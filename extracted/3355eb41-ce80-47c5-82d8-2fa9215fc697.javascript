/* Sog'liq Industriyasi — header, search, mega-menu, nav */
const { useState, useEffect, useRef } = React;

const POPULAR_QUERIES = {
  ru: ["Аппарат ИВЛ", "Дефибриллятор", "Автоклав паровой", "УЗИ-сканер", "Монитор пациента", "Операционный стол"],
  uz: ["SLV apparati", "Defibrillyator", "Avtoklav", "UZI skaneri", "Bemor monitori", "Operatsiya stoli"],
  en: ["Ventilator", "Defibrillator", "Steam autoclave", "Ultrasound scanner", "Patient monitor", "Operating table"]
};

function SearchBar({ t, lang, query, setQuery, go }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    try {setHistory(JSON.parse(localStorage.getItem("uzmedex_searches") || "[]"));} catch (e) {}
  }, [open]);

  useEffect(() => {
    const handler = (e) => {if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveSearch = (q) => {
    const h = [q, ...history.filter((x) => x !== q)].slice(0, 5);
    localStorage.setItem("uzmedex_searches", JSON.stringify(h));
    setHistory(h);
  };
  const deleteHistory = (e, q) => {
    e.stopPropagation();
    const h = history.filter((x) => x !== q);
    localStorage.setItem("uzmedex_searches", JSON.stringify(h));
    setHistory(h);
  };

  const suggestions = query.length >= 2 ?
  (window.DATA?.PRODUCTS || []).filter((p) => (p.ru + " " + p.uz + " " + p.en + " " + p.sku).toLowerCase().includes(query.toLowerCase())).slice(0, 5) :
  [];

  const doSearch = (q) => {
    const term = q || query;
    if (!term.trim()) return;
    saveSearch(term);
    setQuery(term);
    setOpen(false);
    go("catalog", { q: term });
  };

  const popular = POPULAR_QUERIES[lang] || POPULAR_QUERIES.ru;
  const showHistory = history.length > 0 && !query;
  const showPopular = !query;
  const showSuggestions = suggestions.length > 0;
  const showDrop = open && (showHistory || showPopular || showSuggestions);
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  return (
    <div className="search-wrap" ref={wrapRef}>
      <form className="search" onSubmit={(e) => {e.preventDefault();doSearch();}} onFocus={() => setOpen(true)}>
        <Icon name="search" size={20} />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search_ph}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)} />
        <button type="submit" className="search-btn"><span>{t.search_btn}</span></button>
      </form>

      {showDrop &&
      <div className="search-drop">
          {showHistory &&
        <>
              <div className="sd-section"><Icon name="clock" size={13} />{lv("Последние запросы", "Soʻnggi qidiruvlar", "Recent searches")}</div>
              {history.map((h) =>
          <div key={h} className="sd-item" onClick={() => doSearch(h)}>
                  <span className="sdi-ic"><Icon name="clock" size={15} /></span>
                  <span className="sdi-name">{h}</span>
                  <button className="sdi-del" onClick={(e) => deleteHistory(e, h)}><Icon name="x" size={13} /></button>
                </div>
          )}
              <div className="sd-sep" />
            </>
        }
          {showPopular &&
        <>
              <div className="sd-section"><Icon name="spark" size={13} />{lv("Популярно", "Mashhur", "Popular")}</div>
              {popular.map((q) =>
          <div key={q} className="sd-item" onClick={() => doSearch(q)}>
                  <span className="sdi-ic"><Icon name="search" size={15} /></span>
                  <span className="sdi-name">{q}</span>
                </div>
          )}
            </>
        }
          {showSuggestions &&
        <>
              {!showPopular && <div className="sd-sep" />}
              <div className="sd-section"><Icon name="grid" size={13} />{lv("Товары", "Mahsulotlar", "Products")}</div>
              {suggestions.map((p) =>
          <div key={p.id} className="sd-item" onClick={() => {saveSearch(query);setOpen(false);go("product", { id: p.id });}}>
                  <span className="sdi-ic"><Icon name="pulse" size={15} /></span>
                  <span className="sdi-name">{(lang === "uz" ? p.uz : lang === "en" ? p.en || p.ru : p.ru).split(",")[0]}</span>
                  <span className="sdi-brand">{(window.DATA?.BRANDS || []).find((b) => b.id === p.brand)?.name}</span>
                </div>
          )}
            </>
        }
        </div>
      }
    </div>);

}

function UtilityBar({ t, lang, setLang, go, theme, toggleTheme }) {
  return (
    <div className="ubar">
      <div className="wrap">
        <div className="ubar-info">
          <Icon name="pin" size={15} />
          <span>{t.region}</span>
        </div>
        <div className="ubar-info delivery">
          <Icon name="truck" size={15} />
          <span>{t.delivery_all_uz}</span>
        </div>
        <div className="ubar-spacer" />
        <div className="ubar-links">
          <a onClick={() => go("info", { p: "about" })}>{t.about}</a>
          <a onClick={() => go("news", {})}>{lang === "uz" ? "Yangiliklar" : lang === "en" ? "News" : "Новости"}</a>
          <a onClick={() => go("tracking", {})}>{lang === "uz" ? "Ariza holati" : lang === "en" ? "Track order" : "Отслеживание"}</a>
          <a onClick={() => go("info", { p: "service" })}>{t.service_center}</a>
          <a className="ubar-tenders" onClick={() => go("tenders", {})}>
            {lang === "uz" ? "Tenderlar" : lang === "en" ? "Tenders" : "Тендеры"}
            <span className="ubar-badge">B2B/G</span>
          </a>
          <a onClick={() => go("info", { p: "suppliers" })}>{t.for_suppliers}</a>
          <a onClick={() => go("info", { p: "contacts" })}>{t.contacts}</a>
          <a href="SogliqIndustriyasi.html" style={{ fontWeight: 700, color: "var(--blue-600)" }}>
            {lang === "uz" ? "Kompaniya haqida →" : lang === "en" ? "About the company →" : "О компании →"}
          </a>
        </div>
        <div className="ubar-right">
          <div className="lang">
            <button className={lang === "uz" ? "on" : ""} onClick={() => setLang("uz")}>UZ</button>
            <button className={lang === "ru" ? "on" : ""} onClick={() => setLang("ru")}>RU</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a className="ubar-acct" onClick={() => go("account", {})} style={{ cursor: "pointer" }}>
            <Icon name="user" size={16} />
            <span>{t.login}</span>
          </a>
        </div>
      </div>
    </div>);

}

function Header({ t, lang, store, go, query, setQuery, onHamburger }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"head" + (scrolled ? " scrolled" : "")}>
      <div className="wrap">
        <button className="mob-hamburger" onClick={onHamburger}><Icon name="menu" size={22} /></button>
        <div className="brand" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          <img className="brand-mark" src={window.__asset("assets/soi-mark-white.svg")} alt="Sog'liq Industriyasi" />
        </div>
        <SearchBar t={t} lang={lang} query={query} setQuery={setQuery} go={go} />
        <div className="head-actions">
          <button className={"hact" + (store.compare.length > 0 ? " has-items" : "")} onClick={() => go("compare")}>
            <Icon name="compare" size={24} />
            <span>{t.compare}</span>
            {store.compare.length > 0 && <span className="cnt">{store.compare.length}</span>}
          </button>
          <button className={"hact" + (store.wishlist.length > 0 ? " has-items" : "")} onClick={() => go("wishlist")}>
            <Icon name={store.wishlist.length > 0 ? "heartFill" : "heart"} size={24} />
            <span>{t.wishlist}</span>
            {store.wishlist.length > 0 && <span className="cnt">{store.wishlist.length}</span>}
          </button>
          <button className={"hact" + (store.cartCount > 0 ? " has-items" : "")} onClick={() => go("cart")}>
            <Icon name="cart" size={24} />
            <span>{t.cart}</span>
            {store.cartCount > 0 && <span className="cnt">{store.cartCount}</span>}
          </button>
        </div>
      </div>
    </header>);
}

function CatMega({ catId, lang, go, active }) {
  const [open, setOpen] = useState(false);
  const timer = React.useRef(null);
  const isTouch = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;
  const cats = (window.DATA && window.DATA.CATEGORIES) || [];
  const c = cats.find(x => x.id === catId);
  const tri = (l, ru, uz, en) => l === "uz" ? uz : l === "en" ? en : ru;
  if (!c) return null;
  const subs = c.subs || [];
  const label = tri(lang, c.ru, c.uz, c.en);
  const enter = () => { if (isTouch) return; if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { if (isTouch) return; timer.current = setTimeout(() => setOpen(false), 130); };
  const onClickLabel = () => {
    if (isTouch) { setOpen(!open); return; }
    go("catalog", { cat: c.id });
  };
  return (
    <div className="nav-dd" onMouseEnter={enter} onMouseLeave={leave}>
      <a className={(active ? "on" : "") + (open ? " dd-open" : "")} onClick={onClickLabel} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="m6 9 6 6 6-6" /></svg>
      </a>
      {open && (
        <div className="catmega" onMouseEnter={enter} onMouseLeave={leave}>
          <div className="catmega-inner">
            <div className="catmega-head">
              <span className="catmega-ic"><Icon name={c.icon} size={20} /></span>
              <span className="catmega-title">{label}</span>
            </div>
            <div className="catmega-grid">
              {subs.map((s, i) => (
                <a key={i} className="catmega-item" onClick={() => { go("catalog", { cat: c.id, sub: i }); setOpen(false); }}>
                  <Icon name="chevronRight" size={14} className="cmi-chev" />
                  <span>{tri(lang, s.ru, s.uz, s.en)}</span>
                </a>
              ))}
            </div>
            <a className="catmega-all" onClick={() => { go("catalog", { cat: c.id }); setOpen(false); }}>
              {lang === "uz" ? "Barcha kategoriyalar →" : lang === "en" ? "All categories →" : "Все категории →"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const NAV_STORAGE_KEY = "soi_navmenu_visibility";
function useNavVis() {
  const load = () => { try { const r = localStorage.getItem(NAV_STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; } };
  const [vis, setVis] = useState(load);
  useEffect(() => {
    const h = (e) => setVis(e.detail || load());
    window.addEventListener("soi-navmenu-changed", h);
    return () => window.removeEventListener("soi-navmenu-changed", h);
  }, []);
  return (id) => !vis || vis[id] !== false;
}

function NavMore({ lang, go, route, show }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const badge = route && route.view === "catalog" ? route.params.badge : null;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const items = [
    show("sale")    && { label: lv("Акции","Aksiyalar","Promotions"),   act: () => go("catalog", { badge: "sale" }), active: badge === "sale" },
    show("brands")  && { label: lv("Бренды","Brendlar","Brands"),       act: () => go("brands", {}),                active: route && route.view === "brands" },
    show("instock") && { label: lv("В наличии","Tayyor","In stock"),    act: () => go("catalog", { stock: "in" }), active: false },
    show("calc")    && { label: lv("Калькулятор","Kalkulyator","Calculator"), act: () => go("calc", {}),           active: route && route.view === "calc" },
    show("kits")    && { label: lv("Комплекты","Komplektlar","Kits"),   act: () => go("kits", {}),                 active: route && route.view === "kits" },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="nav-more-wrap" ref={ref}>
      <button className={"nav-more-btn" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true">
        {lv("Ещё","Ko'proq","More")} <Icon name="chevronDown" size={14} />
      </button>
      {open && (
        <div className="nav-more-dd" role="menu">
          {items.map((item, i) => (
            <button key={i} className={"nav-more-item" + (item.active ? " on" : "")} role="menuitem"
              onClick={() => { item.act(); setOpen(false); }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Nav({ t, lang, go, openMega, setOpenMega, route }) {
  const cat = route && route.view === "catalog" ? route.params.cat : null;
  const show = useNavVis();
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const cats = (window.DATA && window.DATA.CATEGORIES) || [];
  return (
    <nav className="nav" role="navigation" aria-label={lv("Каталог","Katalog","Catalog")}>
      <div className="wrap" data-comment-anchor="1bf3cea58b-div-184-7">
        <button className={"cat-btn" + (openMega ? " open" : "")}
          onClick={() => setOpenMega(!openMega)}
          onMouseEnter={() => { if (!window.matchMedia("(hover:none)").matches) setOpenMega(true); }}
          aria-expanded={openMega} aria-haspopup="true">
          <Icon name={openMega ? "x" : "menu"} size={18} />
          <span>{lv("Каталог по направлениям медицины","Tibbiyot yo'nalishlari katalogi","Catalog by medical specialty")}</span>
        </button>
        <div className="nav-links">
          {cats.map((c) => <CatMega key={c.id} catId={c.id} lang={lang} go={go} active={cat === c.id} />)}
          {show("price") && (
            <a className={route && route.view === "price" ? "on" : ""}
               onClick={() => go("price", {})} tabIndex={0}
               onKeyDown={e => e.key==="Enter" && go("price",{})}>
              {lv("Прайс-лист","Narxlar","Price list")}
            </a>
          )}
          <NavMore lang={lang} go={go} route={route} show={show} />
        </div>
      </div>
    </nav>
  );
}

function useMegaAnchor(open) {
  const [topY, setTopY] = useState(140);
  React.useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const cands = [".sticky-bar.shown .sb", ".z-catalog .nav", ".nav"];
      for (const sel of cands) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null) {
          const r = el.getBoundingClientRect();
          if (r.height > 0) return Math.round(r.bottom);
        }
      }
      return 140;
    };
    const update = () => setTopY(measure());
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [open]);
  return topY;
}

// ── Catalog directions: 4 semantic groups + mapping (id → group) ──
const CATALOG_DIR_GROUPS = [
  { id: "diag",     ru: "Диагностика и лечение",      uz: "Diagnostika va davolash",        en: "Diagnostics & treatment" },
  { id: "clinical", ru: "Клинические направления",     uz: "Klinik yo'nalishlar",            en: "Clinical specialties" },
  { id: "surgery",  ru: "Хирургия и экстренная помощь",uz: "Jarrohlik va shoshilinch yordam",en: "Surgery & emergency" },
  { id: "rehab",    ru: "Восстановление и оснащение",  uz: "Reabilitatsiya va jihozlash",    en: "Rehabilitation & equipping" },
];
const DIR_GROUP_OF = {
  D03: "diag", D04: "diag", D05: "diag", D09: "diag", D13: "diag", D23: "diag",
  D01: "clinical", D07: "clinical", D10: "clinical", D11: "clinical", D12: "clinical", D20: "clinical", D21: "clinical", D22: "clinical",
  D02: "surgery", D08: "surgery", D16: "surgery", D17: "surgery",
  D06: "rehab", D14: "rehab", D15: "rehab", D18: "rehab", D19: "rehab",
};

function MegaMenu({ t, lang, go, onClose }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const topY = useMegaAnchor(true);
  const isTouch = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;

  // NEW normalized directions (active only) from CMS
  const allDirs = (window.CMS ? window.CMS.list("cat_directions") : []).filter((d) => d.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  // legacy fallback if catalog not seeded
  if (!allDirs.length) {
    const cats = window.DATA.CATEGORIES;
    return (
      <div className="mega-ov" style={{ top: topY }} onClick={onClose}>
        <div className="mega" onClick={(e) => e.stopPropagation()} onMouseLeave={() => { if (!isTouch) onClose(); }}>
          <div className="mega-cols">
            {cats.map((c) => (
              <div key={c.id} className="mega-col">
                <div className="mega-col-h"><Icon name={c.icon} size={16} />{tri(lang, c.ru, c.uz, c.en)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>);
  }

  // group directions into the 4 semantic blocks (prefer admin-set group, else static map)
  const groupOf = (d) => d.group || DIR_GROUP_OF[d.id] || "rehab";
  const groups = CATALOG_DIR_GROUPS.map((g) => ({ g, dirs: allDirs.filter((d) => groupOf(d) === g.id) })).filter((x) => x.dirs.length);

  return (
    <div className="mega-ov" style={{ top: topY }} onClick={onClose}>
      <div className="mega" onClick={(e) => e.stopPropagation()} onMouseLeave={() => { if (!isTouch) onClose(); }}>
        <div className="mega-cols" style={{ animation: "megaSlide .2s cubic-bezier(.16,1,.3,1)" }}>
          {groups.map(({ g, dirs }) => (
            <div key={g.id} className="mega-col">
              <div className="mega-col-h">{lv(g.ru, g.uz, g.en)}</div>
              <ul className="mega-col-list">
                {dirs.map((d) => (
                  <li key={d.id}>
                    <a className="mega-glink" onClick={() => { go("catalog", { dir: d.id }); onClose(); }}>
                      <Icon name="chevronRight" size={13} className="mgl-chev" />
                      <span>{d.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mega-foot">
          <div className="mega-foot-txt">
            <Icon name="spark" size={20} style={{ color: "var(--blue-600)" }} />
            <span>{lv("Нужно комплексное оснащение клиники?", "Klinikani kompleks jihozlash kerakmi?", "Need turnkey clinic equipping?")}</span>
          </div>
          <button className="btn btn-cyan" onClick={() => { onClose(); window.__openQuote && window.__openQuote(); }}>{t.nav_quote}</button>
        </div>
      </div>
    </div>);
}

function StickyBar({ t, lang, setLang, store, go, query, setQuery, theme, toggleTheme, openMega, setOpenMega, route }) {
  const [shown, setShown] = React.useState(false);
  const [q, setQ] = React.useState(query || "");
  const cat = route && route.view === "catalog" ? route.params.cat : null;
  React.useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => { setQ(query || ""); }, [query]);
  const isTouch = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;
  const submit = (e) => { e.preventDefault(); if (!q.trim()) return; setQuery(q); go("catalog", { q: q }); };
  return (
    <div className={"sticky-bar" + (shown ? " on" : "")} style={{ transform: shown ? "translateY(0)" : "translateY(-100%)", opacity: shown ? 1 : 0, pointerEvents: shown ? "auto" : "none" }}>
      <div className="wrap">
        <div className="sb-brand" onClick={() => go("home")}>
          <img className="brand-mark sb-mark" src={window.__asset("assets/soi-mark-white.svg")} alt="Sog'liq Industriyasi" />
        </div>
        <button className={"sb-cat " + (openMega ? "open" : "")}
          onClick={() => setOpenMega(!openMega)}
          onMouseEnter={() => { if (!isTouch) setOpenMega(true); }}>
          <Icon name={openMega ? "x" : "menu"} size={18} />
          <span>{lang === "uz" ? "Katalog" : lang === "en" ? "Catalog" : "Каталог"}</span>
        </button>
        <div className="sb-cats">
          {((window.DATA && window.DATA.CATEGORIES) || []).map((c) => (
            <CatMega key={c.id} catId={c.id} lang={lang} go={go} active={cat === c.id} />
          ))}
        </div>
        <form className="sb-search" onSubmit={submit}>
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "uz" ? "Qidirish…" : lang === "en" ? "Search…" : "Поиск…"} />
        </form>
        <div className="sb-actions">
          <button className={"sb-ic" + (store.compare.length > 0 ? " has" : "")} title={t.compare} onClick={() => go("compare")}>
            <Icon name="compare" size={21} />
            {store.compare.length > 0 && <span className="sb-cnt">{store.compare.length}</span>}
          </button>
          <button className={"sb-ic" + (store.wishlist.length > 0 ? " has" : "")} title={t.wishlist} onClick={() => go("wishlist")}>
            <Icon name={store.wishlist.length > 0 ? "heartFill" : "heart"} size={21} />
            {store.wishlist.length > 0 && <span className="sb-cnt">{store.wishlist.length}</span>}
          </button>
          <button className={"sb-ic" + (store.cartCount > 0 ? " has" : "")} title={t.cart} onClick={() => go("cart")}>
            <Icon name="cart" size={21} />
            {store.cartCount > 0 && <span className="sb-cnt">{store.cartCount}</span>}
          </button>
          <span className="sb-div" />
          <div className="sb-lang">
            <button className={lang === "uz" ? "on" : ""} onClick={() => setLang("uz")}>UZ</button>
            <button className={lang === "ru" ? "on" : ""} onClick={() => setLang("ru")}>RU</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="sb-ic" title={theme === "dark" ? "Светлая тема" : "Тёмная тема"} onClick={toggleTheme}>
            <span style={{ fontSize: 17 }}>{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <button className="sb-ic" title={t.login} onClick={() => go("account", {})}>
            <Icon name="user" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UtilityBar, Header, Nav, MegaMenu, StickyBar });