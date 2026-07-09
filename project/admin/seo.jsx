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
    </div>
  );
}
window.AdminSEO = AdminSEO;
