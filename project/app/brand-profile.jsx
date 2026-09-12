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
  /* МИЗ-Ворсма зарегистрирован в БД под cuid, а не человекочитаемым слагом —
     остальные бренды выше используют слаг вида "ates"/"tves" просто потому,
     что так исторически завели их id при первом импорте; для новых брендов
     через админку id всегда cuid, ключ здесь обязан совпадать с ним. */
  cmtvw04x90007xb1k6ybk5bhj: { founded:1820, hq:"Ворсма, Россия", hq_uz:"Vorsma, Rossiya", hq_en:"Vorsma, Russia",
    desc_ru:"МИЗ-Ворсма (Медико-инструментальный завод им. В. И. Ленина) — крупнейший в России производитель медицинских инструментов и расходных материалов, с историей почти 200 лет. Выпускает свыше 1000 наименований изделий для хирургии, стоматологии, урологии, травматологии, акушерства и других направлений медицины, сертифицированных по стандарту CE.",
    desc_uz:"МИЗ-Ворсма — Rossiyadagi eng yirik tibbiy asboblar va sarflanadigan materiallar ishlab chiqaruvchisi, deyarli 200 yillik tarixga ega. Jarrohlik, stomatologiya, urologiya va boshqa yo'nalishlar uchun 1000 dan ortiq CE sertifikatlangan mahsulot chiqaradi.",
    desc_en:"MIZ-Vorsma (V.I. Lenin Medical Instrument Plant) is Russia's largest manufacturer of medical instruments and consumables, with nearly 200 years of history. It produces 1,000+ CE-certified items for surgery, dentistry, urology, traumatology, obstetrics and other medical fields.",
    history_ru:"История завода начинается в 1820 году, когда мастер Иван Завьялов основал в посёлке Ворсма фабрику стальных изделий — ножей и слесарного инструмента. Первые медицинские инструменты предприятие выпустило в 1914 году, а в советское время получило имя В. И. Ленина. Сегодня продукцию МИЗ-Ворсма используют ведущие клиники и институты России — от НИИ им. Н. В. Склифосовского до Центра им. В. А. Алмазова.",
    history_uz:"Zavod tarixi 1820 yilda boshlangan — usta Ivan Zavyalov Vorsma qishlog'ida po'lat buyumlar (pichoqlar va chilangar asboblari) fabrikasini asos solgan. Birinchi tibbiy asboblar 1914 yilda chiqarilgan. Bugungi kunda mahsulotlaridan Rossiyaning yetakchi klinika va institutlari foydalanadi.",
    history_en:"The plant's history began in 1820, when craftsman Ivan Zavyalov founded a steel-goods factory in the village of Vorsma, making knives and locksmith tools. Its first medical instruments were produced in 1914. Today its products are used by Russia's leading clinics and research institutes." },
};

function BrandPage({ t, lang, store, go, params }) {
  /* window.DATA.BRANDS приходит из API асинхронно (как и window.DATA.PRODUCTS
     в PartnersPage) — на самом первом рендере, ещё до ответа сервера, список
     пуст. Раньше это читалось как «бренда не существует», и прямой заход по
     ссылке (/catalog/brand/<id>) мгновенно редиректил на /catalog ещё до
     прихода данных — открыть страницу бренда напрямую было невозможно вообще,
     редирект срабатывал детерминированно на каждый hard-load. Теперь ждём
     первую загрузку данных и перерисовываемся по "soi-data-changed"; на
     редирект уходим только если бренды уже загружены и среди них
     действительно нет такого id. */
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const h = () => force((n) => n + 1);
    window.addEventListener("soi-data-changed", h);
    return () => window.removeEventListener("soi-data-changed", h);
  }, []);
  /* window.DATA.BRANDS до ответа API уже не пуст — там временный локальный
     сид (меньше и без свежих брендов вроде ЗЕРЦ), который catalog-remote.js
     подменяет на полный список только после reload(). Простой length>0
     считал этот сид «данные загружены» и редиректил в том самом окне между
     сидом и настоящим ответом API — SOI_CATALOG_SOURCE выставляется в "api"
     только когда реальные данные действительно пришли. */
  const brandsLoaded = window.SOI_CATALOG_SOURCE === "api";
  const brand  = (window.DATA?.BRANDS || []).find(b => b.id === params.id);
  const prods  = (window.DATA?.PRODUCTS || []).filter(p => p.brand === params.id);
  const info   = BRAND_DATA[params.id] || {};
  if (!brand) {
    if (brandsLoaded) { go("catalog", {}); return null; }
    return null; // данные ещё грузятся — ничего не решаем, ждём soi-data-changed
  }

  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  const cats = [...new Set(prods.map(p => p.cat))];
  const catName = id => {
    const c = (window.DATA?.CATEGORIES || []).find(x => x.id === id);
    return c ? lv(c.ru, c.uz, c.en) : id;
  };
  /* Разбивка товаров бренда по направлениям — как в примере
     medcomp.ru/proizvoditeli/promet: слева список направлений-якорей,
     справа — товары, сгруппированные по направлению отдельными секциями,
     а не одной сплошной плиткой вперемешку.
     Группируем по товарной группе (p.group — «Сейф-термостат...», «Матрац
     медицинский» и т.п.), а не по верхней категории (мебель/оборудование) —
     той было всего 2, и разные типы товаров одного бренда лежали вперемешку
     в одной секции; так гранулярность как у примера-эталона. */
  /* Товарные группы лежат в дереве window.DATA.CATEGORIES[].subs[].groups[]
     (то же дерево, что использует каталог для навигации) — отдельного
     плоского списка групп на этой странице нет, поэтому раскрываем дерево
     один раз и ищем группу по id. */
  const allGroups = (window.DATA?.CATEGORIES || []).flatMap(c => (c.subs || []).flatMap(s => s.groups || []));
  const groupMeta = gid => allGroups.find(g => g._id === gid || g.id === gid);
  const groupOrder = gid => { const g = groupMeta(gid); return g && typeof g.order === "number" ? g.order : 999; };
  const groupIds = [...new Set(prods.map(p => p.group).filter(Boolean))].sort((a, b) => groupOrder(a) - groupOrder(b));
  const groupName = gid => {
    const g = groupMeta(gid);
    return g ? tri(lang, g.ru, g.uz, g.en) : catName((prods.find(p => p.group === gid) || {}).cat);
  };
  const catSlug = id => "brand-cat-" + String(id).replace(/[^a-zA-Z0-9_-]/g, "");
  // товары без товарной группы (не должно быть в норме, но на всякий случай не теряем) — сводим в секции по категории
  const ungrouped = prods.filter(p => !p.group);
  const prodsByCat = [
    ...groupIds.map(id => ({ id, name: groupName(id), items: prods.filter(p => p.group === id) })),
    ...(ungrouped.length ? [...new Set(ungrouped.map(p => p.cat))].map(id => ({ id, name: catName(id), items: ungrouped.filter(p => p.cat === id) })) : []),
  ];
  const scrollToCat = id => {
    const el = document.getElementById(catSlug(id));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Активный пункт в «Направлениях» подсвечиваем по секции, видимой в
     верхней части экрана — иначе после клика или прокрутки колёсиком
     непонятно, где сейчас находишься в длинном списке направлений
     (правило «Active State» из UX-гайдлайна: текущий раздел нав. должен
     быть видимо выделен). */
  const [activeGroup, setActiveGroup] = React.useState(null);
  React.useEffect(() => {
    if (prodsByCat.length < 2) return;
    const els = prodsByCat.map(c => document.getElementById(catSlug(c.id))).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveGroup(visible[0].target.id);
    }, { rootMargin: "-96px 0px -70% 0px", threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [prods.length]);

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

      {/* products grid */}
      <div className="wrap" style={{ marginTop: 40 }}>
        <div className="sec-head">
          <div>
            <h2>{lv("Оборудование","Uskunalar","Products")} {brand.name}</h2>
            <div className="sub">{cats.map(c => catName(c)).join(" · ")}</div>
          </div>
        </div>

        {/* Направления слева (якоря на секции), товары справа по разделам —
            структура как на medcomp.ru/proizvoditeli/promet, вместо одной
            общей плитки все товары бренда сразу видно по направлениям. */}
        <div className="cat-layout">
          {prodsByCat.length > 1 && (
            <aside className="filters" style={{ position: "sticky", top: 88 }}>
              <div className="flt-head"><h3>{lv("Направления","Yo'nalishlar","Directions")}</h3></div>
              <div className="flt-grp" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {prodsByCat.map(c => (
                  <a key={c.id} className={"brand-cat-link" + (activeGroup === catSlug(c.id) ? " active" : "")} onClick={() => scrollToCat(c.id)}>
                    <span>{c.name}</span>
                    <span className="brand-cat-count">{c.items.length}</span>
                  </a>
                ))}
              </div>
            </aside>
          )}

          <div className="cat-main">
            {prodsByCat.map((c, idx) => (
              /* .cat-prod несёт свой responsive padding-top (используется и на
                 странице категории) — на первой секции он был заметно больше,
                 чем padding-top заголовка «Направления» в сайдбаре (18px), из-за
                 чего заголовки первого ряда «съезжали» друг относительно друга.
                 Выравниваем только первую секцию по той же базовой линии. */
              <section key={c.id} id={catSlug(c.id)} className="cat-prod" style={{ marginBottom: 40, paddingTop: idx === 0 ? 18 : undefined }}>
                {prodsByCat.length > 1 && (
                  <div className="cat-prod-head"><h3 style={{ margin: 0 }}>{c.name}</h3></div>
                )}
                {/* ProductTile — тот же корпус карточки (.ptile), что и в каталоге
                    (сетка товарной группы, «Похожие товары» и т.д.). Раньше здесь
                    стоял старый ProductCard (.card) — другая разметка и стиль,
                    карточки бренда визуально не совпадали с остальным каталогом. */}
                <div className="cat-prod-grid">
                  {c.items.map(p => (
                    <ProductTile key={p.id} product={p} t={t} lang={lang} store={store} buyLabel={t.buy_now} onOpen={pr => go("product", { id: pr.id })} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Краткая история производителя — только когда для бренда она задана
            в BRAND_DATA (history_ru/uz/en); для остальных брендов блок не
            рендерится, регрессии для них нет. */}
        {(info.history_ru || info.history_en) && (
          <div className="brand-history" style={{ marginTop: 48 }}>
            <h2>{lv("История производителя", "Ishlab chiqaruvchi tarixi", "Manufacturer history")}</h2>
            <p>{lv(info.history_ru, info.history_uz, info.history_en)}</p>
          </div>
        )}

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

const BRAND_HUE = { mindray:210, drager:222, edan:200, bpl:28, comen:190, tuttnauer:160, armed:0, bmt:265, midmark:340, choice:140, braun:205, "3m":0, hartmann:150, kimberley:280, tves:185, ates:205 };

const BRANDS_PER_PAGE = 16; // 4 columns × 4 rows

/* BrandsListPage удалён: страницы нет в меню каталога. */
Object.assign(window, { BrandPage });
