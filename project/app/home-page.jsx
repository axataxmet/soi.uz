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

function Hero({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const hero = useHomeSetting("homepage_hero", HERO_DEFAULTS);
  const htx = (field) => trTx(hero, field, lang);

  useEffect(() => {
    const id = "soi-chero-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
/* ── ИНДУСТРИЯ ЗДОРОВЬЯ Hero v3 — Corporate / Light (Stripe·Vercel) ── */
.soi-chero { position:relative; overflow:hidden; padding:clamp(104px,12vw,170px) 0 clamp(64px,7vw,104px); background:var(--sx-bg); }
.soi-chero-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
.soi-chero-mesh { position:absolute; inset:-12% -6% 0; background:
  radial-gradient(46% 42% at 18% 22%, rgba(29,126,216,.16), transparent 70%),
  radial-gradient(42% 40% at 86% 16%, rgba(20,184,224,.13), transparent 68%),
  radial-gradient(46% 52% at 72% 82%, rgba(100,84,212,.10), transparent 66%);
  animation:soiCheroDrift 17s ease-in-out infinite alternate; }
[data-theme="dark"] .soi-chero-mesh { background:
  radial-gradient(46% 42% at 18% 22%, rgba(29,126,216,.32), transparent 70%),
  radial-gradient(42% 40% at 86% 16%, rgba(20,184,224,.22), transparent 68%),
  radial-gradient(46% 52% at 72% 82%, rgba(100,84,212,.20), transparent 66%); }
@keyframes soiCheroDrift { 0%{transform:translate3d(0,0,0) scale(1);} 100%{transform:translate3d(-16px,9px,0) scale(1.05);} }
.soi-chero-grid { position:absolute; inset:0;
  background-image:linear-gradient(var(--sx-ink) 1px, transparent 1px), linear-gradient(90deg, var(--sx-ink) 1px, transparent 1px);
  background-size:54px 54px; opacity:.025;
  -webkit-mask-image:radial-gradient(ellipse 78% 70% at 50% 0%, #000 22%, transparent 76%);
  mask-image:radial-gradient(ellipse 78% 70% at 50% 0%, #000 22%, transparent 76%); }

.soi-chero-wrap { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:0 24px;
  display:grid; grid-template-columns:1.04fr .96fr; gap:clamp(32px,5vw,72px); align-items:center; }

.soi-chero-badge { display:inline-flex; align-items:center; gap:9px; padding:7px 15px 7px 11px; border-radius:99px;
  background:var(--sx-card); border:1px solid var(--sx-line); box-shadow:var(--sx-shadow);
  font-size:13px; font-weight:700; color:var(--sx-ink-soft); letter-spacing:-.005em; }
.soi-chero-badge .dot { width:8px; height:8px; border-radius:50%; background:var(--sx-green);
  box-shadow:0 0 0 4px color-mix(in srgb,var(--sx-green) 22%, transparent); }
.soi-chero-h1 { font-size:clamp(34px,5.1vw,62px); font-weight:800; line-height:1.04; letter-spacing:-.035em;
  color:var(--sx-ink); margin:22px 0 0; }
.soi-chero-h1 .accent { background:linear-gradient(110deg,var(--sx-blue),var(--sx-cyan));
  -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.soi-chero-sub { font-size:clamp(16px,1.55vw,19px); line-height:1.6; color:var(--sx-mute); margin:22px 0 0; max-width:548px; }
.soi-chero-cta { display:flex; flex-wrap:wrap; gap:13px; margin-top:34px; }
.soi-chero-btn { display:inline-flex; align-items:center; gap:9px; height:54px; padding:0 26px; border-radius:14px;
  font-family:inherit; font-size:15.5px; font-weight:700; cursor:pointer; border:1.5px solid transparent;
  transition:transform .18s cubic-bezier(.16,1,.3,1), box-shadow .25s, filter .18s, border-color .2s, background .2s, color .2s; }
.soi-chero-btn.primary { background:linear-gradient(135deg,var(--sx-blue-2),var(--sx-blue)); color:#fff; box-shadow:0 10px 30px rgba(14,74,198,.32); }
.soi-chero-btn.primary:hover { transform:translateY(-2px); filter:brightness(1.07); box-shadow:0 14px 38px rgba(14,74,198,.42); }
.soi-chero-btn.primary .arr { display:inline-flex; transition:transform .2s; }
.soi-chero-btn.primary:hover .arr { transform:translateX(4px); }
.soi-chero-btn.ghost { background:var(--sx-card); color:var(--sx-ink); border-color:var(--sx-line); box-shadow:var(--sx-shadow); }
.soi-chero-btn.ghost:hover { transform:translateY(-2px); border-color:var(--sx-blue); color:var(--sx-blue); }
.soi-chero-trust { display:flex; flex-wrap:wrap; gap:10px 22px; margin-top:32px; }
.soi-chero-trust span { display:inline-flex; align-items:center; gap:8px; font-size:13.5px; font-weight:600; color:var(--sx-ink-soft); }
.soi-chero-trust svg { color:var(--sx-green); flex-shrink:0; }

.soi-chero-right { position:relative; }
.soi-chero-panel { position:relative; z-index:1; background:var(--sx-card); border:1px solid var(--sx-line);
  border-radius:22px; padding:22px; box-shadow:var(--sx-shadow-lg); }
.soi-chero-panel-head { display:flex; align-items:center; gap:11px; padding:2px 4px 17px; border-bottom:1px solid var(--sx-line-2); }
.soi-chero-panel-mark { width:38px; height:38px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg,var(--sx-blue),var(--sx-cyan)); color:#fff; font-weight:800; font-size:14px; letter-spacing:-.04em; }
.soi-chero-panel-ttl { font-size:15px; font-weight:800; color:var(--sx-ink); letter-spacing:-.01em; }
.soi-chero-panel-sub { font-size:12.5px; color:var(--sx-mute); margin-top:1px; }
.soi-chero-panel-live { margin-left:auto; display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; color:var(--sx-green); }
.soi-chero-panel-live i { width:7px; height:7px; border-radius:50%; background:var(--sx-green); animation:soiCheroPulse 2s ease-in-out infinite; }
@keyframes soiCheroPulse { 0%,100%{opacity:1;} 50%{opacity:.35;} }
.soi-chero-pillars { display:flex; flex-direction:column; gap:5px; margin-top:13px; }
.soi-chero-pillar { display:flex; align-items:center; gap:14px; padding:12px; border-radius:13px; cursor:pointer;
  border:1px solid transparent; background:transparent; text-align:left; font-family:inherit; width:100%;
  transition:background .2s, border-color .2s, transform .2s cubic-bezier(.16,1,.3,1); }
.soi-chero-pillar:hover { background:var(--sx-bg-soft); border-color:var(--sx-line); transform:translateX(3px); }
.soi-chero-pillar-ic { width:42px; height:42px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
  background:color-mix(in srgb,var(--pa,#0E4AC6) 12%, transparent); color:var(--pa,#0E4AC6); }
.soi-chero-pillar-tx { flex:1; min-width:0; }
.soi-chero-pillar-t { display:block; font-size:14.5px; font-weight:700; color:var(--sx-ink); letter-spacing:-.01em; }
.soi-chero-pillar-d { display:block; font-size:12.5px; color:var(--sx-mute); margin-top:1px; }
.soi-chero-pillar-arr { color:var(--sx-mute); opacity:0; transform:translateX(-4px); transition:opacity .2s, transform .2s; flex-shrink:0; }
.soi-chero-pillar:hover .soi-chero-pillar-arr { opacity:1; transform:none; color:var(--pa,#0E4AC6); }

.soi-chero-float { position:absolute; z-index:2; top:-20px; right:-16px; display:flex; align-items:center; gap:11px;
  background:var(--sx-card); border:1px solid var(--sx-line); border-radius:15px; padding:12px 15px; box-shadow:var(--sx-shadow-lg);
  animation:soiCheroFloat 5.5s ease-in-out infinite; }
.soi-chero-float-ic { width:34px; height:34px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
  background:color-mix(in srgb,var(--sx-green) 14%, transparent); color:var(--sx-green); }
.soi-chero-float-t { font-size:13px; font-weight:800; color:var(--sx-ink); line-height:1.2; }
.soi-chero-float-d { font-size:11.5px; color:var(--sx-mute); margin-top:1px; }
@keyframes soiCheroFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-9px);} }

.soi-chero-in { opacity:0; animation:soiCheroIn .8s cubic-bezier(.16,1,.3,1) forwards; animation-delay:var(--d,0ms); }
@keyframes soiCheroIn { from{opacity:0; transform:translateY(18px);} to{opacity:1; transform:none;} }

@media (max-width:920px){
  .soi-chero-wrap { grid-template-columns:1fr; gap:44px; }
  .soi-chero-float { display:none; }
}
@media (max-width:520px){
  .soi-chero-cta { gap:10px; }
  .soi-chero-btn { width:100%; justify-content:center; }
  .soi-chero-pillar-d { display:none; }
}
@media (prefers-reduced-motion: reduce){
  .soi-chero-mesh, .soi-chero-float, .soi-chero-panel-live i { animation:none; }
  .soi-chero-in { opacity:1; animation:none; }
}
    `;
    document.head.appendChild(s);
  }, []);

  const Svg = ({ children, s = 20 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );

  const pillars = [
    { c: "#0E4AC6", v: "directions", t: lv("Медицинское оборудование", "Tibbiy uskunalar", "Medical equipment"),
      d: lv("2 800+ позиций, 120+ брендов", "2 800+ pozitsiya, 120+ brend", "2,800+ items, 120+ brands"),
      ic: (<><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></>) },
    { c: "#15A06A", v: "registration", t: lv("Регистрация МИ", "Tibbiy buyumlarni ro'yxatga olish", "Device registration"),
      d: lv("Регистрация медизделий «под ключ»", "«Kalit ostida» ro'yxatga olish", "Turnkey MD registration"),
      ic: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></>) },
    { c: "#6454D4", v: "tenders", t: lv("Тендеры и госзакупки", "Tender va davlat xaridlari", "Tenders & procurement"),
      d: lv("Сопровождение от спецификации до поставки", "Spetsifikatsiyadan yetkazishgacha", "Spec-to-supply support"),
      ic: (<><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/></>) },
    { c: "#E0492F", v: "services", t: lv("Сервис и поддержка", "Servis va qo'llab-quvvatlash", "Service & support"),
      d: lv("Монтаж, обучение, гарантия", "Montaj, o'qitish, kafolat", "Install, training, warranty"),
      ic: (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>) },
    { c: "#14B8E0", v: "catalog", t: lv("Электронный каталог", "Elektron katalog", "E-catalog"),
      d: lv("Подбор и заказ онлайн", "Onlayn tanlash va buyurtma", "Browse & order online"),
      ic: (<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>) },
  ];

  return (
    <section className="soi-chero">
      <div className="soi-chero-bg">
        <div className="soi-chero-mesh" />
        <div className="soi-chero-grid" />
      </div>

      <div className="soi-chero-wrap">
        <div className="soi-chero-left">
          <div className="soi-chero-badge soi-chero-in" style={{ "--d": "60ms" }}>
            <span className="dot" />
            {htx("badge")}
          </div>

          <h1 className="soi-chero-h1 soi-chero-in" style={{ "--d": "140ms" }}>
            {htx("title1")}<br /><span className="accent">{htx("title2")}</span>
          </h1>

          <p className="soi-chero-sub soi-chero-in" style={{ "--d": "220ms" }}>
            {htx("subtitle")}
          </p>

          <div className="soi-chero-cta soi-chero-in" style={{ "--d": "300ms" }}>
            <button className="soi-chero-btn primary" onClick={() => go("about")}>
              {htx("ctaPrimary")}
              <span className="arr"><Svg s={18}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg></span>
            </button>
            <button className="soi-chero-btn ghost" onClick={() => go("catalog")}>
              <Svg s={18}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></Svg>
              {htx("ctaSecondary")}
            </button>
          </div>

          <div className="soi-chero-trust soi-chero-in" style={{ "--d": "380ms" }}>
            {[
              htx("trust1"),
              htx("trust2"),
              htx("trust3"),
            ].map((x, i) => (
              <span key={i}><Svg s={16}><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></Svg>{x}</span>
            ))}
          </div>
        </div>

        <div className="soi-chero-right soi-chero-in" style={{ "--d": "440ms" }}>
          <div className="soi-chero-float">
            <div className="soi-chero-float-ic"><Svg s={18}><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></Svg></div>
            <div>
              <div className="soi-chero-float-t">{lv("Полный цикл", "To'liq sikl", "Full cycle")}</div>
              <div className="soi-chero-float-d">{lv("оснащение «под ключ»", "«kalit ostida» jihozlash", "turnkey delivery")}</div>
            </div>
          </div>

          <div className="soi-chero-panel">
            <div className="soi-chero-panel-head">
              <div className="soi-chero-panel-mark">SOI</div>
              <div>
                <div className="soi-chero-panel-ttl">{lv("Единая экосистема", "Yagona ekotizim", "Unified ecosystem")}</div>
                <div className="soi-chero-panel-sub">{lv("Полный цикл оснащения медицины", "Tibbiyotni jihozlashning to'liq sikli", "Full medical-equipping cycle")}</div>
              </div>
              <span className="soi-chero-panel-live"><i />{lv("Онлайн", "Onlayn", "Online")}</span>
            </div>
            <div className="soi-chero-pillars">
              {pillars.map((p, i) => (
                <button key={i} className="soi-chero-pillar" style={{ "--pa": p.c }} onClick={() => go(p.v)}>
                  <span className="soi-chero-pillar-ic"><Svg s={20}>{p.ic}</Svg></span>
                  <span className="soi-chero-pillar-tx">
                    <span className="soi-chero-pillar-t">{p.t}</span>
                    <span className="soi-chero-pillar-d">{p.d}</span>
                  </span>
                  <span className="soi-chero-pillar-arr"><Svg s={18}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Svg></span>
                </button>
              ))}
            </div>
          </div>
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

function Footer({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const contacts = useSiteContacts();
  const coNav = (view) => {
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: "soi-conav", view }, "*");
    else location.href = "soi.uz.html#/" + (view === "home" ? "" : view);
  };
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fcols">
          <div>
            <img className="foot-logo" src={window.__asset("assets/soi-mark-white.svg")} alt="ИНДУСТРИЯ ЗДОРОВЬЯ" style={{ width: 48, height: 48, marginBottom: 14 }} />
            <p className="fabout">{t.foot_about}</p>
            <a className="cb-phone" href={telHref(contacts.phone)} style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{contacts.phone}</a>
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
            <ul>
              <li style={{ color: "#aab8c9" }}>{contacts.address}</li>
              <li><a href={telHref(contacts.phone)}>{lv("Приёмная", "Qabulxona", "Reception")}: {contacts.phone}</a></li>
              <li><a href={telHref(contacts.phone2)}>{lv("Отдел продаж", "Sotuv bo'limi", "Sales")}: {contacts.phone2}</a></li>
              <li><a href={"mailto:" + contacts.email}>{contacts.email}</a></li>
            </ul>
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

/* ── bento ecosystem ────────────────────────────────── */
.sx-bento { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:minmax(168px,auto); gap:18px;
  grid-template-areas:
    "catalog catalog reg     reg"
    "catalog catalog tender  service"
    "brands  brands  equip   equip"; }
.sx-tile { position:relative; border:1px solid var(--sx-line); border-radius:var(--sx-r); background:var(--sx-card); padding:26px; overflow:hidden; cursor:pointer; transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s; display:flex; flex-direction:column; }
.sx-tile:hover { transform:translateY(-4px); box-shadow:var(--sx-shadow-lg); border-color:color-mix(in srgb, var(--sx-accent,#0E4AC6) 45%, var(--sx-line)); }
.sx-tile::after { content:""; position:absolute; inset:0; border-radius:inherit; opacity:0; transition:opacity .35s; background:radial-gradient(120% 90% at 0% 0%, color-mix(in srgb,var(--sx-accent,#0E4AC6) 12%, transparent), transparent 60%); pointer-events:none; }
.sx-tile:hover::after { opacity:1; }
.sx-tile.big { grid-area:catalog; padding:34px; }
.sx-tile.reg { grid-area:reg; } .sx-tile.tender { grid-area:tender; } .sx-tile.service { grid-area:service; }
.sx-tile.brands { grid-area:brands; } .sx-tile.equip { grid-area:equip; }
.sx-tile-ic { width:46px; height:46px; border-radius:13px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--sx-accent,#0E4AC6) 12%, transparent); color:var(--sx-accent,#0E4AC6); margin-bottom:auto; }
.sx-tile h3 { font-size:19px; font-weight:800; letter-spacing:-.01em; color:var(--sx-ink); margin:20px 0 8px; }
.sx-tile.big h3 { font-size:27px; margin-top:24px; }
.sx-tile p { font-size:14.5px; line-height:1.55; color:var(--sx-mute); }
.sx-tile.big p { font-size:16px; max-width:440px; }
.sx-tile-foot { display:flex; align-items:center; gap:8px; margin-top:18px; font-size:13.5px; font-weight:700; color:color-mix(in srgb, var(--sx-accent,#0E4AC6) 62%, #0B1B33); }
[data-theme="dark"] .sx-tile-foot { color:color-mix(in srgb, var(--sx-accent,#0E4AC6) 70%, #FFFFFF); }
.sx-tile-arrow { margin-left:auto; color:var(--sx-mute); transition:transform .3s, color .3s; }
.sx-tile:hover .sx-tile-arrow { transform:translate(3px,-3px); color:var(--sx-accent,#0E4AC6); }
.sx-bignum { font-size:54px; font-weight:800; letter-spacing:-.03em; line-height:1; background:linear-gradient(120deg,var(--sx-blue),var(--sx-cyan)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.sx-big-cats { display:flex; flex-wrap:wrap; gap:8px; margin-top:22px; }
.sx-big-cat { display:inline-flex; align-items:center; gap:7px; padding:8px 13px; border-radius:10px; background:var(--sx-bg-soft); border:1px solid var(--sx-line); font-size:13px; font-weight:600; color:var(--sx-ink-soft); transition:.2s; }
.sx-big-cat:hover { border-color:var(--sx-blue); color:var(--sx-blue); }

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
.sx-tile:focus-visible,
.sx-dir:focus-visible,
.sx-bpill:focus-visible,
.sx-case:focus-visible,
.sx-ncard:focus-visible { outline:2px solid var(--sx-blue,#1d7ed8); outline-offset:2px; border-radius:inherit; }
.soi-search-input:focus-visible { outline:2px solid var(--sx-blue,#1d7ed8); outline-offset:0; }
@media (prefers-reduced-motion: reduce) {
  .sx-cp-btn, .sx-cp-tile, .sx-tile, .sx-dir, .sx-bpill, .sx-case, .sx-ncard,
  .sx-btn { transition:none !important; transform:none !important; }
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

function SoiEcosystem({ lang, go }) {
  const cats = (window.DATA && window.DATA.CATEGORIES || []).slice(0, 4);
  const navCat = (id) => go("catalog", id ? { cat: id } : {});
  return (
    <section className="sx-section">
      <div className="sx-wrap">
        <div className="sx-head sx-rv">
          <span className="sx-eyebrow">{_lv(lang, "Единая экосистема", "Yagona ekotizim", "One ecosystem")}</span>
          <h2 className="sx-h2">{_lv(lang, "Вся медицинская инфраструктура — в одном месте", "Butun tibbiy infratuzilma — bir joyda", "All medical infrastructure — in one place")}</h2>
          <p className="sx-sub">{_lv(lang,
            "От поиска оборудования до регистрации изделий, тендеров и оснащения клиник «под ключ». ИНДУСТРИЯ ЗДОРОВЬЯ соединяет организации, поставщиков и сервисы в единую платформу.",
            "Uskuna qidirishdan tibbiy buyumlarni ro'yxatga olish, tender va klinikalarni jihozlashgacha. SOG’LIQ INDUSTRIYASI tashkilotlar, yetkazib beruvchilar va xizmatlarni yagona platformaga birlashtiradi.",
            "From equipment search to device registration, tenders and turnkey clinic setup. HEALTH INDUSTRY connects organizations, suppliers and services into one platform.")}</p>
        </div>

        <div className="sx-bento">
          <div className="sx-tile big sx-rv" style={{ "--sx-accent": "#0E4AC6" }} onClick={() => navCat()}>
            <div className="sx-tile-ic"><Icon name="grid" size={24} /></div>
            <div className="sx-bignum">2 800+</div>
            <h3>{_lv(lang, "Электронный каталог оборудования", "Elektron uskunalar katalogi", "Electronic equipment catalog")}</h3>
            <p>{_lv(lang, "Медтехника, мебель, инструменты и расходные материалы. Поиск по бренду, направлению медицины и наличию на складе.", "Tibbiy texnika, mebel, asboblar va sarf materiallari. Brend, yo'nalish va ombordagi mavjudlik bo'yicha qidiruv.", "Equipment, furniture, instruments and consumables. Search by brand, specialty and stock availability.")}</p>
            <div className="sx-big-cats">
              {cats.map((c) => (
                <span className="sx-big-cat" key={c.id} onClick={(e) => { e.stopPropagation(); navCat(c.id); }}>
                  <Icon name={c.icon} size={15} />{_lv(lang, c.ru, c.uz || c.ru, c.en || c.ru)}
                </span>
              ))}
            </div>
          </div>

          {[
            { area: "reg", accent: "#15A06A", ic: "check", n: null,
              t: _lv(lang, "Регистрация медицинских изделий", "Tibbiy buyumlarni ro'yxatga olish", "Medical device registration"),
              d: _lv(lang, "Сопровождение производителей и импортёров: подготовка досье и прохождение процедуры РУ в Узбекистане.", "Ishlab chiqaruvchilar va importchilarni qo'llab-quvvatlash: dosye tayyorlash va ro'yxatga olish.", "Support for manufacturers and importers: dossier preparation and the RC procedure in Uzbekistan."),
              foot: _lv(lang, "Экспертное направление", "Ekspert yo'nalish", "Expert service"), nav: () => go("registration") },
            { area: "tender", accent: "#6454D4", ic: "doc",
              t: _lv(lang, "Тендеры и госзакупки", "Tender va davlat xaridlari", "Tenders & procurement"),
              d: _lv(lang, "КП, спецификации и полный пакет документов под требования закупки.", "Taklif, spetsifikatsiya va to'liq hujjatlar to'plami.", "Quotes, specs and a full document package."),
              foot: _lv(lang, "Для закупщиков", "Xaridorlar uchun", "For buyers"), nav: () => go("tenders") },
            { area: "service", accent: "#14B8E0", ic: "wrench",
              t: _lv(lang, "Оснащение «под ключ»", "«Kalit ostida» jihozlash", "Turnkey equipping"),
              d: _lv(lang, "Подбор, монтаж, пусконаладка и сервис.", "Tanlash, montaj, ishga tushirish va servis.", "Selection, installation, setup and service."),
              foot: _lv(lang, "Полный цикл", "To'liq tsikl", "Full cycle"), nav: () => go("services") },
            { area: "brands", accent: "#E0492F", ic: "award", n: "120+",
              t: _lv(lang, "Мировые бренды", "Jahon brendlari", "Global brands"),
              d: _lv(lang, "Официальные поставки от производителей из 12 стран.", "12 mamlakatdan rasmiy yetkazib berish.", "Official supply from manufacturers across 12 countries."),
              foot: _lv(lang, "Все бренды", "Barcha brendlar", "All brands"), nav: () => go("partners") },
            { area: "equip", accent: "#0E4AC6", ic: "pin", n: "14",
              t: _lv(lang, "Доставка по всей стране", "Butun mamlakat bo'ylab", "Nationwide delivery"),
              d: _lv(lang, "Поставка, логистика и сопровождение в 14 регионах Узбекистана.", "14 hududda yetkazib berish va qo'llab-quvvatlash.", "Delivery and support across 14 regions of Uzbekistan."),
              foot: _lv(lang, "География поставок", "Yetkazish geografiyasi", "Delivery map"), nav: () => go("services") },
          ].map((x, i) => (
            <div className={"sx-tile " + x.area + " sx-rv"} key={x.area} style={{ "--sx-accent": x.accent, "--i": (i % 3) }} onClick={x.nav}>
              <div className="sx-tile-ic"><Icon name={x.ic} size={22} /></div>
              {x.n && <div className="sx-bignum" style={{ fontSize: 38, marginTop: 14 }}>{x.n}</div>}
              <h3>{x.t}</h3>
              <p>{x.d}</p>
              <div className="sx-tile-foot">{x.foot}<Icon name="arrowRight" size={15} className="sx-tile-arrow" /></div>
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
  SoiEcosystem, SoiDirections, SoiCatalogPortal, SoiImpact, SoiBrands, SoiCases, SoiReviews, SoiNews, SoiFinalCTA,
  SoiCaseModal: CaseModal,
});
