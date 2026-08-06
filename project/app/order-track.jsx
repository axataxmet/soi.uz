/* ИНДУСТРИЯ ЗДОРОВЬЯ — Sitemap page (Карта сайта) */
function SitemapPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const tri = (l, ru, uz, en) => l === "uz" ? uz : l === "en" ? en : ru;
  const cats = (window.DATA && window.DATA.CATEGORIES) || [];
  const brands = (window.DATA && window.DATA.BRANDS) || [];

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--slate-900)", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid var(--blue-600)", display: "inline-block" }}>{title}</h2>
      <div>{children}</div>
    </div>
  );
  const Link = ({ onClick, children, sub }) => (
    <a onClick={onClick} style={{ display: "block", padding: sub ? "6px 0 6px 16px" : "7px 0", fontSize: sub ? 14 : 15, color: sub ? "var(--slate-600)" : "var(--ink)", cursor: "pointer", borderBottom: "1px solid var(--line)", fontWeight: sub ? 400 : 500, textDecoration: "none" }}>{children}</a>
  );

  // Category link with hover-dropdown showing its subcategories
  const CatLink = ({ c }) => {
    const [open, setOpen] = React.useState(false);
    const subs = c.subs || [];
    return (
      <div
        style={{ position: "relative", borderBottom: "1px solid var(--line)" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <a
          onClick={() => go("catalog", { cat: c.id })}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", fontSize: 15, color: open ? "var(--blue-600)" : "var(--ink)", cursor: "pointer", fontWeight: 500, textDecoration: "none", transition: "color .15s" }}
        >
          <span>{tri(lang, c.ru, c.uz, c.en)}</span>
          {subs.length > 0 && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0, color: "var(--slate-400)" }}><path d="m6 9 6 6 6-6" /></svg>
          )}
        </a>
        {open && subs.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 30, minWidth: 240, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 18px 44px rgba(9,24,48,.16)", padding: "8px 0", marginTop: 2, animation: "fadeIn .15s ease" }}>
            {subs.map((s, i) => (
              <a key={i}
                onClick={() => go("catalog", { cat: c.id })}
                style={{ display: "block", padding: "8px 18px", fontSize: 14, color: "var(--slate-700)", cursor: "pointer", textDecoration: "none", transition: "background .12s,color .12s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-2)"; e.currentTarget.style.color = "var(--blue-600)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--slate-700)"; }}
              >{tri(lang, s.ru, s.uz, s.en)}</a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="wrap" style={{ padding: "44px 0 80px" }}>
      <nav style={{ fontSize: 13, color: "var(--slate-500)", marginBottom: 14 }}>
        <a onClick={() => go("home", {})} style={{ cursor: "pointer", color: "var(--blue-600)" }}>{lv("Главная", "Bosh sahifa", "Home")}</a>
        <span style={{ margin: "0 8px" }}>/</span>
        <span>{lv("Карта сайта", "Sayt xaritasi", "Sitemap")}</span>
      </nav>
      <h1 className="info-title" style={{ marginBottom: 8 }}>{lv("Карта сайта", "Sayt xaritasi", "Sitemap")}</h1>
      <p style={{ fontSize: 15, color: "var(--slate-600)", marginBottom: 40, maxWidth: 640 }}>
        {lv("Все разделы и страницы платформы ИНДУСТРИЯ ЗДОРОВЬЯ в одном месте.",
            "SOG’LIQ INDUSTRIYASI platformasining barcha bo'limlari va sahifalari bir joyda.",
            "All sections and pages of the HEALTH INDUSTRY platform in one place.")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0 48px" }}>

        <Section title={lv("Каталог", "Katalog", "Catalog")}>
          {cats.map((c) => (
            <CatLink key={c.id} c={c} />
          ))}
          <Link onClick={() => go("catalog", {})}>{lv("Все товары", "Barcha mahsulotlar", "All products")}</Link>
        </Section>

        <Section title={lv("Покупателям", "Xaridorlarga", "For buyers")}>
          <Link onClick={() => go("info", { p: "payment" })}>{lv("Оплата", "To'lov", "Payment")}</Link>
          <Link onClick={() => go("info", { p: "shipping" })}>{lv("Доставка", "Yetkazib berish", "Delivery")}</Link>
          <Link onClick={() => go("info", { p: "service" })}>{lv("Гарантия и сервис", "Kafolat va servis", "Warranty & service")}</Link>
          <Link onClick={() => go("faq", {})}>{lv("Частые вопросы", "Savol-javob", "FAQ")}</Link>
          <Link onClick={() => go("info", { p: "suppliers" })}>{lv("Поставщикам", "Yetkazib beruvchilarga", "For suppliers")}</Link>
          <Link onClick={() => go("info", { p: "gov" })}>{lv("Для государственных закупок", "Davlat xaridlari uchun", "Government procurement")}</Link>
          <Link onClick={() => go("tracking", {})}>{lv("Отслеживание заказа", "Buyurtmani kuzatish", "Order tracking")}</Link>
          <Link onClick={() => go("price", {})}>{lv("Прайс-лист", "Narxlar ro'yxati", "Price list")}</Link>
        </Section>

        <Section title={lv("Компания", "Kompaniya", "Company")}>
          <Link onClick={() => go("info", { p: "about" })}>{lv("О компании", "Kompaniya haqida", "About us")}</Link>
          <Link onClick={() => go("info", { p: "contacts" })}>{lv("Контакты", "Kontaktlar", "Contacts")}</Link>
          <Link onClick={() => go("news", {})}>{lv("Новости и статьи", "Yangiliklar va maqolalar", "News & articles")}</Link>
          <Link onClick={() => go("tenders", {})}>{lv("Тендеры", "Tenderlar", "Tenders")}</Link>
          <Link onClick={() => go("partners", {})}>{lv("Бренды и производители", "Brendlar va ishlab chiqaruvchilar", "Brands & manufacturers")}</Link>
        </Section>

        <Section title={lv("Документы и право", "Hujjatlar va huquq", "Documents & legal")}>
          <Link onClick={() => go("info", { p: "offer" })}>{lv("Договор оферты", "Ommaviy oferta", "Public offer")}</Link>
          <Link onClick={() => go("info", { p: "returns" })}>{lv("Политика возврата", "Qaytarish siyosati", "Return policy")}</Link>
          <Link onClick={() => go("info", { p: "service" })}>{lv("Гарантийные условия", "Kafolat shartlari", "Warranty terms")}</Link>
          <Link onClick={() => go("info", { p: "service_reg" })}>{lv("Сервисный регламент", "Servis reglamenti", "Service regulations")}</Link>
          <Link onClick={() => go("info", { p: "licenses" })}>{lv("Лицензии и сертификаты", "Litsenziya va sertifikatlar", "Licenses & certificates")}</Link>
          <Link onClick={() => go("info", { p: "privacy" })}>{lv("Политика конфиденциальности", "Maxfiylik siyosati", "Privacy Policy")}</Link>
        </Section>

        <Section title={lv("Бренды", "Brendlar", "Brands")}>
          {brands.map((b) => (
            <Link key={b.id} onClick={() => go("brand", { id: b.id })}>{b.name}</Link>
          ))}
        </Section>

        <Section title={lv("Личный кабинет", "Shaxsiy kabinet", "Account")}>
          <Link onClick={() => go("account", {})}>{lv("Мой аккаунт", "Mening akkauntim", "My account")}</Link>
          <Link onClick={() => go("cart", {})}>{lv("Корзина", "Savatcha", "Cart")}</Link>
          <Link onClick={() => go("wishlist", {})}>{lv("Избранное", "Saralangan", "Wishlist")}</Link>
          <Link onClick={() => go("compare", {})}>{lv("Сравнение", "Taqqoslash", "Comparison")}</Link>
        </Section>

      </div>
    </div>
  );
}
window.SitemapPage = SitemapPage;