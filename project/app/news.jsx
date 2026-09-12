/* ИНДУСТРИЯ ЗДОРОВЬЯ — app router */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "light": "balanced",
  "headline": "editorial",
  "accent": "blue"
} /*EDITMODE-END*/;

/* ---- hash deep-link helpers (pretty URL slugs) ---- */
const CORP_VIEWS = ["home", "about", "directions", "registration", "staffTraining", "serviceSupport", "tenders", "documents", "news", "cases", "projects", "partners", "licenses", "services", "contacts", "catalog", "reviews"];
// pretty slug <-> internal corp view
const CORP_SLUG_TO_VIEW = {
  about: "about", services: "directions", directions: "directions",
  "registration-medical-devices": "registration", registration: "registration",
  "staff-training": "staffTraining",
  "service-support": "serviceSupport",
  tenders: "tenders", documents: "documents", cases: "cases", projects: "projects",
  news: "news", contacts: "contacts", partners: "partners", licenses: "licenses",
  reviews: "reviews"
};
const CORP_VIEW_TO_SLUG = {
  directions: "services", registration: "registration-medical-devices", cases: "cases", projects: "projects",
  staffTraining: "staff-training",
  serviceSupport: "service-support",
  about: "about", tenders: "tenders", documents: "documents", news: "news",
  contacts: "contacts", partners: "partners", licenses: "licenses", reviews: "reviews"
};
/* Карточки на главной строят из этой карты настоящий href, чтобы быть
   ссылками, а не div с обработчиком: так работают средний клик, Cmd-клик и
   индексация. Источник один — иначе адреса в карточках и в роутере разойдутся
   при первом же переименовании раздела. */
window.corpViewToPath = (view) => "/" + (CORP_VIEW_TO_SLUG[view] || view || "");
// catalog category pretty slug <-> data id
const CAT_SLUG_TO_ID = { equipment: "equipment", "medical-furniture": "furniture", instruments: "instruments", consumables: "consumables", diagnostics: "diagnostics", surgery: "surgery", sterilization: "sterilization", physio: "physio", emergency: "emergency" };
const CAT_ID_TO_SLUG = { furniture: "medical-furniture" };
const CAT_SUBS = ["home", "product", "listing", "brand", "info", "cart", "wishlist", "compare", "calc", "price", "news", "kits", "tracking", "account", "faq", "sitemap", "brands"];
/* ── маршрутизация по пути, а не по якорю ───────────────────────────────────
   Раздел живёт на обычном адресе — /contacts, /catalog/equipment. Фрагмент
   после # на сервер не уходил вовсе, поэтому поисковик, логи и превью ссылок
   в мессенджерах видели только главную. Со стороны сервера нужна одна вещь:
   отдавать index.html на любой путь без расширения (dev-server и nginx это
   делают), остальное разбирает parseUrl. */
function parseSegments(seg) {
  if (!seg.length) return { view: "home", cat: null };
  // product at root → catalog product
  if (seg[0] === "product") return { view: "catalog", cat: { sub: "product", param: seg[1] || "" } };
  if (seg[0] === "catalog") {
    const s1 = seg[1];
    if (!s1) {
      /* Голый "/catalog" — но в строке запроса может быть направление/поиск/
         бейдж/бренд, записанные туда catHashFromRoute(). Раньше эта ветка
         всегда возвращала пустой param, и такая ссылка (или обновление уже
         открытой страницы с фильтром) теряла фильтр — открывалась обычная
         витрина каталога. Кладём query-строку как есть в param; распаковывает
         её embedRouteFrom (app-root.jsx). */
      let qsStr = "";
      try { qsStr = location.search.replace(/^\?/, ""); } catch (e) {}
      return { view: "catalog", cat: { sub: "home", param: qsStr } };
    }
    if (CAT_SUBS.indexOf(s1) >= 0) return { view: "catalog", cat: { sub: s1, param: seg[2] || "" } };
    // category slug → listing; the optional third and fourth segments are the
    // subcategory and the product group (/catalog/equipment/obstetrics/obstetrics-kolposkopy)
    // — packed into param as "cat/sub/group" because catNav only carries one
    // string, and split again in embedRouteFrom.
    const catPart = CAT_SLUG_TO_ID[s1] || s1;
    const tail = seg.slice(2, 4).filter(Boolean);
    let q = "";
    try { if (new URLSearchParams(location.search).get("view") === "grid") q = "?view=grid"; } catch (e) {}
    return { view: "catalog", cat: { sub: "listing", param: [catPart].concat(tail).join("/") + q } };
  }
  const view = CORP_SLUG_TO_VIEW[seg[0]];
  return { view: view || "home", cat: null };
}
function segmentsOfPath() {
  return (location.pathname || "/")
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== "index.html" && s !== "soi.uz.html");
}
/* Старые ссылки вида #/catalog/equipment продолжают открываться: если путь
   пустой, а якорь похож на маршрут — читаем его. App при старте перепишет
   адрес в новую форму через replaceState, не создавая лишней записи истории. */
function legacyHashSegments() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  return h ? h.split("/").filter(Boolean) : [];
}
function parseUrl() {
  const seg = segmentsOfPath();
  /* Снятая страница — переписываем адрес на актуальный и разбираем уже его.
     replaceState, а не pushState: иначе «назад» возвращало бы на удалённый
     адрес, и посетитель ходил бы по кругу. */
  const gone = GONE_PATHS[seg.join("/")];
  if (gone) {
    try { history.replaceState({ soi: true }, "", gone); } catch (e) {}
    return parseSegments(gone.split("/").filter(Boolean));
  }
  return parseSegments(seg.length ? seg : legacyHashSegments());
}
/* Категория в адресе — человекочитаемый slug, а не cuid из базы: ссылка вида
   #/catalog/furniture переживает пересоздание базы, читается в выдаче и не
   пугает при копировании. Внутри кода по-прежнему ходит id. */
function catSlugOf(id) {
  const c = ((window.DATA && window.DATA.CATEGORIES) || []).find((x) => x.id === id || x.slug === id);
  return (c && (c.slug || c.id)) || id;
}
/* Subcategory is a per-category array index (products carry p.sub === that
   index, not an id) — resolved back to its own slug for the address bar. */
function subSlugOf(catId, subIdx) {
  const c = ((window.DATA && window.DATA.CATEGORIES) || []).find((x) => x.id === catId || x.slug === catId);
  const s = c && c.subs && c.subs[subIdx];
  return (s && (s.slug || s._id)) || subIdx;
}
/* Третий уровень — товарная группа. В адресе, как категория и подраздел, стоит
   slug; внутри маршрута может лежать и id (когда переход пришёл из кода), и slug
   (когда страницу открыли по ссылке) — принимаем оба. */
function groupSlugOf(catId, subIdx, group) {
  const c = ((window.DATA && window.DATA.CATEGORIES) || []).find((x) => x.id === catId || x.slug === catId);
  const s = c && c.subs && c.subs[subIdx];
  const g = s && (s.groups || []).find((x) => x._id === group || x.slug === group);
  return (g && (g.slug || g._id)) || group;
}
function catPathTail(params) {
  if (params.sub == null) return "";
  const subPart = "/" + subSlugOf(params.cat, params.sub);
  return params.group ? subPart + "/" + groupSlugOf(params.cat, params.sub, params.group) : subPart;
}
/* Вид списка — единственный параметр состояния, который стоит в адресе строкой
   запроса, а не сегментом пути: он не про то, где мы в дереве, а про то, как
   показан один и тот же раздел, и ссылка «списком» должна открываться списком. */
function catQuery(params) {
  return params.group && params.view === "grid" ? "?view=grid" : "";
}
function corpHash(view) {return view === "home" ? "/" : "/" + (CORP_VIEW_TO_SLUG[view] || view);}
function catHashFromRoute(view, params) {
  params = params || {};
  if (!view || view === "home") return "/catalog";
  if (view === "product") return "/catalog/product/" + (params.id || "");
  if (view === "catalog") {
    if (!params.cat) {
      /* Без категории раньше здесь всегда был голый "/catalog" — фильтр по
         направлению (dir), поиску (q) или бейджу (badge) терялся из адреса
         молча. Это не только ломало ссылку/закладку: эффект, который
         перечитывает маршрут из URL при его изменении, следом видел «просто
         /catalog» и откатывал состояние приложения обратно на витрину
         каталога — клик по направлению на главной секунду показывал нужный
         список и тут же возвращался на лендинг. */
      const qs = new URLSearchParams();
      if (params.dir) qs.set("dir", params.dir);
      if (params.q) qs.set("q", params.q);
      if (params.badge) qs.set("badge", params.badge);
      if (params.brand) qs.set("brand", params.brand);
      const s = qs.toString();
      return s ? "/catalog?" + s : "/catalog";
    }
    const catPart = catSlugOf(params.cat);
    return "/catalog/" + catPart + catPathTail(params) + catQuery(params);
  }
  if (view === "brand") return "/catalog/brand/" + (params.id || "");
  if (view === "info") return "/catalog/info/" + (params.p || "");
  return "/catalog/" + view;
}
/* Снятые страницы каталожной оболочки (22.08.2026). Каждая дублировала
   корпоративную, причём с расходящимся содержимым: «О компании» в каталоге
   утверждала «работаем с 2014 года», расходясь с /about. Год основания на
   сайте один — 2021 (см. SITE_FIGURES_DEFAULTS.founded в home-page.jsx).

   Адреса не выбрасываются, а перенаправляются: на них могли остаться внешние
   ссылки и закладки, а 404 вместо страницы — худший исход, чем переход на
   актуальный аналог. Ключ — путь целиком, без ведущего слэша. */
const GONE_PATHS = {
  "catalog/info": "/about",
  /* «Поставщикам» жила внутри каталожной оболочки — своей страницы, меню и
     нормального адреса у неё не было. Содержимое перенесено на /partners
     (см. PartnersPage в inner-pages.jsx), а старый адрес ведёт туда же. */
  "catalog/info/suppliers": "/partners",
  "catalog/info/about": "/about",
  "catalog/info/contacts": "/contacts",
  "catalog/tenders": "/tenders",
};

/* The inverse of embedRouteFrom (app-root.jsx): turns the catalog's own route
   announcement (a "soi-route" message, fired by its internal go()) back into
   the {sub, param} shape catNav carries. Without this, a click inside the
   catalog moved the address bar but left catNav — and the navSub/navParam
   props the catalog itself reads on the next external navigation — pointing
   at the old route. That mismatch was invisible until history.back() landed on
   a URL whose param happened to be byte-identical to the stale one; React saw
   no prop change, ran no effect, and the page silently kept showing the
   subcategory it had already left. */
function catNavFromRoute(view, params) {
  params = params || {};
  if (!view || view === "home") return { sub: "home", param: "" };
  if (view === "product") return { sub: "product", param: params.id || "" };
  if (view === "catalog") {
    if (!params.cat) {
      /* Тот же провал, что чинили в catHashFromRoute: когда сам каталог
         (его внутренний поиск/фильтр по направлению) анонсирует переход без
         cat, dir/q/badge/brand раньше терялись здесь и адрес откатывался на
         голый /catalog. */
      const qs = new URLSearchParams();
      ["dir", "q", "badge", "brand"].forEach((k) => { if (params[k]) qs.set(k, params[k]); });
      return { sub: "home", param: qs.toString() };
    }
    const catPart = catSlugOf(params.cat);
    return { sub: "listing", param: catPart + catPathTail(params) + catQuery(params) };
  }
  if (view === "brand") return { sub: "brand", param: params.id || "" };
  if (view === "info") return { sub: "info", param: params.p || "" };
  return { sub: view, param: "" };
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
      height: active ? h : 0, width: "100%", background: "var(--bg, var(--bg-2))",
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
  const _initHashRaw = parseUrl();
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
  /* Оболочка каталога монтируется один раз и дальше живёт (без перезапуска
     на каждое открытие). Стартует всегда с false — даже когда открыли сразу
     /catalog: её бандлы теперь грузятся по требованию, а <CatalogApp/> — имя
     из app-root.js, и до его загрузки этой переменной просто не существует.
     Ставим catReady только после того, как загрузка завершилась. */
  const [catReady, setCatReady] = React.useState(false);
  const [catFailed, setCatFailed] = React.useState(false);
  /* Свой lv: в этом файле его не было — тексты брались из словаря t, а у
     заглушки каталога своих ключей в словаре нет. */
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const openCatalog = React.useCallback(() => {
    if (!window.__loadDeferredBundles) { setCatReady(true); return; }
    window.__loadDeferredBundles().then(
      () => setCatReady(true),
      () => setCatFailed(true)
    );
  }, []);
  /* Адрес пишем через History API. Unlike location.hash="…", pushState never
     fires popstate on its own — only a real back/forward does — so, unlike the
     old hash-based router, there is no echo to guard against here. A guard flag
     was carried over from that router in an earlier pass; it looked harmless
     but pushState never clears it, so it silently swallowed the next real
     back/forward press. Removed rather than reintroduced. */
  const setHashSafe = (url) => {
    if (location.pathname + location.search === url) return;
    history.pushState({ soi: true }, "", url);
  };

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-light", tw.light);
    r.setAttribute("data-headline", tw.headline);
    r.setAttribute("data-accent", tw.accent);
  }, [tw.light, tw.headline, tw.accent]);

  /* Каталог подгружается фоном — чтобы первое открытие было мгновенным и не
     начиналось с холодного старта. Но теперь за этим стоит ещё и скачивание
     90 КБ бандлов, поэтому два ограничения.

     Первое: ждём простоя, а не фиксированных 1.8 секунды. Отсчёт от загрузки
     мог попасть ровно в момент, когда страница ещё дорисовывается, и отнять
     у неё канал; requestIdleCallback ждёт паузы, а timeout не даёт ждать
     бесконечно на постоянно занятой странице.

     Второе: при включённой экономии трафика или на 2G предзагрузки нет
     вовсе. Человек, пришедший читать «О компании» с мобильного интернета,
     не должен платить за каталог, который, возможно, не откроет. Откроет —
     загрузим тогда же, по нажатию. */
  useEffect(() => {
    if (catReady || catFailed) return;
    const conn = navigator.connection || {};
    if (conn.saveData || /2g/.test(conn.effectiveType || "")) return;

    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(openCatalog, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(openCatalog, 1800);
    return () => clearTimeout(id);
  }, [catReady, catFailed, openCatalog]);
  /* Открыли каталог раньше, чем истекла задержка, — не ждём её. */
  useEffect(() => { if (route.view === "catalog") openCatalog(); }, [route.view, openCatalog]);

  useEffect(() => {localStorage.setItem("si_lang", lang);document.documentElement.lang = lang;}, [lang]);
  useEffect(() => {
    localStorage.setItem("si_theme", theme);
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");else
    document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  const toggleTheme = () => setTheme((th) => th === "dark" ? "light" : "dark");

  // `opts` carries a preselection into the target page — today only the tender
  // category, so the homepage tiles can open the feed already filtered.
  const go = (view, opts) => {
    // Каталожная витрина брендов удалена — в меню каталога её нет. Прежние
    // ссылки «Бренды» ведут на корпоративную страницу «Партнёры»: данные те же
    // (/api/brands, admin/brands), просто одна страница вместо двух.
    if (view === "brands") view = "partners";
    setRoute({ view, ...(opts && opts.cat ? { cat: opts.cat } : {}) });
    if (view === "catalog") {
      /* Категорию нужно донести до каталожной оболочки: раньше здесь всегда
         стоял sub «home», и любая ссылка на раздел — плитки на главной, пункты
         меню — открывала корень каталога, потеряв выбранную категорию. */
      const cat = opts && opts.cat;
      /* dir/q/badge/brand игнорировались точно так же — ссылка «Навигация по
         направлениям» на главной вызывала go("catalog",{dir}), но dir нигде
         не сохранялся: ни в catNav, ни в адресе. Каталог на долю секунды
         показывал отфильтрованный список (react-состояние route ещё несло
         opts), а следующий цикл событий перечитывал catNav/URL, где dir уже
         потерян, и откатывался на витрину. Без cat используем ту же query-
         строку, что и catHashFromRoute для адреса — так оба места
         (catNav.param и сам URL) остаются источником одной и той же правды. */
      if (cat) {
        setCatNav({ sub: "listing", param: cat, q: "", from: null });
        setHashSafe("/catalog/" + catSlugOf(cat));
      } else {
        const qs = new URLSearchParams();
        ["dir", "q", "badge", "brand"].forEach((k) => { if (opts && opts[k]) qs.set(k, opts[k]); });
        const qsStr = qs.toString();
        setCatNav({ sub: "home", param: qsStr, q: "", from: null });
        setHashSafe(qsStr ? "/catalog?" + qsStr : "/catalog");
      }
    } else
    setHashSafe(corpHash(view));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  /* unified header: jump straight into a catalog sub-view (cart / wishlist / compare / search) */
  const goCat = (sub, param, q, from) => {
    setCatReady(true);
    setRoute({ view: "catalog" });
    setCatNav({ sub: sub || "home", param: param || "", q: q || "", from: from || null });
    setHashSafe(q ? "/catalog" : sub && sub !== "home" && sub !== "listing" ? "/catalog/" + sub + (param ? "/" + param : "") : "/catalog");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  /* Пришли по старой ссылке с якорем — молча переписываем адрес в новую форму.
     replaceState, а не pushState: иначе кнопка «назад» возвращала бы на тот же
     экран со старым адресом. */
  useEffect(() => {
    const legacy = legacyHashSegments();
    if (!legacy.length || segmentsOfPath().length) return;
    const r = parseSegments(legacy);
    const url = r.view === "catalog" ? catHashFromRoute(
      r.cat && r.cat.sub === "listing" ? "catalog" : (r.cat && r.cat.sub) || "home",
      r.cat && r.cat.sub === "listing" ? { cat: r.cat.param } : { id: (r.cat || {}).param, p: (r.cat || {}).param }
    ) : corpHash(r.view);
    history.replaceState({ soi: true }, "", url);
  }, []);

  /* ---- deep-link: react to history changes (back/forward, manual) ---- */
  useEffect(() => {
    const onHash = () => {
      const r = parseUrl();
      // unified news: catalog/news deep-link always shows the single corp news page (form 1)
      if (_isCatNews(r)) { setRoute({ view: "news", from: "catalog" }); setHashSafe(corpHash("news")); window.scrollTo({ top: 0, behavior: "instant" }); return; }
      setRoute({ view: r.view });
      if (r.view === "catalog") {
        setCatNav(r.cat || { sub: "home", param: "" });
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", onHash);
    return () => window.removeEventListener("popstate", onHash);
  }, []);


  /* ---- deep-link: reflect catalog's internal route into the URL hash ---- */
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "soi-cohome") {setRoute({ view: "home" });setHashSafe("/");window.scrollTo({ top: 0, behavior: "instant" });return;}
      if (d.type === "soi-conav" && d.view) {
        setRoute({ view: d.view, from: d.from || null });
        setHashSafe(corpHash(d.view));
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      if (d.type !== "soi-route") return;
      const newHash = catHashFromRoute(d.view, d.params);
      setHashSafe(newHash);
      // Keep catNav in step with the catalog's own route — see catNavFromRoute.
      setCatNav(Object.assign({ q: "", from: null }, catNavFromRoute(d.view, d.params)));
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
      staffTraining: lang === "uz" ? "Xodimlarni oʻqitish" : lang === "en" ? "Staff training" : "Обучение персонала",
      serviceSupport: lang === "uz" ? "Servis va qo'llab-quvvatlash" : lang === "en" ? "Service & support" : "Сервис и поддержка",
      tenders: t.nav_tenders, documents: t.nav_documents, news: t.nav_news, projects: t.nav_projects,
      partners: t.nav_partners, licenses: t.nav_licenses, services: t.nav_services, contacts: t.nav_contacts,
      reviews: lang === "uz" ? "Sharhlar" : lang === "en" ? "Reviews" : "Отзывы и рекомендации"
    };
    const label = v === "home" ? "" : M[v] || "";
    /* Заголовок главной берётся из настройки site_seo, а она одна на весь сайт
       и написана по-русски. На английской и узбекской версии вкладка, превью
       ссылки в мессенджере и выдача всё равно показывали русский текст —
       притом что внутренние страницы давно переводятся. Настройку используем
       только там, где её язык совпадает с языком страницы. */
    const homeTitle = (lang === "ru" && seo.title) ? seo.title : (BRAND + " — " + SUB);
    document.title = v === "home" ? homeTitle : (label ? label + " — " + BRAND : BRAND + " — " + SUB);
  }, [route.view, lang, t, seo.title]);

  /* ---- site SEO meta tags (admin/seo.jsx → site_seo setting) ---- */
  useEffect(() => {
    const setMeta = (selector, value) => {
      if (!value) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };
    /* Та же причина, что и у заголовка: настройки в админке заполнены
       по-русски, и на других языках они давали русское описание в превью
       ссылки. Ключевые слова и robots от языка не зависят — их оставляем. */
    const BRAND_M = lang === "uz" ? "SOG’LIQ INDUSTRIYASI" : lang === "en" ? "HEALTH INDUSTRY" : "ИНДУСТРИЯ ЗДОРОВЬЯ";
    const localTitle = lang === "ru" ? seo.title
      : BRAND_M + (lang === "uz" ? " — Tibbiy uskunalar yetkazib beruvchi" : " — Medical equipment supplier");
    const localDesc = lang === "ru" ? seo.description : (lang === "uz"
      ? "O‘zbekistonda tibbiy uskunalar, mebel va sarflanadigan materiallar yetkazib berish: ro‘yxatdan o‘tkazish, montaj, servis va xodimlarni o‘qitish."
      : "Supplier of medical equipment, furniture and consumables in Uzbekistan: device registration, installation, service and staff training.");
    setMeta('meta[name="description"]', localDesc);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[name="robots"]', seo.robots);
    setMeta('meta[property="og:title"]', localTitle);
    setMeta('meta[property="og:description"]', localDesc);
    setMeta('meta[property="og:image"]', seo.og_image);
    setMeta('meta[name="twitter:title"]', localTitle);
    setMeta('meta[name="twitter:description"]', localDesc);
  }, [seo, lang]);
  let page;
  const v = route.view;
  const isCatalog = v === "catalog";
  if (v === "home") page = <CoHomePage t={t} lang={lang} go={go} data-comment-anchor="4d3f2cce89-b-29-46" />;else
  if (v === "catalog") page = null;else
  if (v === "about") page = <AboutPage t={t} lang={lang} go={go} />;else
  if (v === "directions") page = <ServicesPage t={t} lang={lang} go={go} />;else
  if (v === "registration") page = <RegistrationPage t={t} lang={lang} go={go} />;else
  if (v === "staffTraining") page = <StaffTrainingPage t={t} lang={lang} go={go} goCat={goCat} />;else
  if (v === "serviceSupport") page = <ServiceSupportPage t={t} lang={lang} go={go} goCat={goCat} />;else
  if (v === "tenders") page = <CoTendersPage t={t} lang={lang} go={go} initialCat={route.cat} />;else
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
      <ScrollProgress />
      <CoHeader t={t} lang={lang} setLang={setLang} go={go} goCat={goCat} route={route} theme={theme} toggleTheme={toggleTheme} data-comment-anchor="b2aa7d60a7-a-121-13" />
      {/* Каталог открыт, а его бандлы ещё едут. Раньше этого промежутка не
          было — файлы приходили вместе со страницей, — и без заглушки под
          шапкой осталась бы пустота. Плитки повторяют сетку каталога, чтобы
          подмена на настоящую верстку не дёргала страницу. */}
      {isCatalog && !catReady && !catFailed && (
        <div className="cat-boot wrap" role="status" aria-live="polite">
          <span className="cat-boot-sr">{lv("Загружаем каталог…", "Katalog yuklanmoqda…", "Loading catalog…")}</span>
          <div className="cat-boot-bar" />
          <div className="cat-boot-grid">
            {[0,1,2,3,4,5,6,7].map((i) => <div key={i} className="cat-boot-card" />)}
          </div>
        </div>
      )}
      {isCatalog && catFailed && (
        <div className="cat-boot wrap">
          <p className="cat-boot-err">
            {lv("Не удалось загрузить каталог. Проверьте соединение и обновите страницу.",
                "Katalogni yuklab bo'lmadi. Aloqani tekshiring va sahifani yangilang.",
                "Could not load the catalog. Check your connection and reload the page.")}
          </p>
          <button className="btn btn-pri" onClick={() => location.reload()}>
            {lv("Обновить", "Yangilash", "Reload")}
          </button>
        </div>
      )}
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
          <CoFooter t={t} lang={lang} go={go} goCat={goCat} setLang={setLang} />
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
          value={tw.accent === "cyan" ? "var(--blue-600)" : tw.accent === "lavender" ? "var(--blue-600)" : "var(--blue-600)"}
          options={["var(--blue-600)", "var(--blue-600)", "var(--blue-600)"]}
          onChange={(v) => setTweak("accent", v === "var(--blue-600)" ? "cyan" : v === "var(--blue-600)" ? "lavender" : "blue")} />
      </TweaksPanel>
      }
      {!isCatalog && <FloatingWidgets lang={lang} go={go} />}
      <BackToTop />
      {/* Без условия по разделу: согласие спрашивается при входе на сайт, на
          какую бы страницу человек ни попал. goCat нужен для ссылки на
          политику — она живёт в каталожной оболочке. */}
      <CookieBanner lang={lang} go={go} goCat={goCat} />
    </div>);

}

ReactDOM.createRoot(document.getElementById("si-root")).render(
  <RootErrorBoundary><App /></RootErrorBoundary>
);