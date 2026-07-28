/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Main app with auth + routing */
(function () {
  const { useState, useEffect } = React;

  /* ── Auth (server JWT via window.api) ── */
  function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
      e.preventDefault();
      setBusy(true); setError("");
      try {
        await window.api.login(email.trim(), password);
        window.dispatchEvent(new CustomEvent("soi-auth-changed"));
        onLogin();
      } catch (err) {
        setError(err && err.message ? err.message : "Не удалось войти");
        setPassword("");
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="adm-login-wrap">
        <div className="adm-login-box">
          <div className="adm-login-logo">SI</div>
          <h1 className="adm-login-title">ИНДУСТРИЯ ЗДОРОВЬЯ</h1>
          <p className="adm-login-sub">Вход в панель управления</p>
          <form className="adm-form" onSubmit={submit}>
            {error && <div className="adm-login-err">{error}</div>}
            <Field label="E-mail">
              <input
                className="adm-input"
                type="email"
                value={email}
                autoFocus
                onChange={e => { setEmail(e.target.value); setError(""); }}
              />
            </Field>
            <Field label="Пароль">
              <div style={{ position: "relative" }}>
                <input
                  className="adm-input"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  style={{ paddingRight: 40 }}
                />
                <button type="button" className="btn btn-ghost btn-icon" style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }} onClick={() => setShow(s => !s)}>
                  <AdminIcon name={show ? "eyeoff" : "eye"} size={16} />
                </button>
              </div>
            </Field>
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Вход…" : "Войти"}</button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Sidebar nav ── */
  const NAV = [
    { section: "Главное" },
    { view: "dashboard",    label: "Дашборд",          icon: "home" },
    { view: "analytics",    label: "Аналитика",         icon: "chart" },
    { section: "Каталог" },
    { view: "products",     label: "Товары",            icon: "package",    badge: null },
    { view: "manufacturers",label: "Бренды",            icon: "tag" },
    { view: "catalog",      label: "Категории",         icon: "filetext" },
    { view: "specs",        label: "Направления",       icon: "filetext" },
    { view: "import",       label: "Импорт / Экспорт",  icon: "import" },
    { section: "Контент" },
    { view: "homepage",     label: "Главная страница",  icon: "home" },
    { view: "servicepage",  label: "Сервис и поддержка", icon: "settings" },
    { view: "news",         label: "Новости",           icon: "news" },
    { view: "cases",        label: "Кейсы",             icon: "briefcase" },
    { view: "documents",    label: "Документы",         icon: "filetext" },
    { view: "team",         label: "Команда",           icon: "users" },
    { section: "CRM" },
    { view: "submissions",  label: "Заявки",            icon: "mail",       badge: "new" },
    { view: "orders",       label: "Заказы",            icon: "package" },
    { view: "reviews",      label: "Отзывы",            icon: "star" },
    { section: "Система" },
    { view: "media",        label: "Медиатека",         icon: "image" },
    { view: "navmenu",      label: "Меню",              icon: "bars" },
    { view: "users",        label: "Пользователи",      icon: "users" },
    { view: "seo",          label: "SEO",               icon: "globe" },
    { view: "misc",         label: "Настройки",         icon: "settings" },
  ];

  const ROUTES = {
    dashboard: "/admin",
    analytics: "/admin/analytics",
    products: "/admin/products",
    "product-new": "/admin/products/new",
    manufacturers: "/admin/brands",
    catalog: "/admin/catalog",
    specs: "/admin/specs",
    import: "/admin/import",
    homepage: "/admin/homepage",
    servicepage: "/admin/service-support",
    news: "/admin/news",
    "news-new": "/admin/news/new",
    cases: "/admin/cases",
    documents: "/admin/documents",
    team: "/admin/team",
    submissions: "/admin/submissions",
    orders: "/admin/orders",
    reviews: "/admin/reviews",
    media: "/admin/media",
    navmenu: "/admin/menu",
    users: "/admin/users",
    seo: "/admin/seo",
    misc: "/admin/settings",
  };

  const SEGMENT_TO_VIEW = {
    dashboard: "dashboard",
    analytics: "analytics",
    products: "products",
    brands: "manufacturers",
    manufacturers: "manufacturers",
    catalog: "catalog",
    specs: "specs",
    directions: "specs",
    import: "import",
    homepage: "homepage",
    "service-support": "servicepage",
    servicepage: "servicepage",
    news: "news",
    cases: "cases",
    documents: "documents",
    team: "team",
    submissions: "submissions",
    orders: "orders",
    reviews: "reviews",
    media: "media",
    menu: "navmenu",
    navmenu: "navmenu",
    users: "users",
    seo: "seo",
    settings: "misc",
    misc: "misc",
  };

  function cleanRoutePart(part) {
    return decodeURIComponent(String(part || "")).replace(/^\/+|\/+$/g, "");
  }

  function parseRouteParts(parts) {
    if (!parts.length) return { view: "dashboard", params: {} };
    if (parts[0] === "products" && parts[1] === "new") return { view: "product-new", params: {} };
    if (parts[0] === "products" && parts[1] === "edit" && parts[2]) {
      return { view: "product-edit", params: { id: parts[2] } };
    }
    if (parts[0] === "product-edit" && parts[1]) return { view: "product-edit", params: { id: parts[1] } };
    if (parts[0] === "product-new") return { view: "product-new", params: {} };
    if (parts[0] === "news" && parts[1] === "new") return { view: "news-new", params: {} };
    return { view: SEGMENT_TO_VIEW[parts[0]] || "dashboard", params: {} };
  }

  function readAdminRoute() {
    const path = window.location.pathname || "";
    let adminPart = "";

    if (path === "/admin.html") {
      adminPart = "";
    } else if (path === "/admin" || path === "/admin/") {
      adminPart = "";
    } else if (path.indexOf("/admin/") === 0) {
      adminPart = path.slice("/admin/".length);
    }

    if (!adminPart && window.location.hash) {
      const hashPart = cleanRoutePart(window.location.hash.replace(/^#\/?/, ""));
      if (hashPart) adminPart = hashPart;
    }

    const parts = cleanRoutePart(adminPart).split("/").filter(Boolean);
    return parseRouteParts(parts);
  }

  function routeUrl(view, params) {
    if (view === "product-edit") {
      return "/admin/products/edit/" + encodeURIComponent((params && params.id) || "");
    }
    return ROUTES[view] || "/admin";
  }

  function syncUrl(view, params, mode) {
    const url = routeUrl(view, params);
    if (window.location.pathname + window.location.search + window.location.hash === url) return;
    window.history[mode === "replace" ? "replaceState" : "pushState"]({ view, params: params || {} }, "", url);
  }

  function AdminSidebar({ view, go, onLogout }) {
    const newSubmissions = window.CMS ? window.CMS.list("submissions").filter(s => !s.status || s.status === "new").length : 0;

    return (
      <aside className="adm-sidebar">
        <div className="adm-logo">
          <div className="adm-logo-mark">SI</div>
          <div>
            <div className="adm-logo-text">ИНДУСТРИЯ ЗДОРОВЬЯ</div>
            <div className="adm-logo-sub">Панель управления</div>
          </div>
        </div>

        <nav>
          {NAV.map((item, i) => {
            if (item.section) return <div key={i} className="adm-nav-section">{item.section}</div>;
            const badge = item.badge === "new" && newSubmissions > 0 ? newSubmissions : null;
            return (
              <div key={item.view} className={`adm-nav-item ${view === item.view ? "active" : ""}`} onClick={() => go(item.view)}>
                <AdminIcon name={item.icon} size={16} />
                <span>{item.label}</span>
                {badge && <span className="adm-nav-badge">{badge}</span>}
              </div>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <a className="adm-nav-item" href="/" target="_blank">
            <AdminIcon name="eye" size={16} /> Открыть сайт
          </a>
          <div className="adm-nav-item" onClick={onLogout}>
            <AdminIcon name="logout" size={16} /> Выйти
          </div>
        </div>
      </aside>
    );
  }

  /* ── Page renderer ── */
  function AdminPage({ view, viewParams, go }) {
    const titles = {
      dashboard: "Дашборд", analytics: "Аналитика",
      products: "Товары", "product-new": "Новый товар", "product-edit": "Редактировать товар",
      manufacturers: "Бренды", catalog: "Категории", specs: "Направления", import: "Импорт",
      homepage: "Главная страница", servicepage: "Сервис и поддержка", news: "Новости", cases: "Кейсы",
      documents: "Документы", team: "Команда",
      submissions: "Заявки", orders: "Заказы", reviews: "Отзывы",
      media: "Медиатека", navmenu: "Меню", users: "Пользователи",
      seo: "SEO", misc: "Настройки",
    };

    const renderPage = () => {
      if (view === "dashboard")     return window.AdminDashboard     ? <AdminDashboard go={go} /> : null;
      if (view === "analytics")     return window.AdminAnalytics     ? <AdminAnalytics go={go} /> : null;
      if (view === "products")      return window.AdminProducts      ? <AdminProducts go={go} /> : null;
      if (view === "product-new")   return window.AdminProductForm   ? <AdminProductForm go={go} editId={null} /> : null;
      if (view === "product-edit")  return window.AdminProductForm   ? <AdminProductForm go={go} editId={viewParams?.id} /> : null;
      if (view === "manufacturers") return window.AdminManufacturers ? <AdminManufacturers go={go} /> : null;
      if (view === "catalog")       return window.AdminCatalogManager? <AdminCatalogManager go={go} /> : null;
      if (view === "specs")         return window.AdminCatalogSpecs  ? <AdminCatalogSpecs go={go} /> : null;
      if (view === "import")        return window.AdminImport        ? <AdminImport go={go} /> : null;
      if (view === "homepage")      return window.AdminHomepage      ? <AdminHomepage go={go} /> : null;
      if (view === "servicepage")   return window.AdminServiceSupport ? <AdminServiceSupport go={go} /> : null;
      if (view === "news")          return window.AdminNews          ? <AdminNews go={go} /> : null;
      if (view === "news-new")      return window.AdminNews          ? <AdminNews go={go} /> : null;
      if (view === "cases")         return window.AdminCases         ? <AdminCases go={go} /> : null;
      if (view === "documents")     return window.AdminDocuments     ? <AdminDocuments go={go} /> : null;
      if (view === "team")          return window.AdminTeam          ? <AdminTeam go={go} /> : null;
      if (view === "submissions")   return window.AdminSubmissions   ? <AdminSubmissions go={go} /> : null;
      if (view === "orders")        return window.AdminOrders        ? <AdminOrders go={go} /> : null;
      if (view === "reviews")       return window.AdminReviews       ? <AdminReviews go={go} /> : null;
      if (view === "media")         return window.AdminMedia         ? <AdminMedia go={go} /> : null;
      if (view === "navmenu")       return window.AdminNavmenu       ? <AdminNavmenu go={go} /> : null;
      if (view === "users")         return window.AdminUsers         ? <AdminUsers go={go} /> : null;
      if (view === "seo")           return window.AdminSEO           ? <AdminSEO go={go} /> : null;
      if (view === "misc")          return window.AdminMisc          ? <AdminMisc go={go} /> : null;
      return <div style={{padding:40,color:"var(--c-muted)"}}>Страница не найдена: {view}</div>;
    };

    return (
      <div className="adm-main">
        <header className="adm-header">
          <span className="adm-header-title">{titles[view] || view}</span>
          <a href="/" target="_blank" className="btn btn-ghost btn-sm">
            <AdminIcon name="eye" size={14} /> Сайт
          </a>
        </header>
        <div className="adm-content">{renderPage()}</div>
      </div>
    );
  }

  /* ── Root app ── */
  function AdminApp() {
    const initialRoute = readAdminRoute();
    const [authed, setAuthed] = useState(() => !!(window.api && window.api.isAuthed()));
    const [view, setView] = useState(initialRoute.view);
    const [viewParams, setViewParams] = useState(initialRoute.params);

    const go = (v, params) => {
      const nextParams = params || {};
      setView(v);
      setViewParams(nextParams);
      syncUrl(v, nextParams);
      window.scrollTo(0, 0);
    };
    window._admGo = go;

    const logout = () => {
      if (window.api) window.api.logout();
      window.dispatchEvent(new CustomEvent("soi-auth-changed"));
      setView("dashboard");
      setViewParams({});
      syncUrl("dashboard", {}, "replace");
      setAuthed(false);
    };

    useEffect(() => {
      syncUrl(view, viewParams, "replace");
      const onPop = () => {
        const next = readAdminRoute();
        setView(next.view);
        setViewParams(next.params);
        window.scrollTo(0, 0);
      };
      window.addEventListener("popstate", onPop);
      // Validate the stored token on load; fall back to the login screen if it's gone/expired.
      if (authed && window.api) {
        window.api.me().catch(() => { window.api.clearTokens(); setAuthed(false); });
      }
      const onExpired = () => setAuthed(false);
      window.addEventListener("soi-auth-expired", onExpired);
      return () => {
        window.removeEventListener("popstate", onPop);
        window.removeEventListener("soi-auth-expired", onExpired);
      };
    }, []);

    if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

    return (
      <div className="adm-shell">
        <AdminSidebar view={view} go={go} onLogout={logout} />
        <AdminPage view={view} viewParams={viewParams} go={go} />
        <ToastContainer />
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <RootErrorBoundary><AdminApp /></RootErrorBoundary>
  );
})();
