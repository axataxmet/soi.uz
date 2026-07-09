/* ============================================================
   SOI CORE — единый источник данных для всех зон soi.uz
   (корпоративная часть + каталог + админка).
   Подключается ПЕРВЫМ, до corp/content.js и app/data.js.
   Доступ: window.SOI_CORE
   ============================================================ */
(function () {
  "use strict";

  // ---- год основания (единственное место хранения) ----
  var DEFAULT_FOUNDED = 2021;
  function foundedYear() {
    try {
      var v = parseInt(localStorage.getItem("soi_founded_year"), 10);
      if (v >= 1990 && v <= new Date().getFullYear()) return v;
    } catch (e) {}
    return DEFAULT_FOUNDED;
  }
  function yearsOnMarket() {
    return new Date().getFullYear() - foundedYear();
  }

  // ---- юридические названия (RU / UZ / EN) ----
  var LEGAL = {
    short:  { ru: "ИНДУСТРИЯ ЗДОРОВЬЯ", uz: "SOG’LIQ INDUSTRIYASI", en: "HEALTH INDUSTRY" },
    full:   {
      ru: "ООО «ИНДУСТРИЯ ЗДОРОВЬЯ»",
      uz: "«SOG’LIQ INDUSTRIYASI» MChJ",
      en: "LLC «HEALTH INDUSTRY»"
    },
    latin:  "SOG’LIQ INDUSTRIYASI MChJ",
    brand:  "ИНДУСТРИЯ ЗДОРОВЬЯ"
  };

  // ---- реквизиты ----
  var REQUISITES = {
    taxId: "312513138",          // СТИР / ИНН
    postalCode: "100069",
    cityRu: "Ташкент", cityUz: "Toshkent", cityEn: "Tashkent",
    streetRu: "ул. МКАД, д. 16", streetUz: "MKAD ko'ch., 16-uy", streetEn: "MKAD street, 16",
    addrRu: "100069, Ташкент, Узбекистан, ул. МКАД, д. 16",
    addrUz: "100069, Toshkent, O'zbekiston, MKAD ko'ch., 16-uy",
    addrEn: "100069, Tashkent, Uzbekistan, MKAD street, 16",
    countryCode: "UZ"
  };

  // ---- контакты ----
  var CONTACTS = {
    phoneReception: "+998 (77) 225-00-01",
    phoneReceptionRaw: "+998772250001",
    phoneSales: "+998 (77) 224-00-01",
    phoneSalesRaw: "+998772240001",
    email: "info@sogliqindustriyasi.uz",
    hoursRu: "Пн–Пт, 8:00–17:00",
    hoursUz: "Du–Ju, 8:00–17:00",
    hoursEn: "Mon–Fri, 8:00–17:00",
    telegram: "@sogliq_industriyasi_bot",
    domain: "soi.uz",
    catalogPath: "/catalog"
  };

  // ---- helper: выбор языка ----
  function lv(lang, ru, uz, en) {
    return lang === "uz" ? uz : lang === "en" ? en : ru;
  }

  // ---- таксономия раздела «Новости и публикации» ----
  // Основные категории (кнопки-вкладки сверху) + теги-направления (ниже).
  var NEWS_CATEGORIES = [
    { id: "new",     ru: "Новинки",  uz: "Yangiliklar", en: "New arrivals" },
    { id: "article", ru: "Статьи",   uz: "Maqolalar",   en: "Articles" },
    { id: "guide",   ru: "Гайды",    uz: "Qo'llanmalar", en: "Guides" },
    { id: "case",    ru: "Кейсы",    uz: "Keyslar",     en: "Cases" },
    { id: "tender",  ru: "Тендеры",  uz: "Tenderlar",   en: "Tenders" },
    { id: "video",   ru: "Видео",    uz: "Video",       en: "Video" },
    { id: "company", ru: "Компания", uz: "Kompaniya",   en: "Company" }
  ];
  var NEWS_TAGS = [
    { id: "service",      ru: "Сервис",              uz: "Servis",              en: "Service" },
    { id: "mdreg",        ru: "Регистрация МИ",      uz: "TI ro'yxati",         en: "MD registration" },
    { id: "supply",       ru: "Поставки",            uz: "Yetkazib berish",     en: "Supply" },
    { id: "brands",       ru: "Бренды",              uz: "Brendlar",            en: "Brands" },
    { id: "diagnostics",  ru: "Диагностика",         uz: "Diagnostika",         en: "Diagnostics" },
    { id: "sterilization",ru: "Стерилизация",        uz: "Sterilizatsiya",      en: "Sterilization" },
    { id: "furniture",    ru: "Медицинская мебель",  uz: "Tibbiy mebel",        en: "Medical furniture" },
    { id: "consumables",  ru: "Расходные материалы", uz: "Sarf materiallari",   en: "Consumables" },
    { id: "procurement",  ru: "Госзакупки",          uz: "Davlat xaridlari",    en: "Public procurement" }
  ];

  // ---- раздел «Кейсы» (реализованные проекты) ----
  // L: tri-lang helper { ru, uz, en }
  function L(ru, uz, en) { return { ru: ru, uz: uz, en: en }; }

  // Типы учреждений (кнопки-фильтры + бейдж по умолчанию)
  var CASE_TYPES = [
    { id: "gov",     ru: "Госучреждение",  uz: "Davlat muassasasi", en: "Public institution" },
    { id: "private", ru: "Частная клиника", uz: "Xususiy klinika",   en: "Private clinic" }
  ];

  // Регионы Узбекистана для выпадающего списка
  var CASE_REGIONS = [
    "Ташкент", "Самарканд", "Бухара", "Хива", "Фергана", "Андижан",
    "Наманган", "Кашкадарья", "Сурхандарья", "Джизак", "Навои",
    "Сырдарья", "Хорезм", "Каракалпакстан"
  ];

  // Дефолтные кейсы — структура совпадает с карточкой на странице «Кейсы».
  // Поля: tag (бейдж), title (заголовок), desc (описание),
  //       year, scope (объём), region (регион), type (фильтр), image, status
  var CASES_DEFAULT = [
    { id: "case_p1", type: "gov", tag: L("Госучреждение","Davlat muassasasi","Public institution"),
      title: L("Оснащение областной многопрофильной больницы","Viloyat ko'p tarmoqli kasalxonasini jihozlash","Equipping a regional multidisciplinary hospital"),
      desc: L("Полный комплекс диагностического и реанимационного оборудования для нового корпуса.","Yangi korpus uchun diagnostika va reanimatsiya uskunalari majmuasi.","A full set of diagnostic and ICU equipment for a new wing."),
      year: "2024", scope: L("180+ единиц","180+ birlik","180+ units"), region: "Самарканд", image: null, status: "published" },
    { id: "case_p2", type: "private", tag: L("Частная клиника","Xususiy klinika","Private clinic"),
      title: L("Диагностический центр «под ключ»","«Kalit ostida» diagnostika markazi","Turnkey diagnostic center"),
      desc: L("УЗИ, рентген, лаборатория и мебель с монтажом и обучением персонала.","UZI, rentgen, laboratoriya va mebel montaj va o'qitish bilan.","Ultrasound, X-ray, lab and furniture with installation and training."),
      year: "2023", scope: L("«Под ключ»","«Kalit ostida»","Turnkey"), region: "Ташкент", image: null, status: "published" },
    { id: "case_p3", type: "gov", tag: L("Госучреждение","Davlat muassasasi","Public institution"),
      title: L("Поставка реанимационного оборудования","Reanimatsiya uskunalarini yetkazish","ICU equipment supply"),
      desc: L("Аппараты ИВЛ, мониторы пациента и дефибрилляторы для районных больниц.","IVL apparatlari, bemor monitorlari va defibrillyatorlar.","Ventilators, patient monitors and defibrillators for district hospitals."),
      year: "2023", scope: L("90+ единиц","90+ birlik","90+ units"), region: "Фергана", image: null, status: "published" },
    { id: "case_p4", type: "private", tag: L("Лаборатория","Laboratoriya","Laboratory"),
      title: L("Оснащение клинико-диагностической лаборатории","Klinik-diagnostika laboratoriyasini jihozlash","Equipping a clinical diagnostic laboratory"),
      desc: L("Анализаторы, центрифуги и расходные материалы с сервисным договором.","Analizatorlar, sentrifugalar va sarf materiallari servis shartnomasi bilan.","Analyzers, centrifuges and consumables with a service contract."),
      year: "2022", scope: L("Комплекс","Majmua","Complex"), region: "Бухара", image: null, status: "published" },
    { id: "case_p5", type: "gov", tag: L("Госучреждение","Davlat muassasasi","Public institution"),
      title: L("Перинатальный центр: неонатология","Perinatal markaz: neonatologiya","Perinatal center: neonatology"),
      desc: L("Инкубаторы, открытые реанимационные системы и фототерапия для новорождённых.","Inkubatorlar, ochiq reanimatsiya tizimlari va fototerapiya.","Incubators, open care systems and phototherapy for newborns."),
      year: "2024", scope: L("70+ единиц","70+ birlik","70+ units"), region: "Андижан", image: null, status: "published" },
    { id: "case_p6", type: "private", tag: L("Частная клиника","Xususiy klinika","Private clinic"),
      title: L("Хирургическое отделение и стерилизация","Jarrohlik bo'limi va sterilizatsiya","Surgical department and sterilization"),
      desc: L("Операционные столы, светильники, электрохирургия и ЦСО.","Operatsiya stollari, chiroqlar, elektroxirurgiya va MSB.","Operating tables, lights, electrosurgery and CSSD."),
      year: "2022", scope: L("«Под ключ»","«Kalit ostida»","Turnkey"), region: "Ташкент", image: null, status: "published" }
  ];

  window.SOI_CORE = {
    DEFAULT_FOUNDED: DEFAULT_FOUNDED,
    foundedYear: foundedYear,
    yearsOnMarket: yearsOnMarket,
    LEGAL: LEGAL,
    REQUISITES: REQUISITES,
    CONTACTS: CONTACTS,
    NEWS_CATEGORIES: NEWS_CATEGORIES,
    NEWS_TAGS: NEWS_TAGS,
    CASE_TYPES: CASE_TYPES,
    CASE_REGIONS: CASE_REGIONS,
    CASES_DEFAULT: CASES_DEFAULT,
    lv: lv,
    // строка реквизитов для футеров (одна на язык)
    footerLine: function (lang) {
      var addr = lv(lang, REQUISITES.addrRu, REQUISITES.addrUz, REQUISITES.addrEn);
      return LEGAL.full[lang === "uz" ? "uz" : lang === "en" ? "en" : "ru"] +
        " • " + addr + " • " + (lang === "en" ? "TIN" : "СТИР") + ": " + REQUISITES.taxId +
        " • " + CONTACTS.phoneReception + " • " + CONTACTS.email;
    }
  };
})();
