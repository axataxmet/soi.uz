/* Sog'liq Industriyasi — Home page */
const tr = (lang, o) => !o ? "" : typeof o === "string" ? o : o[lang] || o.ru;

/* ---- animated count-up ---- */
function CountUp({ value }) {
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState("0");
  React.useEffect(() => {
    // parse "350+" → num=350, suffix="+"
    const match = String(value).match(/^(\d+)(.*)/);
    if (!match) {setDisplay(value);return;}
    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";
    let started = false;
    const DURATION = 1400; // ms
    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / DURATION, 1);
        const ease = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        setDisplay(Math.round(ease * target) + suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {started = true;run();}
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <b ref={ref}>{display}</b>;
}

function CoHomePage({ t, lang, go }) {
  const D = window.SI;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  // «Реализованные проекты» — берём опубликованные кейсы из админки (CMS)
  const [, force] = React.useState(0);
  const [newsPreview, setNewsPreview] = React.useState(null);
  React.useEffect(() => {
    if (!window.CMS) return;
    const have = window.CMS.list("cases");
    const seeded = window.CMS.getSetting && window.CMS.getSetting("cases_seeded");
    if (have.length === 0 && !seeded && window.SOI_CORE && window.SOI_CORE.CASES_DEFAULT) {
      window.SOI_CORE.CASES_DEFAULT.forEach((cs) => window.CMS.put("cases", Object.assign({}, cs)));
      if (window.CMS.setSetting) window.CMS.setSetting("cases_seeded", true);
    }
    return window.CMS.on("cases", () => force((n) => n + 1));
  }, []);
  const cmsCases = (window.CMS ? window.CMS.list("cases") : []).filter((c) => (c.status || "published") === "published");
  const projImg = (im) => !im ? "" : typeof im === "string" ? im : im.data || im.url || im.src || "";
  const projects = (cmsCases.length ?
  cmsCases.map((c) => ({ id: c.id, tag: c.tag, t: c.title, d: c.desc, year: c.year, loc: c.region, image: c.image })) :
  D.PROJECTS || []).slice(0, 3);
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-wave"></div>
        <div className="hero-wave2"></div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow reveal" data-comment-anchor="32cb44967c-span-63-13">{t.hero_eyebrow}</span>
            <h1 className="reveal" style={{ fontFamily: "sans-serif" }}>{t.hero_h1a}<em style={{ fontFamily: "sans-serif", color: "#0E4AC6" }}>{t.hero_h1b}</em>{t.hero_h1c}</h1>
            <p className="lead reveal" style={{ fontFamily: "Manrope", lineHeight: "1.62" }}>{t.hero_lead}</p>
            <div className="hero-actions reveal">
              <button className="btn btn-pri btn-lg" onClick={() => go("contacts")} style={{ backgroundColor: "rgb(14, 74, 198)" }}>{t.hero_cta1}</button>
              <a className="btn btn-ghost btn-lg" onClick={() => go("catalog")} style={{ cursor: "pointer" }}>{t.hero_cta2} →</a>
            </div>
            <div className="hero-badges reveal">
              {[t.hero_b1, t.hero_b2, t.hero_b3, t.hero_b4].map((b, i) =>
              <span className="hbadge" key={i}><CoIcon name="check" size={15} />{b}</span>
              )}
            </div>
            <div className="hero-stats reveal">
              {D.STATS.map((s, i) =>
              <div className="hstat" key={i}><CountUp value={s.n} /><span>{t[s.k]}</span></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow line" style={{ justifyContent: "center" }}>{lv("Направления", "Yo'nalishlar", "Directions")}</span>
            <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Направления деятельности", "Faoliyat yo'nalishlari", "Areas of activity")}</h2>
            <p className="sub-sec">{lv("Полный цикл работы с медицинским оборудованием — от поставки до регистрации изделий.", "Tibbiy uskunalar bilan to'liq ish tsikli — yetkazib berishdan ro'yxatga olishgacha.", "A full cycle of work with medical equipment — from supply to device registration.")}</p>
          </div>
          <div className="grid-2" style={{ gap: 22 }}>
            {[
            { ic: "truck", t: lv("Поставка медицинского оборудования", "Tibbiy uskunalar yetkazib berish", "Medical equipment supply"),
              d: lv("Медицинская техника, оборудование, мебель, инструменты и расходные материалы для частных клиник, государственных медучреждений и профильных организаций.", "Xususiy klinikalar, davlat tibbiy muassasalari uchun tibbiy texnika, uskunalar, mebel, asboblar va sarf materiallari.", "Medical machinery, equipment, furniture, instruments and consumables for private clinics, public institutions and specialized organizations."),
              cta: lv("Подробнее", "Batafsil", "Learn more"), go: () => go("directions") },
            { ic: "building", t: lv("Оснащение клиник «под ключ»", "Klinikalarni «kalit ostida» jihozlash", "Turnkey clinic equipping"),
              d: lv("Подбор оборудования, КП, поставка, монтаж, запуск и сервисное сопровождение.", "Uskuna tanlash, taklif, yetkazish, montaj, ishga tushirish va servis.", "Equipment selection, quote, supply, installation, commissioning and service support."),
              cta: lv("Запросить подбор", "Tanlovni so'rash", "Request selection"), go: () => go("contacts") },
            { ic: "check", t: lv("Регистрация медицинских изделий", "Tibbiy buyumlarni ro'yxatga olish", "Medical device registration"),
              d: lv("Сопровождение производителей, импортёров и поставщиков при подготовке документов и прохождении процедуры регистрации МИ.", "Ishlab chiqaruvchilar, importchilar va yetkazib beruvchilarni hujjat tayyorlash va ro'yxatga olish jarayonida qo'llab-quvvatlash.", "Support for manufacturers, importers and suppliers in document preparation and the MD registration procedure."),
              cta: lv("Получить консультацию", "Maslahat olish", "Get a consultation"), go: () => go("registration") },
            { ic: "doc", t: lv("Тендеры и госзакупки", "Tender va davlat xaridlari", "Tenders & procurement"),
              d: lv("Подготовка КП, спецификаций, документов и поставка по требованиям закупки.", "Taklif, spetsifikatsiya, hujjatlar tayyorlash va xarid talablariga ko'ra yetkazish.", "Preparation of quotes, specifications, documents and supply per procurement requirements."),
              cta: lv("Раздел для закупщиков", "Xaridorlar uchun", "For procurement"), go: () => go("tenders") }].
            map((c, i) =>
            <div className="scard reveal" key={i}>
                <div className="ic"><CoIcon name={c.ic} size={24} /></div>
                <h3>{c.t}</h3>
                <p style={{ fontFamily: "Manrope" }}>{c.d}</p>
                <span className="more" onClick={c.go} style={{ cursor: "pointer" }}>{c.cta} <CoIcon name="arrow" size={15} /></span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REGISTRATION MD HIGHLIGHT */}
      <section className="section alt">
        <div className="wrap">
          <div className="reg-band reveal">
            <div className="reg-band-tx">
              <span className="eyebrow">{lv("Экспертное направление", "Ekspert yo'nalish", "Expert service")}</span>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 600, letterSpacing: "-.01em", margin: "16px 0 12px", color: "var(--navy-900)" }}>{lv("Сопровождение регистрации медицинских изделий", "Tibbiy buyumlarni ro'yxatga olishni qo'llab-quvvatlash", "Medical device registration support")}</h2>
              <p style={{ fontSize: 16, color: "var(--slate-600)", lineHeight: 1.65, maxWidth: 620 }}>{lv("Помогаем производителям, импортёрам и поставщикам медицинских изделий подготовить документы и пройти процедуру регистрации в соответствии с действующими требованиями Республики Узбекистан.", "Tibbiy buyumlar ishlab chiqaruvchilar, importchilar va yetkazib beruvchilarga hujjatlarni tayyorlash va O'zbekiston Respublikasi talablariga muvofiq ro'yxatga olish jarayonidan o'tishda yordam beramiz.", "We help manufacturers, importers and suppliers of medical devices prepare documents and complete the registration procedure in accordance with the current requirements of Uzbekistan.")}</p>
              <button className="btn btn-pri btn-lg" style={{ marginTop: 26 }} onClick={() => go("registration")}>{lv("Получить консультацию по регистрации МИ", "TI ro'yxati bo'yicha maslahat olish", "Get MD registration advice")}</button>
            </div>
            <div className="reg-band-badges">
              {[lv("Анализ документов", "Hujjatlar tahlili", "Document analysis"), lv("Регистрационное досье", "Ro'yxat dosyesi", "Registration dossier"), lv("Сопровождение подачи", "Topshirishni qo'llab-quvvatlash", "Submission support"), lv("Коммуникация по замечаниям", "Izohlar bo'yicha aloqa", "Handling of remarks")].map((b, i) =>
              <div className="reg-badge" key={i}><CoIcon name="check" size={16} /><span>{b}</span></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow line">{t.why_title}</span>
            <h2 className="h-sec" style={{ marginTop: 14 }}>{t.why_title}</h2>
            <p className="sub-sec">{t.why_sub}</p>
          </div>
          <div className="grid-4">
            {[["award", "why1_t", "why1_d"], ["clock", "why2_t", "why2_d"], ["shield", "why3_t", "why3_d"], ["globe", "why4_t", "why4_d"]].map(([ic, tt, dd], i) =>
            <div className="scard reveal" key={i} style={{ background: "var(--surface)" }}>
                <div className="ic"><CoIcon name={ic} size={24} /></div>
                <h3 style={{ fontSize: 16.5 }}>{i === 1 ? lv("Опыт " + (new Date().getFullYear() - 2019) + "+ лет", (new Date().getFullYear() - 2019) + "+ yillik tajriba", (new Date().getFullYear() - 2019) + "+ years") : t[tt]}</h3>
                <p>{t[dd]}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow line" style={{ justifyContent: "center" }}>{lv("Как мы работаем", "Qanday ishlaymiz", "How we work")}</span>
            <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Процесс работы", "Ish jarayoni", "Our process")}</h2>
          </div>
          <div className="grid-2" style={{ gap: 28 }}>
            <div className="proc-col reveal">
              <h3 className="proc-h"><CoIcon name="truck" size={20} />{lv("Поставка оборудования", "Uskuna yetkazish", "Equipment supply")}</h3>
              <ol className="proc-list">
                {[lv("Получаем запрос или ТЗ", "So'rov yoki TT olamiz", "Receive a request or spec"),
                lv("Подбираем оборудование", "Uskuna tanlaymiz", "Select equipment"),
                lv("Готовим КП и документы", "Taklif va hujjatlar tayyorlaymiz", "Prepare a quote and documents"),
                lv("Организуем поставку", "Yetkazib berishni tashkil qilamiz", "Arrange delivery"),
                lv("Выполняем монтаж и запуск", "Montaj va ishga tushirishni bajaramiz", "Install and commission"),
                lv("Сопровождаем сервис", "Servisni qo'llab-quvvatlaymiz", "Provide ongoing service")].map((s, i) =>
                <li key={i}><span className="proc-n">{i + 1}</span>{s}</li>
                )}
              </ol>
            </div>
            <div className="proc-col reveal">
              <h3 className="proc-h"><CoIcon name="check" size={20} />{lv("Регистрация медицинских изделий", "Tibbiy buyumlarni ro'yxatga olish", "Medical device registration")}</h3>
              <ol className="proc-list">
                {[lv("Предварительная консультация", "Dastlabki maslahat", "Initial consultation"),
                lv("Анализ изделия и документов", "Buyum va hujjatlar tahlili", "Analysis of device and documents"),
                lv("Проверка требований", "Talablarni tekshirish", "Requirements check"),
                lv("Подготовка регистрационного досье", "Ro'yxat dosyesini tayyorlash", "Registration dossier preparation"),
                lv("Сопровождение подачи", "Topshirishni qo'llab-quvvatlash", "Submission support"),
                lv("Коммуникация по замечаниям", "Izohlar bo'yicha aloqa", "Handling of remarks"),
                lv("Сопровождение до результата по заявке", "Ariza natijasigacha qo'llab-quvvatlash", "Support until the application result")].map((s, i) =>
                <li key={i}><span className="proc-n">{i + 1}</span>{s}</li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow line">{t.nav_projects}</span>
              <h2 className="h-sec" style={{ marginTop: 14 }}>{t.pr_title}</h2>
              <p className="sub-sec">{t.pr_sub}</p>
            </div>
            <span className="more" onClick={() => go("projects")} style={{ cursor: "pointer", fontSize: 16 }}>{t.pr_all} <CoIcon name="arrow" size={16} /></span>
          </div>
          <div className="grid-3">
            {projects.map((p) =>
            <div className="proj-card reveal" key={p.id} onClick={() => go("cases")}>
                {projImg(p.image) ?
              <img className="proj-photo" src={projImg(p.image)} alt={tr(lang, p.t)} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }} /> :
              <image-slot id={"home-" + p.id} shape="rect" placeholder={tr(lang, p.t)}></image-slot>}
                <div className="proj-body">
                  <div className="proj-tag">{tr(lang, p.tag)}</div>
                  <h3>{tr(lang, p.t)}</h3>
                  <p>{tr(lang, p.d)}</p>
                  <div className="proj-meta">
                    <span>{t.pr_year}: <b>{p.year}</b></span>
                    <span>{t.pr_loc}: <b>{typeof p.loc === "string" ? p.loc : tr(lang, p.loc)}</b></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head center reveal">
            <h2 className="h-sec brand-h-inline">{t.br_title}<a className="brand-arrow" onClick={() => go("partners")} title={lang === "uz" ? "Barcha brendlar" : lang === "en" ? "All brands" : "Все бренды"} aria-label="all brands">→</a></h2>
            <p className="sub-sec">{t.br_sub}</p>
          </div>
          <div className="brand-pills reveal">
            {(window.DATA && window.DATA.BRANDS || []).slice(0, 14).map((b, i) =>
            <button className="brand-pill" key={b.id || i} onClick={() => go("partners")} title={b.name}>
                <span className="bp-mono">{b.name.replace(/[^A-Za-zА-Яа-я]/g, "").slice(0, 2).toUpperCase()}</span>
                <span className="bp-name">{b.name}</span>
                {b.flag && <span className="bp-flag" title={b["country_" + lang] || b.country_ru}>{b.flag}</span>}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* NEWS · REVIEWS · ARTICLES (homepage blocks) */}
      {(() => {
        const tx = (o) => (o && (o[lang] || o.ru)) || "";
        const cov = (c) => !c ? null : (typeof c === "string" ? c : (c.data || c.src || null));
        const normType = (n) => n.type || (n.cat === "article" ? "article" : n.cat) || "news";
        const allNews = (window.CMS && window.CMS.list("news") || []).filter((n) => n.published !== false)
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        const articles = allNews.filter((n) => normType(n) === "article").slice(0, 3);
        const news = allNews.filter((n) => normType(n) !== "article").slice(0, 3);
        const fmtDate = (d) => { if (!d) return ""; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" }); };

        const newsCard = (n, i) => (
          <div className=" co-pcard reveal" key={n.id || i} onClick={() => setNewsPreview(n)} style={{ cursor: "pointer" }}>
            <div className="co-pcard-cover">{cov(n.cover) ? <img src={cov(n.cover)} alt={tx(n.title)} loading="lazy" /> : <CoIcon name="news" size={30} />}</div>
            <div className="co-pcard-body">
              <div className="co-pcard-meta">{fmtDate(n.date)}</div>
              <h3 className="co-pcard-title">{tx(n.title)}</h3>
              <p className="co-pcard-text">{tx(n.excerpt) || tx(n.body)}</p>
            </div>
          </div>
        );

        return (
          <>
            {news.length > 0 && (
              <section className="section">
                <div className="wrap">
                  <div className="sec-head reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                    <div>
                      <span className="eyebrow line">{lv("Новости", "Yangiliklar", "News")}</span>
                      <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Новости компании", "Kompaniya yangiliklari", "Company news")}</h2>
                    </div>
                    <span className="more" onClick={() => go("news")} style={{ cursor: "pointer", fontSize: 16 }}>{lv("Все новости", "Barcha yangiliklar", "All news")} <CoIcon name="arrow" size={16} /></span>
                  </div>
                  <div className="co-pgrid">{news.map(newsCard)}</div>
                </div>
              </section>
            )}

            <section className="section alt">
              <div className="wrap">
                {typeof HomeReviews !== "undefined"
                  ? <HomeReviews t={t} lang={lang} go={go} />
                  : null}
              </div>
            </section>

            {articles.length > 0 && (
              <section className="section">
                <div className="wrap">
                  <div className="sec-head reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                    <div>
                      <span className="eyebrow line">{lv("Статьи", "Maqolalar", "Articles")}</span>
                      <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Статьи и гайды", "Maqolalar va qo‘llanmalar", "Articles & guides")}</h2>
                    </div>
                    <span className="more" onClick={() => go("news")} style={{ cursor: "pointer", fontSize: 16 }}>{lv("Все статьи", "Barcha maqolalar", "All articles")} <CoIcon name="arrow" size={16} /></span>
                  </div>
                  <div className="co-pgrid">{articles.map(newsCard)}</div>
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* CROSS-LINK TO UZMEDEX */}
      <section className="section">
        <div className="wrap">
          <div className="xband reveal">
            <div className="xb-tx">
              <h3>{t.xb_title}</h3>
              <p>{t.xb_sub}</p>
            </div>
            <a className="btn btn-white btn-lg xb-act" onClick={() => go("catalog")} style={{ cursor: "pointer" }}>{t.xb_btn}</a>
          </div>
        </div>
      </section>

      {newsPreview && (() => {
        const tx = (o) => (o && (o[lang] || o.ru)) || "";
        const cov = (c) => !c ? null : (typeof c === "string" ? c : (c.data || c.src || null));
        const n = newsPreview;
        const fmtDate = (d) => { if (!d) return ""; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" }); };
        const body = tx(n.body) || tx(n.excerpt);
        return (
          <div className="modal-ov" onClick={() => setNewsPreview(null)}>
            <div className="modal news-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setNewsPreview(null)} aria-label="close">×</button>
              {cov(n.cover) && <div className="news-modal-cover"><img src={cov(n.cover)} alt={tx(n.title)} /></div>}
              <div className="news-modal-body">
                <div className="news-modal-meta">{fmtDate(n.date)}</div>
                <h2 className="news-modal-title">{tx(n.title)}</h2>
                <div className="news-modal-text">{body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
              </div>
            </div>
          </div>);
      })()}
    </div>);

}
window.CoHomePage = CoHomePage;
window.tr = tr;