/* ИНДУСТРИЯ ЗДОРОВЬЯ — Reviews / Testimonials public page */

/* ── PDF → изображение первой страницы (pdf.js c CDN, общий с «Документами») ── */
function rvpEnsurePdfJs() {
  if (window.pdfjsLib) return Promise.resolve();
  if (window.__pdfjsLoadP) return window.__pdfjsLoadP;
  window.__pdfjsLoadP = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    s.onerror = () => { window.__pdfjsLoadP = null; reject(new Error("pdf.js load failed")); };
    document.head.appendChild(s);
  });
  return window.__pdfjsLoadP;
}

/* Очередь с ограничением параллелизма: пока на странице документов не видно
   миниатюр, каждая грузила и рендерила свой PDF одновременно — при десятке
   документов это забивало сеть и основной поток и страница «тормозила» при
   открытии. Не больше RVP_MAX_CONCURRENT рендеров одновременно, остальные ждут
   очереди. */
const RVP_MAX_CONCURRENT = 3;
let rvpActive = 0;
const rvpQueue = [];
function rvpDrainQueue() {
  while (rvpActive < RVP_MAX_CONCURRENT && rvpQueue.length) {
    const { fn, resolve, reject } = rvpQueue.shift();
    rvpActive++;
    fn().then(
      (v) => { rvpActive--; resolve(v); rvpDrainQueue(); },
      (e) => { rvpActive--; reject(e); rvpDrainQueue(); }
    );
  }
}
function rvpSchedule(fn) {
  return new Promise((resolve, reject) => { rvpQueue.push({ fn, resolve, reject }); rvpDrainQueue(); });
}

/* Документ, загруженный один раз (Promise<pdf>), переиспользуется для рендера
   любой его страницы — иначе переключение страниц в просмотрщике заново
   скачивало бы весь файл. */
const RVP_DOC_CACHE = (window.__rvpDocCache = window.__rvpDocCache || {});
function rvpGetPdfDoc(url) {
  if (RVP_DOC_CACHE[url]) return RVP_DOC_CACHE[url];
  RVP_DOC_CACHE[url] = rvpEnsurePdfJs().then(() => window.pdfjsLib.getDocument(url).promise);
  RVP_DOC_CACHE[url].catch(() => { delete RVP_DOC_CACHE[url]; });
  return RVP_DOC_CACHE[url];
}

/* Кэш: url@width@page → Promise<{src, numPages}>. Карточка (малая ширина) и
   модалка (большая) кэшируются отдельно, страницы одного документа — тоже. */
const RVP_PAGE_CACHE = (window.__rvpPageCache = window.__rvpPageCache || {});
function rvpRenderPdfPage(url, width, page) {
  page = page || 1;
  const key = url + "@" + width + "@" + page;
  if (RVP_PAGE_CACHE[key]) return RVP_PAGE_CACHE[key];
  RVP_PAGE_CACHE[key] = rvpGetPdfDoc(url)
    .then((pdf) => pdf.getPage(page).then((p) => ({ pdf, p })))
    .then(({ pdf, p }) => rvpSchedule(() => {
      const base = p.getViewport({ scale: 1 });
      const vp = p.getViewport({ scale: width / base.width });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      return p.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise
        .then(() => ({ src: canvas.toDataURL("image/jpeg", 0.88), numPages: pdf.numPages }));
    }));
  RVP_PAGE_CACHE[key].catch(() => { delete RVP_PAGE_CACHE[key]; });
  return RVP_PAGE_CACHE[key];
}

/* Хук: src (dataURL) | numPages | loading | error для страницы PDF */
function useRvpPdfPage(url, width, enabled, page) {
  page = page || 1;
  const [state, setState] = React.useState({ src: null, err: false, numPages: null });
  React.useEffect(() => {
    let on = true;
    setState((s) => ({ src: null, err: false, numPages: s.numPages }));
    if (!enabled || !url) { if (!url && enabled) setState({ src: null, err: true, numPages: null }); return; }
    rvpRenderPdfPage(url, width, page)
      .then((d) => on && setState({ src: d.src, err: false, numPages: d.numPages }))
      .catch(() => on && setState({ src: null, err: true, numPages: null }));
    return () => { on = false; };
  }, [url, width, enabled, page]);
  return state;
}

/* CSS просмотрщика — инжектится один раз, живёт независимо от ReviewsPage,
   чтобы SheetViewer можно было открывать и с главной страницы. */
function rvpEnsureViewerCss() {
  if (document.getElementById("rvp-viewer-css")) return;
  const s = document.createElement("style");
  s.id = "rvp-viewer-css";
  s.textContent = `
.rvp-overlay{position:fixed;inset:0;background:rgba(8,14,24,.8);z-index:9100;display:flex;align-items:center;justify-content:center;padding:28px;animation:rvpFadeIn .18s ease}
@keyframes rvpFadeIn{from{opacity:0}to{opacity:1}}
.rvp-sheet-img{max-height:90vh;max-width:min(92vw,720px);border-radius:var(--r-sm);box-shadow:var(--sh-xl);display:block;background:#fff;animation:rvpSlideUp .22s cubic-bezier(.16,1,.3,1)}
@keyframes rvpSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.rvp-sheet-fallback{width:min(92vw,600px);aspect-ratio:210/297;max-height:90vh;background:#fff;border-radius:var(--r-sm);box-shadow:var(--sh-xl);padding:clamp(24px,6vw,56px);box-sizing:border-box;overflow:auto;animation:rvpSlideUp .22s cubic-bezier(.16,1,.3,1)}
.rvp-sheet-fallback h3{font-size:var(--fs-6);font-weight:800;color:var(--navy-900);margin:0 0 16px}
.rvp-sheet-fallback p{font-size:var(--fs-4);line-height:1.7;color:var(--slate-600);margin:0 0 12px}
.rvp-sheet-spin{width:44px;height:44px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:rvpSpin .8s linear infinite}
@keyframes rvpSpin{to{transform:rotate(360deg)}}
.rvp-x{position:fixed;top:22px;right:26px;width:42px;height:42px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .18s;z-index:9110}
.rvp-x:hover{background:rgba(255,255,255,.28)}
.rvp-x:focus-visible{outline:2px solid #fff;outline-offset:2px}
.rvp-pager{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.14);border-radius:40px;padding:8px 10px;z-index:9110;backdrop-filter:blur(6px)}
.rvp-pager button{width:36px;height:36px;border-radius:50%;border:none;background:rgba(255,255,255,.16);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .18s}
.rvp-pager button:hover:not(:disabled){background:rgba(255,255,255,.32)}
.rvp-pager button:disabled{opacity:.35;cursor:default}
.rvp-pager button:focus-visible{outline:2px solid #fff;outline-offset:2px}
.rvp-pager span{color:#fff;font-size:var(--fs-3);font-weight:600;min-width:52px;text-align:center;font-variant-numeric:tabular-nums}
@media(prefers-reduced-motion:reduce){.rvp-overlay,.rvp-sheet-img,.rvp-sheet-fallback{animation:none}}
  `;
  document.head.appendChild(s);
}

function ReviewsPage({ t, lang, go }) {
  const lv  = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const tx  = (o) => !o ? "" : typeof o === "string" ? o : (o[lang] || o.ru || "");
  const { useState, useEffect, useMemo, useRef } = React;

  /* ── inject CSS ─────────────────────────────────────── */
  useEffect(() => {
    const ID = "rvp-css";
    if (document.getElementById(ID)) return;
    const s  = document.createElement("style");
    s.id     = ID;
    s.textContent = `
/* ── reviews page (rvp-*) ───────────────────────────── */
.rvp-controls{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:36px;flex-wrap:wrap}
.rvp-filter-tabs{display:flex;gap:8px;flex-wrap:wrap}
.rvp-ftab{padding:9px 22px;border-radius:40px;border:1.5px solid var(--line);background:var(--bg);color:var(--slate-600,var(--mute));font-size:var(--fs-3);font-weight:600;cursor:pointer;font-family:inherit;transition:background .18s,border-color .18s,color .18s;white-space:nowrap}
.rvp-ftab.on{background:var(--blue-600,var(--blue-600));border-color:var(--blue-600,var(--blue-600));color:#fff}
.rvp-ftab:hover:not(.on){border-color:var(--blue-400,var(--blue-400));color:var(--blue-600,var(--blue-600))}
.rvp-ftab:focus-visible{outline:2px solid var(--blue-600,var(--blue-600));outline-offset:2px}
.rvp-search-sort{display:flex;gap:10px;align-items:center}
.rvp-search{position:relative;flex:1;min-width:200px;max-width:340px}
.rvp-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--slate-400,var(--slate-300));pointer-events:none}
.rvp-search input{width:100%;padding:9px 14px 9px 38px;border:1.5px solid var(--line);border-radius:var(--r-sm);font-size:var(--fs-4);background:var(--bg);color:var(--ink,#020617);font-family:inherit;outline:none;transition:border-color .18s;box-sizing:border-box}
.rvp-search input:focus{border-color:var(--blue-400,var(--blue-400))}
.rvp-sort{padding:9px 14px;border:1.5px solid var(--line);border-radius:var(--r-sm);font-size:var(--fs-3);background:var(--bg);color:var(--ink,#020617);font-family:inherit;cursor:pointer;outline:none;transition:border-color .18s}
.rvp-sort:focus{border-color:var(--blue-400,var(--blue-400))}
.rvp-count{font-size:var(--fs-3);color:var(--slate-400,var(--slate-300));margin-bottom:24px}
.rvp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.rvp-card{background:var(--bg,#fff);border:1px solid var(--line);border-radius:var(--r-lg,16px);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .22s}
.rvp-card:hover{box-shadow:var(--sh-lg)}
.rvp-thumb-area{background:var(--bg-alt,var(--bg-2));padding:24px 0;display:flex;justify-content:center;position:relative;min-height:214px}
.rvp-thumb-area.clickable{cursor:pointer}
.rvp-thumb-area.clickable .rvp-doc-img,.rvp-thumb-area.clickable .rvp-doc-svg{transition:transform .22s,box-shadow .22s}
.rvp-thumb-area.clickable:hover .rvp-doc-img,.rvp-thumb-area.clickable:hover .rvp-doc-svg{transform:translateY(-3px);box-shadow:var(--sh-lg)}
.rvp-thumb-area.clickable:focus-visible{outline:2px solid var(--blue-600,var(--blue-600));outline-offset:-4px;border-radius:var(--r-sm)}
.rvp-doc-svg{width:126px;border-radius:var(--r-sm);box-shadow:var(--sh-lg);display:block}
.rvp-doc-img{width:126px;height:178px;object-fit:cover;object-position:top;background:#fff;border-radius:var(--r-sm);box-shadow:var(--sh-lg);display:block}
.rvp-file-badge{position:absolute;top:12px;right:16px;background:rgba(0,0,0,.45);color:#fff;font-size:var(--fs-1);font-weight:700;letter-spacing:.07em;padding:3px 7px;border-radius:var(--r-sm);pointer-events:none}
.rvp-card-body{padding:18px 22px 20px;flex:1;display:flex;flex-direction:column;gap:0}
.rvp-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.rvp-type-badge{font-size:var(--fs-1);font-weight:700;padding:3px 10px;border-radius:var(--r-sm);background:rgba(224,73,47,.1);color:#C03B25;border:1px solid rgba(224,73,47,.22)}
.rvp-type-badge.s{background:rgba(23,87,200,.1);color:var(--blue-600,var(--blue-600));border-color:rgba(23,87,200,.2)}
.rvp-org{font-size:var(--fs-5);font-weight:800;line-height:1.25;letter-spacing:-.015em;color:var(--ink,#020617);margin:0 0 8px}
.rvp-desc{font-size:var(--fs-3);line-height:1.62;color:var(--slate-600,var(--mute));margin:0 0 auto;padding-bottom:14px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;min-height:88px}
.rvp-foot{display:flex;align-items:center;gap:6px;margin-top:auto;padding-top:12px}
.rvp-region{display:inline-flex;align-items:center;gap:6px;font-size:var(--fs-2);font-weight:600;color:var(--slate-500,var(--slate-500));min-height:18px}
.rvp-region svg{flex-shrink:0;color:var(--slate-400,var(--slate-300))}
.rvp-empty{padding:72px 0;text-align:center;color:var(--slate-400,var(--slate-300))}
.rvp-empty svg{margin:0 auto 18px;display:block;opacity:.4}
.rvp-empty p{font-size:var(--fs-4);max-width:420px;margin:0 auto;line-height:1.6}
/* просмотрщик (rvp-overlay / rvp-sheet-*) — инжектится rvpEnsureViewerCss() */

/* dark mode */
[data-theme="dark"] .rvp-thumb-area{background:rgba(255,255,255,.04)}
[data-theme="dark"] .rvp-type-badge{background:rgba(224,73,47,.15);color:#f08070;border-color:rgba(224,73,47,.3)}
[data-theme="dark"] .rvp-type-badge.s{background:rgba(77,136,224,.15);color:#7ab0f0;border-color:rgba(77,136,224,.3)}
[data-theme="dark"] .rvp-doc-svg rect[fill="white"]{fill:#1a2535}
[data-theme="dark"] .rvp-doc-svg rect[fill="#E5E7EB"]{fill:#2d3f55}
[data-theme="dark"] .rvp-doc-svg rect[fill="#F3F4F6"]{fill:#1e2d42}

@media(max-width:900px){.rvp-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){
  .rvp-grid{grid-template-columns:1fr}
  .rvp-controls{flex-direction:column;align-items:stretch}
  .rvp-search-sort{flex-direction:column}
  .rvp-search{max-width:100%}
}
@media(prefers-reduced-motion:reduce){.rvp-card,.rvp-overlay,.rvp-sheet-img,.rvp-sheet-fallback{animation:none;transition:none}}
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(ID); if (el) el.remove(); };
  }, []);

  /* ── CMS ─────────────────────────────────────────────── */
  const [items, setItems] = useState(() =>
    (window.CMS ? window.CMS.list("reviews") : []).filter(r => (r.status || "published") === "published")
  );
  useEffect(() => {
    if (!window.CMS) return;
    const refresh = () => setItems(
      window.CMS.list("reviews").filter(r => (r.status || "published") === "published")
    );
    refresh();
    return window.CMS.on("reviews", refresh);
  }, []);

  /* ── normalize type: support both new `type` and legacy `group` fields ── */
  const rtype = (r) => {
    const v = r.type || r.group || "";
    if (v === "suppliers") return "supplier";
    if (v === "buyers")    return "buyer";
    return v;
  };

  /* ── filters ─────────────────────────────────────────── */
  const [filter, setFilter] = useState("all");
  const [q, setQ]           = useState("");
  const [sort, setSort]     = useState("date_desc");
  const [viewer, setViewer] = useState(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (filter !== "all") list = list.filter(r => rtype(r) === filter);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(r =>
        tx(r.company).toLowerCase().includes(ql) ||
        tx(r.region).toLowerCase().includes(ql)  ||
        tx(r.desc).toLowerCase().includes(ql)
      );
    }
    if (sort === "date_desc") list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    else if (sort === "date_asc") list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    else list.sort((a, b) => tx(a.company).localeCompare(tx(b.company)));
    return list;
  }, [items, filter, q, sort, lang]);

  /* (ESC / скролл-лок обрабатывает сам SheetViewer) */

  /* ── card thumb colors ───────────────────────────────── */
  const TYPE_COLOR = { buyer: "var(--danger)", supplier: "var(--blue-500)" };
  const docColor   = (r) => TYPE_COLOR[rtype(r)] || "var(--blue-500)";

  /* ── fallback-обложка документа (если PDF-превью не сформировалось) ── */
  const FallbackSheet = ({ c }) => (
    <svg viewBox="0 0 160 212" fill="none" xmlns="http://www.w3.org/2000/svg" className="rvp-doc-svg">
      <rect width="160" height="212" rx="6" fill="white"/>
      <rect width="160" height="38" rx="6" fill={c}/>
      <rect y="26" width="160" height="12" fill={c}/>
      <rect x="14" y="52" width="68" height="7" rx="3.5" fill="var(--line-soft)"/>
      <rect x="14" y="65" width="132" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="75" width="126" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="85" width="116" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="100" width="132" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="110" width="120" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="120" width="128" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="130" width="100" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="148" width="60" height="5" rx="2.5" fill="var(--bg-2)"/>
      <rect x="14" y="158" width="72" height="5" rx="2.5" fill="var(--bg-2)"/>
      <circle cx="36" cy="188" r="17" stroke={c} strokeWidth="1.5" opacity=".75"/>
      <circle cx="36" cy="188" r="10" fill={c} opacity=".15"/>
      <rect x="64" y="181" width="54" height="5" rx="2.5" fill="var(--line-soft)"/>
      <rect x="64" y="191" width="42" height="5" rx="2.5" fill="var(--line-soft)"/>
    </svg>
  );

  /* ── document thumbnail: реальная первая страница PDF | картинка | fallback ──
       Кликабельна только сама миниатюра (не вся карточка). ── */
  const DocThumb = ({ r, onOpen, "aria-label": ariaLabel }) => {
    const c     = docColor(r);
    const url   = r.letter?.data || "";
    const isImg = r.letter?.type?.startsWith("image/");
    const isPdf = !isImg && !!url; // считаем PDF всё, что не image (тип может быть пуст)
    const { src, err } = useRvpPdfPage(url, 280, isPdf);
    const img = isImg ? url : src;
    const openable = !!url && !!onOpen;
    return (
      <div className={"rvp-thumb-area" + (openable ? " clickable" : "")}
        {...(openable ? {
          role: "button", tabIndex: 0, onClick: onOpen,
          onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } },
          "aria-label": ariaLabel,
        } : {})}>
        {img && !err
          ? <img src={img} alt={tx(r.company)} className="rvp-doc-img" loading="lazy" />
          : <FallbackSheet c={c} />}
        {url && <div className="rvp-file-badge">{isPdf ? "PDF" : "IMG"}</div>}
      </div>
    );
  };

  /* ── render ──────────────────────────────────────────── */
  return (
    <div>
      <PageHero t={t} lang={lang} go={go}
        title={lv("Отзывы и рекомендации", "Sharhlar va tavsiyalar", "Reviews & Testimonials")}
        sub={lv(
          "Благодарственные письма от клиник, больниц и партнёров-производителей медицинского оборудования",
          "Klinikalar, kasalxonalar va tibbiy uskunalar ishlab chiqaruvchilarining minnatdorchilik xatlari",
          "Letters of appreciation from clinics, hospitals and medical equipment manufacturer partners"
        )} />

      <section className="section">
        <div className="wrap">

          {/* controls */}
          <div className="rvp-controls reveal">
            <div className="rvp-filter-tabs">
              {[
                ["all",      lv("Все",         "Barchasi",        "All")],
                ["buyer",    lv("Покупатели",   "Xaridorlar",      "Buyers")],
                ["supplier", lv("Поставщики",   "Ta'minotchilar",  "Suppliers")],
              ].map(([v, label]) => (
                <button key={v} className={"rvp-ftab" + (filter === v ? " on" : "")} onClick={() => setFilter(v)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="rvp-search-sort">
              <div className="rvp-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text" value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder={lv("Поиск по организации…", "Tashkilot nomi bo'yicha…", "Search by organization…")}
                />
              </div>
              <select className="rvp-sort" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="date_desc">{lv("Сначала новые",  "Yangilari avval",  "Newest first")}</option>
                <option value="date_asc"> {lv("Сначала старые", "Eskilari avval",   "Oldest first")}</option>
                <option value="alpha">    {lv("По алфавиту",    "Alifbo tartibida", "A – Z")}</option>
              </select>
            </div>
          </div>

          {/* count */}
          {filtered.length > 0 && (
            <div className="rvp-count reveal">
              {lv(`Найдено: ${filtered.length}`, `Topildi: ${filtered.length}`, `Found: ${filtered.length}`)}
            </div>
          )}

          {/* empty */}
          {filtered.length === 0 && (
            <div className="rvp-empty reveal">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>
              </svg>
              <p>{lv(
                items.length === 0
                  ? "Отзывы пока не добавлены. Они появятся после публикации в административной панели."
                  : "По вашему запросу ничего не найдено.",
                "Sharhlar hozircha yo'q.",
                "No reviews found yet."
              )}</p>
            </div>
          )}

          {/* grid */}
          {filtered.length > 0 && (
            <div className="rvp-grid">
              {filtered.map((r, i) => (
                <div className="rvp-card reveal" key={r.id} style={{ "--i": i % 3 }}>
                  <DocThumb r={r} onOpen={() => setViewer(r)}
                    aria-label={lv("Открыть письмо", "Xatni ochish", "Open letter") + ": " + tx(r.company)} />
                  <div className="rvp-card-body">
                    <div className="rvp-badges">
                      <span className={"rvp-type-badge" + (rtype(r) === "supplier" ? " s" : "")}>
                        {rtype(r) === "supplier"
                          ? lv("Поставщик",  "Ta'minotchi", "Supplier")
                          : lv("Покупатель", "Xaridor",     "Buyer")}
                      </span>
                    </div>
                    <h3 className="rvp-org">{tx(r.company) || lv("Организация", "Tashkilot", "Organization")}</h3>
                    {tx(r.desc) && <p className="rvp-desc">{tx(r.desc)}</p>}
                    <div className="rvp-foot">
                      <span className="rvp-region">
                        {tx(r.region) && (
                          <React.Fragment>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {tx(r.region)}
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── document viewer: лист A4 по центру на затемнённом фоне ── */}
      {viewer && <SheetViewer r={viewer} tx={tx} lv={lv} onClose={() => setViewer(null)} />}

      <XBand t={t} go={go} />
    </div>
  );
}

/* ── Просмотр письма: изображение первой страницы PDF (или фото) как лист A4
      по центру, затемнённый фон, без стандартного PDF-viewer и его тулбаров ── */
function SheetViewer({ r, tx, lv, onClose }) {
  rvpEnsureViewerCss();
  const url   = r.letter?.data || "";
  const isImg = r.letter?.type?.startsWith("image/");
  const isPdf = !isImg && !!url;
  const [page, setPage] = React.useState(1);
  React.useEffect(() => { setPage(1); }, [url]);
  const { src, err, numPages } = useRvpPdfPage(url, 1400, isPdf, page);
  const img = isImg ? url : src;
  const loading = isPdf && !src && !err;
  const canPrev = isPdf && page > 1;
  const canNext = isPdf && !!numPages && page < numPages;
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && canPrev) setPage((p) => p - 1);
      else if (e.key === "ArrowRight" && canNext) setPage((p) => p + 1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [canPrev, canNext]);
  return (
    <div className="rvp-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={tx(r.company)}>
      <button className="rvp-x" onClick={onClose} aria-label={lv("Закрыть", "Yopish", "Close")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      {loading && <div className="rvp-sheet-spin" aria-label="Loading" />}
      {!loading && img && !err &&
        <img src={img} alt={tx(r.company)} className="rvp-sheet-img" onClick={(e) => e.stopPropagation()} />}
      {!loading && (!img || err) && (
        <div className="rvp-sheet-fallback" onClick={(e) => e.stopPropagation()}>
          <h3>{tx(r.company)}</h3>
          {tx(r.desc) && <p>{tx(r.desc)}</p>}
          {tx(r.body) && <p>{tx(r.body)}</p>}
          {tx(r.region) && <p style={{ color: "var(--slate-500)", fontSize: 13 }}>{tx(r.region)}</p>}
        </div>
      )}
      {isPdf && numPages > 1 && (
        <div className="rvp-pager" onClick={(e) => e.stopPropagation()}>
          <button disabled={!canPrev} onClick={() => setPage((p) => p - 1)} aria-label={lv("Предыдущая страница", "Oldingi sahifa", "Previous page")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span>{page} / {numPages}</span>
          <button disabled={!canNext} onClick={() => setPage((p) => p + 1)} aria-label={lv("Следующая страница", "Keyingi sahifa", "Next page")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* Экспорт для повторного использования на главной (home-page.jsx) */
window.ReviewsPage = ReviewsPage;
window.rvpRenderPdfPage = rvpRenderPdfPage;
window.RvpSheetViewer = SheetViewer;
