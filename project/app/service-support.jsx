/* ИНДУСТРИЯ ЗДОРОВЬЯ — «Сервис и поддержка» (ТЗ, RU-first). Иконочные карточки в
   фирменном стиле + плейсхолдеры под будущие фото; форма заявки через MinIO. */

function useSsCss() {
  React.useEffect(() => {
    const ID = "ss-css";
    if (document.getElementById(ID)) return;
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `
.ss-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center}
.ss-badges{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px}
.ss-badge{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--blue-700,#1749a6);background:var(--blue-50,#eef4ff);border:1px solid var(--blue-200,#cfe0fb);border-radius:8px;padding:7px 13px}
.ss-photo{position:relative;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#e8f0fe,#dbe9fb);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:#8ba7d4}
.ss-photo::after{content:attr(data-label);position:absolute;bottom:10px;left:12px;font-size:11px;font-weight:600;color:#7d97c4;background:rgba(255,255,255,.7);padding:3px 8px;border-radius:6px}
.ss-photo .ph-ic{opacity:.5}
.ss-hero-photo{aspect-ratio:4/3;width:100%}
/* full-bleed hero media (photo/video from admin) */
.page-hero.ss-media{position:relative;overflow:hidden}
.page-hero.ss-media .pw{display:none}
.ss-hero-bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.ss-hero-bg img,.ss-hero-bg video{width:100%;height:100%;object-fit:cover;display:block}
.ss-hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,20,44,.86) 0%,rgba(6,20,44,.62) 52%,rgba(6,20,44,.30) 100%)}
.page-hero.ss-media .wrap{position:relative;z-index:1}
.page-hero.ss-media h1{color:#fff}
.page-hero.ss-media p{color:rgba(255,255,255,.9)}
.page-hero.ss-media .ss-badge{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);color:#fff}
.page-hero.ss-media .btn-ghost{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.45)}
.ss-eq-img{aspect-ratio:16/10;width:100%;object-fit:cover;display:block}
.ss-eng-img{aspect-ratio:1/1;width:100%;object-fit:cover;display:block}
.ss-rev-logo-img{max-width:120px;max-height:34px;object-fit:contain;display:block}
.ss-grid{display:grid;gap:16px}
.ss-g3{grid-template-columns:repeat(3,1fr)}
.ss-g4{grid-template-columns:repeat(4,1fr)}
.ss-g5{grid-template-columns:repeat(5,1fr)}
.ss-g2{grid-template-columns:repeat(2,1fr)}
.ss-card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px;transition:transform .16s,box-shadow .16s,border-color .16s}
.ss-card.link{cursor:pointer}
.ss-card.link:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(16,42,86,.10);border-color:var(--blue-300,#9cc0f5)}
.ss-ic{width:46px;height:46px;border-radius:12px;background:var(--blue-50,#eef4ff);color:var(--blue-600);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.ss-card h4{font-size:15.5px;font-weight:800;margin:0 0 6px;color:var(--ink)}
.ss-card p{font-size:13px;color:var(--slate-500);line-height:1.5;margin:0}
.ss-card .arr{margin-top:12px;color:var(--blue-600);font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:5px}
.ss-qa{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ss-svc{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.ss-svc-i{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px 16px;text-align:center}
.ss-svc-i .ss-ic{margin:0 auto 10px}
.ss-svc-i h4{font-size:13.5px;font-weight:700;margin:0;color:var(--ink);line-height:1.3}
.ss-eq{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.ss-eq-c{border:1px solid var(--line);border-radius:14px;background:var(--surface);overflow:hidden;cursor:pointer;transition:.16s;text-decoration:none;display:block}
.ss-eq-c:hover{border-color:var(--blue-300,#9cc0f5);box-shadow:0 10px 24px rgba(16,42,86,.09);transform:translateY(-2px)}
.ss-eq-ph{aspect-ratio:16/10;width:100%}
.ss-eq-c span{display:block;padding:12px 14px;font-size:13px;font-weight:700;color:var(--ink);line-height:1.3}
.ss-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.ss-flow-i{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px 16px}
.ss-flow-i .n{width:30px;height:30px;border-radius:8px;background:var(--blue-600);color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.ss-flow-i h4{font-size:14px;font-weight:800;margin:0 0 4px;color:var(--ink)}
.ss-flow-i p{font-size:12.5px;color:var(--slate-500);margin:0;line-height:1.45}
.ss-contract{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:center;background:linear-gradient(135deg,#0e4ac6,#1d7ed8);border-radius:20px;padding:clamp(26px,4vw,40px);color:#fff}
.ss-contract h2{color:#fff;font-size:26px;font-weight:800;margin:0 0 12px}
.ss-contract p.lead{opacity:.92;font-size:15px;line-height:1.6;margin:0 0 20px}
.ss-contract ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.ss-contract li{display:flex;gap:10px;align-items:flex-start;font-size:14px}
.ss-contract li svg{flex-shrink:0;margin-top:2px}
.ss-contract .card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:26px;text-align:center}
.ss-eng{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ss-eng-c{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.ss-eng-ph{aspect-ratio:1/1;width:100%}
.ss-eng-b{padding:16px}
.ss-eng-b h4{font-size:15px;font-weight:800;margin:0 0 3px;color:var(--ink)}
.ss-eng-b .role{font-size:12.5px;color:var(--blue-600);font-weight:600;margin-bottom:8px}
.ss-eng-b .exp{font-size:12.5px;color:var(--slate-500);margin-bottom:10px}
.ss-chips{display:flex;flex-wrap:wrap;gap:6px}
.ss-chip{font-size:10.5px;font-weight:700;color:var(--slate-600);background:var(--bg-2,#f4f7fb);border:1px solid var(--line);border-radius:20px;padding:3px 9px}
.ss-rev{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ss-rev-c{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.ss-rev-obj{aspect-ratio:16/9;width:100%}
.ss-rev-b{padding:18px;flex:1;display:flex;flex-direction:column;gap:10px}
.ss-rev-logo{width:96px;height:30px;border-radius:6px}
.ss-rev-b p{font-size:13.5px;color:var(--slate-600);line-height:1.55;margin:0;font-style:italic}
.ss-rev-org{font-size:12.5px;color:var(--slate-500);font-weight:600;margin-top:auto}
.ss-placeholder-note{font-size:12px;color:var(--slate-400);text-align:center;margin-top:14px}
.ss-legal{background:var(--blue-50,#eef4ff);border:1px solid var(--blue-200,#cfe0fb);border-radius:14px;padding:20px 24px;display:flex;gap:14px;align-items:flex-start}
.ss-legal-ic{flex-shrink:0;width:32px;height:32px;border-radius:9px;background:var(--blue-600);color:#fff;display:flex;align-items:center;justify-content:center}
.ss-contacts{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.ss-contact-i{display:flex;gap:14px;align-items:flex-start;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px}
.ss-contact-i .ss-ic{margin:0;flex-shrink:0;width:40px;height:40px}
.ss-contact-i h4{font-size:13px;font-weight:800;margin:0 0 3px;color:var(--slate-500);text-transform:uppercase;letter-spacing:.02em}
.ss-contact-i a,.ss-contact-i div.v{font-size:15px;color:var(--ink);font-weight:700;text-decoration:none}
.ss-contact-i.urgent{border-color:#f0b8ac;background:#fff5f2}
.ss-contact-i.urgent .ss-ic{background:#fdeae4;color:#e0492f}
.ss-map-ph{aspect-ratio:21/6;width:100%;margin-top:16px;border-radius:14px}
/* form */
.ss-form-wrap{max-width:840px;margin:0 auto;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:clamp(24px,4vw,40px);box-shadow:0 6px 24px rgba(16,42,86,.08)}
.ss-fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.ss-field{display:flex;flex-direction:column;gap:6px}
.ss-field.full{grid-column:1/-1}
.ss-field label{font-size:13px;font-weight:600;color:var(--slate-700)}
.ss-field label .req{color:#e0492f;margin-left:2px}
.ss-input,.ss-select,.ss-textarea{height:44px;border:1.5px solid var(--line);border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;background:var(--bg,var(--surface));color:var(--ink);outline:none;transition:border-color .16s;width:100%;box-sizing:border-box}
.ss-textarea{height:auto;padding:12px 14px;min-height:96px;resize:vertical}
.ss-input:focus,.ss-select:focus,.ss-textarea:focus{border-color:var(--blue-400,#4d88e0)}
.ss-drop{display:block;border:1.5px dashed var(--blue-300,#9cc0f5);border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:.16s;background:var(--bg-2,#f8fafc)}
.ss-drop:hover{border-color:var(--blue-500,#2b72e3);background:var(--blue-50,#eef4ff)}
.ss-files{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.ss-file{display:flex;align-items:center;gap:10px;font-size:13px;background:var(--bg-2,#f4f7fb);border:1px solid var(--line);border-radius:9px;padding:9px 12px}
.ss-file .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ss-file button{border:none;background:none;color:var(--slate-400);cursor:pointer;flex-shrink:0}
.ss-check{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--slate-700);cursor:pointer;padding:6px 0}
.ss-check input{width:17px;height:17px;flex-shrink:0;accent-color:var(--blue-600)}
.ss-form-ok{text-align:center;padding:36px 20px}
.ss-form-ok .ic{width:64px;height:64px;border-radius:50%;background:rgba(21,160,106,.12);color:#15A06A;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.ss-form-ok h3{font-size:20px;font-weight:800;margin:0 0 8px}
.ss-form-ok p{font-size:14.5px;color:var(--slate-600);max-width:440px;margin:0 auto;line-height:1.6}
/* sticky CTA */
.ss-sticky{position:fixed;right:22px;bottom:22px;z-index:60;box-shadow:0 12px 30px rgba(14,74,198,.35);opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .22s,transform .22s}
.ss-sticky.show{opacity:1;transform:translateY(0);pointer-events:auto}
@media(max-width:960px){.ss-hero-grid,.ss-contract{grid-template-columns:1fr}.ss-g4,.ss-g5,.ss-svc,.ss-eq,.ss-flow,.ss-eng{grid-template-columns:repeat(2,1fr)}.ss-g3,.ss-qa,.ss-rev{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ss-g2,.ss-g3,.ss-g4,.ss-g5,.ss-svc,.ss-eq,.ss-flow,.ss-eng,.ss-qa,.ss-rev,.ss-contacts,.ss-fgrid{grid-template-columns:1fr}.ss-sticky{left:16px;right:16px;bottom:16px}.ss-sticky .btn{width:100%;justify-content:center}}
    `;
    document.head.appendChild(s);
  }, []);
}

function useSsJsonLd(faq) {
  React.useEffect(() => {
    const ID = "ss-jsonld";
    const old = document.getElementById(ID); if (old) old.remove();
    const base = location.origin + location.pathname;
    const data = [
      { "@context": "https://schema.org", "@type": "Organization", name: "ИНДУСТРИЯ ЗДОРОВЬЯ",
        url: "https://soi.uz/", makesOffer: { "@type": "Offer", itemOffered: { "@type": "Service", name: "Сервис и техническая поддержка медицинского оборудования" } } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: base + "#/" },
        { "@type": "ListItem", position: 2, name: "Услуги", item: base + "#/services" },
        { "@type": "ListItem", position: 3, name: "Сервис и поддержка" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ];
    const s = document.createElement("script");
    s.id = ID; s.type = "application/ld+json"; s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
    return () => { const el = document.getElementById(ID); if (el) el.remove(); };
  }, []);
}

const ssTrack = (name, payload) => { try { window.__track && window.__track(name, payload || {}); } catch (e) {} };
const ssScrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
const SsPhotoIcon = <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>;

// service-specific inline icons (SI_ICONS has generic ones; these are domain-specific)
const SS_ICONS = {
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5L4 16.6 7.4 20l5.3-5.3a4 4 0 0 0 5-5.4l-2.5 2.5-2.1-.4-.4-2.1z"/>',
  gauge: '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="m14 12 4-3"/><path d="M4 20a9 9 0 1 1 16 0"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"/>',
  headset: '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2zM20 13v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z"/>',
  tools: '<path d="M4 7l3-3 3 3-3 3zM14 4l6 6M14 10l-9 9 1 1 9-9M18 14l-4 4"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  boot: '<path d="M4 4v11h4l2 3h8v-3c0-2-2-3-4-3l-2-2V4zM4 15h16"/>',
};
function SsIcon({ name, size = 22 }) {
  const p = SS_ICONS[name];
  if (!p) return <CoIcon name={name} size={size} />;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: p }} />;
}

/* CMS-настройка страницы (public GET /settings/:key). Для несохранённых ключей
   backend отдаёт value:null — страхуемся дефолтом на месте вызова. */
function useSsSetting(key, def) {
  const [val, setVal] = React.useState(() => (window.CMS ? window.CMS.getSetting(key, def) : def));
  React.useEffect(() => {
    if (!window.CMS) return;
    setVal(window.CMS.getSetting(key, def));
    return window.CMS.on ? window.CMS.on("settings", () => setVal(window.CMS.getSetting(key, def))) : undefined;
  }, [key]);
  return val;
}
/* CMS-коллекция (team / reviews) с подпиской на догрузку из API. */
function useSsCollection(name) {
  const [items, setItems] = React.useState(() => (window.CMS ? window.CMS.list(name) : []));
  React.useEffect(() => {
    if (!window.CMS) return;
    const read = () => setItems(window.CMS.list(name) || []);
    read();
    return window.CMS.on ? window.CMS.on(name, read) : undefined;
  }, [name]);
  return items;
}

/* ── Сервисная заявка ─────────────────────────────────── */
function SsForm() {
  const { useState } = React;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [files, setFiles] = useState([]);
  const [f, setF] = useState({ name: "", org: "", phone: "", email: "", eqType: "", maker: "", serial: "", issue: "", consent: false });
  const set = (k, v) => { ssTrack("service_form_start"); setF((s) => ({ ...s, [k]: v })); };

  const onFiles = (list) => {
    const allow = /\.(pdf|docx?|xlsx?|jpe?g|png)$/i;
    const add = [...list].filter((x) => allow.test(x.name) && x.size <= 20 * 1024 * 1024);
    if (add.length < list.length) setErr("Файл не загружен. Проверьте формат и размер и попробуйте снова.");
    setFiles((prev) => [...prev, ...add].slice(0, 5));
    if (add.length) ssTrack("service_file_upload");
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!f.name.trim() || !f.org.trim() || !f.phone.trim()) { setErr("Заполните имя, организацию и телефон."); ssTrack("service_form_error", { reason: "required" }); return; }
    if (!f.eqType.trim() && !f.issue.trim()) { setErr("Укажите тип оборудования или опишите неисправность."); ssTrack("service_form_error", { reason: "no_device" }); return; }
    if (!f.consent) { setErr("Необходимо согласие на обработку персональных данных."); ssTrack("service_form_error", { reason: "no_consent" }); return; }
    setSending(true);
    try {
      let attachments = [];
      if (files.length && window.api && window.api.req) {
        const fd = new FormData();
        files.forEach((file) => fd.append("files", file));
        const res = await window.api.req("/submissions/attachments", { method: "POST", body: fd, noAuth: true });
        attachments = (res && res.files) || [];
      }
      await window.api.create("submissions", {
        name: f.name, phone: f.phone, email: f.email || undefined,
        message: f.issue || undefined,
        source: "Сервис и поддержка — Сервисная заявка",
        meta: {
          org: f.org,
          equipment: { type: f.eqType || undefined, maker: f.maker || undefined, serial: f.serial || undefined },
          attachments: attachments.length ? attachments : undefined,
        },
      });
      ssTrack("service_form_submit");
      setSent(true);
    } catch (ex) {
      setErr("Не удалось отправить заявку. Данные сохранены в форме. Попробуйте снова или свяжитесь с нами по телефону.");
      ssTrack("service_form_error", { reason: "submit_failed" });
    } finally { setSending(false); }
  };

  if (sent) return (
    <div className="ss-form-wrap">
      <div className="ss-form-ok">
        <div className="ic"><CoIcon name="check" size={30} /></div>
        <h3>Заявка отправлена</h3>
        <p>Спасибо! Сервисная заявка принята. Инженер свяжется с вами для уточнения оборудования, характера неисправности и сроков выезда.</p>
      </div>
    </div>
  );

  return (
    <form className="ss-form-wrap" onSubmit={submit} noValidate>
      <div className="ss-fgrid">
        <div className="ss-field"><label>Имя<span className="req">*</span></label><input className="ss-input" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="ss-field"><label>Организация<span className="req">*</span></label><input className="ss-input" value={f.org} onChange={(e) => set("org", e.target.value)} /></div>
        <div className="ss-field"><label>Телефон<span className="req">*</span></label><input className="ss-input" type="tel" placeholder="+998 __ ___ __ __" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div className="ss-field"><label>Email</label><input className="ss-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div className="ss-field"><label>Тип оборудования</label><input className="ss-input" value={f.eqType} onChange={(e) => set("eqType", e.target.value)} placeholder="УЗИ, рентген, лаборатория…" /></div>
        <div className="ss-field"><label>Производитель</label><input className="ss-input" value={f.maker} onChange={(e) => set("maker", e.target.value)} /></div>
        <div className="ss-field full"><label>Серийный номер</label><input className="ss-input" value={f.serial} onChange={(e) => set("serial", e.target.value)} /></div>
        <div className="ss-field full"><label>Описание неисправности</label><textarea className="ss-textarea" rows={4} value={f.issue} onChange={(e) => set("issue", e.target.value)} placeholder="Что произошло, когда, при каких условиях…" /></div>
      </div>
      <div style={{ margin: "16px 0" }}>
        <label className="ss-drop" htmlFor="ss-file-inp">
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Прикрепить файл (фото шильдика, документы, лог ошибок)</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--slate-500)" }}>PDF, DOC, DOCX, XLS, XLSX, JPG, PNG · до 20 МБ · до 5 файлов</div>
        </label>
        <input id="ss-file-inp" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        {files.length > 0 && (
          <div className="ss-files">
            {files.map((file, i) => (
              <div className="ss-file" key={i}>
                <CoIcon name="doc" size={15} /><span className="nm">{file.name}</span>
                <span style={{ color: "var(--slate-400)", fontSize: 12 }}>{Math.round(file.size / 1024)} KB</span>
                <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} aria-label="Убрать">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <label className="ss-check"><input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />Согласен с политикой конфиденциальности и обработкой персональных данных<span className="req">*</span></label>
      {err && <div style={{ color: "#e0492f", fontSize: 13.5, margin: "10px 0", fontWeight: 600 }}>{err}</div>}
      <button className="btn btn-pri btn-lg" type="submit" disabled={sending} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
        {sending ? "Отправка…" : "Отправить заявку"}
      </button>
    </form>
  );
}

function ServiceSupportPage({ t, lang, go, goCat }) {
  const { useState, useEffect } = React;
  const [flow, setFlow] = useState(0);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [sticky, setSticky] = useState(false);
  const heroRef = React.useRef(null);
  useSsCss();
  const contacts = window.useSiteContacts ? window.useSiteContacts() : { phone: "+998 (77) 225-00-01", email: "info@soi.uz" };

  // Show the sticky CTA once the hero has scrolled out of view. IntersectionObserver
  // is robust to whichever element is the scroll container (the .embed shell puts
  // overflow:auto on <html>, so window.scrollY doesn't track the page here).
  useEffect(() => {
    const el = heroRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const QUICK = [
    ["Подать сервисную заявку", "Опишите оборудование и неисправность — инженер свяжется с вами.", "clipboard", () => ssScrollTo("ss-form")],
    ["Вызвать инженера", "Выезд специалиста на объект для диагностики и ремонта.", "boot", () => ssScrollTo("ss-form")],
    ["Получить консультацию", "Ответим на технические вопросы по эксплуатации и сервису.", "headset", () => (window.__openQuote ? window.__openQuote() : ssScrollTo("ss-form"))],
    ["Заказать ТО", "Плановое техническое обслуживание оборудования.", "calendar", () => ssScrollTo("ss-form")],
    ["Скачать документацию", "Руководства, инструкции и сервисные материалы.", "download", () => ssScrollTo("ss-docs")],
    ["Заключить сервисный договор", "Долгосрочное сопровождение с приоритетным сервисом.", "shield", () => ssScrollTo("ss-contract")],
  ];
  const SERVICES = [
    ["Монтаж оборудования", "building"], ["Ввод в эксплуатацию", "boot"], ["Гарантийное обслуживание", "shield"],
    ["Постгарантийное обслуживание", "clock"], ["Диагностика", "gauge"], ["Ремонт", "wrench"],
    ["Калибровка", "tools"], ["Обновление ПО", "chip"], ["Обучение персонала", "users"], ["Консультации специалистов", "headset"],
  ];
  // Блоки 1/4/8 редактируются через админку «Сервис и поддержка» (settings), блоки
  // 9/10 — через админки «Команда» и «Отзывы» (коллекции). Дефолты ниже показываются,
  // пока в админке ничего не сохранено.
  const heroMedia = useSsSetting("service_hero", null) || {};
  const hasHeroMedia = !!heroMedia.url;
  const EQUIPMENT_DEFAULTS = [
    "Ультразвуковые системы", "Рентгеновское оборудование", "Компьютерные томографы",
    "Магнитно-резонансные томографы", "Маммографы", "Эндоскопическое оборудование",
    "Лабораторное оборудование", "Офтальмология", "Реанимационное оборудование",
    "Стоматологическое оборудование",
  ].map((name) => ({ name, photo: "", link: "" }));
  const eqSetting = useSsSetting("service_equipment", null);
  const equipment = ((eqSetting && Array.isArray(eqSetting.items)) ? eqSetting.items : EQUIPMENT_DEFAULTS).filter((it) => !it.hidden);
  const docsSetting = useSsSetting("service_docs", null);
  const team = useSsCollection("team");
  const engineers = (team || []).filter((m) => m.service);
  const allReviews = useSsCollection("reviews");
  const cmsReviews = (allReviews || [])
    .filter((r) => (r.status || "published") === "published")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 3);
  const FLOW = [
    ["Получение заявки", "Принимаем обращение по телефону, email или через форму."],
    ["Анализ обращения", "Уточняем оборудование, характер проблемы и приоритет."],
    ["Связь с заказчиком", "Согласуем детали, доступ на объект и удобное время."],
    ["Диагностика", "Определяем причину неисправности и объём работ."],
    ["Выезд инженера", "Сертифицированный специалист выезжает на объект."],
    ["Выполнение работ", "Ремонт, настройка, замена узлов оригинальными запчастями."],
    ["Проверка оборудования", "Тестируем работоспособность и параметры."],
    ["Передача оборудования", "Сдаём оборудование и передаём отчёт о работах."],
  ];
  const WHY = [
    ["Сертифицированные инженеры", "award"], ["Собственный сервисный центр", "building"], ["Оригинальные запасные части", "shield"],
    ["Оперативный выезд", "boot"], ["Поддержка по всему Узбекистану", "globe"], ["Гарантия на работы", "check"],
    ["Современное диагностическое оборудование", "gauge"], ["Индивидуальный подход", "users"],
  ];
  const CONTRACT_BENEFITS = [
    "Плановое техническое обслуживание", "Профилактические осмотры", "Приоритетное обслуживание",
    "Персональный инженер", "Снижение простоев оборудования", "Контроль технического состояния",
  ];
  const DOC_ICONS = ["doc", "clipboard", "award", "doc", "chip", "headset", "star"];
  const DOCS_DEFAULTS = [
    "Руководства пользователя", "Каталоги", "Сертификаты", "Инструкции",
    "Программное обеспечение", "Часто задаваемые вопросы", "Полезные статьи",
  ].map((title) => ({ title, url: "" }));
  const docs = (docsSetting && Array.isArray(docsSetting.items)) ? docsSetting.items : DOCS_DEFAULTS;
  // Placeholder engineers/reviews — generic (no fabricated real people/clients); to be filled via admin later.
  const ENGINEERS = [
    ["Сервисный инженер", "Диагностика и ремонт", "Опыт: 8+ лет", ["Ультразвук", "Рентген"]],
    ["Сервисный инженер", "Лабораторное оборудование", "Опыт: 6+ лет", ["Анализаторы", "Центрифуги"]],
    ["Инженер-электроник", "Монтаж и пусконаладка", "Опыт: 10+ лет", ["КТ / МРТ", "Мониторинг"]],
    ["Инженер по ПО", "Настройка и обновления", "Опыт: 5+ лет", ["Системы", "Калибровка"]],
  ];
  const REVIEWS = [
    ["Медицинское учреждение", "Отзыв клиента появится здесь после публикации в админ-панели."],
    ["Диагностический центр", "Отзыв клиента появится здесь после публикации в админ-панели."],
    ["Частная клиника", "Отзыв клиента появится здесь после публикации в админ-панели."],
  ];
  const FAQ = [
    ["Как оформить сервисную заявку?", "Заполните форму на этой странице, позвоните по сервисному телефону или напишите на email. Укажите оборудование, производителя и характер неисправности."],
    ["Какие регионы обслуживаются?", "Сервисная поддержка доступна по всей территории Узбекистана. Сроки выезда зависят от региона и приоритета обращения."],
    ["Как вызвать инженера на объект?", "Оформите заявку с пометкой о необходимости выезда. После анализа обращения и согласования времени инженер выезжает на объект."],
    ["Как проходит гарантийное обслуживание?", "В течение гарантийного срока диагностика и устранение заводских неисправностей выполняются на условиях гарантии производителя."],
    ["Можно ли заключить сервисный договор?", "Да. Сервисный договор включает плановое ТО, профилактику, приоритетное обслуживание и персонального инженера — оставьте запрос на коммерческое предложение."],
    ["Как заказать запасные части?", "Укажите модель и серийный номер оборудования в заявке — подберём оригинальные запчасти и сроки поставки."],
    ["Работаете ли с оборудованием, купленным не у вас?", "Да, возможность обслуживания рассматривается после анализа модели, документации и технического состояния."],
    ["Есть ли экстренная поддержка?", "Для критичного оборудования предусмотрено приоритетное обслуживание; условия фиксируются в сервисном договоре."],
    ["Какие документы получает клиент после работ?", "Отчёт о выполненных работах, при необходимости — акты, рекомендации по эксплуатации и гарантию на выполненные работы."],
    ["Проводится ли обучение персонала?", "Да, инструктаж по эксплуатации оборудования проводится в рамках ввода в эксплуатацию и как отдельная услуга."],
  ];

  useSsJsonLd(FAQ.map(([q, a]) => ({ q, a })));

  // Карточка оборудования: своя ссылка из админки (#/… или https://…), иначе каталог.
  const eqLink = (it) => {
    ssTrack("service_equipment_click", { category: it.name });
    const link = (it.link || "").trim();
    if (/^https?:\/\//.test(link)) { window.open(link, "_blank", "noopener"); return; }
    if (link.indexOf("#") === 0) { location.hash = link.slice(1); return; }
    goCat("listing", "equipment");
  };

  return (
    <div>
      {/* Block 1 — Hero: фото/видео из админки растягивается фоном на весь блок */}
      <section className={"page-hero" + (hasHeroMedia ? " ss-media" : "")} ref={heroRef}>
        <div className="pw"></div>
        {hasHeroMedia && (
          <div className="ss-hero-bg" aria-hidden="true">
            {heroMedia.type === "video"
              ? <video src={heroMedia.url} autoPlay muted loop playsInline preload="metadata" />
              : <img src={heroMedia.url} alt="" loading="eager" />}
          </div>
        )}
        <div className="wrap">
          <div className={hasHeroMedia ? "" : "ss-hero-grid"}>
            <div>
              <div className="ss-badges reveal"><span className="ss-badge"><CoIcon name="shield" size={14} />Полный цикл сопровождения</span></div>
              <h1 style={{ maxWidth: 620 }}>Сервис и поддержка медицинского оборудования</h1>
              <p style={{ maxWidth: 640, marginTop: 16 }}>Полный цикл технического сопровождения медицинского оборудования — от ввода в эксплуатацию до модернизации и долгосрочного сервисного обслуживания.</p>
              <div className="hero-actions" style={{ marginTop: 26 }}>
                <button className="btn btn-pri btn-lg" onClick={() => { ssTrack("service_cta_click"); ssScrollTo("ss-form"); }}>Подать сервисную заявку</button>
                <button className="btn btn-ghost btn-lg" onClick={() => { ssTrack("service_consult_click"); window.__openQuote ? window.__openQuote() : ssScrollTo("ss-form"); }}>Получить консультацию</button>
              </div>
            </div>
            {!hasHeroMedia && <div className="ss-photo ss-hero-photo reveal" data-label="Фото: инженер у оборудования"><span className="ph-ic">{SsPhotoIcon}</span></div>}
          </div>
        </div>
      </section>

      {/* Block 2 — Быстрые действия */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Быстрые действия</span><h2 className="h-sec" style={{ marginTop: 14 }}>Решите задачу в один клик</h2></div>
          <div className="ss-qa">
            {QUICK.map(([h, d, ic, act], i) => (
              <div className="ss-card link reveal" key={i} onClick={act}>
                <div className="ss-ic"><SsIcon name={ic} /></div>
                <h4>{h}</h4><p>{d}</p>
                <span className="arr">Перейти <CoIcon name="arrow" size={14} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 3 — Сервисные услуги */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Услуги</span><h2 className="h-sec" style={{ marginTop: 14 }}>Наши сервисные услуги</h2></div>
          <div className="ss-svc">
            {SERVICES.map(([h, ic], i) => (
              <div className="ss-svc-i reveal" key={i}><div className="ss-ic"><SsIcon name={ic} /></div><h4>{h}</h4></div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 4 — Обслуживаемое оборудование */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Оборудование</span><h2 className="h-sec" style={{ marginTop: 14 }}>Обслуживаемое оборудование</h2></div>
          <div className="ss-eq">
            {equipment.map((it, i) => (
              <a className="ss-eq-c reveal" key={i} onClick={() => eqLink(it)}>
                {it.photo
                  ? <img className="ss-eq-img" src={it.photo} alt={it.name} loading="lazy" />
                  : <div className="ss-photo ss-eq-ph" data-label="Фото"><span className="ph-ic">{SsPhotoIcon}</span></div>}
                <span>{it.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Block 5 — Как мы работаем */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Процесс</span><h2 className="h-sec" style={{ marginTop: 14 }}>Как мы работаем</h2></div>
          <div className="ss-flow">
            {FLOW.map(([h, d], i) => (
              <div className="ss-flow-i reveal" key={i} onMouseEnter={() => setFlow(i)}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <h4>{h}</h4><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 6 — Почему выбирают нас */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Доверие</span><h2 className="h-sec" style={{ marginTop: 14 }}>Почему выбирают нас</h2></div>
          <div className="ss-grid ss-g4">
            {WHY.map(([h, ic], i) => (
              <div className="ss-card reveal" key={i}><div className="ss-ic"><SsIcon name={ic} /></div><h4 style={{ margin: 0 }}>{h}</h4></div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 7 — Сервисные контракты */}
      <section className="section alt" id="ss-contract">
        <div className="wrap">
          <div className="ss-contract reveal">
            <div>
              <h2>Сервисные контракты</h2>
              <p className="lead">Долгосрочное техническое сопровождение оборудования с плановым обслуживанием, профилактикой и приоритетным сервисом — минимум простоев и предсказуемые расходы.</p>
              <ul>
                {CONTRACT_BENEFITS.map((b, i) => (
                  <li key={i}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>{b}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div style={{ fontSize: 15, opacity: .9, marginBottom: 16 }}>Подберём условия под ваш парк оборудования и режим работы учреждения.</div>
              <button className="btn btn-lg" style={{ background: "#fff", color: "#0e4ac6", width: "100%", justifyContent: "center" }} onClick={() => { ssTrack("service_contract_cta"); ssScrollTo("ss-form"); }}>Получить коммерческое предложение</button>
            </div>
          </div>
        </div>
      </section>

      {/* Block 8 — Документация и база знаний */}
      <section className="section" id="ss-docs">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">База знаний</span><h2 className="h-sec" style={{ marginTop: 14 }}>Документация и база знаний</h2></div>
          <div className="ss-grid ss-g4">
            {docs.map((it, i) => (
              <div className="ss-card link reveal" key={i} onClick={() => {
                ssTrack("service_doc_click", { doc: it.title });
                const url = (it.url || "").trim();
                if (/^https?:\/\//.test(url)) window.open(url, "_blank", "noopener");
                else if (url.indexOf("#") === 0) location.hash = url.slice(1);
                else ssScrollTo("ss-form");
              }}>
                <div className="ss-ic"><SsIcon name={DOC_ICONS[i % DOC_ICONS.length]} /></div><h4 style={{ margin: 0 }}>{it.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 9 — Наши инженеры: сотрудники из админки «Команда» с флагом
          «Показывать на странице Сервис и поддержка»; без них — заглушки. */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Команда</span><h2 className="h-sec" style={{ marginTop: 14 }}>Наши инженеры</h2></div>
          <div className="ss-eng">
            {engineers.length > 0
              ? engineers.map((m) => (
                <div className="ss-eng-c reveal" key={m.id}>
                  {m.photo
                    ? <img className="ss-eng-img" src={m.photo} alt={m.name} loading="lazy" />
                    : <div className="ss-photo ss-eng-ph" data-label="Фото сотрудника"><span className="ph-ic">{SsPhotoIcon}</span></div>}
                  <div className="ss-eng-b">
                    <h4>{m.name}</h4>
                    <div className="role">{(m.role && (m.role.ru || m.role)) || "Сервисный инженер"}</div>
                  </div>
                </div>
              ))
              : ENGINEERS.map(([name, role, exp, chips], i) => (
                <div className="ss-eng-c reveal" key={i}>
                  <div className="ss-photo ss-eng-ph" data-label="Фото сотрудника"><span className="ph-ic">{SsPhotoIcon}</span></div>
                  <div className="ss-eng-b">
                    <h4>{name}</h4>
                    <div className="role">{role}</div>
                    <div className="exp">{exp}</div>
                    <div className="ss-chips">{chips.map((c, j) => <span className="ss-chip" key={j}>{c}</span>)}</div>
                  </div>
                </div>
              ))}
          </div>
          {engineers.length === 0 && <div className="ss-placeholder-note">Сотрудники добавляются в админ-панели «Команда» (флажок «Показывать на странице „Сервис и поддержка"»).</div>}
        </div>
      </section>

      {/* Block 10 — Отзывы клиентов: опубликованные отзывы из админки «Отзывы». */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Отзывы</span><h2 className="h-sec" style={{ marginTop: 14 }}>Отзывы клиентов</h2></div>
          <div className="ss-rev">
            {cmsReviews.length > 0
              ? cmsReviews.map((r) => {
                const org = typeof r.company === "string" ? r.company : ((r.company && r.company.ru) || "");
                const txt = typeof r.desc === "string" ? r.desc : ((r.desc && r.desc.ru) || "");
                const region = typeof r.region === "string" ? r.region : ((r.region && r.region.ru) || "");
                return (
                  <div className="ss-rev-c reveal" key={r.id}>
                    <div className="ss-rev-b" style={{ paddingTop: 20 }}>
                      {r.logo
                        ? <img className="ss-rev-logo-img" src={r.logo} alt={org} loading="lazy" />
                        : <div className="ss-photo ss-rev-logo" data-label=""><span className="ph-ic"><CoIcon name="building" size={16} /></span></div>}
                      <p>{txt}</p>
                      <div className="ss-rev-org">{org}{region ? " · " + region : ""}</div>
                    </div>
                  </div>
                );
              })
              : REVIEWS.map(([org, txt], i) => (
                <div className="ss-rev-c reveal" key={i}>
                  <div className="ss-photo ss-rev-obj" data-label="Фото объекта"><span className="ph-ic">{SsPhotoIcon}</span></div>
                  <div className="ss-rev-b">
                    <div className="ss-photo ss-rev-logo" data-label=""><span className="ph-ic"><CoIcon name="building" size={16} /></span></div>
                    <p>{txt}</p>
                    <div className="ss-rev-org">{org}</div>
                  </div>
                </div>
              ))}
          </div>
          {cmsReviews.length === 0 && <div className="ss-placeholder-note">Отзывы публикуются через админ-панель «Отзывы» (статус «Опубликовано»).</div>}
        </div>
      </section>

      {/* Block 11 — FAQ */}
      <section className="section alt">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="sec-head center reveal"><h2 className="h-sec">Часто задаваемые вопросы</h2></div>
          <div className="faq-list">
            {FAQ.map(([q, a], i) => (
              <div className={"faq-it reveal" + (faqOpen === i ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>{q}<CoIcon name="chev" size={17} /></button>
                {faqOpen === i && <div className="faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 12 — Форма сервисной заявки */}
      <section className="section" id="ss-form">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Заявка</span>
            <h2 className="h-sec">Форма сервисной заявки</h2>
            <p style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 600, margin: "12px auto 0", lineHeight: 1.6 }}>Опишите оборудование и неисправность — инженер сервисной службы свяжется с вами.</p>
          </div>
          <SsForm />
        </div>
      </section>

      {/* Block 13 — Контакты сервисной службы */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Контакты</span><h2 className="h-sec" style={{ marginTop: 14 }}>Контакты сервисной службы</h2></div>
          <div className="ss-contacts">
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="phone" size={18} /></div><div><h4>Телефон</h4><a href={"tel:" + String(contacts.phone || "").replace(/[^+\d]/g, "")}>{contacts.phone}</a></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="mail" size={18} /></div><div><h4>Email</h4><a href={"mailto:" + contacts.email}>{contacts.email}</a></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="pin" size={18} /></div><div><h4>Адрес</h4><div className="v">{contacts.address || "100069, Ташкент, Узбекистан"}</div></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="clock" size={18} /></div><div><h4>Режим работы</h4><div className="v">Пн–Пт, 9:00–18:00</div></div></div>
            {contacts.telegram && <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="globe" size={18} /></div><div><h4>Telegram</h4><a href={contacts.telegram} target="_blank" rel="noopener">{contacts.telegram.replace(/^https?:\/\//, "")}</a></div></div>}
            <div className="ss-contact-i urgent"><div className="ss-ic"><CoIcon name="phone" size={18} /></div><div><h4>Экстренная линия</h4><a href={"tel:" + String(contacts.phone || "").replace(/[^+\d]/g, "")}>{contacts.phone}</a></div></div>
          </div>
          <div className="ss-photo ss-map-ph" data-label="Карта — адрес сервисного центра"><span className="ph-ic"><CoIcon name="pin" size={26} /></span></div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className={"ss-sticky" + (sticky ? " show" : "")}>
        <button className="btn btn-pri btn-lg" onClick={() => { ssTrack("service_cta_click", { from: "sticky" }); ssScrollTo("ss-form"); }}>Подать заявку</button>
      </div>
    </div>
  );
}

window.ServiceSupportPage = ServiceSupportPage;
