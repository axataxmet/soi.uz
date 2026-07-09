/* Sog'liq Industriyasi — home page */
const { useState, useEffect, useRef } = React;

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
  const featured = window.DATA.PRODUCTS.find((p) => p.id === "p013") || window.DATA.PRODUCTS[0];
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  const devices = [
    { icon: "pulse",        ru: "УЗИ-система",       uz: "UZI tizimi",        en: "Ultrasound",        tag: lv("4 датчика", "4 datchik", "4 probes"),    c: "#1757c8", area: "uzi",  big: true },
    { icon: "cross-pulse",  ru: "Монитор пациента",  uz: "Bemor monitori",    en: "Patient monitor",   tag: lv("ЭКГ · SpO₂", "EKG · SpO₂", "ECG · SpO₂"), c: "#15aed8", area: "mon" },
    { icon: "ventilator",   ru: "Аппарат ИВЛ",       uz: "Sun'iy nafas",      en: "Ventilator",        tag: lv("реанимация", "reanimatsiya", "ICU"),      c: "#2d72e3", area: "vent" },
    { icon: "shield-cross", ru: "Дефибриллятор",     uz: "Defibrillyator",    en: "Defibrillator",     tag: lv("скорая", "tez yordam", "emergency"),      c: "#6454d4", area: "defib" },
    { icon: "wave",         ru: "Стерилизатор",      uz: "Sterilizator",      en: "Sterilizer",        tag: lv("автоклав", "avtoklav", "autoclave"),      c: "#0d96be", area: "ster" },
  ];

  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-base-fade" />
      <div className="wrap">
        <div className="hero-l" style={{ fontFamily: "Manrope" }}>
          <div className="hero-kicker"><span className="hk-dot" />{t.hero_kicker}</div>
          <h1>{t.hero_title_1}<br /><span className="grad">{t.hero_title_2}</span></h1>
          <p className="hero-sub">{t.hero_sub}</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>
              <Icon name="doc" size={20} />{t.hero_cta_quote}
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => go("catalog", {})}>
              <Icon name="grid" size={18} />{t.hero_cta_catalog}
            </button>
          </div>
          <div className="hero-cta-note">
            <Icon name="clock" size={14} />{t.hero_cta_note}
          </div>
          <div className="hero-badges">
            {[t.hero_b1, t.hero_b2, t.hero_b3, t.hero_b4].map((b, i) => (
              <span className="hero-badge" key={i}><Icon name="check" size={13} />{b}</span>
            ))}
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="hs-n">2 800<span className="u">+</span></div><div className="hs-l">{t.hero_stat_1}</div></div>
            <div className="hstat"><div className="hs-n">120<span className="u">+</span></div><div className="hs-l">{t.hero_stat_2}</div></div>
            <div className="hstat"><div className="hs-n">14</div><div className="hs-l">{t.hero_stat_3}</div></div>
            <div className="hstat"><div className="hs-n">12</div><div className="hs-l">{t.hero_stat_4}</div></div>
          </div>
        </div>
        <div className="hero-r">
          <HeroSignals lang={lang} go={go} />
        </div>
      </div>
    </section>);

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
  const coNav = (view) => {
    if (window.parent && window.parent !== window) window.parent.postMessage({ type: "soi-conav", view }, "*");
    else location.href = "soi.uz.html#/" + (view === "home" ? "" : view);
  };
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="fcols">
          <div>
            <img className="foot-logo" src={window.__asset("assets/soi-mark-white.svg")} alt="Sog'liq Industriyasi" style={{ width: 48, height: 48, marginBottom: 14 }} />
            <p className="fabout">{t.foot_about}</p>
            <a className="cb-phone" href="tel:+998772250001" style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>+998 (77) 225-00-01</a>
          </div>
          <div>
            <h5>{lv("Компания", "Kompaniya", "Company")}</h5>
            <ul>
              <li><a onClick={() => coNav("about")}>{lv("О компании", "Kompaniya haqida", "About")}</a></li>
              <li><a onClick={() => coNav("services")}>{lv("Услуги", "Xizmatlar", "Services")}</a></li>
              <li><a onClick={() => coNav("projects")}>{lv("Проекты", "Loyihalar", "Projects")}</a></li>
              <li><a onClick={() => coNav("partners")}>{lv("Партнёры", "Hamkorlar", "Partners")}</a></li>
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
              <li style={{ color: "#aab8c9" }}>{t.office_addr}</li>
              <li><a href="tel:+998772250001">{lv("Приёмная", "Qabulxona", "Reception")}: +998 (77) 225-00-01</a></li>
              <li><a href="tel:+998772240001">{lv("Отдел продаж", "Sotuv bo'limi", "Sales")}: +998 (77) 224-00-01</a></li>
              <li><a href="mailto:info@sogliqindustriyasi.uz">info@sogliqindustriyasi.uz</a></li>
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
            {lang === "uz" ? "«SOG'LIQ INDUSTRIYASI» MChJ • 100069, Toshkent • STIR: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz" : lang === "en" ? "LLC «HEALTH INDUSTRY» (SOG'LIQ INDUSTRIYASI MCHJ) • 100069, Tashkent • TIN: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz" : "ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» (SOG'LIQ INDUSTRIYASI MCHJ) • 100069, Ташкент • ИНН: 312513138 • +998 (77) 225-00-01 • info@sogliqindustriyasi.uz"}
          </span>
          <div className="foot-socials">
            <a href="https://t.me/uzmedex" target="_blank" rel="noopener" title="Telegram" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.19-2.07 9.74c-.15.68-.56.85-1.13.53l-3.13-2.3-1.51 1.45c-.17.17-.31.31-.63.31l.22-3.18 5.79-5.23c.25-.22-.06-.35-.39-.12L6.07 13.88l-3.07-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.83.88z"/></svg>
            </a>
            <a href="https://instagram.com/uzmedex" target="_blank" rel="noopener" title="Instagram" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://facebook.com/uzmedex" target="_blank" rel="noopener" title="Facebook" className="foot-soc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://youtube.com/@uzmedex" target="_blank" rel="noopener" title="YouTube" className="foot-soc">
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

function HomePage({ t, lang, store, go }) {
  const P = window.DATA.PRODUCTS;
  const featured = P.filter((p) => p.badge === "hit" || p.pop > 75).slice(0, 4);
  const instock = P.filter((p) => p.stock === "in").slice(0, 4);
  return (
    <div>
      <Hero t={t} lang={lang} go={go} />
      <EquipScenarios t={t} lang={lang} go={go} />
      <FeaturedRow t={t} lang={lang} store={store} go={go}
      title={t.sec_featured} sub={t.sec_featured_sub} items={featured}
      link={() => go("catalog", { badge: "hit" })} />
      <TrustBand t={t} />
      <FeaturedRow t={t} lang={lang} store={store} go={go}
      title={t.sec_instock} sub={t.sec_brands_sub} items={instock}
      link={() => go("catalog", { stock: "in" })} />
      <TenderBand t={t} lang={lang} go={go} />
      <ServiceBand t={t} lang={lang} go={go} />
      <BrandStrip t={t} lang={lang} go={go} />
      <RecentlyViewed t={t} lang={lang} store={store} go={go} excludeId={null} />
      <NewsSection t={t} lang={lang} go={go} />
      <HomeReviews t={t} lang={lang} go={go} />
      <ArticlesSection t={t} lang={lang} go={go} />
    </div>);

}

Object.assign(window, { HomePage, Footer, Hero, CategoryGrid, FeaturedRow, TrustBand, BrandStrip, CtaBand, HeroVideoSlot });