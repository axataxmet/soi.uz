/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — SEO */
function AdminSEO() {
  const { useState } = React;
  const toast = useToast();
  const [seo, setSeo] = useSettings("site_seo", {
    title: "ИНДУСТРИЯ ЗДОРОВЬЯ — медицинское оборудование в Узбекистане",
    description: "Официальный поставщик медицинского оборудования, расходных материалов и медицинской техники в Республике Узбекистан.",
    keywords: "медицинское оборудование, узбекистан, поставка, каталог",
    og_image: "",
    robots: "index,follow",
  });
  const set = (k, v) => setSeo(s => ({ ...s, [k]: v }));
  /* Счётчики посещаемости. Номера живут в настройке, а не в коде: их меняют
     без правки файлов и деплоя, а пустое поле — штатный способ отключить
     счётчик. Скрипты подключаются только после согласия «Принять все» в
     cookie-баннере, см. lib/analytics.js. */
  const [an, setAn] = useSettings("site_analytics", { metrika: "", ga4: "" });
  const setA = (k, v) => setAn(a => ({ ...a, [k]: v }));
  return (
    <div>
      <div className="adm-page-head"><div className="adm-page-title">SEO настройки</div></div>
      <div className="adm-card">
        <div className="adm-card-body">
          <div className="adm-form">
            <Field label="Title (title страницы)"><input className="adm-input" value={seo.title} onChange={e => set("title", e.target.value)} /></Field>
            <Field label="Meta Description" hint="160 символов"><textarea className="adm-textarea" rows={3} value={seo.description} onChange={e => set("description", e.target.value)} /></Field>
            <Field label="Keywords"><input className="adm-input" value={seo.keywords} onChange={e => set("keywords", e.target.value)} /></Field>
            <Field label="Robots"><select className="adm-select" value={seo.robots} onChange={e => set("robots", e.target.value)}><option value="index,follow">index, follow</option><option value="noindex,nofollow">noindex, nofollow</option></select></Field>
            <ImageUpload label="OG Image (1200×630)" value={seo.og_image} onChange={v => set("og_image", v)} />
            <button className="btn btn-primary" onClick={() => cmsOp(() => setSeo(seo), toast, "SEO сохранено")}><AdminIcon name="save" size={14} /> Сохранить</button>
          </div>
        </div>
      </div>
        <div className="adm-page-head" style={{ marginTop: 28 }}><div className="adm-page-title">Счётчики посещаемости</div></div>
        <div className="adm-card">
          <div className="adm-card-body">
            <div className="adm-form">
              <Field label="Яндекс.Метрика — номер счётчика" hint="Только цифры, например 12345678. Берётся на metrika.yandex.ru. Пустое поле — счётчик отключён.">
                <input className="adm-input" inputMode="numeric" placeholder="12345678"
                  value={an.metrika || ""} onChange={e => setA("metrika", e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label="Google Analytics 4 — Measurement ID" hint="Вида G-XXXXXXXXXX. Берётся в analytics.google.com. Пустое поле — счётчик отключён.">
                <input className="adm-input" placeholder="G-XXXXXXXXXX"
                  value={an.ga4 || ""} onChange={e => setA("ga4", e.target.value.trim())} />
              </Field>
              <p style={{ fontSize: 13, color: "#667", margin: "2px 0 10px", lineHeight: 1.5 }}>
                Счётчики загружаются только у посетителей, выбравших «Принять все» в
                баннере cookie. При выборе «Только необходимые» ни одного запроса к
                аналитике не уходит. Запись действий посетителя (вебвизор) выключена
                намеренно.
              </p>
              <button className="btn btn-primary" onClick={() => cmsOp(() => setAn(an), toast, "Счётчики сохранены")}><AdminIcon name="save" size={14} /> Сохранить</button>
            </div>
          </div>
        </div>
    </div>
  );
}
window.AdminSEO = AdminSEO;
