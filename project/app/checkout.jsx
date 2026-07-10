/* ИНДУСТРИЯ ЗДОРОВЬЯ — Tenders + News pages (per TZ) */

/* Live tender lots from UZEX (etender.uzex.uz/lots/2/0), served from our
   backend cache: GET /api/etender/lots?typeId=2. See EtenderModule on the API. */
function useEtenderLotsCss() {
  React.useEffect(() => {
    const ID = "etl-css";
    if (document.getElementById(ID)) return;
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `
.etl-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px}
.etl-src{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:var(--blue-700,#1749a6);background:var(--blue-50,#eef4ff);border:1px solid var(--blue-200,#cfe0fb);border-radius:8px;padding:6px 12px}
.etl-src .dot{width:7px;height:7px;border-radius:50%;background:#15A06A;box-shadow:0 0 0 3px rgba(21,160,106,.18)}
.etl-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.etl-search{height:42px;min-width:230px;border:1.5px solid var(--line);border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;background:var(--bg);color:var(--ink);outline:none}
.etl-search:focus{border-color:var(--blue-400,#4d88e0)}
.etl-count{font-size:13px;color:var(--slate-500);white-space:nowrap}
.etl-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.etl-tab{font-size:13px;font-weight:600;color:var(--slate-600);background:var(--bg-2,#f4f7fb);border:1.5px solid var(--line);border-radius:20px;padding:7px 14px;cursor:pointer;font-family:inherit;transition:.14s;display:inline-flex;align-items:center;gap:7px}
.etl-tab:hover{border-color:var(--blue-300,#9cc0f5)}
.etl-tab.on{background:var(--blue-600);border-color:var(--blue-600);color:#fff}
.etl-tab .n{font-size:11px;font-weight:700;background:rgba(0,0,0,.08);border-radius:10px;padding:1px 7px}
.etl-tab.on .n{background:rgba(255,255,255,.22)}
.etl-srctag{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--blue-700,#1749a6);background:var(--blue-50,#eef4ff);border-radius:5px;padding:2px 7px;white-space:nowrap}
.etl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.etl-card{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r-lg,16px);background:var(--surface,#fff);padding:20px;transition:box-shadow .16s,border-color .16s;position:relative}
.etl-card:hover{box-shadow:var(--sh-sm,0 6px 20px rgba(16,42,86,.08));border-color:var(--blue-200,#cfe0fb)}
.etl-card-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.etl-no{font-size:12px;font-weight:700;color:var(--slate-500);font-variant-numeric:tabular-nums}
.etl-deadline{font-size:11.5px;font-weight:700;border-radius:20px;padding:4px 10px;white-space:nowrap}
.etl-deadline.ok{color:#15803d;background:#e7f6ec}
.etl-deadline.soon{color:#b45309;background:#fdf1e0}
.etl-deadline.urgent{color:#b42318;background:#fdeceb}
.etl-name{font-size:14.5px;font-weight:700;line-height:1.4;color:var(--ink);margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:60px}
.etl-meta{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}
.etl-row{display:flex;gap:9px;align-items:flex-start;font-size:12.5px;color:var(--slate-600);line-height:1.4}
.etl-row svg{flex-shrink:0;color:var(--slate-400);margin-top:1px}
.etl-cost{margin-top:auto;padding-top:14px;border-top:1px solid var(--line);display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.etl-cost-v{font-size:18px;font-weight:900;letter-spacing:-.02em;color:var(--ink);font-variant-numeric:tabular-nums}
.etl-cost-c{font-size:12px;font-weight:700;color:var(--slate-400)}
.etl-open{font-size:12.5px;font-weight:700;color:var(--blue-600);white-space:nowrap;display:inline-flex;align-items:center;gap:4px}
.etl-open:hover{text-decoration:underline}
.etl-skel{border:1px solid var(--line);border-radius:var(--r-lg,16px);background:var(--surface,#fff);padding:20px;height:210px}
.etl-skel .b{background:linear-gradient(90deg,var(--bg-2,#f1f5f9) 25%,var(--line,#e2e8f0) 50%,var(--bg-2,#f1f5f9) 75%);background-size:200% 100%;animation:etlsh 1.3s infinite;border-radius:7px}
@keyframes etlsh{0%{background-position:200% 0}100%{background-position:-200% 0}}
.etl-state{text-align:center;padding:44px 20px;border:1px dashed var(--line);border-radius:var(--r-lg,16px);color:var(--slate-500);font-size:14px}
.etl-more{display:flex;justify-content:center;margin-top:26px}
@media(max-width:900px){.etl-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.etl-grid{grid-template-columns:1fr}.etl-name{min-height:0}}
    `;
    document.head.appendChild(s);
  }, []);
}

function EtenderLotsBlock({ lang, lv }) {
  const { useState, useEffect } = React;
  useEtenderLotsCss();
  const PAGE = 12;
  const [lots, setLots] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState(""); // "" = all sources

  // debounce search input -> term
  useEffect(() => {
    const id = setTimeout(() => setTerm(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  // source registry (for tabs + per-card labels)
  useEffect(() => {
    let alive = true;
    (window.api && window.api.listPublic ? window.api.listPublic("etender/sources") : Promise.resolve([]))
      .then((res) => { if (alive) setSources(Array.isArray(res) ? res : []); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    setStatus((s) => (s === "ready" ? "ready" : "loading"));
    const q = { state: "active", limit, page: 1 };
    if (source) q.source = source;
    if (term) q.search = term;
    (window.api && window.api.listPublic ? window.api.listPublic("etender/lots", q) : Promise.reject(new Error("api")))
      .then((res) => { if (!alive) return; setLots((res && res.data) || []); setTotal((res && res.total) || 0); setStatus("ready"); })
      .catch(() => { if (alive) setStatus("error"); });
    return () => { alive = false; };
  }, [limit, term, source]);

  const pickSource = (s) => { setSource(s); setLimit(PAGE); };
  const srcLabel = (id) => { const s = sources.find((x) => x.source === id); return s ? (s.label[lang] || s.label.ru) : id; };
  const tabs = sources.filter((s) => s.count > 0);

  const fmtCost = (v) => {
    if (v === null || v === undefined || v === "") return "—";
    const n = Number(v);
    if (isNaN(n)) return String(v);
    return n.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
  };
  const fmtDate = (d) => {
    if (!d) return "";
    const x = new Date(d);
    if (isNaN(x.getTime())) return "";
    return String(x.getDate()).padStart(2, "0") + "." + String(x.getMonth() + 1).padStart(2, "0") + "." + x.getFullYear();
  };
  const deadline = (d) => {
    if (!d) return null;
    const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    if (isNaN(days)) return null;
    const cls = days <= 2 ? "urgent" : days <= 7 ? "soon" : "ok";
    const label = days < 0 ? lv("завершён", "yakunlangan", "closed")
      : days === 0 ? lv("сегодня", "bugun", "today")
      : lv("остаётся ", "qoldi ", "") + days + lv(" дн.", " kun", "d left");
    return { cls, label };
  };
  const IcnPin = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
  const IcnUser = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  const IcnCal = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;

  return (
    <section className="section alt" id="etender-lots">
      <div className="wrap">
        <div className="etl-head reveal">
          <div>
            <span className="eyebrow line">{lv("Актуальные закупки", "Dolzarb xaridlar", "Live procurement")}</span>
            <h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Актуальные тендерные лоты", "Dolzarb tender lotlari", "Live tender lots")}</h2>
            <p style={{ fontSize: 14.5, color: "var(--slate-600)", maxWidth: 620, lineHeight: 1.6, marginTop: 10 }}>
              {lv("Открытые лоты с площадок государственных закупок (etender, biznesxarid и др.). Данные обновляются автоматически.",
                "Davlat xaridlari maydonchalaridan (etender, biznesxarid va b.) ochiq lotlar. Ma'lumotlar avtomatik yangilanadi.",
                "Open lots from public-procurement platforms (etender, biznesxarid, …), refreshed automatically.")}
            </p>
          </div>
          <span className="etl-src"><span className="dot"></span>UZEX · gov.uz</span>
        </div>

        {tabs.length > 1 &&
          <div className="etl-tabs reveal">
            <button className={"etl-tab" + (source === "" ? " on" : "")} onClick={() => pickSource("")}>{lv("Все", "Barchasi", "All")}</button>
            {tabs.map((s) =>
              <button key={s.source} className={"etl-tab" + (source === s.source ? " on" : "")} onClick={() => pickSource(s.source)}>
                {s.label[lang] || s.label.ru}<span className="n">{s.count}</span>
              </button>
            )}
          </div>}

        <div className="etl-head reveal" style={{ marginBottom: 20 }}>
          <input className="etl-search" value={query} onChange={(e) => { setQuery(e.target.value); }} placeholder={lv("Поиск: наименование, заказчик, №…", "Qidiruv: nomi, buyurtmachi, №…", "Search: name, customer, №…")} />
          <span className="etl-count">{status === "ready" ? (lv("Найдено лотов: ", "Topilgan lotlar: ", "Lots found: ") + total) : ""}</span>
        </div>

        {status === "loading" &&
          <div className="etl-grid">{Array.from({ length: 6 }).map((_, i) =>
            <div className="etl-skel" key={i}>
              <div className="b" style={{ height: 12, width: "40%", marginBottom: 16 }}></div>
              <div className="b" style={{ height: 14, marginBottom: 8 }}></div>
              <div className="b" style={{ height: 14, width: "80%", marginBottom: 22 }}></div>
              <div className="b" style={{ height: 20, width: "55%" }}></div>
            </div>)}
          </div>}

        {status === "error" &&
          <div className="etl-state">
            {lv("Не удалось загрузить лоты. Попробуйте обновить страницу позже.", "Lotlarni yuklab bo'lmadi. Keyinroq urinib ko'ring.", "Could not load lots. Please try again later.")}
            <div style={{ marginTop: 14 }}><button className="btn btn-ghost" onClick={() => { setStatus("loading"); setLimit((l) => l); setTerm((tm) => tm + " "); setTimeout(() => setTerm(query.trim()), 0); }}>{lv("Повторить", "Qayta urinish", "Retry")}</button></div>
          </div>}

        {status === "ready" && lots.length === 0 &&
          <div className="etl-state">{lv("По запросу лотов не найдено.", "So'rov bo'yicha lotlar topilmadi.", "No lots match your query.")}</div>}

        {status === "ready" && lots.length > 0 &&
          <React.Fragment>
            <div className="etl-grid">
              {lots.map((l) => {
                const dl = deadline(l.endDate);
                return (
                  <div className="etl-card reveal" key={l.id}>
                    <div className="etl-card-top">
                      <span className="etl-no">{l.displayNo ? "№ " + l.displayNo : (source === "" ? <span className="etl-srctag">{srcLabel(l.source)}</span> : "№ " + l.externalId)}</span>
                      {dl && <span className={"etl-deadline " + dl.cls}>{dl.label}</span>}
                    </div>
                    <h3 className="etl-name" title={l.name}>{l.name}</h3>
                    <div className="etl-meta">
                      {l.sellerName && <div className="etl-row">{IcnUser}<span>{l.sellerName}</span></div>}
                      {(l.regionName || l.districtName) && <div className="etl-row">{IcnPin}<span>{[l.regionName, l.districtName].filter(Boolean).join(", ")}</span></div>}
                      {l.endDate && <div className="etl-row">{IcnCal}<span>{lv("до ", "gacha ", "until ")}{fmtDate(l.endDate)}</span></div>}
                    </div>
                    <div className="etl-cost">
                      <div>{l.kind === "news" ? <span className="etl-srctag">{srcLabel(l.source)}</span> : <React.Fragment><span className="etl-cost-v">{fmtCost(l.cost)}</span> <span className="etl-cost-c">{l.currencyCode || ""}</span></React.Fragment>}</div>
                      <a className="etl-open" href={l.sourceUrl || "#"} target="_blank" rel="noopener">{lv("Открыть", "Ochish", "Open")} ↗</a>
                    </div>
                  </div>
                );
              })}
            </div>
            {lots.length < total &&
              <div className="etl-more">
                <button className="btn btn-ghost btn-lg" onClick={() => setLimit((l) => l + PAGE)}>
                  {lv("Показать ещё", "Yana ko'rsatish", "Show more")} ({total - lots.length})
                </button>
              </div>}
          </React.Fragment>}
      </div>
    </section>
  );
}

function CoTendersPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [sent, setSent] = useState(false);
  const steps = [
  { t: lv("Отправьте ТЗ или спецификацию", "TT yoki spetsifikatsiya yuboring", "Send a spec or requirements"), d: lv("Прикрепите техническое задание закупки или список позиций.", "Xarid texnik topshirig'ini yoki pozitsiyalar ro'yxatini biriktiring.", "Attach the procurement spec or list of items.") },
  { t: lv("Получите КП и спецификацию", "Taklif va spetsifikatsiya oling", "Receive a quote and specification"), d: lv("Менеджер подготовит коммерческое предложение под требования закупки.", "Menejer xarid talablariga mos taklif tayyorlaydi.", "A manager prepares a commercial offer to match the procurement.") },
  { t: lv("Комплект документов", "Hujjatlar to'plami", "Document package"), d: lv("Карточка компании, сертификаты, гарантийные и сервисные условия.", "Kompaniya kartasi, sertifikatlar, kafolat va servis shartlari.", "Company card, certificates, warranty and service terms.") },
  { t: lv("Поставка по требованиям", "Talablar bo'yicha yetkazish", "Supply per requirements"), d: lv("Поставка, монтаж и сопровождение согласно условиям контракта.", "Shartnoma shartlariga ko'ra yetkazish, montaj va qo'llab-quvvatlash.", "Delivery, installation and support per the contract terms.") }];

  return (
    <div>
      <section className="page-hero">
        <div className="pw"></div>
        <div className="wrap">
          <div className="crumb"><a onClick={() => go("home")}>{t.nav_home}</a> / {t.nav_tenders}</div>
          <h1>{lv("Тендеры и государственные закупки", "Tender va davlat xaridlari", "Tenders & public procurement")}</h1>
          <p style={{ maxWidth: 660 }}>{lv("Готовим коммерческие предложения, спецификации и документы для участия в тендерах и закупках медицинских учреждений.", "Tibbiy muassasalar tenderlari va xaridlari uchun tijorat takliflari, spetsifikatsiyalar va hujjatlar tayyorlaymiz.", "We prepare commercial offers, specifications and documents for tenders and procurement by medical institutions.")}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="tnd-stats reveal">
            {[{ n: "60+", l: lv("госконтрактов", "davlat shartnomalari", "public contracts") },
            { n: lv("4.2 млрд", "4.2 mlrd", "4.2B"), l: lv("сум поставок", "so'm yetkazib berish", "UZS delivered") },
            { n: "14", l: lv("регионов", "hududlar", "regions") },
            { n: "98%", l: lv("выполнено в срок", "muddatida", "on-time") }].map((s, i) =>
            <div key={i} className="tnd-stat"><div className="ts-n">{s.n}</div><div className="ts-l">{s.l}</div></div>
            )}
          </div>
        </div>
      </section>

      <EtenderLotsBlock lang={lang} lv={lv} />

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Как это работает", "Qanday ishlaydi", "How it works")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Сценарий работы по тендеру", "Tender bo'yicha ish stsenariysi", "Tender workflow")}</h2></div>
          <div className="grid-4">
            {steps.map((s, i) =>
            <div className="scard reveal" key={i}>
                <div className="reg-step-n" style={{ marginBottom: 14 }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ fontSize: 16 }}>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Опыт", "Tajriba", "Track record")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Выигранные тендеры", "G'alaba qozonilgan tenderlar", "Successful tenders")}</h2></div>
          <div className="tnd-table reveal">
            <table>
              <thead><tr>
                <th>{lv("Организация", "Tashkilot", "Organization")}</th>
                <th style={{ textAlign: "right" }}>{lv("Сумма", "Summa", "Amount")}</th>
                <th>{lv("Дата", "Sana", "Date")}</th>
              </tr></thead>
              <tbody>
                {[{ org: lv("Республиканский онкологический центр", "Respublika onkologiya markazi", "Republican Oncology Centre"), cat: lv("Комплексное оснащение отделения", "Bo'limni to'liq jihozlash", "Department equipping"), sum: "2 140 000 000", date: "02.03.2026" },
                { org: lv("Самаркандский гос. медицинский университет", "Samarqand davlat tibbiyot universiteti", "Samarkand State Medical University"), cat: lv("Хирургия и анестезиология", "Jarrohlik va anesteziologiya", "Surgery & anaesthesiology"), sum: "860 000 000", date: "14.04.2026" },
                { org: lv("Ташкентская гор. клиническая больница №1", "Toshkent shahar klinik shifoxonasi №1", "Tashkent City Clinical Hospital №1"), cat: lv("Диагностика и мониторинг", "Diagnostika va monitoring", "Diagnostics & monitoring"), sum: "480 000 000", date: "28.05.2026" },
                { org: lv("Ферганская областная больница", "Farg'ona viloyat shifoxonasi", "Fergana Regional Hospital"), cat: lv("Стерилизация и дезинфекция", "Sterilizatsiya va dezinfeksiya", "Sterilization & disinfection"), sum: "320 000 000", date: "10.12.2025" }].map((r, i) =>
                <tr key={i}>
                    <td><div style={{ fontWeight: 700 }}>{r.org}</div><div style={{ fontSize: 12.5, color: "var(--slate-400)", marginTop: 2 }}>{r.cat}</div></td>
                    <td style={{ textAlign: "right", fontWeight: 800, whiteSpace: "nowrap" }}>{r.sum} <span style={{ fontSize: 11, color: "var(--slate-400)", fontWeight: 600 }}>{lv("сум", "so'm", "UZS")}</span></td>
                    <td style={{ color: "var(--slate-400)", fontSize: 13, whiteSpace: "nowrap" }}>{r.date}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 40, alignItems: "flex-start" }}>
            <div className="reveal">
              <h2 className="h-sec" style={{ fontSize: 28 }}>{lv("Что мы готовим для закупки", "Xarid uchun nimani tayyorlaymiz", "What we prepare for procurement")}</h2>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                {[lv("Коммерческое предложение (КП)", "Tijorat taklifi", "Commercial offer"),
                lv("Техническую спецификацию", "Texnik spetsifikatsiya", "Technical specification"),
                lv("Сертификаты и документы на оборудование", "Uskuna sertifikatlari va hujjatlari", "Equipment certificates and documents"),
                lv("Карточку компании и реквизиты", "Kompaniya kartasi va rekvizitlar", "Company card and details"),
                lv("Условия гарантии и сервиса", "Kafolat va servis shartlari", "Warranty and service terms")].map((d, i) =>
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <CoIcon name="check" size={18} style={{ color: "var(--blue-600)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14.5, color: "var(--slate-700)" }}>{d}</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a className="btn btn-ghost" href="corp/company-card.pdf" target="_blank" rel="noopener">{lv("Скачать карточку компании", "Kompaniya kartasini yuklab olish", "Download company card")} <CoIcon name="download" size={15} /></a>
                <a className="btn btn-ghost" onClick={() => go("catalog")} style={{ cursor: "pointer" }}>{lv("Тендерная корзина в каталоге", "Katalog tender savati", "Tender cart in the catalog")} →</a>
              </div>
            </div>

            <div className="cform reveal" id="tender-form">
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>{lv("Отправить ТЗ", "TT yuborish", "Send a spec")}</h3>
              {sent ?
              <div style={{ padding: "30px 10px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><CoIcon name="check" size={26} /></div>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{lv("ТЗ отправлено!", "TT yuborildi!", "Spec sent!")}</div>
                  <p style={{ fontSize: 13.5, color: "var(--slate-500)", marginTop: 6 }}>{lv("Менеджер по тендерам подготовит КП.", "Tender menejeri taklif tayyorlaydi.", "Our tender manager will prepare a quote.")}</p>
                </div> :

              <form onSubmit={(e) => {e.preventDefault();setSent(true);}}>
                  <label>{lv("Организация", "Tashkilot", "Organization")} *</label>
                  <input required placeholder={lv("Название учреждения", "Muassasa nomi", "Institution name")} />
                  <div className="grid-2" style={{ gap: 0 }}>
                    <div style={{ paddingRight: 8 }}><label>{lv("Имя", "Ism", "Name")} *</label><input required placeholder={lv("Контактное лицо", "Aloqa shaxsi", "Contact person")} /></div>
                    <div style={{ paddingLeft: 8 }}><label>{lv("Телефон", "Telefon", "Phone")} *</label><input required type="tel" placeholder="+998 __ ___ __ __" /></div>
                  </div>
                  <label>{lv("Файл ТЗ", "TT fayli", "Spec file")}</label>
                  <input type="file" style={{ padding: "9px 12px" }} />
                  <label>{lv("Комментарий", "Izoh", "Comment")}</label>
                  <textarea rows="3" placeholder={lv("Сроки, бюджет, перечень позиций…", "Muddatlar, byudjet, pozitsiyalar…", "Timelines, budget, list of items…")}></textarea>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontWeight: 500, fontSize: 13, color: "var(--slate-500)", cursor: "pointer" }}>
                    <input type="checkbox" required style={{ width: "auto", margin: "3px 0 0" }} />
                    <span>{lv("Согласен с политикой конфиденциальности.", "Maxfiylik siyosatiga roziman.", "I agree with the privacy policy.")}</span>
                  </label>
                  <button className="btn btn-pri" style={{ width: "100%", justifyContent: "center" }} type="submit">{lv("Отправить ТЗ и получить КП", "TT yuborish va taklif olish", "Send spec and get a quote")}</button>
                </form>
              }
            </div>
          </div>
        </div>
      </section>
    </div>);

}

function SubscribeCard({ lv }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState(null); // null | "ok" | "err"

  const validate = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const submit = (e) => {
    e.preventDefault();
    if (!validate(email)) { setStatus("err"); return; }
    setStatus("ok");
  };

  if (status === "ok") return (
    <div className="acard" data-comment-anchor="ac7d5193a1-div-247-15" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
      <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
        {lv("Спасибо!", "Rahmat!", "Thank you!")}
      </h4>
      <p style={{ fontSize: 13.5, color: "var(--slate-600)", lineHeight: 1.5 }}>
        {lv("Вы подписались на новости ИНДУСТРИЯ ЗДОРОВЬЯ.", "Siz SOG’LIQ INDUSTRIYASI yangiliklariga obuna bo'ldingiz.", "You have subscribed to HEALTH INDUSTRY news.")}
      </p>
    </div>
  );

  return (
    <div className="acard" data-comment-anchor="ac7d5193a1-div-247-15">
      <h4 style={{ fontSize: 16, fontWeight: 800 }}>{lv("Подписка на новости", "Yangiliklarga obuna", "Subscribe to news")}</h4>
      <p style={{ margin: "10px 0 14px", color: "var(--slate-600)", fontSize: 14 }}>{lv("Раз в месяц — обзор поставок, тендеров и новинок.", "Oyda bir marta — yangiliklar sharhi.", "Monthly digest of supplies, tenders and new products.")}</p>
      <form style={{ display: "flex", flexDirection: "column", gap: 9 }} onSubmit={submit} noValidate>
        <input
          type="email"
          placeholder="email@clinic.uz"
          className="news-inp"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "err") setStatus(null); }}
          style={status === "err" ? { borderColor: "var(--red-400, #f87171)" } : {}}
        />
        {status === "err" &&
          <span style={{ fontSize: 12.5, color: "var(--red-500, #ef4444)", marginTop: -4 }}>
            {lv("Введите корректный email.", "To'g'ri email kiriting.", "Please enter a valid email.")}
          </span>}
        <button type="submit" className="btn btn-pri" style={{ justifyContent: "center" }}>
          {lv("Подписаться", "Obuna bo'lish", "Subscribe")}
        </button>
      </form>
    </div>
  );
}

// Article body comes from a contentEditable rich-text field and may carry pasted
// Word/Docs markup (MsoNormal classes, inline fonts, empty <o:p> tags). Strip that
// so it renders with the site's own typography instead of raw tags or Word styling.
function cleanArticleHtml(html) {
  if (!html) return "";
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<o:p>\s*<\/o:p>/gi, "")
    .replace(/\s(style|class|lang)="[^"]*"/gi, "");
}

function CoNewsPage({ t, lang, go, fromCatalog, goCatalog }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [cat, setCat] = React.useState("all");
  const [tag, setTag] = React.useState("all");
  const [open, setOpen] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!window.CMS) return;
    return window.CMS.on("news", () => setTick((x) => x + 1));
  }, []);
  const tx = (o) => o ? o[lang] || o.ru || "" : "";
  const coverUrl = (c) => !c ? "" : typeof c === "string" ? c : c.data || c.url || c.src || "";
  const fmtDate = (d) => {if (!d) return "";const p = d.split("-");return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d;};
  // --- video helpers ---
  const ytId = (url) => {
    if (!url) return "";
    const s = String(url).trim();
    const m = s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    return "";
  };
  const isVideo = (n) => normType(n) === "video";
  // for a video card: explicit cover, else YouTube hi-res thumbnail
  const videoThumb = (n) => {const v = ytId(n.youtube);return coverUrl(n.cover) || (v ? `https://i.ytimg.com/vi/${v}/hqdefault.jpg` : "");};
  // catalog product lookup for related items
  const allProducts = window.CMS && window.CMS.list("products") || [];
  const prodName = (id) => {const p = allProducts.find((x) => String(x.id) === String(id));return p ? (p.ru || p.name || "").split(",")[0] || "Товар" : null;};
  const catData = window.DATA && window.DATA.CATEGORIES || [];
  const catName = (id) => {const c = catData.find((x) => x.id === id);return c ? tl(c) : null;};
  const CATS = window.SOI_CORE && window.SOI_CORE.NEWS_CATEGORIES || [];
  const TAGS = window.SOI_CORE && window.SOI_CORE.NEWS_TAGS || [];
  const tl = (o) => o ? o[lang] || o.ru || "" : "";
  const normType = (n) => {const ty = n.type === "news" ? "new" : n.type || "new";return ty;};
  const catLabel = (n) => {const c = CATS.find((x) => x.id === normType(n));return c ? tl(c) : tx(n.cat) || normType(n);};
  const iconByType = (ty) => ({
    "new": "M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z",
    "tender": "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    "article": "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6 M8 13h8 M8 17h6",
    "guide": "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    "case": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    "video": "M23 7l-7 5 7 5z M1 5h15v14H1z",
    "company": "M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"
  })[ty] || "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6";

  const ALL = (window.CMS && window.CMS.list("news") || []).
  filter((n) => n.published !== false).
  sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const byCat = cat === "all" ? ALL : ALL.filter((n) => normType(n) === cat);
  const filtered = tag === "all" ? byCat : byCat.filter((n) => (n.tags || []).includes(tag));
  // only show category tabs / tags that actually have content
  const usedTypes = new Set(ALL.map(normType));
  const catTabs = CATS.filter((c) => usedTypes.has(c.id));
  const usedTags = new Set();
  byCat.forEach((n) => (n.tags || []).forEach((tg) => usedTags.add(tg)));
  const tagList = TAGS.filter((tg) => usedTags.has(tg.id));
  return (
    <div>
      <section className="page-hero">
        <div className="pw"></div>
        <div className="wrap">
          <div className="crumb">
              <a onClick={() => go("home")}>{t.nav_home}</a>
              {fromCatalog && <> / <a onClick={() => goCatalog ? goCatalog() : go("catalog")}>{lv("Каталог", "Katalog", "Catalog")}</a></>}
              {" / "}{t.nav_news}
            </div>
          <h1>{lv("Новости и статьи", "Yangiliklar va maqolalar", "News & articles")}</h1>
          <p style={{ maxWidth: 620 }}>{lv("Поставки, проекты, изменения в регистрации медицинских изделий и обзоры оборудования.", "Yetkazib berish, loyihalar, ro'yxat o'zgarishlari va uskuna sharhlari.", "Supplies, projects, changes in device registration and equipment reviews.")}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="news-layout">
            <div>
              <div className="news-kinds">
                <button className={"nk " + (cat === "all" ? "on" : "")} onClick={() => {setCat("all");setTag("all");}}>{lv("Все", "Barchasi", "All")}</button>
                {catTabs.map((c) =>
                <button key={c.id} className={"nk " + (cat === c.id ? "on" : "")} onClick={() => {setCat(c.id);setTag("all");}}>{tl(c)}</button>
                )}
              </div>
              {tagList.length > 0 &&
              <div className="news-cats">
                <button className={"nc " + (tag === "all" ? "on" : "")} onClick={() => setTag("all")}>{lv("Все темы", "Barcha mavzular", "All tags")}</button>
                {tagList.map((tg) => <button key={tg.id} className={"nc " + (tag === tg.id ? "on" : "")} onClick={() => setTag(tg.id)}>#{tl(tg)}</button>)}
              </div>
              }
              <div className="news-list">
                {filtered.length === 0 &&
                <div className="news-empty" style={{ padding: "40px 0", color: "var(--slate-500)" }}>{lv("Публикаций пока нет. Скоро здесь появятся новости и статьи компании.", "Hozircha e'lonlar yo'q. Tez orada yangiliklar paydo bo'ladi.", "No publications yet. Company news and articles will appear here soon.")}</div>
                }
                {filtered.map((n, i) =>
                <div key={n.id || i} className={"news-card reveal" + (isVideo(n) ? " is-video" : "")} onClick={() => {setPlaying(false);setOpen(n);}} style={{ cursor: "pointer" }}>
                    {isVideo(n) && videoThumb(n) ?
                  <div className="nc-cover nc-video-cover"><img src={videoThumb(n)} alt={tx(n.title)} loading="lazy" /><span className="nc-play"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg></span></div> :
                  coverUrl(n.cover) ?
                  <div className="nc-cover"><img src={coverUrl(n.cover)} alt={tx(n.title)} loading="lazy" /></div> :
                  <div className="nc-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={iconByType(normType(n))} /></svg></div>}
                    <div className="nc-body">
                      <div className="nc-meta"><span className={"nc-cat" + (isVideo(n) ? " nc-cat-video" : "")}>{isVideo(n) && <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4, verticalAlign: "-1px" }}><path d="M7 4v16l13-8z" /></svg>}{catLabel(n)}</span><span className="nc-date">{fmtDate(n.date)}</span></div>
                      <h3 className="nc-title">{tx(n.title)}</h3>
                      <p className="nc-text">{tx(n.excerpt) || tx(n.body)}</p>
                      {n.tags && n.tags.length > 0 &&
                    <div className="nc-tags">{n.tags.map((tid) => {const tg = TAGS.find((x) => x.id === tid);return <button key={tid} className="nc-tag" onClick={(e) => {e.stopPropagation();setTag(tid);}}>#{tg ? tl(tg) : tid}</button>;})}</div>}
                      <div className="nc-more">{isVideo(n) ? lv("Смотреть видео", "Videoni ko'rish", "Watch video") : lv("Читать публикацию", "Batafsil o'qish", "Read publication")} →</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <aside className="news-side">
              <SubscribeCard lv={lv} data-comment-anchor="ac7d5193a1-div-247-15" />
              {ALL.length > 1 &&
              <div className="acard" style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{lv("Читаемое", "Mashhur", "Popular")}</h4>
                {ALL.slice(0, 3).map((n, i) =>
                <div key={n.id || i} className="news-pop" onClick={() => {setCat(normType(n));setTag("all");}}>{tx(n.title)}</div>
                )}
              </div>
              }
            </aside>
          </div>
        </div>
      </section>
      <XBand t={t} go={go} />
      {open &&
      <div className="pub-ov" onClick={() => setOpen(null)}>
        <div className="pub-modal" onClick={(e) => e.stopPropagation()}>
          <button className="pub-close" onClick={() => setOpen(null)} aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          {isVideo(open) && ytId(open.youtube) ?
          <div className="pub-video">
                {playing ?
            <iframe src={`https://www.youtube-nocookie.com/embed/${ytId(open.youtube)}?rel=0&autoplay=1`} title={tx(open.title)} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> :
            <button className="pub-video-facade" onClick={() => setPlaying(true)} aria-label="Play video">
                      <img src={videoThumb(open) || `https://i.ytimg.com/vi/${ytId(open.youtube)}/maxresdefault.jpg`} alt={tx(open.title)} onError={(e) => {e.currentTarget.src = `https://i.ytimg.com/vi/${ytId(open.youtube)}/hqdefault.jpg`;}} />
                      <span className="pub-video-play"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg></span>
                    </button>}
              </div> :
          coverUrl(open.cover) && <div className="pub-cover"><img src={coverUrl(open.cover)} alt={tx(open.title)} /></div>}
          <div className="pub-body">
            <div className="nc-meta"><span className={"nc-cat" + (isVideo(open) ? " nc-cat-video" : "")}>{isVideo(open) && <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4, verticalAlign: "-1px" }}><path d="M7 4v16l13-8z" /></svg>}{catLabel(open)}</span><span className="nc-date">{fmtDate(open.date)}</span></div>
            <h1 className="pub-title">{tx(open.title)}</h1>
            {tx(open.excerpt) && <p className="pub-lead">{tx(open.excerpt)}</p>}
            {tx(open.body) && <div className="pub-p pub-body-html" dangerouslySetInnerHTML={{ __html: cleanArticleHtml(tx(open.body)) }} />}
            {!tx(open.body) && !tx(open.excerpt) && <p className="pub-p" style={{ color: "var(--slate-500)" }}>{lv("Текст публикации скоро появится.", "Matn tez orada qo'shiladi.", "Full text coming soon.")}</p>}
            {open.tags && open.tags.length > 0 &&
            <div className="nc-tags" style={{ marginTop: 18 }}>{open.tags.map((tid) => {const tg = TAGS.find((x) => x.id === tid);return <button key={tid} className="nc-tag" onClick={() => {setTag(tid);setOpen(null);}}>#{tg ? tl(tg) : tid}</button>;})}</div>}

            {isVideo(open) && (() => {
              const relP = (open.relProducts || []).map((id) => ({ id, name: prodName(id) })).filter((x) => x.name);
              const relC = (open.relCats || []).map((id) => ({ id, name: catName(id) })).filter((x) => x.name);
              if (!relP.length && !relC.length) return null;
              return (
                <div className="pub-related">
                  <div className="pub-related-h">{lv("Оборудование из видео", "Videodagi uskunalar", "Equipment from the video")}</div>
                  <div className="pub-related-chips">
                    {relP.map((x) => <a key={"p" + x.id} className="pub-rel-chip" onClick={() => {setOpen(null);go("catalog");}}>{x.name}</a>)}
                    {relC.map((x) => <a key={"c" + x.id} className="pub-rel-chip pub-rel-cat" onClick={() => {setOpen(null);go("catalog");}}>{x.name}</a>)}
                  </div>
                </div>);

            })()}

            {isVideo(open) && (open.cta?.kp !== false || open.cta?.consult !== false || open.cta?.catalog !== false) &&
            <div className="pub-cta">
              {open.cta?.kp !== false && <button className="btn btn-pri" onClick={() => {setOpen(null);go("contacts");}} style={{ backgroundColor: "rgb(14, 74, 198)" }}>{lv("Запросить КП", "Tijoriy taklif so'rash", "Request a quote")}</button>}
              {open.cta?.consult !== false && <button className="btn btn-ghost" onClick={() => {setOpen(null);go("contacts");}}>{lv("Получить консультацию", "Konsultatsiya olish", "Get a consultation")}</button>}
              {open.cta?.catalog !== false && <a className="btn btn-ghost" onClick={() => {setOpen(null);go("catalog");}} style={{ cursor: "pointer" }}>{lv("Перейти в каталог", "Katalogga o'tish", "Go to catalog")} →</a>}
            </div>}
          </div>
        </div>
      </div>}
    </div>);

}

Object.assign(window, { CoTendersPage, CoNewsPage });