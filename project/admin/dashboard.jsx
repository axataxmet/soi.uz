/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Dashboard */
function AdminDashboard({ go }) {
  const { useState, useEffect } = React;
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!window.CMS) return;
    // brands/news/cases/reviews/submissions идут через CMS-адаптеры (REST) — читаем из кэша
    const readCms = () => setStats(s => ({
      ...s,
      brands:      window.CMS.list("brands").length,
      news:        window.CMS.list("news").length,
      cases:       window.CMS.list("cases").length,
      submissions: window.CMS.list("submissions").filter(x => x.status === "new").length,
      reviews:     window.CMS.list("reviews").length,
    }));
    readCms();
    // товары живут только в PostgreSQL (без CMS-адаптера) — считаем напрямую через API
    if (window.CatalogAPI) window.CatalogAPI.listProducts({ limit: 1 })
      .then(r => setStats(s => ({ ...s, products: (r && r.total) || 0 }))).catch(() => {});
    // адаптеры грузятся асинхронно — перечитываем счётчики по мере готовности
    const off = window.CMS.on ? window.CMS.on("*", readCms) : null;
    return () => { if (typeof off === "function") off(); };
  }, []);

  const cards = [
    { key: "products",    label: "Товаров",       icon: "package",  color: "#1a5fd0", view: "products" },
    { key: "brands",      label: "Брендов",        icon: "tag",      color: "#15a06a", view: "manufacturers" },
    { key: "news",        label: "Новостей",        icon: "news",     color: "#d97706", view: "news" },
    { key: "cases",       label: "Кейсов",          icon: "briefcase",color: "#7c5cbf", view: "cases" },
    { key: "submissions", label: "Новых заявок",    icon: "mail",     color: "#e0492f", view: "submissions" },
    { key: "reviews",     label: "Отзывов",         icon: "star",     color: "#0ea5e9", view: "reviews" },
  ];

  const quickLinks = [
    { label: "Добавить товар",     view: "product-new",    icon: "plus" },
    { label: "Добавить новость",   view: "news-new",       icon: "plus" },
    { label: "Редактировать главную", view: "homepage",    icon: "edit" },
    { label: "Импорт каталога",    view: "import",         icon: "import" },
    { label: "SEO настройки",      view: "seo",            icon: "globe" },
    { label: "Настройки CRM",      view: "misc",           icon: "settings" },
  ];

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Панель управления</div>
          <div className="adm-page-sub">Обзор платформы ИНДУСТРИЯ ЗДОРОВЬЯ</div>
        </div>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          <AdminIcon name="refresh" size={14} /> Обновить
        </button>
      </div>

      <div className="adm-stats">
        {cards.map(c => (
          <div key={c.key} className="adm-stat" style={{ cursor: "pointer" }} onClick={() => go(c.view)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: c.color + "15", color: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AdminIcon name={c.icon} size={18} color={c.color} />
              </div>
              <span className="adm-stat-label">{c.label}</span>
            </div>
            <div className="adm-stat-num" style={{ color: c.color }}>{stats[c.key] ?? "—"}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="adm-card">
          <div className="adm-card-head">
            <AdminIcon name="link" size={16} color="var(--c-primary)" />
            <span className="adm-card-title">Быстрые действия</span>
          </div>
          <div className="adm-card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quickLinks.map(l => (
              <button key={l.view} className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={() => go(l.view)}>
                <AdminIcon name={l.icon} size={14} /> {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head">
            <AdminIcon name="mail" size={16} color="var(--c-danger)" />
            <span className="adm-card-title">Последние заявки</span>
            <button className="btn btn-ghost btn-sm" onClick={() => go("submissions")}>Все →</button>
          </div>
          <div className="adm-card-body">
            <RecentSubmissions />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentSubmissions() {
  const { useState, useEffect } = React;
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!window.CMS) return;
    const all = window.CMS.list("submissions");
    setItems(all.slice(-5).reverse());
  }, []);
  if (!items.length) return <div className="adm-text-muted">Заявок пока нет</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(s => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--c-border-light)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--c-primary-light)", color: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
            {(s.name || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }} className="truncate">{s.name || s.phone || "Без имени"}</div>
            <div className="adm-text-muted truncate">{s.org || s.product || s.message || ""}</div>
          </div>
          <StatusBadge status={s.status || "new"} />
        </div>
      ))}
    </div>
  );
}

window.AdminDashboard = AdminDashboard;
