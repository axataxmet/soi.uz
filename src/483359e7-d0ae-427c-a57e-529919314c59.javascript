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

  /* ─── Маппинг товаров → направления ─── */
  const PRODUCT_DIR_MAP = {
    p001:["diagnostics_medical","functional_diag","obstetrics","pediatrics","neonatology"],
    p002:["diagnostics_medical","functional_diag","obstetrics","pediatrics"],
    p003:["diagnostics_medical","functional_diag","anesthesia_icu"],
    p004:["diagnostics_medical","functional_diag"],
    p005:["anesthesia_icu","surgery_dir","emergency_dir","neonatology","pediatrics"],
    p006:["diagnostics_medical","pediatrics","neonatology"],
    p007:["diagnostics_medical","pediatrics","neonatology","emergency_dir"],
    p008:["anesthesia_icu","surgery_dir","emergency_dir"],
    p009:["anesthesia_icu","surgery_dir"],
    p010:["surgery_dir","dentistry"],
    p011:["surgery_dir","obstetrics","traumatology"],
    p012:["surgery_dir","obstetrics","dentistry"],
    p013:["surgery_dir","dentistry","anesthesia_icu","sterilization_dir"],
    p014:["surgery_dir","dentistry","sterilization_dir"],
    p015:["surgery_dir","dentistry","sterilization_dir"],
    p016:["diagnostics_medical","surgery_dir","sterilization_dir"],
    p017:["diagnostics_medical","surgery_dir","sterilization_dir"],
    p018:["surgery_dir","dentistry","sterilization_dir"],
    p019:["physio_dir","traumatology"],
    p020:["physio_dir","traumatology"],
    p021:["physio_dir","ent"],
    p022:["pediatrics","physio_dir","ent","neonatology"],
    p023:["physio_dir","traumatology"],
    p024:["emergency_dir","anesthesia_icu","surgery_dir"],
    p025:["emergency_dir","anesthesia_icu"],
    p026:["emergency_dir","traumatology"],
    p027:["emergency_dir","anesthesia_icu"],
    p028:["emergency_dir"],
    p029:["anesthesia_icu","traumatology","pediatrics","neonatology"],
    p030:["diagnostics_medical","surgery_dir","obstetrics"],
    p031:["diagnostics_medical","surgery_dir","dentistry"],
    p032:["surgery_dir","anesthesia_icu"],
    p033:["obstetrics","diagnostics_medical","dentistry"],
    p034:["radiology","traumatology"],
    p035:["anesthesia_icu","surgery_dir"],
    p036:["lab_diag"],
    p037:["physio_dir"],
    p038:["anesthesia_icu","surgery_dir","neonatology","pediatrics"],
    p039:["surgery_dir","obstetrics"],
    p040:["dentistry"],
    p041:["diagnostics_medical","pediatrics","neonatology"],
    p042:["ophthalmology"],
    p043:["anesthesia_icu","ent","emergency_dir"],
    p044:["surgery_dir","dentistry","diagnostics_medical","anesthesia_icu","sterilization_dir"],
    p045:["anesthesia_icu","surgery_dir","emergency_dir","pediatrics"],
    p046:["surgery_dir","anesthesia_icu","emergency_dir","sterilization_dir"],
    p047:["anesthesia_icu","surgery_dir"],
    p048:["surgery_dir","traumatology","emergency_dir"],
    p049:["surgery_dir","traumatology","emergency_dir"],
  };

  function getDirById(id)          { return DIRECTIONS.find(d => d.id === id) || null; }
  function getGroupById(id)        { return DIRECTION_GROUPS.find(g => g.id === id) || null; }
  function getDirsForGroup(gid)    { return DIRECTIONS.filter(d => d.group === gid); }
  function getProductsForDir(did, products) {
    return (products || []).filter(p => (PRODUCT_DIR_MAP[p.id] || []).includes(did));
  }

  window.DIRECTIONS_DATA = {
    DIRECTION_GROUPS, DIRECTIONS, PRODUCT_DIR_MAP,
    getDirById, getGroupById, getDirsForGroup, getProductsForDir,
  };
})();
