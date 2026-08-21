/* ИНДУСТРИЯ ЗДОРОВЬЯ — inner pages */

function PageHero({ t, lang, go, title, sub }) {
  return (
    <section className="page-hero">
      <div className="pw"></div>
      <div className="wrap">
        <h1 data-comment-anchor="2b7cd50f74-h1-9-9">{title}</h1>
        {sub && <p data-comment-anchor="77600593e5-p-10-17">{sub}</p>}
      </div>
    </section>);

}

/* Секция «Руководство» на /about. Единственный источник данных — таблица team_members
   через CMS-adapter "team" (cms-remote.js). Подписан на CMS.on("team") — перерисуется,
   когда async-адаптер догрузит данные из API. Если сотрудников нет — секция скрыта. */
function LeadershipSection({ lang, lv }) {
  const [team, setTeam] = React.useState(() => (window.CMS ? window.CMS.list("team") : []));
  React.useEffect(() => {
    if (!window.CMS) return;
    const read = () => setTeam(window.CMS.list("team"));
    read();
    return window.CMS.on ? window.CMS.on("team", read) : undefined;
  }, []);
  const sorted = [...team].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!sorted.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow line">{lv("Команда", "Jamoa", "Team")}</span>
          <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Руководство", "Rahbariyat", "Leadership")}</h2>
        </div>
        <div className="grid-4">
          {sorted.map((p) => {
            const name = tr(lang, p.name);
            return (
              <div className="team-card reveal" key={p.id}>
                {p.photo ?
                  <div className="team-photo"><img src={p.photo} alt={name} loading="lazy" /></div> :
                  <div className="team-photo team-photo-empty"><span>{(name || "?").slice(0, 1)}</span></div>}
                <h4>{name}</h4>
                <div className="role">{tr(lang, p.role)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== ABOUT + LEADERSHIP ===== */
function AboutPage({ t, lang, go }) {
  const D = window.SI;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const founded = window.SOI_CORE ? window.SOI_CORE.foundedYear() : 2021;
  const yrs = window.SOI_CORE ? window.SOI_CORE.yearsOnMarket() : new Date().getFullYear() - 2021;
  const ruY = (n) => {const a = n % 10,b = n % 100;if (a === 1 && b !== 11) return "год";if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "года";return "лет";};
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_about}
      sub={lv("«ИНДУСТРИЯ ЗДОРОВЬЯ» — поставщик и интегратор медицинского оборудования для государственных и частных медицинских учреждений Узбекистана.",
      founded + " yildan O'zbekistonda tibbiy uskunalarni rasmiy yetkazib beruvchi va integrator.",
      "Official supplier and integrator of medical equipment in Uzbekistan since " + founded + ".")} />
      <section className="section">
        <div className="wrap" style={{ fontFamily: "Montserrat, Helvetica, Arial, sans-serif" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: 48 }}>
            <div className="reveal">
              <span className="eyebrow line">{lv("О нас", "Biz haqimizda", "About us")}</span>
              <h2 className="h-sec" style={{ marginTop: 14, fontSize: 32 }} data-comment-anchor="b07b739388-h2-31-15">{lv("С 2019 года помогаем оснащать медицинские учреждения Узбекистана", "2019 yildan beri O'zbekiston tibbiy muassasalarini jihozlashga yordam beramiz", "Since 2019 helping equip medical institutions of Uzbekistan")}</h2>
              <p style={{ fontSize: 15.5, color: "var(--slate-600)", marginTop: 18, lineHeight: 1.7 }} data-comment-anchor="c68368ded3-p-32-15">
                {lv("«ИНДУСТРИЯ ЗДОРОВЬЯ» — компания, созданная на базе опыта команды, которая с 2019 года занимается поставками, подбором, сопровождением и сервисной поддержкой медицинского оборудования для медицинских учреждений Узбекистана.",
                "«SOG’LIQ INDUSTRIYASI» — to'liq tsikl kompaniyasi: uskuna yetkazish va montajdan servis, xodimlarni o'qitish va tibbiy buyumlarni ro'yxatdan o'tkazishgacha. Biz butun O'zbekiston bo'ylab davlat va xususiy muassasalar bilan ishlaymiz.",
                "HEALTH INDUSTRY is a full-cycle company: from equipment supply and installation to service, staff training and medical device registration. We work with public and private institutions across Uzbekistan.")}
              </p>
              <p style={{ fontSize: 15.5, color: "var(--slate-600)", marginTop: 14, lineHeight: 1.7 }} data-comment-anchor="b14459ba99-p-40-15">
                {lv("Мы развиваем направление комплексного оснащения медицинских учреждений, поставки медицинского оборудования, мебели, инструментов и расходных материалов, а также сопровождения документов, сервиса и регистрации медицинских изделий.",
                "Ishlab chiqaruvchi zavodlar bilan to'g'ridan-to'g'ri shartnomalar va rasmiy diler maqomi uskunaning haqiqiyligini va ishlab chiqaruvchi qo'llab-quvvatlashini kafolatlaydi.",
                "Direct contracts with manufacturing plants and official dealer status guarantee equipment authenticity and manufacturer support throughout its service life.")}
              </p>
            </div>
            <image-slot id="about-main" shape="rounded" radius="18" placeholder={lv("Фото офиса / команды", "Ofis / jamoa fotosi", "Office / team photo")} style={{ width: "100%", height: 380 }}></image-slot>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><h2 className="h-sec">{lv("Наши ценности", "Bizning qadriyatlarimiz", "Our values")}</h2></div>
          <div className="grid-3">
            {D.VALUES.map((v, i) =>
            <div className="scard reveal" key={i}>
                <div style={{ fontFamily: "var(--font)", fontSize: 30, fontWeight: 600, color: "var(--blue-400)" }}>{v.n}</div>
                <h3 style={{ marginTop: 10 }}>{tr(lang, v.t)}</h3>
                <p>{tr(lang, v.d)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LEADERSHIP — единственный источник: таблица team_members (админка «Команда»).
          Если сотрудников нет — блок скрыт. Никаких плейсхолдеров-заглушек. */}
      <LeadershipSection lang={lang} lv={lv} />

      <AboutDocsSection lang={lang} lv={lv} />

      <XBand t={t} go={go} />
    </div>);

}

function AboutDocsSection({ lang, lv }) {
  const openDoc = (href, name) => {
    fetch(href).then((r) => r.blob()).then((b) => {
      const url = URL.createObjectURL(b);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }).catch(() => {window.open(href, "_blank");});
  };
  const Doc = ({ name, href, sub, arrow }) =>
  <div className={"adoc-row" + (sub ? " sub" : "")}
  onClick={href ? () => openDoc(href, name) : undefined}
  style={{ cursor: href ? "pointer" : "default" }}>
      {!sub && <svg className="adoc-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>}
      <span className="adoc-name">{name}</span>
      {href ?
    <svg className="adoc-dl" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 4 5-4M5 21h14" /></svg> :
    arrow ? <span className="adoc-arr">›</span> : null}
    </div>;

  return (
    <section className="section alt">
      <div className="wrap">
        <div className="grid-2" style={{ gap: 28, alignItems: "start" }}>
          <div className="acard reveal">
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>{lv("Нужна консультация?", "Maslahat kerakmi?", "Need a consultation?")}</h3>
            <p style={{ color: "var(--slate-600)", marginTop: 12, lineHeight: 1.6 }}>{lv("Наши менеджеры помогут подобрать оборудование и подготовят КП за 1 день.", "Menejerlarimiz uskuna tanlashga yordam beradi va 1 kunda KP tayyorlaydi.", "Our managers will help select equipment and prepare a quote in 1 day.")}</p>
            <a href="tel:+998772250001" className="acard-phone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              +998 (77) 225-00-01
            </a>
          </div>
          <div className="acard reveal">
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{lv("Документы", "Hujjatlar", "Documents")}</h3>
            {function () {
              const all = window.CMS && window.CMS.list("documents") || [];
              const vis = all.filter((d) => d.status !== "hidden" && (!d.places || d.places.includes("page") || d.places.includes("side")));
              if (vis.length) {
                const txx = (o) => o && (o[lang] || o.ru) || "";
                const CATN = { company: lv("Карточка компании", "Kompaniya kartasi", "Company card"), registration: lv("Регистрационные документы", "Ro'yxatga olish", "Registration"), license: lv("Лицензии", "Litsenziyalar", "Licenses"), certificate: lv("Сертификаты", "Sertifikatlar", "Certificates"), contract: lv("Договоры", "Shartnomalar", "Contracts"), warranty: lv("Гарантия и сервис", "Kafolat", "Warranty"), other: lv("Прочее", "Boshqa", "Other") };
                const order = ["company", "registration", "license", "certificate", "contract", "warranty", "other"];
                const groups = {};
                vis.forEach((d) => {const c = d.cat || "other";(groups[c] = groups[c] || []).push(d);});
                return order.filter((c) => groups[c]).map((c) =>
                <React.Fragment key={c}>
                    {groups[c].length > 0 && <div className="adoc-row"><svg className="adoc-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg><span className="adoc-name">{CATN[c]}</span></div>}
                    {groups[c].map((d) => {
                    const href = d.file ? d.file.data : d.href;
                    const draft = d.status === "draft";
                    return (
                      <div className="adoc-row sub" key={d.id} onClick={!draft && href ? () => openDoc(href, txx(d.title)) : undefined} style={{ cursor: !draft && href ? "pointer" : "default", opacity: draft ? .6 : 1 }}>
                          <span className="adoc-name">{txx(d.title)}{draft && <em style={{ fontStyle: "normal", fontSize: 11, color: "var(--slate-500)", marginLeft: 6 }}>· {lv("в подготовке", "tayyorlanmoqda", "in preparation")}</em>}</span>
                          {!draft && href && <svg className="adoc-dl" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 11l5 4 5-4M5 21h14" /></svg>}
                          {draft && <a href={"mailto:info@sogliqindustriyasi.uz?subject=" + encodeURIComponent(lv("Запрос документа", "Hujjat so'rovi", "Document request") + ": " + txx(d.title))} onClick={(e) => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 700, color: "var(--blue-600)", whiteSpace: "nowrap" }}>{lv("Запросить →", "So'rash →", "Request →")}</a>}
                        </div>);

                  })}
                  </React.Fragment>
                );
              }
              return <React.Fragment>
                <Doc name={lv("Карточка компании", "Kompaniya kartasi", "Company card")} href="corp/company-card.pdf" />
                <Doc name={lv("Регистрационные документы", "Ro'yxatdan o'tish hujjatlari", "Registration documents")} />
                <Doc sub name={lv("Свидетельство о регистрации", "Ro'yxatdan o'tish guvohnomasi", "Registration certificate")} href="corp/registration.pdf" />
                <Doc sub name={lv("Сведения о юридическом лице", "Yuridik shaxs to'g'risidagi ma'lumotlar", "Legal entity information")} href="corp/egrul.pdf" />
                <Doc name={lv("Договор-оферта поставки", "Yetkazib berish oferta-shartnomasi", "Supply offer agreement")} href="corp/supply-contract.pdf" />
                <Doc name={lv("Гарантийные условия", "Kafolat shartlari", "Warranty terms")} arrow />
                <Doc name={lv("Условия сервисного обслуживания", "Servis xizmati shartlari", "Service terms")} arrow />
              </React.Fragment>;
            }()}
          </div>
        </div>
      </div>
    </section>);

}
function ProjectsPage({ t, lang, go }) {
  const D = window.SI;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [f, setF] = useState("all");
  const [, force] = useState(0);
  const [viewer, setViewer] = useState(null);

  // источник данных: только CMS («Кейсы» из админки), без дефолтных проектов.
  useEffect(() => {
    if (!window.CMS) return;
    const off = window.CMS.on("cases", () => force((n) => n + 1));
    return off;
  }, []);

  const cmsCases = (window.CMS ? window.CMS.list("cases") : []).filter((c) => (c.status || "published") === "published");
  // нормализуем в единый вид карточки
  const source = cmsCases.map((c) => ({ id: c.id, tag: c.tag, t: c.title, d: c.desc, year: c.year, scope: c.scope, loc: c.region, type: c.type, image: c.image }));

  const list = source.filter((p) => f === "all" || p.type === f);
  const filters = [["all", lv("Все", "Barchasi", "All")], ["gov", lv("Госучреждения", "Davlat", "Public")], ["private", lv("Частные клиники", "Xususiy", "Private")]];
  const locText = (p) => typeof p.loc === "string" ? p.loc : tr(lang, p.loc);
  const imgUrl = (im) => !im ? "" : typeof im === "string" ? im : im.data || im.url || im.src || "";
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_projects} sub={t.pr_sub} />
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
            {filters.map(([v, label]) =>
            <button key={v} className={"btn " + (f === v ? "btn-pri" : "btn-ghost")} style={{ padding: "10px 20px" }} onClick={() => setF(v)}>{label}</button>
            )}
          </div>
          <div className="grid-3">
            {list.map((p) =>
            <div className="proj-card reveal" key={p.id}
              role="button" tabIndex={0}
              onClick={() => setViewer(p)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewer(p); } }}
              aria-label={lv("Открыть кейс", "Keysni ochish", "Open case") + ": " + tr(lang, p.t)}>
                {imgUrl(p.image) ?
              <img className="proj-photo" src={imgUrl(p.image)} alt={tr(lang, p.t)} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }} /> :
              <image-slot id={"proj-" + p.id} shape="rect" placeholder={tr(lang, p.t)}></image-slot>}
                <div className="proj-body">
                  <div className="proj-tag">{tr(lang, p.tag)}</div>
                  <h3>{tr(lang, p.t)}</h3>
                  <p>{tr(lang, p.d)}</p>
                  <div className="proj-meta">
                    {p.year && <span>{t.pr_year}: <b>{p.year}</b></span>}
                    {tr(lang, p.scope) && <span>{t.pr_scope}: <b>{tr(lang, p.scope)}</b></span>}
                    {locText(p) && <span>{t.pr_loc}: <b>{locText(p)}</b></span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {viewer && (() => {
        const Modal = window.SoiCaseModal;
        return Modal ? <Modal
          c={{ title: viewer.t, tag: viewer.tag, desc: viewer.d, year: viewer.year, region: viewer.loc, image: viewer.image }}
          lang={lang} tx={(o) => tr(lang, o)} img={imgUrl} onClose={() => setViewer(null)} /> : null;
      })()}
      <XBand t={t} go={go} />
    </div>);

}

/* ===== PARTNERS / BRANDS ===== */
/* «Бренды и заводы-производители» (корп-версия). Данные общие с каталожной
   витриной #/catalog/brands: window.DATA.BRANDS ← /api/brands ← admin/brands.
   Плитки те же (фото + название, 4×4 + пагинация); клик → каталожный профиль
   бренда со всей его продукцией (goCat). */
function PartnersPage({ t, lang, go, goCat }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const PER = 16; // 4 колонки × 4 ряда
  const [page, setPage] = React.useState(1);
  const [, force] = React.useState(0);
  // window.DATA.BRANDS приходит из API асинхронно (catalog-remote → soi-data-changed)
  React.useEffect(() => {
    const h = () => force((n) => n + 1);
    window.addEventListener("soi-data-changed", h);
    return () => window.removeEventListener("soi-data-changed", h);
  }, []);
  const brands = (window.DATA && window.DATA.BRANDS) || [];
  const totalPages = Math.max(1, Math.ceil(brands.length / PER));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = brands.slice((pageSafe - 1) * PER, pageSafe * PER);
  const goPage = (n) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openBrand = (b) => { if (goCat) goCat("brand", b.id); };
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_partners} sub={t.br_sub} />
      <section className="section">
        <div className="wrap">
          <div className="brands-page-grid reveal">
            {pageItems.map((b) => {
              const country = (b.country && (b.country[lang] || b.country.ru)) || lv(b.country_ru, b.country_uz, b.country_en) || "";
              return (
                <div key={b.id} className="brand-tile" onClick={() => openBrand(b)}>
                  <div className="bt-logo">
                    {b.logo
                      ? <img src={b.logo} alt={b.name} loading="lazy" />
                      : <div className="bt-mono">{b.name.slice(0, 2).toUpperCase()}</div>}
                  </div>
                  <div className="bt-body">
                    <div className="bt-name">{b.name}</div>
                    {country && <div className="bt-loc">{country}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="brands-pager">
              <button className="bp-btn" disabled={pageSafe === 1} onClick={() => goPage(pageSafe - 1)} aria-label="Prev">
                <CoIcon name="arrow" size={16} style={{ transform: "rotate(180deg)" }} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} className={"bp-btn" + (n === pageSafe ? " on" : "")} onClick={() => goPage(n)}>{n}</button>
              ))}
              <button className="bp-btn" disabled={pageSafe === totalPages} onClick={() => goPage(pageSafe + 1)} aria-label="Next">
                <CoIcon name="arrow" size={16} />
              </button>
            </div>
          )}
          <div className="reveal" style={{ marginTop: 50, padding: "30px 34px", background: "var(--bg)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 10 }}>{lv("Официальное представительство", "Rasmiy vakillik", "Official representation")}</h3>
            <p style={{ fontSize: 15, color: "var(--slate-600)", lineHeight: 1.65, maxWidth: 760 }}>
              {lv("Мы являемся официальным дистрибьютором перечисленных производителей в Республике Узбекистан. Это гарантирует подлинность оборудования, заводскую гарантию, доступность запчастей и техническую поддержку производителя.",
              "Biz sanab o'tilgan ishlab chiqaruvchilarning O'zbekiston Respublikasidagi rasmiy distribyutorimiz. Bu uskunaning haqiqiyligini, zavod kafolatini, ehtiyot qismlar mavjudligini va ishlab chiqaruvchi texnik yordamini kafolatlaydi.",
              "We are the official distributor of the listed manufacturers in the Republic of Uzbekistan. This guarantees equipment authenticity, factory warranty, spare parts availability and manufacturer technical support.")}
            </p>
          </div>
        </div>
      </section>
      <XBand t={t} go={go} />
    </div>);

}

/* ===== LICENSES / DOCUMENTS (institutional) ===== */

/* fallback-обложка документа (если PDF-превью не сформировалось) */
function DocFallbackSheet() {
  return (
    <svg viewBox="0 0 160 208" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
      <rect width="160" height="208" fill="#fff"/>
      <rect x="20" y="22" width="120" height="9" rx="2" fill="var(--blue-600)" opacity=".85"/>
      <rect x="20" y="40" width="88" height="6" rx="2" fill="var(--line-soft)"/>
      <rect x="20" y="60" width="120" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="72" width="120" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="84" width="104" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="104" width="120" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="116" width="112" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="128" width="120" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="20" y="140" width="72" height="5" rx="2.5" fill="var(--bg-2)"/>
      <circle cx="40" cy="180" r="15" stroke="var(--blue-600)" strokeWidth="1.5" opacity=".7"/>
      <rect x="66" y="174" width="54" height="5" rx="2.5" fill="var(--line-soft)"/>
      <rect x="66" y="184" width="40" height="5" rx="2.5" fill="var(--line-soft)"/>
    </svg>
  );
}

/* миниатюра первой страницы PDF (общий рендер window.rvpRenderPdfPage), fallback → обложка */
function DocPdfThumb({ url, alt }) {
  const [src, setSrc] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    let on = true; setSrc(null); setErr(false);
    if (!url || !window.rvpRenderPdfPage) { setErr(true); return; }
    window.rvpRenderPdfPage(url, 320).then((d) => on && setSrc(d)).catch(() => on && setErr(true));
    return () => { on = false; };
  }, [url]);
  if (src && !err) return <img src={src} alt={alt} loading="lazy" />;
  return <DocFallbackSheet />;
}

function LicensesPage({ t, lang, go }) {
  const D = window.SI;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const txx = (o) => (o && (o[lang] || o.ru)) || "";
  const [viewer, setViewer] = React.useState(null);
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_licenses}
      sub={lv("Реквизиты, регистрационные документы, условия поставки, гарантии, сервисная информация и правовые документы ООО «ИНДУСТРИЯ ЗДОРОВЬЯ».",
      "Kompaniyaning rekvizitlari, ro'yxatga olish hujjatlari, yetkazib berish shartlari, kafolatlar va huquqiy hujjatlari.",
      "Company details, registration documents, delivery terms, warranties, service information and legal documents of HEALTH INDUSTRY LLC.")} />
      <section className="section">
        <div className="wrap">
          {(() => {
            const CATS = [
            { id: "company", label: lv("Документы компании", "Kompaniya hujjatlari", "Company documents") },
            { id: "clients", label: lv("Документы для клиентов", "Mijozlar uchun hujjatlar", "Documents for clients") },
            { id: "service", label: lv("Документы по сервису", "Servis hujjatlari", "Service documents") },
            { id: "legal", label: lv("Правовая информация", "Huquqiy ma'lumot", "Legal information") }];

            // managed documents from the admin CMS (visible only)
            const all = (window.CMS ? window.CMS.list("documents") : []).filter((d) => d.status !== "hidden");

            const cardCms = (d) => {
              const url = (d.file && (d.file.data || d.file.url)) || d.href || "";
              const openable = !!url && d.status !== "draft";
              const open = () => { if (openable) setViewer({ letter: { data: url, type: (d.file && d.file.type) || "application/pdf" }, company: d.title }); };
              return (
                <div className="lic-card reveal" key={d.id}>
                  <div className={"lic-thumb" + (openable ? " clickable" : "")}
                    {...(openable ? { role: "button", tabIndex: 0, onClick: open,
                      onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } },
                      "aria-label": lv("Открыть документ", "Hujjatni ochish", "Open document") + ": " + txx(d.title) } : {})}>
                    {openable ? <DocPdfThumb url={url} alt={txx(d.title)} /> : <DocFallbackSheet />}
                  </div>
                  <div className="lt">{txx(d.title)}</div>
                </div>);
            };
            return CATS.map((c) => {
              const cmsItems = all.filter((d) => (d.cat || "company") === c.id);
              if (!cmsItems.length) return null;
              return (
                <div className="lic-group" key={c.id}>
                  <h3 className="lic-group-h">{c.label} <span>{cmsItems.length}</span></h3>
                  <div className="lic-grid">{cmsItems.map(cardCms)}</div>
                </div>);
            });
          })()}
        </div>
      </section>
      {viewer && (() => {
        const Viewer = window.RvpSheetViewer;
        return Viewer ? <Viewer r={viewer} tx={txx} lv={lv} onClose={() => setViewer(null)} /> : null;
      })()}
    </div>);

}

/* ===== SERVICES ===== */
function ServicesPage({ t, lang, go }) {
  const D = window.SI;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_services} sub={t.svc_sub} />
      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 22 }}>
            {D.SERVICES.map((s, i) => {
              const linkView = s.t === "svc5_t" ? "staffTraining" : s.t === "svc4_t" ? "registration" : s.t === "svc6_t" ? "tenders" : null;
              return (
              <div className="scard reveal" key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", cursor: linkView ? "pointer" : "default" }} onClick={linkView ? () => go(linkView) : undefined}>
                <div className="ic" style={{ flexShrink: 0, marginBottom: 0 }}><CoIcon name={s.ic} size={24} /></div>
                <div>
                  <h3>{t[s.t]}</h3>
                  <p>{t[s.d]}</p>
                </div>
              </div>
              );
            })}
          </div>

          {/* RU registration highlight */}
          <div className="reveal" style={{ marginTop: 40, padding: "34px 36px", background: "linear-gradient(120deg,var(--blue-50),var(--blue-50))", borderRadius: "var(--r-lg)", border: "1px solid var(--line-soft)" }}>
            <span className="eyebrow">{lv("Регистрация изделий", "Buyumlarni ro'yxatga olish", "Device registration")}</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: "14px 0 10px", letterSpacing: "-.01em" }}>{lv("Получение регистрационного удостоверения (РУ) в Республике Узбекистан", "O'zbekiston Respublikasida ro'yxatga olish guvohnomasini (RU) olish", "Obtaining a registration certificate (RC) in Uzbekistan")}</h3>
            <p style={{ fontSize: 15, color: "var(--slate-600)", lineHeight: 1.65, maxWidth: 820 }}>
              {lv("Сопровождаем регистрацию медицинских изделий «под ключ»: подготовка досье, испытания, взаимодействие с уполномоченными органами и получение РУ. Это позволяет легально ввозить и применять оборудование на территории Узбекистана.",
              "Tibbiy buyumlarni «kalit ostida» ro'yxatga olishni qo'llab-quvvatlaymiz: dosye tayyorlash, sinovlar, vakolatli organlar bilan ishlash va RU olish. Bu O'zbekiston hududida uskunani qonuniy import qilish va qo'llash imkonini beradi.",
              "We provide turnkey medical device registration: dossier preparation, testing, liaison with authorized bodies and obtaining the RC. This allows legal import and use of equipment in Uzbekistan.")}
            </p>
          </div>
        </div>
      </section>
      <XBand t={t} go={go} />
    </div>);

}

/* ===== CONTACTS ===== */
function ContactsPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHero t={t} lang={lang} go={go} title={t.nav_contacts} />
      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 48, alignItems: "flex-start" }}>
            <div className="cinfo reveal">
              <div className="cgrp">
                <h4>{t.c_office}</h4>
                <div>{t.c_office_addr}<br />{t.c_office_h}</div>
              </div>
              <div className="cgrp">
                <h4>{t.c_wh}</h4>
                <div>{t.c_office_addr}<br />{t.c_wh_h}</div>
              </div>
              <div className="cgrp">
                <h4>{t.c_phones}</h4>
                <div>
                  {lv("Приёмная", "Qabulxona", "Reception")}: +998 (77) 225-00-01<br />
                  {lv("Отдел продаж", "Sotuv bo'limi", "Sales")}: +998 (77) 224-00-01<br />
                  {lv("Сервис", "Servis", "Service")}: +998 (77) 223-00-01
                </div>
              </div>
              <div className="cgrp">
                <h4>{t.c_mail}</h4>
                <div>{t.u_mail}</div>
              </div>
            </div>
            <div className="cform reveal">
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{t.c_form_t}</h3>
              {sent ?
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CoIcon name="check" size={28} /></div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{lv("Заявка отправлена!", "Ariza yuborildi!", "Request sent!")}</div>
                  <p style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 6 }}>{lv("Мы свяжемся с вами в ближайшее время.", "Tez orada siz bilan bog'lanamiz.", "We will contact you shortly.")}</p>
                </div> :

              <form onSubmit={(e) => {e.preventDefault();setSent(true);}}>
                  <label>{t.c_name}</label>
                  <input required placeholder={t.c_name} />
                  <label>{t.c_phone}</label>
                  <input required type="tel" placeholder="+998 __ ___ __ __" />
                  <label>{t.c_msg}</label>
                  <textarea rows="4" placeholder={t.c_msg}></textarea>
                  <button className="btn btn-pri" style={{ width: "100%", justifyContent: "center" }} type="submit">{t.c_send}</button>
                </form>
              }
            </div>
          </div>
        </div>
      </section>
    </div>);

}

/* shared cross-link band */
function XBand({ t, go }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="xband reveal">
          <div className="xb-tx"><h3>{t.xb_title}</h3><p>{t.xb_sub}</p></div>
          <a className="btn btn-white btn-lg xb-act" onClick={() => go("catalog")} style={{ cursor: "pointer" }}>{t.xb_btn}</a>
        </div>
      </div>
    </section>);

}

Object.assign(window, { PageHero, AboutPage, ProjectsPage, PartnersPage, LicensesPage, ServicesPage, ContactsPage, XBand });