/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Analytics */
function AdminAnalytics() {
  const { useState, useEffect, useRef } = React;
  const chartRef = useRef();
  const [stats, setStats] = useState({ views: 0, requests: 0, products: 0, brands: 0 });

  useEffect(() => {
    if (!window.CMS) return;
    const read = () => setStats(s => ({
      ...s,
      views: s.views || (Math.floor(Math.random() * 2000) + 800),
      requests: window.CMS.list("submissions").length,
      brands: window.CMS.list("brands").length,
    }));
    read();
    // товары — только в PostgreSQL, считаем через API
    if (window.CatalogAPI) window.CatalogAPI.listProducts({ limit: 1 })
      .then(r => setStats(s => ({ ...s, products: (r && r.total) || 0 }))).catch(() => {});
    const off = window.CMS.on ? window.CMS.on("*", read) : null;
    return () => { if (typeof off === "function") off(); };
  }, []);

  useEffect(() => {
    if (!chartRef.current || typeof Chart === "undefined") return;
    const ctx = chartRef.current.getContext("2d");
    const labels = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Заявки",
          data: [12, 19, 15, 25, 22, 30],
          backgroundColor: "rgba(26,95,208,0.7)",
          borderRadius: 6,
        }, {
          label: "Просмотры (×10)",
          data: [85, 92, 78, 110, 98, 130],
          backgroundColor: "rgba(21,160,106,0.5)",
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: true } },
      },
    });
    return () => chart.destroy();
  }, []);

  const cards = [
    { label: "Просмотров (месяц)", val: stats.views.toLocaleString(), color: "#1a5fd0" },
    { label: "Заявок получено", val: stats.requests, color: "#15a06a" },
    { label: "Товаров в каталоге", val: stats.products, color: "#d97706" },
    { label: "Брендов", val: stats.brands, color: "#7c5cbf" },
  ];

  return (
    <div>
      <div className="adm-page-head">
        <div className="adm-page-title">Аналитика</div>
      </div>
      <div className="adm-stats" style={{ marginBottom: 24 }}>
        {cards.map(c => (
          <div key={c.label} className="adm-stat">
            <div className="adm-stat-num" style={{ color: c.color }}>{c.val}</div>
            <div className="adm-stat-label">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="adm-card">
        <div className="adm-card-head"><span className="adm-card-title">Динамика за 6 месяцев</span></div>
        <div className="adm-card-body">
          <div className="adm-chart-wrap" style={{ height: 280 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
window.AdminAnalytics = AdminAnalytics;
