/* ИНДУСТРИЯ ЗДОРОВЬЯ — catalog data (RU / UZ / EN) */
(function () {
  const C = (id, icon, ru, uz, en, subs) => ({ id, icon, ru, uz, en, subs });
  const S = (ru, uz, en) => ({ ru, uz, en });

  const CATEGORIES = [
    C("diagnostics", "pulse", "Диагностика", "Diagnostika", "Diagnostics", [
      S("УЗИ-аппараты", "UZI apparatlari", "Ultrasound machines"),
      S("Электрокардиографы", "Elektrokardiograflar", "Electrocardiographs"),
      S("Мониторы пациента", "Bemor monitorlari", "Patient monitors"),
      S("Тонометры", "Tonometrlar", "Blood pressure monitors"),
      S("Пульсоксиметры", "Pulsoksimetrlar", "Pulse oximeters"),
    ]),
    C("surgery", "scalpel", "Хирургия и анестезиология", "Jarrohlik va anesteziologiya", "Surgery & anesthesiology", [
      S("Аппараты ИВЛ", "SLV apparatlari", "Ventilators"),
      S("Наркозные аппараты", "Narkoz apparatlari", "Anesthesia machines"),
      S("Электрохирургия", "Elektroxirurgiya", "Electrosurgery"),
      S("Операционные столы", "Operatsiya stollari", "Operating tables"),
      S("Хирургические светильники", "Jarrohlik chiroqlari", "Surgical lights"),
    ]),
    C("sterilization", "shield-cross", "Стерилизация и дезинфекция", "Sterilizatsiya va dezinfeksiya", "Sterilization & disinfection", [
      S("Автоклавы (паровые)", "Avtoklavlar", "Autoclaves (steam)"),
      S("Сухожаровые шкафы", "Quruq issiqlik shkaflari", "Dry-heat sterilizers"),
      S("Бактерицидные облучатели", "Bakteritsid nurlatgichlar", "Germicidal lamps"),
      S("Рециркуляторы воздуха", "Havo retsirkulyatorlari", "Air recirculators"),
      S("Ультразвуковые мойки", "Ultratovushli yuvgichlar", "Ultrasonic cleaners"),
    ]),
    C("physio", "wave", "Физиотерапия и реабилитация", "Fizioterapiya va reabilitatsiya", "Physiotherapy & rehabilitation", [
      S("Магнитотерапия", "Magnitoterapiya", "Magnetotherapy"),
      S("Электротерапия", "Elektroterapiya", "Electrotherapy"),
      S("УВЧ-терапия", "UYuCh terapiya", "UHF therapy"),
      S("Ингаляторы (небулайзеры)", "Ingalyatorlar", "Nebulizers"),
      S("Массажные столы", "Massaj stollari", "Massage tables"),
    ]),
    C("emergency", "cross-pulse", "Скорая помощь", "Tez yordam", "Emergency care", [
      S("Дефибрилляторы", "Defibrillyatorlar", "Defibrillators"),
      S("Реанимационные наборы", "Reanimatsiya toʻplamlari", "Resuscitation kits"),
      S("Носилки и щиты", "Zambillar va qalqonlar", "Stretchers & boards"),
      S("Транспортные ИВЛ", "Transport SLV", "Transport ventilators"),
      S("Медицинские укладки", "Tibbiy joriylar", "Medical kits"),
    ]),
    C("furniture", "bed", "Медицинская мебель", "Tibbiy mebel", "Medical furniture", [
      S("Функциональные кровати", "Funksional krovatlar", "Functional beds"),
      S("Смотровые кушетки", "Koʻrik divanlari", "Examination couches"),
      S("Медицинские шкафы", "Tibbiy shkaflar", "Medical cabinets"),
      S("Манипуляционные столики", "Manipulyatsiya stollari", "Procedure trolleys"),
      S("Медицинские кресла", "Tibbiy kreslolar", "Medical chairs"),
    ]),
    C("equipment", "package", "Оборудование", "Jihozlar", "Equipment", [
      S("Диагностическое", "Diagnostik", "Diagnostic"),
      S("Хирургическое", "Jarrohlik", "Surgical"),
      S("Реанимационное", "Reanimatsion", "Resuscitation"),
      S("Физиотерапевтическое", "Fizioterapevtik", "Physiotherapy"),
      S("Лабораторное", "Laboratoriya", "Laboratory"),
    ]),
    C("instruments", "scalpel", "Инструменты", "Asboblar", "Instruments", [
      S("Хирургические наборы", "Jarrohlik toʻlplamlari", "Surgical sets"),
      S("Стоматологические", "Stomatologik", "Dental instruments"),
      S("Диагностические", "Diagnostik asboblar", "Diagnostic instruments"),
      S("Инъекционные", "Inyeksiya asboblari", "Injection"),
      S("Офтальмологические", "Oftalmologik", "Ophthalmic"),
    ]),
    C("consumables", "shield-cross", "Расходники", "Sarf materiallar", "Consumables", [
      S("Перчатки медицинские", "Tibbiy qoʻlqoplar", "Medical gloves"),
      S("Шприцы и иглы", "Shpritslar va ignalar", "Syringes & needles"),
      S("Маски и респираторы", "Niqoblar va respiratorlar", "Masks & respirators"),
      S("Катетеры", "Kateterlar", "Catheters"),
      S("Перевязочные материалы", "Bogʻlash materiallari", "Dressings & bandages"),
    ]),
  ];

  const BRANDS = [
    { id: "mindray", name: "Mindray", country_ru: "Китай", country_uz: "Xitoy", country_en: "China", flag: "🇨🇳", cat: { ru: "Мониторы, УЗИ, ИВЛ", uz: "Monitorlar, UZI, IVL", en: "Monitors, ultrasound, ventilators" } },
    { id: "drager", name: "Dräger", country_ru: "Германия", country_uz: "Germaniya", country_en: "Germany", flag: "🇩🇪", cat: { ru: "Анестезия, реанимация", uz: "Anesteziya, reanimatsiya", en: "Anesthesia, ICU" } },
    { id: "edan", name: "Edan", country_ru: "Китай", country_uz: "Xitoy", country_en: "China", flag: "🇨🇳", cat: { ru: "ЭКГ, фетальные мониторы", uz: "EKG, fetal monitorlar", en: "ECG, fetal monitors" } },
    { id: "bpl", name: "BPL", country_ru: "Индия", country_uz: "Hindiston", country_en: "India", flag: "🇮🇳", cat: { ru: "Кардиология, мониторинг", uz: "Kardiologiya, monitoring", en: "Cardiology, monitoring" } },
    { id: "comen", name: "Comen", country_ru: "Китай", country_uz: "Xitoy", country_en: "China", flag: "🇨🇳", cat: { ru: "Мониторы, ИВЛ", uz: "Monitorlar, IVL", en: "Monitors, ventilators" } },
    { id: "tuttnauer", name: "Tuttnauer", country_ru: "Израиль", country_uz: "Isroil", country_en: "Israel", flag: "🇮🇱", cat: { ru: "Стерилизация", uz: "Sterilizatsiya", en: "Sterilization" } },
    { id: "armed", name: "Armed", country_ru: "Россия", country_uz: "Rossiya", country_en: "Russia", flag: "🇷🇺", cat: { ru: "Оборудование, мебель", uz: "Uskunalar, mebel", en: "Equipment, furniture" } },
    { id: "bmt", name: "BMT", country_ru: "Чехия", country_uz: "Chexiya", country_en: "Czech Republic", flag: "🇨🇿", cat: { ru: "Стерилизация", uz: "Sterilizatsiya", en: "Sterilization" } },
    { id: "midmark", name: "Midmark", country_ru: "США", country_uz: "AQSh", country_en: "USA", flag: "🇺🇸", cat: { ru: "Смотровое оборудование", uz: "Ko'rik uskunalari", en: "Examination equipment" } },
    { id: "choice", name: "ChoiceMMed", country_ru: "Китай", country_uz: "Xitoy", country_en: "China", flag: "🇨🇳", cat: { ru: "Пульсоксиметры", uz: "Pulsoksimetrlar", en: "Pulse oximeters" } },
    { id: "braun", name: "B. Braun", country_ru: "Германия", country_uz: "Germaniya", country_en: "Germany", flag: "🇩🇪", cat: { ru: "Хирургия, расходники", uz: "Jarrohlik, sarf mat.", en: "Surgery, consumables" } },
    { id: "3m", name: "3M", country_ru: "США", country_uz: "AQSh", country_en: "USA", flag: "🇺🇸", cat: { ru: "Расходники, СИЗ", uz: "Sarf mat., SHV", en: "Consumables, PPE" } },
    { id: "hartmann", name: "Hartmann", country_ru: "Германия", country_uz: "Germaniya", country_en: "Germany", flag: "🇩🇪", cat: { ru: "Перевязка, расходники", uz: "Bog'lash, sarf mat.", en: "Dressings, consumables" } },
    { id: "kimberley", name: "Kimberly-Clark", country_ru: "США", country_uz: "AQSh", country_en: "USA", flag: "🇺🇸", cat: { ru: "Расходные материалы", uz: "Sarf materiallari", en: "Consumables" } },
    { id: "tves", name: "ТВЕС", country_ru: "Россия", country_uz: "Rossiya", country_en: "Russia", flag: "🇷🇺", cat: { ru: "Весы, ростомеры", uz: "Tarozilar, bo'y o'lchagich", en: "Scales, stadiometers" } },
    { id: "ates", name: "АТЕС МЕДИКА", country_ru: "Россия", country_uz: "Rossiya", country_en: "Russia", flag: "🇷🇺", cat: { ru: "Электрокардиографы", uz: "Elektrokardiograflar", en: "Electrocardiographs" } },
  ];

  let _id = 0;
  const P = (o) => {
    _id += 1;
    return Object.assign(
      {
        id: "p" + String(_id).padStart(3, "0"),
        sku: String(4000 + _id * 7),
        badge: null,
        old: null,
        pop: Math.round(50 + Math.random() * 50),
        isNew: false,
        extraCats: [],
        related: [],
        accessories: [],
        consumables: [],
        variants: [],
      },
      o
    );
  };
  const sp = (kr, ku, v, ke, ve) => ({ kr, ku, v, ke, ve });

  const PRODUCTS = [];

  window.DATA = { CATEGORIES, BRANDS, PRODUCTS };
})();
