/* ИНДУСТРИЯ ЗДОРОВЬЯ — content (RU / UZ / EN) + data */
window.SI = (function () {

  const T = {
    ru: {
      code: "RU",
      // nav
      brand_name: "ИНДУСТРИЯ ЗДОРОВЬЯ",
      brand_tag: "ИНДУСТРИЯ ЗДОРОВЬЯ",
      nav_home: "Главная", nav_about: "О компании", nav_projects: "Кейсы",
      nav_directions: "Направления", nav_registration: "Регистрация МИ", nav_tenders: "Тендеры",
      nav_documents: "Документы", nav_news: "Новости", nav_reviews: "Отзывы",
      nav_partners: "Партнёры", nav_licenses: "Документы компании", nav_services: "Услуги", nav_contacts: "Контакты",
      to_shop: "Электронный каталог", to_consult: "Получить консультацию",
      // utility
      u_phone: "+998 (77) 225-00-01", u_mail: "info@sogliqindustriyasi.uz",
      u_hours: "Пн–Пт, 8:00–17:00",
      // hero
      hero_eyebrow: "Компания создана на базе опыта команды, работающей в сфере медицинского оснащения с 2019 года.",
      hero_h1a: "Поставки медицинского оборудования и ", hero_h1b: "регистрация медицинских изделий", hero_h1c: " в Узбекистане",
      hero_lead: "ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» поставляет медицинскую технику, оборудование, мебель, инструменты и расходные материалы, а также сопровождает регистрацию медицинских изделий и получение регистрационных удостоверений.",
      hero_cta1: "Получить консультацию", hero_cta2: "Перейти в каталог",
      hero_b1: "Поставка оборудования", hero_b2: "Оснащение клиник «под ключ»", hero_b3: "Регистрация МИ", hero_b4: "Тендеры и госзакупки",
      st_years: "лет на рынке", st_proj: "реализованных проектов",
      st_brands: "брендов-производителей", st_inst: "учреждений-партнёров",
      // services preview
      svc_title: "Что мы делаем", svc_sub: "Полный цикл — от поставки до сервиса и регистрации медицинских изделий.",
      svc1_t: "Поставка оборудования", svc1_d: "Официальные каналы поставок, гарантия производителя, прямые контракты с заводами.",
      svc2_t: "Оснащение «под ключ»", svc2_d: "Проектирование, монтаж и пусконаладка отделений и клиник целиком.",
      svc3_t: "Сервис и гарантия", svc3_d: "Гарантийное и постгарантийное обслуживание, запчасти, выездные бригады.",
      svc4_t: "Регистрация (РУ)", svc4_d: "Получение регистрационных удостоверений на медизделия в Республике Узбекистан.",
      svc5_t: "Обучение персонала", svc5_d: "Ввод в эксплуатацию, обучение работе с оборудованием, методическая поддержка.",
      svc6_t: "Участие в тендерах", svc6_d: "Подготовка документации и поставки для государственных закупок.",
      learn_more: "Подробнее",
      // brands
      br_title: "Бренды и заводы-производители", br_sub: "Официальные поставки и гарантия производителя.",
      // projects preview
      pr_title: "Реализованные проекты", pr_sub: "Оснащение государственных и частных учреждений по всему Узбекистану.",
      pr_all: "Все проекты",
      pr_year: "Год", pr_scope: "Объём", pr_loc: "Регион",
      // why us
      why_title: "Почему выбирают нас", why_sub: "Надёжный партнёр для государственного и частного здравоохранения.",
      why1_t: "Официальный статус", why1_d: "Лицензии, сертификаты, прямые контракты с производителями.",
      why2_t: "Опыт 12+ лет", why2_d: "Сотни реализованных проектов оснащения по всей стране.",
      why3_t: "Полный цикл", why3_d: "Поставка, монтаж, обучение и сервис из одних рук.",
      why4_t: "Сервис по всей стране", why4_d: "Региональная сеть обслуживания и запас комплектующих.",
      // xband
      xb_title: "Нужно купить оборудование?", xb_sub: "Перейдите в электронный каталог — цены, наличие, оформление коммерческих предложений онлайн.",
      xb_btn: "Открыть каталог →",
      // footer
      f_about: "ИНДУСТРИЯ ЗДОРОВЬЯ — официальный поставщик и интегратор медицинского оборудования в Республике Узбекистан.",
      f_company: "Компания", f_docs: "Документы", f_contacts: "Контакты",
      f_office: "Офис", f_legal: "ООО «ИНДУСТРИЯ ЗДОРОВЬЯ» (SOG’LIQ INDUSTRIYASI MCHJ) · ИНН 312513138",
      f_rights: "© 2026 ИНДУСТРИЯ ЗДОРОВЬЯ. Все права защищены.",
      // contacts
      c_form_t: "Написать нам", c_name: "Ваше имя", c_phone: "Телефон", c_msg: "Сообщение",
      c_send: "Отправить заявку", c_office: "Офис", c_wh: "Склад", c_phones: "Телефоны", c_mail: "E-mail",
      c_office_addr: "100069, Ташкент, Узбекистан, ул. МКАД, д. 16", c_office_h: "Пн–Пт, 8:00–17:00 (без перерывов)",
      c_wh_h: "Выписка: Пн–Пт, 8:00–16:30 · Отгрузка: до 17:00",
    },
    uz: {
      code: "UZ",
      brand_name: "SOG’LIQ INDUSTRIYASI", brand_tag: "SOG’LIQ INDUSTRIYASI",
      nav_home: "Bosh sahifa", nav_about: "Kompaniya", nav_projects: "Keyslar",
      nav_directions: "Yo'nalishlar", nav_registration: "Ro‘yxatga olish", nav_tenders: "Tenderlar",
      nav_documents: "Hujjatlar", nav_news: "Yangiliklar", nav_reviews: "Sharhlar",
      nav_partners: "Hamkorlar", nav_licenses: "Hujjatlar", nav_services: "Xizmatlar", nav_contacts: "Kontaktlar",
      to_shop: "Elektron katalog", to_consult: "Maslahat olish",
      u_phone: "+998 (77) 225-00-01", u_mail: "info@sogliqindustriyasi.uz", u_hours: "Du–Ju, 8:00–17:00",
      hero_eyebrow: "SOG’LIQ INDUSTRIYASI · 2021 YILDAN",
      hero_h1a: "Tibbiy uskunalar yetkazib berish va ", hero_h1b: "tibbiy buyumlarni ro'yxatga olish", hero_h1c: " O'zbekistonda",
      hero_lead: "«SOG’LIQ INDUSTRIYASI» MCHJ tibbiy texnika, uskunalar, mebel, asboblar va sarf materiallarini yetkazib beradi, shuningdek tibbiy buyumlarni ro'yxatga olish va ro'yxat guvohnomasini olishni qo'llab-quvvatlaydi.",
      hero_cta1: "Maslahat olish", hero_cta2: "Elektron katalogga o'tish",
      hero_b1: "Uskuna yetkazish", hero_b2: "«Kalit ostida» jihozlash", hero_b3: "TI ro'yxati", hero_b4: "Tender va davlat xaridlari",
      st_years: "yil bozorda", st_proj: "amalga oshirilgan loyiha",
      st_brands: "ishlab chiqaruvchi brend", st_inst: "hamkor muassasa",
      svc_title: "Biz nima qilamiz", svc_sub: "To'liq tsikl — yetkazib berishdan servis va ro'yxatdan o'tkazishgacha.",
      svc1_t: "Uskunalar yetkazish", svc1_d: "Rasmiy kanallar, ishlab chiqaruvchi kafolati, to'g'ridan-to'g'ri shartnomalar.",
      svc2_t: "«Kalit ostida» jihozlash", svc2_d: "Bo'lim va klinikalarni loyihalash, montaj va ishga tushirish.",
      svc3_t: "Servis va kafolat", svc3_d: "Kafolat va kafolatdan keyingi xizmat, ehtiyot qismlar, sayyor brigadalar.",
      svc4_t: "Ro'yxatdan o'tkazish (RU)", svc4_d: "O'zbekiston Respublikasida tibbiy buyumlarga ro'yxat guvohnomasini olish.",
      svc5_t: "Xodimlarni o'qitish", svc5_d: "Ishga tushirish, uskunalar bilan ishlashni o'rgatish, uslubiy yordam.",
      svc6_t: "Tenderlarda ishtirok", svc6_d: "Davlat xaridlari uchun hujjatlar va yetkazib berishni tayyorlash.",
      learn_more: "Batafsil",
      br_title: "Brendlar va ishlab chiqaruvchi zavodlar", br_sub: "Rasmiy yetkazib berish va ishlab chiqaruvchi kafolati.",
      pr_title: "Amalga oshirilgan loyihalar", pr_sub: "O'zbekiston bo'ylab davlat va xususiy muassasalarni jihozlash.",
      pr_all: "Barcha loyihalar", pr_year: "Yil", pr_scope: "Hajm", pr_loc: "Hudud",
      why_title: "Nega bizni tanlashadi", why_sub: "Davlat va xususiy sog'liqni saqlash uchun ishonchli hamkor.",
      why1_t: "Rasmiy maqom", why1_d: "Litsenziyalar, sertifikatlar, ishlab chiqaruvchilar bilan to'g'ridan-to'g'ri shartnomalar.",
      why2_t: "12+ yillik tajriba", why2_d: "Mamlakat bo'ylab yuzlab jihozlash loyihalari.",
      why3_t: "To'liq tsikl", why3_d: "Yetkazib berish, montaj, o'qitish va servis bir qo'ldan.",
      why4_t: "Butun mamlakat bo'ylab servis", why4_d: "Mintaqaviy xizmat tarmog'i va ehtiyot qismlar zaxirasi.",
      xb_title: "Uskuna sotib olmoqchimisiz?", xb_sub: "Elektron katalogga o'ting — narxlar, mavjudlik, onlayn tijorat takliflari.",
      xb_btn: "Elektron katalogni ochish →",
      f_about: "SOG’LIQ INDUSTRIYASI — O'zbekiston Respublikasida tibbiy uskunalarni rasmiy yetkazib beruvchi va integrator.",
      f_company: "Kompaniya", f_docs: "Hujjatlar", f_contacts: "Kontaktlar",
      f_office: "Ofis", f_legal: "«SOG’LIQ INDUSTRIYASI» MChJ · STIR 312513138",
      f_rights: "© 2026 SOG’LIQ INDUSTRIYASI. Barcha huquqlar himoyalangan.",
      c_form_t: "Bizga yozing", c_name: "Ismingiz", c_phone: "Telefon", c_msg: "Xabar",
      c_send: "Ariza yuborish", c_office: "Ofis", c_wh: "Ombor", c_phones: "Telefonlar", c_mail: "E-mail",
      c_office_addr: "100069, Toshkent, O'zbekiston, MKAD ko'ch., 16-uy", c_office_h: "Du–Ju, 8:00–17:00 (tanaffussiz)",
      c_wh_h: "Hujjat: Du–Ju, 8:00–16:30 · Jo'natish: 17:00 gacha",
    },
    en: {
      code: "EN",
      brand_name: "HEALTH INDUSTRY", brand_tag: "HEALTH INDUSTRY",
      nav_home: "Home", nav_about: "About", nav_projects: "Cases",
      nav_directions: "Directions", nav_registration: "MD Registration", nav_tenders: "Tenders",
      nav_documents: "Documents", nav_news: "News", nav_reviews: "Reviews",
      nav_partners: "Partners", nav_licenses: "Company documents", nav_services: "Services", nav_contacts: "Contacts",
      to_shop: "online catalog", to_consult: "Get a consultation",
      u_phone: "+998 (77) 225-00-01", u_mail: "info@sogliqindustriyasi.uz", u_hours: "Mon–Fri, 8:00–17:00",
      hero_eyebrow: "HEALTH INDUSTRY · since 2021",
      hero_h1a: "Medical equipment supply and ", hero_h1b: "medical device registration", hero_h1c: " in Uzbekistan",
      hero_lead: "LLC «HEALTH INDUSTRY» supplies medical machinery, equipment, furniture, instruments and consumables, and provides support for medical device registration and obtaining registration certificates.",
      hero_cta1: "Get a consultation", hero_cta2: "Go to online catalog",
      hero_b1: "Equipment supply", hero_b2: "Turnkey clinic equipping", hero_b3: "MD registration", hero_b4: "Tenders & procurement",
      st_years: "years on the market", st_proj: "completed projects",
      st_brands: "manufacturer brands", st_inst: "partner institutions",
      svc_title: "What we do", svc_sub: "Full cycle — from supply to service and medical device registration.",
      svc1_t: "Equipment supply", svc1_d: "Official supply channels, manufacturer warranty, direct factory contracts.",
      svc2_t: "Turnkey equipping", svc2_d: "Design, installation and commissioning of entire departments and clinics.",
      svc3_t: "Service & warranty", svc3_d: "Warranty and post-warranty service, spare parts, field teams.",
      svc4_t: "Registration (RU)", svc4_d: "Obtaining registration certificates for medical devices in Uzbekistan.",
      svc5_t: "Staff training", svc5_d: "Commissioning, operator training, methodological support.",
      svc6_t: "Tender participation", svc6_d: "Documentation and supply for government procurement.",
      learn_more: "Learn more",
      br_title: "Brands & manufacturers", br_sub: "Official supplies and manufacturer's warranty.",
      pr_title: "Completed projects", pr_sub: "Equipping public and private institutions across Uzbekistan.",
      pr_all: "All projects", pr_year: "Year", pr_scope: "Scope", pr_loc: "Region",
      why_title: "Why choose us", why_sub: "A reliable partner for public and private healthcare.",
      why1_t: "Official status", why1_d: "Licenses, certificates, direct contracts with manufacturers.",
      why2_t: "12+ years of experience", why2_d: "Hundreds of equipping projects nationwide.",
      why3_t: "Full cycle", why3_d: "Supply, installation, training and service from one source.",
      why4_t: "Nationwide service", why4_d: "Regional service network and spare parts stock.",
      xb_title: "Need to buy equipment?", xb_sub: "Visit the e-catalog — prices, availability, online quote requests.",
      xb_btn: "Open online catalog →",
      f_about: "HEALTH INDUSTRY is the official supplier and integrator of medical equipment in the Republic of Uzbekistan.",
      f_company: "Company", f_docs: "Documents", f_contacts: "Contacts",
      f_office: "Office", f_legal: "LLC «HEALTH INDUSTRY» (SOG’LIQ INDUSTRIYASI MCHJ) · TIN 312513138",
      f_rights: "© 2026 HEALTH INDUSTRY. All rights reserved.",
      c_form_t: "Write to us", c_name: "Your name", c_phone: "Phone", c_msg: "Message",
      c_send: "Send request", c_office: "Office", c_wh: "Warehouse", c_phones: "Phones", c_mail: "E-mail",
      c_office_addr: "100069, Tashkent, Uzbekistan, MKAD st., 16", c_office_h: "Mon–Fri, 8:00–17:00 (no breaks)",
      c_wh_h: "Documents: Mon–Fri, 8:00–16:30 · Shipment: until 17:00",
    },
  };

  // tri-lang helper for data
  const L = (ru, uz, en) => ({ ru, uz, en });

  const FOUNDED_YEAR = parseInt(localStorage.getItem("soi_founded_year") || "2021", 10);
  const yearsOnMarket = new Date().getFullYear() - FOUNDED_YEAR;
  const STATS = [
    { n: yearsOnMarket + "+", k: "st_years" },
    { n: "40+", k: "st_proj" },
    { n: "20+", k: "st_brands" },
    { n: "350+", k: "st_inst" },
  ];

  const SERVICES = [
    { ic: "truck", t: "svc1_t", d: "svc1_d" },
    { ic: "building", t: "svc2_t", d: "svc2_d" },
    { ic: "shield", t: "svc3_t", d: "svc3_d" },
    { ic: "check", t: "svc4_t", d: "svc4_d" },
    { ic: "users", t: "svc5_t", d: "svc5_d" },
    { ic: "doc", t: "svc6_t", d: "svc6_d" },
  ];

  const BRANDS = [
    { name: "Mindray", country: { ru: "Китай", uz: "Xitoy", en: "China" }, flag: "🇨🇳", cat: { ru: "Мониторы, УЗИ, ИВЛ", uz: "Monitorlar, UZI, IVL", en: "Monitors, ultrasound, ventilators" } },
    { name: "ТВЕС", country: { ru: "Россия", uz: "Rossiya", en: "Russia" }, flag: "🇷🇺", cat: { ru: "Весы, ростомеры", uz: "Tarozilar, bo'y o'lchagich", en: "Scales, stadiometers" } },
    { name: "АТЕС МЕДИКА", country: { ru: "Россия", uz: "Rossiya", en: "Russia" }, flag: "🇷🇺", cat: { ru: "Электрокардиографы", uz: "Elektrokardiograflar", en: "Electrocardiographs" } },
    { name: "GE Healthcare", country: { ru: "США", uz: "AQSh", en: "USA" }, flag: "🇺🇸", cat: { ru: "Диагностика, визуализация", uz: "Diagnostika, vizualizatsiya", en: "Diagnostics, imaging" } },
    { name: "Dräger", country: { ru: "Германия", uz: "Germaniya", en: "Germany" }, flag: "🇩🇪", cat: { ru: "Анестезия, реанимация", uz: "Anesteziya, reanimatsiya", en: "Anesthesia, ICU" } },
    { name: "Fazzini", country: { ru: "Италия", uz: "Italiya", en: "Italy" }, flag: "🇮🇹", cat: { ru: "Мед. инструменты", uz: "Tibbiy asboblar", en: "Medical instruments" } },
    { name: "BMT", country: { ru: "Чехия", uz: "Chexiya", en: "Czechia" }, flag: "🇨🇿", cat: { ru: "Стерилизация", uz: "Sterilizatsiya", en: "Sterilization" } },
    { name: "Comen", country: { ru: "Китай", uz: "Xitoy", en: "China" }, flag: "🇨🇳", cat: { ru: "Мониторы, ИВЛ", uz: "Monitorlar, IVL", en: "Monitors, ventilators" } },
    { name: "Schiller", country: { ru: "Швейцария", uz: "Shveytsariya", en: "Switzerland" }, flag: "🇨🇭", cat: { ru: "Кардиология", uz: "Kardiologiya", en: "Cardiology" } },
    { name: "Riester", country: { ru: "Германия", uz: "Germaniya", en: "Germany" }, flag: "🇩🇪", cat: { ru: "Диагностические приборы", uz: "Diagnostika asboblari", en: "Diagnostic devices" } },
  ];

  const VALUES = [
    { n: "01", t: L("Надёжность","Ishonchlilik","Reliability"), d: L("Только официальные поставки и сертифицированное оборудование.","Faqat rasmiy yetkazib berish va sertifikatlangan uskunalar.","Only official supply and certified equipment.") },
    { n: "02", t: L("Экспертиза","Ekspertiza","Expertise"), d: L("Команда инженеров с опытом оснащения учреждений любого профиля.","Har qanday muassasani jihozlash tajribasiga ega muhandislar jamoasi.","A team of engineers experienced in equipping facilities of any profile.") },
    { n: "03", t: L("Ответственность","Mas'uliyat","Responsibility"), d: L("Сопровождаем оборудование весь жизненный цикл — от поставки до сервиса.","Uskunani butun hayot tsikli davomida qo'llab-quvvatlaymiz.","We support equipment throughout its lifecycle — from supply to service.") },
  ];

  return { T, STATS, SERVICES, BRANDS, VALUES };
})();
