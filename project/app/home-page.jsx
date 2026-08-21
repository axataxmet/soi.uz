/* ИНДУСТРИЯ ЗДОРОВЬЯ — home page */
const { useState, useEffect, useRef } = React;

// ---- CMS-backed homepage settings (Hero / Impact / CTA), edited in admin/homepage.jsx ----
function useHomeSetting(key, def) {
  const [val, setVal] = useState(() => window.CMS ? window.CMS.getSetting(key, def) : def);
  useEffect(() => {
    if (!window.CMS) return;
    setVal(window.CMS.getSetting(key, def));
    return window.CMS.on ? window.CMS.on("settings", () => setVal(window.CMS.getSetting(key, def))) : undefined;
  }, [key]);
  return val;
}
function trTx(obj, field, lang) {
  const v = obj && obj[field];
  if (typeof v === "string") return v; // pre-migration flat value: show as-is rather than blank
  return (v && (v[lang] || v.ru)) || "";
}

const HERO_DEFAULTS = {
  badge: { ru: "Технологический партнёр здравоохранения", uz: "Sog'liqni saqlash texnologik hamkori", en: "Technology partner for healthcare" },
  title1: { ru: "Поставщик и интегратор", uz: "Zamonaviy tibbiyotni", en: "An ecosystem for" },
  title2: { ru: "медицинского оборудования", uz: "jihozlash ekotizimi", en: "equipping modern medicine" },
  subtitle: {
    ru: "ИНДУСТРИЯ ЗДОРОВЬЯ объединяет поставку оборудования, регистрацию медизделий, тендерное сопровождение, сервис и цифровые инструменты — единый партнёр для клиник, бизнеса и государства.",
    uz: "SOG'LIQ INDUSTRIYASI uskunalar yetkazib berish, tibbiy buyumlarni ro'yxatga olish, tender ko'magi, servis va raqamli vositalarni birlashtiradi — klinikalar, biznes va davlat uchun yagona hamkor.",
    en: "HEALTH INDUSTRY unites equipment supply, medical-device registration, tender support, service and digital tools — a single partner for clinics, business and government.",
  },
  ctaPrimary: { ru: "О компании", uz: "Kompaniya haqida", en: "About us" },
  ctaSecondary: { ru: "Электронный каталог", uz: "Elektron katalog", en: "E-catalog" },
  trust1: { ru: "5+ лет опыта", uz: "5+ yil tajriba", en: "5+ years" },
  trust2: { ru: "120+ мировых брендов", uz: "120+ jahon brendi", en: "120+ global brands" },
  trust3: { ru: "14 регионов Узбекистана", uz: "O'zbekistonning 14 hududi", en: "14 regions" },
};

/* ── Единый источник цифр сайта ───────────────────────────────────────────
   Одни и те же шесть чисел раньше лежали в четырёх местах: плитки
   «Экосистемы», блок «Инфраструктура», витрина каталога и страница «О
   компании». Они разъезжались при любой правке — например, лет на рынке
   считалось от года основания в localStorage только на одной странице.
   Теперь значение одно, и его переопределяет настройка site_figures из
   админки. Годы на рынке считаются от года основания, а не хранятся числом,
   иначе их пришлось бы править каждый январь. */
const SITE_FIGURES_DEFAULTS = {
  founded: 2021,          // лет на рынке считается отсюда
  catalog: "2 800",       // позиций в каталоге
  brands: "120",          // мировых брендов
  trained: "1000",        // обученных специалистов
  service: "50",          // успешно выполненных сервисных работ
  regions: "14",          // регионов доставки
};
function siteFigures() {
  const cms = (window.CMS && window.CMS.getSetting) ? window.CMS.getSetting("site_figures", null) : null;
  const f = Object.assign({}, SITE_FIGURES_DEFAULTS, cms || {});
  f.years = String(Math.max(1, new Date().getFullYear() - parseInt(f.founded, 10)));
  return f;
}
window.siteFigures = siteFigures;
window.SITE_FIGURES_DEFAULTS = SITE_FIGURES_DEFAULTS;

/* Значения блока «Масштаб платформы». Сам блок с главной снят 09.08.2026, и
   на сайте эти данные больше не читаются — оставлены потому, что раздел для
   них остался в админке (project/admin/homepage.jsx, настройка
   homepage_impact), а её трогать нельзя по отдельному решению заказчика.

   Если блок не вернут, снимать надо парой: сначала раздел в админке, потом
   эти значения. Удалить только здесь — оставить в админке форму, которая
   сохраняет настройку в никуда. */
const IMPACT_DEFAULTS = {
  eyebrow: { ru: "Масштаб платформы", uz: "Platforma miqyosi", en: "Platform scale" },
  title: {
    ru: "Инфраструктура, которой доверяют клиники и государственные учреждения",
    uz: "Klinikalar va davlat muassasalari ishonadigan infratuzilma",
    en: "Infrastructure trusted by clinics and public institutions",
  },
  stat1_val: SITE_FIGURES_DEFAULTS.catalog, stat1_unit: "+", stat1_label: { ru: "позиций в каталоге", uz: "katalog pozitsiyasi", en: "items in catalog" },
  stat2_val: SITE_FIGURES_DEFAULTS.brands,  stat2_unit: "+", stat2_label: { ru: "мировых брендов", uz: "jahon brendi", en: "global brands" },
  stat3_val: SITE_FIGURES_DEFAULTS.regions, stat3_unit: "",  stat3_label: { ru: "регионов доставки", uz: "yetkazish hududi", en: "delivery regions" },
  stat4_val: String(new Date().getFullYear() - SITE_FIGURES_DEFAULTS.founded), stat4_unit: "+", stat4_label: { ru: "лет на рынке Узбекистана", uz: "O'zbekiston bozorida yil", en: "years in Uzbekistan" },
};

const CTA_DEFAULTS = {
  title: { ru: "Готовы оснастить вашу клинику?", uz: "Klinikangizni jihozlashga tayyormisiz?", en: "Ready to equip your clinic?" },
  subtitle: {
    ru: "Расскажите о задаче — подберём оборудование, подготовим КП и сопроводим до запуска.",
    uz: "Vazifani ayting — uskunani tanlaymiz, taklif tayyorlaymiz va ishga tushirishgacha hamroh bo'lamiz.",
    en: "Tell us your task — we'll select equipment, prepare a quote and support you to launch.",
  },
  btn1: { ru: "Получить консультацию", uz: "Maslahat olish", en: "Get a consultation" },
  btn2: { ru: "Перейти в каталог", uz: "Katalogga o'tish", en: "Browse catalog" },
};

// ---- CMS-backed site contacts (edited in admin/misc.jsx → "Контакты" tab) ----
const SITE_CONTACTS_DEFAULTS = {
  phone: "+998 (77) 225-00-01",
  phone2: "+998 (77) 224-00-01",
  email: "info@soi.uz",
  address: "100069, Ташкент, Узбекистан, ул. МКАД, д. 16",
  mapUrl: "https://maps.google.com/?q=100069,+Ташкент,+ул.+МКАД,+16",
  telegram: "https://t.me/soi",
  instagram: "https://instagram.com/soi",
  facebook: "https://facebook.com/soi",
  youtube: "https://youtube.com/@soi",
};
function useSiteContacts() {
  const [contacts, setContacts] = useState(() => window.CMS ? window.CMS.getSetting("site_contacts", SITE_CONTACTS_DEFAULTS) : SITE_CONTACTS_DEFAULTS);
  useEffect(() => {
    if (!window.CMS) return;
    setContacts(window.CMS.getSetting("site_contacts", SITE_CONTACTS_DEFAULTS));
    return window.CMS.on ? window.CMS.on("settings", () => setContacts(window.CMS.getSetting("site_contacts", SITE_CONTACTS_DEFAULTS))) : undefined;
  }, []);
  // pre-migration values may still be missing the social fields — fall back per-field, not just per-object
  return { ...SITE_CONTACTS_DEFAULTS, ...contacts };
}
function telHref(phone) { return "tel:+" + String(phone || "").replace(/[^0-9]/g, ""); }

// ---- IndexedDB video helpers ----
const _VDB = "uzmedex_vdb",_VST = "vblobs",_VK = "hero";
function _openVDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(_VDB, 1);
    r.onupgradeneeded = () => {try {r.result.createObjectStore(_VST);} catch (e) {}};
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function _saveVid(blob) {
  try {
    const db = await _openVDB();
    return new Promise((res, rej) => {const tx = db.transaction(_VST, "readwrite");tx.objectStore(_VST).put(blob, _VK);tx.oncomplete = res;tx.onerror = rej;});
  } catch (e) {console.warn("video save:", e);}
}
async function _loadVid() {
  try {
    const db = await _openVDB();
    return new Promise((res) => {
      const r = db.transaction(_VST).objectStore(_VST).get(_VK);
      r.onsuccess = () => res(r.result ? URL.createObjectURL(r.result) : null);
      r.onerror = () => res(null);
    });
  } catch (e) {return null;}
}

// ---- HeroVideoSlot ----
function HeroVideoSlot({ t, lang }) {
  const [src, setSrc] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [drag, setDrag] = useState(false);
  const [ready, setReady] = useState(false);
  const vidRef = useRef(null);
  const blobUrl = useRef(null);

  useEffect(() => {
    _loadVid().then((url) => {if (url) {setSrc(url);blobUrl.current = url;}setReady(true);});
    return () => {if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);};
  }, []);

  const loadFile = async (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    const url = URL.createObjectURL(file);
    blobUrl.current = url;
    setSrc(url);
    setPlaying(true);
    _saveVid(file);
  };

  const onDrop = (e) => {e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0]);};
  const toggle = () => {
    if (!vidRef.current) return;
    if (vidRef.current.paused) {vidRef.current.play();setPlaying(true);} else
    {vidRef.current.pause();setPlaying(false);}
  };
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  return (
    <div
      className={"hero-video-slot" + (drag ? " drag" : "")}
      onDragOver={(e) => {e.preventDefault();setDrag(true);}}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}>
      
      {src ?
      <>
          <video ref={vidRef} src={src} autoPlay muted loop playsInline className="hero-vid"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          <div className="hvs-overlay" onClick={toggle}>
            {!playing && <div className="hvs-play-btn"><Icon name="play" size={30} /></div>}
          </div>
          <label className="hvs-change" title={lv("Сменить видео", "Videoni almashtirish", "Change video")}>
            <Icon name="upload" size={15} />
            <input type="file" accept="video/*" onChange={(e) => loadFile(e.target.files[0])} />
          </label>
        </> :
      ready ?<div className="hvs-fallback">
          {/* animated stat cards */}
          <div className="hvs-stats">
            {[
              {n:"2 800+", l:"наименований", ic:"grid", c:"var(--blue-600)"},
              {n:"120+",   l:"брендов",       ic:"award", c:"var(--accent)"},
              {n:"14",    l:"регионов",      ic:"pin",   c:"var(--danger)"},
              {n:(new Date().getFullYear() - parseInt(localStorage.getItem("soi_founded_year")||"2021",10))+"+",    l:"лет на рынке",  ic:"star",  c:"#7c5cbf"},
            ].map((s,i) => (
              <div key={i} className="hvs-stat-card" style={{animationDelay: i*0.1+"s"}}>
                <div className="hvs-stat-ic" style={{background:s.c+"18",color:s.c}}><Icon name={s.ic} size={20}/></div>
                <div className="hvs-stat-n">{s.n}</div>
                <div className="hvs-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
          {/* category tiles */}
          <div className="hvs-cats">
            {(window.DATA?.CATEGORIES||[]).slice(0,6).map((c,i) => (
              <div key={c.id} className="hvs-cat-pill" style={{animationDelay: 0.3+i*0.07+"s"}}>
                <Icon name={c.icon} size={15}/><span>{c.ru}</span>
              </div>
            ))}
          </div>
          {/* upload prompt */}
          <label className="hvs-upload-hint">
            <Icon name="video" size={15}/>
            <span>{lv("Загрузить видео компании","Kompaniya videosi","Upload company video")}</span>
            <input type="file" accept="video/*" style={{display:"none"}} onChange={(e)=>loadFile(e.target.files[0])}/>
          </label>
        </div> :
      <div className="hvs-empty" />}
      <div className="hero-float f1">
        <span className="hf-ic" style={{ background: "var(--success)" }}><Icon name="check" size={17} /></span>
        <div><div>{t.in_stock}</div><div className="hf-s">{lv("Склад в Ташкенте", "Toshkent ombori", "Tashkent warehouse")}</div></div>
      </div>
      <div className="hero-float f2">
        <span className="hf-ic" style={{ background: "var(--blue-600)" }}><Icon name="shield" size={17} /></span>
        <div><div>{t.g_warranty}</div><div className="hf-s">{t.g_cert}</div></div>
      </div>
    </div>);

}

// ---- Hero slider slides (mirrors CLAUDE HP / localhost:3000 hero carousel) ----
const HERO_SLIDES = [
  {
    id: "slide-equip",
    theme: "dark",
    video: "assets/hero-equip.mp4",
    bg: "linear-gradient(120deg, #050a14 0%, var(--navy-800) 55%, var(--blue-600) 100%)",
    badge: { ru: "ИНДУСТРИЯ ЗДОРОВЬЯ", uz: "SOGʻLIQ INDUSTRIYASI", en: "HEALTH INDUSTRY" },
    title: { ru: "Медицинские изделия и оснащение", uz: "Tibbiy buyumlar va jihozlash", en: "Medical devices and equipping" },
    subtitle: { ru: "Широкий ассортимент медицинских изделий от ведущих производителей. Помогаем выбрать, зарегистрировать, закупить, поставить, внедрить и обеспечить сервисное сопровождение.", uz: "Yetakchi ishlab chiqaruvchilardan tibbiy buyumlarning keng assortimenti. Tanlash, roʻyxatdan oʻtkazish, sotib olish, yetkazib berish, joriy etish va servis qoʻllab-quvvatlashda yordam beramiz.", en: "A wide range of medical devices from leading manufacturers. We help you select, register, procure, deliver, deploy and maintain them." },
    ctas: [
      { label: { ru: "Перейти в каталог", uz: "Katalogga o'tish", en: "Browse catalog" }, action: "catalog", style: "primary" },
      { label: { ru: "Связаться с нами", uz: "Bog'lanish", en: "Contact us" }, action: "contacts", style: "ghost" },
    ],
  },
  {
    id: "slide-registration",
    theme: "light",
    bg: "linear-gradient(135deg, #FFFFFF 0%, var(--blue-50) 55%, var(--line-soft) 100%)",
    badge: { ru: "Услуга", uz: "Xizmat", en: "Service" },
    title: { ru: "Регистрация медицинских изделий в Узбекистане", uz: "O'zbekistonda tibbiy buyumlarni ro'yxatdan o'tkazish", en: "Medical device registration in Uzbekistan" },
    subtitle: { ru: "Полное сопровождение: досье, экспертиза, взаимодействие с регулятором — под ключ.", uz: "To'liq hamrohlik: hujjatlar, ekspertiza, regulyator bilan ishlash — kalit topshirish sharti bilan.", en: "Full support: dossier, expertise, regulator liaison — turnkey." },
    ctas: [
      { label: { ru: "Подробнее об услуге", uz: "Xizmat haqida batafsil", en: "Learn more" }, action: "registration", style: "primary" },
    ],
  },
  {
    id: "slide-service",
    theme: "dark",
    bg: "linear-gradient(120deg, #040c18 0%, var(--blue-700) 70%, var(--blue-500) 100%)",
    badge: { ru: "Сервис", uz: "Servis", en: "Service" },
    title: { ru: "Сервис и обучение персонала", uz: "Servis va xodimlarni o'qitish", en: "Maintenance and staff training" },
    subtitle: { ru: "Пусконаладка, гарантийное и постгарантийное обслуживание, обучение работе с оборудованием.", uz: "Ishga tushirish, kafolatli va kafolatdan keyingi xizmat, uskunalar bilan ishlashga o'qitish.", en: "Commissioning, warranty and post-warranty service, equipment operation training." },
    ctas: [
      { label: { ru: "Сервисное обслуживание", uz: "Servis xizmati", en: "Maintenance" }, action: "services", style: "primary" },
      { label: { ru: "Обучение персонала", uz: "Xodimlarni o'qitish", en: "Staff training" }, action: "services", style: "ghost" },
    ],
  },
];

function Hero({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  const SLIDE_MS = 7000;
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const parallaxRef = useRef(null);
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // autoplay
  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setSlideIdx((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [slideIdx, paused, reduced]);

  // parallax: background layers drift slower than the text (NVIDIA-style)
  useEffect(() => {
    if (reduced) return;
    const el = parallaxRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, el.offsetHeight);
        el.querySelectorAll("[data-hero-bg]").forEach((bg) => {
          bg.style.transform = `translateY(${y * 0.35}px)`;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [reduced]);

  const slide = HERO_SLIDES[slideIdx];
  const sv = (obj) => obj[lang] || obj.ru || "";

  useEffect(() => {
    const id = "soi-chero-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
/* ── ИНДУСТРИЯ ЗДОРОВЬЯ Hero v4 — full-bleed slider (ported from CLAUDE HP) ── */
/* pull the hero up under the floating header so 100dvh fills exactly one screen */
.soi-chero { position:relative; overflow:hidden; margin-top:calc(-1 * var(--soi-head-h, 0px)); }
.soi-chero-stage { position:relative; min-height:100dvh; }

/* each slide is stacked and crossfaded */
.soi-chero-slide { position:absolute; inset:0; opacity:0; z-index:0;
  transition:opacity .9s cubic-bezier(.16,1,.3,1); }
.soi-chero-slide.on { opacity:1; z-index:1; }

/* background layer sits taller than the stage so parallax never bares the top */
.soi-chero-bg { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.soi-chero-bg-inner { position:absolute; left:0; right:0; top:-33%; bottom:0; will-change:transform; }
.soi-chero-vid { width:100%; height:100%; object-fit:cover; display:block; }
.soi-chero-fill { width:100%; height:100%; }

/* scrim: opaque under the text column, transparent to the right */
.soi-chero-scrim { position:absolute; inset:0; }
.soi-chero-slide.t-dark  .soi-chero-scrim { background:linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 38%, rgba(0,0,0,0) 68%); }
.soi-chero-slide.t-light .soi-chero-scrim { background:linear-gradient(90deg, rgba(255,255,255,.85) 0%, rgba(255,255,255,.55) 38%, rgba(255,255,255,0) 68%); }
@media (max-width:640px){
  .soi-chero-slide.t-dark  .soi-chero-scrim { background:rgba(0,0,0,.55); }
  .soi-chero-slide.t-light .soi-chero-scrim { background:rgba(255,255,255,.72); }
}

/* text column, left-aligned like NVIDIA */
.soi-chero-wrap { position:relative; z-index:1; min-height:100dvh; max-width:var(--maxw); margin:0 auto;
  padding:0 24px; display:flex; align-items:center; }
.soi-chero-col { max-width:640px; padding:112px 0 96px; }
.soi-chero-slide.t-dark  .soi-chero-col { color:#fff; }
.soi-chero-slide.t-light .soi-chero-col { color:var(--blue-600); }

.soi-chero-badge { font-size:var(--fs-4); font-weight:700; text-transform:uppercase; letter-spacing:.08em; margin:0 0 12px; }
.soi-chero-slide.t-dark  .soi-chero-badge { color:#A8C4F6; }
.soi-chero-slide.t-light .soi-chero-badge { color:var(--blue-600); }

.soi-chero-h1 { font-size:clamp(30px,5vw,54px); font-weight:800; line-height:1.1; letter-spacing:-.03em; margin:0; }
.soi-chero-sub { font-size:clamp(16px,1.6vw,20px); line-height:1.6; margin:16px 0 0; }
.soi-chero-slide.t-dark  .soi-chero-sub { color:rgba(255,255,255,.9); }
.soi-chero-slide.t-light .soi-chero-sub { color:#374151; }

/* pill CTAs — сплошной фирменный синий с белой подписью (лайм снят) */
.soi-chero-cta { display:flex; flex-wrap:wrap; gap:12px; margin-top:32px; }
.soi-chero-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px;
  padding:14px 26px; border-radius:var(--r-pill); font-family:inherit; font-size:var(--fs-5); font-weight:700;
  cursor:pointer; border:1px solid transparent; transition:background .2s, color .2s, border-color .2s, transform .18s; }
.soi-chero-btn:hover { transform:translateY(-2px); }
.soi-chero-btn.primary { background:var(--blue-600); color:#fff; }
.soi-chero-btn.primary:hover { background:var(--blue-700); }
.soi-chero-btn .arr { display:inline-flex; transition:transform .2s; }
.soi-chero-btn.primary:hover .arr { transform:translateX(4px); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost { background:transparent; color:#fff; border-color:rgba(255,255,255,.6); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost:hover { border-color:#fff; color:#fff; background:rgba(255,255,255,.12); }
.soi-chero-slide.t-light .soi-chero-btn.ghost { background:transparent; color:var(--navy-900); border-color:rgba(17,24,39,.4); }
.soi-chero-slide.t-light .soi-chero-btn.ghost:hover { border-color:var(--blue-600); color:var(--blue-600); }
.soi-chero-btn:focus-visible { outline:2px solid var(--blue-500); outline-offset:3px; }

/* staggered reveal, replayed per slide */
.soi-chero-anim { opacity:0; transform:translateY(16px);
  transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.soi-chero-slide.on .soi-chero-anim { opacity:1; transform:none; }

/* segmented progress bars with timer fill */
.soi-chero-bars { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); z-index:20;
  display:flex; gap:12px; width:100%; max-width:var(--maxw); padding:0 32px; }
/* Индикатор слайдера — самая мелкая цель на странице: полоска 16px по высоте,
   попасть пальцем почти нельзя. Сама полоска остаётся тонкой (она показывает
   время до переключения), а зона нажатия расширена псевдоэлементом до 44px. */
.soi-chero-bar::after { content:""; position:absolute; left:0; right:0; top:50%;
  transform:translateY(-50%); height:44px; }
.soi-chero-bar { position:relative; height:16px; width:96px; max-width:20%; padding:0;
  background:none; border:none; cursor:pointer; }
.soi-chero-bar-track { position:absolute; left:0; top:50%; transform:translateY(-50%);
  height:3px; width:100%; border-radius:var(--r-pill); overflow:hidden; transition:background .2s; }
.soi-chero-stage.t-dark  .soi-chero-bar-track { background:rgba(255,255,255,.25); }
.soi-chero-stage.t-light .soi-chero-bar-track { background:rgba(17,24,39,.2); }
.soi-chero-bar:hover .soi-chero-bar-track { background:rgba(255,255,255,.55); }
.soi-chero-stage.t-light .soi-chero-bar:hover .soi-chero-bar-track { background:rgba(14,74,198,.45); }
.soi-chero-bar:focus-visible .soi-chero-bar-track { outline:2px solid var(--blue-500); outline-offset:2px; }
.soi-chero-bar-fill { position:absolute; inset:0 auto 0 0; display:block; background:#fff;
  animation:soiCheroBar linear forwards; }
.soi-chero-stage.t-light .soi-chero-bar-fill { background:var(--blue-600); }
@keyframes soiCheroBar { from{width:0;} to{width:100%;} }

@media (max-width:520px){
  .soi-chero-btn { width:100%; }
}
@media (prefers-reduced-motion: reduce){
  .soi-chero-slide { transition:none; }
  .soi-chero-anim { opacity:1; transform:none; transition:none; }
  .soi-chero-bar-fill { animation:none; width:100%; }
}
}
    `;
    document.head.appendChild(s);
  }, []);

  const Svg = ({ children, s = 20 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );

  const stageTheme = slide.theme === "dark" ? " t-dark" : " t-light";

  return (
    <section
      className="soi-chero"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setSlideIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        if (e.key === "ArrowRight") setSlideIdx((i) => (i + 1) % HERO_SLIDES.length);
      }}
    >
      <div className={"soi-chero-stage" + stageTheme} ref={parallaxRef}>
        {HERO_SLIDES.map((s, i) => {
          const on = i === slideIdx;
          return (
            <article
              key={s.id}
              className={"soi-chero-slide " + (s.theme === "dark" ? "t-dark" : "t-light") + (on ? " on" : "")}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${HERO_SLIDES.length}`}
              aria-hidden={!on}
            >
              <div className="soi-chero-bg">
                <div className="soi-chero-bg-inner" data-hero-bg>
                  {s.video ? (
                    <video
                      className="soi-chero-vid"
                      src={window.__asset(s.video)}
                      autoPlay muted loop playsInline
                      preload={i === 0 ? "auto" : "none"}
                    />
                  ) : (
                    <div className="soi-chero-fill" style={{ background: s.bg }} />
                  )}
                </div>
                <div className="soi-chero-scrim" />
              </div>

              <div className="soi-chero-wrap">
                <div className="soi-chero-col">
                  <p className="soi-chero-badge soi-chero-anim" style={{ transitionDelay: on ? "150ms" : "0ms" }}>
                    {sv(s.badge)}
                  </p>
                  <h1 className="soi-chero-h1 soi-chero-anim" style={{ transitionDelay: on ? "300ms" : "0ms" }}>
                    {sv(s.title)}
                  </h1>
                  <p className="soi-chero-sub soi-chero-anim" style={{ transitionDelay: on ? "420ms" : "0ms" }}>
                    {sv(s.subtitle)}
                  </p>
                  <div className="soi-chero-cta soi-chero-anim" style={{ transitionDelay: on ? "650ms" : "0ms" }}>
                    {s.ctas.map((cta, ci) => (
                      <button
                        key={ci}
                        className={"soi-chero-btn " + cta.style}
                        onClick={() => go(cta.action)}
                        tabIndex={on ? 0 : -1}
                      >
                        {sv(cta.label)}
                        {cta.style === "primary" && (
                          <span className="arr"><Svg s={18}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="soi-chero-bars" role="tablist" aria-label={lv("Перейти к слайду", "Slaydga o'tish", "Go to slide")}>
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === slideIdx}
              aria-label={`${lv("Слайд", "Slayd", "Slide")} ${i + 1}`}
              className="soi-chero-bar"
              onClick={() => setSlideIdx(i)}
            >
              <span className="soi-chero-bar-track">
                {i === slideIdx && (
                  <span
                    key={slideIdx}
                    className="soi-chero-bar-fill"
                    style={{
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroSignals({ lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const sigs = [
    { ic: "grid",  cls: "s1", bg: "var(--blue-50)", c: "var(--blue-600)",
      t: lv("2 800+ позиций", "2 800+ pozitsiya", "2,800+ items"),
      d: lv("в наличии и под заказ", "mavjud va buyurtmaga", "in stock & to order"),
      act: () => go("catalog", {}) },
    { ic: "check", cls: "s2", bg: "var(--line-2)", c: "var(--accent)",
      t: lv("120+ брендов", "120+ brend", "120+ brands"),
      d: lv("официальные поставки", "rasmiy yetkazib berish", "official supply"),
      act: () => go("brands", {}) },
    { ic: "truck", cls: "s3", bg: "var(--bg-2)", c: "var(--blue-600)",
      t: lv("Доставка в 14 регионов", "14 hududga yetkazish", "Delivery to 14 regions"),
      d: lv("монтаж и пусконаладка", "montaj va ishga tushirish", "installation & setup"),
      act: () => go("info", { p: "shipping" }) },
    { ic: "doc",   cls: "s4", bg: "var(--blue-50)", c: "var(--accent)",
      t: lv("Тендеры и госзакупки", "Tender va davlat xaridlari", "Tenders & procurement"),
      d: lv("полный пакет документов", "to'liq hujjatlar to'plami", "full document package"),
      act: () => go("info", { p: "gov" }) },
  ];
  return (
    <div className="hero-signals">
      {sigs.map((s, i) => (
        <button key={i} className={"hsig " + s.cls} style={{ "--d": (i * 0.12 + 0.15) + "s" }} onClick={s.act}>
          <span className="hsig-ic" style={{ background: s.bg, color: s.c }}><Icon name={s.ic} size={22} /></span>
          <span className="hsig-tx">
            <span className="hsig-t">{s.t}</span>
            <span className="hsig-d">{s.d}</span>
          </span>
        </button>
      ))}
    </div>);
}

function CategoryGrid({ t, lang, go }) {
  const DD = window.DIRECTIONS_DATA;
  if (!DD) return null;
  const { DIRECTION_GROUPS, getDirsForGroup, getProductsForDir } = DD;
  const P = window.DATA.PRODUCTS;
  const lv = (ru, uz, en) => lang==="uz" ? uz : lang==="en" ? en : ru;
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2>{t.sec_directions}</h2>
            <div className="sub">{lv(
              "Подберите медицинское оборудование по профилю учреждения, отделению или направлению работы",
              "Muassasa yoki boʻlinma profili boʻyicha tibbiy uskunani tanlang",
              "Find equipment by institution profile, department or clinical specialty"
            )}</div>
          </div>
        </div>
        <div className="dir-groups-grid">
          {DIRECTION_GROUPS.map((g) => {
            const dirs = getDirsForGroup(g.id);
            const prodIds = new Set(dirs.flatMap(d => getProductsForDir(d.id, P).map(p => p.id)));
            return (
              <div key={g.id} className="dir-group-tile">
                <div className="dgt-head" style={{ borderLeftColor: g.color }}
                  onClick={() => go("catalog", { dir: dirs[0]?.id })}>
                  <div className="dgt-ic" style={{ background: g.color + "18", color: g.color }}>
                    <Icon name={g.icon} size={26} />
                  </div>
                  <div className="dgt-title-wrap">
                    <h3 className="dgt-title">{lv(g.ru, g.uz, g.en)}</h3>
                    {prodIds.size > 0 && <span className="dgt-count">{prodIds.size} {t.items_count}</span>}
                  </div>
                </div>
                <div className="dgt-dirs">
                  {dirs.map(d => (
                    <a key={d.id} className="dgt-dir"
                      onClick={e => { e.stopPropagation(); go("catalog", { dir: d.id }); }}>
                      {lv(d.ru, d.uz, d.en)}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedRow({ t, lang, store, go, title, sub, items, link }) {
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2>{title}</h2>
            <div className="sub">{sub}</div>
          </div>
          <a className="sec-link" onClick={link}>{t.view_all}<Icon name="arrowRight" size={17} /></a>
        </div>
        <div className="grid-4">
          {items.map((p) =>
          <ProductCard key={p.id} product={p} t={t} lang={lang} store={store} onOpen={(pr) => go("product", { id: pr.id })} />
          )}
        </div>
      </div>
    </section>);

}

function TrustBand({ t }) {
  const items = [
  { ic: "truck", k: "trust_1" },
  { ic: "award", k: "trust_2" },
  { ic: "wrench", k: "trust_3" },
  { ic: "pin", k: "trust_4" }];

  return (
    <section className="trust">
      <div className="wrap">
        <div className="trust-grid">
          {items.map((it) =>
          <div key={it.k} className="trust-it">
              <div className="ti-ic"><Icon name={it.ic} size={24} /></div>
              <h4>{t[it.k + "_t"]}</h4>
              <p>{t[it.k + "_d"]}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function BrandStrip({ t, lang, go }) {
  const brands = window.DATA.BRANDS;
  const flagByCountry = (ru) => ({
    "Китай": "🇨🇳", "Германия": "🇩🇪", "Индия": "🇮🇳", "Израиль": "🇮🇱", "Россия": "🇷🇺",
    "Чехия": "🇨🇿", "США": "🇺🇸", "Швейцария": "🇨🇭", "Италия": "🇮🇹", "Япония": "🇯🇵", "Корея": "🇰🇷",
  }[ru] || "🌐");
  const mono = (name) => name.replace(/[^A-Za-zА-Яа-я0-9]/g, "").slice(0, 2).toUpperCase();
  const Card = ({ b }) => (
    <button className="brand-card" title={b.name} onClick={() => go("brand", { id: b.id })}>
      <span className="bc-logo">{mono(b.name)}</span>
      <span className="bc-info">
        <span className="bc-name">{b.name}</span>
        <span className="bc-cat">{flagByCountry(b.country_ru)} {tri(lang, b.country_ru, b.country_uz, b.country_en)}</span>
      </span>
    </button>
  );
  return (
    <section className="section">
      <div className="wrap">
        <div className="brand-head">
          <h2 className="brand-h2" onClick={() => go("brands")}>
            {t.sec_brands}<Icon name="chevronRight" size={22} />
          </h2>
          <p className="brand-sub">{t.sec_brands_sub}</p>
        </div>
        <div className="brand-pills">
          {brands.slice(0, 14).map((b) => (
            <button className="brand-pill" key={b.id} title={b.name} onClick={() => go("brand", { id: b.id })}>
              <span className="bp-mono">{mono(b.name)}</span>
              <span className="bp-name">{b.name}</span>
              <span className="bp-flag">{flagByCountry(b.country_ru)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>);

}

function CtaBand({ t }) {
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="ctaband">
          <div className="cb-grid" />
          <div className="cb-l">
            <h2>{t.cta_title}</h2>
            <p>{t.cta_sub}</p>
          </div>
          <div className="cb-r">
            <a className="cb-phone" href="tel:+998772250001">{t.cta_phone}</a>
            <button className="btn btn-cyan btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>
              {t.cta_btn}<Icon name="arrowRight" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>);

}

/* Единственный рабочий адрес почты компании. В настройках сайта
   (site_contacts.email) до сих пор лежит info@soi.uz — старый адрес, из-за
   которого в футере соседствовали две разные почты. */
const SITE_MAIL = "info@sogliqindustriyasi.uz";

/* Footer убран 07.08.2026: футер на весь сайт теперь один — CoFooter
   в certificates.jsx. Здесь лежала его вторая копия для каталожной
   оболочки: разметка совпадала, расходилась только навигация, и каждую
   правку приходилось делать дважды. Точка подключения — app-root.jsx. */

function EquipScenarios({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const items = [
    { ic: "cross-pulse", t: lv("Частная клиника","Xususiy klinika","Private clinic"), act: () => go("catalog", {}) },
    { ic: "scalpel", t: lv("Стоматологический кабинет","Stomatologiya xonasi","Dental office"), act: () => go("catalog", {}) },
    { ic: "shield-cross", t: lv("Процедурный кабинет","Muolaja xonasi","Treatment room"), act: () => go("catalog", {}) },
    { ic: "pulse", t: lv("Диагностика","Diagnostika","Diagnostics"), act: () => go("catalog", { cat: "diagnostics" }) },
    { ic: "bed", t: lv("Реанимация","Reanimatsiya","Intensive care"), act: () => go("catalog", {}) },
    { ic: "eye", t: lv("Лаборатория","Laboratoriya","Laboratory"), act: () => go("catalog", {}) },
    { ic: "shield", t: lv("Стерилизационная","Sterilizatsiya","Sterilization"), act: () => go("catalog", {}) },
    { ic: "doc", t: lv("Тендер / госзакупка","Tender / davlat xaridi","Tender / procurement"), act: () => window.__openQuote && window.__openQuote() },
  ];
  return (
    <section className="section equip-sec">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 className="sec-title">{lv("Что нужно оснастить?","Nimani jihozlash kerak?","What do you need to equip?")}</h2>
            <p className="sec-sub">{lv("Выберите задачу — подберём оборудование и подготовим коммерческое предложение.","Vazifani tanlang — uskuna tanlaymiz va tijorat taklifini tayyorlaymiz.","Pick a task — we'll select equipment and prepare a quote.")}</p>
          </div>
        </div>
        <div className="equip-grid">
          {items.map((s, i) => (
            <button className="equip-card" key={i} onClick={s.act}>
              <span className="equip-ic"><Icon name={s.ic} size={26} /></span>
              <span className="equip-t">{s.t}</span>
              <Icon name="arrowRight" size={16} className="equip-arr" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TenderBand({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="tender-band">
          <div className="tb-tx">
            <span className="tb-badge">B2B / G</span>
            <h3>{lv("Соберите КП для тендера или закупки","Tender yoki xarid uchun taklif yig'ing","Build a quote for a tender or procurement")}</h3>
            <p>{lv("Добавьте товары в корзину, отправьте техническое задание или запросите подбор — менеджер подготовит коммерческое предложение, спецификацию и документы.","Mahsulotlarni savatga qo'shing, texnik topshiriq yuboring yoki tanlovni so'rang — menejer taklif, spetsifikatsiya va hujjatlarni tayyorlaydi.","Add products to the cart, send a spec or request a selection — a manager will prepare a quote, specification and documents.")}</p>
          </div>
          <div className="tb-actions">
            <button className="btn btn-primary btn-lg" onClick={() => window.__openQuote && window.__openQuote()}><Icon name="doc" size={19} />{lv("Получить КП для тендера","Tender uchun taklif olish","Get a tender quote")}</button>
            <button className="btn btn-ghost-d" onClick={() => window.__openQuote && window.__openQuote()}>{lv("Отправить ТЗ","TT yuborish","Send a spec")}</button>
            <a className="tb-dl" href={window.__asset("assets/company-card.pdf")} target="_blank" rel="noopener"><Icon name="download" size={16} />{lv("Скачать карточку компании","Kompaniya kartasini yuklab olish","Download company card")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceBand({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const items = [
    { ic: "shield", t: lv("Гарантийное сопровождение", "Kafolat qo'llab-quvvatlash", "Warranty support") },
    { ic: "wrench", t: lv("Монтаж оборудования", "Uskuna montaji", "Equipment installation") },
    { ic: "award", t: lv("Обучение персонала", "Xodimlarni o'qitish", "Staff training") },
    { ic: "pulse", t: lv("Сервисное обслуживание", "Servis xizmati", "Maintenance service") },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="service-band">
          <div className="sb-l">
            <h2 className="sec-title" style={{ marginBottom: 8 }}>{lv("Сервис и гарантия", "Servis va kafolat", "Service & warranty")}</h2>
            <p className="sec-sub" style={{ marginBottom: 22 }}>{lv("Полное сопровождение оборудования после поставки — от монтажа до планового ТО.", "Yetkazib berilgandan keyin uskunani to'liq qo'llab-quvvatlash — montajdan rejali TXgacha.", "Full equipment support after delivery — from installation to scheduled maintenance.")}</p>
            <div className="service-items">
              {items.map((s, i) => (
                <div className="service-it" key={i}>
                  <span className="service-ic"><Icon name={s.ic} size={20} /></span>
                  <span>{s.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sb-r">
            <div className="sb-card">
              <h3>{lv("Нужен сервис или монтаж?", "Servis yoki montaj kerakmi?", "Need service or installation?")}</h3>
              <p>{lv("Оставьте заявку — сервисный инженер свяжется с вами.", "Ariza qoldiring — servis muhandisi siz bilan bog'lanadi.", "Leave a request — a service engineer will contact you.")}</p>
              <button className="btn btn-primary btn-block" onClick={() => window.__openQuote && window.__openQuote()}>
                <Icon name="wrench" size={18} />{lv("Заявка на сервис", "Servisga ariza", "Service request")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>);
}

/* ════════════════════════════════════════════════════════════════
   ИНДУСТРИЯ ЗДОРОВЬЯ — Platform Homepage (Stripe/Vercel-grade)
   Light-first, dark inversion via [data-theme="dark"], expressive reveal.
   All classes prefixed .sx- to avoid collisions with legacy styles.
   ════════════════════════════════════════════════════════════════ */

function useSoiReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sx-rv:not(.sx-in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("sx-in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sx-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

function SoiPlatformCSS() {
  useEffect(() => {
    const id = "soi-platform-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
/* ── tokens ─────────────────────────────────────────────────────────────
   Фирменный стиль главной: белое поле, синий #0E4AC6 как единственный
   акцент, нейтральный тёмный текст. Лайма здесь нет — сигнальную роль
   на главных действиях принял на себя синий с белой подписью.

   Палитра берётся из глобальных токенов (:root в index.html), а не задаётся
   здесь литералами. Так было до 07.08.2026: главную перекрасили одну, и её
   значения (#17212B / #667085) пришлось прописать на месте, чтобы не задеть
   остальные страницы. Теперь единый стиль заказан для всего сайта, глобальная
   шкала уже сине-серая — и локальная копия стала лишней: она бы тихо
   разъезжалась с остальными шестнадцатью страницами при каждой правке :root.

   Имена --sx-blue и прочие остаются псевдонимами, чтобы шестнадцать мест
   вызова не пришлось править по одному. --sx-lime тоже сохранён как имя:
   на него ссылаются восемь правил, и все они теперь дают синий. Стена
   плиток «Экосистемы» пока держит собственные оттенки (--eco-h/--eco-a) —
   её пересборка отдельной задачей. */
.sx { --sx-ink:var(--ink); --sx-ink-soft:var(--ink-2); --sx-mute:var(--mute);
  --sx-line:var(--line); --sx-line-2:var(--line-2); --sx-card:#FFFFFF; --sx-bg:#FFFFFF; --sx-bg-soft:var(--bg-2);
  --sx-accent:var(--blue-600); --sx-lime:var(--blue-600); --sx-lime-ink:#FFFFFF;
  /* фирменный синий в слабых долях — заливки, рамки, подложки паттерна */
  --sx-tint-08:rgba(14,74,198,.08); --sx-tint-12:rgba(14,74,198,.12); --sx-tint-20:rgba(14,74,198,.20);
  /* aliases — old names, new restraint */
  --sx-blue:var(--blue-600); --sx-blue-2:var(--blue-700); --sx-cyan:var(--blue-600); --sx-violet:var(--blue-600); --sx-green:var(--blue-600); --sx-amber:#b87213;
  --sx-shadow:0 1px 2px rgba(14,74,198,.05);
  --sx-shadow-lg:0 1px 2px rgba(14,74,198,.06), 0 12px 32px rgba(14,74,198,.08);
  /* 18px, not global --r-lg (16px): референс readdy.cc держит более крупный
     радиус на всех карточках второй половины страницы (rounded-2xl). */
  --sx-r:18px; --sx-r-sm:10px;
  font-family:'Montserrat',Helvetica,Arial,sans-serif; }
[data-theme="dark"] .sx { --sx-ink:#E8EFFB; --sx-ink-soft:#B9C9E4; --sx-mute:#8FA2BE;
  --sx-line:var(--navy-800); --sx-line-2:var(--navy-850); --sx-card:var(--navy-900); --sx-bg:var(--navy-900); --sx-bg-soft:var(--navy-900);
  --sx-accent:#7FA8F0; --sx-lime:#2b72e3; --sx-lime-ink:#FFFFFF;
  --sx-blue:#7FA8F0; --sx-blue-2:#A8C4F6; --sx-cyan:#7FA8F0;
  --sx-tint-08:rgba(127,168,240,.10); --sx-tint-12:rgba(127,168,240,.16); --sx-tint-20:rgba(127,168,240,.24);
  --sx-shadow:0 1px 2px rgba(0,0,0,.4);
  --sx-shadow-lg:0 1px 2px rgba(0,0,0,.4), 0 16px 40px rgba(0,0,0,.5); }

.sx { background:var(--sx-bg); color:var(--sx-ink); }
.sx *, .sx *::before, .sx *::after { box-sizing:border-box; }

/* Исключения по заголовкам: блоки со своей подложкой (герой, плитки
   «Экосистемы», ctaband) держат собственный цвет, иначе они почернели бы
   под общим правилом «.z-corp h1,h2,h3».

   Само общее правило здесь больше не дублируется: в index.html оно теперь
   читает var(--ink), тот же токен, что и .sx, — повторять нечего. Раньше там
   стоял литерал #0B2D25, и эта копия существовала только чтобы его перебить
   на главной. */
.z-corp .sx .soi-chero-stage h1, .z-corp .sx .soi-chero-stage h2, .z-corp .sx .soi-chero-stage h3,
.z-corp .sx .eco-t h1, .z-corp .sx .eco-t h2, .z-corp .sx .eco-t h3,
.z-corp .sx .ctaband h1, .z-corp .sx .ctaband h2, .z-corp .sx .ctaband h3,
.z-corp .sx [class*="-ctaband"] h1, .z-corp .sx [class*="-ctaband"] h2, .z-corp .sx [class*="-ctaband"] h3,
.z-corp .sx .sxp-card.feat h1, .z-corp .sx .sxp-card.feat h2, .z-corp .sx .sxp-card.feat h3 { color:inherit; }

/* Фон главной оставлен чистым: решение заказчика от 06.08.2026 — никаких
   декоративных слоёв поверх подложек. Присланный из Figma паттерн («линзы»)
   был подключён и снят по этому же решению; вместе с ним удалён ассет
   assets/soi-pattern.svg. Прочая декорация — .sxp-glow, .sx-cp-aurora,
   .sx-cta-aurora — была выключена
   (display:none) ещё раньше; разметку под них не трогаем, чтобы не
   переписывать шесть компонентов ради снятия уже невидимого.

   Фирменный цвет остаётся присутствовать заливками (--sx-tint-*), а не
   рисунком: это и есть заказанные «10-20%». */
/* .sx впереди — базовый «.sx-cta» объявлен ниже по этому же файлу и при
   равной специфичности выиграл бы порядком. */
.sx .sx-cta { background:var(--sx-tint-08); border-color:var(--sx-tint-20); }
.sx-wrap { max-width:var(--maxw); margin:0 auto; padding:0 32px; }
.sx-section { padding:clamp(64px,8vw,108px) 0; position:relative; }
/* Светлые секции выключены: фон страниц — только белый. Правило оставлено
   пустым, чтобы разметка с классом soft не требовала правки. */
.sx-section.soft { background:var(--sx-bg); }

/* reveal */
.sx-rv { opacity:0; transform:translateY(26px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); transition-delay:calc(var(--i,0) * 70ms); }
.sx-in { opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ .sx-rv{ transition:none; opacity:1; transform:none; } }

/* heads */
/* The eyebrow was a coloured label with a gradient dash. Quietened to a small
   grey caption — the heading under it is doing the work now. */
/* Надзаголовок секции. Один вид на все секции главной: два правила были
   побайтово одинаковыми и жили в разных концах файла. */
.sx-h2 { font-size:clamp(32px,4.4vw,54px); font-weight:800; line-height:1.04; letter-spacing:-.035em; color:var(--sx-ink); margin:14px 0 0; text-wrap:balance; }
.sx-sub { font-size:clamp(16px,1.5vw,18px); line-height:1.6; color:var(--sx-mute); margin-top:14px; max-width:600px; }
.sx-head { margin-bottom:44px; }
.sx-head.center { text-align:center; }
.sx-head.center .sx-sub { margin-left:auto; margin-right:auto; }

/* link */
.sx-link { display:inline-flex; align-items:center; gap:6px; font-size:var(--fs-4); font-weight:700; color:var(--sx-blue); cursor:pointer; transition:gap .2s, color .2s; }
.sx-link:hover { gap:11px; color:var(--sx-blue-2); }

/* ── ecosystem bento ────────────────────────────────────
   Deep-ground tiles reading as one island on the light page. Each tile carries a
   hue of its own (--eco-h/--eco-a); everything inside is built from white alphas
   over that ground, so a tile stays coherent whatever its colour. */
/* The section's own air is cut back too — with the standard 108px band the two
   rows still overflow a 900px screen by the height of a tile's heading. */
.eco-section { padding-top:64px; padding-bottom:64px; }
/* Two rows, not three: the block has to fit one screen. Twelve columns because
   the second row carries four tiles — six could not divide into four. */
.eco-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:14px;
  grid-template-areas:
    "catalog  catalog  catalog  catalog  tender tender tender tender tender  tender   tender   tender"
    "training training training brands   brands brands service service service delivery delivery delivery"; }
/* One recipe for every tile: the section's own hue in --eco-h, its accent in
   --eco-a, and identical depth on top — same radius, same diagonal, same inner
   glow, same shadow. The hues are the brand values; the gradient darkens them
   so a tile reads as a deep field rather than a flat swatch of colour. */
.eco-t { --eco-h:#0B4EDB; --eco-a:#5C9DFF;
  position:relative; grid-area:var(--eco-area); isolation:isolate; display:flex; flex-direction:column;
  /* 24px/18px — не глобальный --r-lg (16px): формы карточек на главной сведены
     к масштабу readdy.cc (rounded-2xl, p-6), локально для этой плитки. */
  padding:24px; border-radius:18px; overflow:hidden; color:#fff;
  background:
    radial-gradient(115% 115% at 100% 0%, color-mix(in srgb, var(--eco-a) 22%, transparent), transparent 60%),
    linear-gradient(150deg,
      color-mix(in srgb, var(--eco-h) 60%, #05070F) 0%,
      color-mix(in srgb, var(--eco-h) 82%, #05070F) 52%,
      color-mix(in srgb, var(--eco-h) 44%, #05070F) 100%);
  box-shadow:
    0 1px 0 0 rgba(255,255,255,.10) inset,
    0 0 0 1px color-mix(in srgb, var(--eco-a) 14%, transparent) inset,
    0 20px 44px -24px color-mix(in srgb, var(--eco-h) 70%, #000); }
/* Подложка плитки — два мягких пятна её же акцента, статично.

   Прежде пятна ползали по плитке (ecoDrift, 19 с) и поверх раз в девять секунд
   пробегала светлая полоса (ecoSheen) — шесть плиток мерцали вразнобой, чтобы
   не вспыхивать разом. Снято по решению заказчика 08.08.2026: движение ничего
   не сообщало о содержимом и на деловой странице читалось дешёвым эффектом.

   Градиенты оставлены — они дают плитке объём. Ушла только анимация, вместе с
   ней will-change:transform: шесть слоёв постоянно висели в отдельных слоях
   композитора без всякой пользы. */
.eco-t::before { content:""; position:absolute; z-index:-1; pointer-events:none;
  inset:0;
  background:
    radial-gradient(38% 44% at 24% 28%, color-mix(in srgb, var(--eco-a) 30%, transparent), transparent 68%),
    radial-gradient(34% 40% at 76% 74%, color-mix(in srgb, var(--eco-a) 20%, transparent), transparent 70%); }

/* Плитки были раскрашены в шесть разных цветов — зелёный, фиолетовый,
   оранжевый, бирюзовый; на главной с одним фирменным цветом это читалось
   радугой. Теперь все шесть — тот же #0E4AC6, различаются только глубиной:
   стена остаётся читаемой (соседние плитки не сливаются), но не спорит с
   палитрой. Рецепт плитки не тронут — правятся ровно две переменные на класс. */
.eco-t.catalog  { --eco-area:catalog;  --eco-h:#0E4AC6; --eco-a:#8CB4F5; }
.eco-t.brands   { --eco-area:brands;   --eco-h:#0D46B8; --eco-a:#86AFF3; }
.eco-t.training { --eco-area:training; --eco-h:#0B3EA8; --eco-a:#7FA8F0; }
.eco-t.service  { --eco-area:service;  --eco-h:#0A3796; --eco-a:#789FEC; }
.eco-t.delivery { --eco-area:delivery; --eco-h:#082E7E; --eco-a:#6E9BEA; }
.eco-t.tender   { --eco-area:tender;   --eco-h:#06265F; --eco-a:#6593E6; }

/* ── shared across tiles — keep OUT of any per-section block ──────────────
   These belong to no single tile: .eco-live is the tenders badge, .eco-brand
   dresses the brand wall. Twice now they were deleted by a wholesale rewrite of
   the tenders CSS because they happened to sit inside it. */
/* Отметка обновления — просто строка с пульсирующей точкой, без пилюли
   (решение заказчика 08.08.2026). Подложка и рамка делали из служебной
   пометки ещё один элемент управления, хотя нажимать её не на что. */
.eco-live { display:inline-flex; align-items:center; gap:8px; font-size:var(--fs-1); font-weight:700;
  color:rgba(255,255,255,.82); white-space:nowrap; }
.eco-live::before { content:""; width:7px; height:7px; border-radius:50%; background:var(--blue-400); box-shadow:var(--sh-sm); animation:ecoPulse 2.4s ease-out infinite; }
@keyframes ecoPulse { 70% { box-shadow:0 0 0 7px rgba(77,142,238,0); } 100% { box-shadow:0 0 0 0 rgba(77,142,238,0); } }
/* One line, clipped: the wall is a proof of breadth, not a list. Wrapping it
   cost the block three rows of height it does not have. */
.eco-brands { display:flex; flex-wrap:nowrap; gap:7px; margin-top:12px; overflow:hidden; mask-image:linear-gradient(90deg,#000 78%,transparent); }
.eco-brand { display:inline-flex; align-items:center; justify-content:center; height:30px; padding:0 11px; border-radius:var(--r-sm); flex:0 0 auto;
  background:rgba(255,255,255,.92); color:var(--navy-850); font-size:var(--fs-1); font-weight:800; letter-spacing:.01em; white-space:nowrap; }
.eco-brand img { max-height:17px; max-width:66px; object-fit:contain; }

/* Optional photo behind a tile: the scrim keeps text legible whatever the shot,
   and the tile looks deliberate when no photo is set at all. */
.eco-photo { position:absolute; inset:0; z-index:-1; background-size:cover; background-position:center; opacity:.42; }
.eco-photo::after { content:""; position:absolute; inset:0;
  background:linear-gradient(180deg, color-mix(in srgb, var(--eco-h) 55%, transparent) 0%, color-mix(in srgb, var(--eco-h) 88%, #05070F) 82%); }

/* head: icon + optional corner badge */
/* Content starts at the top in every tile, so icon, figure and heading line up
   across a row; the slack falls to the bottom, where the CTA holds the baseline. */
.eco-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; }
.eco-ic { width:38px; height:38px; border-radius:var(--r); display:flex; align-items:center; justify-content:center; flex:0 0 auto;
  background:color-mix(in srgb, var(--eco-a) 22%, transparent); color:var(--eco-a); border:1px solid color-mix(in srgb, var(--eco-a) 26%, transparent); }
.eco-badge { display:inline-flex; align-items:center; gap:7px; padding:7px 11px; border-radius:var(--r); font-size:var(--fs-2); font-weight:700;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.14); color:rgba(255,255,255,.86); }
.eco-badge b { font-size:var(--fs-4); font-weight:800; font-variant-numeric:tabular-nums; color:#fff; }

/* numbers + copy */
.eco-num { margin-top:12px; font-size:clamp(32px,3.1vw,40px); font-weight:800; line-height:.95; letter-spacing:-.035em;
  font-variant-numeric:tabular-nums; color:#fff; }
.eco-num span { color:var(--eco-a); }
.eco-t h3 { margin:8px 0 0; font-size:var(--fs-5); font-weight:800; letter-spacing:-.012em; line-height:1.25; color:#fff; text-wrap:balance; }
.eco-t.catalog h3 { font-size:var(--fs-6); }
.eco-t p { margin:7px 0 0; font-size:var(--fs-3); line-height:1.5; color:rgba(255,255,255,.72); max-width:44ch; }

/* metric strip — hidden entirely when the editor leaves it blank */
.eco-metrics { display:flex; flex-wrap:wrap; gap:9px; margin-top:20px; }
.eco-m { flex:1 1 96px; min-width:96px; padding:11px 13px; border-radius:var(--r);
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.11); }
.eco-m-v { font-size:var(--fs-6); font-weight:800; letter-spacing:-.02em; font-variant-numeric:tabular-nums; color:#fff; }
/* "закрываются" is wider than a third of a phone screen — let it break rather
   than spill out of its card. */
.eco-m-l { margin-top:3px; font-size:var(--fs-1); line-height:1.35; color:rgba(255,255,255,.62); overflow-wrap:anywhere; }

/* actions */
.eco-foot { margin-top:auto; padding-top:14px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
/* min-height до нормы 44px: кнопка была 36px по высоте. Ширины хватало,
   поэтому подняли только высоту — padding оставлен прежним, вид почти не
   изменился. */
.eco-cta { min-height:44px; display:inline-flex; align-items:center; gap:9px; padding:9px 14px; border-radius:var(--r); border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.10); color:#fff; font-size:var(--fs-3); font-weight:700; cursor:pointer; text-align:left;
  transition:background .2s, border-color .2s, gap .2s; }
.eco-cta:hover { background:rgba(255,255,255,.17); border-color:rgba(255,255,255,.3); gap:13px; }
.eco-cta.solid { background:var(--eco-a); border-color:transparent; color:#08182F; }
.eco-cta.solid:hover { background:color-mix(in srgb, var(--eco-a) 84%, #fff); }
.eco-t :is(a,button):focus-visible { outline:2px solid #fff; outline-offset:3px; border-radius:var(--r); }

/* The catalog tile had a search field and category chips; both were dropped when
   the block was cut to one screen, and the tile now leads straight to the CTA. */

/* ── tenders: one monitoring panel, not cards inside cards ────────────────
   Four counters, then two lists separated by a hairline. Everything sits on the
   tile's own ground — the only boxes are the KPI cells, because a figure needs
   an edge to read as a figure. */
.eco-t.tender { padding:20px; }
.tnd-top { display:grid; grid-template-columns:auto 1fr auto; align-items:start; gap:14px; }
.tnd-titles { min-width:0; }
/* Promoted from caption to headline. Set in caps at heading size, it needs the
   opposite treatment to a small eyebrow: tracking pulled back in (wide letter
   spacing at 21px reads as a logotype, not a title) and a tighter line height,
   because a fifty-character line will take two rows on any tile width. */
/* Кегль плавающий: плитка сузилась до шести колонок, и на фиксированном --fs-7
   заголовок из пятидесяти прописных занимал четыре строки — больше, чем сами
   цифры под ним. clamp даёт ему ужаться на узкой плитке, не мельча на широкой. */
.eco-t.tender h3.tnd-eyebrow { display:block; margin:0; font-size:clamp(15px,1.5vw,20px); font-weight:800;
  letter-spacing:.015em; line-height:1.18; text-transform:uppercase; color:#fff; text-wrap:balance; }
.eco-t.tender > p { margin-top:8px; max-width:62ch; }

/* The counters lost their boxes: four cells with borders inside a bordered tile
   inside a bordered grid was three frames deep and read as clutter. What ranks
   them now is size — the lead figure is nearly twice the others — and a hairline
   between columns, which is what a dashboard uses. */
/* Bento-раскладка по макету заказчика (08.08.2026): каждая величина в своей
   карточке, размеры карточек разные.

     колонка 1 — «активных закупок» и под ней категории;
     колонка 2 — «новых» и «закрываются», одна под другой;
     колонка 3 — площадки, во всю высоту блока.

   Прежде четыре цифры стояли в ряд, разделённые вертикальными линиями, а
   списки лежали сплошной полосой под ними: главное число ничем не отличалось
   от справочных, кроме кегля. Карточки задают вес явно. */
/* Две колонки: слева «активных закупок» и под ней категории, справа площадки.
   Средняя колонка ушла вместе с цифрами «новых» и «закрываются за неделю».
   Левая шире — под ведущей цифрой стоят категории, а их названия
   («Медицинское оборудование») длиннее всего в блоке и при равных долях
   обрезались многоточием. */
/* stretch, а не start: карточки должны кончаться на одной линии, хотя списки
   в них разной длины — пять категорий против четырёх площадок. */
.tnd-kpis { display:grid; grid-template-columns:1.5fr 1fr; grid-auto-rows:auto;
  gap:10px; margin-top:12px; align-items:stretch; }
.tnd-kpi { position:relative; padding:12px 16px; border-radius:var(--r);
  background:rgba(255,255,255,.05); }
/* Ведущая цифра занимает свою колонку целиком, остальные встают по порядку. */
.tnd-kpi.lead { grid-column:1; grid-row:1; }
/* Цифры укрупнены (решение заказчика 08.08.2026): ради них плитку и смотрят,
   а прежде они соперничали по весу со списками под ними. Заданы в rem, а не
   через --fs-*: шкала обрывается на --fs-9, следующего шага в ней нет.

   Один размер на обе карточки: прежде левая шла 2.6rem, правая 2.2rem, и
   рядом это читалось как разные по важности величины, хотя карточки
   равноправны (решение заказчика 09.08.2026 — унифицировать). */
.tnd-kpi-v { font-size:2.6rem; font-weight:800; line-height:1; letter-spacing:-.035em; font-variant-numeric:tabular-nums; color:#fff; }
/* Цифра и подпись — в одну строку. Выравнивание по базовой линии, а не по
   центру: у кегля 2.6rem и 15px центры не совпадают, и подпись «плавала» бы
   относительно числа. Перенос разрешён — на узкой плитке длинная подпись
   уходит под цифру, а не выдавливает её из карточки. */
.tnd-kpi-head { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
/* Подписи одинаковы в обеих карточках: слева стояли вес 600 и прозрачность
   .8, справа — 400 и .58, из-за чего левая читалась заметно плотнее. */
.tnd-kpi-l { font-size:var(--fs-4); font-weight:600; line-height:1.25; color:rgba(255,255,255,.8); }

/* Сворачивание снято (решение заказчика 08.08.2026): списки показаны всегда,
   и органов управления у них нет. Отсюда убраны курсор, шевронки, состояния
   наведения и фокуса — карточка снова просто карточка, а не кнопка.
   Разметка вернулась с <details>/<summary> на обычные блоки. */
/* Разделитель над списком одинаков в обеих карточках — см. .tnd-sec ниже.
   Собственных отступов у строк здесь больше нет: они шли 4px/6px против
   5px/8px в категориях, и списки стояли с разным шагом. */
.tnd-kpi-list { margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,.12); }
/* Площадки — правая колонка. Обе карточки тянутся на высоту ряда, поэтому
   стоят вровень независимо от того, в какой из них список длиннее. */
.tnd-kpi-src { grid-column:2; }
.tnd-kpi { align-self:stretch; }

/* Категории живут внутри карточки «активных закупок», а не рядом с ней:
   они раскладывают на части то же самое число. Отделены от цифры линией —
   своей подложки не имеют, иначе получилась бы карточка внутри карточки. */
.tnd-sec { min-width:0; margin-top:12px; padding-top:10px;
  border-top:1px solid rgba(255,255,255,.12); }
/* Заголовок стоит в строке с цифрой и прижат к правому краю карточки:
   margin-left:auto отталкивает его от подписи, а перенос строки в .tnd-kpi-head
   уводит его вниз на узкой плитке, где втроём они не помещаются. */
.tnd-sec-h { margin-left:auto; padding-bottom:0;
  font-size:var(--fs-1); font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:rgba(255,255,255,.5)}


/* rows — platforms and categories share one shape */
.tnd-row { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:10px;
  width:100%; padding:5px 8px; margin:0 -8px; border:0; background:transparent; color:inherit; font:inherit; text-align:left;
  border-radius:var(--r-sm); text-decoration:none; transition:background .18s ease, color .18s ease, transform .18s ease; }
/* Категории снова несут сумму: полоска, название, сумма, количество. Сумма
   возвращена в строку по решению заказчика 08.08.2026 — из подсказки её было
   не видно без наведения. */
.tnd-row.cat { grid-template-columns:3px minmax(0,1fr) auto auto; gap:0 9px; align-items:baseline; }
a.tnd-row, button.tnd-row { cursor:pointer; }
.tnd-row + .tnd-row { box-shadow:var(--sh-sm); }
/* Поочерёдная подсветка: активная строка в полную силу, остальные приглушены.
   Гасим только непрозрачность и фон — не цвет текста: так строка не меняет
   размеров и соседи не дёргаются.

   .62, а не .3-.4: приглушённые строки остаются читаемыми. Список — не
   декорация, в нём цифры по категориям, и пользователь должен видеть их все
   разом, а подсветка лишь ведёт взгляд. */
.tnd-sec .tnd-row, .tnd-kpi-list .tnd-row { opacity:.62; transition:opacity .45s ease, background .45s ease, transform .18s ease; }
.tnd-sec .tnd-row.is-lit, .tnd-kpi-list .tnd-row.is-lit { opacity:1; background:rgba(255,255,255,.08); }
/* Наведение и фокус всегда сильнее автоподсветки: пользователь ведёт сам. */
.tnd-sec .tnd-row:hover, .tnd-kpi-list .tnd-row:hover,
.tnd-sec .tnd-row:focus-visible, .tnd-kpi-list .tnd-row:focus-visible { opacity:1; }
@media (prefers-reduced-motion: reduce){
  /* Таймер не заводится (см. useRowCycle), но правило нужно и здесь: без него
     строки остались бы приглушёнными навсегда. */
  .tnd-sec .tnd-row, .tnd-kpi-list .tnd-row { opacity:1; transition:none; }
}

/* Nudged, not scaled: scaling a row inside a dense list shoves its neighbours
   around, and transform keeps the work off the layout thread either way. */
.tnd-row:hover { background:rgba(255,255,255,.09); transform:translateX(3px); }
.tnd-row:focus-visible { outline:2px solid #fff; outline-offset:-2px; }
/* Названия переносятся, а не обрезаются многоточием (решение заказчика
   08.08.2026): «Медицинские инструменты» в узкой колонке превращалось в
   «Медицинские инструм…», и строку нельзя было прочитать не наводя курсор. */
.tnd-row-n { font-size:var(--fs-3); font-weight:600; color:rgba(255,255,255,.9);
  min-width:0; overflow-wrap:anywhere; }
.tnd-row-v { font-size:var(--fs-3); font-weight:700; font-variant-numeric:tabular-nums; color:#fff; min-width:18px; text-align:right; }
/* Сумма — справочная величина рядом с названием: мельче и тусклее счётчика,
   иначе две цифры в строке читаются как равные по значимости. */
.tnd-row-sum { font-size:var(--fs-1); font-variant-numeric:tabular-nums; color:rgba(255,255,255,.55); white-space:nowrap; }
.tnd-row.zero .tnd-row-n, .tnd-row.zero .tnd-row-v, .tnd-row.zero .tnd-row-sum { color:rgba(255,255,255,.45); }
.tnd-dot { width:7px; height:7px; border-radius:50%; background:var(--blue-400); }
.tnd-dot.off { background:rgba(255,255,255,.28); }
/* The accent bar: one hue, five weights of it, so the list is ranked without
   turning five rows into five different colours. */
.tnd-bar { width:3px; height:16px; border-radius:2px; background:var(--eco-a); opacity:var(--bar,1);
  transform-origin:center; transition:transform .18s ease; }
.tnd-row.cat:hover .tnd-bar { transform:scaleY(1.35); }
.tnd-row.cat.zero .tnd-bar { background:rgba(255,255,255,.25); }

@media (max-width:1080px) {
  /* Узкая плитка — карточки в один столбец, каждая своей строкой. Прежние
     правила рисовали здесь сетку из тонких линий между четырьмя ячейками;
     ни линий, ни четырёх ячеек больше нет — карточки разделяет зазор. */
  .tnd-kpis { grid-template-columns:1fr; }
  .tnd-kpi.lead, .tnd-kpi-src, .tnd-kpi-src[open] {
    grid-column:1; grid-row:auto; align-self:auto; }
}
@media (max-width:680px) {
  .tnd-top { grid-template-columns:auto 1fr; }
  .tnd-top .eco-live { grid-column:1 / -1; justify-self:start; }
  /* Fifty characters of caps need a step down before they take four lines. */
  .eco-t.tender h3.tnd-eyebrow { font-size:var(--fs-5); }
  /* Кегль сбавлен, но остаётся общим для обеих карточек: раздельные размеры
     (--fs-8 слева и --fs-7 справа) здесь и ломали унификацию на телефоне. */
  .tnd-kpi-v { font-size:var(--fs-8); }
  /* Сумма — первое, что уходит, когда строке не хватает ширины: читатель
     ищет название и количество. Без display:none сумма оставалась в разметке
     и попадала в неявную колонку — счётчик срывался на следующую строку, и
     список рассыпался.

     На широких экранах сумма на месте: она возвращена туда по решению
     заказчика 08.08.2026. */
  .tnd-row.cat { grid-template-columns:3px minmax(0,1fr) auto; }
  .tnd-row-sum { display:none; }

  /* Строки списков и ссылки направлений — до нормы 44px. Это цели для пальца,
     а не для курсора: на десктопе они остаются плотными (32 и 30px), потому
     что там курсор точный и высота блоков важнее. */
  .tnd-row { min-height:44px; }
  .sx-dir-links a { min-height:44px; display:flex; align-items:center; }
}

/* The map no longer claims a block of its own height: it sits behind the copy,
   bled to the tile's bottom-right corner, and the text keeps the foreground. */
.eco-map { position:absolute; right:-8%; bottom:-6%; width:78%; height:auto; display:block; overflow:visible; z-index:-1; opacity:.55; }
.eco-map-land { fill:color-mix(in srgb, var(--eco-a) 13%, transparent); stroke:color-mix(in srgb, var(--eco-a) 72%, transparent);
  stroke-width:1.3; stroke-linejoin:round; }
/* Two strokes per route: a faint permanent corridor, and a short dash running
   along it from Tashkent outward — a delivery leaving, not decoration. */
.eco-map-route { fill:none; stroke:color-mix(in srgb, var(--eco-a) 26%, transparent); stroke-width:.9; }
/* pathLength="1" normalises every route, so a short hop to Sirdaryo and a long
   run to Karakalpakstan take the same time instead of the dash racing. */
.eco-map-flow { fill:none; stroke:color-mix(in srgb, var(--eco-a) 92%, transparent); stroke-width:1.5; stroke-linecap:round;
  stroke-dasharray:.06 .94; stroke-dashoffset:1; animation:ecoFlow 3.6s linear infinite; }
.eco-map-dot { fill:var(--eco-a); opacity:.55; animation:ecoLand 3.6s ease-in-out infinite; }
.eco-map-hub { fill:#fff; }
.eco-map-ping { fill:none; stroke:#fff; stroke-width:1.2; opacity:0; animation:ecoPing 3.6s ease-out infinite; }
@keyframes ecoFlow { to { stroke-dashoffset:0; } }
@keyframes ecoLand { 0%,62% { opacity:.55; r:2.6; } 78% { opacity:1; r:3.6; } 100% { opacity:.55; r:2.6; } }
@keyframes ecoPing { 0% { r:4.4; opacity:.7; } 55%,100% { r:15; opacity:0; } }
@media (prefers-reduced-motion: reduce) {
  .eco-map-flow { animation:none; stroke-dasharray:none; stroke-dashoffset:0; stroke-width:.9; opacity:.5; }
  .eco-map-dot { animation:none; opacity:.85; }
  .eco-map-ping { display:none; }
  /* Подложка плиток больше не анимируется ни при каких настройках — гасить
     нечего, правила для .eco-t::before/::after убраны вместе с анимацией. */
}

@media (max-width:1080px) {
  .eco-grid { grid-template-columns:repeat(2,1fr);
    grid-template-areas:"catalog catalog" "training training" "tender tender" "brands service" "delivery delivery"; }
  .eco-tender-cols { grid-template-columns:1fr; }
}
@media (max-width:680px) {
  .eco-grid { grid-template-columns:1fr;
    grid-template-areas:"catalog" "training" "tender" "brands" "service" "delivery"; gap:14px; }
  .eco-t, .eco-t.tender { padding:22px; border-radius:var(--r-lg); }
  .eco-m { flex:1 1 100%; }
  /* KPIs stay three-up on a phone — stacking them would undo the height the
     block just gained — so they shed padding and a couple of type steps. */
  .eco-kpis { gap:8px; }
  .eco-kpis .eco-m { padding:10px; }
  .eco-kpis .eco-m-v { font-size:var(--fs-7); }
  .eco-kpis .eco-m-l { font-size:var(--fs-1); }
}

/* ── directions ─────────────────────────────────────── */
/* Воздуха между карточками и внутри них добавлено (решение заказчика
   08.08.2026): 18 → 30px в сетке, 26/24 → 34/30px внутри. Раньше четыре
   карточки читались сплошным массивом — белого поля между ними почти не
   оставалось. */
.sx-dir-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:30px; }
/* Внутренний отступ вернули к 24px (решение от 09.08.2026, поверх записи
   выше от 08.08.2026) — карточки сведены к масштабу readdy.cc. Сетка между
   карточками (gap:30px) не тронута: пользователь просил про отступ внутри
   карточки, не про воздух между ними. */
.sx-dir { position:relative; border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); padding:24px; transition:transform .3s cubic-bezier(.16,1,.3,1), border-color .3s; }
/* Тень на hover заменена подсветкой рамки — readdy.cc держит карточки
   полностью плоскими (box-shadow:none) во всех состояниях, глубину даёт
   только смена цвета рамки и сдвиг по Y. */
.sx-dir:hover { transform:translateY(-4px); border-color:var(--sx-accent); }
/* Заголовок — единственная ссылка карточки; её зона нажатия растянута на всю
   карточку. cursor:pointer держится на этом слое, а не на самом блоке: иначе
   палец-курсор появлялся бы и там, где нажимать нечего. */
.sx-dir-t { color:inherit; text-decoration:none; }
.sx-dir-t::after { content:""; position:absolute; inset:0; border-radius:inherit; cursor:pointer; }
/* Ссылки на отдельные направления лежат над растянутой зоной, иначе она
   перехватывала бы клики по ним. */
.sx-dir-links { position:relative; z-index:1; }
/* Фокус с клавиатуры показываем на всей карточке, а не на строке заголовка —
   нажатие всё равно относится к ней целиком. */
.sx-dir:focus-within { outline:2px solid var(--sx-accent); outline-offset:3px; }
.sx-dir-t:focus-visible { outline:none; }
/* Иконка: один фирменный тон на все группы, подложка — он же в 10%.
   Контейнер вырос с 50 до 72px следом за глифом (26 → 39px), чтобы вокруг
   знака остался тот же воздух, а не впритык к краям. */
.sx-dir-ic { width:72px; height:72px; border-radius:var(--r); display:flex; align-items:center; justify-content:center; margin-bottom:22px;
  background:rgba(14,74,198,.10); color:var(--sx-accent); }
.sx-dir h3 { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); letter-spacing:-.01em; line-height:1.25; }
.sx-dir-links { margin-top:14px; display:flex; flex-direction:column; gap:2px; }
.sx-dir-links a { display:block; font-size:var(--fs-3); color:var(--sx-mute); text-decoration:none; padding:5px 0; transition:color .18s, padding-left .18s; }
.sx-dir-links a:hover { color:var(--sx-blue); padding-left:5px; }

/* ── impact band (dark interlude) ───────────────────── */
/* Three navy slabs — impact, catalog portal, closing CTA — were the page's
   other dark moments. They are now paper: a hairline card on the canvas, with
   the aurora and the blueprint grid switched off. Contrast comes from the
   ecosystem tiles and the hero photograph, and from nothing else. */

/* ── brands pill list (2 rows, clipped) ───────────────── */
.sx-brands-title { display:inline-flex; align-items:center; gap:8px; }

/* ── partners marquee ────────────────────────────────────────────────────
   A wall of names read as a dump of text; it now drifts. The track holds the
   list twice and slides exactly one copy to the left, so the seam lands where
   the first copy ends and the loop is invisible. Duration is set per render
   from the number of names (--mq-dur), which keeps the speed constant however
   many partners the admin adds — a fixed duration would make forty names race
   and six names crawl. */
.sx-mq-sec {background:var(--sx-card);
  padding:clamp(34px,4.5vw,54px) 0}
.sx-mq-head { max-width:var(--maxw); margin:0 auto clamp(22px,2.6vw,32px); padding:0 32px; }
/* Two belts running against each other. Opposite directions are what keep the
   pair from reading as one tall band sliding past, and each row carries its own
   half of the list — the same names twice over would just look like a mistake. */
.sx-mq-vp { position:relative; display:flex; flex-direction:column; gap:clamp(14px,1.8vw,22px); }
.sx-mq-row { overflow:hidden; }
.sx-mq-track { --mq-gap:clamp(38px,5vw,72px);
  display:flex; width:max-content; align-items:center;
  animation:sxMarquee var(--mq-dur,42s) linear infinite; will-change:transform; }
/* Проход несёт и внутренние зазоры, и замыкающий — тогда ширина дорожки ровно
   вдвое больше прохода, и −50 % попадают точно в стык. */
.sx-mq-pass { display:flex; align-items:center; gap:var(--mq-gap); padding-right:var(--mq-gap); flex:0 0 auto; }
@keyframes sxMarquee { from { transform:translate3d(0,0,0); } to { transform:translate3d(-50%,0,0); } }
/* The right-bound row plays the same keyframes backwards, so the seam maths
   stay in one place instead of being written twice with opposite signs. */
.sx-mq-track.rev { animation-direction:reverse; }
/* Hovering stops the belt you are aiming at — and only that one. Freezing both
   rows under a single cursor looks like the page hung. */
.sx-mq-row:hover .sx-mq-track, .sx-mq-row:focus-within .sx-mq-track { animation-play-state:paused; }

/* Monochrome by default, ink on hover — the row stays quiet until you aim at it. */
.sx-mq-item { flex:0 0 auto; display:inline-flex; align-items:center; gap:10px; border:0; background:none; padding:0; cursor:pointer;
  font-family:inherit; font-size:clamp(17px,1.9vw,22px); font-weight:700; letter-spacing:-.015em; white-space:nowrap;
  color:var(--sx-mute); transition:color .25s ease, opacity .25s ease, filter .25s ease; }
.sx-mq-item:hover, .sx-mq-item:focus-visible { color:var(--sx-ink); }
.sx-mq-item:focus-visible { outline:2px solid var(--sx-ink); outline-offset:6px; border-radius:var(--r-sm); }
.sx-mq-item img { height:30px; max-width:120px; object-fit:contain; filter:grayscale(1); opacity:.5; transition:inherit; }
.sx-mq-item:hover img, .sx-mq-item:focus-visible img { filter:grayscale(0); opacity:1; }
.sx-mq-flag { font-size:var(--fs-4); filter:grayscale(1); opacity:.55; transition:inherit; }
.sx-mq-item:hover .sx-mq-flag { filter:grayscale(0); opacity:1; }

/* The fade at both edges: an overlay, never a hit target, so the names it
   covers stay clickable. Painted with the section's own surface colour rather
   than a literal white, or the dark theme would get two white smears. */
.sx-mq-fade { position:absolute; inset:0; pointer-events:none; z-index:1;
  background:linear-gradient(90deg, var(--sx-card) 0%, transparent 12%, transparent 88%, var(--sx-card) 100%); }

@media (prefers-reduced-motion: reduce) {
  /* Standing still, each row becomes an ordinary horizontal scroller. */
  .sx-mq-track { animation:none; }
  .sx-mq-row { overflow-x:auto; scrollbar-width:none; }
  .sx-mq-row::-webkit-scrollbar { display:none; }
}

/* ── proof / cases ──────────────────────────────────── */
/* Колонки сетки проектов заданы не здесь, а рядом с брейкпоинтами .sxc-grid
   (см. «сетки на три колонки» ниже): там они идут после одноклассовых правил
   .sxc-grid и выигрывают порядком при равной специфичности.
   Флексовые flex/max-width/min-width с карточки убраны: в grid они не работали
   как задумано, а max-width:33.333% зажимал карточку внутри и без того более
   узкой колонки, оставляя пустоту справа. */
.sx-case { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s cubic-bezier(.16,1,.3,1), border-color .3s; display:flex; flex-direction:column; }
.sx-case:hover { transform:translateY(-5px); border-color:var(--sx-accent); }
/* Два класса в селекторе — чтобы победить .sxc-media (3/4), который лежит
   ниже по файлу и достался обложке заодно: этот же элемент носит оба класса,
   и при равной специфичности выигрывал более поздний. Портретная пропорция
   каталога здесь неуместна — у проекта в кадре здание, а не витрина. */
.sxc-media.sx-case-cover { aspect-ratio:16/10; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-case-cover img { width:100%; height:100%; object-fit:cover; }
.sx-case-body { padding:20px 22px; flex:1; display:flex; flex-direction:column; }
/* Бейдж типа проекта: нейтральная серая пилюля, не синяя плашка (09.08.2026,
   по образцу readdy.cc). Синий на ней конкурировал с синими заголовками
   и кнопками секции — тип проекта это ярлык, а не действие. */
/* nowrap + многоточие, а не перенос: «КОМПЛЕКСНОЕ ОСНАЩЕНИЕ» с разрядкой
   требует ~235px, а колонка карточки при трёх в ряд даёт 234 — пилюля
   ломалась на две строки и вырастала до 48px. Теги приходят из CMS и могут
   быть любой длины, поэтому обрезаем, а не подгоняем кегль под один тег. */
/* display:block + width:fit-content, а не inline-flex: на inline-flex
   text-overflow:ellipsis не действует, и длинный тег из CMS обрезался
   «в обрыв», без многоточия. */
.sx-case-tag { display:block; width:fit-content; align-self:flex-start; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  font-size:var(--fs-1); font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--sx-ink-soft); background:var(--sx-bg-soft); padding:6px 12px; border-radius:var(--r-pill); margin-bottom:13px; }
.sx-case h3 { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.01em; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.sx-case p { font-size:var(--fs-4); color:var(--sx-mute); line-height:1.55; margin:8px 0 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
/* Мета отбита волосяной линией и держится на иконках вместо подписей
   «Год:»/«Регион:» — булавка и календарь читаются быстрее слова. */
.sx-case-meta {display:flex; flex-wrap:wrap; gap:8px 18px; margin-top:auto; padding-top:14px; border-top:1px solid var(--sx-line); font-size:var(--fs-3); color:var(--sx-mute)}
.sx-case-meta > span { display:inline-flex; align-items:center; gap:7px; }
.sx-case-meta svg { flex-shrink:0; color:var(--sx-mute); }

/* ── news ───────────────────────────────────────────── */
/* Колонки — там же, где у проектов (см. «сетки на три колонки»). Раньше здесь
   стоял одноклассовый .sx-news с тремя колонками, и он был мёртв дважды: класс
   не был проставлен в разметке вовсе, а по специфичности он всё равно проиграл
   бы четырём колонкам .sxc-grid. Новости из-за этого шли по четыре в ряд —
   вернее, три занимали три колонки из четырёх, оставляя пустоту справа. */
.sx-ncard { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s, border-color .3s; }
.sx-ncard:hover { transform:translateY(-4px); border-color:var(--sx-accent); }
/* Два класса — по той же причине, что и у обложки проекта: перебиваем
   портретный 3/4 из .sxc-media. */
.sxc-media.sx-ncard-cover { aspect-ratio:16/9; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-ncard-cover img { width:100%; height:100%; object-fit:cover; }
.sx-ncard-body { padding:20px; }
/* Дата в разрядку заглавными (09.08.2026, по образцу readdy.cc): так она
   читается как рубрика-надзаголовок, а не как часть заголовка новости. */
.sx-ncard-date { font-size:var(--fs-1); color:var(--sx-mute); font-weight:700; text-transform:uppercase; letter-spacing:.1em; }
.sx-ncard h3 { font-size:var(--fs-5); font-weight:700; color:var(--sx-ink); line-height:1.35; margin-top:10px; }
/* Явное приглашение открыть статью: раньше карточка была кликабельна целиком,
   но ничем об этом не сообщала. */
.sx-ncard-more { display:inline-flex; align-items:center; gap:8px; margin-top:14px;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--sx-accent); }
.sx-ncard-more svg { transition:transform .2s; }
.sx-ncard:hover .sx-ncard-more svg { transform:translateX(4px); }

/* ── catalog portal ──────────────────────────────────── */
.sx-cp { position:relative; background:var(--sx-card); border:1px solid var(--sx-line); border-radius:var(--r-xl); padding:clamp(36px,5vw,64px); overflow:hidden; }
.sx-cp-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 65% 90% at 5% 50%, rgba(14,74,198,.42), transparent 68%),
  radial-gradient(ellipse 55% 70% at 95% 25%, rgba(20,184,224,.28), transparent 63%),
  radial-gradient(ellipse 45% 65% at 55% 85%, rgba(100,84,212,.22), transparent 58%); pointer-events:none; }
.sx-cp-ov { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size:44px 44px; -webkit-mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); pointer-events:none; }
.sx-cp-inner { position:relative; z-index:1; display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(28px,4vw,56px); align-items:center; }
.sx-cp-aurora, .sx-cp-ov { display:none; }
.sx-cp-eyebrow::before { content:""; width:16px; height:1px; background:var(--sx-line); }
.sx-cp-h2 { font-size:clamp(26px,3.4vw,42px); font-weight:800; letter-spacing:-.032em; color:var(--sx-ink); margin:14px 0 0; line-height:1.08; }
.sx-cp-sub { font-size:clamp(14px,1.3vw,16px); color:var(--sx-mute); margin:14px 0 28px; line-height:1.65; }
.sx-cp-btn { display:inline-flex; align-items:center; gap:10px; height:48px; padding:0 26px; border-radius:var(--r-pill); background:var(--sx-lime); color:var(--sx-lime-ink); font-size:var(--fs-4); font-weight:700; border:none; cursor:pointer; transition:background .2s, gap .2s; font-family:inherit; }
.sx-cp-btn:hover { background:color-mix(in srgb, var(--sx-lime) 82%, #fff); gap:14px; }
.sx-cp-tiles { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.sx-cp-tile { display:flex; align-items:center; gap:13px; padding:15px 17px; border-radius:var(--r); background:var(--sx-bg-soft); border:1px solid var(--sx-line); cursor:pointer; text-align:left; transition:background .2s,border-color .2s; }
.sx-cp-tile:hover { background:var(--sx-card); border-color:var(--sx-ink-soft); }
.sx-cp-tile-ic { width:36px; height:36px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; background:var(--sx-card); border:1px solid var(--sx-line); color:var(--sx-accent); flex-shrink:0; }
.sx-cp-tile-t { flex:1; font-size:var(--fs-3); font-weight:700; color:var(--sx-ink); line-height:1.3; }
.sx-cp-tile-arr { color:var(--sx-mute); transition:transform .2s,color .2s; flex-shrink:0; }
.sx-cp-tile:hover .sx-cp-tile-arr { transform:translate(3px,-2px); color:var(--sx-ink); }
@media(max-width:820px){ .sx-cp-inner{ grid-template-columns:1fr; } }
@media(max-width:480px){ .sx-cp-tiles{ grid-template-columns:1fr; } }

/* ── final CTA ──────────────────────────────────────── */
.sx-cta { position:relative; background:var(--sx-bg); border:1px solid var(--sx-line); border-radius:var(--r-xl); padding:clamp(48px,6vw,80px); overflow:hidden; text-align:center; }
.sx-cta-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 70% 90% at 30% 20%, rgba(14,74,198,.4),transparent 70%),
  radial-gradient(ellipse 60% 80% at 80% 90%, rgba(20,184,224,.28),transparent 65%); }
.sx-cta-inner { position:relative; z-index:1; }
.sx-cta-aurora { display:none; }
.sx-cta h2 { font-size:clamp(32px,4.4vw,56px); font-weight:800; letter-spacing:-.035em; color:var(--sx-ink); line-height:1.04; max-width:740px; margin:0 auto; }
.sx-cta p { font-size:var(--fs-5); color:var(--sx-mute); margin:18px auto 0; max-width:520px; line-height:1.6; }
.sx-cta-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:36px; }
/* One button shape for the whole page — the pill the header and hero already
   use. Before this, a section could put a lime pill next to a blue rectangle
   offering the same thing, which is what made the page read as assembled from
   parts. Primary carries the lime; everything else is a hairline. */
.sx-btn { display:inline-flex; align-items:center; gap:9px; height:48px; padding:0 26px; border-radius:var(--r-pill); font-size:var(--fs-4); font-weight:700; cursor:pointer; border:1px solid transparent; font-family:inherit; letter-spacing:-.005em; transition:background .2s, border-color .2s, color .2s, gap .2s; }
.sx-btn-primary { background:var(--sx-lime); color:var(--sx-lime-ink); }
.sx-btn-primary:hover { background:color-mix(in srgb, var(--sx-lime) 82%, #fff); gap:13px; }
.sx-btn-ghost { background:transparent; color:var(--sx-ink); border-color:var(--sx-line); }
.sx-btn-ghost:hover { background:var(--sx-bg-soft); border-color:var(--sx-ink-soft); gap:13px; }
/* On the dark panels that survive (the hero photo, the tiles) the ghost has to
   invert or it disappears into the ground. */
.sx-on-dark .sx-btn-ghost, .sx-btn-ghost.on-dark { color:#fff; border-color:rgba(255,255,255,.28); }
.sx-on-dark .sx-btn-ghost:hover, .sx-btn-ghost.on-dark:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.5); }

/* ── reviews ─────────────────────────────────────────── */
.sx-rev-head { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:40px; }
.sx-rev-head-left h2 { display:flex; align-items:center; gap:8px; cursor:pointer; }
.sx-rev-head-left h2:hover { color:var(--sx-blue); }
/* Сегментированный переключатель-пилюля (09.08.2026, по образцу readdy.cc):
   раньше вкладки подчёркивались снизу тонкой линией. Пилюля показывает,
   что это выбор одного из двух, а не две отдельные ссылки. */
.sx-rev-tabs {display:inline-flex; gap:2px; align-items:center; flex-shrink:0;
  margin-top:16px; padding:4px; background:var(--sx-bg-soft); border:1px solid var(--sx-line); border-radius:var(--r-pill)}
.sx-rev-tab { min-height:38px; padding:9px 20px; font-size:var(--fs-4); font-weight:600; color:var(--sx-mute); background:transparent; border:none; border-radius:var(--r-pill); cursor:pointer; font-family:inherit; position:relative; transition:color .18s, background .18s; white-space:nowrap; }
.sx-rev-tab.on { color:#fff; background:var(--sx-accent); }
.sx-rev-tab:not(.on):hover { color:var(--sx-ink); }
.sx-rev-tab:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
/* Карусель выровнена по остальным блокам: раньше стрелки стояли в потоке и
   вдавливали ленту карточек на 58 px внутрь, из-за чего письма не совпадали
   по левому краю ни с заголовком блока, ни с карточками соседних секций.
   Теперь стрелки вынесены из потока и висят над краями ленты. */
.sx-rev-outer { position:relative; display:block; }
.sx-rev-arr { position:absolute; top:50%; transform:translateY(-50%); z-index:2;
  flex-shrink:0; width:44px; height:44px; border-radius:50%; border:1.5px solid var(--sx-line); background:var(--sx-card); color:var(--sx-ink); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s,border-color .18s,opacity .18s; }
.sx-rev-arr:hover:not(:disabled) { background:var(--sx-bg-soft); border-color:var(--sx-blue); color:var(--sx-blue); }
.sx-rev-arr:disabled { opacity:.3; cursor:default; }
.sx-rev-arr:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-overflow { overflow:hidden; }
.sx-rev-outer > .sx-rev-arr:first-of-type { left:-22px; }
.sx-rev-outer > .sx-rev-arr:last-of-type { right:-22px; }
.sx-rev-arr { box-shadow:var(--sh-sm); }
@media(max-width:900px){
  /* На узких экранах вынос за край упирается в поля страницы — возвращаем
     стрелки внутрь ленты. */
  .sx-rev-outer > .sx-rev-arr:first-of-type { left:4px; }
  .sx-rev-outer > .sx-rev-arr:last-of-type { right:4px; }
}
.sx-rev-track { display:flex; gap:20px; transition:transform .45s cubic-bezier(.16,1,.3,1); }
.sx-rev-card { flex:0 0 calc(50% - 10px); display:flex; gap:22px; align-items:flex-start; background:var(--sx-card); border:1px solid var(--sx-line); border-radius:var(--sx-r); padding:24px 26px; }
.sx-rev-doc { flex-shrink:0; width:134px; aspect-ratio:210/297; border-radius:var(--r-sm); overflow:hidden; box-shadow:var(--sh-lg); background:#fff; cursor:pointer; transition:transform .2s,box-shadow .2s; }
.sx-rev-doc:hover { transform:translateY(-2px); box-shadow:var(--sh-sm); }
.sx-rev-doc:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-doc > img, .sx-rev-doc > svg { width:100%; height:100%; display:block; }
.sx-rev-doc > img { object-fit:cover; object-position:top; }
.sx-rev-body { flex:1; min-width:0; display:flex; flex-direction:column; }
.sx-rev-badges { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px; }
/* Серая пилюля вместо синей рамки (09.08.2026, по образцу readdy.cc): роль и
   город — это ярлык, а не действие, и синим они конкурировали с заголовком. */
.sx-rev-badge { display:inline-flex; align-items:center; gap:6px; max-width:100%; min-width:0; white-space:nowrap; overflow:hidden;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--sx-ink-soft); background:var(--sx-bg-soft); border:none; border-radius:var(--r-pill); padding:6px 12px; line-height:1.3; }
/* Обрезаем подпись, а не саму пилюлю: иначе булавка уехала бы под обрез. */
.sx-rev-badge > span { overflow:hidden; text-overflow:ellipsis; }
.sx-rev-badge svg { color:var(--sx-accent); }
.sx-rev-org { font-size:var(--fs-5); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.015em; margin:0 0 10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sx-rev-quote { font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); flex:1; margin:0; display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; }
/* Футер карточки: «Читать полностью» слева, круглая стрелка справа. Раньше у
   карточки не было явного приглашения открыть письмо — кликабельной была
   только миниатюра, и об этом никто не догадывался. */
.sx-rev-more { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:14px;
  width:100%; padding:0; background:none; border:none; cursor:pointer; font-family:inherit; text-align:left; }
.sx-rev-more:focus-visible { outline:2px solid var(--sx-accent); outline-offset:3px; border-radius:var(--r-sm); }
.sx-rev-more-t { font-size:var(--fs-3); color:var(--sx-mute); }
.sx-rev-more-arr { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:38px; height:38px;
  border-radius:50%; border:1px solid var(--sx-line); color:var(--sx-ink); background:var(--sx-card);
  transition:background .2s, border-color .2s, color .2s; }
.sx-rev-card:hover .sx-rev-more-arr { background:var(--sx-accent); border-color:var(--sx-accent); color:#fff; }
@media(max-width:820px){
  .sx-rev-card { flex:0 0 calc(100% - 10px); }
  .sx-rev-doc { width:88px; }
}
@media(max-width:500px){
  .sx-rev-doc { display:none; }
  .sx-rev-card { padding:18px; }
  .sx-rev-head { flex-direction:column; }
}
@media(prefers-reduced-motion:reduce){
  .sx-rev-track { transition:none; }
}

/* ── focus & accessibility (WCAG 2.4.7) ─────────────── */
.sx-cp-btn:focus-visible,
.sx-btn:focus-visible { outline:3px solid var(--sx-ink); outline-offset:3px; }
.sx-cp-tile:focus-visible,
.sx-dir:focus-visible,
.sx-case:focus-visible,
.sx-ncard:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; border-radius:inherit; }
.soi-search-input:focus-visible { outline:2px solid var(--sx-blue); outline-offset:0; }
@media (prefers-reduced-motion: reduce) {
  .sx-cp-btn, .sx-cp-tile, .eco-t, .eco-cta, .sx-dir, .sx-case, .sx-ncard,
  .sx-mq-item,
  .sx-btn { transition:none !important; transform:none !important; }
  .eco-live::before { animation:none !important; }
}

/* ── responsive ─────────────────────────────────────── */
@media (max-width:980px){
  .sx-bento { grid-template-columns:repeat(2,1fr); grid-template-areas:
    "catalog catalog" "reg reg" "tender service" "brands equip"; }
  .sx-dir-grid { grid-template-columns:repeat(2,1fr); }
  /* Колонки проектов и новостей на узких экранах — в блоке «сетки на три
     колонки» ниже, вместе с остальными их брейкпоинтами. */
}
@media (max-width:560px){
  .sx-bento { grid-template-columns:1fr; grid-template-areas:"catalog" "reg" "tender" "service" "brands" "equip"; }
  .sx-dir-grid { grid-template-columns:1fr; }
  .sx-cta { border-radius:var(--r-lg); }
}
    `;
    document.head.appendChild(s);
    return () => { /* keep cached */ };
  }, []);
  return null;
}

/* helper: localized */
function _lv(lang, ru, uz, en) { return lang === "uz" ? uz : lang === "en" ? en : ru; }

/* ── Ecosystem bento ────────────────────────────────────────────────────────
   Six entry points into the business, each tile carrying its own hue. Figures
   come from two places: whatever the API can prove (tender counters, brand wall,
   catalog size) is live; the rest are editable in admin → «Главная страница».
   A metric left blank in the admin renders nothing rather than a zero. */

const ECO_DEFAULTS = {
  catalog_num: SITE_FIGURES_DEFAULTS.catalog, catalog_unit: "+",
  training_num: SITE_FIGURES_DEFAULTS.trained, training_unit: "+",
  service_num: SITE_FIGURES_DEFAULTS.service, service_unit: "+",
  training_photo: "", service_photo: "",
  brands_num: SITE_FIGURES_DEFAULTS.brands, brands_unit: "+",
  // The delivery tile carries the map alone — no metrics, no CTA.
  delivery_num: SITE_FIGURES_DEFAULTS.regions, delivery_unit: "",
};

/* Live figures. One small request per source; every one of them may fail without
   taking the block down — the tiles simply fall back to their editable numbers. */
function useEcoPulse() {
  const [pulse, setPulse] = useState({ stats: null, platforms: [], cats: [], brands: [], products: null });
  useEffect(() => {
    const api = window.api;
    if (!api || !api.listPublic) return;
    let alive = true;
    const put = (patch) => { if (alive) setPulse((p) => ({ ...p, ...patch })); };
    const ok = (p, fn) => p.then(fn).catch(() => {});

    ok(api.listPublic("etender/stats"), (r) => put({ stats: r }));
    ok(api.listPublic("etender/platforms"), (r) => put({ platforms: Array.isArray(r) ? r : [] }));
    ok(api.listPublic("etender/categories"), (r) => put({ cats: Array.isArray(r) ? r : [] }));
    ok(api.listPublic("brands", { limit: 6, page: 1 }), (r) => put({ brands: (r && r.data) || (Array.isArray(r) ? r : []) }));
    ok(api.listPublic("products", { limit: 1, page: 1 }), (r) => put({ products: (r && r.total) || 0 }));
    return () => { alive = false; };
  }, []);
  return pulse;
}


/* Compact money for counters and chips: no currency suffix, because the whole
   feed is in UZS and repeating it five times is noise. */
function ecoShortSum(value, lang) {
  const v = Number(value);
  if (!isFinite(v) || v <= 0) return "\u2014";
  const cut = (n) => n.toFixed(1).replace(/\.0$/, "").replace(".", _lv(lang, ",", ",", "."));
  if (v >= 1e9) return cut(v / 1e9) + " " + _lv(lang, "\u043c\u043b\u0440\u0434", "mlrd", "bn");
  if (v >= 1e6) return Math.round(v / 1e6) + " " + _lv(lang, "\u043c\u043b\u043d", "mln", "mn");
  return Math.round(v).toLocaleString("ru-RU");
}



function ecoAgo(iso, lang) {
  if (!iso) return "";
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (!isFinite(min) || min < 0) return "";
  if (min < 1) return _lv(lang, "только что", "hozirgina", "just now");
  if (min < 60) return _lv(lang, `${min} мин назад`, `${min} daqiqa oldin`, `${min} min ago`);
  const h = Math.floor(min / 60);
  if (h < 24) return _lv(lang, `${h} ч назад`, `${h} soat oldin`, `${h} h ago`);
  const d = Math.floor(h / 24);
  return _lv(lang, `${d} дн назад`, `${d} kun oldin`, `${d} d ago`);
}

/* A figure that counts up the first time it is scrolled into view.
   The value is editor-owned text — "2 800", "120", "—" — so only its digits are
   animated and the editor's own separators are rebuilt around them. A value that
   holds no digit at all (the "—" a missing counter renders) is printed as it is,
   and so is everything when the visitor asks for reduced motion. */
function EcoCount({ value }) {
  const ref = useRef(null);
  /* What the tile last showed. A live counter refreshes while the visitor is
     looking at it, and a value that walks 54 → 55 must not fall back to zero
     and climb again — it counts on from where it stood. */
  const shownRef = useRef(0);
  const raw = value == null ? "" : String(value);
  const [out, setOut] = useState(raw);

  /* Layout effect, not a plain one: a counter waiting below the fold must be
     primed to its starting figure before the browser paints, otherwise it shows
     the final number first and visibly snaps back when it scrolls into view. */
  React.useLayoutEffect(() => {
    const el = ref.current;
    const digits = raw.replace(/\D/g, "");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !digits || reduce) { setOut(raw); return; }

    const target = parseInt(digits, 10);
    const from = shownRef.current;
    // Grouped in the source ("2 800") — keep it grouped while counting.
    const grouped = /\d[\s ]\d/.test(raw);
    const fmt = (n) => (grouped ? n.toLocaleString("ru-RU") : String(n));
    // Whatever wraps the digits — a "№", a "+" typed into the number itself.
    const [, head = "", tail = ""] = raw.match(/^(\D*)[\d\s ]*(\D*)$/) || [];

    let frame = 0;
    let done = false;
    const run = () => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1100);
        const eased = 1 - Math.pow(1 - p, 3);
        const n = Math.round(from + (target - from) * eased);
        shownRef.current = n;
        setOut(head + fmt(n) + tail);
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    setOut(head + fmt(from) + tail);
    const io = new IntersectionObserver((entries) => {
      if (!done && entries.some((e) => e.isIntersecting)) { done = true; io.disconnect(); run(); }
    }, { threshold: .35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [raw]);

  return <span ref={ref}>{out}</span>;
}

/* «29.07.2026 · 20:02» — the real moment of the last sync, always in Tashkent
   time whatever the visitor's clock says, because that is the schedule the
   client's crawler runs on and the one the claim «daily» refers to. */
function tndStamp(iso) {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return "";
  const p = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.day}.${p.month}.${p.year} · ${p.hour}:${p.minute}`;
}

/* Lot money runs to eleven digits: printed in full it would be unreadable and
   would not fit the row, so it is cut to billions/millions with one decimal. */
function tndMoney(sum, lang) {
  const n = Number(sum) || 0;
  if (n < 1e6) return "";
  const cur = _lv(lang, "сум", "so'm", "UZS");
  if (n >= 1e9) return `${(n / 1e9).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} ${_lv(lang, "млрд", "mlrd", "bn")} ${cur}`;
  return `${Math.round(n / 1e6).toLocaleString("ru-RU")} ${_lv(lang, "млн", "mln", "m")} ${cur}`;
}

function EcoMetrics({ items, className }) {
  const shown = items.filter((m) => m.v !== "" && m.v != null);
  if (!shown.length) return null;
  return (
    <div className={"eco-metrics" + (className ? " " + className : "")}>
      {shown.map((m, i) => (
        <div className="eco-m" key={i}>
          <div className="eco-m-v">{m.v}</div>
          <div className="eco-m-l">{m.l}</div>
        </div>
      ))}
    </div>
  );
}

/* Uzbekistan outline. Border ring is Natural Earth (public domain), reprojected
   to this viewBox with a cos(lat) correction so the country keeps its true
   proportions rather than being stretched by a raw lon/lat plot.
   Nodes are the 14 delivery regions at their real coordinates; Tashkent (index
   10) is the hub every route runs from. */
const ECO_MAP_PATH = "M185.5 191.9 L186 177.7 L162.7 167.7 L144.4 156.2 L132.9 145.3 L112.9 129.1 L104.3 105.1 L98.4 100.8 L79.5 101.9 L72.8 97.1 L70.9 78.5 L47.3 66.2 L32.5 79.7 L17.6 87.8 L20.5 99.5 L0.7 99.9 L0 13.8 L45.1 0 L48.4 2 L75.5 18.7 L89.9 27.6 L106.6 48.6 L127.1 45.2 L157.2 43.4 L178.1 60.4 L176.8 83.8 L185.4 84 L188.9 103.1 L211.2 103.9 L216 114.9 L222.5 114.8 L230.2 98.1 L253.3 81.8 L263.3 77.5 L268.5 79.8 L253.8 94.9 L266.8 103.7 L279.2 97.9 L300 110.2 L277.6 127 L264.2 124.7 L257 125.3 L254.5 118.8 L258.2 108 L234.7 113.4 L229.2 128.4 L220.8 141.3 L206.2 140.2 L201.7 150.5 L214.5 156 L218.3 173.4 L208.5 197 L195.3 192.1 Z";
const ECO_MAP_NODES = [
  [64.5, 73], [82.3, 94.2], [77.6, 98.2], [148.7, 135.8], [165.6, 128.5],
  [172.7, 157], [198.8, 195.3], [193.2, 138.6], [208.6, 127.6], [225.1, 119],
  [233.2, 99.8], [275.7, 107.3], [287.5, 112.2], [277.7, 121.3],
];
const ECO_HUB = 10;

function EcoUzMap({ lang }) {
  const hub = ECO_MAP_NODES[ECO_HUB];
  return (
    <svg className="eco-map" viewBox="-4 -4 308 205" role="img" focusable="false">
      <title>
        {_lv(lang, "Карта Узбекистана: 14 регионов доставки", "O'zbekiston xaritasi: 14 ta yetkazish hududi", "Map of Uzbekistan: 14 delivery regions")}
      </title>
      <path className="eco-map-land" d={ECO_MAP_PATH} />
      {ECO_MAP_NODES.map((n, i) => {
        if (i === ECO_HUB) return null;
        const d = `M${hub[0]} ${hub[1]} Q ${(hub[0] + n[0]) / 2} ${(hub[1] + n[1]) / 2 - 14} ${n[0]} ${n[1]}`;
        // Staggered so the routes fire in turn instead of pulsing in unison.
        const delay = `${(i * 0.24).toFixed(2)}s`;
        return (
          <g key={"r" + i}>
            <path className="eco-map-route" d={d} />
            <path className="eco-map-flow" d={d} pathLength="1" style={{ animationDelay: delay }} />
          </g>
        );
      })}
      <circle className="eco-map-ping" cx={hub[0]} cy={hub[1]} r="4.4" />
      {ECO_MAP_NODES.map((n, i) => (i === ECO_HUB ? null : (
        <circle key={"n" + i} className="eco-map-dot" cx={n[0]} cy={n[1]} r="2.6"
          style={{ animationDelay: `${(i * 0.24).toFixed(2)}s` }} />
      )))}
      <circle className="eco-map-hub" cx={hub[0]} cy={hub[1]} r="4.4" />
    </svg>
  );
}

/* Поочерёдная подсветка строк в списках плитки мониторинга: активна одна
   строка, остальные приглушены, фокус идёт по кругу (решение заказчика
   08.08.2026 — дать дашборду динамику).

   Возвращает индекс активной строки. Списки получают каждый свой вызов с
   разным интервалом, поэтому крутятся независимо и не мигают в такт.

   При prefers-reduced-motion таймер не заводится вовсе и возвращается -1 —
   тогда ни одна строка не выделена и все читаются в полную силу. Это не
   украшение, которое можно просто «замедлить»: бесконечное движение на
   странице мешает людям с вестибулярными расстройствами и тем, кому трудно
   удерживать внимание. */
function useRowCycle(count, ms) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!count) return;
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms]);
  if (!count) return -1;
  const mq = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq && mq.matches) return -1;
  return i % count;
}

function SoiEcosystem({ lang, go }) {
  const eco = useHomeSetting("homepage_ecosystem", ECO_DEFAULTS);
  const pulse = useEcoPulse();
  /* A key the editor has saved wins even when it is empty — clearing a metric in
     the admin is how you hide it. Only a key that was never configured at all
     falls back to the default, so a fresh install still shows a full block. */
  const val = (f) => (eco && Object.prototype.hasOwnProperty.call(eco, f) ? eco[f] : ECO_DEFAULTS[f]);

  const st = pulse.stats;

  /* Platforms arrive already grouped, named and described by the API — the four
     the client monitors, in their order. A connected platform with no open lots
     (Farma today) still belongs on the list. */
  const srcs = pulse.platforms;

  /* Five categories, per the agreed shape of the business: what SOI supplies,
     and one bucket for everything it does not. Drugs land in that bucket by
     decision, not by accident — they are the feed's biggest line by money. */
  const TND_CATS = [
    // "diagnostics" and "physio" are declared in the icon set but draw nothing —
    // they render an empty <svg>. Use one that actually has a path.
    { id: "equipment", icon: "wave", ru: "Медицинское оборудование", uz: "Tibbiy uskunalar", en: "Medical equipment" },
    { id: "furniture", icon: "bed", ru: "Медицинская мебель", uz: "Tibbiy mebel", en: "Medical furniture" },
    { id: "instruments", icon: "scalpel", ru: "Медицинские инструменты", uz: "Tibbiy asboblar", en: "Medical instruments" },
    { id: "consumables", icon: "box", ru: "Расходные материалы", uz: "Sarf materiallari", en: "Consumables" },
    { id: "other", icon: "doc", ru: "Прочее", uz: "Boshqa", en: "Other" },
  ];
  const tndCats = (() => {
    const by = new Map(pulse.cats.map((c) => [c.category, c]));
    const own = TND_CATS.slice(0, 4).map((c) => ({
      ...c, label: _lv(lang, c.ru, c.uz, c.en),
      count: (by.get(c.id) || {}).count || 0,
      sum: (by.get(c.id) || {}).sum || 0,
    }));
    // Everything outside the four — drugs included — collapses into one line.
    // Its id is the whole set, so opening it lands on the same filter the
    // tenders page builds for «Прочее» instead of a narrower one.
    const ownIds = new Set(own.map((c) => c.id));
    const rest = pulse.cats.filter((c) => !ownIds.has(c.category));
    const other = TND_CATS[4];
    return [...own, {
      ...other,
      id: rest.map((c) => c.category).join(",") || other.id,
      label: _lv(lang, other.ru, other.uz, other.en),
      count: rest.reduce((a, c) => a + (c.count || 0), 0),
      sum: rest.reduce((a, c) => a + (c.sum || 0), 0),
    }];
  })();
  /* The live counters are only shown once they stop contradicting the headline
     claim — an empty catalog reporting «6» beside «2 800+» reads as a bug. */
  const liveProducts = pulse.products != null && pulse.products >= 100 ? pulse.products : null;
  const brandWall = pulse.brands.filter((b) => b && b.name).slice(0, 5);
  const showWall = brandWall.length >= 3;

  /* Интервалы намеренно разные и не кратные друг другу: на общих 2500 мс оба
     списка переключались бы синхронно и плитка мигала бы целиком. */
  const catLit = useRowCycle(tndCats.length, 2400);
  const srcLit = useRowCycle(srcs.length, 3100);


  return (
    <section className="sx-section eco-section">
      <div className="sx-wrap">
        <div className="eco-grid">

          {/* ── catalog ── */}
          <article className="eco-t catalog sx-rv">
            <div className="eco-head">
              <div className="eco-ic"><Icon name="grid" size={22} /></div>
              {liveProducts && (
                <div className="eco-badge">
                  <b>{liveProducts.toLocaleString("ru-RU")}</b>
                  {_lv(lang, "товаров", "mahsulot", "items")}
                </div>
              )}
            </div>
            <div className="eco-num"><EcoCount value={val("catalog_num")} /><span>{val("catalog_unit")}</span></div>
            <h3>{_lv(lang, "Электронный каталог оборудования", "Elektron uskunalar katalogi", "Electronic equipment catalog")}</h3>
            <p>{_lv(lang,
              "Медтехника, мебель, инструменты и расходные материалы от ведущих мировых производителей.",
              "Tibbiy texnika, mebel, asboblar va sarf materiallari — yetakchi jahon ishlab chiqaruvchilaridan.",
              "Equipment, furniture, instruments and consumables from leading global manufacturers.")}</p>
            <div className="eco-foot">
              <button className="eco-cta solid" onClick={() => go("catalog")}>
                {_lv(lang, "Перейти в каталог", "Katalogga o'tish", "Open the catalog")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── training ── */}
          <article className="eco-t training sx-rv">
            {val("training_photo") ? <div className="eco-photo" style={{ backgroundImage: `url(${val("training_photo")})` }} /> : null}
            <div className="eco-head"><div className="eco-ic"><Icon name="user" size={22} /></div></div>
            <div className="eco-num"><EcoCount value={val("training_num")} /><span>{val("training_unit")}</span></div>
            <h3>{_lv(lang, "Обученных специалистов", "O'qitilgan mutaxassislar", "Trained specialists")}</h3>
            <p>{_lv(lang,
              "Обучаем персонал клиник работе с поставленным оборудованием — очно и онлайн.",
              "Klinika xodimlarini yetkazib berilgan uskunalar bilan ishlashga o'rgatamiz — joyida va onlayn.",
              "We train clinic staff to operate the delivered equipment — on-site and online.")}</p>
            <div className="eco-foot">
              <button className="eco-cta" onClick={() => go("staffTraining")}>
                {_lv(lang, "Обучение персонала", "Xodimlarni o'qitish", "Staff training")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── tenders: the one fully live tile ── */}
          <article className="eco-t tender sx-rv">
            <div className="tnd-top">
              <div className="eco-ic"><Icon name="pulse" size={22} /></div>
              <div className="tnd-titles">
                {/* The eyebrow is the heading now — the tile used to carry both a
                    caption and a title that said the same thing twice. */}
                <h3 className="tnd-eyebrow">
                  {_lv(lang,
                    "Мониторинг государственных и корпоративных закупок",
                    "Davlat va korporativ xaridlar monitoringi",
                    "Public & corporate procurement monitoring")}
                </h3>
              </div>
              {st && st.lastSyncAt && (
                /* The exact stamp of the last sync, in Tashkent time, instead of
                   a vague «updated 2 days ago»: a panel that claims daily
                   monitoring has to be checkable. */
                <div className="eco-live" title={_lv(lang, "Время последней синхронизации", "Oxirgi sinxronizatsiya vaqti", "Last sync time")}>
                  {_lv(lang, "Обновлено", "Yangilandi", "Updated")} {tndStamp(st.lastSyncAt)}
                </div>
              )}
            </div>

            {/* Две величины в карточках: сколько закупок идёт сейчас и на
                скольких площадках мы смотрим. «Новых за неделю» и «закрываются
                за неделю» сняты по решению заказчика 08.08.2026. */}
            <div className="tnd-kpis">
              <div className="tnd-kpi lead">
                {/* Цифра и подпись стоят в строку (решение заказчика
                    08.08.2026). Обёртка нужна, чтобы flex собрал именно эту
                    пару: ниже в карточке лежат ещё категории, и без неё они
                    встали бы третьей колонкой той же строки. */}
                <div className="tnd-kpi-head">
                  <div className="tnd-kpi-v"><EcoCount value={st ? st.active : "—"} /></div>
                  <div className="tnd-kpi-l">{_lv(lang, "активных закупок", "faol xarid", "active lots")}</div>
                  {/* Заголовок списка поднят в строку с цифрой (решение
                      заказчика 08.08.2026): отдельной строкой он съедал высоту,
                      а в правой карточке такого заголовка нет вовсе — карточки
                      не совпадали по ритму. */}
                  <div className="tnd-sec-h">
                    {_lv(lang, "Категории закупок", "Xarid kategoriyalari", "Procurement categories")}
                  </div>
                </div>

                {/* Категории лежат внутри этой же карточки (решение заказчика
                    08.08.2026): они раскладывают на части ровно то число,
                    что стоит над ними, — сумма по категориям и есть «активные
                    закупки». Отдельной карточкой рядом связь не читалась.

                    Обычный блок, а не <details>: список показан всегда, и
                    сворачивать его нечем — управление снято по решению
                    заказчика. */}
                <div className="tnd-sec">
                  {tndCats.map((c, i) => (
                    <button
                      className={"tnd-row cat" + (c.count ? "" : " zero") + (i === catLit ? " is-lit" : "")}
                      key={c.id}
                      /* One accent, five weights of it: five different hues inside a
                         violet tile is exactly the acid the brief rules out. */
                      style={{ "--bar": (1 - i * 0.15).toFixed(2) }}
                      onClick={() => go("tenders", { cat: c.id })}
                      title={_lv(lang, "Открыть тендеры: ", "Tenderlarni ochish: ", "Open tenders: ") + c.label}
                    >
                      <span className="tnd-bar" />
                      <span className="tnd-row-n">{c.label}</span>
                      <span className="tnd-row-sum">{tndMoney(c.sum, lang)}</span>
                      <span className="tnd-row-v">{c.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Площадки: цифра и под ней список. Раньше под цифрой стояла
                  ещё и свёрнутая строка «Площадки мониторинга 4» — то же число
                  во второй раз. Сворачивание снято по решению заказчика,
                  список показан всегда.

                  Число берётся из длины списка, а не из статистики: сервер
                  считает ленты (Etender публикует две), а панель — площадки. */}
              <div className="tnd-kpi tnd-kpi-src">
                <div className="tnd-kpi-head">
                  <div className="tnd-kpi-v"><EcoCount value={srcs.length || "—"} /></div>
                  <div className="tnd-kpi-l">
                    {_lv(lang, "площадок мониторинга", "kuzatilayotgan maydoncha", "platforms watched")}
                  </div>
                </div>
                <div className="tnd-kpi-list">
                  {srcs.map((s, si) => (
                    <a
                      className={"tnd-row" + (s.count ? "" : " zero") + (si === srcLit ? " is-lit" : "")}
                      key={s.id}
                      href={s.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={(s.description ? _lv(lang, s.description.ru, s.description.uz, s.description.en) + " · " : "") + s.site}
                    >
                      <span className={"tnd-dot" + (s.count ? "" : " off")} />
                      <span className="tnd-row-n">{s.name}</span>
                      <span className="tnd-row-v">{s.count || "—"}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            <div className="eco-foot" style={{ paddingTop: 12 }}>
              <button className="eco-cta solid" onClick={() => go("tenders")}>
                {_lv(lang, "Все тендеры", "Barcha tenderlar", "All tenders")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── brands ── */}
          <article className="eco-t brands sx-rv">
            <div className="eco-head"><div className="eco-ic"><Icon name="award" size={22} /></div></div>
            <div className="eco-num"><EcoCount value={val("brands_num")} /><span>{val("brands_unit")}</span></div>
            <h3>{_lv(lang, "Мировые бренды", "Jahon brendlari", "Global brands")}</h3>
            <p>{_lv(lang, "Официальные поставки от производителей из 12 стран.", "12 mamlakat ishlab chiqaruvchilaridan rasmiy yetkazib berish.", "Official supply from manufacturers across 12 countries.")}</p>
            {showWall && (
              <div className="eco-brands">
                {brandWall.map((b) => (
                  <span className="eco-brand" key={b.id || b.name}>
                    {/* A logo that fails to load shows the brand name, not a broken-image glyph. */}
                    {b.logoUrl
                      ? <img src={b.logoUrl} alt={b.name} loading="lazy"
                             onError={(e) => { e.currentTarget.replaceWith(document.createTextNode(b.name)); }} />
                      : b.name}
                  </span>
                ))}
              </div>
            )}
            <div className="eco-foot">
              <button className="eco-cta" onClick={() => go("partners")}>
                {_lv(lang, "Все бренды", "Barcha brendlar", "All brands")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── service ── */}
          <article className="eco-t service sx-rv">
            {val("service_photo") ? <div className="eco-photo" style={{ backgroundImage: `url(${val("service_photo")})` }} /> : null}
            <div className="eco-head"><div className="eco-ic"><Icon name="wrench" size={22} /></div></div>
            <div className="eco-num"><EcoCount value={val("service_num")} /><span>{val("service_unit")}</span></div>
            <h3>{_lv(lang, "Успешно выполненных сервисных работ", "Muvaffaqiyatli bajarilgan servis ishlari", "Completed service jobs")}</h3>
            <p>{_lv(lang, "Пусконаладка, плановое обслуживание и ремонт оборудования по всей стране.", "Ishga tushirish, rejali xizmat va ta'mirlash butun mamlakat bo'ylab.", "Commissioning, maintenance and repair across the country.")}</p>
            <div className="eco-foot">
              <button className="eco-cta" onClick={() => go("serviceSupport")}>
                {_lv(lang, "Сервис и поддержка", "Servis va qo'llab-quvvatlash", "Service & support")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── delivery ── */}
          <article className="eco-t delivery sx-rv">
            <div className="eco-head"><div className="eco-ic"><Icon name="pin" size={22} /></div></div>
            <div className="eco-num"><EcoCount value={val("delivery_num")} /><span>{val("delivery_unit")}</span></div>
            <h3>{_lv(lang, "Доставка по всей стране", "Butun mamlakat bo'ylab yetkazish", "Nationwide delivery")}</h3>
            <p>{_lv(lang, "Поставка, логистика и сопровождение в 14 регионах Узбекистана.", "14 hududda yetkazib berish, logistika va qo'llab-quvvatlash.", "Delivery, logistics and support across 14 regions of Uzbekistan.")}</p>
            <EcoUzMap lang={lang} />
          </article>

        </div>
      </div>
    </section>
  );
}

/* ── «Экспертиза / Наши услуги» — ported from CLAUDE HP ServicesSection ── */
const EXPERTISE_ITEMS = [
  {
    nav: "registration",
    t: { ru: "Регистрация медицинских изделий", uz: "Tibbiy buyumlarni ro'yxatdan o'tkazish", en: "Medical device registration" },
    d: { ru: "Досье, экспертиза и взаимодействие с регулятором — выводим изделие на рынок под ключ.", uz: "Hujjatlar, ekspertiza va regulyator bilan ishlash — buyumni bozorga kalit topshirish sharti bilan chiqaramiz.", en: "Dossier, expert review and regulator liaison — we bring your device to market turnkey." },
    proof: { ru: "Сопровождение в соответствии с ПКМ №738", uz: "PKM №738 talablariga muvofiq hamrohlik", en: "Handled per Resolution No. 738" },
    list: {
      ru: ["Анализ изделия и документов", "Подготовка регистрационного досье", "Испытания и получение РУ"],
      uz: ["Buyum va hujjatlarni tahlil qilish", "Ro'yxatga olish dosyesini tayyorlash", "Sinovlar va RU olish"],
      en: ["Device and document review", "Preparing the registration dossier", "Testing and obtaining the certificate"],
    },
  },
  {
    nav: "tenders",
    t: { ru: "Тендеры и государственные закупки", uz: "Tenderlar va davlat xaridlari", en: "Tenders and public procurement" },
    d: { ru: "Готовим документацию и сопровождаем закупку на всех этапах — от лота до поставки.", uz: "Hujjatlarni tayyorlaymiz va xaridni barcha bosqichlarda kuzatib boramiz — lotdan yetkazib berishgacha.", en: "We prepare documentation and support the procurement at every stage — from lot to delivery." },
    proof: { ru: "От технического задания до договора", uz: "Texnik topshiriqdan shartnomagacha", en: "From technical brief to signed contract" },
    list: {
      ru: ["Проверка требований закупки", "Подготовка технической части", "Сопровождение подачи заявки"],
      uz: ["Xarid talablarini tekshirish", "Texnik qismni tayyorlash", "Ariza topshirishga hamrohlik"],
      en: ["Reviewing procurement requirements", "Preparing the technical section", "Supporting the bid submission"],
    },
  },
  {
    /* Раньше обе карточки, обучение и сервис, вели на общий раздел услуг. */
    nav: "staffTraining",
    t: { ru: "Обучение персонала", uz: "Xodimlarni o'qitish", en: "Staff training" },
    d: { ru: "Обучаем персонал работе с оборудованием — очно, на вашей площадке или онлайн.", uz: "Xodimlarni uskunalar bilan ishlashga o'qitamiz — joyingizda yoki onlayn.", en: "We train your staff to operate the equipment — on-site at your facility or online." },
    proof: { ru: "Индивидуальная программа под ваше оборудование", uz: "Sizning uskunangizga moslashtirilgan dastur", en: "A program tailored to your equipment" },
    list: {
      ru: ["Разработка программы обучения", "Практические занятия на оборудовании", "Аттестация персонала"],
      uz: ["O'quv dasturini ishlab chiqish", "Uskunada amaliy mashg'ulotlar", "Xodimlarni attestatsiyadan o'tkazish"],
      en: ["Designing the training program", "Hands-on sessions on the equipment", "Staff certification"],
    },
  },
  {
    nav: "serviceSupport",
    t: { ru: "Сервисное обслуживание", uz: "Servis xizmati", en: "Maintenance service" },
    d: { ru: "Пусконаладка, гарантийный и постгарантийный сервис с выездом в регионы.", uz: "Ishga tushirish, kafolatli va kafolatdan keyingi servis, viloyatlarga chiqish bilan.", en: "Commissioning, warranty and post-warranty service with visits across the regions." },
    proof: { ru: "Гарантийная и постгарантийная поддержка", uz: "Kafolatli va kafolatdan keyingi qo'llab-quvvatlash", en: "Warranty and post-warranty support" },
    list: {
      ru: ["Пусконаладочные работы", "Плановое сервисное обслуживание", "Выезд инженера по заявке"],
      uz: ["Ishga tushirish ishlari", "Rejali servis xizmati", "So'rov bo'yicha muhandis chiqishi"],
      en: ["Commissioning works", "Scheduled maintenance service", "On-request engineer visits"],
    },
  },
];

function SoiExpertise({ lang, go }) {
  useEffect(() => {
    const id = "soi-expertise-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
/* Services used to be a dark-green slab with a lime glow — one of four dark
   panels the light page kept running into. It is now the same accordion of
   cards on the page's own canvas: white cards, hairline borders, and a single
   lime card carrying the featured service. */
.sxp { position:relative; overflow:hidden; background:var(--sx-bg); padding:clamp(64px,8vw,112px) 0; }
.sxp-glow { display:none; }
.sxp-inner { position:relative; max-width:var(--maxw); margin:0 auto; padding:0 32px; }

.sxp-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
@media(min-width:1024px){ .sxp-head { grid-template-columns:1.15fr .85fr; align-items:end; gap:64px; } }
.sxp-kicker { margin:0 0 16px; font-size:var(--fs-1); font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:var(--sx-mute); }
.sxp-h2 { margin:0; font-size:clamp(34px,5vw,60px); font-weight:800; line-height:.95;
  letter-spacing:-.035em; color:var(--sx-ink); }
.sxp-sub { margin:0; max-width:28rem; font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); }

.sxp-grid { display:grid; gap:14px; }
@media(min-width:640px){ .sxp-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxp-grid { display:flex; flex-wrap:nowrap; align-items:stretch; } }

.sxp-card { position:relative; display:flex; flex-direction:column; overflow:hidden; text-align:left;
  min-height:460px; padding:28px; border-radius:var(--sx-r); cursor:pointer; font-family:inherit;
  border:1px solid var(--sx-line); background:var(--sx-card); color:var(--sx-ink);
  transition:flex-grow .5s ease, background .35s, border-color .35s, transform .35s; }
@media(min-width:1024px){ .sxp-card { flex:1 1 0; } .sxp-card:hover { flex-grow:1.35; } }
.sxp-card:hover { border-color:var(--sx-ink-soft); background:var(--sx-card); }
.sxp-card.feat { background:var(--sx-lime); border-color:transparent; color:var(--sx-lime-ink); }
.sxp-card.feat:hover { background:color-mix(in srgb, var(--sx-lime) 88%, #fff); }
.sxp-card:focus-visible { outline:2px solid var(--sx-ink); outline-offset:3px; }

.sxp-bignum { position:absolute; right:12px; bottom:-48px; font-size:9rem; font-weight:800; line-height:1;
  user-select:none; pointer-events:none; color:rgba(16,21,18,.04); }
.sxp-card.feat .sxp-bignum { color:rgba(255,255,255,.14); }

.sxp-top { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.sxp-no { font-size:var(--fs-2); font-weight:700; color:var(--sx-mute); }
.sxp-card.feat .sxp-no { color:rgba(255,255,255,.72); }
.sxp-arrow { display:flex; align-items:center; justify-content:center; width:44px; height:44px; flex-shrink:0;
  border-radius:50%; border:1px solid var(--sx-line); font-size:var(--fs-6); color:var(--sx-ink);
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
.sxp-card:hover .sxp-arrow { transform:rotate(45deg); background:var(--sx-lime); border-color:var(--sx-lime); color:var(--sx-lime-ink); }
.sxp-card.feat .sxp-arrow { border-color:rgba(255,255,255,.35); color:var(--sx-lime-ink); }
.sxp-card.feat:hover .sxp-arrow { background:transparent; }

.sxp-t { position:relative; z-index:1; margin:40px 0 0; max-width:16rem; font-size:var(--fs-7); font-weight:700;
  line-height:1.2; letter-spacing:-.02em; }
.sxp-d { position:relative; z-index:1; margin:12px 0 0; max-width:20rem; font-size:var(--fs-4); line-height:1.6;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-d { color:rgba(255,255,255,.82); }

/* grid-rows 0fr→1fr: высота подстраивается ровно под контент */
.sxp-expand { position:relative; z-index:1; display:grid; grid-template-rows:0fr;
  transition:grid-template-rows .4s ease; }
.sxp-card:hover .sxp-expand, .sxp-card:focus-visible .sxp-expand { grid-template-rows:1fr; }
.sxp-expand-outer { overflow:hidden; }
.sxp-expand-in { padding-top:16px; opacity:0; transition:opacity .3s ease .1s; }
.sxp-card:hover .sxp-expand-in, .sxp-card:focus-visible .sxp-expand-in { opacity:1; }
.sxp-comp { margin:0; font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.08em;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-comp { color:rgba(255,255,255,.68); }
.sxp-proof { margin:4px 0 0; font-size:var(--fs-3); font-weight:500; color:var(--sx-ink); }
.sxp-card.feat .sxp-proof { color:var(--sx-lime-ink); }
.sxp-list { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:6px; }
.sxp-list li { display:flex; align-items:flex-start; gap:8px; font-size:var(--fs-2); line-height:1.4;
  color:var(--sx-mute); }
.sxp-card.feat .sxp-list li { color:rgba(255,255,255,.82); }
.sxp-dot { flex-shrink:0; width:6px; height:6px; margin-top:5px; border-radius:50%; background:var(--sx-accent); }
.sxp-card.feat .sxp-dot { background:var(--sx-lime-ink); }

.sxp-more {position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between;
  gap:8px; margin-top:auto; padding-top:16px;
  font-size:var(--fs-1); font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--sx-ink)}
.sxp-card.feat .sxp-more {border-top-color:rgba(255,255,255,.24); color:var(--sx-lime-ink)}
.sxp-more-arr { font-size:var(--fs-5); transition:transform .3s; }
.sxp-card:hover .sxp-more-arr { transform:translateX(4px); }

@media (prefers-reduced-motion: reduce){
  .sxp-card, .sxp-arrow, .sxp-expand, .sxp-expand-in, .sxp-more-arr { transition:none; }
}
    `;
    document.head.appendChild(s);
  }, []);

  const L = (o) => (o && (o[lang] || o.ru)) || "";

  return (
    <section className="sxp">
      <div className="sxp-glow" />
      <div className="sxp-inner">
        <div className="sxp-head sx-rv">
          <div>
            <p className="sxp-kicker">{_lv(lang, "Экспертиза", "Ekspertiza", "Expertise")}</p>
            <h2 className="sxp-h2">{_lv(lang, "Компетенции полного цикла работы", "Toʻliq siklli kompetensiyalar", "Full-lifecycle capabilities")}</h2>
          </div>
          <p className="sxp-sub">{_lv(lang,
            "Закрываем регуляторные, закупочные, технические и сервисные задачи в едином контуре ответственности.",
            "Tartibga solish, xarid, texnik va servis vazifalarini yagona javobgarlik konturi doirasida hal qilamiz.",
            "We cover regulatory, procurement, technical and service tasks within a single line of accountability.")}</p>
        </div>

        <div className="sxp-grid">
          {EXPERTISE_ITEMS.map((it, i) => {
            const no = String(i + 1).padStart(2, "0");
            return (
              /* Ссылка, а не div с role="button": карточка ведёт на страницу
                 услуги, и подменять её кнопкой значит терять средний клик,
                 Cmd-клик и место в поисковом индексе. Адрес строится из той же
                 карты, что и роутер (window.corpViewToPath). */
              <a
                key={i}
                className={"sxp-card sx-rv" + (i === 0 ? " feat" : "")}
                style={{ "--i": i }}
                href={(window.corpViewToPath && window.corpViewToPath(it.nav)) || "/" + it.nav}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  go(it.nav);
                }}
              >
                <span className="sxp-bignum" aria-hidden>{no}</span>
                <div className="sxp-top">
                  <span className="sxp-no">{no}</span>
                  <span className="sxp-arrow" aria-hidden>↗</span>
                </div>
                <h3 className="sxp-t">{L(it.t)}</h3>
                <p className="sxp-d">{L(it.d)}</p>
                <div className="sxp-expand">
                  <div className="sxp-expand-outer">
                    <div className="sxp-expand-in">
                      <p className="sxp-comp">{_lv(lang, "Компетенция", "Kompetensiya", "Competence")}</p>
                      <p className="sxp-proof">{L(it.proof)}</p>
                      <ul className="sxp-list">
                        {L(it.list).map((d, di) => (
                          <li key={di}><span className="sxp-dot" aria-hidden />{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="sxp-more">
                  {_lv(lang, "Подробнее", "Batafsil", "Read more")}
                  <span className="sxp-more-arr" aria-hidden>→</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── «Электронный каталог» — светлая секция с фото-карточками, ported from CLAUDE HP CatalogSection ── */
const CATALOG_CARDS = [
  { slug: "equipment",   catKey: "equipment",   t: { ru: "Медицинское оборудование", uz: "Tibbiy uskunalar", en: "Medical equipment" } },
  { slug: "furniture",   catKey: "furniture",   t: { ru: "Медицинская мебель", uz: "Tibbiy mebel", en: "Medical furniture" } },
  { slug: "instruments", catKey: "instruments", t: { ru: "Медицинские инструменты", uz: "Tibbiy asboblar", en: "Medical instruments" } },
  { slug: "consumables", catKey: "consumables", t: { ru: "Расходные материалы", uz: "Sarflanadigan materiallar", en: "Consumables" } },
];

function SoiCatalogCards({ lang, go }) {
  const cats = (window.DATA && window.DATA.CATEGORIES) || [];

  useEffect(() => {
    const id = "soi-catcards-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
.sxc { background:var(--sx-bg); padding:clamp(64px,8vw,112px) 0; }
[data-theme="dark"] .sxc { background:var(--sx-bg-soft); }
.sxc-inner { max-width:var(--maxw); margin:0 auto; padding:0 32px; }

.sxc-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
/* Колонки шапки выровнены по верху, а правая опущена на высоту надзаголовка —
   так описание встаёт вровень с первой строкой заголовка, а не с надзаголовком
   и не с нижним краем блока. */
@media(min-width:1024px){
  .sxc-head { grid-template-columns:1.3fr .7fr; align-items:start; gap:64px; }
  .sxc-head > *:last-child { padding-top:calc(var(--fs-2) * 1.5 + 16px); }
}
.sxc-kicker { margin:0 0 16px; font-size:var(--fs-2); font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:var(--sx-mute); }
.sxc-h2 { margin:0; font-size:clamp(30px,4.2vw,48px); font-weight:800; line-height:1.02;
  letter-spacing:-.035em; color:var(--sx-ink); }
[data-theme="dark"] .sxc-h2 { color:var(--sx-ink); }
/* Заголовки секций, ведущие на свою страницу. Подсветка по наведению без
   подчёркивания — на крупном кегле оно смотрелось грубо. */
.sx-h2-link { cursor:pointer; transition:color .15s ease; }
.sx-h2-link:hover { color:var(--blue-600); }
.sxc-sub { margin:0 0 24px; font-size:var(--fs-4); line-height:1.65; color:var(--sx-mute); }
[data-theme="dark"] .sxc-sub { color:var(--sx-mute); }

.sxc-grid { display:grid; gap:20px; grid-template-columns:1fr; }
@media(min-width:640px){ .sxc-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxc-grid { grid-template-columns:repeat(4,1fr); } }

/* ── сетки на три колонки: проекты и новости ──────────────────────────────
   Каталог идёт по четыре в ряд, проекты и новости — по три (как в readdy.cc).
   Селекторы двухклассовые и стоят сразу после брейкпоинтов .sxc-grid: только
   так они перебивают его четыре колонки — при равной специфичности решает
   порядок, а одноклассовый .sx-cases/.sx-news из прежней версии проигрывал
   вовсе. Порядок mobile-first: одна колонка, с 640 — две, с 1024 — три. */
.sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:1fr; }
@media(min-width:640px){ .sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxc-grid.sx-cases, .sxc-grid.sx-news { grid-template-columns:repeat(3,1fr); } }

/* Карточка — <a>, поэтому гасим наследие ссылки: подчёркивание и синий цвет
   текста. Цвет заголовка задаёт .sxc-t, но color:inherit нужен, чтобы номер
   и стрелка не позеленели от пользовательских стилей ссылок. */
.sxc-card { overflow:hidden; border-radius:var(--sx-r); border:1px solid var(--sx-line); background:var(--sx-card);
  cursor:pointer; text-align:left; padding:0; font-family:inherit; display:flex; flex-direction:column;
  text-decoration:none; color:inherit;
  transition:box-shadow .3s, border-color .3s; }
.sxc-card:hover { text-decoration:none; }
[data-theme="dark"] .sxc-card { background:var(--sx-card); border-color:var(--sx-line); }
.sxc-card:hover { border-color:var(--sx-ink-soft); }
.sxc-card:focus-visible { outline:2px solid var(--sx-ink); outline-offset:3px; }
.sxc-media { aspect-ratio:3/4; overflow:hidden; }
.sxc-media img { display:block; width:100%; height:100%; object-fit:cover;
  transition:transform .5s cubic-bezier(.16,1,.3,1); }
.sxc-card:hover .sxc-media img { transform:scale(1.06); }

.sxc-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px; }
.sxc-no { font-size:var(--fs-2); font-weight:700; color:var(--sx-mute); }
.sxc-t { margin:4px 0 0; font-size:var(--fs-6); font-weight:700; line-height:1.3; color:var(--sx-ink); }
[data-theme="dark"] .sxc-t { color:var(--sx-ink); }
.sxc-arr { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:44px; height:44px;
  border-radius:50%; border:1px solid var(--sx-line); color:var(--sx-ink);
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
/* Наведение на карточку: круг заливается фирменным синим, стрелка белеет.
   Поворот на 45° убран — стрелка ведёт в раздел, то есть вправо, а повёрнутая
   указывала по диагонали «наружу», как ссылка на другой сайт. */
.sxc-card:hover .sxc-arr,
.sxc-card:focus-visible .sxc-arr { background:var(--sx-accent); border-color:var(--sx-accent); color:#fff; }

/* ── Каталог: подпись на фото (модификатор .ov) ─────────────────────────
   Решение 09.08.2026, по образцу readdy.cc: номер, заголовок и стрелка легли
   прямо на снимок поверх тёмного градиента, вместо белой плашки под ним.

   Всё через модификатор, а НЕ правкой базовых .sxc-card/.sxc-media: те же
   два класса носят карточки «Реализованных проектов» (.sx-case) и «Новостей»
   (.sx-ncard) — там подпись остаётся под фотографией, и правка базы сломала
   бы обе секции разом. */
.sxc-card.ov { position:relative; display:block; aspect-ratio:3/4; }
.sxc-card.ov .sxc-media { position:absolute; inset:0; aspect-ratio:auto; }
/* Градиент — псевдоэлемент подложки, а не слой в разметке: подпись должна
   читаться на любом снимке, что бы на нём ни было. */
.sxc-card.ov .sxc-media::after { content:""; position:absolute; inset:0;
  background:linear-gradient(180deg, transparent 42%, rgba(4,10,20,.74) 100%); pointer-events:none; }
.sxc-card.ov .sxc-no { position:absolute; z-index:1; top:16px; left:20px; color:rgba(255,255,255,.82); }
.sxc-card.ov .sxc-foot { position:absolute; z-index:1; inset:auto 16px 18px 20px; padding:0;
  align-items:flex-end; }
.sxc-card.ov .sxc-t { margin:0; color:#fff; }
.sxc-card.ov .sxc-arr { border:none; background:rgba(255,255,255,.96); color:var(--sx-ink); }
.sxc-card.ov:hover .sxc-arr,
.sxc-card.ov:focus-visible .sxc-arr { background:var(--sx-accent); color:#fff; }

@media (prefers-reduced-motion: reduce){
  .sxc-card, .sxc-media img, .sxc-arr,   .sxc-card:hover .sxc-media img { transform:none; }
}
    `;
    document.head.appendChild(s);
  }, []);

  // та же логика сопоставления категорий, что и в SoiCatalogPortal — чтобы оба блока вели одинаково.
  // Сверять только по id нельзя: у категорий из CMS id — это cuid, а "equipment"
  // и прочие ключи карточек лежат в slug, поэтому карточки уводили в корень каталога.
  const goCard = (card) => {
    const found = cats.find((c) => c.slug === card.catKey || c.id === card.catKey);
    go("catalog", found ? { cat: found.id } : {});
  };

  return (
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rv">
          <div>
            <p className="sxc-kicker">{_lv(lang, "Электронный каталог", "Elektron katalog", "Digital catalog")}</p>
            <h2 className="sxc-h2 sx-h2-link" onClick={() => go("catalog")}>{_lv(lang, "Оборудование для современной медицины", "Zamonaviy tibbiyot uchun uskunalar", "Equipment for modern medicine")}</h2>
          </div>
          <div>
            <p className="sxc-sub">{_lv(lang,
              "Структурированный каталог решений для диагностики, лечения, реанимации и ежедневной работы медицинских учреждений.",
              "Tibbiyot muassasalarining diagnostika, davolash, reanimatsiya va kundalik ish uchun yechimlar katalogi.",
              "A structured catalog of solutions for diagnostics, treatment, intensive care and the daily work of medical institutions.")}</p>
          </div>
        </div>

        <div className="sxc-grid">
          {/* Карточка — настоящая ссылка на адрес категории (/catalog/<slug>),
              а не div с обработчиком. Кликабельна она была и раньше, но без
              href у неё не работало то, чего ждут от плитки каталога: открыть
              в новой вкладке средним кликом или Cmd/Ctrl, скопировать адрес,
              попасть в индекс поисковика.

              Переход остаётся внутренним: обычный клик перехватываем и отдаём
              роутеру. Клик с модификатором и не левой кнопкой не трогаем —
              иначе новая вкладка снова перестанет открываться. Обработчик
              клавиатуры не нужен, <a href> нажимается по Enter сам. */}
          {CATALOG_CARDS.map((card, i) => (
            <a
              key={card.slug}
              className="sxc-card ov sx-rv"
              style={{ "--i": i }}
              href={"/catalog/" + card.slug}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                goCard(card);
              }}
            >
              <div className="sxc-media">
                <img src={window.__asset("assets/catalog/" + card.slug + ".jpg")} alt="" loading="lazy" />
              </div>
              {/* Номер вынесен из .sxc-foot: в варианте .ov он стоит в верхнем
                  углу снимка, а подпись со стрелкой — в нижнем. */}
              <span className="sxc-no">{String(i + 1).padStart(2, "0")}</span>
              <div className="sxc-foot">
                <h3 className="sxc-t">{_lv(lang, card.t.ru, card.t.uz, card.t.en)}</h3>
                <span className="sxc-arr" aria-hidden><Icon name="arrowRight" size={18} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoiDirections({ lang, go }) {
  const DD = window.DIRECTIONS_DATA;
  if (!DD) return null;
  const { DIRECTION_GROUPS, getDirsForGroup } = DD;
  /* Блок пересобран на разметке и классах каталожного блока (.sxc-*): у него
     та же двухколоночная шапка и те же карточки с номером, заголовком и
     стрелкой. Отличие одно — вместо фотографии в медиа-области глиф
     направления: снимков под группы у нас нет.
     Прежние цвета групп (g.color) не используются: это была радуга из шести
     произвольных оттенков мимо палитры. */
  return (
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rv">
          <div>
            <p className="sxc-kicker">{_lv(lang, "Навигация по направлениям", "Yo'nalishlar bo'yicha", "By specialty")}</p>
            <h2 className="sxc-h2">{_lv(lang, "Подбор по направлению медицины", "Tibbiyot yo'nalishi bo'yicha tanlov", "Find by medical specialty")}</h2>
          </div>
          <div>
            <p className="sxc-sub">{_lv(lang,
              "Откройте каталог по профилю учреждения, отделению или клинической задаче.",
              "Muassasa profili yoki klinik vazifa bo'yicha katalogni oching.",
              "Open the catalog by institution profile, department or clinical task.")}</p>
          </div>
        </div>

        {/* Карточки прежние — глиф, название и список направлений. Шапка блока
            осталась в оформлении каталожного блока (.sxc-head). */}
        <div className="sx-dir-grid">
          {DIRECTION_GROUPS.map((g, i) => {
            const dirs = getDirsForGroup(g.id).slice(0, 4);
            return (
              /* Карточка перестала быть div с onClick: без tabindex и role она
                 не бралась ни клавиатурой, ни скринридером — мышью работала, для
                 остальных не существовала.

                 Обернуть карточку целиком в <a> нельзя: внутри уже лежат ссылки
                 на отдельные направления, а вложенные <a> — невалидная разметка,
                 браузер их разорвёт. Поэтому ссылка одна, на заголовке, а её
                 область нажатия растянута на карточку псевдоэлементом
                 (.sx-dir-t::after). Внутренние ссылки подняты над этим слоем и
                 продолжают работать сами по себе. */
              <div className="sx-dir sx-rv" key={g.id} style={{ "--i": i }}>
                {/* Цвет иконки больше не берётся из g.color: данные групп несут
                    свои оттенки (среди них зелёный и бирюзовый), и на белой
                    странице с одним фирменным синим это читалось разнобоем.
                    Цвет и подложка заданы в CSS — один тон на все группы.
                    Глиф увеличен с 26 до 39px, как просили — в полтора раза. */}
                <div className="sx-dir-ic"><Icon name={g.icon} size={39} /></div>
                <h3>
                  <a
                    className="sx-dir-t"
                    href="/catalog"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                      e.preventDefault();
                      go("catalog", { dir: dirs[0] && dirs[0].id });
                    }}
                  >{_lv(lang, g.ru, g.uz, g.en)}</a>
                </h3>
                <div className="sx-dir-links">
                  {dirs.map((d) => (
                    <a
                      key={d.id}
                      href="/catalog"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        go("catalog", { dir: d.id });
                      }}
                    >{_lv(lang, d.ru, d.uz, d.en)}</a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Блок «Масштаб платформы» (SoiImpact) удалён 09.08.2026 по решению
   заказчика. Вместе с ним ушёл и его CSS: .sx-impact*, .sx-metric* и
   .sx-eyebrow — последний использовался только здесь. */

function SoiCountUp({ value }) {
  const ref = useRef(null);
  const [disp, setDisp] = useState("0");
  useEffect(() => {
    const target = parseInt(String(value).replace(/\s/g, ""), 10);
    if (isNaN(target)) { setDisp(value); return; }
    const fmt = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ");
    let done = false;
    const run = () => {
      const start = performance.now(), DUR = 1500;
      const step = (now) => {
        const p = Math.min((now - start) / DUR, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDisp(fmt(Math.round(e * target)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !done) { done = true; run(); } }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{disp}</span>;
}

/* Shown until the admin has enough real partners: an empty — or nearly empty —
   belt is worse than a placeholder one. The threshold is four rather than one,
   because two rows of two laps each repeat the list four times: a single real
   brand would parade past as the same word four times over, which reads as a
   bug rather than as a short list. */
const PARTNERS_MIN = 4;
const PARTNERS_FALLBACK = [
  { id: "ph", name: "Philips" }, { id: "am", name: "Армед" },
  { id: "kpz", name: "Касимовский ПЗ" }, { id: "md", name: "Midmark" },
  { id: "ns", name: "Нейрософт" }, { id: "dr", name: "Dräger" },
  { id: "mn", name: "Mindray" }, { id: "el", name: "Елатомский ПЗ" },
];

function SoiBrands({ lang, go }) {
  const brands = (window.DATA && window.DATA.BRANDS || []).filter((b) => b && b.name);
  const items = brands.length >= PARTNERS_MIN ? brands : PARTNERS_FALLBACK;

  /* One list, split across the two rows. Odd counts leave the extra name on the
     top row, and a single partner would leave the bottom one empty — so below
     two names the list is simply repeated rather than divided. */
  const half = Math.ceil(items.length / 2);
  const rows = items.length > 1 ? [items.slice(0, half), items.slice(half)] : [items, items];

  const item = (b, row, dup) => (
    <button
      className="sx-mq-item"
      key={row + (dup ? "b-" : "a-") + b.id}
      onClick={() => go("partners")}
      tabIndex={dup ? -1 : 0}
      title={_lv(lang, "Все партнёры", "Barcha hamkorlar", "All partners")}
    >
      {b.logo
        ? <img src={b.logo} alt={b.name} loading="lazy"
               onError={(e) => { e.currentTarget.replaceWith(document.createTextNode(b.name)); }} />
        : b.name}
      {b.flag ? <span className="sx-mq-flag">{b.flag}</span> : null}
    </button>
  );

  /* Two passes of the row's own names. The animation travels -50%, the width of
     exactly one pass, so when it resets the second pass is standing where the
     first began and nothing jumps. The clone is hidden from screen readers — it
     is the same names again, not twice as many partners. */
  const belt = (list, row) => (
    <div className="sx-mq-row" key={row}>
      {/* Slower with more names, so both belts read at one speed whatever the admin adds. */}
      <div
        className={"sx-mq-track" + (row ? " rev" : "")}
        style={{ "--mq-dur": Math.max(22, list.length * 5.5) + "s" }}
      >
        {/* Два прохода — два самостоятельных блока одинаковой ширины. Раньше
            клон разворачивался в ту же флекс-строку через display:contents, и
            ширина дорожки выходила «2×проход минус один зазор»: сдвиг на −50 %
            не совпадал с длиной прохода, и на стыке лента дёргалась. */}
        <div className="sx-mq-pass">{list.map((b) => item(b, row, false))}</div>
        <div className="sx-mq-pass" aria-hidden="true">{list.map((b) => item(b, row, true))}</div>
      </div>
    </div>
  );

  return (
    <section className="sx-mq-sec">
      <div className="sx-mq-head">
        <h2 className="sx-h2 sx-brands-title sx-rv sx-h2-link" onClick={() => go("partners")} style={{ margin: 0 }}>
          {_lv(lang, "Партнёры", "Hamkorlar", "Partners")}
        </h2>
      </div>
      <div className="sx-mq-vp">
        <div className="sx-mq-fade" />
        {rows.map((list, i) => belt(list, i))}
      </div>
    </section>
  );
}

/* CSS модалки кейса — самоинжект (чтобы работала и вне главной, напр. на #/cases) */
function ensureCaseModalCss() {
  if (document.getElementById("sx-cmod-css")) return;
  const s = document.createElement("style");
  s.id = "sx-cmod-css";
  s.textContent = `
.sx-cmod-ov { position:fixed; inset:0; background:rgba(8,14,24,.8); z-index:9100; display:flex; align-items:center; justify-content:center; padding:24px; animation:sxCmodFade .18s ease; }
@keyframes sxCmodFade { from{opacity:0} to{opacity:1} }
.sx-cmod { background:#fff; border-radius:var(--r-lg); width:min(680px,94vw); max-height:90vh; overflow:auto; box-shadow:var(--sh-xl); animation:sxCmodUp .22s cubic-bezier(.16,1,.3,1); }
@keyframes sxCmodUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sx-cmod-cover { aspect-ratio:16/9; background:var(--sx-bg-soft); display:flex; align-items:center; justify-content:center; color:var(--slate-300); overflow:hidden; }
.sx-cmod-cover img { width:100%; height:100%; object-fit:cover; display:block; }
.sx-cmod-body { padding:26px 30px 30px; }
.sx-cmod-tag { display:inline-flex; font-size:var(--fs-1); font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--sx-accent); background:var(--sx-bg-soft); border:1px solid var(--sx-line); padding:5px 12px; border-radius:var(--r-sm); margin-bottom:14px; }
.sx-cmod-body h2 { font-size:var(--fs-7); font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.015em; margin:0 0 14px; }
.sx-cmod-body p { font-size:var(--fs-4); line-height:1.7; color:var(--sx-ink-soft); margin:0; white-space:pre-line; }
.sx-cmod-meta {display:flex; flex-wrap:wrap; gap:22px; margin-top:22px; padding-top:18px; font-size:var(--fs-3); color:var(--sx-mute)}
.sx-cmod-meta b { color:var(--navy-900); }
.sx-cmod-x { position:fixed; top:22px; right:26px; width:42px; height:42px; border-radius:50%; border:none; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s; z-index:9110; }
.sx-cmod-x:hover { background:rgba(255,255,255,.28); }
.sx-cmod-x:focus-visible { outline:2px solid #fff; outline-offset:2px; }
[data-theme="dark"] .sx-cmod { background:#0c1726; }
[data-theme="dark"] .sx-cmod-body h2 { color:#eaf1fb; }
[data-theme="dark"] .sx-cmod-body p { color:#a9b8cc; }
[data-theme="dark"] .sx-cmod-meta { border-color:#22344e; color:#94a7bf; }
[data-theme="dark"] .sx-cmod-meta b { color:#eaf1fb; }
@media(max-width:500px){ .sx-cmod-body { padding:20px; } .sx-cmod-body h2 { font-size:var(--fs-6); } }
@media(prefers-reduced-motion:reduce){ .sx-cmod-ov,.sx-cmod { animation:none; } }
  `;
  document.head.appendChild(s);
}

/* Модалка предпросмотра кейса: обложка + текст поверх затемнённого фона */
function CaseModal({ c, lang, tx, img, onClose }) {
  ensureCaseModalCss();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, []);
  const cover = img(c.image);
  return (
    <div className="sx-cmod-ov" onClick={onClose} role="dialog" aria-modal="true" aria-label={tx(c.title)}>
      <button className="sx-cmod-x" onClick={onClose} aria-label={_lv(lang, "Закрыть", "Yopish", "Close")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div className="sx-cmod" onClick={(e) => e.stopPropagation()}>
        <div className="sx-cmod-cover">
          {cover ? <img src={cover} alt={tx(c.title)} /> : <Icon name="pin" size={40} />}
        </div>
        <div className="sx-cmod-body">
          {c.tag && <span className="sx-cmod-tag">{tx(c.tag)}</span>}
          <h2>{tx(c.title)}</h2>
          {tx(c.desc) && <p>{tx(c.desc)}</p>}
          {(c.year || c.region) && (
            <div className="sx-cmod-meta">
              {c.year && <span>{_lv(lang, "Год", "Yil", "Year")}: <b>{c.year}</b></span>}
              {c.region && <span>{_lv(lang, "Регион", "Hudud", "Region")}: <b>{tx(c.region)}</b></span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SoiCases({ lang, go }) {
  const tx = (o) => (o && (typeof o === "string" ? o : (o[lang] || o.ru))) || "";
  const img = (im) => !im ? "" : typeof im === "string" ? im : (im.data || im.url || im.src || "");
  const [viewer, setViewer] = React.useState(null);
  // Реактивная подписка: cms-remote грузит cases из API асинхронно и делает CMS.emit("cases").
  const [cmsCases, setCmsCases] = React.useState(() => window.CMS ? window.CMS.list("cases") : []);
  React.useEffect(() => {
    if (!window.CMS) return;
    setCmsCases(window.CMS.list("cases"));
    return window.CMS.on("cases", () => setCmsCases(window.CMS.list("cases")));
  }, []);
  let cases = cmsCases.filter((c) => (c.status || "published") === "published");
  // Fallback на статичные CASES_DEFAULT — только когда API реально пуст (по подписке уже дошли данные).
  if (!cases.length && window.SOI_CORE && window.SOI_CORE.CASES_DEFAULT) cases = window.SOI_CORE.CASES_DEFAULT;
  cases = cases.slice(0, 3);
  if (!cases.length) return null;
  return (
    /* Блок приведён к оформлению каталожного: та же обёртка, двухколоночная
       шапка и та же сетка карточек. Содержимое карточки оставлено прежним —
       обложка, тег, описание, год и регион: это её смысл, а не оформление. */
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rv">
          <div>
            <p className="sxc-kicker">{_lv(lang, "Реализованные проекты", "Amalga oshirilgan loyihalar", "Delivered projects")}</p>
            <h2 className="sxc-h2 sx-h2-link" onClick={() => go("projects")}>{_lv(lang, "Как мы оснащаем медицину Узбекистана", "O'zbekiston tibbiyotini qanday jihozlaymiz", "How we equip Uzbekistan's healthcare")}</h2>
          </div>
          <div>
            <p className="sxc-sub">{_lv(lang,
              "Оснащение больниц, диагностических центров и частных клиник — от поставки до пусконаладки и обучения персонала.",
              "Kasalxonalar, diagnostika markazlari va xususiy klinikalarni jihozlash — yetkazib berishdan ishga tushirish va o'qitishgacha.",
              "Equipping hospitals, diagnostic centres and private clinics — from delivery to commissioning and staff training.")}</p>
          </div>
        </div>
        <div className="sxc-grid sx-cases">
          {cases.map((c, i) => (
            <div className="sxc-card sx-case sx-rv" key={c.id || i} style={{ "--i": i }}
              role="button" tabIndex={0}
              onClick={() => setViewer(c)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewer(c); } }}
              aria-label={_lv(lang, "Открыть кейс", "Keysni ochish", "Open case") + ": " + tx(c.title)}>
              <div className="sxc-media sx-case-cover">{img(c.image) ? <img src={img(c.image)} alt={tx(c.title)} loading="lazy" /> : <Icon name="pin" size={34} />}</div>
              <div className="sx-case-body">
                {c.tag && <span className="sx-case-tag">{tx(c.tag)}</span>}
                <h3>{tx(c.title)}</h3>
                <p>{tx(c.desc)}</p>
                {/* Регион перед годом: в readdy место стоит первым, и так
                    читается естественнее — «где», потом «когда». */}
                <div className="sx-case-meta">
                  {c.region && <span><Icon name="pin" size={15} />{tx(c.region)}</span>}
                  {c.year && <span><Icon name="calendar" size={15} />{c.year}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewer && <CaseModal c={viewer} lang={lang} tx={tx} img={img} onClose={() => setViewer(null)} />}
    </section>
  );
}

/* Миниатюра первой страницы PDF (общий рендер из testimonials.jsx через window),
   с fallback на переданный элемент-обложку. */
function RevPdfThumb({ url, alt, fallback }) {
  const [src, setSrc] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    let on = true; setSrc(null); setErr(false);
    if (!url || !window.rvpRenderPdfPage) { setErr(true); return; }
    window.rvpRenderPdfPage(url, 260).then((d) => on && setSrc(d)).catch(() => on && setErr(true));
    return () => { on = false; };
  }, [url]);
  if (src && !err) return <img src={src} alt={alt} loading="lazy" />;
  return fallback;
}

function SoiReviews({ lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [tab, setTab] = React.useState("buyers");
  const [idx, setIdx] = React.useState(0);
  const [viewer, setViewer] = React.useState(null);
  const ovRef = React.useRef(null);
  const GAP = 20;
  /* Аватары отзывов различаются светлотой одного синего, а не набором чужих
     цветов: красный здесь читался как ошибка, фиолетового в палитре нет. */
  const COLORS = ["var(--accent)","var(--blue-500)","var(--blue-400)","var(--accent-2)","var(--blue-700)","var(--blue-600)"];
  const tx = (o) => !o ? "" : typeof o === "string" ? o : (o[lang] || o.ru || "");
  const rtype = (r) => { const v = r.type || r.group || ""; if (v==="suppliers") return "supplier"; if (v==="buyers") return "buyer"; return v||"buyer"; };

  const [cmsAll, setCmsAll] = React.useState(() => window.CMS ? window.CMS.list("reviews") : []);
  React.useEffect(() => {
    if (!window.CMS) return;
    setCmsAll(window.CMS.list("reviews"));
    return window.CMS.on("reviews", () => setCmsAll(window.CMS.list("reviews")));
  }, []);

  const BUYERS_STUB = [
    { id:"namangan", org:lv("Компания «Наманганская областная больница»","«Namangan viloyat kasalxonasi» kompaniyasi","Namangan Regional Hospital"), city:lv("Наманган","Namangan","Namangan"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Оборудование для отделения диагностики","Diagnostika bo'limi uchun uskunalar","Diagnostic dept. equipment"), text:lv("Выражаем благодарность ИНДУСТРИЯ ЗДОРОВЬЯ за оперативную поставку и качественный монтаж оборудования для отделения диагностики.","Diagnostika bo'limi uchun uskunalarni tezkor yetkazib berish va sifatli o'rnatganlik uchun SOG’LIQ INDUSTRIYASIga minnatdorchilik bildiramiz.","We express gratitude to HEALTH INDUSTRY for prompt delivery and quality installation of diagnostic department equipment."), color:"var(--blue-500)" },
    { id:"oncology", org:lv("Компания «РСНПМЦ Онкологии»","«RSNPMC Onkologiyasi» kompaniyasi","RSNPMC Oncology Center"), city:lv("Ташкент","Toshkent","Tashkent"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Лучевая диагностика «под ключ»","«Kalit ostida» nurli diagnostika","Radiology dept. turnkey"), text:lv("Комплексное оснащение отделения лучевой диагностики выполнено под ключ, с обучением персонала и полным пакетом документов.","Nurli diagnostika bo'limini kompleks jihozlash kalit ostida amalga oshirildi, xodimlarni o'qitish va to'liq hujjatlar to'plami bilan.","Complete turnkey outfitting of the radiology department including staff training and full documentation package."), color:"var(--blue-500)" },
    { id:"perinatal", org:lv("Республиканский перинатальный центр","Respublika perinatal markazi","Republican Perinatal Center"), city:lv("Ташкент","Toshkent","Tashkent"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Акушерство и гинекология","Akusherlik va ginekologiya","Obstetrics & Gynecology"), text:lv("Поставка оборудования для роддома выполнена точно в срок. Всё оборудование прошло метрологическую поверку и введено в эксплуатацию.","Tug'ruqxona uchun uskunalar o'z vaqtida yetkazildi. Barcha uskunalar metrologik tekshiruvdan o'tdi va foydalanishga topshirildi.","Equipment for the maternity unit was delivered on schedule. All equipment passed metrological verification and was commissioned."), color:"var(--accent)" },
    { id:"dental", org:lv("Стоматологическая клиника «DentaLux»","«DentaLux» stomatologiya klinikasi","DentaLux Dental Clinic"), city:lv("Самарканд","Samarqand","Samarkand"), type:lv("частная клиника","xususiy klinika","private clinic"), cat:lv("Стоматологическое оборудование","Stomatologiya uskunalari","Dental equipment"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ помогла оснастить клинику «под ключ» в сжатые сроки. Профессиональный подход к каждому этапу — от выбора оборудования до сервиса.","SOG’LIQ INDUSTRIYASI klinikani qisqa muddatda «kalit ostida» jihozlashga yordam berdi. Uskunani tanlashdan xizmat ko'rsatishgacha bo'lgan har bir bosqichda professional yondashuv.","HEALTH INDUSTRY helped outfit the clinic turnkey on a tight schedule. Professional approach at every stage from equipment selection to service."), color:"var(--blue-500)" },
  ];
  const SUPPLIERS_STUB = [
    { id:"midmark", org:"Midmark Corporation", city:lv("Вершайлз, США","Versayles, AQSh","Versailles, USA"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Официальный дистрибьютор в ЦА","Markaziy Osiyo bo'yicha rasmiy distribyutor","Authorized distributor in CA"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ является авторизованным дистрибьютором Midmark в Центральной Азии. Высокий стандарт сервиса и компетентность персонала.","SOG’LIQ INDUSTRIYASI — Markaziy Osiyoda Midmarkning vakolatli distribyutori. Xizmat ko'rsatishning yuqori standarti va xodimlarning malakasi.","HEALTH INDUSTRY is the authorized distributor of Midmark in Central Asia. High service standards and staff competence."), color:"var(--blue-500)" },
    { id:"armed", org:"Armed Medical", city:lv("Москва, Россия","Moskva, Rossiya","Moscow, Russia"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Партнёрское соглашение","Hamkorlik shartnomasi","Partnership agreement"), text:lv("Надёжный региональный партнёр по дистрибуции. Ответственный подход к продажам и соблюдению условий авторизованного дистрибьютора.","Ishonchli mintaqaviy distribyutor hamkor. Savdoga mas'uliyatli yondashuv va vakolatli distribyutor shartlariga rioya qilish.","A reliable regional distribution partner. Responsible sales approach and compliance with authorized distributor terms."), color:"var(--blue-500)" },
    { id:"choicemmed", org:"ChoiceMmed Technology", city:lv("Пекин, Китай","Pekin, Xitoy","Beijing, China"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Авторизованный дистрибьютор","Vakolatli distribyutor","Authorized distributor"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ — один из ключевых партнёров в Узбекистане. Своевременные поставки и профессиональная техническая служба поддержки.","SOG’LIQ INDUSTRIYASI — O'zbekistondagi asosiy hamkorlarimizdan biri. O'z vaqtida yetkazib berish va professional texnik qo'llab-quvvatlash xizmati.","HEALTH INDUSTRY is one of our key partners in Uzbekistan. Timely deliveries and professional technical support service."), color:"var(--accent)" },
  ];

  /* prefer CMS; fall back to stub if CMS is empty */
  const published = cmsAll.filter(r => !r.status || r.status === "published");
  const cmsBuyers = published.filter(r => rtype(r) === "buyer");
  const cmsSuppliers = published.filter(r => rtype(r) === "supplier");
  const items = tab === "buyers"
    ? (cmsBuyers.length ? cmsBuyers : BUYERS_STUB)
    : (cmsSuppliers.length ? cmsSuppliers : SUPPLIERS_STUB);
  const perView = 2;
  const maxIdx = Math.max(0, items.length - perView);

  React.useEffect(() => { setIdx(0); if (ovRef.current) { ovRef.current.style.transform = "translateX(0)"; } }, [tab]);

  const shift = (dir) => {
    if (!ovRef.current) return;
    const next = Math.max(0, Math.min(maxIdx, idx + dir));
    setIdx(next);
    const cardW = (ovRef.current.parentElement.offsetWidth - GAP) / perView;
    ovRef.current.style.transform = `translateX(calc(-${next} * (${cardW}px + ${GAP}px)))`;
  };

  const DocThumb = ({ color }) => (
    <svg viewBox="0 0 160 212" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
      <rect width="160" height="212" rx="6" fill="white"/>
      <rect width="160" height="38" rx="6" fill={color}/>
      <rect y="26" width="160" height="12" fill={color}/>
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
      <circle cx="36" cy="188" r="17" stroke={color} strokeWidth="1.5" opacity=".75"/>
      <circle cx="36" cy="188" r="10" fill={color} opacity=".15"/>
      <rect x="64" y="181" width="54" height="5" rx="2.5" fill="var(--line-soft)"/>
      <rect x="64" y="191" width="42" height="5" rx="2.5" fill="var(--line-soft)"/>
    </svg>
  );

  return (
    /* Шапка приведена к оформлению каталожного блока: надзаголовок и заголовок
       слева, описание и переключатель — справа. Карусель и карточки писем
       оставлены как есть, это механика блока. */
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rev-head sx-rv">
          <div className="sx-rev-head-left">
            <p className="sxc-kicker">{lv("Отзывы","Sharhlar","Reviews")}</p>
            <h2 className="sxc-h2 sx-h2-link" onClick={() => go("reviews")}>
              {lv("Благодарственные письма клиник и партнёров","Klinikalar va hamkorlarning minnatdorchilik xatlari","Letters of appreciation from clinics and partners")}
            </h2>
          </div>
          <div>
            <p className="sxc-sub">{lv("Письма от медицинских учреждений Узбекистана и производителей оборудования, с которыми мы работаем.","O'zbekiston tibbiyot muassasalari va biz ishlaydigan uskuna ishlab chiqaruvchilarining xatlari.","Letters from medical institutions in Uzbekistan and the equipment manufacturers we work with.")}</p>
          <div className="sx-rev-tabs">
            <button className={"sx-rev-tab"+(tab==="buyers"?" on":"")} onClick={() => setTab("buyers")}>
              {lv("Покупатели","Xaridorlar","Buyers")}
            </button>
            <button className={"sx-rev-tab"+(tab==="suppliers"?" on":"")} onClick={() => setTab("suppliers")}>
              {lv("Поставщики","Ta'minotchilar","Suppliers")}
            </button>
          </div>
          </div>
        </div>

        <div className="sx-rev-outer sx-rv">
          <button className="sx-rev-arr" disabled={idx===0} onClick={() => shift(-1)} aria-label={lv("Назад","Orqaga","Previous")}>
            <Icon name="arrowLeft" size={18}/>
          </button>
          <div className="sx-rev-overflow">
            <div className="sx-rev-track" ref={ovRef}>
              {items.map((r, i) => {
                /* support both CMS records and legacy stub objects */
                const isCms  = !r.org;
                const org    = isCms ? tx(r.company) : r.org;
                const region = isCms ? tx(r.region)  : (r.city ? r.city + (r.type ? " · " + r.type : "") : "");
                const text   = isCms ? tx(r.desc)    : r.text;
                const color  = r.color || COLORS[i % COLORS.length];
                const letterUrl = isCms ? (r.letter?.data || "") : "";
                const isImg  = isCms && r.letter?.type?.startsWith("image/");
                const isPdf  = !!letterUrl && !isImg;
                const openable = !!letterUrl;
                const typeLabel = rtype(r) === "supplier"
                  ? lv("Поставщик","Ta'minotchi","Supplier")
                  : lv("Покупатель","Xaridor","Buyer");
                const open = () => openable ? setViewer(r) : go("reviews");
                return (
                <div className="sx-rev-card" key={r.id}>
                  <div className="sx-rev-doc"
                    role="button" tabIndex={0}
                    onClick={open}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
                    aria-label={lv("Открыть письмо","Xatni ochish","Open letter") + ": " + org}>
                    {isImg
                      ? <img src={letterUrl} alt={org}/>
                      : isPdf
                        ? <RevPdfThumb url={letterUrl} alt={org} fallback={<DocThumb color={color}/>}/>
                        : <DocThumb color={color}/>}
                  </div>
                  <div className="sx-rev-body">
                    {/* Роль и город — одна пилюля, как в readdy: два ярлыка
                        рядом читались как два независимых фильтра. Инлайновый
                        цвет снят — он перебивал серую заливку из CSS. */}
                    <div className="sx-rev-badges">
                      <span className="sx-rev-badge">
                        <Icon name="pin" size={12}/>
                        <span>{typeLabel}{region ? " · " + region : ""}</span>
                      </span>
                    </div>
                    <h3 className="sx-rev-org">{org}</h3>
                    {text && <p className="sx-rev-quote">{text}</p>}
                    {/* Кнопка, а не div: подпись обещает открыть письмо, и
                        нажатие обязано работать — в том числе с клавиатуры. */}
                    <button className="sx-rev-more" type="button" onClick={open}
                      aria-label={lv("Открыть письмо","Xatni ochish","Open letter") + ": " + org}>
                      <span className="sx-rev-more-t">{lv("Читать полностью","To'liq o'qish","Read in full")}</span>
                      <span className="sx-rev-more-arr" aria-hidden><Icon name="arrowRight" size={16}/></span>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
          <button className="sx-rev-arr" disabled={idx>=maxIdx} onClick={() => shift(1)} aria-label={lv("Вперёд","Oldinga","Next")}>
            <Icon name="arrowRight" size={18}/>
          </button>
        </div>
      </div>
      {viewer && (() => {
        const Viewer = window.RvpSheetViewer;
        return Viewer ? <Viewer r={viewer} tx={tx} lv={lv} onClose={() => setViewer(null)} /> : null;
      })()}
    </section>
  );
}

function SoiNews({ lang, go }) {
  const tx = (o) => (o && (o[lang] || o.ru)) || "";
  const cov = (c) => !c ? null : (typeof c === "string" ? c : (c.data || c.src || null));
  const [viewer, setViewer] = React.useState(null);
  // Реактивная подписка: cms-remote грузит news из API асинхронно и делает CMS.emit("news").
  const [cmsNews, setCmsNews] = React.useState(() => window.CMS ? window.CMS.list("news") : []);
  React.useEffect(() => {
    if (!window.CMS) return;
    setCmsNews(window.CMS.list("news"));
    return window.CMS.on("news", () => setCmsNews(window.CMS.list("news")));
  }, []);
  const news = cmsNews.filter((n) => n.published !== false)
    .sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 3);
  if (!news.length) return null;
  const fmt = (d) => { if (!d) return ""; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "uz" ? "uz-UZ" : "en-US", { day: "2-digit", month: "long", year: "numeric" }); };
  return (
    /* Блок в оформлении каталожного: двухколоночная шапка и та же сетка
       карточек, что у «Реализованных проектов». Карточка открывает окно
       просмотра — раньше любой клик уводил на общий список новостей. */
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rv">
          <div>
            <p className="sxc-kicker">{_lv(lang, "Новости", "Yangiliklar", "News")}</p>
            <h2 className="sxc-h2 sx-h2-link" onClick={() => go("news")}>{_lv(lang, "Что нового в индустрии", "Sohada nima yangilik", "What's new in the industry")}</h2>
          </div>
          <div>
            <p className="sxc-sub">{_lv(lang,
              "Поставки и проекты компании, изменения в регулировании медицинских изделий и новинки оборудования.",
              "Kompaniyaning yetkazib berishlari va loyihalari, tibbiy buyumlarni tartibga solishdagi o'zgarishlar va yangi uskunalar.",
              "Company deliveries and projects, changes in medical device regulation and new equipment.")}</p>
          </div>
        </div>
        <div className="sxc-grid sx-news">
          {news.map((n, i) => (
            /* Настоящая <button>, а не div с role="button": карточка открывает
               модалку, то есть действие внутри страницы, а не переход. Родной
               элемент сам даёт фокус, Enter и пробел — свои обработчики клавиш
               больше не нужны. Ссылкой её делать нельзя: адреса у модалки нет. */
            <button
              type="button"
              key={n.id || i}
              className="sxc-card sx-ncard sx-rv"
              style={{ "--i": i }}
              onClick={() => setViewer(n)}
              aria-label={_lv(lang, "Открыть новость", "Yangilikni ochish", "Open news item") + ": " + tx(n.title)}
            >
              <div className="sxc-media sx-ncard-cover">
                {cov(n.cover) ? <img src={cov(n.cover)} alt={tx(n.title)} loading="lazy" /> : <Icon name="doc" size={28} />}
              </div>
              <div className="sx-ncard-body">
                <div className="sx-ncard-date">{fmt(n.date)}</div>
                <h3>{tx(n.title)}</h3>
                {/* span, не ссылка: вся карточка уже <button>, и вложенная
                    интерактивная обёртка внутри неё невалидна. */}
                <span className="sx-ncard-more">
                  {_lv(lang, "Читать статью", "Maqolani o'qish", "Read article")}
                  <Icon name="arrowRight" size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {viewer && <NewsModal n={viewer} lang={lang} tx={tx} cov={cov} fmt={fmt} onClose={() => setViewer(null)} />}
    </section>
  );
}

/* Окно просмотра новости. Оформление и поведение — те же, что у окна кейса
   (sx-cmod-*): затемнение, закрытие по Esc и по клику мимо, блокировка
   прокрутки страницы. */
function NewsModal({ n, lang, tx, cov, fmt, onClose }) {
  ensureCaseModalCss();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, []);
  const cover = cov(n.cover);
  const body = tx(n.body) || tx(n.text) || tx(n.desc) || tx(n.excerpt) || "";
  return (
    <div className="sx-cmod-ov" onClick={onClose} role="dialog" aria-modal="true" aria-label={tx(n.title)}>
      <button className="sx-cmod-x" onClick={onClose} aria-label={_lv(lang, "Закрыть", "Yopish", "Close")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div className="sx-cmod" onClick={(e) => e.stopPropagation()}>
        <div className="sx-cmod-cover">
          {cover ? <img src={cover} alt={tx(n.title)} /> : <Icon name="doc" size={40} />}
        </div>
        <div className="sx-cmod-body">
          {n.date && <span className="sx-cmod-tag">{fmt(n.date)}</span>}
          <h2>{tx(n.title)}</h2>
          {body && <p style={{ whiteSpace: "pre-line" }}>{body}</p>}
        </div>
      </div>
    </div>
  );
}

function SoiCatalogPortal({ lang, go }) {
  const lv = (ru, uz, en) => _lv(lang, ru, uz, en);
  const cats = window.DATA && window.DATA.CATEGORIES || [];

  const tiles = [
    { key: "equip", ru: "Медицинское оборудование", uz: "Tibbiy uskunalar", en: "Medical equipment", ic: "pulse", accent: "var(--blue-500)", catKey: "equipment" },
    { key: "furn",  ru: "Медицинская мебель",        uz: "Tibbiy mebel",   en: "Medical furniture",  ic: "bed",   accent: "var(--accent)", catKey: "furniture" },
    { key: "inst",  ru: "Инструменты",               uz: "Asboblar",       en: "Instruments",        ic: "scalpel", accent: "var(--accent)", catKey: "instruments" },
    { key: "cons",  ru: "Расходные материалы",        uz: "Sarf materiallari", en: "Consumables",    ic: "box",   accent: "var(--accent)", catKey: "consumables" },
  ];

  const goTile = (t) => {
    /* Плитки заданы по slug — сверяем и с ним, и с cuid. Подбор по куску
       названия, который стоял здесь раньше, не срабатывал: «Медицинская мебель»
       искалась по слову «мебель» в нижнем регистре и мимо шла на общий каталог. */
    const found = cats.find(c => c.slug === t.catKey || c.id === t.catKey);
    go("catalog", found ? { cat: found.id } : {});
  };

  return (
    <section className="sx-section">
      <div className="sx-wrap">
        <div className="sx-cp sx-rv">
          <div className="sx-cp-aurora" />
          <div className="sx-cp-ov" />
          <div className="sx-cp-inner">

            <div>
              <span className="sx-cp-eyebrow">{lv("Электронный каталог", "Elektron katalog", "Electronic catalog")}</span>
              <h2 className="sx-cp-h2">{lv("2 800+ единиц оборудования для медицины", "Tibbiyot uchun 2 800+ birlik uskunalar", "2,800+ units of medical equipment")}</h2>
              <p className="sx-cp-sub">{lv(
                "Медтехника, мебель, инструменты и расходные материалы. Поиск по бренду, направлению и наличию на складе.",
                "Tibbiy texnika, mebel, asboblar va sarf materiallari. Brend va yo'nalish bo'yicha qidiruv.",
                "Equipment, furniture, instruments and consumables. Search by brand, specialty and stock."
              )}</p>
              <button className="sx-cp-btn" onClick={() => go("catalog", {})}>
                <Icon name="grid" size={19} />
                {lv("Открыть каталог", "Katalogni ochish", "Open catalog")}
                <Icon name="arrowRight" size={18} />
              </button>
            </div>

            <div className="sx-cp-tiles">
              {tiles.map((tile) => (
                <button key={tile.key} className="sx-cp-tile" style={{ "--ta": tile.accent }} onClick={() => goTile(tile)}>
                  <span className="sx-cp-tile-ic"><Icon name={tile.ic} size={20} /></span>
                  <span className="sx-cp-tile-t">{lv(tile.ru, tile.uz, tile.en)}</span>
                  <Icon name="arrowRight" size={14} className="sx-cp-tile-arr" />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function SoiFinalCTA({ lang, go }) {
  const cta = useHomeSetting("homepage_cta", CTA_DEFAULTS);
  const ctx = (field) => trTx(cta, field, lang);
  return (
    <section className="sx-section">
      <div className="sx-wrap">
        <div className="sx-cta sx-rv">
          <div className="sx-cta-aurora" />
          <div className="sx-cta-inner">
            <h2>{ctx("title")}</h2>
            <p>{ctx("subtitle")}</p>
            <div className="sx-cta-actions">
              <button className="sx-btn sx-btn-primary" onClick={() => { if (window.__openQuote) window.__openQuote(); else go("contacts"); }}>
                <Icon name="doc" size={19} />{ctx("btn1")}
              </button>
              <button className="sx-btn sx-btn-ghost" onClick={() => go("catalog", {})}>
                <Icon name="grid" size={18} />{ctx("btn2")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ t, lang, store, go }) {
  useSoiReveal();
  return (
    <div className="sx">
      <SoiPlatformCSS />
      <Hero t={t} lang={lang} go={go} />
      <SoiEcosystem lang={lang} go={go} />
      <SoiExpertise lang={lang} go={go} />
      <SoiCatalogCards lang={lang} go={go} />
      <SoiDirections lang={lang} go={go} />
      <SoiCatalogPortal lang={lang} go={go} />
      <SoiBrands lang={lang} go={go} />
      <SoiCases lang={lang} go={go} />
      <SoiNews lang={lang} go={go} />
      <SoiFinalCTA lang={lang} go={go} />
    </div>);
}

Object.assign(window, { HomePage, Hero, CategoryGrid, FeaturedRow, TrustBand, BrandStrip, CtaBand, HeroVideoSlot });
/* Expose the new platform homepage building blocks so the corp shell (home-sections.jsx → CoHomePage)
   can compose the exact same Stripe/Vercel-grade design without duplicating ~600 lines.
   These components close over the catalog-scope `Icon`, which is a shared global, so they render
   identically regardless of which shell calls them. */
Object.assign(window, {
  SoiPlatformCSS, useSoiReveal, SoiHero: Hero,
  SoiEcosystem, SoiExpertise, SoiCatalogCards, SoiDirections, SoiCatalogPortal, SoiBrands, SoiCases, SoiReviews, SoiNews, SoiFinalCTA,
  SoiCaseModal: CaseModal,
});
