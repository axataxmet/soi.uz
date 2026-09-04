/* ИНДУСТРИЯ ЗДОРОВЬЯ — UI atoms, header, footer */
const { useState, useEffect, useRef } = React;

const SI_ICONS = {
  truck: '<path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  building: '<path d="M3 21h18M5 21V5l8-3v19M19 21V10l-6-3"/><path d="M9 9h.01M9 13h.01M9 17h.01"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  check: '<path d="M9 11l3 3L20 6"/><path d="M21 12a9 9 0 1 1-6.2-8.5"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3 3 0 0 1 0 6M21 20c0-2.5-1.3-4.4-3.2-5.3"/>',
  doc: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  pin: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  phone: '<path d="M22 16.9v2.9a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2H7a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8"/>',
  star: '<path d="M12 3l2.6 5.7 6.4.6-4.8 4.2 1.5 6.3L12 17l-5.7 3.1 1.5-6.3L3 9.3l6.4-.6z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  /* Корзина, избранное и сравнение перерисованы 09.08.2026: прежние были
     самодельными и выбивались из набора — у корзины ручка не сходилась с
     кузовом, сравнение рисовалось двумя стрелками (это скорее «обмен», а не
     «сравнить»). Взяты общепринятые начертания: тележка с двумя колёсами,
     сердце из двух дуг, аптекарские весы. */
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18.5" cy="20" r="1.5"/><path d="M2.5 3h2.2l2.6 11.6a1.7 1.7 0 0 0 1.7 1.3h9.3a1.7 1.7 0 0 0 1.7-1.3L21.5 7H5.3"/>',
  heart: '<path d="M19 13.6c1.4-1.4 2.8-3 2.8-5.2A5.2 5.2 0 0 0 16.6 3c-1.7 0-2.9.5-4.6 2-1.7-1.5-2.9-2-4.6-2A5.2 5.2 0 0 0 2.2 8.4c0 2.2 1.4 3.8 2.8 5.2L12 20.6Z"/>',
  /* Весы — принятый в рознице знак сравнения. Коромысло прямое, а не
     провисающее: на 20px изгиб сливался со чашами и рисунок читался пятном. */
  compare: '<path d="M12 4v16M8.5 20h7"/><path d="M4 8h16"/><path d="m4 8-2.4 6.2a4.2 4.2 0 0 0 4.8 0Z"/><path d="m20 8 2.4 6.2a4.2 4.2 0 0 1-4.8 0Z"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>'
};

function CoIcon({ name, size = 24, className = "", style = {} }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={style} dangerouslySetInnerHTML={{ __html: SI_ICONS[name] || "" }} />);

}

const LOGO_SRC = "assets/soi-mark-white.svg";

function useScrolled(threshold = 20) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > threshold);
    fn();window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return s;
}

// reveal-on-scroll. Content is visible by default; .js-anim enables the entrance.
function useCoReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-anim");
    let io = null;
    const mark = (e) => e.setAttribute("data-rv", "in");
    const revealInView = () => {
      const h = window.innerHeight || document.documentElement.clientHeight || 800;
      document.querySelectorAll(".reveal:not([data-rv])").forEach((e) => {
        if (e.getBoundingClientRect().top < h * 1.15) mark(e);
      });
    };
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((ents) => {
        ents.forEach((e) => {if (e.isIntersecting) {mark(e.target);io.unobserve(e.target);}});
      }, { threshold: 0.08 });
      document.querySelectorAll(".reveal:not([data-rv])").forEach((e) => io.observe(e));
    }
    const raf = requestAnimationFrame(revealInView);
    const tA = setTimeout(revealInView, 250);
    const tB = setTimeout(() => {document.querySelectorAll(".reveal:not([data-rv])").forEach(mark);}, 800);
    // failsafe: if the entrance mechanism didn't actually reveal a top element,
    // drop .js-anim so base (visible) styles apply — content must never stay hidden.
    const tFail = setTimeout(() => {
      const first = document.querySelector(".hero .reveal, .page-hero ~ * .reveal, .reveal");
      if (first && getComputedStyle(first).opacity === "0") root.classList.remove("js-anim");
    }, 1400);
    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView);
    return () => {
      if (io) io.disconnect();
      cancelAnimationFrame(raf);clearTimeout(tA);clearTimeout(tB);clearTimeout(tFail);
      window.removeEventListener("scroll", revealInView);
      window.removeEventListener("resize", revealInView);
    };
  });
}

// live catalog counts (cart / wishlist / compare) mirrored from CatalogApp's store
function useCatCounts() {
  const [c, setC] = useState(() => window.__catCounts || { cart: 0, wish: 0, cmp: 0 });
  useEffect(() => {
    const read = () => {
      try {
        if (window.__catCounts) { setC(window.__catCounts); return; }
        const j = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
        const cart = j("uzmedex_cart"), wish = j("uzmedex_wish"), cmp = j("uzmedex_cmp");
        setC({ cart: cart.reduce((s, x) => s + (x.q || 1), 0), wish: wish.length, cmp: cmp.length });
      } catch (e) {}
    };
    read();
    const onEvt = (e) => setC(e.detail || window.__catCounts || { cart: 0, wish: 0, cmp: 0 });
    window.addEventListener("cat-store", onEvt);
    window.addEventListener("storage", read);
    return () => { window.removeEventListener("cat-store", onEvt); window.removeEventListener("storage", read); };
  }, []);
  return c;
}

function corpNavItems(lang) {
  const lvh = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return [
  { id: "company", label: lvh("О компании", "Kompaniya haqida", "About"), children: [
    { view: "about",     label: lvh("Об ИНДУСТРИЯ ЗДОРОВЬЯ",  "SOG’LIQ INDUSTRIYASI haqida",   "About HEALTH INDUSTRY") },
    { view: "documents", label: lvh("Документы компании",      "Kompaniya hujjatlari",          "Company documents") },
    { view: "projects",  label: lvh("Реализованные проекты",   "Amalga oshirilgan loyihalar",   "Completed projects") },
    { view: "reviews",   label: lvh("Отзывы и рекомендации",   "Fikrlar va tavsiyalar",         "Reviews and recommendations") },
    { view: "partners",  label: lvh("Партнёры",                "Hamkorlar",                     "Partners") },
    { view: "news",      label: lvh("Новости",                 "Yangiliklar",                   "News") }] },

  { id: "services", label: lvh("Услуги", "Xizmatlar", "Services"), children: [
    { view: "registration",   label: lvh("Регистрация медицинских изделий", "Tibbiy buyumlarni ro‘yxatdan o‘tkazish", "Medical device registration") },
    { view: "tenders",        label: lvh("Тендеры и государственные закупки", "Tenderlar va davlat xaridlari",        "Tenders and public procurement") },
    { view: "staffTraining",  label: lvh("Обучение персонала",   "Xodimlarni o‘qitish", "Staff training") },
    { view: "serviceSupport", label: lvh("Сервисное обслуживание", "Servis xizmati",    "Maintenance service") }] },

  // Каталог: подменю повторяет структуру 3000. Категории резолвятся по клику
  // (catKey) — если каталог из API ещё не загружен, открывается общий каталог.
  { id: "catalog", label: lvh("Каталог", "Katalog", "Catalog"), children: [
    { view: "catalog", catKey: "equipment",   label: lvh("Медицинское оборудование", "Tibbiy uskunalar",        "Medical equipment") },
    { view: "catalog", catKey: "furniture",   label: lvh("Медицинская мебель",       "Tibbiy mebel",            "Medical furniture") },
    { view: "catalog", catKey: "instruments", label: lvh("Медицинские инструменты",  "Tibbiy asboblar",         "Medical instruments") },
    { view: "catalog", catKey: "consumables", label: lvh("Расходные материалы",      "Sarflanadigan materiallar", "Consumables") },
    /* Прайс-лист живёт в каталожной оболочке, поэтому открывается через goCat:
       корпоративный go() знает только корп-страницы и на «price» дал бы пустой экран. */
    { catSub: "price", label: lvh("Каталог / прайс-лист", "Katalog / narxlar ro‘yxati", "Catalog / price list") }] },

  { view: "contacts", label: lvh("Контакты", "Kontaktlar", "Contacts") }];
}

/* Колонки футера. От меню в шапке отличаются тем, что отдельной группы
   «Услуги» здесь нет, а сам пункт стоит внутри «О компании» (решение
   заказчика 06.08.2026). Порядок внутри колонки задан заказчиком
   21.08.2026: «Услуги» и «Контакты» замыкают список, после «Новостей».

   Живёт здесь, а не в каждом футере: их два — CoFooter в этом файле и Footer в
   home-page.jsx, — и раньше такие списки уже расходились между собой. Меню в
   шапке по-прежнему читает corpNavItems напрямую и остаётся с выпадающими
   «Услугами», а «Контакты» там — самостоятельный пункт верхнего уровня. */
function footerNavCols(lang) {
  const lvh = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return corpNavItems(lang)
  .filter((it) => it.children && it.id !== "services")
  .map((col) => {
    if (col.id !== "company") return col;
    /* Дописываем в конец, а не вставляем после «Партнёров»: два последних
       пункта колонки идут именно в этом порядке. */
    const children = col.children.concat([
    { view: "services", label: lvh("Услуги", "Xizmatlar", "Services") },
    { view: "contacts", label: lvh("Контакты", "Kontaktlar", "Contacts") }]);
    return Object.assign({}, col, { children });
  });
}

function CoHeader({ t, lang, setLang, go, goCat, route, theme, toggleTheme }) {
  const scrolled = useScrolled();
  route = route || { view: "" };
  goCat = goCat || ((sub, param, q) => go("catalog"));
  const counts = useCatCounts();
  const [drawer, setDrawer] = useState(false);
  const [qqOpen, setQqOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Body scroll lock while the drawer is open — otherwise the page behind it
  // keeps scrolling under a swipe/wheel, which reads as broken on mobile.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [drawer]);
  const [q, setQ] = useState("");
  const [catSearchOpen, setCatSearchOpen] = useState(false);
  const catSearchInputRef = useRef(null);
  const isCatalog = route.view === "catalog";
  const lvh = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  // Новая структура шапки главной: О компании ▾ · Услуги ▾ · Кейсы · Контакты · Каталог.
  // (Спецификация: главная — режим доверия к компании; каталог — режим поиска.)
  const corpNav = corpNavItems(lang);

  const [openDd, setOpenDd] = useState(null); // null | "company" | "services" | "catalog"

  // Категории каталога приходят из API, поэтому id резолвим в момент клика:
  // не нашли — открываем общий каталог (тот же приём, что в SoiCatalogPortal).
  const navParams = (child) => {
    if (child.params) return child.params;
    if (!child.catKey) return {};
    const cats = (window.DATA && window.DATA.CATEGORIES) || [];
    // В разметке меню категории записаны по slug, из API приходит ещё и cuid —
    // принимаем оба, иначе пункт молча открывает общий каталог.
    const found = cats.find((c) => c.id === child.catKey || c.slug === child.catKey);
    return found ? { cat: found.id } : {};
  };

  const searchPh = lang === "uz" ? "Uskuna, brend yoki artikul boʻyicha qidirish" : lang === "en" ? "Search equipment, brand or SKU" : "Поиск по оборудованию, бренду или артикулу";
  const searchShort = lang === "uz" ? "Izlash..." : lang === "en" ? "Search..." : "Искать...";
  const searchLabel = lang === "uz" ? "Qidirish" : lang === "en" ? "Search" : "Поиск";
  const closeSearchLabel = lvh("Закрыть поиск", "Qidiruvni yopish", "Close search");
  const submitSearch = (e) => { e.preventDefault(); if (q.trim()) { goCat("listing", "", q.trim()); setDrawer(false); } };

  const [langOpen, setLangOpen] = useState(null); // null | "nav" | "drawer"
  useEffect(() => {
    if (!catSearchOpen || !isCatalog) return;
    const id = window.setTimeout(() => catSearchInputRef.current && catSearchInputRef.current.focus(), 30);
    return () => window.clearTimeout(id);
  }, [catSearchOpen, isCatalog]);
  useEffect(() => {
    if (!isCatalog && catSearchOpen) setCatSearchOpen(false);
  }, [isCatalog, catSearchOpen]);
  // Закрытие выпадающих меню по клику вне них. Раньше это делал overlay position:fixed,
  // но backdrop-filter на sticky-шапке делает её containing block для fixed-потомков, из-за чего
  // overlay сжимался до высоты шапки и не ловил клики по hero. Document-listener надёжнее. (задача №9)
  useEffect(() => {
    if (!openDd && !langOpen) return;
    const onDown = (e) => {
      const t = e.target;
      if (!t || !t.closest) { setOpenDd(null); setLangOpen(null); return; }
      if (openDd && !t.closest(".nav-dd")) setOpenDd(null);
      if (langOpen && !t.closest(".lang-dd")) setLangOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openDd, langOpen]);
  const LANG_LABEL = { uz: "O‘zbekcha", ru: "Русский", en: "English" };
  const Langs = ({ place = "nav" } = {}) => {
    const open = langOpen === place;
    return (
  <div className={"lang-dd lang-dd-" + place}>
      <button
      className="lang-dd-btn"
      onClick={() => setLangOpen((o) => o === place ? null : place)}
      aria-expanded={open}
      aria-haspopup="true"
      title={LANG_LABEL[lang]}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15 15 0 010 20" />
          <path d="M12 2a15 15 0 000 20" />
        </svg>
        <span>{lang.toUpperCase()}</span>
        <span className="lang-dd-chevron">▾</span>
      </button>
      {open &&
        <div className="lang-dd-menu">
          {["uz", "ru", "en"].map((l) =>
        <button key={l}
          onClick={() => { setLang(l); setLangOpen(null); }}
          className={"lang-dd-item" + (lang === l ? " on" : "")}>
            <span>{LANG_LABEL[l]}</span>
            <span>{l.toUpperCase()}</span>
          </button>
        )}
        </div>
    }
    </div>
    );
  };

  const ThemeBtn = () =>
  <button className="theme-btn" onClick={toggleTheme} title={theme === "dark" ? "Светлая тема" : "Тёмная тема"} aria-label="Theme">
      {theme === "dark" ? "☀" : "☾"}
    </button>;

  const Actions = () =>
  <div className="co-actions">
      <button className="co-act" onClick={() => goCat("compare")} title={lang === "uz" ? "Taqqoslash" : lang === "en" ? "Compare" : "Сравнение"} aria-label="Compare">
        <CoIcon name="compare" size={20} />
        {counts.cmp > 0 && <span className="co-badge">{counts.cmp}</span>}
      </button>
      <button className="co-act" onClick={() => goCat("wishlist")} title={lang === "uz" ? "Saralangan" : lang === "en" ? "Wishlist" : "Избранное"} aria-label="Wishlist">
        <CoIcon name="heart" size={20} />
        {counts.wish > 0 && <span className="co-badge">{counts.wish}</span>}
      </button>
      <button className="co-act co-act-cart" onClick={() => goCat("cart")} title={lang === "uz" ? "Savat / KP" : lang === "en" ? "Cart / RFQ" : "Корзина / Запрос КП"} aria-label="Cart">
        <CoIcon name="cart" size={20} />
        {counts.cart > 0 && <span className="co-badge">{counts.cart}</span>}
      </button>
    </div>;

  return (
    <>
      <nav className={"nav co-nav" + (scrolled ? " scrolled" : "") + (route.view === "home" && !scrolled ? " home-top" : "")}>
        <div className="wrap co-nav-wrap" data-comment-anchor="4cafdc525e-div-115-9">
          <div className="brand co-brand" onClick={() => go("home")}>
            <img className="brand-mark co-brand-mark" src={window.__asset("assets/soi-mark.svg")} alt="ИНДУСТРИЯ ЗДОРОВЬЯ" data-comment-anchor="8aa68b19bd-img-117-13" />
          </div>
          <div className="nav-links co-nav-links">
            {corpNav.map((item) => item.children ?
            <div key={item.id} className="nav-dd">
              <button
                className={"nav-dd-btn" + (openDd === item.id ? " on" : "")}
                onClick={() => setOpenDd((o) => o === item.id ? null : item.id)}
                aria-expanded={openDd === item.id}
                aria-haspopup="true">
                {item.label}
                <span className="nav-dd-chevron">▾</span>
              </button>
              {openDd === item.id &&
              <div className="nav-dd-menu">
                {item.children.map((child, idx) =>
                <button key={idx}
                  onClick={() => { child.catSub ? goCat(child.catSub) : go(child.view, navParams(child)); setOpenDd(null); }}
                  className="nav-dd-item">
                  {child.label}
                </button>
                )}
              </div>
              }
            </div> :
            <a key={item.view}
              className={(route.view === item.view ? "on" : "") + (item.primary ? " nav-primary" : "")}
              onClick={() => go(item.view)}>
              {item.label}
            </a>
            )}
          </div>
          {isCatalog && (
          <div className={"co-cat-search" + (catSearchOpen ? " open" : "")}>
            {!catSearchOpen ? (
              <button
                type="button"
                className="co-cat-search-trigger"
                onClick={() => { setOpenDd(null); setLangOpen(null); setCatSearchOpen(true); }}
                aria-label={searchLabel}
                title={searchLabel}>
                <CoIcon name="search" size={25} />
              </button>
            ) : (
              <form className="co-cat-search-expanded" onSubmit={submitSearch}>
                <button type="submit" className="co-cat-search-submit" aria-label={searchLabel} title={searchLabel}>
                  <CoIcon name="search" size={26} />
                </button>
                <input
                  ref={catSearchInputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); submitSearch(e); } }}
                  placeholder={searchShort}
                  aria-label={searchPh}
                />
                <button
                  type="button"
                  className="co-cat-search-close"
                  onClick={() => setCatSearchOpen(false)}
                  aria-label={closeSearchLabel}
                  title={closeSearchLabel}>
                  ×
                </button>
              </form>
            )}
          </div>
          )}
          {isCatalog && !catSearchOpen && (
          <div className="co-mobile-actions" aria-label="Catalog mobile actions">
            <button className="co-mobile-act co-mobile-cart" onClick={() => goCat("cart")} title={lang === "uz" ? "Savat / KP" : lang === "en" ? "Cart / RFQ" : "Корзина / Запрос КП"} aria-label="Cart">
              <CoIcon name="cart" size={20} />
              {counts.cart > 0 && <span className="co-badge">{counts.cart}</span>}
            </button>
            <button className="co-mobile-act" onClick={() => setDrawer(true)} aria-label="Menu" title={lvh("Меню", "Menyu", "Menu")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </div>
          )}
          {!(isCatalog && catSearchOpen) && <span className="nav-sp"></span>}
          {!(isCatalog && catSearchOpen) && (
            <>
              <div className="nav-utils">
                <Langs place="nav" />
                <ThemeBtn />
              </div>
              {/* Кнопка «Консультация» убрана из бар-меню 09.08.2026 по прямому
                  указанию. Заявку по-прежнему можно оставить: на мобильном —
                  из выезжающего меню (.drawer-cta ниже), на любой ширине —
                  через плавающий виджет связи слева внизу. */}
              <span className="nav-sep" aria-hidden="true"></span>
              <Actions />
            </>
          )}
          {!catSearchOpen && <button className="burger" onClick={() => setDrawer(true)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>}
        </div>
      </nav>
      {/* Подменю каталога («По направлениям медицины», категории, «Прайс-лист»,
          «Ещё») убрано по решению заказчика: оно дублировало основную навигацию
          шапки и перекрывало верх страницы при прокрутке. */}
      <div className={"drawer-ov" + (drawer ? " on" : "")} onClick={() => setDrawer(false)}></div>
      <aside className={"drawer" + (drawer ? " on" : "")}>
        <div className="drawer-head">
          <Langs place="drawer" />
          <button className="burger" onClick={() => setDrawer(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <form className="co-search co-search-m" onSubmit={submitSearch}>
          <CoIcon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} aria-label="Search" />
        </form>
        <button className="btn btn-pri btn-block drawer-cta" onClick={() => { setDrawer(false); setQqOpen(true); }}>
          <CoIcon name="phone" size={16} />
          {lvh("Заказать консультацию", "Konsultatsiya buyurtma qilish", "Request a consultation")}
        </button>
        {corpNav.flatMap((item) =>
        item.children
          ? [{ _heading: true, label: item.label, key: "h-" + item.id }].concat(item.children.map((c, i) => ({ ...c, key: item.id + "-" + i })))
          : [{ ...item, key: item.view }]
        ).map((it) =>
        it._heading
          ? <div key={it.key} style={{ padding: "12px 0 4px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-muted, var(--slate-500))", fontWeight: 600 }}>{it.label}</div>
          : <a key={it.key} className={route.view === it.view ? "on" : ""} onClick={() => { it.catSub ? goCat(it.catSub) : go(it.view, navParams(it)); setDrawer(false); }} style={it.primary ? { color: "var(--blue-600, var(--blue-600))", fontWeight: 600 } : undefined}>{it.label}</a>
        )}
      </aside>
      {qqOpen && <QuickQuoteModal lang={lang} onClose={() => setQqOpen(false)} />}
    </>);

}

/* Хлебные крошки корпоративной оболочки. Иерархия повторяет меню шапки
   (О компании ▾ / Услуги ▾ / Кейсы / Контакты); на главной не рендерятся.
   SEO: BreadcrumbList JSON-LD через общий window.__setCrumbsLD (app-root.jsx). */
function CoBreadcrumbs({ lang, go, route }) {
  const v = (route && route.view) || "";
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const base = location.origin + location.pathname;
  const home = { label: lv("Главная", "Bosh sahifa", "Home"), view: "home", url: base + "/" };
  const company = { label: lv("О компании", "Kompaniya haqida", "About company"), view: "about", url: base + "/about" };
  const services = { label: lv("Услуги", "Xizmatlar", "Services"), view: "services", url: base + "/services" };
  const MAP = {
    about:        [home, { label: company.label }],
    documents:    [home, company, { label: lv("Документы", "Hujjatlar", "Documents") }],
    licenses:     [home, company, { label: lv("Документы", "Hujjatlar", "Documents") }],
    reviews:      [home, company, { label: lv("Отзывы", "Sharhlar", "Reviews") }],
    news:         [home, company, { label: lv("Новости", "Yangiliklar", "News") }],
    services:     [home, { label: services.label }],
    directions:   [home, { label: services.label }],
    registration: [home, services, { label: lv("Регистрация МИ", "TI roʻyxatga olish", "MD registration") }],
    staffTraining: [home, services, { label: lv("Обучение персонала", "Xodimlarni oʻqitish", "Staff training") }],
    serviceSupport: [home, services, { label: lv("Сервис и поддержка", "Servis va qo'llab-quvvatlash", "Service & support") }],
    tenders:      [home, services, { label: lv("Тендеры и госзакупки", "Tender va davlat xaridlari", "Tenders & procurement") }],
    cases:        [home, company, { label: lv("Реализованные проекты", "Amalga oshirilgan loyihalar", "Completed projects") }],
    projects:     [home, company, { label: lv("Реализованные проекты", "Amalga oshirilgan loyihalar", "Completed projects") }],
    partners:     [home, company, { label: lv("Партнёры", "Hamkorlar", "Partners") }],
    contacts:     [home, { label: lv("Контакты", "Kontaktlar", "Contacts") }],
  };
  const crumbs = MAP[v] || null;
  const ldKey = crumbs ? crumbs.map((c) => c.label).join("|") : "";
  useEffect(() => {
    // BreadcrumbList JSON-LD снят намеренно: крошки повторяют вариант с 3000, где
    // микроразметки нет. Каталожные крошки продолжают писать свою разметку сами.
    if (window.__setCrumbsLD) window.__setCrumbsLD(null);
    // корп-страницы не являются canonical брендов — снимаем ссылку, если осталась
    if (window.__setCanonical) window.__setCanonical(null);
  }, [ldKey]);
  if (!crumbs) return null;
  return (
    <nav className="co-crumbs" aria-label={lv("Хлебные крошки", "Yoʻl koʻrsatkichi", "Breadcrumb")}>
      <div className="wrap">
        <ol className="co-crumbs-list">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={i}>
                {last || !c.view
                  ? <span className="co-crumb-cur" aria-current="page">{c.label}</span>
                  : <a className="co-crumb-lnk" onClick={() => go(c.view)} tabIndex={0}
                       onKeyDown={(e) => e.key === "Enter" && go(c.view)}>{c.label}</a>}
                {!last && <span className="co-crumb-sep" aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/* Единственный рабочий адрес почты компании. В настройках сайта
   (site_contacts.email) до сих пор лежит info@soi.uz — старый адрес, из-за
   которого в футере соседствовали две разные почты. */
const SITE_MAIL = "info@sogliqindustriyasi.uz";

/* Ширина экрана нужна футеру как значение, а не только как медиазапрос: группы
   ссылок свёрнуты в <details>, и на широком экране их надо держать раскрытыми
   именно атрибутом open. Через CSS это не решается — у закрытого <details>
   браузер исключает содержимое из раскладки, и список, которому вернули
   display, рисуется поверх соседнего блока, не занимая высоты. */
function useNarrow(bp) {
  const q = "(max-width:" + bp + "px)";
  const [narrow, setNarrow] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : false
  );
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(q);
    const on = (e) => setNarrow(e.matches);
    setNarrow(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, [q]);
  return narrow;
}

function CoFooter({ t, lang, go, goCat, setLang }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const contacts = useSiteContacts();
  /* 620px — та же граница, на которой мобильные правила перестраивают футер. */
  const narrow = useNarrow(620);
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fcols">
          {/* Первая колонка по образцу заказчика: бренд, описание и контакты
              одним блоком, каждая строка контакта — со своей иконкой. Раньше
              контакты стояли отдельной пятой колонкой с заголовком; тексты те
              же, изменилось только место и подача. */}
          <div className="fcol-brand">
            <div className="f-brand">
              <img className="foot-logo" src={LOGO_SRC} alt="" style={{ width: 40, height: 40 }} />
              <span className="f-wordmark">{lv("ИНДУСТРИЯ ЗДОРОВЬЯ", "SOG'LIQ INDUSTRIYASI", "HEALTH INDUSTRY")}</span>
            </div>
            <p className="fabout">{t.f_about}</p>
            <ul className="foot-contact">
              {/* Состав колонки повторяет страницу «Контакты» и берёт те же ключи
                  словаря (t.c_*), чтобы адрес и часы работы не разъезжались.
                  Телефон сервиса на странице вписан в разметку, а не в настройки
                  сайта, — здесь он задан так же. */}
              {/* Офис и склад стоят по одному адресу, часы работы вынесены на
                  страницу «Контакты» — в футере остаётся один адрес. */}
              <li className="fc-grp">
                <CoIcon name="pin" size={16} className="fc-ic" />
                <span>{t.c_office_addr || contacts.address}</span>
              </li>
              {/* Первые два номера берутся из настроек сайта и правятся в админке;
                  третий там не хранится и задан здесь — так же, как на странице
                  «Контакты». */}
              <li className="fc-grp">
                <CoIcon name="phone" size={16} className="fc-ic" />
                <span>
                  <a href={telHref(contacts.phone)}>{lv("Приёмная","Qabulxona","Reception")}: {contacts.phone}</a><br />
                  <a href={telHref(contacts.phone2)}>{lv("Отдел продаж","Sotuv bo'limi","Sales")}: {contacts.phone2}</a><br />
                  <a href={telHref("+998772230001")}>{lv("Сервисный отдел","Servis bo'limi","Service department")}: +998 (77) 223-00-01</a>
                </span>
              </li>
              <li className="fc-grp">
                <CoIcon name="mail" size={16} className="fc-ic" />
                <span>E-mail: <a href={"mailto:" + SITE_MAIL}>{SITE_MAIL}</a></span>
              </li>
            </ul>
          </div>
          {/* Колонки навигации собираются из той же структуры, что и меню в
              шапке (corpNavItems): раньше футер держал свой список ссылок и
              расходился с меню при каждой правке навигации. Пункты, которые
              умеет открывать только каталожная оболочка (прайс-лист), уходят
              через goCat — корпоративный go() дал бы на них пустой экран. */}
          {/* Колонка «Услуги» из футера убрана (решение заказчика), а сам пункт
              переехал в «О компании» под «Партнёры» и ведёт на страницу услуг.
              Перестроение локальное: corpNavItems — общий источник для меню в
              шапке, и правка там убрала бы выпадающий список «Услуги» из
              навигации, чего не просили. */}
          {/* <details> вместо <div>: на телефоне четыре раскрытых списка растягивали
              подвал на 1199px, и до соцсетей с копирайтом приходилось долистывать.
              Нативный элемент сворачивает их без единой строки скрипта и без
              потери доступности — клавиатура и скринридер понимают его сами.
              На широком экране группы раскрыты атрибутом open, поэтому вид
              десктопного подвала не меняется. */}
          {footerNavCols(lang).map((col) => (
            /* На широком экране open стоит всегда; на узком атрибут не задаётся,
               и <details> работает сам — нажатием, клавиатурой, скринридером. */
            <details key={col.id} className="fcol-acc" {...(narrow ? {} : { open: true })}>
              <summary>
                <h5>{col.label}</h5>
                <svg className="fcol-acc-chev" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
              </summary>
              <ul>
                {col.children.map((ch, i) => (
                  <li key={i}>
                    <a onClick={() => {
                      if (ch.catSub) return goCat ? goCat(ch.catSub, "", "") : go("catalog");
                      /* Категории каталога записаны в меню по slug, из API приходит
                         ещё и cuid — принимаем оба; не нашли, значит дерево ещё не
                         приехало, открываем общий каталог. */
                      if (ch.catKey) {
                        const cats = (window.DATA && window.DATA.CATEGORIES) || [];
                        const found = cats.find((c) => c.id === ch.catKey || c.slug === ch.catKey);
                        return go("catalog", found ? { cat: found.id } : {});
                      }
                      return go(ch.view);
                    }}>{ch.label}</a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          {/* Последняя колонка образца: соцсети под заголовком «Следите за
              нами». Раньше здесь же, под тонкой линией, стояли и реквизиты —
              в узкой колонке короткий текст всё равно переносился на три
              строки. Реквизиты вынесены ниже, во всю ширину футера (та же
              техника, что у дисклеймера через ряд), текст и ссылки не
              менялись. */}
          <div className="fcol-follow">
            <h5>{lv("Следите за нами", "Bizni kuzating", "Follow us")}</h5>
            <div className="foot-socials">
              <a href={contacts.telegram} target="_blank" rel="noopener" title="Telegram" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.07 9.74c-.15.68-.56.85-1.13.53l-3.13-2.3-1.51 1.45c-.17.17-.31.31-.63.31l.22-3.18 5.79-5.23c.25-.22-.06-.35-.39-.12L6.07 13.88l-3.07-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.83.88z" /></svg></a>
              <a href={contacts.instagram} target="_blank" rel="noopener" title="Instagram" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
              <a href={contacts.facebook} target="_blank" rel="noopener" title="Facebook" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg></a>
              <a href={contacts.youtube} target="_blank" rel="noopener" title="YouTube" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 8.55 16.2 12l-6.45 3.45V8.55z" /></svg></a>
            </div>
            <p className="foot-copy">
              {lv("© 2026 ООО «ИНДУСТРИЯ ЗДОРОВЬЯ».", "© 2026 «SOG’LIQ INDUSTRIYASI» MChJ.", "© 2026 HEALTH INDUSTRY LLC.")}
              <br />
              {lv("Все права защищены.", "Barcha huquqlar himoyalangan.", "All rights reserved.")}
              <br />
              {lv("Использование материалов сайта разрешено только с согласия правообладателя.", "Sayt materiallaridan foydalanish faqat huquq egasining roziligi bilan ruxsat etiladi.", "Use of site materials is permitted only with the rightsholder's consent.")}
            </p>
          </div>
        </div>
        <div className="foot-disclaimer">
          {/* Дисклеймер под требования Республики Узбекистан: документы названы
              так, как называются в РУз. Ссылка на ПКМ № 738 из этого текста
              убрана при сокращении — она осталась на странице регистрации МИ,
              где стоит по делу. Юридическую точность подтверждает юрист. */}
          {lv("Технические характеристики, изображения и копии документов — регистрационных удостоверений, сертификатов и деклараций о соответствии, свидетельств об утверждении типа средств измерений — размещены ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» справочно: они не являются публичной офертой и основанием для претензий. Производитель вправе изменить комплектацию и характеристики без уведомления. Перед применением изучите инструкцию (паспорт изделия) или обратитесь к специалисту. Сайт использует файлы cookie: они помогают узнавать вас, оценивать пользовательский опыт и улучшать сайт. Состав обрабатываемых данных и условия — в политике конфиденциальности.",
          "Texnik xususiyatlar, tasvirlar va hujjatlar nusxalari — ro‘yxatdan o‘tkazish guvohnomalari, muvofiqlik sertifikatlari va deklaratsiyalari, o‘lchash vositalari turini tasdiqlash guvohnomalari — «SOG’LIQ INDUSTRIYASI» MChJ tomonidan ma’lumot uchun joylashtirilgan: ular ommaviy oferta va da’vo asosi emas. Ishlab chiqaruvchi butlanish va xususiyatlarni ogohlantirishsiz o‘zgartirishi mumkin. Qo‘llashdan oldin yo‘riqnoma (buyum pasporti) bilan tanishing yoki mutaxassisga murojaat qiling. Sayt cookie fayllaridan foydalanadi: ular sizni tanish, foydalanuvchi tajribasini baholash va saytni yaxshilash uchun kerak. Qayta ishlanadigan ma’lumotlar tarkibi va shartlari — maxfiylik siyosatida.",
          "Technical specifications, images and copies of documents — registration certificates, certificates and declarations of conformity, measuring instrument type approvals — are published by SOG’LIQ INDUSTRIYASI LLC for reference: they are not a public offer or grounds for claims. The manufacturer may change configuration and specifications without notice. Before use, read the instructions (device passport) or consult a specialist. The site uses cookies: they help recognise you, assess your experience and improve the site. What data we process and on what terms is set out in the privacy policy.")}
        </div>
      </div>
    </footer>);

}

Object.assign(window, { CoIcon, CoHeader, CoBreadcrumbs, CoFooter, useCoReveal, CoLOGO_SRC: LOGO_SRC });
