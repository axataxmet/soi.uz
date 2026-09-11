/* UzMedEx — 22 клинических направления, 4 группы */
(function () {
  const D = (id, icon, ru, uz, en, group) => ({ id, icon, ru, uz, en, group });

  const DIRECTION_GROUPS = [
    { id:"diag_group",    icon:"pulse",       color:"#1a5fd0",
      ru:"Диагностика и лечение",
      uz:"Diagnostika va davolash",
      en:"Diagnostics & treatment",
      dirs:["diagnostics_medical","functional_diag","lab_diag","radiology","endoscopy"] },
    { id:"clinical_group",icon:"heart",       color:"#15a06a",
      ru:"Клинические направления",
      uz:"Klinik yo\u02bbnalishlar",
      en:"Clinical specialties",
      dirs:["obstetrics","neonatology","pediatrics","ent","ophthalmology","dentistry","proctology","cosmetology"] },
    { id:"surgery_group", icon:"scalpel",     color:"#e0492f",
      ru:"Хирургия и экстренная помощь",
      uz:"Jarrohlik va favqulodda yordam",
      en:"Surgery & emergency care",
      dirs:["surgery_dir","anesthesia_icu","emergency_dir","blood_service"] },
    { id:"rehab_group",   icon:"wave",        color:"#7c5cbf",
      ru:"Восстановление и специализированное оснащение",
      uz:"Reabilitatsiya va maxsus jihozlash",
      en:"Rehabilitation & specialist equipping",
      dirs:["traumatology","immobilization","physio_dir","oxygen","sterilization_dir"] },
  ];

  const DIRECTIONS = [
    /* 1–5  Диагностика и лечение */
    D("diagnostics_medical","pulse",      "Диагностика и медицинские осмотры","Diagnostika va tibbiy ko\u02bbriklar","Diagnostics & check-ups",         "diag_group"),
    D("functional_diag",    "pulse",      "Функциональная диагностика",        "Funksional diagnostika",             "Functional diagnostics",           "diag_group"),
    D("lab_diag",           "package",    "Лабораторная диагностика",          "Laboratoriya diagnostikasi",         "Laboratory diagnostics",           "diag_group"),
    D("radiology",          "package",    "Рентгенология",                     "Rentgenologiya",                     "Radiology",                        "diag_group"),
    D("endoscopy",          "search",     "Эндоскопия",                        "Endoskopiya",                        "Endoscopy",                        "diag_group"),
    /* 6–13 Клинические направления */
    D("obstetrics",         "heart",      "Акушерство и гинекология",          "Akusherlik va ginekologiya",         "Obstetrics & gynaecology",         "clinical_group"),
    D("neonatology",        "pulse",      "Неонатология",                      "Neonatologiya",                      "Neonatology",                      "clinical_group"),
    D("pediatrics",         "pulse",      "Педиатрия",                         "Pediatriya",                         "Paediatrics",                      "clinical_group"),
    D("ent",                "wave",       "Оториноларингология",               "Otorinolaringologiya",               "ENT",                              "clinical_group"),
    D("ophthalmology",      "eye",        "Офтальмология",                     "Oftalmologiya",                      "Ophthalmology",                    "clinical_group"),
    D("dentistry",          "scalpel",    "Стоматология",                      "Stomatologiya",                      "Dentistry",                        "clinical_group"),
    D("proctology",         "shield-cross","Проктология",                      "Proktologiya",                       "Proctology",                       "clinical_group"),
    D("cosmetology",        "star",       "Косметология и дерматология",       "Kosmetologiya va dermatologiya",     "Cosmetology & dermatology",        "clinical_group"),
    /* 14–17 Хирургия и экстренная помощь */
    D("surgery_dir",        "scalpel",    "Хирургия",                          "Jarrohlik",                          "Surgery",                          "surgery_group"),
    D("anesthesia_icu",     "ventilator", "Анестезиология и реанимация",       "Anesteziyologiya va reanimatsiya",   "Anaesthesiology & ICU",            "surgery_group"),
    D("emergency_dir",      "cross-pulse","Скорая и неотложная помощь",        "Tez va favqulodda yordam",           "Emergency & urgent care",          "surgery_group"),
    D("blood_service",      "shield",     "Служба крови",                      "Qon xizmati",                        "Blood service",                    "surgery_group"),
    /* 18–22 Восстановление и специализированное оснащение */
    D("traumatology",       "package",    "Травматология и ортопедия",         "Travmatologiya va ortopediya",       "Traumatology & orthopaedics",      "rehab_group"),
    D("immobilization",     "package",    "Иммобилизация",                     "Immobilizatsiya",                    "Immobilization",                   "rehab_group"),
    D("physio_dir",         "wave",       "Физиотерапия и реабилитация",       "Fizioterapiya va reabilitatsiya",    "Physiotherapy & rehabilitation",   "rehab_group"),
    D("oxygen",             "shield-cross","Кислородотерапия",                 "Kislorod terapiyasi",                "Oxygen therapy",                   "rehab_group"),
    D("sterilization_dir",  "shield-cross","Стерилизация и дезинфекция",       "Sterilizatsiya va dezinfeksiya",     "Sterilization & disinfection",     "rehab_group"),
  ];

  /* ─── Маппинг товаров → направления ───
     Раньше здесь стоял PRODUCT_DIR_MAP, привязанный к id тестовых товаров
     (p001-p049) из старого демо-каталога — эти id не совпадают ни с одним
     из 134 реальных товаров (TRIAL-*), поэтому «Навигация по направлениям»
     на главной всегда показывала счётчики "0 товаров" и вела в пустую
     выдачу. Товаров 134, а товарных групп всего 31 — держать привязку на
     уровне группы (эта таблица) на порядок меньше работы, чем расписывать
     каждый товар по отдельности, и она не «протухает» при добавлении новых
     товаров в уже классифицированную группу. Ключ — id товарной группы
     (Category.subs[].groups[]._id), значение — список направлений. */
  const GROUP_DIR_MAP = {
    cmt36i0bo000qwpynkyv666ul: ["diagnostics_medical","functional_diag"],      // ЭКГ-аппараты
    cmt36i0bt000swpyn5415v49p: ["diagnostics_medical","functional_diag"],      // УЗИ-сканеры
    cmtvymgtp0005wum3vgtrbuf5: ["diagnostics_medical","pediatrics","neonatology"], // Весы и ростомеры медицинские
    cmtvymgu60009wum3h8kxoj3h: ["lab_diag"],                                    // Анализаторы паров и газов
    cmtvymguo000fwum32g210j5k: ["radiology"],                                   // Рентген-аппараты
    cmtw03owm0001zfinh5nk5qiw: ["functional_diag","anesthesia_icu"],            // Системы мониторирования ЭКГ и АД
    cmtw03owt0003zfin7363am2m: ["functional_diag"],                            // Кресла для вестибулярной диагностики
    cmtwmr0to00032modnkvy32yi: ["functional_diag"],                            // Приборы функциональной диагностики
    cmtwmv89y000368mq35scbjmr: ["ent"],                                        // Оборудование для оториноларингологии
    cmtvymgtx0007wum3z7b0406n: ["physio_dir"],                                 // Физиотерапевтические аппараты
    cmtvymgv1000jwum3eba47dye: ["anesthesia_icu","emergency_dir"],             // Кардиостимуляторы
    cmtvymgvc000nwum31w8ic0q8: ["sterilization_dir"],                          // Стерилизаторы и озонаторы
    cmtvymgvh000pwum3xxqse5ci: ["emergency_dir","anesthesia_icu"],             // Дефибрилляторы
    cmtwmr0tr00052modtckvj0pv: ["surgery_dir"],                                // Светильники медицинские
    cmtwnjaxf00011433gqxkp1vw: ["physio_dir","sterilization_dir"],             // Насадки и камеры для озонотерапии
    cmtvymguc000bwum362rorhgk: ["lab_diag","neonatology"],                     // Термостаты и инкубаторы
    cmtwmr0tg00012modbz3akyky: ["sterilization_dir"],                          // Шкафы сушильные
    cmtvymgti0003wum3onc6sglv: ["obstetrics"],                                 // Кресла гинекологические
    cmtw03owy0005zfineputcog4: ["neonatology"],                                // Оборудование для новорождённых
    cmtw03ox30007zfingh0aljf8: ["traumatology","immobilization"],              // Подъёмники и устройства для перемещения пациентов
    cmtwmav7m000184z5mkwwp3rs: ["traumatology","anesthesia_icu"],              // Кровати медицинские
    cmtwmav7u000384z5mo0rzrvh: ["diagnostics_medical"],                        // Кушетки и банкетки медицинские
    cmtvymgut000hwum3fepycfsl: ["surgery_dir","obstetrics"],                   // Операционные столы
    cmtvymgv6000lwum3d7znbv1u: ["surgery_dir"],                                // Ножи и скальпели
    cmtw0t3ww0001pqeyooenzzi5: ["surgery_dir"],                                // Инструменты общего назначения
    cmtwm27160001e9pb5qh5dnri: ["surgery_dir","blood_service"],                // Иглы медицинские
    cmtwm271j0003e9pbmhpo10ss: ["surgery_dir"],                                // Наборы инструментов
    cmtvymgui000dwum3squpxmr4: ["diagnostics_medical"],                        // Стетоскопы
    cmtw0t3x80003pqey4i094ad6: ["physio_dir"],                                 // Озонированные масла
  };

  function getDirById(id)          { return DIRECTIONS.find(d => d.id === id) || null; }
  function getGroupById(id)        { return DIRECTION_GROUPS.find(g => g.id === id) || null; }
  function getDirsForGroup(gid)    { return DIRECTIONS.filter(d => d.group === gid); }
  function isProductInDir(p, did)  { return (GROUP_DIR_MAP[p && p.group] || []).includes(did); }
  function getProductsForDir(did, products) {
    return (products || []).filter(p => isProductInDir(p, did));
  }

  window.DIRECTIONS_DATA = {
    DIRECTION_GROUPS, DIRECTIONS, GROUP_DIR_MAP,
    getDirById, getGroupById, getDirsForGroup, getProductsForDir, isProductInDir,
  };
})();
