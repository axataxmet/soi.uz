/* UzMedEx — app root: store, routing, shell */

function useStore() {
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const [cart, setCart] = useState(() => load("uzmedex_cart", []));
  const [wishlist, setWishlist] = useState(() => load("uzmedex_wish", []));
  const [compare, setCompare] = useState(() => load("uzmedex_cmp", []));

  useEffect(() => { localStorage.setItem("uzmedex_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("uzmedex_wish", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("uzmedex_cmp", JSON.stringify(compare)); }, [compare]);

  const cartCount = cart.reduce((s, c) => s + c.q, 0);

  /* publish counts so the unified host header (soi.uz corp shell) can mirror them */
  useEffect(() => {
    try {
      window.__catCounts = { cart: cartCount, wish: wishlist.length, cmp: compare.length };
      window.dispatchEvent(new CustomEvent("cat-store", { detail: window.__catCounts }));
    } catch (e) {}
  }, [cartCount, wishlist.length, compare.length]);

  return {
    cart, wishlist, compare, cartCount,
    addToCart(id, q = 1) {
      setCart((c) => {
        const ex = c.find((x) => x.id === id);
        if (ex) return c.map((x) => x.id === id ? { ...x, q: x.q + q } : x);
        return [...c, { id, q }];
      });
      window.__toast && window.__toast();
    },
    removeFromCart(id) { setCart((c) => c.filter((x) => x.id !== id)); },
    setQty(id, q) { setCart((c) => c.map((x) => x.id === id ? { ...x, q } : x)); },
    clearCart() { setCart([]); },
    toggleWish(id) { setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]); },
    toggleCompare(id) {
      setCompare((c) => c.includes(id) ? c.filter((x) => x !== id) : (c.length >= 4 ? c : [...c, id]));
    },
    clearCompare() { setCompare([]); },
  };
}

const _Q = new URLSearchParams(typeof location !== "undefined" ? location.search : "");
const EMBED = _Q.get("embed") === "1";

/* SEO: единый BreadcrumbList JSON-LD (schema.org). Оба хлебных компонента
   (каталожный Breadcrumbs и корпоративный CoBreadcrumbs) пишут в один <script>. */
function __setCrumbsLD(items) {
  var ID = "soi-breadcrumbs-ld";
  var el = document.getElementById(ID);
  if (!items || !items.length) { if (el) el.remove(); return; }
  var data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map(function (c, i) {
      var li = { "@type": "ListItem", "position": i + 1, "name": c.label };
      if (c.url && i < items.length - 1) li.item = c.url; // у текущей страницы item не нужен
      return li;
    }),
  };
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
window.__setCrumbsLD = __setCrumbsLD;

/* SEO: одна canonical-ссылка. Каталожная витрина брендов удалена — единственная
   страница брендов и производителей теперь корпоративная, #/partners. */
function __setCanonical(url) {
  var el = document.querySelector('link[rel="canonical"]');
  if (!url) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
  el.href = url;
}
window.__setCanonical = __setCanonical;

function Breadcrumbs({ t, lang, go, route, embed, active }) {
  const v = route.view, p = route.params || {};
  const lvl = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const T = (o) => !o ? "" : (lang === "uz" ? (o.uz || o.ru) : lang === "en" ? (o.en || o.ru) : o.ru);
  // Адреса разделов — обычные пути, поэтому от текущей страницы берём только origin.
  const base = location.origin;
  // Каталог живёт в одном документе с корп-шеллом (news.jsx слушает message на window),
  // поэтому шлём и при window.parent === window — старый guard времён iframe глушил клик.
  const goHome = () => { try { (window.parent || window).postMessage({ type: "soi-cohome" }, "*"); } catch (e) {} };
  const crumbs = [
    { label: lvl("Главная", "Bosh sahifa", "Home"), onClick: goHome, url: base + "/" },
  ];
  if (v === "home") {
    crumbs.push({ label: lvl("Каталог", "Katalog", "Catalog") });
  } else {
    crumbs.push({ label: lvl("Каталог", "Katalog", "Catalog"), onClick: () => go("catalog", {}), url: base + "/catalog" });
    if (v === "product") {
      const prod = (window.DATA?.PRODUCTS || []).find((x) => x.id === p.id);
      const cat = prod && (window.DATA?.CATEGORIES || []).find((c) => c.id === prod.cat);
      const sub = (cat && prod.sub != null && cat.subs) ? cat.subs[prod.sub] : null;
      /* Цепочка обрывается на товарной группе — пятом уровне — и названия
         товара не содержит: решение заказчика. Заголовок карточки и так стоит
         первым на странице, а крошки остаются путём по дереву разделов. */
      const grp = (sub && prod.group) ? (sub.groups || []).find((g) => g._id === prod.group) : null;
      const catUrl = cat ? base + "/catalog/" + (cat.slug || cat.id) : "";
      const subUrl = (cat && sub) ? catUrl + "/" + (sub.slug || sub._id) : "";
      if (cat) crumbs.push({ label: T(cat), onClick: () => go("catalog", { cat: cat.id }), url: catUrl });
      if (sub) crumbs.push({ label: T(sub), onClick: () => go("catalog", { cat: cat.id, sub: prod.sub }), url: subUrl });
      if (grp) crumbs.push({ label: T(grp), onClick: () => go("catalog", { cat: cat.id, sub: prod.sub, group: grp.slug || grp._id }), url: subUrl + "/" + (grp.slug || grp._id) });
    } else if (v === "catalog") {
      const cat = (window.DATA?.CATEGORIES || []).find((c) => c.id === p.cat || c.slug === p.cat);
      /* Внутри подраздел — индекс в cat.subs, а из адреса (/catalog/equipment/obstetrics)
         он приходит слагом. Без приведения cat.subs[slug] давал undefined и крошка
         подраздела молча пропадала. Резолвим на каждый рендер, как CatalogPage. */
      const subIdx = (() => {
        if (p.sub == null || !cat) return null;
        if (typeof p.sub === "number") return p.sub;
        const i = (cat.subs || []).findIndex((s) => s.slug === p.sub || s._id === p.sub);
        return i >= 0 ? i : null;
      })();
      const sub = cat && subIdx != null ? cat.subs[subIdx] : null;
      if (cat && sub) {
        const catUrl = base + "/catalog/" + (cat.slug || cat.id);
        const subUrl = catUrl + "/" + (sub.slug || sub._id);
        crumbs.push({ label: T(cat), onClick: () => go("catalog", { cat: cat.id }), url: catUrl });
        const grp = p.group ? (sub.groups || []).find((g) => g._id === p.group || g.slug === p.group) : null;
        if (grp) {
          crumbs.push({ label: T(sub), onClick: () => go("catalog", { cat: cat.id, sub: subIdx }), url: subUrl });
          crumbs.push({ label: T(grp), url: subUrl + "/" + (grp.slug || grp._id) });
        } else {
          crumbs.push({ label: T(sub), url: subUrl });
        }
      } else if (cat) {
        crumbs.push({ label: T(cat) });
      } else if (p.dir) {
        const dir = (window.CMS ? window.CMS.list("cat_directions") : []).find((d) => d.id === p.dir);
        crumbs.push({ label: dir ? T(dir) : lvl("Направление", "Yo'nalish", "Direction") });
      } else if (p.q) {
        crumbs.push({ label: lvl("Поиск", "Qidiruv", "Search") + ": " + p.q });
      } else {
        // корень каталога: «Главная / Каталог» — Каталог как текущая страница
        crumbs.pop();
        crumbs.push({ label: lvl("Каталог", "Katalog", "Catalog") });
      }
    } else {
      const M = {
        cart: lvl("Корзина / Запрос КП","Savat / KP","Cart / RFQ"), wishlist: lvl("Избранное","Saralangan","Wishlist"),
        compare: lvl("Сравнение","Taqqoslash","Compare"), brand: lvl("Бренд","Brend","Brand"),
        account: lvl("Личный кабинет","Kabinet","Account"),
        price: lvl("Прайс-лист","Narxlar","Price list"),
        news: lvl("Новости","Yangiliklar","News"),
        tracking: lvl("Отслеживание","Kuzatish","Tracking"), info: lvl("О компании","Kompaniya","About"),
        tenders: lvl("Тендеры","Tenderlar","Tenders"), faq: "FAQ", sitemap: lvl("Карта сайта","Sayt xaritasi","Sitemap"),
      };
      if (M[v]) crumbs.push({ label: M[v] });
    }
  }
  // SEO-разметка: пишем только когда каталожная оболочка реально видима,
  // иначе скрытый (display:none) каталог перетирал бы крошки корп-страниц.
  const ldKey = crumbs.map((c) => c.label).join("|");
  React.useEffect(() => {
    if (!embed || active === false) return;
    __setCrumbsLD(crumbs.map((c) => ({ label: c.label, url: c.url })));
    __setCanonical(null);
  }, [ldKey, embed, active]);
  if (!embed) return null;
  return (
    <nav className="crumbs" aria-label="breadcrumb">
      <div className="wrap">
        {crumbs.map((c, i) => {
          /* На карточке товара цепочка обрывается на разделе, а не на текущей
             странице, поэтому последнее звено там остаётся обычной ссылкой:
             помечать его aria-current="page" было бы неправдой, а лишать
             ссылки — отнимать единственный путь наверх. */
          const last = i === crumbs.length - 1 && v !== "product";
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="crumb-sep">/</span>}
              {last || !c.onClick
                ? <span className="crumb-cur" aria-current={last ? "page" : undefined}>{c.label}</span>
                : <a className="crumb-lnk" onClick={c.onClick}>{c.label}</a>}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

function embedRouteFrom(sub, param, q) {
  if (q) return { view: "catalog", params: { q } };
  if (!sub || sub === "home") return { view: "catalog", params: {} };
  if (sub === "product") return { view: "product", params: { id: param } };
  if (sub === "listing") {
    if (!param) return { view: "catalog", params: {} };
    // The shell packs an optional subcategory as "catSlug/subSlug" into one
    // string (catNav only carries one param field) — unpack it. The subcategory
    // stays a raw slug here rather than being resolved to an array index: this
    // runs synchronously at page load, before window.DATA.CATEGORIES has had a
    // chance to arrive from the API, so any lookup here would silently drop it.
    // CatalogPage re-resolves the slug to an index on every render instead,
    // which self-heals once the category data actually shows up.
    /* Вид списка едет в том же одном строковом поле, что и путь по дереву —
       строкой запроса на его конце: catNav несёт ровно один param. */
    const [pathPart, qs] = param.split("?");
    const [catPart, subPart, groupPart] = pathPart.split("/");
    const params = { cat: catPart };
    if (subPart) params.sub = subPart;
    if (groupPart) params.group = groupPart;
    if (qs && /(^|&)view=grid(&|$)/.test(qs)) params.view = "grid";
    return { view: "catalog", params };
  }
  if (sub === "brand") return { view: "brand", params: { id: param } };
  if (sub === "info") return { view: "info", params: { p: param } };
  return { view: sub, params: {} };
}
function embedInitialRoute() {
  if (!EMBED) return { view: "home", params: {} };
  return embedRouteFrom(_Q.get("view"), _Q.get("p1") || "");
}

// Unified news: the catalog never renders its own news page — it redirects to the
// single corporate news page (form 1). Used as a safety net for any "news" route.
function CatalogNewsRedirect({ embed }) {
  useEffect(() => {
    try { (window.parent || window).postMessage({ type: "soi-conav", view: "news", from: "catalog" }, "*"); } catch (e) {}
  }, []);
  return null;
}

function App(props) {
  props = props || {};
  const EMBED_ON = props.embed != null ? props.embed : EMBED;
  const [lang, setLangState] = useState(() => props.lang || _Q.get("lang") || localStorage.getItem("uzmedex_lang") || "ru");
  const setLang = (l) => { setLangState(l); localStorage.setItem("uzmedex_lang", l); };
  useEffect(() => { if (props.lang && props.lang !== lang) setLangState(props.lang); }, [props.lang]);
  const [theme, setThemeState] = useState(() => props.theme || _Q.get("theme") || localStorage.getItem("uzmedex_theme") || "light");
  useEffect(() => { if (props.theme && props.theme !== theme) { setThemeState(props.theme); document.documentElement.setAttribute("data-theme", props.theme); } }, [props.theme]);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    localStorage.setItem("uzmedex_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  /* ---- embed mode: receive lang/theme from host shell (soi.uz) ---- */
  useEffect(() => {
    if (EMBED_ON) document.documentElement.classList.add("embed");
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type !== "soi-set") return;
      if (d.lang) setLangState(d.lang);
      if (d.theme) { setThemeState(d.theme); document.documentElement.setAttribute("data-theme", d.theme); }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  const t = window.I18N[lang];
  const store = useStore();

  const [route, setRoute] = useState(() => props.embed ? embedRouteFrom(props.initialSub, props.initialParam) : embedInitialRoute());
  useEffect(() => {
    if (props.embed && props.navSub !== undefined) {
      // unified news: a catalog deep-link to news redirects to the single corp news page (form 1)
      if (props.navSub === "news") {
        try { (window.parent || window).postMessage({ type: "soi-conav", view: "news", from: "catalog" }, "*"); } catch (e) {}
        return;
      }
      setRoute(Object.assign(embedRouteFrom(props.navSub, props.navParam, props.navQ), { from: props.navFrom || null }));
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [props.navSub, props.navParam, props.navQ, props.navFrom]);
  const [query, setQuery] = useState("");
  const [openMega, setOpenMega] = useState(false);
  const [quote, setQuote] = useState(null); // null | {product}
  const [toast, setToast] = useState(false);

  // Re-render when the remote catalog feed (window.DATA) arrives/updates from the API.
  // catalog-remote.js fetches asynchronously and dispatches "soi-data-changed".
  const [, _setDataTick] = useState(0);
  useEffect(() => {
    const h = () => _setDataTick((x) => x + 1);
    window.addEventListener("soi-data-changed", h);
    return () => window.removeEventListener("soi-data-changed", h);
  }, []);

  const go = (view, params = {}) => {
    setOpenMega(false);
    // Unified news: any "Новости" entry inside the catalog routes to the single
    // corporate news page (form 1), not the catalog's own listing.
    if (view === "news" && EMBED_ON) {
      try { (window.parent || window).postMessage({ type: "soi-conav", view: "news", from: "catalog" }, "*"); } catch (e) {}
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      return;
    }
    setRoute({ view, params });
    if (EMBED_ON) {
      try { (window.parent || window).postMessage({ type: "soi-route", view, params }, "*"); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  /* ---- embed: host shell asks us to navigate (deep-link / back-forward) ---- */
  useEffect(() => {
    if (!EMBED) return;
    const onNav = (e) => {
      const d = e.data || {};
      if (d.type !== "soi-nav") return;
      // unified news: deep-link #/catalog/news redirects to the single corp news page (form 1)
      if (d.sub === "news") {
        try { (window.parent || window).postMessage({ type: "soi-conav", view: "news", from: "catalog" }, "*"); } catch (e) {}
        return;
      }
      const r = embedRouteFrom(d.sub, d.param);
      setOpenMega(false);
      setRoute(r);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    };
    window.addEventListener("message", onNav);
    return () => window.removeEventListener("message", onNav);
  }, []);

  useEffect(() => {
    window.__openQuote = (product) => setQuote({ product: product || null });
    window.__toast = () => { setToast(true); clearTimeout(window.__tt); window.__tt = setTimeout(() => setToast(false), 1800); };
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  /* ---- dynamic tab title per route ---- */
  useEffect(() => {
    if (EMBED_ON && !props.active) return;
    const v = route.view, p = route.params || {};
    const BRAND = "ИНДУСТРИЯ ЗДОРОВЬЯ";
    const SUB = lang === "uz" ? "Tibbiy uskunalar katalogi" : lang === "en" ? "Medical equipment catalog" : "Каталог медицинского оборудования";
    let label = "";
    if (v === "home") label = "";
    else if (v === "product") {
      const prod = (window.DATA?.PRODUCTS || []).find((x) => x.id === p.id);
      label = prod ? (lang === "uz" ? prod.uz : lang === "en" ? (prod.en || prod.ru) : prod.ru) : (t.product || "Товар");
    } else if (v === "catalog") {
      const cat = (window.DATA?.CATEGORIES || []).find((c) => c.id === p.cat || c.slug === p.cat);
      label = cat ? (lang === "uz" ? cat.uz : lang === "en" ? cat.en : cat.ru) : (t.catalog || "Каталог");
    } else {
      const lvl = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
      const M = {
        cart: lvl("Корзина / Запрос КП","Savat / KP soʻrovi","Cart / RFQ"),
        wishlist: lvl("Избранное","Saralangan","Wishlist"),
        compare: lvl("Сравнение","Taqqoslash","Compare"),
        brand: lvl("Бренд","Brend","Brand"),
        account: lvl("Личный кабинет","Shaxsiy kabinet","Account"),
        price: lvl("Прайс-лист","Narxlar roʻyxati","Price list"),
        news: lvl("Новости и статьи","Yangiliklar va maqolalar","News & articles"),
        tracking: lvl("Отслеживание заказа","Buyurtmani kuzatish","Order tracking"),
        info: lvl("О компании","Kompaniya haqida","About"),
        tenders: lvl("Тендеры и госзакупки","Tenderlar","Tenders"),
        faq: lvl("Частые вопросы","Savol-javob","FAQ"),
        sitemap: lvl("Карта сайта","Sayt xaritasi","Sitemap"),
      };
      label = M[v] || "";
    }
    document.title = label ? (label.split(",")[0] + " — " + BRAND) : (BRAND + " — " + SUB);
  }, [route.view, route.params, lang, t]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ---- skeleton transition on route / language change ---- */
  const [loading, setLoading] = useState(false);
  const routeKey = route.view + "|" + JSON.stringify(route.params) + "|" + lang;
  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(id);
  }, [routeKey]);

  let page = null;
  const v = route.view, p = route.params;
  if (v === "home") page = <HomePage t={t} lang={lang} store={store} go={go} />;
  else if (v === "catalog") {
    const hasParams = p && (p.cat != null || p.dir || p.q || p.badge || p.brand || p.sub != null);
    page = hasParams
      ? <CatalogPage t={t} lang={lang} store={store} go={go} params={p} />
      : <CatalogLandingPage t={t} lang={lang} store={store} go={go} />;
  }
  else if (v === "product") page = <ProductPage t={t} lang={lang} store={store} go={go} params={p} />;
  else if (v === "cart") page = <CartPage t={t} lang={lang} store={store} go={go} />;
  else if (v === "wishlist") page = <SimpleListPage t={t} lang={lang} store={store} go={go} ids={store.wishlist} title={t.wishlist} emptyTitle={lang === "uz" ? "Saralangan boʻsh" : lang === "en" ? "Your wishlist is empty" : "В избранном пусто"} emptyIcon="heart" />;
  else if (v === "compare") page = <ComparePage t={t} lang={lang} store={store} go={go} />;
  else if (v === "brand")   page = <BrandPage t={t} lang={lang} store={store} go={go} params={p} />;
  /* Страницы «Комплекты», «Калькулятор» и список брендов удалены: в меню каталога
     их нет, разделы каталога ограничены пятью категориями и прайс-листом. */
  else if (v === "account") page = <AccountPage t={t} lang={lang} store={store} go={go} />;
  else if (v === "price")    page = <PricePage t={t} lang={lang} store={store} go={go} />;
  else if (v === "news")     page = <CatalogNewsRedirect embed={EMBED_ON} />;
  else if (v === "tracking") page = <TrackingPage t={t} lang={lang} go={go} />;
  else if (v === "info")    page = <InfoPage t={t} lang={lang} go={go} params={p} />;
  else if (v === "tenders") page = <TendersPage t={t} lang={lang} go={go} />;
  else if (v === "faq")     page = <FaqPage t={t} lang={lang} go={go} />;
  else if (v === "sitemap") page = <SitemapPage t={t} lang={lang} go={go} />;
  /* Неизвестный раздел — открываем корень каталога. Иначе старая ссылка или
     закладка на удалённые «Комплекты», «Калькулятор» и витрину брендов давала
     пустой белый экран. */
  else page = <CatalogLandingPage t={t} lang={lang} store={store} go={go} />;

  return (
    <div className="app">
      <UtilityBar t={t} lang={lang} setLang={setLang} go={go} theme={theme} toggleTheme={toggleTheme} />
      <Header t={t} lang={lang} store={store} go={go} query={query} setQuery={setQuery} onHamburger={()=>setDrawerOpen(true)} />
      <MobileDrawer t={t} lang={lang} go={go} store={store} open={drawerOpen} onClose={()=>setDrawerOpen(false)} />
      {/* Вторая строка каталога («По направлениям медицины · Оборудование · Мебель ·
          Инструменты · Расходные материалы · Прайс-лист · Ещё») убрана по решению
          заказчика: она повторяла разделы, которые и так есть в шапке и плитками на
          самой странице, и занимала полосу под шапкой на каждом экране. Вход в
          мега-меню остался в липкой панели — кнопка «Каталог». */}
      <Breadcrumbs t={t} lang={lang} go={go} route={route} embed={EMBED_ON} active={props.active} />
      <StickyBar t={t} lang={lang} setLang={setLang} store={store} go={go} query={query} setQuery={setQuery} theme={theme} toggleTheme={toggleTheme} openMega={openMega} setOpenMega={setOpenMega} route={route} />
      {openMega && <MegaMenu t={t} lang={lang} go={go} onClose={() => setOpenMega(false)} />}
      <main className="app-main">{loading ? <PageSkeleton view={v} /> : <div key={routeKey} className="page-fade">{page}</div>}</main>
      <Footer t={t} lang={lang} go={go} setLang={setLang} />
      <CompareBar t={t} lang={lang} store={store} go={go} />
      {quote && <QuoteModal t={t} lang={lang} product={quote.product} onClose={() => setQuote(null)} />}
      <QuickViewPortal t={t} lang={lang} store={store} go={go} />
      {toast && (
        <div className="toast">
          <span className="t-ic"><Icon name="check" size={16} sw={2.6} /></span>
          {t.added}
        </div>
      )}
      <MobileBottomNav t={t} lang={lang} store={store} go={go} />
      <FloatingWidgets lang={lang} go={go} />
      <CookieBanner lang={lang} go={go} />
      <UzTweaks lang={lang} />
    </div>
  );
}

const _root_el = document.getElementById("root");
if (_root_el) {
  const _root = ReactDOM.createRoot(_root_el);
  _root.render(<RootErrorBoundary><App /></RootErrorBoundary>);
  // Remove splash after first paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (window.__splashDone) window.__splashDone();
  }));
}
Object.assign(window, { CatalogApp: App });
