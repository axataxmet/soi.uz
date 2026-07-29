/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Homepage content editor */
function AdminHomepage() {
  const { useState } = React;
  const toast = useToast();
  const [tab, setTab] = useState("hero");
  const [lang, setLang] = useState("ru");
  const LANG_LABEL = { ru: "Рус", uz: "Узб", en: "Eng" };

  const [hero, setHero] = useSettings("homepage_hero", {
    badge: { ru: "Технологический партнёр здравоохранения", uz: "Sog'liqni saqlash texnologik hamkori", en: "Technology partner for healthcare" },
    title1: { ru: "Экосистема оснащения", uz: "Zamonaviy tibbiyotni", en: "An ecosystem for" },
    title2: { ru: "современной медицины", uz: "jihozlash ekotizimi", en: "equipping modern medicine" },
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
  });

  const [impact, setImpact] = useSettings("homepage_impact", {
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
  });

  const [cta, setCta] = useSettings("homepage_cta", {
    title: { ru: "Готовы оснастить вашу клинику?", uz: "Klinikangizni jihozlashga tayyormisiz?", en: "Ready to equip your clinic?" },
    subtitle: {
      ru: "Расскажите о задаче — подберём оборудование, подготовим КП и сопроводим до запуска.",
      uz: "Vazifani ayting — uskunani tanlaymiz, taklif tayyorlaymiz va ishga tushirishgacha hamroh bo'lamiz.",
      en: "Tell us your task — we'll select equipment, prepare a quote and support you to launch.",
    },
    btn1: { ru: "Получить консультацию", uz: "Maslahat olish", en: "Get a consultation" },
    btn2: { ru: "Перейти в каталог", uz: "Katalogga o'tish", en: "Browse catalog" },
  });

  // Bento «Экосистема». Tender counters on that block come live from the API and
  // are deliberately absent here — only the figures nobody can measure for us.
  const [eco, setEco] = useSettings("homepage_ecosystem", {
    catalog_num: "2 800", catalog_unit: "+",
    training_num: "1000", training_unit: "+",
    training_m1_v: "15", training_m1_l: { ru: "новых курсов", uz: "yangi kurs", en: "new courses" },
    training_m2_v: "320", training_m2_l: { ru: "обучены в этом месяце", uz: "shu oyda o'qitildi", en: "trained this month" },
    training_m3_v: "98%", training_m3_l: { ru: "удовлетворённость", uz: "qoniqish darajasi", en: "satisfaction" },
    service_num: "50", service_unit: "+",
    service_m1_v: "3", service_m1_l: { ru: "инженера на выезде", uz: "chiqadigan muhandis", en: "engineers on site" },
    service_m2_v: "5", service_m2_l: { ru: "заявки в работе", uz: "ishdagi ariza", en: "jobs in progress" },
    service_m3_v: "97%", service_m3_l: { ru: "довольных клиентов", uz: "mamnun mijoz", en: "satisfied clients" },
    brands_num: "120", brands_unit: "+",
    delivery_num: "14", delivery_unit: "",
  });

  const save = (setter, val) => cmsOp(() => setter(val), toast, "Сохранено");

  // Guard against pre-migration settings that were still plain strings —
  // spreading a string ({..."foo"}) splits it into indexed characters instead of an {ru,uz,en} map.
  const asObj = (v) => (v && typeof v === "object" && !Array.isArray(v)) ? v : {};

  const setH = (k, v) => setHero(h => ({ ...h, [k]: v }));
  const setHL = (k, v) => setHero(h => ({ ...h, [k]: { ...asObj(h[k]), [lang]: v } }));
  const setI = (k, v) => setImpact(im => ({ ...im, [k]: v }));
  const setIL = (k, v) => setImpact(im => ({ ...im, [k]: { ...asObj(im[k]), [lang]: v } }));
  const setC = (k, v) => setCta(c => ({ ...c, [k]: v }));
  const setCL = (k, v) => setCta(c => ({ ...c, [k]: { ...asObj(c[k]), [lang]: v } }));
  const setE = (k, v) => setEco(x => ({ ...x, [k]: v }));
  const setEL = (k, v) => setEco(x => ({ ...x, [k]: { ...asObj(x[k]), [lang]: v } }));

  const LangTabs = () => (
    <div className="adm-tabs" style={{ marginBottom: 12 }}>
      {["ru", "uz", "en"].map(l => (
        <div key={l} className={`adm-tab ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>{LANG_LABEL[l]}</div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Редактор главной страницы</div>
          <div className="adm-page-sub">Управление контентом секций</div>
        </div>
        <a className="btn btn-secondary" href="/" target="_blank"><AdminIcon name="eye" size={14} /> Просмотр сайта</a>
      </div>

      <div className="adm-tabs">
        {[["hero","Герой"],["eco","Экосистема"],["impact","Impact"],["cta","CTA"]].map(([k,l]) => (
          <div key={k} className={`adm-tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {tab === "hero" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Главный экран (Hero)</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <LangTabs />
              <Field label="Бейдж (подпись над заголовком)">
                <input className="adm-input" value={hero.badge?.[lang] || ""} onChange={e => setHL("badge", e.target.value)} />
              </Field>
              <div className="adm-form-row">
                <Field label="Заголовок строка 1">
                  <input className="adm-input" value={hero.title1?.[lang] || ""} onChange={e => setHL("title1", e.target.value)} />
                </Field>
                <Field label="Заголовок строка 2 (синий акцент)">
                  <input className="adm-input" value={hero.title2?.[lang] || ""} onChange={e => setHL("title2", e.target.value)} />
                </Field>
              </div>
              <Field label="Подзаголовок">
                <textarea className="adm-textarea" rows={2} value={hero.subtitle?.[lang] || ""} onChange={e => setHL("subtitle", e.target.value)} />
              </Field>
              <div className="adm-form-row">
                <Field label="Кнопка 1 (основная)">
                  <input className="adm-input" value={hero.ctaPrimary?.[lang] || ""} onChange={e => setHL("ctaPrimary", e.target.value)} />
                </Field>
                <Field label="Кнопка 2 (вторая)">
                  <input className="adm-input" value={hero.ctaSecondary?.[lang] || ""} onChange={e => setHL("ctaSecondary", e.target.value)} />
                </Field>
              </div>
              <hr className="adm-divider" />
              <div className="adm-page-sub" style={{ marginBottom: 12 }}>Строка доверия (галочки под кнопками)</div>
              <div className="adm-form-row cols3">
                <Field label="Пункт 1">
                  <input className="adm-input" value={hero.trust1?.[lang] || ""} onChange={e => setHL("trust1", e.target.value)} />
                </Field>
                <Field label="Пункт 2">
                  <input className="adm-input" value={hero.trust2?.[lang] || ""} onChange={e => setHL("trust2", e.target.value)} />
                </Field>
                <Field label="Пункт 3">
                  <input className="adm-input" value={hero.trust3?.[lang] || ""} onChange={e => setHL("trust3", e.target.value)} />
                </Field>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => save(setHero, hero)}><AdminIcon name="save" size={14} /> Сохранить Hero</button>
            </div>
          </div>
        </div>
      )}

      {tab === "eco" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Блок «Экосистема» (6 плиток)</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <LangTabs />
              <div className="adm-page-sub" style={{ marginBottom: 12 }}>
                Крупные числа плиток. Счётчики тендеров берутся из системы автоматически и здесь не редактируются.
              </div>
              <div className="adm-form-row cols3">
                {[["catalog","Каталог"],["training","Обучение"],["service","Сервис"]].map(([k,l]) => (
                  <div key={k} style={{ display: "flex", gap: 8 }}>
                    <Field label={`${l}: число`}>
                      <input className="adm-input" value={eco[`${k}_num`] || ""} onChange={e => setE(`${k}_num`, e.target.value)} />
                    </Field>
                    <Field label="ед.">
                      <input className="adm-input" placeholder="+" value={eco[`${k}_unit`] || ""} onChange={e => setE(`${k}_unit`, e.target.value)} />
                    </Field>
                  </div>
                ))}
              </div>
              <div className="adm-form-row cols3">
                {[["brands","Бренды"],["delivery","Доставка"]].map(([k,l]) => (
                  <div key={k} style={{ display: "flex", gap: 8 }}>
                    <Field label={`${l}: число`}>
                      <input className="adm-input" value={eco[`${k}_num`] || ""} onChange={e => setE(`${k}_num`, e.target.value)} />
                    </Field>
                    <Field label="ед.">
                      <input className="adm-input" placeholder="+" value={eco[`${k}_unit`] || ""} onChange={e => setE(`${k}_unit`, e.target.value)} />
                    </Field>
                  </div>
                ))}
              </div>

              <hr className="adm-divider" />
              <div className="adm-page-sub" style={{ marginBottom: 12 }}>
                Мелкие метрики внутри плиток. Оставьте значение пустым — метрика исчезнет со страницы, вёрстка не сломается.
              </div>
              {[
                ["Обучение", "training", 3],
                ["Сервис", "service", 3],
              ].map(([label, key, count]) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <div className="adm-label" style={{ marginBottom: 8 }}>{label}</div>
                  {Array.from({ length: count }, (_, i) => i + 1).map(n => (
                    <div key={n} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <Field label={`Метрика ${n}: значение`}>
                        <input className="adm-input" placeholder="98%" value={eco[`${key}_m${n}_v`] || ""} onChange={e => setE(`${key}_m${n}_v`, e.target.value)} />
                      </Field>
                      <Field label="подпись">
                        <input className="adm-input" placeholder="Подпись" value={eco[`${key}_m${n}_l`]?.[lang] || ""} onChange={e => setEL(`${key}_m${n}_l`, e.target.value)} />
                      </Field>
                    </div>
                  ))}
                </div>
              ))}

              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => save(setEco, eco)}>
                <AdminIcon name="save" size={14} /> Сохранить «Экосистему»
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "impact" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Тёмная полоса «Масштаб платформы»</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <LangTabs />
              <Field label="Надпись-эйбрау (маленькая, над заголовком)">
                <input className="adm-input" value={impact.eyebrow?.[lang] || ""} onChange={e => setIL("eyebrow", e.target.value)} />
              </Field>
              <Field label="Заголовок секции">
                <textarea className="adm-textarea" rows={2} value={impact.title?.[lang] || ""} onChange={e => setIL("title", e.target.value)} />
              </Field>
              <hr className="adm-divider" />
              <div className="adm-page-sub" style={{ marginBottom: 12 }}>Метрики (значение и единица — общие для всех языков, подпись — переводится)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ display: "flex", gap: 8 }}>
                    <Field label={`Метрика ${n}: значение`}>
                      <input className="adm-input" placeholder="2 800" value={impact[`stat${n}_val`] || ""} onChange={e => setI(`stat${n}_val`, e.target.value)} />
                    </Field>
                    <Field label="ед.">
                      <input className="adm-input" placeholder="+" value={impact[`stat${n}_unit`] || ""} onChange={e => setI(`stat${n}_unit`, e.target.value)} />
                    </Field>
                    <Field label="подпись">
                      <input className="adm-input" placeholder="Подпись" value={impact[`stat${n}_label`]?.[lang] || ""} onChange={e => setIL(`stat${n}_label`, e.target.value)} />
                    </Field>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => save(setImpact, impact)}><AdminIcon name="save" size={14} /> Сохранить Impact</button>
            </div>
          </div>
        </div>
      )}

      {tab === "cta" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Финальный призыв к действию (CTA)</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <LangTabs />
              <Field label="Заголовок">
                <input className="adm-input" value={cta.title?.[lang] || ""} onChange={e => setCL("title", e.target.value)} />
              </Field>
              <Field label="Подзаголовок">
                <textarea className="adm-textarea" rows={2} value={cta.subtitle?.[lang] || ""} onChange={e => setCL("subtitle", e.target.value)} />
              </Field>
              <div className="adm-form-row">
                <Field label="Кнопка 1">
                  <input className="adm-input" value={cta.btn1?.[lang] || ""} onChange={e => setCL("btn1", e.target.value)} />
                </Field>
                <Field label="Кнопка 2">
                  <input className="adm-input" value={cta.btn2?.[lang] || ""} onChange={e => setCL("btn2", e.target.value)} />
                </Field>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => save(setCta, cta)}><AdminIcon name="save" size={14} /> Сохранить CTA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
window.AdminHomepage = AdminHomepage;
