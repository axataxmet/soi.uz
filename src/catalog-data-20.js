/* Sog'liq Industriyasi — UI atoms, header, footer */
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
  cart: '<path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.8L21 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>',
  heart: '<path d="M12 20s-7-4.6-9.2-9.1C1.3 7.8 3 4.5 6.2 4.5c2 0 3.2 1.2 3.8 2.3.6-1.1 1.8-2.3 3.8-2.3 3.2 0 4.9 3.3 3.4 6.4C19 15.4 12 20 12 20z"/>',
  compare: '<path d="M4 7h12M12 3l4 4-4 4M20 17H8M12 13l-4 4 4 4"/>',
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

function CoHeader({ t, lang, setLang, go, goCat, route, theme, toggleTheme }) {
  const scrolled = useScrolled();
  const deep = useScrolled(170);
  route = route || { view: "" };
  goCat = goCat || ((sub, param, q) => go("catalog"));
  const counts = useCatCounts();
  const [drawer, setDrawer] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [q, setQ] = useState("");
  const isCatalog = route.view === "catalog";
  const lvh = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const nav = [
  ["about", t.nav_about], ["directions", t.nav_directions], ["registration", t.nav_registration],
  ["tenders", t.nav_tenders], ["documents", t.nav_documents], ["cases", t.nav_projects],
  ["news", t.nav_news], ["contacts", t.nav_contacts]];

  const searchPh = lang === "uz" ? "Uskuna, brend yoki artikul boʻyicha qidirish" : lang === "en" ? "Search equipment, brand or SKU" : "Поиск по оборудованию, бренду или артикулу";
  const submitSearch = (e) => { e.preventDefault(); if (q.trim()) { goCat("listing", "", q.trim()); setDrawer(false); } };

  const Langs = () =>
  <div className="lang-sw">
      {["uz", "ru", "en"].map((l) =>
    <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
    )}
    </div>;

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
      <div className={"uhead" + (isCatalog ? " uhead-cat" : "")}>
        <div className="wrap">
          {isCatalog ?
          <div className="uhead-nav">
              {nav.map(([v, label], i) =>
            <a key={v} className={(route.view === v ? "on " : "") + (i >= 5 ? "uh-extra" : "")} onClick={() => go(v)} tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && go(v)}>{label}</a>
            )}
              <div className="uh-more">
                <button className="uh-more-btn" onClick={() => setMoreOpen((o) => !o)} aria-expanded={moreOpen} aria-haspopup="true">
                  {lvh("Ещё", "Yana", "More")}<span className="uh-more-arr">▾</span>
                </button>
                {moreOpen &&
              <>
                  <div className="uh-more-ov" onClick={() => setMoreOpen(false)}></div>
                  <div className="uh-more-menu">
                    {nav.slice(5).map(([v, label]) =>
                  <a key={v} className={route.view === v ? "on" : ""} onClick={() => {go(v);setMoreOpen(false);}}>{label}</a>
                  )}
                  </div>
                </>
              }
              </div>
            </div> :

          <>
              <span className="u-it hide-sm"><CoIcon name="pin" size={14} />{t.c_office_addr}</span>
              <span className="u-sp"></span>
            </>
          }
          {isCatalog && <span className="u-sp"></span>}
          <a className="u-it hide-sm" href={"tel:" + (t.u_phone || "").replace(/[^\d+]/g, "")}><CoIcon name="phone" size={14} />{t.u_phone}</a>
          <ThemeBtn />
          <Langs />
        </div>
      </div>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="wrap" data-comment-anchor="4cafdc525e-div-115-9">
          <div className="brand" onClick={() => go("home")}>
            <img className="brand-mark" src={window.__asset("assets/soi-mark.svg")} alt="Sog'liq Industriyasi" style={{ height: 44, width: 44 }} data-comment-anchor="8aa68b19bd-img-117-13" />
          </div>
          {isCatalog ? (
            <>
              <form className="co-search" onSubmit={submitSearch}>
                <CoIcon name="search" size={18} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} aria-label="Search" />
                <button type="submit" className="co-search-btn">{lang === "uz" ? "Qidirish" : lang === "en" ? "Search" : "Найти"}</button>
              </form>
              <Actions />
            </>
          ) : (
            <>
              <div className="nav-links">
                {nav.map(([v, label]) =>
                <a key={v} className={route.view === v ? "on" : ""} onClick={() => go(v)} style={{ fontFamily: "\"DM Sans\"" }}>{label}</a>
                )}
              </div>
              <span className="nav-sp"></span>
              <a className="btn btn-pri nav-cta" onClick={() => go("catalog")} style={{ cursor: "pointer", backgroundColor: "rgb(14, 74, 198)" }} data-comment-anchor="a2fd19ec8e-a-125-11">{t.to_shop} <span className="nav-cta-arrow">→</span></a>
            </>
          )}
          <button className="burger" onClick={() => setDrawer(true)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </nav>
      {isCatalog &&
      <div className={"cat-sticky" + (deep ? " show" : "")}>
        <div className="wrap">
          <img className="cs-logo" src={window.__asset("assets/soi-mark.svg")} alt="SOI" onClick={() => go("home")} />
          <button className="cs-menu" onClick={() => goCat("home")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            <span>{lvh("Каталог", "Katalog", "Catalog")}</span>
          </button>
          <div className="cs-links">
            <a onClick={() => goCat("listing", "equipment")}>{lvh("Оборудование", "Uskunalar", "Equipment")}</a>
            <a onClick={() => goCat("listing", "furniture")}>{lvh("Мебель", "Mebel", "Furniture")}</a>
            <a onClick={() => goCat("listing", "instruments")}>{lvh("Инструменты", "Asboblar", "Instruments")}</a>
            <a onClick={() => goCat("listing", "consumables")}>{lvh("Расходники", "Sarf mat.", "Consumables")}</a>
            <a onClick={() => goCat("price")}>{lvh("Прайс-лист", "Narxlar", "Price")}</a>
          </div>
          <form className="cs-search" onSubmit={submitSearch}>
            <CoIcon name="search" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} aria-label="Search" />
          </form>
          <Actions />
        </div>
      </div>
      }
      <div className={"drawer-ov" + (drawer ? " on" : "")} onClick={() => setDrawer(false)}></div>
      <aside className={"drawer" + (drawer ? " on" : "")}>
        <div className="drawer-head">
          <Langs />
          <button className="burger" onClick={() => setDrawer(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <form className="co-search co-search-m" onSubmit={submitSearch}>
          <CoIcon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPh} aria-label="Search" />
        </form>
        {nav.map(([v, label]) =>
        <a key={v} className={route.view === v ? "on" : ""} onClick={() => {go(v);setDrawer(false);}}>{label}</a>
        )}
        <a onClick={() => {go("catalog");setDrawer(false);}} className="btn btn-pri" style={{ marginTop: 12, justifyContent: "center", cursor: "pointer" }}>{t.to_shop} →</a>
      </aside>
    </>);

}

function CoFooter({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fcols">
          <div>
            <img className="foot-logo" src={LOGO_SRC} alt="" style={{ width: 48, height: 48, marginBottom: 14, filter: "brightness(0) invert(1)" }} />
            <p className="fabout">{t.f_about}</p>
            <a className="cb-phone" href="tel:+998772250001" style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>+998 (77) 225-00-01</a>
          </div>
          <div>
            <h5>{lv("Компания", "Kompaniya", "Company")}</h5>
            <ul>
              <li><a onClick={() => go("about")}>{t.nav_about}</a></li>
              <li><a onClick={() => go("services")}>{t.nav_services}</a></li>
              <li><a onClick={() => go("cases")}>{t.nav_projects}</a></li>
              <li><a onClick={() => go("partners")}>{t.nav_partners}</a></li>
              <li><a onClick={() => go("catalog")}>{lv("Электронный каталог", "Elektron katalog", "Online catalog")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{lv("Документы и право", "Hujjatlar va huquq", "Documents & legal")}</h5>
            <ul>
              <li><a onClick={() => go("licenses")}>{lv("Лицензии и сертификаты", "Litsenziya va sertifikatlar", "Licenses & certificates")}</a></li>
              <li><a href="corp/company-card.pdf" target="_blank" rel="noopener">{lv("Карточка компании", "Kompaniya kartasi", "Company card")}</a></li>
              <li><a href="corp/registration.pdf" target="_blank" rel="noopener">{lv("Свидетельство о регистрации", "Ro'yxatdan o'tish guvohnomasi", "Registration certificate")}</a></li>
              <li><a href="corp/egrul.pdf" target="_blank" rel="noopener">{lv("Сведения о юридическом лице", "Yuridik shaxs ma'lumotlari", "Legal entity information")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t.f_contacts}</h5>
            <ul>
              <li style={{ color: "#aab8c9" }}>{t.c_office_addr}</li>
              <li><a href="tel:+998772250001">{lv("Приёмная", "Qabulxona", "Reception")}: +998 (77) 225-00-01</a></li>
              <li><a href="tel:+998772240001">{lv("Отдел продаж", "Sotuv bo'limi", "Sales")}: +998 (77) 224-00-01</a></li>
              <li><a href="mailto:info@sogliqindustriyasi.uz">info@sogliqindustriyasi.uz</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-disclaimer">
          {lv("Информация, изображения документов и технические характеристики на сайте носят справочный характер и не являются публичной офертой. Перед применением оборудования ознакомьтесь с инструкцией по эксплуатации или проконсультируйтесь со специалистом.",
          "Saytdagi hujjatlar tasvirlari va texnik xususiyatlar ma'lumot uchun berilgan va majburiyat hisoblanmaydi. Uskunadan foydalanishdan oldin foydalanish yo'riqnomasi bilan tanishing yoki mutaxassis bilan maslahatlashing.",
          "Document images and technical specifications on the site are for reference only and do not constitute an obligation. Before using the equipment, read the instructions for use or consult a specialist.")}
        </div>
        <div className="foot-bot">
          <span style={{ fontSize: 12, color: "#8095ab" }}>{lv("ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» (SOG'LIQ INDUSTRIYASI MCHJ) • 100069, Ташкент • ИНН: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz", "«SOG'LIQ INDUSTRIYASI» MChJ • 100069, Toshkent • STIR: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz", "LLC «HEALTH INDUSTRY» (SOG'LIQ INDUSTRIYASI MCHJ) • 100069, Tashkent • TIN: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz")}</span>
          <div className="foot-socials">
            <a href="https://t.me/uzmedex" target="_blank" rel="noopener" title="Telegram" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.07 9.74c-.15.68-.56.85-1.13.53l-3.13-2.3-1.51 1.45c-.17.17-.31.31-.63.31l.22-3.18 5.79-5.23c.25-.22-.06-.35-.39-.12L6.07 13.88l-3.07-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.83.88z" /></svg></a>
            <a href="https://instagram.com/uzmedex" target="_blank" rel="noopener" title="Instagram" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
            <a href="https://facebook.com/uzmedex" target="_blank" rel="noopener" title="Facebook" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg></a>
            <a href="https://youtube.com/@uzmedex" target="_blank" rel="noopener" title="YouTube" className="foot-soc"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" /></svg></a>
          </div>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { CoIcon, CoHeader, CoFooter, useCoReveal, CoLOGO_SRC: LOGO_SRC });