/* UzMedEx — Brand profile pages */

const BRAND_DATA = {
  ates:       { founded:1995, hq:"Москва, Россия",        hq_uz:"Moskva, Rossiya",   hq_en:"Moscow, Russia",
    desc_ru:"АТЕС МЕДИКА (ООО «АТЕС МЕДИКА софт») — российский разработчик компьютерных телемедицинских электрокардиографов с программой Easy ECG Rest, электроэнцефалографов и остеоденситометров. ПО работает в странах ЕС с 1995 года.",
    desc_uz:"АТЕС МЕДИКА — Easy ECG Rest dasturiga ega kompyuter telemeditsina elektrokardiograflar, elektroensefalograflar va osteodensitometrlar ishlab chiqaruvchi Rossiya kompaniyasi.",
    desc_en:"ATES MEDICA is a Russian developer of computer telemedicine electrocardiographs with Easy ECG Rest software, electroencephalographs and bone densitometers. Its software has run in EU countries since 1995." },
  tves:       { founded:1959, hq:"Тулиновка, Россия",     hq_uz:"Tulinovka, Rossiya", hq_en:"Tulinovka, Russia",
    desc_ru:"ТВЕС (Тулиновский приборостроительный завод) — российский производитель медицинских весов, ростомеров, диагностических комплексов и бактерицидного оборудования. Приборы для измерения физического развития человека поставляются в клиники по всему СНГ.",
    desc_uz:"ТВЕС (Tulinovka asboblar zavodi) — tibbiy tarozilar, boʻy oʻlchagichlar, diagnostika majmualari va bakteritsid uskunalar ishlab chiqaruvchi Rossiya korxonasi.",
    desc_en:"TVES (Tulinovka Instrument-Making Plant) is a Russian manufacturer of medical scales, stadiometers, diagnostic kiosks and germicidal equipment for measuring human physical development." },
  mindray:    { founded:1991, hq:"Шэньчжэнь, Китай",    hq_uz:"Shenzhen, Xitoy",   hq_en:"Shenzhen, China",
    desc_ru:"Mindray — один из крупнейших мировых производителей медицинской техники. Специализируется на системах ультразвуковой диагностики, мониторинге пациентов и лабораторном оборудовании. Экспортирует продукцию в более 190 стран.",
    desc_uz:"Mindray — tibbiy asboblar ishlab chiqaruvchilarning eng yirik dunyo brendlaridan biri. UZI tizimlar, bemor monitorlari va laboratoriya qurilmalarida ixtisoslashgan.",
    desc_en:"Mindray is one of the world's leading medical device manufacturers, specializing in diagnostic imaging, patient monitoring, and laboratory instruments, exporting to 190+ countries." },
  drager:     { founded:1889, hq:"Любек, Германия",      hq_uz:"Lyubek, Germaniya",  hq_en:"Lübeck, Germany",
    desc_ru:"Dräger — немецкий производитель с 130-летней историей. Лидер в области аппаратов для наркоза, ИВЛ, систем мониторинга и газовой аналитики для больниц и скорой помощи.",
    desc_uz:"Dräger — 130 yillik tarixga ega Germaniya ishlab chiqaruvchisi. Narkoz apparatlari, SLV va gaz tahlili tizimlari sohasida yetakchi.",
    desc_en:"Dräger is a German manufacturer with 130+ years of history, a leader in anesthesia machines, ventilators, and patient monitoring for hospitals and emergency services." },
  edan:       { founded:1995, hq:"Шэньчжэнь, Китай",    hq_uz:"Shenzhen, Xitoy",   hq_en:"Shenzhen, China",
    desc_ru:"Edan Instruments — разработчик ЭКГ-систем, портативных УЗИ-сканеров и мониторов. Продукция сертифицирована по стандартам CE и FDA. Работает в более 170 странах.",
    desc_uz:"Edan Instruments — EKG tizimlari, portativ UZI va monitorlar ishlab chiqaruvchisi. CE va FDA sertifikatlariga ega. 170+ mamlakatda ishlaydi.",
    desc_en:"Edan Instruments develops ECG systems, portable ultrasound scanners and monitors, certified to CE and FDA standards, operating in 170+ countries." },
  bpl:        { founded:1963, hq:"Бангалор, Индия",      hq_uz:"Bangalore, Hindiston", hq_en:"Bangalore, India",
    desc_ru:"BPL Medical Technologies — один из старейших производителей медицинской техники в Азии. Выпускает кардиологическое оборудование, ЭКГ-аппараты и физиотерапевтические системы.",
    desc_uz:"BPL Medical Technologies — Osiyodagi eng qadimgi tibbiy texnologiyalar ishlab chiqaruvchilaridan biri. Kardiologiya va fizioterapiya uskunalari.",
    desc_en:"BPL Medical Technologies is one of Asia's oldest medical device manufacturers, producing cardiac equipment, ECG machines and physiotherapy systems." },
  comen:      { founded:2002, hq:"Шэньчжэнь, Китай",    hq_uz:"Shenzhen, Xitoy",   hq_en:"Shenzhen, China",
    desc_ru:"Comen Medical — производитель мониторов пациентов, наркозных аппаратов и неонатального оборудования. Продукция широко применяется в реанимационных отделениях.",
    desc_uz:"Comen Medical — bemor monitorlari, narkoz apparatlari va neonatal uskunalar ishlab chiqaruvchisi.",
    desc_en:"Comen Medical manufactures patient monitors, anesthesia machines and neonatal equipment widely used in intensive care units." },
  tuttnauer:  { founded:1925, hq:"Реховот, Израиль",     hq_uz:"Rehovot, Isroil",   hq_en:"Rehovot, Israel",
    desc_ru:"Tuttnauer — мировой лидер в области стерилизации и дезинфекции с 1925 года. Паровые автоклавы Tuttnauer установлены в тысячах больниц и лабораторий по всему миру.",
    desc_uz:"Tuttnauer — 1925 yildan beri sterilizatsiya va dezinfeksiya sohasida dunyo yetakchisi. Avtoklavlari dunyo bo'ylab minglab kasalxonalarda o'rnatilgan.",
    desc_en:"Tuttnauer has been a world leader in sterilization and disinfection since 1925, with steam autoclaves installed in thousands of hospitals worldwide." },
  armed:      { founded:2002, hq:"Москва, Россия",        hq_uz:"Moskva, Rossiya",   hq_en:"Moscow, Russia",
    desc_ru:"Armed — российский производитель медицинской мебели, реабилитационного оборудования и медицинских изделий. Широкий ассортимент продукции для оснащения лечебных учреждений.",
    desc_uz:"Armed — tibbiy mebel, reabilitatsiya uskunalari va tibbiy buyumlar ishlab chiqaruvchi Rossiya kompaniyasi.",
    desc_en:"Armed is a Russian manufacturer of medical furniture, rehabilitation equipment and medical supplies with a wide range for equipping healthcare facilities." },
  bmt:        { founded:1992, hq:"Прага, Чехия",          hq_uz:"Praga, Chexiya",    hq_en:"Prague, Czech Republic",
    desc_ru:"BMT Medical Technology — чешский разработчик и производитель оборудования для стерилизации, включая паровые автоклавы класса B и ультразвуковые мойки для медицинских инструментов.",
    desc_uz:"BMT Medical Technology — B sinf bug' avtoklavi va ultratovushli yuvgichlar ishlab chiqaruvchi Chexiya kompaniyasi.",
    desc_en:"BMT Medical Technology is a Czech developer and manufacturer of sterilization equipment including Class B steam autoclaves and ultrasonic instrument washers." },
  midmark:    { founded:1915, hq:"Версаль, США",          hq_uz:"Versailles, AQSh",  hq_en:"Versailles, USA",
    desc_ru:"Midmark — американский производитель медицинской мебели и осветительного оборудования с вековой историей. Известен смотровыми креслами и операционными светильниками.",
    desc_uz:"Midmark — 100 yillik tarixga ega Amerika kompaniyasi. Ko'rik kreslolari va operatsiya chiroqlari bilan mashhur.",
    desc_en:"Midmark is an American manufacturer of medical furniture and lighting with a century of history, known for examination chairs and surgical lights." },
  choice:     { founded:2000, hq:"Пекин, Китай",          hq_uz:"Pekin, Xitoy",      hq_en:"Beijing, China",
    desc_ru:"ChoiceMMed — производитель портативных диагностических устройств, включая пульсоксиметры, термометры и аппараты для измерения давления. Продукция представлена в 80+ странах.",
    desc_uz:"ChoiceMMed — portativ diagnostika qurilmalari ishlab chiqaruvchisi. Pulsoksimetrlar va tonometrlar 80+ mamlakatda sotiladi.",
    desc_en:"ChoiceMMed produces portable diagnostic devices including pulse oximeters and blood pressure monitors, sold in 80+ countries." },
};

function BrandPage({ t, lang, store, go, params }) {
  const brand  = (window.DATA?.BRANDS || []).find(b => b.id === params.id);
  const prods  = (window.DATA?.PRODUCTS || []).filter(p => p.brand === params.id);
  const info   = BRAND_DATA[params.id] || {};
  if (!brand) { go("catalog", {}); return null; }

  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const country = lv(brand.country_ru, brand.country_uz, brand.country_en);
  const desc    = lv(info.desc_ru, info.desc_uz, info.desc_en) || "";

  const cats = [...new Set(prods.map(p => p.cat))];
  const catName = id => {
    const c = (window.DATA?.CATEGORIES || []).find(x => x.id === id);
    return c ? lv(c.ru, c.uz, c.en) : id;
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      <div className="wrap">
        <div className="crumb">
          <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
          <Icon name="chevronRight" size={14} />
          <a onClick={() => go("catalog", {})}>{t.catalog}</a>
          <Icon name="chevronRight" size={14} />
          <span className="cur">{brand.name}</span>
        </div>
      </div>

      {/* brand hero */}
      <div className="brand-hero">
        <div className="wrap">
          <div className="brand-hero-inner">
            <div className="brand-logo-big">{brand.name.slice(0,2).toUpperCase()}</div>
            <div className="brand-hero-info">
              <div className="brand-hero-name">{brand.name}</div>
              <div className="brand-hero-meta">
                <span><Icon name="pin" size={14} style={{verticalAlign:"middle",marginRight:5}} />{country}</span>
                {info.founded && <span><Icon name="award" size={14} style={{verticalAlign:"middle",marginRight:5}} />{lv("Основана в","Asoslangan","Founded")} {info.founded}</span>}
                <span><Icon name="grid" size={14} style={{verticalAlign:"middle",marginRight:5}} />{prods.length} {t.items_count}</span>
              </div>
              {desc && <p className="brand-hero-desc">{desc}</p>}
            </div>
            <button className="btn btn-primary" onClick={() => window.__openQuote && window.__openQuote()}>
              <Icon name="phone" size={18} />{lv("Связаться с менеджером","Menejer bilan bog'lanish","Contact manager")}
            </button>
          </div>
          <div className="brand-hero-stats">
            <div className="bhs"><div className="bhs-n">{prods.length}</div><div className="bhs-l">{t.items_count}</div></div>
            <div className="bhs"><div className="bhs-n">{cats.length}</div><div className="bhs-l">{lv("направлений","yo'nalish","directions")}</div></div>
            <div className="bhs"><div className="bhs-n">{prods.filter(p=>p.stock==="in").length}</div><div className="bhs-l">{t.in_stock}</div></div>
            <div className="bhs"><div className="bhs-n">24</div><div className="bhs-l">{lv("мес. гарантия","oy kafolat","mo. warranty")}</div></div>
          </div>
        </div>
      </div>

      {/* products grid */}
      <div className="wrap" style={{ marginTop: 40 }}>
        <div className="sec-head">
          <div>
            <h2>{lv("Оборудование","Uskunalar","Products")} {brand.name}</h2>
            <div className="sub">{cats.map(c => catName(c)).join(" · ")}</div>
          </div>
        </div>
        <div className="grid-4">
          {prods.map(p => (
            <ProductCard key={p.id} product={p} t={t} lang={lang} store={store} onOpen={pr => go("product", { id: pr.id })} />
          ))}
        </div>

        {/* partnership CTA */}
        <div className="ctaband" style={{ marginTop: 48 }}>
          <div className="cb-grid" />
          <div className="cb-l" style={{ position: "relative" }}>
            <h2>{lv(`Официальный партнёр ${brand.name}`, `${brand.name} rasmiy hamkori`, `Official ${brand.name} partner`)}</h2>
            <p>{lv("Прямые поставки, оригинальные запчасти, авторизованный сервисный центр и полный пакет документов.", "To'g'ridan-to'g'ri yetkazish, original ehtiyot qismlar, vakolatli servis markazi.", "Direct supply, genuine spare parts, authorized service centre and full documentation package.")}</p>
          </div>
          <div className="cb-r" style={{ position: "relative" }}>
            <button className="btn btn-cyan btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>
              {t.nav_quote}<Icon name="arrowRight" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function brandCity(id, lang) {
  const info = BRAND_DATA[id];
  if (!info || !info.hq) return null;
  const hq = lang === "uz" ? (info.hq_uz || info.hq) : lang === "en" ? (info.hq_en || info.hq) : info.hq;
  return hq.split(",")[0].trim();
}

const BRAND_HUE = { mindray:210, drager:222, edan:200, bpl:28, comen:190, tuttnauer:160, armed:0, bmt:265, midmark:340, choice:140, braun:205, "3m":0, hartmann:150, kimberley:280, tves:185, ates:205 };

function BrandsListPage({ t, lang, store, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const brands = window.DATA?.BRANDS || [];
  const P = window.DATA?.PRODUCTS || [];
  const [search, setSearch] = React.useState("");
  const filtered = brands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  const countryFlag = (id) => {
    const flags = { mindray:"🇨🇳", drager:"🇩🇪", edan:"🇨🇳", bpl:"🇮🇳", comen:"🇨🇳", tuttnauer:"🇮🇱", armed:"🇨🇳", bmt:"🇨🇿", midmark:"🇺🇸", choice:"🇨🇳", braun:"🇩🇪", "3m":"🇺🇸", hartmann:"🇩🇪", kimberley:"🇺🇸", tves:"🇷🇺", ates:"🇷🇺" };
    return flags[id] || "🌐";
  };

  return (
    <div>
      {/* PAGE HERO */}
      <div style={{ background: "linear-gradient(180deg,#f6f9fd,#eef3f9)", borderBottom: "1px solid var(--line)", padding: "44px 0 38px" }}>
        <div className="wrap">
          <div className="crumb">
            <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
            <Icon name="chevronRight" size={14} />
            <span className="cur">{t.sec_brands}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-.025em", margin: "12px 0 8px" }}>{t.sec_brands}</h1>
          <p style={{ fontSize: 15.5, color: "var(--slate-600)", maxWidth: 560 }}>{t.sec_brands_sub}</p>
          <div className="brand-search-row">
            <div className="brand-search-inp">
              <Icon name="search" size={18} style={{ color: "var(--slate-400)", flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lv("Поиск по производителям…", "Ishlab chiqaruvchilar bo'yicha qidirish…", "Search manufacturers…")} />
            </div>
            <span style={{ fontSize: 13.5, color: "var(--slate-500)", fontWeight: 600 }}>
              {filtered.length} {lv("брендов", "brend", "brands")}
            </span>
          </div>
        </div>
      </div>

      {/* BRANDS GRID */}
      <div className="wrap" style={{ padding: "40px 32px 80px" }}>
        <div className="brands-page-grid">
          {filtered.map((b) => {
            const city = brandCity(b.id, lang);
            const country = lv(b.country_ru, b.country_uz, b.country_en);
            const count = P.filter(p => p.brand === b.id).length;
            const flag = countryFlag(b.id);
            return (
              <div key={b.id} className="brand-tile" onClick={() => go("brand", { id: b.id })}>
                <div className="bt-logo">
                  <div className="bt-mono">{b.name.slice(0, 2).toUpperCase()}</div>
                </div>
                <div className="bt-body">
                  <div className="bt-name">{b.name}</div>
                  <div className="bt-loc">{flag} {city ? `${city}, ${country}` : country}</div>
                  {count > 0 && (
                    <div className="bt-count">
                      <Icon name="box" size={13} />
                      {count} {t.items_count}
                    </div>
                  )}
                </div>
                <div className="bt-arrow"><Icon name="chevronRight" size={18} /></div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--slate-400)", fontSize: 15 }}>
            {lv("Ничего не найдено", "Hech narsa topilmadi", "Nothing found")}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BrandPage, BrandsListPage });
