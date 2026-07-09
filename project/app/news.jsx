/* ИНДУСТРИЯ ЗДОРОВЬЯ — app router */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "light": "balanced",
  "headline": "editorial",
  "accent": "blue"
} /*EDITMODE-END*/;

/* ---- hash deep-link helpers (pretty URL slugs) ---- */
const CORP_VIEWS = ["home", "about", "directions", "registration", "tenders", "documents", "news", "cases", "projects", "partners", "licenses", "services", "contacts", "catalog", "reviews"];
// pretty slug <-> internal corp view
const CORP_SLUG_TO_VIEW = {
  about: "about", services: "directions", directions: "directions",
  "registration-medical-devices": "registration", registration: "registration",
  tenders: "tenders", documents: "documents", cases: "cases", projects: "projects",
  news: "news", contacts: "contacts", partners: "partners", licenses: "licenses",
  reviews: "reviews"
};
const CORP_VIEW_TO_SLUG = {
  directions: "services", registration: "registration-medical-devices", cases: "cases", projects: "projects",
  about: "about", tenders: "tenders", documents: "documents", news: "news",
  contacts: "contacts", partners: "partners", licenses: "licenses", reviews: "reviews"
};
// catalog category pretty slug <-> data id
const CAT_SLUG_TO_ID = { equipment: "equipment", "medical-furniture": "furniture", instruments: "instruments", consumables: "consumables", diagnostics: "diagnostics", surgery: "surgery", sterilization: "sterilization", physio: "physio", emergency: "emergency" };
const CAT_ID_TO_SLUG = { furniture: "medical-furniture" };
const CAT_SUBS = ["home", "product", "listing", "brand", "info", "cart", "wishlist", "compare", "calc", "price", "news", "kits", "tracking", "account", "faq", "sitemap", "brands"];
function parseHash() {
  const seg = (location.hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!seg.length) return { view: "home", cat: null };
  // product at root → catalog product
  if (seg[0] === "product") return { view: "catalog", cat: { sub: "product", param: seg[1] || "" } };
  if (seg[0] === "catalog") {
    const s1 = seg[1];
    if (!s1) return { view: "catalog", cat: { sub: "home", param: "" } };
    if (CAT_SUBS.indexOf(s1) >= 0) return { view: "catalog", cat: { sub: s1, param: seg[2] || "" } };
    // treat as category slug → listing
    return { view: "catalog", cat: { sub: "listing", param: CAT_SLUG_TO_ID[s1] || s1 } };
  }
  const view = CORP_SLUG_TO_VIEW[seg[0]];
  return { view: view || "home", cat: null };
}
function corpHash(view) {return view === "home" ? "#/" : "#/" + (CORP_VIEW_TO_SLUG[view] || view);}
function catHashFromRoute(view, params) {
  params = params || {};
  if (!view || view === "home") return "#/catalog";
  if (view === "product") return "#/catalog/product/" + (params.id || "");
  if (view === "catalog") return params.cat ? "#/catalog/" + (CAT_ID_TO_SLUG[params.cat] || params.cat) : "#/catalog";
  if (view === "brand") return "#/catalog/brand/" + (params.id || "");
  if (view === "info") return "#/catalog/info/" + (params.p || "");
  return "#/catalog/" + view;
}

function CatalogFrame({ lang, theme, frameRef, initial, active }) {
  const localRef = React.useRef(null);
  const ref = frameRef || localRef;
  const [h, setH] = React.useState("calc(100vh - 70px)");
  React.useEffect(() => {
    const measure = () => {
      const head = document.querySelector("header.nav, .nav, header");
      const bottom = head ? Math.round(head.getBoundingClientRect().bottom) : 70;
      setH("calc(100vh - " + Math.max(0, bottom) + "px)");
    };
    measure();
    const id = setTimeout(measure, 120);
    window.addEventListener("resize", measure);
    return () => {clearTimeout(id);window.removeEventListener("resize", measure);};
  }, [active]);
  React.useEffect(() => {
    const f = ref.current;if (!f || !f.contentWindow) return;
    f.contentWindow.postMessage({ type: "soi-set", lang, theme }, "*");
  }, [lang, theme]);
  // src is built ONCE (captured at first mount) so the iframe never reloads;
  // lang/theme/route changes are pushed via postMessage instead.
  const srcRef = React.useRef(null);
  if (srcRef.current === null) {
    const init = initial || { sub: "home", param: "" };
    srcRef.current = "catalog.soi.uz.html?embed=1&lang=" + lang + "&theme=" + theme +
    "&view=" + encodeURIComponent(init.sub || "home") + "&p1=" + encodeURIComponent(init.param || "");
  }
  return (
    <div className="cat-frame-wrap" style={{
      height: active ? h : 0, width: "100%", background: "var(--bg, #f7fafd)",
      overflow: "hidden", visibility: active ? "visible" : "hidden",
      position: active ? "static" : "absolute", left: active ? "auto" : "-9999px"
    }} aria-hidden={!active}>
      <iframe ref={ref} src={srcRef.current} title="Каталог"
      style={{ width: "100%", height: active ? "100%" : "1px", border: "none", display: "block" }} />
    </div>);

}

// ---- CMS-backed site SEO settings (edited in admin/seo.jsx) ----
const SITE_SEO_DEFAULTS = {
  title: "ИНДУСТРИЯ ЗДОРОВЬЯ — медицинское оборудование в Узбекистане",
  description: "Официальный поставщик медицинского оборудования, расходных материалов и медицинской техники в Республике Узбекистан.",
  keywords: "медицинское оборудование, узбекистан, поставка, каталог",
  og_image: "",
  robots: "index,follow",
};
function useSiteSeo() {
  const [seo, setSeo] = useState(() => window.CMS ? window.CMS.getSetting("site_seo", SITE_SEO_DEFAULTS) : SITE_SEO_DEFAULTS);
  useEffect(() => {
    if (!window.CMS) return;
    setSeo(window.CMS.getSetting("site_seo", SITE_SEO_DEFAULTS));
    return window.CMS.on ? window.CMS.on("settings", () => setSeo(window.CMS.getSetting("site_seo", SITE_SEO_DEFAULTS))) : undefined;
  }, []);
  return seo;
}

function App() {
  const _initHashRaw = parseHash();
  // unified news: catalog deep-link to news resolves to the single corp news page (form 1)
  const _isCatNews = (h) => h.view === "catalog" && h.cat && h.cat.sub === "news";
  const _initHash = _isCatNews(_initHashRaw) ? { view: "news" } : _initHashRaw;
  const [lang, setLang] = useState(() => localStorage.getItem("si_lang") || "ru");
  const [theme, setTheme] = useState(() => localStorage.getItem("si_theme") || "light");
  const [route, setRoute] = useState({ view: _initHash.view });
  const seo = useSiteSeo();
  const t = window.SI.T[lang];
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const catFrameRef = React.useRef(null);
  const [catNav, setCatNav] = useState(_initHash.cat || { sub: "home", param: "", q: "", from: null });
  // catalog frame mounts once, then stays alive (no re-start on every open)
  const [catReady, setCatReady] = React.useState(_initHash.view === "catalog");
  const skipHash = React.useRef(false);
  const setHashSafe = (hh) => {if (location.hash !== hh) {skipHash.current = true;location.hash = hh;}};

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-light", tw.light);
    r.setAttribute("data-headline", tw.headline);
    r.setAttribute("data-accent", tw.accent);
  }, [tw.light, tw.headline, tw.accent]);

  // preload catalog in the background shortly after the home shell is ready,
  // so the first open is instant and there is no second cold start.
  useEffect(() => {
    if (catReady) return;
    const id = setTimeout(() => setCatReady(true), 1800);
    return () => clearTimeout(id);
  }, [catReady]);
  useEffect(() => {if (route.view === "catalog") setCatReady(true);}, [route.view]);

  useEffect(() => {localStorage.setItem("si_lang", lang);document.documentElement.lang = lang;}, [lang]);
  useEffect(() => {
    localStorage.setItem("si_theme", theme);
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");else
    document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  const toggleTheme = () => setTheme((th) => th === "dark" ? "light" : "dark");

  const go = (view) => {
    // "brands" — прямой запрос каталожной витрины; "partners" — корп-страница
    // «Бренды и заводы-производители» (единые данные /api/brands, admin/brands).
    if (view === "brands") { goCat("brands", "", "", "company"); return; }
    setRoute({ view });
    if (view === "catalog") {setCatNav({ sub: "home", param: "", q: "", from: null });setHashSafe("#/catalog");} else
    setHashSafe(corpHash(view));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  /* unified header: jump straight into a catalog sub-view (cart / wishlist / compare / search) */
  const goCat = (sub, param, q, from) => {
    setCatReady(true);
    setRoute({ view: "catalog" });
    setCatNav({ sub: sub || "home", param: param || "", q: q || "", from: from || null });
    setHashSafe(q ? "#/catalog" : sub && sub !== "home" && sub !== "listing" ? "#/catalog/" + sub + (param ? "/" + param : "") : "#/catalog");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  /* ---- deep-link: react to hash changes (back/forward, manual) ---- */
  useEffect(() => {
    const onHash = () => {
      if (skipHash.current) {skipHash.current = false;return;}
      const r = parseHash();
      // unified news: catalog/news deep-link always shows the single corp news page (form 1)
      if (_isCatNews(r)) { setRoute({ view: "news", from: "catalog" }); setHashSafe(corpHash("news")); window.scrollTo({ top: 0 }); return; }
      setRoute({ view: r.view });
      if (r.view === "catalog") {
        setCatNav(r.cat || { sub: "home", param: "" });
      }
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);


  /* ---- deep-link: reflect catalog's internal route into the URL hash ---- */
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "soi-cohome") {setRoute({ view: "home" });setHashSafe("#/");window.scrollTo({ top: 0 });return;}
      if (d.type === "soi-conav" && d.view) {
        setRoute({ view: d.view, from: d.from || null });
        setHashSafe(corpHash(d.view));
        window.scrollTo({ top: 0 });
        return;
      }
      if (d.type !== "soi-route") return;
      const newHash = catHashFromRoute(d.view, d.params);
      setHashSafe(newHash);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useCoReveal();

  /* ---- dynamic tab title per route ---- */
  useEffect(() => {
    if (route.view === "catalog") return;
    const v = route.view;
    const BRAND = lang === "uz" ? "SOG’LIQ INDUSTRIYASI" : lang === "en" ? "HEALTH INDUSTRY" : "ИНДУСТРИЯ ЗДОРОВЬЯ";
    const SUB = lang === "uz" ? "Tibbiy uskunalar yetkazib beruvchi" : lang === "en" ? "Medical equipment supplier" : "Поставщик медицинского оборудования";
    const M = {
      catalog: lang === "uz" ? "Katalog" : lang === "en" ? "Catalog" : "Каталог",
      about: t.nav_about, directions: t.nav_services || t.nav_directions, registration: t.nav_registration,
      tenders: t.nav_tenders, documents: t.nav_documents, news: t.nav_news, projects: t.nav_projects,
      partners: t.nav_partners, licenses: t.nav_licenses, services: t.nav_services, contacts: t.nav_contacts,
      reviews: lang === "uz" ? "Sharhlar" : lang === "en" ? "Reviews" : "Отзывы и рекомендации"
    };
    const label = v === "home" ? "" : M[v] || "";
    document.title = v === "home" ? (seo.title || (BRAND + " — " + SUB)) : (label ? label + " — " + BRAND : BRAND + " — " + SUB);
  }, [route.view, lang, t, seo.title]);

  /* ---- site SEO meta tags (admin/seo.jsx → site_seo setting) ---- */
  useEffect(() => {
    const setMeta = (selector, value) => {
      if (!value) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[name="robots"]', seo.robots);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:image"]', seo.og_image);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
  }, [seo]);
  let page;
  const v = route.view;
  const isCatalog = v === "catalog";
  if (v === "home") page = <CoHomePage t={t} lang={lang} go={go} data-comment-anchor="4d3f2cce89-b-29-46" />;else
  if (v === "catalog") page = null;else
  if (v === "about") page = <AboutPage t={t} lang={lang} go={go} />;else
  if (v === "directions") page = <ServicesPage t={t} lang={lang} go={go} />;else
  if (v === "registration") page = <RegistrationPage t={t} lang={lang} go={go} />;else
  if (v === "tenders") page = <CoTendersPage t={t} lang={lang} go={go} />;else
  if (v === "documents") page = <LicensesPage t={t} lang={lang} go={go} />;else
  if (v === "cases") page = <ProjectsPage t={t} lang={lang} go={go} />;else
  if (v === "news") page = <CoNewsPage t={t} lang={lang} go={go} fromCatalog={route.from === "catalog"} goCatalog={() => go("catalog")} />;else
  if (v === "projects") page = <ProjectsPage t={t} lang={lang} go={go} />;else
  if (v === "partners") page = <PartnersPage t={t} lang={lang} go={go} goCat={goCat} />;else
  if (v === "licenses") page = <LicensesPage t={t} lang={lang} go={go} />;else
  if (v === "services") page = <ServicesPage t={t} lang={lang} go={go} />;else
  if (v === "contacts") page = <ContactsPage t={t} lang={lang} go={go} />;else
  if (v === "reviews")  page = <ReviewsPage t={t} lang={lang} go={go} />;else
  page = <CoHomePage t={t} lang={lang} go={go} />;

  return (
    <div className="z-corp">
      <CoHeader t={t} lang={lang} setLang={setLang} go={go} goCat={goCat} route={route} theme={theme} toggleTheme={toggleTheme} data-comment-anchor="b2aa7d60a7-a-121-13" />
      {catReady && (
        <div className="z-catalog" style={{ display: isCatalog ? "block" : "none" }}>
          <CatalogApp embed={true} active={isCatalog} lang={lang} theme={theme}
            initialSub={(_initHash.cat || {}).sub || "home"} initialParam={(_initHash.cat || {}).param || ""}
            navSub={catNav.sub} navParam={catNav.param} navQ={catNav.q} navFrom={catNav.from} />
        </div>
      )}
      {!isCatalog &&
      <React.Fragment>
          <CoBreadcrumbs lang={lang} go={go} route={route} />
          <main key={v + lang}>{page}</main>
          <CoFooter t={t} lang={lang} go={go} />
        </React.Fragment>
      }
      {!isCatalog &&
      <TweaksPanel title="Tweaks">
        <TweakSection label={lang === "uz" ? "Yorug'lik qatlami" : lang === "en" ? "Light layer" : "Световой слой"} />
        <TweakRadio
          label={lang === "uz" ? "Yorqinlik" : lang === "en" ? "Intensity" : "Интенсивность"}
          value={tw.light}
          options={[
          { value: "calm", label: lang === "en" ? "Calm" : "Сдерж." },
          { value: "balanced", label: lang === "en" ? "Balanced" : "Баланс" },
          { value: "vivid", label: lang === "en" ? "Vivid" : "Ярко" }]
          }
          onChange={(v) => setTweak("light", v)} />

        <TweakSection label={lang === "uz" ? "Sarlavhalar" : lang === "en" ? "Headlines" : "Заголовки"} />
        <TweakRadio
          label={lang === "uz" ? "Xarakter" : lang === "en" ? "Character" : "Характер"}
          value={tw.headline}
          options={[
          { value: "editorial", label: lang === "en" ? "Editorial" : "Издат." },
          { value: "modern", label: lang === "en" ? "Modern" : "Соврем." }]
          }
          onChange={(v) => setTweak("headline", v)} />

        <TweakSection label={lang === "uz" ? "Urg'u rangi" : lang === "en" ? "Accent tone" : "Акцент"} />
        <TweakColor
          label={lang === "uz" ? "Brend rangi" : lang === "en" ? "Brand" : "Бренд"}
          value={tw.accent === "cyan" ? "#0d96be" : tw.accent === "lavender" ? "#5b4ee0" : "#1757c8"}
          options={["#1757c8", "#0d96be", "#5b4ee0"]}
          onChange={(v) => setTweak("accent", v === "#0d96be" ? "cyan" : v === "#5b4ee0" ? "lavender" : "blue")} />
      </TweaksPanel>
      }
    </div>);

}

ReactDOM.createRoot(document.getElementById("si-root")).render(<App />);