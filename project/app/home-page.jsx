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

const IMPACT_DEFAULTS = {
  eyebrow: { ru: "Масштаб платформы", uz: "Platforma miqyosi", en: "Platform scale" },
  title: {
    ru: "Инфраструктура, которой доверяют клиники и государственные учреждения",
    uz: "Klinikalar va davlat muassasalari ishonadigan infratuzilma",
    en: "Infrastructure trusted by clinics and public institutions",
  },
  stat1_val: "2 800", stat1_unit: "+", stat1_label: { ru: "позиций в каталоге", uz: "katalog pozitsiyasi", en: "items in catalog" },
  stat2_val: "120",   stat2_unit: "+", stat2_label: { ru: "мировых брендов", uz: "jahon brendi", en: "global brands" },
  stat3_val: "14",    stat3_unit: "",  stat3_label: { ru: "регионов доставки", uz: "yetkazish hududi", en: "delivery regions" },
  stat4_val: "5",     stat4_unit: "+", stat4_label: { ru: "лет на рынке Узбекистана", uz: "O'zbekiston bozorida yil", en: "years in Uzbekistan" },
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
  address: "100069, Ташкент, Узбекистан, ул. МКАД, д.16",
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
              {n:"2 800+", l:"наименований", ic:"grid", c:"#1a5fd0"},
              {n:"120+",   l:"брендов",       ic:"award", c:"#15a06a"},
              {n:"14",    l:"регионов",      ic:"pin",   c:"#e0492f"},
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
    bg: "linear-gradient(120deg, #060a08 0%, #0e2c20 55%, #116a4b 100%)",
    badge: { ru: "Комплексные поставки", uz: "Kompleks yetkazib berish", en: "Turnkey supply" },
    title: { ru: "Комплексное оснащение медицинских учреждений", uz: "Tibbiyot muassasalarini kompleks jihozlash", en: "Comprehensive equipping of medical institutions" },
    subtitle: { ru: "Медицинское оборудование, мебель и инструменты от ведущих производителей — с доставкой, монтажом и обучением персонала.", uz: "Yetakchi ishlab chiqaruvchilardan tibbiy uskunalar, mebel va asboblar — yetkazib berish, o'rnatish va o'qitish bilan.", en: "Medical equipment, furniture and instruments from leading manufacturers — with delivery, installation and staff training." },
    ctas: [
      { label: { ru: "Перейти в каталог", uz: "Katalogga o'tish", en: "Browse catalog" }, action: "catalog", style: "primary" },
      { label: { ru: "Связаться с нами", uz: "Bog'lanish", en: "Contact us" }, action: "contacts", style: "ghost" },
    ],
  },
  {
    id: "slide-registration",
    theme: "light",
    bg: "linear-gradient(135deg, #f5f9f7 0%, #d6f5e3 55%, #b0eacc 100%)",
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
    bg: "linear-gradient(120deg, #04100b 0%, #10543d 70%, #22a472 100%)",
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
.soi-chero-wrap { position:relative; z-index:1; min-height:100dvh; max-width:1200px; margin:0 auto;
  padding:0 24px; display:flex; align-items:center; }
.soi-chero-col { max-width:640px; padding:112px 0 96px; }
.soi-chero-slide.t-dark  .soi-chero-col { color:#fff; }
.soi-chero-slide.t-light .soi-chero-col { color:#0b2d25; }

.soi-chero-badge { font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; margin:0 0 12px; }
.soi-chero-slide.t-dark  .soi-chero-badge { color:#d0fa4d; }
.soi-chero-slide.t-light .soi-chero-badge { color:#6f9600; }

.soi-chero-h1 { font-size:clamp(30px,5vw,54px); font-weight:800; line-height:1.1; letter-spacing:-.03em; margin:0; }
.soi-chero-sub { font-size:clamp(16px,1.6vw,20px); line-height:1.6; margin:16px 0 0; }
.soi-chero-slide.t-dark  .soi-chero-sub { color:rgba(255,255,255,.9); }
.soi-chero-slide.t-light .soi-chero-sub { color:#374151; }

/* pill CTAs — lime primary with dark label, as on the source */
.soi-chero-cta { display:flex; flex-wrap:wrap; gap:12px; margin-top:32px; }
.soi-chero-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px;
  padding:14px 26px; border-radius:999px; font-family:inherit; font-size:15.5px; font-weight:700;
  cursor:pointer; border:1px solid transparent; transition:background .2s, color .2s, border-color .2s, transform .18s; }
.soi-chero-btn:hover { transform:translateY(-2px); }
.soi-chero-btn.primary { background:#b8f500; color:#0b2d25; }
.soi-chero-btn.primary:hover { background:#c5ff19; }
.soi-chero-btn .arr { display:inline-flex; transition:transform .2s; }
.soi-chero-btn.primary:hover .arr { transform:translateX(4px); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost { background:transparent; color:#fff; border-color:rgba(255,255,255,.6); }
.soi-chero-slide.t-dark  .soi-chero-btn.ghost:hover { border-color:#c5ff19; color:#c5ff19; }
.soi-chero-slide.t-light .soi-chero-btn.ghost { background:transparent; color:#111827; border-color:rgba(17,24,39,.4); }
.soi-chero-slide.t-light .soi-chero-btn.ghost:hover { border-color:#6f9600; color:#6f9600; }
.soi-chero-btn:focus-visible { outline:2px solid #c5ff19; outline-offset:3px; }

/* staggered reveal, replayed per slide */
.soi-chero-anim { opacity:0; transform:translateY(16px);
  transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.soi-chero-slide.on .soi-chero-anim { opacity:1; transform:none; }

/* segmented progress bars with timer fill */
.soi-chero-bars { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); z-index:20;
  display:flex; gap:12px; width:100%; max-width:1200px; padding:0 24px; }
.soi-chero-bar { position:relative; height:16px; width:96px; max-width:20%; padding:0;
  background:none; border:none; cursor:pointer; }
.soi-chero-bar-track { position:absolute; left:0; top:50%; transform:translateY(-50%);
  height:3px; width:100%; border-radius:999px; overflow:hidden; transition:background .2s; }
.soi-chero-stage.t-dark  .soi-chero-bar-track { background:rgba(255,255,255,.25); }
.soi-chero-stage.t-light .soi-chero-bar-track { background:rgba(17,24,39,.2); }
.soi-chero-bar:hover .soi-chero-bar-track { background:rgba(197,255,25,.6); }
.soi-chero-bar:focus-visible .soi-chero-bar-track { outline:2px solid #c5ff19; outline-offset:2px; }
.soi-chero-bar-fill { position:absolute; inset:0 auto 0 0; display:block; background:#b8f500;
  animation:soiCheroBar linear forwards; }
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
    { ic: "grid",  cls: "s1", bg: "#e7f1ff", c: "#1757c8",
      t: lv("2 800+ позиций", "2 800+ pozitsiya", "2,800+ items"),
      d: lv("в наличии и под заказ", "mavjud va buyurtmaga", "in stock & to order"),
      act: () => go("catalog", {}) },
    { ic: "check", cls: "s2", bg: "#e6f8f0", c: "#1b9e58",
      t: lv("120+ брендов", "120+ brend", "120+ brands"),
      d: lv("официальные поставки", "rasmiy yetkazib berish", "official supply"),
      act: () => go("brands", {}) },
    { ic: "truck", cls: "s3", bg: "#eafaff", c: "#0d96be",
      t: lv("Доставка в 14 регионов", "14 hududga yetkazish", "Delivery to 14 regions"),
      d: lv("монтаж и пусконаладка", "montaj va ishga tushirish", "installation & setup"),
      act: () => go("info", { p: "shipping" }) },
    { ic: "doc",   cls: "s4", bg: "#f0eefe", c: "#6454d4",
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

function Footer({ t, lang, go, setLang }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const contacts = useSiteContacts();
  const [subscribed, setSubscribed] = useState(false);
  const coNav = (view) => {
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: "soi-conav", view }, "*");
    else location.href = "soi.uz.html#/" + (view === "home" ? "" : view);
  };
  const onSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    e.target.reset();
  };
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fcols">
          <div>
            <div className="f-brand">
              <img className="foot-logo" src={window.__asset("assets/soi-mark.svg")} alt="ИНДУСТРИЯ ЗДОРОВЬЯ" style={{ width: 40, height: 40 }} />
              <span className="f-wordmark">{lv("ИНДУСТРИЯ ЗДОРОВЬЯ", "SOG'LIQ INDUSTRIYASI", "HEALTH INDUSTRY")}</span>
            </div>
            <p className="fabout">{t.foot_about}</p>
            <a className="cb-phone" href={telHref(contacts.phone)} style={{ fontWeight: 800, fontSize: 20 }}>{contacts.phone}</a>
          </div>
          <div>
            <h5>{lv("Компания", "Kompaniya", "Company")}</h5>
            <ul>
              <li><a onClick={() => coNav("about")}>{lv("О компании", "Kompaniya haqida", "About")}</a></li>
              <li><a onClick={() => coNav("services")}>{lv("Услуги", "Xizmatlar", "Services")}</a></li>
              <li><a onClick={() => coNav("projects")}>{lv("Проекты", "Loyihalar", "Projects")}</a></li>
              <li><a onClick={() => coNav("partners")}>{lv("Бренды / партнёры", "Brendlar / hamkorlar", "Brands / partners")}</a></li>
              <li><a onClick={() => go("catalog", {})}>{lv("Электронный каталог", "Elektron katalog", "Online catalog")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{lv("Документы и право", "Hujjatlar va huquq", "Documents & legal")}</h5>
            <ul>
              <li><a onClick={() => coNav("licenses")}>{lv("Лицензии и сертификаты", "Litsenziya va sertifikatlar", "Licenses & certificates")}</a></li>
              <li><a href={window.__asset("assets/company-card.pdf")} target="_blank" rel="noopener">{lv("Карточка компании", "Kompaniya kartasi", "Company card")}</a></li>
              <li><a href={window.__asset("assets/registration.pdf")} target="_blank" rel="noopener">{lv("Свидетельство о регистрации", "Ro'yxatdan o'tish guvohnomasi", "Registration certificate")}</a></li>
              <li><a href={window.__asset("assets/egrul.pdf")} target="_blank" rel="noopener">{lv("Сведения о юридическом лице", "Yuridik shaxs ma'lumotlari", "Legal entity information")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t.foot_contacts}</h5>
            <ul className="foot-contact">
              <li>{contacts.address}</li>
              <li><a className="fc-map" href={contacts.mapUrl} target="_blank" rel="noopener">
                <Icon name="pin" size={14} />
                {lv("Показать на карте", "Xaritada ko'rsatish", "Show on map")}
              </a></li>
              <li><a href={telHref(contacts.phone)}>{lv("Приёмная", "Qabulxona", "Reception")}: {contacts.phone}</a></li>
              <li><a href={telHref(contacts.phone2)}>{lv("Отдел продаж", "Sotuv bo'limi", "Sales")}: {contacts.phone2}</a></li>
              <li><a href={"mailto:" + contacts.email}>{contacts.email}</a></li>
            </ul>
          </div>
          <div className="foot-news-col">
            <h5>{lv("Рассылка", "Yangiliklar", "Newsletter")}</h5>
            <p>{lv("Новости, акции и поступления оборудования — не чаще раза в неделю.", "Yangiliklar, aksiyalar va yangi uskunalar — haftada bir martadan ko'p emas.", "Product updates and offers — no more than once a week.")}</p>
            <form className="foot-news" onSubmit={onSubscribe}>
              <input type="email" required placeholder={lv("Ваш email", "Emailingiz", "Your email")} aria-label={lv("Email для рассылки", "Yangiliklar uchun email", "Newsletter email")} />
              <button type="submit" aria-label={lv("Подписаться", "Obuna bo'lish", "Subscribe")}>
                <Icon name="arrowRight" size={16} />
              </button>
            </form>
            {subscribed && (
              <div className="foot-news-ok">
                <Icon name="check" size={14} sw={2.6} />
                {lv("Спасибо! Вы подписаны.", "Rahmat! Siz obuna bo'ldingiz.", "Thanks! You're subscribed.")}
              </div>
            )}
            <div className="foot-lang" role="group" aria-label={lv("Язык сайта", "Sayt tili", "Site language")}>
              <button type="button" className={lang === "ru" ? "on" : ""} onClick={() => setLang && setLang("ru")}>RU</button>
              <button type="button" className={lang === "uz" ? "on" : ""} onClick={() => setLang && setLang("uz")}>UZ</button>
              <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang && setLang("en")}>EN</button>
            </div>
          </div>
        </div>
        <div className="foot-disclaimer">
          {lang === "uz"
            ? "Saytdagi hujjatlar tasvirlari va texnik xususiyatlar ma'lumot uchun berilgan va majburiyat hisoblanmaydi. Uskunadan foydalanishdan oldin foydalanish yo'riqnomasi bilan tanishing yoki mutaxassis bilan maslahatlashing."
            : lang === "en"
            ? "Document images and technical specifications on the site are for reference only and do not constitute an obligation. Before using the equipment, read the instructions for use or consult a specialist."
            : "Информация, изображения документов и технические характеристики на сайте носят справочный характер и не являются публичной офертой. Перед применением оборудования ознакомьтесь с инструкцией по эксплуатации или проконсультируйтесь со специалистом."}
        </div>
        <div className="foot-bot">
          <span style={{fontSize:12,color:"#8095ab"}}>
            {lang === "uz" ? `«SOG’LIQ INDUSTRIYASI» MChJ • 100069, Toshkent • STIR: 312513138 • ${contacts.phone} • ${contacts.email}` : lang === "en" ? `LLC «HEALTH INDUSTRY» (SOG’LIQ INDUSTRIYASI MCHJ) • 100069, Tashkent • TIN: 312513138 • ${contacts.phone} • ${contacts.email}` : `ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» (SOG’LIQ INDUSTRIYASI MCHJ) • 100069, Ташкент • ИНН: 312513138 • ${contacts.phone} • ${contacts.email}`}
          </span>
          <div className="foot-socials">
            <a href={contacts.telegram} target="_blank" rel="noopener" title="Telegram" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.07 9.74c-.15.68-.56.85-1.13.53l-3.13-2.3-1.51 1.45c-.17.17-.31.31-.63.31l.22-3.18 5.79-5.23c.25-.22-.06-.35-.39-.12L6.07 13.88l-3.07-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.83.88z"/></svg>
            </a>
            <a href={contacts.instagram} target="_blank" rel="noopener" title="Instagram" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href={contacts.facebook} target="_blank" rel="noopener" title="Facebook" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href={contacts.youtube} target="_blank" rel="noopener" title="YouTube" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
            </a>
          </div>

        </div>
      </div>
    </footer>);

}

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
/* ── tokens ─────────────────────────────────────────── */
.sx { --sx-ink:#0B1B33; --sx-ink-soft:#37475E; --sx-mute:#475569;
  --sx-line:#D6DEEA; --sx-line-2:#E2E8F1; --sx-card:#FFFFFF; --sx-bg:#FFFFFF; --sx-bg-soft:#F4F7FB;
  --sx-blue:#0E4AC6; --sx-blue-2:#1d7ed8; --sx-cyan:#14B8E0; --sx-violet:#6454D4; --sx-green:#15A06A; --sx-amber:#E0492F;
  --sx-shadow:0 1px 2px rgba(11,27,51,.05), 0 8px 24px rgba(11,27,51,.09);
  --sx-shadow-lg:0 4px 12px rgba(11,27,51,.08), 0 24px 56px rgba(11,27,51,.16);
  --sx-r:18px; --sx-r-sm:12px;
  font-family:'Manrope',system-ui,-apple-system,sans-serif; }
[data-theme="dark"] .sx { --sx-ink:#EAF1FB; --sx-ink-soft:#B6C4D6; --sx-mute:#8294AB;
  --sx-line:#1E2D42; --sx-line-2:#16243A; --sx-card:#0F1D2F; --sx-bg:#0A1320; --sx-bg-soft:#0C1726;
  --sx-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.35);
  --sx-shadow-lg:0 4px 12px rgba(0,0,0,.4), 0 24px 56px rgba(0,0,0,.55); }

.sx { background:var(--sx-bg); color:var(--sx-ink); }
.sx *, .sx *::before, .sx *::after { box-sizing:border-box; }
.sx-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
.sx-section { padding:clamp(64px,8vw,108px) 0; position:relative; }
.sx-section.soft { background:var(--sx-bg-soft); }

/* reveal */
.sx-rv { opacity:0; transform:translateY(26px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); transition-delay:calc(var(--i,0) * 70ms); }
.sx-in { opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ .sx-rv{ transition:none; opacity:1; transform:none; } }

/* heads */
.sx-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--sx-blue); }
.sx-eyebrow::before { content:""; width:22px; height:2px; border-radius:2px; background:linear-gradient(90deg,var(--sx-blue),var(--sx-cyan)); }
.sx-h2 { font-size:clamp(28px,3.8vw,46px); font-weight:800; line-height:1.08; letter-spacing:-.028em; color:var(--sx-ink); margin:16px 0 0; }
.sx-sub { font-size:clamp(15.5px,1.5vw,18px); line-height:1.62; color:var(--sx-mute); margin-top:16px; max-width:620px; }
.sx-head { margin-bottom:48px; }
.sx-head.center { text-align:center; }
.sx-head.center .sx-sub { margin-left:auto; margin-right:auto; }
.sx-head.center .sx-eyebrow::before { display:none; }

/* link */
.sx-link { display:inline-flex; align-items:center; gap:6px; font-size:15px; font-weight:700; color:var(--sx-blue); cursor:pointer; transition:gap .2s, color .2s; }
.sx-link:hover { gap:11px; color:var(--sx-blue-2); }

/* ── ecosystem bento ────────────────────────────────────
   Deep-ground tiles reading as one island on the light page. Each tile carries a
   hue of its own (--eco-h/--eco-a); everything inside is built from white alphas
   over that ground, so a tile stays coherent whatever its colour. */
.eco-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:16px;
  grid-template-areas:
    "catalog  catalog  catalog  training training training"
    "tender   tender   tender   tender   tender   tender"
    "brands   brands   service  service  delivery delivery"; }
.eco-t { --eco-h:#0B2E7A; --eco-a:#5C9DFF;
  position:relative; grid-area:var(--eco-area); isolation:isolate; display:flex; flex-direction:column;
  padding:26px; border-radius:22px; overflow:hidden; color:#fff;
  background:
    radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--eco-a) 26%, transparent), transparent 58%),
    linear-gradient(150deg, color-mix(in srgb, var(--eco-h) 88%, #000) 0%, var(--eco-h) 55%, color-mix(in srgb, var(--eco-h) 72%, #000) 100%);
  box-shadow:0 1px 0 0 rgba(255,255,255,.10) inset, 0 18px 40px -22px color-mix(in srgb, var(--eco-h) 80%, #000); }
.eco-t.catalog { --eco-area:catalog; --eco-h:#0B2E7A; --eco-a:#5C9DFF; }
.eco-t.training { --eco-area:training; --eco-h:#0A4A33; --eco-a:#37D89B; }
.eco-t.tender { --eco-area:tender; --eco-h:#2B1D6B; --eco-a:#A98BFF; }
.eco-t.brands { --eco-area:brands; --eco-h:#5C2410; --eco-a:#FF9257; }
.eco-t.service { --eco-area:service; --eco-h:#0A3A52; --eco-a:#43CFF0; }
.eco-t.delivery { --eco-area:delivery; --eco-h:#0E2E63; --eco-a:#6FB0FF; }

/* head: icon + optional corner badge */
/* The slack collects under the icon, so every tile reads as "mark on top,
   content block anchored to the bottom" instead of pooling a void above the CTA
   whenever a tile carries less content than its neighbour. */
.eco-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:auto; }
.eco-ic { width:44px; height:44px; border-radius:13px; display:flex; align-items:center; justify-content:center; flex:0 0 auto;
  background:color-mix(in srgb, var(--eco-a) 22%, transparent); color:var(--eco-a); border:1px solid color-mix(in srgb, var(--eco-a) 26%, transparent); }
.eco-badge { display:inline-flex; align-items:center; gap:7px; padding:7px 11px; border-radius:11px; font-size:12px; font-weight:700;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.14); color:rgba(255,255,255,.86); }
.eco-badge b { font-size:15px; font-weight:800; font-variant-numeric:tabular-nums; color:#fff; }

/* numbers + copy */
.eco-num { margin-top:20px; font-size:clamp(38px,4.4vw,54px); font-weight:800; line-height:.95; letter-spacing:-.035em;
  font-variant-numeric:tabular-nums; color:#fff; }
.eco-num span { color:var(--eco-a); }
.eco-t h3 { margin:12px 0 0; font-size:19px; font-weight:800; letter-spacing:-.012em; line-height:1.25; color:#fff; text-wrap:balance; }
.eco-t.catalog h3 { font-size:23px; }
.eco-t p { margin:9px 0 0; font-size:14px; line-height:1.55; color:rgba(255,255,255,.72); max-width:44ch; }

/* metric strip — hidden entirely when the editor leaves it blank */
.eco-metrics { display:flex; flex-wrap:wrap; gap:9px; margin-top:20px; }
.eco-m { flex:1 1 96px; min-width:96px; padding:11px 13px; border-radius:13px;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.11); }
.eco-m-v { font-size:20px; font-weight:800; letter-spacing:-.02em; font-variant-numeric:tabular-nums; color:#fff; }
/* "закрываются" is wider than a third of a phone screen — let it break rather
   than spill out of its card. */
.eco-m-l { margin-top:3px; font-size:11.5px; line-height:1.35; color:rgba(255,255,255,.62); overflow-wrap:anywhere; }

/* actions */
.eco-foot { padding-top:20px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.eco-cta { display:inline-flex; align-items:center; gap:9px; padding:11px 17px; border-radius:12px; border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.10); color:#fff; font-size:13.5px; font-weight:700; cursor:pointer; text-align:left;
  transition:background .2s, border-color .2s, gap .2s; }
.eco-cta:hover { background:rgba(255,255,255,.17); border-color:rgba(255,255,255,.3); gap:13px; }
.eco-cta.solid { background:var(--eco-a); border-color:transparent; color:#08182F; }
.eco-cta.solid:hover { background:color-mix(in srgb, var(--eco-a) 84%, #fff); }
.eco-t :is(a,button):focus-visible { outline:2px solid #fff; outline-offset:3px; border-radius:12px; }

/* catalog tile: search + category chips carrying real counts */
.eco-search { display:flex; align-items:center; gap:10px; margin-top:22px; padding:12px 14px; border-radius:13px;
  background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.14); color:rgba(255,255,255,.55); font-size:13.5px; cursor:pointer; width:100%;
  text-align:left; font-family:inherit; }
.eco-search svg { flex:0 0 auto; }
.eco-search:hover { background:rgba(255,255,255,.14); }
.eco-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.eco-chip { display:inline-flex; align-items:center; gap:8px; padding:9px 12px; border-radius:11px; cursor:pointer;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.9); font-size:12.5px; font-weight:600;
  transition:background .2s, border-color .2s; }
.eco-chip:hover { background:rgba(255,255,255,.15); border-color:color-mix(in srgb, var(--eco-a) 55%, transparent); }
.eco-chip i { font-style:normal; font-size:11px; font-variant-numeric:tabular-nums; color:rgba(255,255,255,.5); }

/* ── tenders: a monitoring service, shown as one ──────────
   Five counters, then three panels: which platforms we watch, what the feed
   is made of, and the one lot closing next. Every figure here is aggregated
   server-side; nothing on this tile is illustrative. */
.eco-t.tender { padding:24px; }
.tnd-top { display:grid; grid-template-columns:auto 1fr auto; align-items:start; gap:14px; }
.tnd-titles { min-width:0; }
.tnd-eyebrow { display:block; font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--eco-a); }
.eco-t.tender h3 { margin:5px 0 0; font-size:23px; }
.eco-t.tender > p { margin-top:10px; max-width:62ch; }

.tnd-kpis { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-top:18px; }
.tnd-kpi { padding:12px 13px; border-radius:13px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.11); }
.tnd-kpi-v { font-size:25px; font-weight:800; line-height:1.05; letter-spacing:-.03em; font-variant-numeric:tabular-nums; }
.tnd-kpi-l { margin-top:3px; font-size:11px; line-height:1.32; color:rgba(255,255,255,.62); }

.tnd-cols { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr); gap:12px; margin-top:12px; align-items:stretch; }
.tnd-panel { border-radius:16px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.11); padding:14px 15px; display:flex; flex-direction:column; }
.tnd-panel-h { display:flex; align-items:baseline; justify-content:space-between; gap:10px; font-size:12.5px; font-weight:700; color:rgba(255,255,255,.86); }
.tnd-panel-h span { font-size:10.5px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:rgba(255,255,255,.42); font-variant-numeric:tabular-nums; }

/* platforms — each row links out to the source it is quoting */
.tnd-srcs { display:flex; flex-direction:column; gap:1px; margin-top:8px; }
.tnd-src { display:grid; grid-template-columns:auto 1fr auto; align-items:baseline; gap:9px; padding:7px 0;
  border-bottom:1px solid rgba(255,255,255,.06); color:rgba(255,255,255,.9); text-decoration:none; transition:color .18s; }
.tnd-src:last-of-type { border-bottom:0; }
.tnd-src:hover { color:#fff; }
.tnd-src:hover .tnd-src-n { text-decoration:underline; }
.tnd-src:focus-visible { outline:2px solid #fff; outline-offset:2px; border-radius:6px; }
.tnd-src::before { content:""; width:6px; height:6px; border-radius:50%; background:#3BE38B; align-self:center; }
.tnd-src.off::before { background:rgba(255,255,255,.28); }
.tnd-src-n { font-size:12.5px; font-weight:600; }
.tnd-src-d { grid-column:2; font-size:10.5px; line-height:1.35; color:rgba(255,255,255,.45); margin-top:2px; }
.tnd-src i { font-style:normal; font-size:11.5px; font-variant-numeric:tabular-nums; color:rgba(255,255,255,.5); }
.tnd-src.off i { color:rgba(255,255,255,.32); }
.tnd-foot { margin-top:auto; padding-top:12px; font-size:11px; line-height:1.4; color:rgba(255,255,255,.45); }

/* categories */
.tnd-cats { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; }
.tnd-cat {
  display:flex; flex-direction:column; gap:3px; padding:10px 11px; border-radius:12px; cursor:pointer;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10); color:inherit; font:inherit; text-align:left;
  transition:background .18s, border-color .18s;
}
.tnd-cat:hover { background:rgba(255,255,255,.13); border-color:color-mix(in srgb, var(--eco-a) 50%, transparent); }
.tnd-cat:focus-visible { outline:2px solid #fff; outline-offset:2px; }
.tnd-cat.wide { grid-column:1 / -1; }
.tnd-cat.zero { opacity:.5; }
.tnd-cat-h { display:flex; align-items:center; gap:7px; font-size:11.5px; line-height:1.25; color:rgba(255,255,255,.74); }
.tnd-cat-h svg { flex:0 0 auto; }
.tnd-cat-v { font-size:18px; font-weight:800; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
.tnd-cat-s { font-size:11px; font-variant-numeric:tabular-nums; color:rgba(255,255,255,.5); }

/* closing lot */
.tnd-lot-t { margin-top:10px; font-size:13.5px; font-weight:700; line-height:1.35;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.tnd-lot-c { margin-top:5px; font-size:11.5px; line-height:1.35; color:rgba(255,255,255,.55);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.tnd-lot-s { margin-top:auto; padding-top:12px; font-size:21px; font-weight:800; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
.tnd-lot-d { margin-top:3px; font-size:11.5px; font-variant-numeric:tabular-nums; color:rgba(255,255,255,.58); }
.tnd-lot-d.urgent { color:#FFB25C; font-weight:700; }

@media (max-width:1080px) {
  .tnd-kpis { grid-template-columns:repeat(3,1fr); }
  .tnd-cols { grid-template-columns:1fr; }
}
@media (max-width:680px) {
  .tnd-top { grid-template-columns:auto 1fr; }
  .tnd-top .eco-live { grid-column:1 / -1; justify-self:start; }
  .tnd-kpis { grid-template-columns:repeat(2,1fr); gap:8px; }
  .tnd-kpi-v { font-size:21px; }
}

.eco-map { padding-top:18px; width:100%; height:auto; display:block; overflow:visible; }
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
}

@media (max-width:1080px) {
  .eco-grid { grid-template-columns:repeat(2,1fr);
    grid-template-areas:"catalog catalog" "training training" "tender tender" "brands service" "delivery delivery"; }
  .eco-tender-cols { grid-template-columns:1fr; }
}
@media (max-width:680px) {
  .eco-grid { grid-template-columns:1fr;
    grid-template-areas:"catalog" "training" "tender" "brands" "service" "delivery"; gap:14px; }
  .eco-t, .eco-t.tender { padding:22px; border-radius:18px; }
  .eco-m { flex:1 1 100%; }
  /* KPIs stay three-up on a phone — stacking them would undo the height the
     block just gained — so they shed padding and a couple of type steps. */
  .eco-kpis { gap:8px; }
  .eco-kpis .eco-m { padding:10px; }
  .eco-kpis .eco-m-v { font-size:23px; }
  .eco-kpis .eco-m-l { font-size:10.5px; }
}

/* ── directions ─────────────────────────────────────── */
.sx-dir-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
.sx-dir { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); padding:26px 24px; cursor:pointer; transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s; }
.sx-dir:hover { transform:translateY(-4px); box-shadow:var(--sx-shadow-lg); }
.sx-dir-ic { width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
.sx-dir h3 { font-size:17px; font-weight:800; color:var(--sx-ink); letter-spacing:-.01em; line-height:1.25; }
.sx-dir-links { margin-top:14px; display:flex; flex-direction:column; gap:2px; }
.sx-dir-links a { font-size:13.5px; color:var(--sx-mute); padding:5px 0; transition:color .18s, padding-left .18s; }
.sx-dir-links a:hover { color:var(--sx-blue); padding-left:5px; }

/* ── impact band (dark interlude) ───────────────────── */
.sx-impact { position:relative; background:#050D1C; border-radius:28px; padding:clamp(40px,5vw,68px); overflow:hidden; }
.sx-impact-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 60% 80% at 15% 30%, rgba(14,74,198,.35),transparent 70%),
  radial-gradient(ellipse 50% 70% at 85% 70%, rgba(20,184,224,.25),transparent 65%),
  radial-gradient(ellipse 40% 60% at 60% 10%, rgba(100,84,212,.2),transparent 60%); }
.sx-impact-grid-ov { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px); background-size:44px 44px; -webkit-mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); }
.sx-impact-inner { position:relative; z-index:1; }
.sx-impact .sx-eyebrow { color:#8fc7ff; }
.sx-impact .sx-eyebrow::before { background:linear-gradient(90deg,#4d9fff,#14C8F5); }
.sx-impact h2 { font-size:clamp(26px,3.4vw,40px); font-weight:800; letter-spacing:-.028em; color:#fff; margin:16px 0 0; max-width:680px; line-height:1.1; }
.sx-impact-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:48px; }
.sx-metric-n { font-size:clamp(34px,4vw,52px); font-weight:800; letter-spacing:-.03em; line-height:1; color:#fff; }
.sx-metric-n .u { background:linear-gradient(120deg,#4d9fff,#14C8F5); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.sx-metric-l { font-size:14px; color:rgba(255,255,255,.55); margin-top:10px; line-height:1.4; }
.sx-metric { padding-left:20px; border-left:2px solid rgba(255,255,255,.12); }

/* ── brands pill list (2 rows, clipped) ───────────────── */
.sx-brands-title { display:inline-flex; align-items:center; gap:8px; }
.sx-brands-pills { display:flex; flex-wrap:wrap; gap:10px; max-height:96px; overflow:hidden; }
.sx-bpill { display:inline-flex; align-items:center; padding:11px 18px; border-radius:10px; background:var(--sx-bg-soft); color:var(--sx-ink-soft); font-size:14px; font-weight:600; white-space:nowrap; cursor:pointer; transition:background .18s, color .18s; }
.sx-bpill:hover { background:var(--sx-blue); color:#fff; }

/* ── proof / cases ──────────────────────────────────── */
.sx-cases { display:flex; flex-wrap:wrap; justify-content:center; gap:20px; }
.sx-case { flex:1 1 300px; max-width:calc(33.333% - 14px); min-width:280px; border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s; display:flex; flex-direction:column; }
.sx-case:hover { transform:translateY(-5px); box-shadow:var(--sx-shadow-lg); }
.sx-case-cover { aspect-ratio:16/10; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-case-cover img { width:100%; height:100%; object-fit:cover; }
.sx-case-body { padding:20px 22px; flex:1; display:flex; flex-direction:column; }
.sx-case-tag { display:inline-flex; align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--sx-blue); background:color-mix(in srgb,var(--sx-blue) 9%,transparent); padding:5px 11px; border-radius:7px; margin-bottom:11px; }
.sx-case h3 { font-size:17px; font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.01em; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sx-case p { font-size:14px; color:var(--sx-mute); line-height:1.55; margin:8px 0 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.sx-case-meta { display:flex; gap:18px; margin-top:auto; padding-top:14px; border-top:1px solid var(--sx-line-2); font-size:13px; color:var(--sx-mute); }
.sx-case-meta b { color:var(--sx-ink); }

/* ── news ───────────────────────────────────────────── */
.sx-news { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.sx-ncard { border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); overflow:hidden; cursor:pointer; transition:transform .3s, box-shadow .3s; }
.sx-ncard:hover { transform:translateY(-4px); box-shadow:var(--sx-shadow); }
.sx-ncard-cover { aspect-ratio:16/9; background:linear-gradient(135deg,var(--sx-bg-soft),var(--sx-line-2)); display:flex; align-items:center; justify-content:center; color:var(--sx-mute); overflow:hidden; }
.sx-ncard-cover img { width:100%; height:100%; object-fit:cover; }
.sx-ncard-body { padding:20px; }
.sx-ncard-date { font-size:12.5px; color:var(--sx-mute); font-weight:600; }
.sx-ncard h3 { font-size:16px; font-weight:700; color:var(--sx-ink); line-height:1.35; margin-top:8px; }

/* ── catalog portal ──────────────────────────────────── */
.sx-cp { position:relative; background:#050D1C; border-radius:28px; padding:clamp(36px,5vw,64px); overflow:hidden; }
.sx-cp-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 65% 90% at 5% 50%, rgba(14,74,198,.42), transparent 68%),
  radial-gradient(ellipse 55% 70% at 95% 25%, rgba(20,184,224,.28), transparent 63%),
  radial-gradient(ellipse 45% 65% at 55% 85%, rgba(100,84,212,.22), transparent 58%); pointer-events:none; }
.sx-cp-ov { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size:44px 44px; -webkit-mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); mask-image:radial-gradient(ellipse 90% 90% at 50% 0%,#000 30%,transparent 80%); pointer-events:none; }
.sx-cp-inner { position:relative; z-index:1; display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(28px,4vw,56px); align-items:center; }
.sx-cp-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#8fc7ff; }
.sx-cp-eyebrow::before { content:""; width:20px; height:2px; border-radius:2px; background:linear-gradient(90deg,#4d9fff,#14C8F5); }
.sx-cp-h2 { font-size:clamp(24px,3.2vw,40px); font-weight:800; letter-spacing:-.028em; color:#fff; margin:14px 0 0; line-height:1.1; }
.sx-cp-sub { font-size:clamp(14px,1.3vw,16px); color:rgba(255,255,255,.55); margin:14px 0 30px; line-height:1.65; }
.sx-cp-btn { display:inline-flex; align-items:center; gap:10px; height:54px; padding:0 30px; border-radius:14px; background:linear-gradient(135deg,#1d7ed8,#0E4AC6); color:#fff; font-size:15.5px; font-weight:700; border:none; cursor:pointer; transition:transform .18s,filter .18s,box-shadow .25s; box-shadow:0 8px 28px rgba(14,74,198,.45); font-family:inherit; }
.sx-cp-btn:hover { transform:translateY(-2px); filter:brightness(1.1); box-shadow:0 12px 36px rgba(14,74,198,.55); }
.sx-cp-tiles { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.sx-cp-tile { display:flex; align-items:center; gap:13px; padding:16px 18px; border-radius:14px; background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.09); cursor:pointer; text-align:left; transition:background .2s,border-color .2s,transform .22s cubic-bezier(.16,1,.3,1); }
.sx-cp-tile:hover { background:rgba(255,255,255,.1); border-color:color-mix(in srgb,var(--ta,#1d7ed8) 55%,rgba(255,255,255,.09)); transform:translateY(-3px); }
.sx-cp-tile-ic { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--ta,#1d7ed8) 20%,transparent); color:color-mix(in srgb,var(--ta,#1d7ed8) 85%,#fff); flex-shrink:0; }
.sx-cp-tile-t { flex:1; font-size:13.5px; font-weight:700; color:rgba(255,255,255,.88); line-height:1.3; }
.sx-cp-tile-arr { color:rgba(255,255,255,.35); transition:transform .2s,color .2s; flex-shrink:0; }
.sx-cp-tile:hover .sx-cp-tile-arr { transform:translate(3px,-2px); color:rgba(255,255,255,.7); }
@media(max-width:820px){ .sx-cp-inner{ grid-template-columns:1fr; } }
@media(max-width:480px){ .sx-cp-tiles{ grid-template-columns:1fr; } }

/* ── final CTA ──────────────────────────────────────── */
.sx-cta { position:relative; background:#050D1C; border-radius:28px; padding:clamp(48px,6vw,80px); overflow:hidden; text-align:center; }
.sx-cta-aurora { position:absolute; inset:0; background:
  radial-gradient(ellipse 70% 90% at 30% 20%, rgba(14,74,198,.4),transparent 70%),
  radial-gradient(ellipse 60% 80% at 80% 90%, rgba(20,184,224,.28),transparent 65%); }
.sx-cta-inner { position:relative; z-index:1; }
.sx-cta h2 { font-size:clamp(30px,4vw,52px); font-weight:800; letter-spacing:-.03em; color:#fff; line-height:1.08; max-width:740px; margin:0 auto; }
.sx-cta p { font-size:17px; color:rgba(255,255,255,.6); margin:18px auto 0; max-width:520px; line-height:1.6; }
.sx-cta-actions { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:36px; }
.sx-btn { display:inline-flex; align-items:center; gap:9px; height:52px; padding:0 28px; border-radius:13px; font-size:15.5px; font-weight:700; cursor:pointer; border:none; font-family:inherit; transition:transform .15s, filter .15s, box-shadow .2s, background .2s; }
.sx-btn-primary { background:linear-gradient(135deg,#1d7ed8,#0E4AC6); color:#fff; box-shadow:0 8px 24px rgba(14,74,198,.4); }
.sx-btn-primary:hover { transform:translateY(-2px); filter:brightness(1.08); }
.sx-btn-ghost { background:rgba(255,255,255,.08); color:#fff; border:1.5px solid rgba(255,255,255,.2); }
.sx-btn-ghost:hover { background:rgba(255,255,255,.14); transform:translateY(-2px); }

/* ── reviews ─────────────────────────────────────────── */
.sx-rev-head { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:40px; }
.sx-rev-head-left h2 { display:flex; align-items:center; gap:8px; cursor:pointer; }
.sx-rev-head-left h2:hover { color:var(--sx-blue); }
.sx-rev-tabs { display:flex; gap:0; align-items:center; border-bottom:2px solid var(--sx-line); flex-shrink:0; }
.sx-rev-tab { padding:10px 20px; font-size:14.5px; font-weight:600; color:var(--sx-mute); background:transparent; border:none; cursor:pointer; font-family:inherit; position:relative; transition:color .18s; white-space:nowrap; }
.sx-rev-tab::after { content:""; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:var(--sx-blue); transform:scaleX(0); transition:transform .22s cubic-bezier(.16,1,.3,1); border-radius:2px 2px 0 0; }
.sx-rev-tab.on { color:var(--sx-ink); }
.sx-rev-tab.on::after { transform:scaleX(1); }
.sx-rev-tab:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; border-radius:4px 4px 0 0; }
.sx-rev-outer { display:flex; align-items:center; gap:14px; }
.sx-rev-arr { flex-shrink:0; width:44px; height:44px; border-radius:50%; border:1.5px solid var(--sx-line); background:var(--sx-card); color:var(--sx-ink); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s,border-color .18s,opacity .18s; }
.sx-rev-arr:hover:not(:disabled) { background:var(--sx-bg-soft); border-color:var(--sx-blue); color:var(--sx-blue); }
.sx-rev-arr:disabled { opacity:.3; cursor:default; }
.sx-rev-arr:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-overflow { flex:1; overflow:hidden; }
.sx-rev-track { display:flex; gap:20px; transition:transform .45s cubic-bezier(.16,1,.3,1); }
.sx-rev-card { flex:0 0 calc(50% - 10px); display:flex; gap:22px; align-items:flex-start; background:var(--sx-card); border:1px solid var(--sx-line); border-radius:var(--sx-r); padding:24px 26px; }
.sx-rev-doc { flex-shrink:0; width:134px; aspect-ratio:210/297; border-radius:6px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,.12); background:#fff; cursor:pointer; transition:transform .2s,box-shadow .2s; }
.sx-rev-doc:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,0,0,.18); }
.sx-rev-doc:focus-visible { outline:2px solid var(--sx-blue); outline-offset:2px; }
.sx-rev-doc > img, .sx-rev-doc > svg { width:100%; height:100%; display:block; }
.sx-rev-doc > img { object-fit:cover; object-position:top; }
.sx-rev-body { flex:1; min-width:0; display:flex; flex-direction:column; }
.sx-rev-badges { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:12px; }
.sx-rev-badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--sx-blue); border:1.5px solid color-mix(in srgb,var(--sx-blue) 28%,transparent); border-radius:7px; padding:4px 10px; line-height:1.3; }
.sx-rev-org { font-size:16px; font-weight:800; color:var(--sx-ink); line-height:1.25; letter-spacing:-.015em; margin:0 0 10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sx-rev-quote { font-size:14px; line-height:1.65; color:var(--sx-mute); flex:1; margin:0; display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; }
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
.sx-btn:focus-visible { outline:3px solid #1d7ed8; outline-offset:3px; }
.sx-cp-tile:focus-visible,
.sx-dir:focus-visible,
.sx-bpill:focus-visible,
.sx-case:focus-visible,
.sx-ncard:focus-visible { outline:2px solid var(--sx-blue,#1d7ed8); outline-offset:2px; border-radius:inherit; }
.soi-search-input:focus-visible { outline:2px solid var(--sx-blue,#1d7ed8); outline-offset:0; }
@media (prefers-reduced-motion: reduce) {
  .sx-cp-btn, .sx-cp-tile, .eco-t, .eco-cta, .eco-chip, .sx-dir, .sx-bpill, .sx-case, .sx-ncard,
  .sx-btn { transition:none !important; transform:none !important; }
  .eco-live::before { animation:none !important; }
}

/* ── responsive ─────────────────────────────────────── */
@media (max-width:980px){
  .sx-bento { grid-template-columns:repeat(2,1fr); grid-template-areas:
    "catalog catalog" "reg reg" "tender service" "brands equip"; }
  .sx-dir-grid { grid-template-columns:repeat(2,1fr); }
  .sx-impact-grid { grid-template-columns:repeat(2,1fr); gap:32px 24px; }
  .sx-cases, .sx-news { grid-template-columns:1fr; }
}
@media (max-width:560px){
  .sx-bento { grid-template-columns:1fr; grid-template-areas:"catalog" "reg" "tender" "service" "brands" "equip"; }
  .sx-dir-grid { grid-template-columns:1fr; }
  .sx-impact-grid { grid-template-columns:1fr 1fr; }
  .sx-impact, .sx-cta { border-radius:20px; }
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
  catalog_num: "2 800", catalog_unit: "+",
  training_num: "1000", training_unit: "+",
  service_num: "50", service_unit: "+",
  brands_num: "120", brands_unit: "+",
  // The delivery tile carries the map alone — no metrics, no CTA.
  delivery_num: "14", delivery_unit: "",
};

/* Live figures. One small request per source; every one of them may fail without
   taking the block down — the tiles simply fall back to their editable numbers. */
function useEcoPulse() {
  const [pulse, setPulse] = useState({ stats: null, platforms: [], cats: [], closing: null, brands: [], products: null });
  useEffect(() => {
    const api = window.api;
    if (!api || !api.listPublic) return;
    let alive = true;
    const put = (patch) => { if (alive) setPulse((p) => ({ ...p, ...patch })); };
    const ok = (p, fn) => p.then(fn).catch(() => {});

    ok(api.listPublic("etender/stats"), (r) => put({ stats: r }));
    ok(api.listPublic("etender/platforms"), (r) => put({ platforms: Array.isArray(r) ? r : [] }));
    ok(api.listPublic("etender/categories"), (r) => put({ cats: Array.isArray(r) ? r : [] }));
    /* Only the closing-soonest lot is needed now that the tile shows categories
       instead of a lot list — the default ordering would hand back the lot with
       the furthest deadline, which is the opposite of what the panel claims. */
    ok(api.listPublic("etender/lots", { state: "active", limit: 1, page: 1, sort: "closing" }), (r) => put({ closing: ((r && r.data) || [])[0] || null }));
    ok(api.listPublic("brands", { limit: 6, page: 1 }), (r) => put({ brands: (r && r.data) || (Array.isArray(r) ? r : []) }));
    ok(api.listPublic("products", { limit: 1, page: 1 }), (r) => put({ products: (r && r.total) || 0 }));
    return () => { alive = false; };
  }, []);
  return pulse;
}

/* 14,2 млрд UZS — procurement sums run to eleven digits, so they are only
   readable rounded to a unit. */
function ecoSum(value, code, lang) {
  const v = Number(value);
  if (!isFinite(v) || v <= 0) return "";
  const unit = (k) => _lv(lang, { b: "млрд", m: "млн" }[k], { b: "mlrd", m: "mln" }[k], { b: "bn", m: "mn" }[k]);
  const cut = (n) => n.toFixed(1).replace(/\.0$/, "").replace(".", _lv(lang, ",", ",", "."));
  const cur = code || "UZS";
  if (v >= 1e9) return `${cut(v / 1e9)} ${unit("b")} ${cur}`;
  if (v >= 1e6) return `${cut(v / 1e6)} ${unit("m")} ${cur}`;
  return `${Math.round(v).toLocaleString("ru-RU")} ${cur}`;
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

function ecoDate(d) {
  if (!d) return "";
  const t = new Date(d);
  return isNaN(t) ? "" : t.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* A date tells you nothing at a glance; "через 2 дн" does. Inside a week the
   deadline counts down, and the last three days read as urgent. */
function ecoDeadline(iso, lang) {
  if (!iso) return { text: "", urgent: false };
  const t = new Date(iso);
  if (isNaN(t)) return { text: "", urgent: false };
  const days = Math.ceil((t.getTime() - Date.now()) / 86400000);
  // `countdown` marks a phrase like "через 2 дн" — callers that already print the
  // date append it only then, instead of showing the same date twice.
  if (days < 0) return { text: ecoDate(iso), urgent: false, countdown: false };
  if (days === 0) return { text: _lv(lang, "сегодня", "bugun", "today"), urgent: true, countdown: true };
  if (days === 1) return { text: _lv(lang, "завтра", "ertaga", "tomorrow"), urgent: true, countdown: true };
  if (days <= 7) return { text: _lv(lang, `через ${days} дн`, `${days} kundan`, `in ${days} d`), urgent: days <= 3, countdown: true };
  return { text: ecoDate(iso), urgent: false, countdown: false };
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

function SoiEcosystem({ lang, go }) {
  const eco = useHomeSetting("homepage_ecosystem", ECO_DEFAULTS);
  const pulse = useEcoPulse();
  /* A key the editor has saved wins even when it is empty — clearing a metric in
     the admin is how you hide it. Only a key that was never configured at all
     falls back to the default, so a fresh install still shows a full block. */
  const val = (f) => (eco && Object.prototype.hasOwnProperty.call(eco, f) ? eco[f] : ECO_DEFAULTS[f]);

  const cats = (window.DATA && window.DATA.CATEGORIES || []).slice(0, 5);
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
  /* The card shows the lot closing soonest — a different lot from the "just
     published" table, and a reason to click that the table does not already
     give. Calling it "новое поступление" contradicted the counter beside it,
     which reads 0 on any day nothing was published. */
  const closing = pulse.closing;

  /* The live counters are only shown once they stop contradicting the headline
     claim — an empty catalog reporting «6» beside «2 800+» reads as a bug. */
  const liveProducts = pulse.products != null && pulse.products >= 100 ? pulse.products : null;
  const brandWall = pulse.brands.filter((b) => b && b.name).slice(0, 5);
  const showWall = brandWall.length >= 3;


  return (
    <section className="sx-section">
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
            <div className="eco-num">{val("catalog_num")}<span>{val("catalog_unit")}</span></div>
            <h3>{_lv(lang, "Электронный каталог оборудования", "Elektron uskunalar katalogi", "Electronic equipment catalog")}</h3>
            <p>{_lv(lang,
              "Медтехника, мебель, инструменты и расходные материалы от ведущих мировых производителей.",
              "Tibbiy texnika, mebel, asboblar va sarf materiallari — yetakchi jahon ishlab chiqaruvchilaridan.",
              "Equipment, furniture, instruments and consumables from leading global manufacturers.")}</p>
            <button className="eco-search" onClick={() => go("catalog")}>
              <Icon name="search" size={16} />
              {_lv(lang, "Поиск оборудования, бренда, категории…", "Uskuna, brend, kategoriya qidirish…", "Search equipment, brand, category…")}
            </button>
            <div className="eco-chips">
              {cats.map((c) => (
                <button className="eco-chip" key={c.id} onClick={() => go("catalog", { cat: c.id })}>
                  <Icon name={c.icon} size={14} />
                  {_lv(lang, c.ru, c.uz || c.ru, c.en || c.ru)}
                  {c.count ? <i>{c.count}</i> : null}
                </button>
              ))}
            </div>
            <div className="eco-foot">
              <button className="eco-cta solid" onClick={() => go("catalog")}>
                {_lv(lang, "Перейти в каталог", "Katalogga o'tish", "Open the catalog")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── training ── */}
          <article className="eco-t training sx-rv">
            <div className="eco-head"><div className="eco-ic"><Icon name="user" size={22} /></div></div>
            <div className="eco-num">{val("training_num")}<span>{val("training_unit")}</span></div>
            <h3>{_lv(lang, "Обученных специалистов", "O'qitilgan mutaxassislar", "Trained specialists")}</h3>
            <p>{_lv(lang,
              "Обучаем персонал клиник работе с поставленным оборудованием — очно и онлайн.",
              "Klinika xodimlarini yetkazib berilgan uskunalar bilan ishlashga o'rgatamiz — joyida va onlayn.",
              "We train clinic staff to operate the delivered equipment — on-site and online.")}</p>
            <div className="eco-foot">
              <button className="eco-cta" onClick={() => go("services")}>
                {_lv(lang, "Обучение персонала", "Xodimlarni o'qitish", "Staff training")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── tenders: the one fully live tile ── */}
          <article className="eco-t tender sx-rv">
            <div className="tnd-top">
              <div className="eco-ic"><Icon name="pulse" size={22} /></div>
              <div className="tnd-titles">
                <span className="tnd-eyebrow">
                  {_lv(lang, "Мониторинг государственных закупок", "Davlat xaridlari monitoringi", "Public procurement monitoring")}
                </span>
                <h3>{_lv(lang, "Тендеры и государственные закупки", "Tender va davlat xaridlari", "Tenders & public procurement")}</h3>
              </div>
              {st && st.lastSyncAt && (
                <div className="eco-live">
                  LIVE · {_lv(lang, "обновлено", "yangilandi", "updated")} {ecoAgo(st.lastSyncAt, lang)}
                </div>
              )}
            </div>

            <p>{_lv(lang,
              "Ежедневно собираем лоты с государственных площадок, раскладываем их по категориям и готовим предложения под требования закупки.",
              "Har kuni davlat maydonchalaridan lotlarni yig'amiz, kategoriyalarga ajratamiz va xarid talablariga mos takliflar tayyorlaymiz.",
              "We collect lots from the state platforms daily, sort them by category and prepare offers that match the procurement.")}</p>

            {/* Five counters, all aggregated server-side. No trend lines: we keep
                a single snapshot, so a sparkline here would be invented. */}
            <div className="tnd-kpis">
              {[
                { v: st ? st.active : "—", l: _lv(lang, "активных закупок", "faol xarid", "active lots") },
                { v: st ? st.newWeek : "—", l: _lv(lang, "новых за неделю", "haftada yangi", "new this week") },
                { v: st ? st.endingWeek : "—", l: _lv(lang, "закрываются за неделю", "hafta ichida yopiladi", "closing this week") },
                // Counted off the list below, not from stats: the server counts
                // feeds (Etender publishes two) and the panel counts platforms.
                { v: srcs.length || "—", l: _lv(lang, "площадок мониторинга", "kuzatilayotgan maydoncha", "platforms watched") },
                { v: st ? ecoShortSum(st.totalSum, lang) : "—", l: _lv(lang, "объём закупок в ленте", "lentadagi xaridlar hajmi", "volume in the feed") },
              ].map((k, i) => (
                <div className="tnd-kpi" key={i}>
                  <div className="tnd-kpi-v">{k.v}</div>
                  <div className="tnd-kpi-l">{k.l}</div>
                </div>
              ))}
            </div>

            <div className="tnd-cols">
              <div className="tnd-panel">
                <div className="tnd-panel-h">
                  {_lv(lang, "Площадки мониторинга", "Kuzatilayotgan maydonchalar", "Platforms watched")}
                  <span>{srcs.length}</span>
                </div>
                <div className="tnd-srcs">
                  {srcs.map((s) => (
                    <a
                      className={"tnd-src" + (s.count ? "" : " off")}
                      key={s.id}
                      href={s.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.site}
                    >
                      <span className="tnd-src-n">{s.name}</span>
                      <i>{s.count || "—"}</i>
                      <span className="tnd-src-d">{s.description && (s.description[lang] || s.description.ru)}</span>
                    </a>
                  ))}
                </div>
                <div className="tnd-foot">
                  {_lv(lang, "Данные обновляются ежедневно.", "Ma'lumotlar har kuni yangilanadi.", "Data refreshes daily.")}
                </div>
              </div>

              <div className="tnd-panel">
                <div className="tnd-panel-h">
                  {_lv(lang, "Категории закупок", "Xarid kategoriyalari", "Procurement categories")}
                  <span>{st ? st.active : ""}</span>
                </div>
                <div className="tnd-cats">
                  {tndCats.map((c, i) => (
                    <button
                      className={"tnd-cat" + (i === tndCats.length - 1 ? " wide" : "") + (c.count ? "" : " zero")}
                      key={c.id}
                      onClick={() => go("tenders", { cat: c.id })}
                      title={_lv(lang, "Открыть тендеры: ", "Tenderlarni ochish: ", "Open tenders: ") + c.label}
                    >
                      <span className="tnd-cat-h"><Icon name={c.icon} size={14} />{c.label}</span>
                      <span className="tnd-cat-v">{c.count}</span>
                      <span className="tnd-cat-s">{ecoShortSum(c.sum, lang)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {closing && (
                <div className="tnd-panel">
                  <div className="tnd-panel-h">
                    {_lv(lang, "Ближайший дедлайн", "Eng yaqin muddat", "Closing next")}
                    <span><Icon name="clock" size={12} /></span>
                  </div>
                  <div className="tnd-lot-t" title={closing.name}>{closing.name}</div>
                  <div className="tnd-lot-c">{closing.sellerName || closing.regionName || ""}</div>
                  <div className="tnd-lot-s">{ecoSum(closing.cost, closing.currencyCode, lang)}</div>
                  {(() => {
                    const dl = ecoDeadline(closing.endDate, lang);
                    return (
                      <div className={"tnd-lot-d" + (dl.urgent ? " urgent" : "")}>
                        {_lv(lang, "до", "gacha", "until")} {ecoDate(closing.endDate)}{dl.countdown ? " · " + dl.text : ""}
                      </div>
                    );
                  })()}
                  <div className="eco-foot">
                    <button className="eco-cta solid" onClick={() => go("tenders")}>
                      {_lv(lang, "Все тендеры", "Barcha tenderlar", "All tenders")}<Icon name="arrowRight" size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* ── brands ── */}
          <article className="eco-t brands sx-rv">
            <div className="eco-head"><div className="eco-ic"><Icon name="award" size={22} /></div></div>
            <div className="eco-num">{val("brands_num")}<span>{val("brands_unit")}</span></div>
            <h3>{_lv(lang, "Мировые бренды", "Jahon brendlari", "Global brands")}</h3>
            <p>{_lv(lang, "Официальные поставки от производителей из 12 стран.", "12 mamlakat ishlab chiqaruvchilaridan rasmiy yetkazib berish.", "Official supply from manufacturers across 12 countries.")}</p>
            {showWall && (
              <div className="eco-brands">
                {brandWall.map((b) => (
                  <span className="eco-brand" key={b.id || b.name}>
                    {b.logoUrl ? <img src={b.logoUrl} alt={b.name} loading="lazy" /> : b.name}
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
            <div className="eco-head"><div className="eco-ic"><Icon name="wrench" size={22} /></div></div>
            <div className="eco-num">{val("service_num")}<span>{val("service_unit")}</span></div>
            <h3>{_lv(lang, "Успешно выполненных сервисных работ", "Muvaffaqiyatli bajarilgan servis ishlari", "Completed service jobs")}</h3>
            <p>{_lv(lang, "Пусконаладка, плановое обслуживание и ремонт оборудования по всей стране.", "Ishga tushirish, rejali xizmat va ta'mirlash butun mamlakat bo'ylab.", "Commissioning, maintenance and repair across the country.")}</p>
            <div className="eco-foot">
              <button className="eco-cta" onClick={() => go("services")}>
                {_lv(lang, "Сервис и поддержка", "Servis va qo'llab-quvvatlash", "Service & support")}<Icon name="arrowRight" size={15} />
              </button>
            </div>
          </article>

          {/* ── delivery ── */}
          <article className="eco-t delivery sx-rv">
            <div className="eco-head"><div className="eco-ic"><Icon name="pin" size={22} /></div></div>
            <div className="eco-num">{val("delivery_num")}<span>{val("delivery_unit")}</span></div>
            <h3>{_lv(lang, "Доставка по всей стране", "Butun mamlakat bo'ylab yetkazish", "Nationwide delivery")}</h3>
            <p>{_lv(lang, "Поставка, логистика и сопровождение в 14 регионах Узбекистана.", "14 hududda yetkazib berish, logistika va qo'llab-quvvatlash.", "Delivery, logistics and support across 14 regions of Uzbekistan.")}</p>
            <EcoUzMap lang={lang} />
          </article>

        </div>
      </div>
    </section>
  );
}

/* ── «Экспертиза · 360° / Наши услуги» — ported from CLAUDE HP ServicesSection ── */
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
    nav: "services",
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
    nav: "services",
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
.sxp { position:relative; overflow:hidden; background:#0b2d25; padding:clamp(64px,8vw,112px) 0; }
.sxp-glow { position:absolute; top:-160px; right:-160px; width:520px; height:520px; border-radius:50%;
  background:rgba(184,245,0,.10); filter:blur(80px); pointer-events:none; }
.sxp-inner { position:relative; max-width:1200px; margin:0 auto; padding:0 24px; }

.sxp-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
@media(min-width:1024px){ .sxp-head { grid-template-columns:1.15fr .85fr; align-items:end; gap:64px; } }
.sxp-kicker { margin:0 0 16px; font-size:12px; font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:#c5ff19; }
.sxp-h2 { margin:0; font-size:clamp(34px,5vw,60px); font-weight:800; line-height:.95;
  letter-spacing:-.03em; color:#fff; }
.sxp-sub { margin:0; max-width:28rem; font-size:15px; line-height:1.65; color:rgba(255,255,255,.55); }

.sxp-grid { display:grid; gap:14px; }
@media(min-width:640px){ .sxp-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxp-grid { display:flex; flex-wrap:nowrap; align-items:stretch; } }

.sxp-card { position:relative; display:flex; flex-direction:column; overflow:hidden; text-align:left;
  min-height:460px; padding:28px; border-radius:24px; cursor:pointer; font-family:inherit;
  border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); color:#fff;
  transition:flex-grow .5s ease, background .35s, border-color .35s, transform .35s; }
@media(min-width:1024px){ .sxp-card { flex:1 1 0; } .sxp-card:hover { flex-grow:1.35; } }
.sxp-card:hover { border-color:rgba(184,245,0,.5); background:rgba(255,255,255,.07); }
.sxp-card.feat { background:#b8f500; border-color:transparent; color:#0b2d25; }
.sxp-card.feat:hover { background:#c5ff19; }
.sxp-card:focus-visible { outline:2px solid #c5ff19; outline-offset:3px; }

.sxp-bignum { position:absolute; right:12px; bottom:-48px; font-size:9rem; font-weight:800; line-height:1;
  user-select:none; pointer-events:none; color:rgba(255,255,255,.03); }
.sxp-card.feat .sxp-bignum { color:rgba(11,45,37,.08); }

.sxp-top { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.sxp-no { font-size:12px; font-weight:700; color:#c5ff19; }
.sxp-card.feat .sxp-no { color:rgba(11,45,37,.6); }
.sxp-arrow { display:flex; align-items:center; justify-content:center; width:44px; height:44px; flex-shrink:0;
  border-radius:50%; border:1px solid rgba(255,255,255,.2); font-size:18px; color:#c5ff19;
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
.sxp-card:hover .sxp-arrow { transform:rotate(45deg); background:#b8f500; border-color:#b8f500; color:#0b2d25; }
.sxp-card.feat .sxp-arrow { border-color:rgba(11,45,37,.25); color:#0b2d25; }
.sxp-card.feat:hover .sxp-arrow { background:transparent; }

.sxp-t { position:relative; z-index:1; margin:40px 0 0; max-width:16rem; font-size:24px; font-weight:700;
  line-height:1.2; letter-spacing:-.02em; }
.sxp-d { position:relative; z-index:1; margin:12px 0 0; max-width:20rem; font-size:14px; line-height:1.6;
  color:rgba(255,255,255,.55); }
.sxp-card.feat .sxp-d { color:rgba(11,45,37,.7); }

/* grid-rows 0fr→1fr: высота подстраивается ровно под контент */
.sxp-expand { position:relative; z-index:1; display:grid; grid-template-rows:0fr;
  transition:grid-template-rows .4s ease; }
.sxp-card:hover .sxp-expand, .sxp-card:focus-visible .sxp-expand { grid-template-rows:1fr; }
.sxp-expand-outer { overflow:hidden; }
.sxp-expand-in { padding-top:16px; opacity:0; transition:opacity .3s ease .1s; }
.sxp-card:hover .sxp-expand-in, .sxp-card:focus-visible .sxp-expand-in { opacity:1; }
.sxp-comp { margin:0; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em;
  color:rgba(255,255,255,.35); }
.sxp-card.feat .sxp-comp { color:rgba(11,45,37,.5); }
.sxp-proof { margin:4px 0 0; font-size:13px; font-weight:500; color:#fff; }
.sxp-card.feat .sxp-proof { color:#0b2d25; }
.sxp-list { list-style:none; margin:12px 0 0; padding:0; display:flex; flex-direction:column; gap:6px; }
.sxp-list li { display:flex; align-items:flex-start; gap:8px; font-size:12px; line-height:1.4;
  color:rgba(255,255,255,.6); }
.sxp-card.feat .sxp-list li { color:rgba(11,45,37,.7); }
.sxp-dot { flex-shrink:0; width:6px; height:6px; margin-top:5px; border-radius:50%; background:#b8f500; }
.sxp-card.feat .sxp-dot { background:#0b2d25; }

.sxp-more { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between;
  gap:8px; margin-top:auto; padding-top:16px; border-top:1px solid rgba(255,255,255,.1);
  font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#c5ff19; }
.sxp-card.feat .sxp-more { border-top-color:rgba(11,45,37,.15); color:#0b2d25; }
.sxp-more-arr { font-size:16px; transition:transform .3s; }
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
            <p className="sxp-kicker">{_lv(lang, "Экспертиза · 360°", "Ekspertiza · 360°", "Expertise · 360°")}</p>
            <h2 className="sxp-h2">{_lv(lang, "Наши услуги", "Bizning xizmatlar", "Our services")}</h2>
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
              <div
                key={i}
                className={"sxp-card sx-rv" + (i === 0 ? " feat" : "")}
                style={{ "--i": i }}
                role="button"
                tabIndex={0}
                onClick={() => go(it.nav)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(it.nav); } }}
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
              </div>
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
.sxc { background:#f6f7f2; padding:clamp(64px,8vw,112px) 0; }
[data-theme="dark"] .sxc { background:var(--sx-bg-soft); }
.sxc-inner { max-width:1200px; margin:0 auto; padding:0 24px; }

.sxc-head { display:grid; gap:32px; margin-bottom:clamp(40px,5vw,64px); }
@media(min-width:1024px){ .sxc-head { grid-template-columns:1.3fr .7fr; align-items:end; gap:64px; } }
.sxc-kicker { margin:0 0 16px; font-size:12px; font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; color:#6f9600; }
.sxc-h2 { margin:0; font-size:clamp(30px,4.2vw,48px); font-weight:800; line-height:1.02;
  letter-spacing:-.03em; color:#0b2d25; }
[data-theme="dark"] .sxc-h2 { color:var(--sx-ink); }
.sxc-sub { margin:0 0 24px; font-size:15px; line-height:1.65; color:#6b7280; }
[data-theme="dark"] .sxc-sub { color:var(--sx-mute); }
.sxc-cta { display:inline-flex; align-items:center; gap:12px; padding:13px 26px; border-radius:999px;
  border:none; cursor:pointer; font-family:inherit; font-size:14px; font-weight:700;
  background:#b8f500; color:#0b2d25; transition:background .2s, transform .18s; }
.sxc-cta:hover { background:#c5ff19; transform:translateY(-2px); }
.sxc-cta:focus-visible { outline:2px solid #6f9600; outline-offset:3px; }

.sxc-grid { display:grid; gap:20px; grid-template-columns:1fr; }
@media(min-width:640px){ .sxc-grid { grid-template-columns:1fr 1fr; } }
@media(min-width:1024px){ .sxc-grid { grid-template-columns:repeat(4,1fr); } }

.sxc-card { overflow:hidden; border-radius:24px; border:1px solid #e5e7eb; background:#fff;
  cursor:pointer; text-align:left; padding:0; font-family:inherit; display:flex; flex-direction:column;
  transition:box-shadow .3s, border-color .3s; }
[data-theme="dark"] .sxc-card { background:var(--sx-card); border-color:var(--sx-line); }
.sxc-card:hover { box-shadow:0 20px 50px rgba(18,53,46,.10); }
.sxc-card:focus-visible { outline:2px solid #6f9600; outline-offset:3px; }
.sxc-media { aspect-ratio:4/3; overflow:hidden; }
.sxc-media img { display:block; width:100%; height:100%; object-fit:cover;
  transition:transform .5s cubic-bezier(.16,1,.3,1); }
.sxc-card:hover .sxc-media img { transform:scale(1.06); }

.sxc-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px; }
.sxc-no { font-size:12px; font-weight:700; color:#6f9600; }
.sxc-t { margin:4px 0 0; font-size:18px; font-weight:700; line-height:1.3; color:#0b2d25; }
[data-theme="dark"] .sxc-t { color:var(--sx-ink); }
.sxc-arr { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:44px; height:44px;
  border-radius:50%; border:1px solid rgba(143,194,0,.4); color:#6f9600;
  transition:transform .3s, background .3s, border-color .3s, color .3s; }
.sxc-card:hover .sxc-arr { transform:rotate(45deg); background:#b8f500; border-color:#b8f500; color:#0b2d25; }

@media (prefers-reduced-motion: reduce){
  .sxc-card, .sxc-media img, .sxc-arr, .sxc-cta { transition:none; }
  .sxc-card:hover .sxc-media img { transform:none; }
}
    `;
    document.head.appendChild(s);
  }, []);

  // та же логика сопоставления категорий, что и в SoiCatalogPortal — чтобы оба блока вели одинаково
  const goCard = (card) => {
    const found = cats.find((c) => c.id === card.catKey);
    go("catalog", found ? { cat: found.id } : {});
  };

  return (
    <section className="sxc">
      <div className="sxc-inner">
        <div className="sxc-head sx-rv">
          <div>
            <p className="sxc-kicker">{_lv(lang, "Электронный каталог", "Elektron katalog", "Digital catalog")}</p>
            <h2 className="sxc-h2">{_lv(lang, "Оборудование для современной медицины", "Zamonaviy tibbiyot uchun uskunalar", "Equipment for modern medicine")}</h2>
          </div>
          <div>
            <p className="sxc-sub">{_lv(lang,
              "Структурированный каталог решений для диагностики, лечения, реанимации и ежедневной работы медицинских учреждений.",
              "Tibbiyot muassasalarining diagnostika, davolash, reanimatsiya va kundalik ish uchun yechimlar katalogi.",
              "A structured catalog of solutions for diagnostics, treatment, intensive care and the daily work of medical institutions.")}</p>
            <button className="sxc-cta" onClick={() => go("catalog", {})}>
              {_lv(lang, "Открыть весь каталог", "Butun katalogni ochish", "Open the full catalog")}
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </div>

        <div className="sxc-grid">
          {CATALOG_CARDS.map((card, i) => (
            <div
              key={card.slug}
              className="sxc-card sx-rv"
              style={{ "--i": i }}
              role="button"
              tabIndex={0}
              onClick={() => goCard(card)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goCard(card); } }}
            >
              <div className="sxc-media">
                <img src={window.__asset("assets/catalog/" + card.slug + ".jpg")} alt="" loading="lazy" />
              </div>
              <div className="sxc-foot">
                <div>
                  <span className="sxc-no">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="sxc-t">{_lv(lang, card.t.ru, card.t.uz, card.t.en)}</h3>
                </div>
                <span className="sxc-arr" aria-hidden><Icon name="arrowRight" size={18} /></span>
              </div>
            </div>
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
  return (
    <section className="sx-section soft">
      <div className="sx-wrap">
        <div className="sx-head sx-rv">
          <span className="sx-eyebrow">{_lv(lang, "Навигация по направлениям", "Yo'nalishlar bo'yicha", "By specialty")}</span>
          <h2 className="sx-h2">{_lv(lang, "Подбор по направлению медицины", "Tibbiyot yo'nalishi bo'yicha tanlov", "Find by medical specialty")}</h2>
          <p className="sx-sub">{_lv(lang, "Откройте каталог по профилю учреждения, отделению или клинической задаче.", "Muassasa profili yoki klinik vazifa bo'yicha katalogni oching.", "Open the catalog by institution profile, department or clinical task.")}</p>
        </div>
        <div className="sx-dir-grid">
          {DIRECTION_GROUPS.map((g, i) => {
            const dirs = getDirsForGroup(g.id).slice(0, 4);
            return (
              <div className="sx-dir sx-rv" key={g.id} style={{ "--i": i }} onClick={() => go("catalog", { dir: dirs[0] && dirs[0].id })}>
                <div className="sx-dir-ic" style={{ background: g.color + "18", color: g.color }}><Icon name={g.icon} size={26} /></div>
                <h3>{_lv(lang, g.ru, g.uz, g.en)}</h3>
                <div className="sx-dir-links">
                  {dirs.map((d) => (
                    <a key={d.id} onClick={(e) => { e.stopPropagation(); go("catalog", { dir: d.id }); }}>{_lv(lang, d.ru, d.uz, d.en)}</a>
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

function SoiImpact({ lang }) {
  const impact = useHomeSetting("homepage_impact", IMPACT_DEFAULTS);
  const itx = (field) => trTx(impact, field, lang);
  const metrics = [1, 2, 3, 4].map((n) => ({
    n: impact[`stat${n}_val`] || "",
    u: impact[`stat${n}_unit`] || "",
    l: itx(`stat${n}_label`),
  }));
  return (
    <section className="sx-section">
      <div className="sx-wrap">
        <div className="sx-impact sx-rv">
          <div className="sx-impact-aurora" />
          <div className="sx-impact-grid-ov" />
          <div className="sx-impact-inner">
            <span className="sx-eyebrow">{itx("eyebrow")}</span>
            <h2>{itx("title")}</h2>
            <div className="sx-impact-grid">
              {metrics.map((m, i) => (
                <div className="sx-metric sx-rv" key={i} style={{ "--i": i }}>
                  <div className="sx-metric-n"><SoiCountUp value={m.n} /><span className="u">{m.u}</span></div>
                  <div className="sx-metric-l">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

function SoiBrands({ lang, go }) {
  const brands = window.DATA && window.DATA.BRANDS || [];
  if (!brands.length) return null;
  return (
    <section className="sx-section soft">
      <div className="sx-wrap">
        <h2 className="sx-h2 sx-brands-title sx-rv" onClick={() => go("partners")} style={{ cursor: "pointer", marginBottom: 28 }}>
          {_lv(lang, "Бренды и заводы производители", "Brendlar va ishlab chiqaruvchi zavodlar", "Brands and manufacturing plants")}
          <Icon name="chevronRight" size={22} />
        </h2>
        <div className="sx-brands-pills">
          {brands.map((b) => (
            <span className="sx-bpill" key={b.id} onClick={() => go("partners")}>{b.name}</span>
          ))}
        </div>
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
.sx-cmod { background:#fff; border-radius:16px; width:min(680px,94vw); max-height:90vh; overflow:auto; box-shadow:0 30px 90px rgba(0,0,0,.5); animation:sxCmodUp .22s cubic-bezier(.16,1,.3,1); }
@keyframes sxCmodUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sx-cmod-cover { aspect-ratio:16/9; background:linear-gradient(135deg,#eef3fb,#dbe6f5); display:flex; align-items:center; justify-content:center; color:#94a3b8; overflow:hidden; }
.sx-cmod-cover img { width:100%; height:100%; object-fit:cover; display:block; }
.sx-cmod-body { padding:26px 30px 30px; }
.sx-cmod-tag { display:inline-flex; font-size:11.5px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:#0E4AC6; background:rgba(14,74,198,.09); padding:5px 12px; border-radius:7px; margin-bottom:14px; }
.sx-cmod-body h2 { font-size:23px; font-weight:800; color:#0B1B33; line-height:1.25; letter-spacing:-.015em; margin:0 0 14px; }
.sx-cmod-body p { font-size:15px; line-height:1.7; color:#3d4d68; margin:0; white-space:pre-line; }
.sx-cmod-meta { display:flex; flex-wrap:wrap; gap:22px; margin-top:22px; padding-top:18px; border-top:1px solid #e2e8f1; font-size:13.5px; color:#475569; }
.sx-cmod-meta b { color:#0B1B33; }
.sx-cmod-x { position:fixed; top:22px; right:26px; width:42px; height:42px; border-radius:50%; border:none; background:rgba(255,255,255,.14); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .18s; z-index:9110; }
.sx-cmod-x:hover { background:rgba(255,255,255,.28); }
.sx-cmod-x:focus-visible { outline:2px solid #fff; outline-offset:2px; }
[data-theme="dark"] .sx-cmod { background:#0c1726; }
[data-theme="dark"] .sx-cmod-body h2 { color:#eaf1fb; }
[data-theme="dark"] .sx-cmod-body p { color:#a9b8cc; }
[data-theme="dark"] .sx-cmod-meta { border-color:#22344e; color:#94a7bf; }
[data-theme="dark"] .sx-cmod-meta b { color:#eaf1fb; }
@media(max-width:500px){ .sx-cmod-body { padding:20px; } .sx-cmod-body h2 { font-size:20px; } }
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
    <section className="sx-section">
      <div className="sx-wrap">
        <div className="sx-head sx-rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <span className="sx-eyebrow">{_lv(lang, "Реализованные проекты", "Amalga oshirilgan loyihalar", "Delivered projects")}</span>
            <h2 className="sx-h2">{_lv(lang, "Как мы оснащаем медицину Узбекистана", "O'zbekiston tibbiyotini qanday jihozlaymiz", "How we equip Uzbekistan's healthcare")}</h2>
          </div>
          <span className="sx-link" onClick={() => go("cases")}>{_lv(lang, "Все кейсы", "Barcha keyslar", "All cases")}<Icon name="arrowRight" size={16} /></span>
        </div>
        <div className="sx-cases">
          {cases.map((c, i) => (
            <div className="sx-case sx-rv" key={c.id || i} style={{ "--i": i }}
              role="button" tabIndex={0}
              onClick={() => setViewer(c)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewer(c); } }}
              aria-label={_lv(lang, "Открыть кейс", "Keysni ochish", "Open case") + ": " + tx(c.title)}>
              <div className="sx-case-cover">{img(c.image) ? <img src={img(c.image)} alt={tx(c.title)} loading="lazy" /> : <Icon name="pin" size={34} />}</div>
              <div className="sx-case-body">
                {c.tag && <span className="sx-case-tag">{tx(c.tag)}</span>}
                <h3>{tx(c.title)}</h3>
                <p>{tx(c.desc)}</p>
                <div className="sx-case-meta">
                  {c.year && <span>{_lv(lang, "Год", "Yil", "Year")}: <b>{c.year}</b></span>}
                  {c.region && <span>{_lv(lang, "Регион", "Hudud", "Region")}: <b>{tx(c.region)}</b></span>}
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
  const COLORS = ["#E0492F","#1d7ed8","#15A06A","#6454D4","#F59E0B","#8B5CF6"];
  const tx = (o) => !o ? "" : typeof o === "string" ? o : (o[lang] || o.ru || "");
  const rtype = (r) => { const v = r.type || r.group || ""; if (v==="suppliers") return "supplier"; if (v==="buyers") return "buyer"; return v||"buyer"; };

  const [cmsAll, setCmsAll] = React.useState(() => window.CMS ? window.CMS.list("reviews") : []);
  React.useEffect(() => {
    if (!window.CMS) return;
    setCmsAll(window.CMS.list("reviews"));
    return window.CMS.on("reviews", () => setCmsAll(window.CMS.list("reviews")));
  }, []);

  const BUYERS_STUB = [
    { id:"namangan", org:lv("Компания «Наманганская областная больница»","«Namangan viloyat kasalxonasi» kompaniyasi","Namangan Regional Hospital"), city:lv("Наманган","Namangan","Namangan"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Оборудование для отделения диагностики","Diagnostika bo'limi uchun uskunalar","Diagnostic dept. equipment"), text:lv("Выражаем благодарность ИНДУСТРИЯ ЗДОРОВЬЯ за оперативную поставку и качественный монтаж оборудования для отделения диагностики.","Diagnostika bo'limi uchun uskunalarni tezkor yetkazib berish va sifatli o'rnatganlik uchun SOG’LIQ INDUSTRIYASIga minnatdorchilik bildiramiz.","We express gratitude to HEALTH INDUSTRY for prompt delivery and quality installation of diagnostic department equipment."), color:"#E0492F" },
    { id:"oncology", org:lv("Компания «РСНПМЦ Онкологии»","«RSNPMC Onkologiyasi» kompaniyasi","RSNPMC Oncology Center"), city:lv("Ташкент","Toshkent","Tashkent"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Лучевая диагностика «под ключ»","«Kalit ostida» nurli diagnostika","Radiology dept. turnkey"), text:lv("Комплексное оснащение отделения лучевой диагностики выполнено под ключ, с обучением персонала и полным пакетом документов.","Nurli diagnostika bo'limini kompleks jihozlash kalit ostida amalga oshirildi, xodimlarni o'qitish va to'liq hujjatlar to'plami bilan.","Complete turnkey outfitting of the radiology department including staff training and full documentation package."), color:"#1d7ed8" },
    { id:"perinatal", org:lv("Республиканский перинатальный центр","Respublika perinatal markazi","Republican Perinatal Center"), city:lv("Ташкент","Toshkent","Tashkent"), type:lv("госучреждение","davlat muassasasi","public institution"), cat:lv("Акушерство и гинекология","Akusherlik va ginekologiya","Obstetrics & Gynecology"), text:lv("Поставка оборудования для роддома выполнена точно в срок. Всё оборудование прошло метрологическую поверку и введено в эксплуатацию.","Tug'ruqxona uchun uskunalar o'z vaqtida yetkazildi. Barcha uskunalar metrologik tekshiruvdan o'tdi va foydalanishga topshirildi.","Equipment for the maternity unit was delivered on schedule. All equipment passed metrological verification and was commissioned."), color:"#15A06A" },
    { id:"dental", org:lv("Стоматологическая клиника «DentaLux»","«DentaLux» stomatologiya klinikasi","DentaLux Dental Clinic"), city:lv("Самарканд","Samarqand","Samarkand"), type:lv("частная клиника","xususiy klinika","private clinic"), cat:lv("Стоматологическое оборудование","Stomatologiya uskunalari","Dental equipment"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ помогла оснастить клинику «под ключ» в сжатые сроки. Профессиональный подход к каждому этапу — от выбора оборудования до сервиса.","SOG’LIQ INDUSTRIYASI klinikani qisqa muddatda «kalit ostida» jihozlashga yordam berdi. Uskunani tanlashdan xizmat ko'rsatishgacha bo'lgan har bir bosqichda professional yondashuv.","HEALTH INDUSTRY helped outfit the clinic turnkey on a tight schedule. Professional approach at every stage from equipment selection to service."), color:"#6454D4" },
  ];
  const SUPPLIERS_STUB = [
    { id:"midmark", org:"Midmark Corporation", city:lv("Вершайлз, США","Versayles, AQSh","Versailles, USA"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Официальный дистрибьютор в ЦА","Markaziy Osiyo bo'yicha rasmiy distribyutor","Authorized distributor in CA"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ является авторизованным дистрибьютором Midmark в Центральной Азии. Высокий стандарт сервиса и компетентность персонала.","SOG’LIQ INDUSTRIYASI — Markaziy Osiyoda Midmarkning vakolatli distribyutori. Xizmat ko'rsatishning yuqori standarti va xodimlarning malakasi.","HEALTH INDUSTRY is the authorized distributor of Midmark in Central Asia. High service standards and staff competence."), color:"#1d7ed8" },
    { id:"armed", org:"Armed Medical", city:lv("Москва, Россия","Moskva, Rossiya","Moscow, Russia"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Партнёрское соглашение","Hamkorlik shartnomasi","Partnership agreement"), text:lv("Надёжный региональный партнёр по дистрибуции. Ответственный подход к продажам и соблюдению условий авторизованного дистрибьютора.","Ishonchli mintaqaviy distribyutor hamkor. Savdoga mas'uliyatli yondashuv va vakolatli distribyutor shartlariga rioya qilish.","A reliable regional distribution partner. Responsible sales approach and compliance with authorized distributor terms."), color:"#E0492F" },
    { id:"choicemmed", org:"ChoiceMmed Technology", city:lv("Пекин, Китай","Pekin, Xitoy","Beijing, China"), type:lv("производитель","ishlab chiqaruvchi","manufacturer"), cat:lv("Авторизованный дистрибьютор","Vakolatli distribyutor","Authorized distributor"), text:lv("ИНДУСТРИЯ ЗДОРОВЬЯ — один из ключевых партнёров в Узбекистане. Своевременные поставки и профессиональная техническая служба поддержки.","SOG’LIQ INDUSTRIYASI — O'zbekistondagi asosiy hamkorlarimizdan biri. O'z vaqtida yetkazib berish va professional texnik qo'llab-quvvatlash xizmati.","HEALTH INDUSTRY is one of our key partners in Uzbekistan. Timely deliveries and professional technical support service."), color:"#15A06A" },
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
      <rect x="14" y="52" width="68" height="7" rx="3.5" fill="#E5E7EB"/>
      <rect x="14" y="65" width="132" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="75" width="126" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="85" width="116" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="100" width="132" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="110" width="120" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="120" width="128" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="130" width="100" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="148" width="60" height="5" rx="2.5" fill="#F3F4F6"/>
      <rect x="14" y="158" width="72" height="5" rx="2.5" fill="#F3F4F6"/>
      <circle cx="36" cy="188" r="17" stroke={color} strokeWidth="1.5" opacity=".75"/>
      <circle cx="36" cy="188" r="10" fill={color} opacity=".15"/>
      <rect x="64" y="181" width="54" height="5" rx="2.5" fill="#E5E7EB"/>
      <rect x="64" y="191" width="42" height="5" rx="2.5" fill="#E5E7EB"/>
    </svg>
  );

  return (
    <section className="sx-section soft">
      <div className="sx-wrap">
        <div className="sx-rev-head sx-rv">
          <div className="sx-rev-head-left">
            <h2 className="sx-h2" onClick={() => go("reviews")}>
              {lv("Отзывы","Sharhlar","Reviews")}
              <Icon name="chevronRight" size={22}/>
            </h2>
            <p className="sx-sub" style={{marginTop:10}}>{lv("Благодарственные письма клиник и партнёров-производителей","Klinikalar va ishlab chiqaruvchi hamkorlarning minnatdorchilik xatlari","Letters of appreciation from clinics and manufacturer partners")}</p>
          </div>
          <div className="sx-rev-tabs">
            <button className={"sx-rev-tab"+(tab==="buyers"?" on":"")} onClick={() => setTab("buyers")}>
              {lv("Покупатели","Xaridorlar","Buyers")}
            </button>
            <button className={"sx-rev-tab"+(tab==="suppliers"?" on":"")} onClick={() => setTab("suppliers")}>
              {lv("Поставщики","Ta'minotchilar","Suppliers")}
            </button>
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
                    <div className="sx-rev-badges">
                      <span className="sx-rev-badge" style={{ color, borderColor: color + "48" }}>{typeLabel}</span>
                      {region && <span className="sx-rev-badge"><Icon name="pin" size={12}/>{region}</span>}
                    </div>
                    <h3 className="sx-rev-org">{org}</h3>
                    {text && <p className="sx-rev-quote">{text}</p>}
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
    <section className="sx-section soft">
      <div className="sx-wrap">
        <div className="sx-head sx-rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <span className="sx-eyebrow">{_lv(lang, "Новости и аналитика", "Yangiliklar", "News & insights")}</span>
            <h2 className="sx-h2">{_lv(lang, "Что нового в индустрии", "Sohada nima yangilik", "What's new in the industry")}</h2>
          </div>
          <span className="sx-link" onClick={() => go("news")}>{_lv(lang, "Все новости", "Barcha yangiliklar", "All news")}<Icon name="arrowRight" size={16} /></span>
        </div>
        <div className="sx-news">
          {news.map((n, i) => (
            <div className="sx-ncard sx-rv" key={n.id || i} style={{ "--i": i }} onClick={() => go("news")}>
              <div className="sx-ncard-cover">{cov(n.cover) ? <img src={cov(n.cover)} alt={tx(n.title)} loading="lazy" /> : <Icon name="doc" size={28} />}</div>
              <div className="sx-ncard-body">
                <div className="sx-ncard-date">{fmt(n.date)}</div>
                <h3>{tx(n.title)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoiCatalogPortal({ lang, go }) {
  const lv = (ru, uz, en) => _lv(lang, ru, uz, en);
  const cats = window.DATA && window.DATA.CATEGORIES || [];

  const tiles = [
    { key: "equip", ru: "Медицинское оборудование", uz: "Tibbiy uskunalar", en: "Medical equipment", ic: "pulse", accent: "#1d7ed8", catKey: "equipment" },
    { key: "furn",  ru: "Медицинская мебель",        uz: "Tibbiy mebel",   en: "Medical furniture",  ic: "bed",   accent: "#15A06A", catKey: "furniture" },
    { key: "inst",  ru: "Инструменты",               uz: "Asboblar",       en: "Instruments",        ic: "scalpel", accent: "#E0492F", catKey: "instruments" },
    { key: "cons",  ru: "Расходные материалы",        uz: "Sarf materiallari", en: "Consumables",    ic: "box",   accent: "#6454D4", catKey: "consumables" },
  ];

  const goTile = (t) => {
    const found = cats.find(c => c.id === t.catKey || (c.ru && c.ru.toLowerCase().includes(t.ru.toLowerCase().split(" ")[1])));
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
      <SoiImpact lang={lang} />
      <SoiBrands lang={lang} go={go} />
      <SoiCases lang={lang} go={go} />
      <SoiNews lang={lang} go={go} />
      <SoiFinalCTA lang={lang} go={go} />
    </div>);
}

Object.assign(window, { HomePage, Footer, Hero, CategoryGrid, FeaturedRow, TrustBand, BrandStrip, CtaBand, HeroVideoSlot });
/* Expose the new platform homepage building blocks so the corp shell (home-sections.jsx → CoHomePage)
   can compose the exact same Stripe/Vercel-grade design without duplicating ~600 lines.
   These components close over the catalog-scope `Icon`, which is a shared global, so they render
   identically regardless of which shell calls them. */
Object.assign(window, {
  SoiPlatformCSS, useSoiReveal, SoiHero: Hero,
  SoiEcosystem, SoiExpertise, SoiCatalogCards, SoiDirections, SoiCatalogPortal, SoiImpact, SoiBrands, SoiCases, SoiReviews, SoiNews, SoiFinalCTA,
  SoiCaseModal: CaseModal,
});
