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
.ss-badge{display:inline-flex;align-items:center;gap:7px;font-size:var(--fs-3);font-weight:600;color:var(--blue-700,var(--ink-soft));background:var(--blue-50,var(--blue-50));border:1px solid var(--blue-200,var(--line-soft));border-radius:var(--r-sm);padding:7px 13px}
.ss-photo{position:relative;border-radius:var(--r-lg);overflow:hidden;background:linear-gradient(135deg,var(--line-2),var(--line-soft));border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:#8ba7d4}
.ss-photo::after{content:attr(data-label);position:absolute;bottom:10px;left:12px;font-size:var(--fs-1);font-weight:600;color:#7d97c4;background:rgba(255,255,255,.7);padding:3px 8px;border-radius:var(--r-sm)}
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
.ss-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:22px;transition:transform .16s,box-shadow .16s,border-color .16s}
.ss-card.link{cursor:pointer}
.ss-card.link:hover{transform:translateY(-3px);box-shadow:var(--sh-lg);border-color:var(--blue-300,var(--line))}
.ss-ic{width:46px;height:46px;border-radius:var(--r);background:var(--blue-50,var(--blue-50));color:var(--blue-600);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.ss-card h4{font-size:var(--fs-5);font-weight:800;margin:0 0 6px;color:var(--ink)}
.ss-card p{font-size:var(--fs-3);color:var(--slate-500);line-height:1.5;margin:0}
.ss-card .arr{margin-top:12px;color:var(--blue-600);font-weight:700;font-size:var(--fs-3);display:inline-flex;align-items:center;gap:5px}
.ss-qa{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ss-svc{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.ss-svc-i{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px 16px;text-align:center}
.ss-svc-i .ss-ic{margin:0 auto 10px}
.ss-svc-i h4{font-size:var(--fs-3);font-weight:700;margin:0;color:var(--ink);line-height:1.3}
.ss-eq{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.ss-eq-c{border:1px solid var(--line);border-radius:var(--r);background:var(--surface);overflow:hidden;cursor:pointer;transition:.16s;text-decoration:none;display:block}
.ss-eq-c:hover{border-color:var(--blue-300,var(--line));box-shadow:var(--sh-lg);transform:translateY(-2px)}
.ss-eq-ph{aspect-ratio:16/10;width:100%}
.ss-eq-c span{display:block;padding:12px 14px;font-size:var(--fs-3);font-weight:700;color:var(--ink);line-height:1.3}
.ss-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.ss-flow-i{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px 16px}
.ss-flow-i .n{width:30px;height:30px;border-radius:var(--r-sm);background:var(--blue-600);color:#fff;font-size:var(--fs-3);font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.ss-flow-i h4{font-size:var(--fs-4);font-weight:800;margin:0 0 4px;color:var(--ink)}
.ss-flow-i p{font-size:var(--fs-2);color:var(--slate-500);margin:0;line-height:1.45}
.ss-contract{display:grid;grid-template-columns:1.1fr .9fr;gap:32px;align-items:center;background:linear-gradient(135deg,var(--blue-600),var(--blue-500));border-radius:var(--r-lg);padding:clamp(26px,4vw,40px);color:#fff}
.ss-contract h2{color:#fff;font-size:var(--fs-8);font-weight:800;margin:0 0 12px}
.ss-contract p.lead{opacity:.92;font-size:var(--fs-4);line-height:1.6;margin:0 0 20px}
.ss-contract ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.ss-contract li{display:flex;gap:10px;align-items:flex-start;font-size:var(--fs-4)}
.ss-contract li svg{flex-shrink:0;margin-top:2px}
.ss-contract .card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:var(--r-lg);padding:26px;text-align:center}
.ss-eng{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ss-eng-c{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden}
.ss-eng-ph{aspect-ratio:1/1;width:100%}
.ss-eng-b{padding:16px}
.ss-eng-b h4{font-size:var(--fs-4);font-weight:800;margin:0 0 3px;color:var(--ink)}
.ss-eng-b .role{font-size:var(--fs-2);color:var(--blue-600);font-weight:600;margin-bottom:8px}
.ss-eng-b .exp{font-size:var(--fs-2);color:var(--slate-500);margin-bottom:10px}
.ss-chips{display:flex;flex-wrap:wrap;gap:6px}
.ss-chip{font-size:var(--fs-1);font-weight:700;color:var(--slate-600);background:var(--bg-2,var(--bg-2));border:1px solid var(--line);border-radius:var(--r-lg);padding:3px 9px}
.ss-rev{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ss-rev-c{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;display:flex;flex-direction:column}
.ss-rev-obj{aspect-ratio:16/9;width:100%}
.ss-rev-b{padding:18px;flex:1;display:flex;flex-direction:column;gap:10px}
.ss-rev-logo{width:96px;height:30px;border-radius:var(--r-sm)}
.ss-rev-b p{font-size:var(--fs-3);color:var(--slate-600);line-height:1.55;margin:0;font-style:italic}
.ss-rev-org{font-size:var(--fs-2);color:var(--slate-500);font-weight:600;margin-top:auto}
.ss-placeholder-note{font-size:var(--fs-2);color:var(--slate-400);text-align:center;margin-top:14px}
.ss-legal{background:var(--blue-50,var(--blue-50));border:1px solid var(--blue-200,var(--line-soft));border-radius:var(--r);padding:20px 24px;display:flex;gap:14px;align-items:flex-start}
.ss-legal-ic{flex-shrink:0;width:32px;height:32px;border-radius:var(--r-sm);background:var(--blue-600);color:#fff;display:flex;align-items:center;justify-content:center}
.ss-contacts{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.ss-contact-i{display:flex;gap:14px;align-items:flex-start;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px}
.ss-contact-i .ss-ic{margin:0;flex-shrink:0;width:40px;height:40px}
.ss-contact-i h4{font-size:var(--fs-3);font-weight:800;margin:0 0 3px;color:var(--slate-500);text-transform:uppercase;letter-spacing:.02em}
.ss-contact-i a,.ss-contact-i div.v{font-size:var(--fs-4);color:var(--ink);font-weight:700;text-decoration:none}
.ss-contact-i.urgent{border-color:#f0b8ac;background:var(--bg-2)}
.ss-contact-i.urgent .ss-ic{background:#fdeae4;color:var(--danger)}
.ss-map-ph{aspect-ratio:21/6;width:100%;margin-top:16px;border-radius:var(--r)}
/* form */
.ss-form-wrap{max-width:840px;margin:0 auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(24px,4vw,40px);box-shadow:var(--sh-lg)}
.ss-fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.ss-field{display:flex;flex-direction:column;gap:6px}
.ss-field.full{grid-column:1/-1}
.ss-field label{font-size:var(--fs-3);font-weight:600;color:var(--slate-700)}
.ss-field label .req{color:var(--danger);margin-left:2px}
.ss-input,.ss-select,.ss-textarea{height:44px;border:1.5px solid var(--line);border-radius:var(--r-sm);padding:0 14px;font-size:var(--fs-4);font-family:inherit;background:var(--bg,var(--surface));color:var(--ink);outline:none;transition:border-color .16s;width:100%;box-sizing:border-box}
.ss-textarea{height:auto;padding:12px 14px;min-height:96px;resize:vertical}
.ss-input:focus,.ss-select:focus,.ss-textarea:focus{border-color:var(--blue-400,var(--blue-400))}
.ss-drop{display:block;border:1.5px dashed var(--blue-300,var(--line));border-radius:var(--r);padding:20px;text-align:center;cursor:pointer;transition:.16s;background:var(--bg-2,var(--bg-2))}
.ss-drop:hover{border-color:var(--blue-500,var(--blue-500));background:var(--blue-50,var(--blue-50))}
.ss-files{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.ss-file{display:flex;align-items:center;gap:10px;font-size:var(--fs-3);background:var(--bg-2,var(--bg-2));border:1px solid var(--line);border-radius:var(--r-sm);padding:9px 12px}
.ss-file .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ss-file button{border:none;background:none;color:var(--slate-400);cursor:pointer;flex-shrink:0}
.ss-check{display:flex;align-items:center;gap:9px;font-size:var(--fs-3);color:var(--slate-700);cursor:pointer;padding:6px 0}
.ss-check input{width:17px;height:17px;flex-shrink:0;accent-color:var(--blue-600)}
.ss-form-ok{text-align:center;padding:36px 20px}
.ss-form-ok .ic{width:64px;height:64px;border-radius:50%;background:rgba(14,74,198,.12);color:var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.ss-form-ok h3{font-size:var(--fs-6);font-weight:800;margin:0 0 8px}
.ss-form-ok p{font-size:var(--fs-4);color:var(--slate-600);max-width:440px;margin:0 auto;line-height:1.6}
/* sticky CTA */
.ss-sticky{position:fixed;right:22px;bottom:22px;z-index:60;box-shadow:var(--sh-lg);opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .22s,transform .22s}
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
        { "@type": "ListItem", position: 1, name: "Главная", item: base + "/" },
        { "@type": "ListItem", position: 2, name: "Услуги", item: base + "/services" },
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
function SsForm({ lang }) {
  const { useState } = React;
  const lv = (ru, uz, en) => (lang === "uz" ? uz : lang === "en" ? en : ru);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [files, setFiles] = useState([]);
  const [f, setF] = useState({ name: "", org: "", phone: "", email: "", eqType: "", maker: "", serial: "", issue: "", consent: false });
  const set = (k, v) => { ssTrack("service_form_start"); setF((s) => ({ ...s, [k]: v })); };

  const onFiles = (list) => {
    const allow = /\.(pdf|docx?|xlsx?|jpe?g|png)$/i;
    const add = [...list].filter((x) => allow.test(x.name) && x.size <= 20 * 1024 * 1024);
    if (add.length < list.length) setErr(lv("Файл не загружен. Проверьте формат и размер и попробуйте снова.", "Fayl yuklanmadi. Format va hajmni tekshirib, qayta urinib ko‘ring.", "File not uploaded. Check the format and size and try again."));
    setFiles((prev) => [...prev, ...add].slice(0, 5));
    if (add.length) ssTrack("service_file_upload");
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!f.name.trim() || !f.org.trim() || !f.phone.trim()) { setErr(lv("Заполните имя, организацию и телефон.", "Ism, tashkilot va telefonni to‘ldiring.", "Fill in name, organization and phone.")); ssTrack("service_form_error", { reason: "required" }); return; }
    if (!f.eqType.trim() && !f.issue.trim()) { setErr(lv("Укажите тип оборудования или опишите неисправность.", "Uskuna turini ko‘rsating yoki nosozlikni tavsiflang.", "Specify the equipment type or describe the fault.")); ssTrack("service_form_error", { reason: "no_device" }); return; }
    if (!f.consent) { setErr(lv("Необходимо согласие на обработку персональных данных.", "Shaxsiy ma’lumotlarni qayta ishlashga rozilik kerak.", "Consent to personal data processing is required.")); ssTrack("service_form_error", { reason: "no_consent" }); return; }
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
      setErr(lv("Не удалось отправить заявку. Данные сохранены в форме. Попробуйте снова или свяжитесь с нами по телефону.", "So‘rovni yuborib bo‘lmadi. Ma’lumotlar formada saqlangan. Qayta urinib ko‘ring yoki telefon orqali bog‘laning.", "Could not send the request. Your data is kept in the form. Try again or contact us by phone."));
      ssTrack("service_form_error", { reason: "submit_failed" });
    } finally { setSending(false); }
  };

  if (sent) return (
    <div className="ss-form-wrap">
      <div className="ss-form-ok">
        <div className="ic"><CoIcon name="check" size={30} /></div>
        <h3>{lv("Заявка отправлена", "So‘rov yuborildi", "Request sent")}</h3>
        <p>{lv("Спасибо! Сервисная заявка принята. Инженер свяжется с вами для уточнения оборудования, характера неисправности и сроков выезда.", "Rahmat! Servis so‘rovi qabul qilindi. Muhandis uskuna, nosozlik xarakteri va tashrif muddatlarini aniqlashtirish uchun siz bilan bog‘lanadi.", "Thank you! The service request has been received. An engineer will contact you to clarify the equipment, the nature of the fault and visit timing.")}</p>
      </div>
    </div>
  );

  return (
    <form className="ss-form-wrap" onSubmit={submit} noValidate>
      <div className="ss-fgrid">
        <div className="ss-field"><label>{lv("Имя", "Ism", "Name")}<span className="req">*</span></label><input className="ss-input" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="ss-field"><label>{lv("Организация", "Tashkilot", "Organization")}<span className="req">*</span></label><input className="ss-input" value={f.org} onChange={(e) => set("org", e.target.value)} /></div>
        <div className="ss-field"><label>{lv("Телефон", "Telefon", "Phone")}<span className="req">*</span></label><input className="ss-input" type="tel" placeholder="+998 __ ___ __ __" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div className="ss-field"><label>Email</label><input className="ss-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div className="ss-field"><label>{lv("Тип оборудования", "Uskuna turi", "Equipment type")}</label><input className="ss-input" value={f.eqType} onChange={(e) => set("eqType", e.target.value)} placeholder={lv("УЗИ, рентген, лаборатория…", "UZI, rentgen, laboratoriya…", "Ultrasound, X-ray, lab…")} /></div>
        <div className="ss-field"><label>{lv("Производитель", "Ishlab chiqaruvchi", "Manufacturer")}</label><input className="ss-input" value={f.maker} onChange={(e) => set("maker", e.target.value)} /></div>
        <div className="ss-field full"><label>{lv("Серийный номер", "Seriya raqami", "Serial number")}</label><input className="ss-input" value={f.serial} onChange={(e) => set("serial", e.target.value)} /></div>
        <div className="ss-field full"><label>{lv("Описание неисправности", "Nosozlik tavsifi", "Fault description")}</label><textarea className="ss-textarea" rows={4} value={f.issue} onChange={(e) => set("issue", e.target.value)} placeholder={lv("Что произошло, когда, при каких условиях…", "Nima, qachon, qanday sharoitda sodir bo‘ldi…", "What happened, when, under what conditions…")} /></div>
      </div>
      <div style={{ margin: "16px 0" }}>
        <label className="ss-drop" htmlFor="ss-file-inp">
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{lv("Прикрепить файл (фото шильдика, документы, лог ошибок)", "Fayl biriktirish (shildik fotosi, hujjatlar, xatolik loglari)", "Attach a file (nameplate photo, documents, error logs)")}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--slate-500)" }}>{lv("PDF, DOC, DOCX, XLS, XLSX, JPG, PNG · до 20 МБ · до 5 файлов", "PDF, DOC, DOCX, XLS, XLSX, JPG, PNG · 20 MB gacha · 5 tagacha fayl", "PDF, DOC, DOCX, XLS, XLSX, JPG, PNG · up to 20 MB · up to 5 files")}</div>
        </label>
        <input id="ss-file-inp" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        {files.length > 0 && (
          <div className="ss-files">
            {files.map((file, i) => (
              <div className="ss-file" key={i}>
                <CoIcon name="doc" size={15} /><span className="nm">{file.name}</span>
                <span style={{ color: "var(--slate-400)", fontSize: 12 }}>{Math.round(file.size / 1024)} KB</span>
                <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} aria-label={lv("Убрать", "Olib tashlash", "Remove")}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <label className="ss-check"><input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />{lv("Согласен с политикой конфиденциальности и обработкой персональных данных", "Maxfiylik siyosati va shaxsiy ma’lumotlarni qayta ishlashga roziman", "I agree to the privacy policy and personal data processing")}<span className="req">*</span></label>
      {err && <div style={{ color: "var(--danger)", fontSize: 13.5, margin: "10px 0", fontWeight: 600 }}>{err}</div>}
      <button className="btn btn-pri btn-lg" type="submit" disabled={sending} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
        {sending ? lv("Отправка…", "Yuborilmoqda…", "Sending…") : lv("Отправить заявку", "So‘rovni yuborish", "Send request")}
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
  const lv = (ru, uz, en) => (lang === "uz" ? uz : lang === "en" ? en : ru);

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
    [lv("Подать сервисную заявку", "Servis so‘rovini yuborish", "Submit a service request"), lv("Опишите оборудование и неисправность — инженер свяжется с вами.", "Uskuna va nosozlikni tavsiflang — muhandis siz bilan bog‘lanadi.", "Describe the equipment and fault — an engineer will contact you."), "clipboard", () => ssScrollTo("ss-form")],
    [lv("Вызвать инженера", "Muhandis chaqirish", "Call an engineer"), lv("Выезд специалиста на объект для диагностики и ремонта.", "Diagnostika va ta’mirlash uchun mutaxassisning obyektga tashrifi.", "A specialist visits your site for diagnostics and repair."), "boot", () => ssScrollTo("ss-form")],
    [lv("Получить консультацию", "Konsultatsiya olish", "Get a consultation"), lv("Ответим на технические вопросы по эксплуатации и сервису.", "Foydalanish va servis bo‘yicha texnik savollarga javob beramiz.", "We answer technical questions about operation and service."), "headset", () => (window.__openQuote ? window.__openQuote() : ssScrollTo("ss-form"))],
    [lv("Заказать ТО", "Texnik xizmat buyurtma qilish", "Order maintenance"), lv("Плановое техническое обслуживание оборудования.", "Uskunaning rejali texnik xizmati.", "Planned technical maintenance of equipment."), "calendar", () => ssScrollTo("ss-form")],
    [lv("Скачать документацию", "Hujjatlarni yuklab olish", "Download documentation"), lv("Руководства, инструкции и сервисные материалы.", "Qo‘llanmalar, ko‘rsatmalar va servis materiallari.", "Manuals, instructions and service materials."), "download", () => ssScrollTo("ss-docs")],
    [lv("Заключить сервисный договор", "Servis shartnomasini tuzish", "Sign a service contract"), lv("Долгосрочное сопровождение с приоритетным сервисом.", "Ustuvor servis bilan uzoq muddatli hamrohlik.", "Long-term support with priority service."), "shield", () => ssScrollTo("ss-contract")],
  ];
  const SERVICES = [
    [lv("Монтаж оборудования", "Uskuna montaji", "Equipment installation"), "building"], [lv("Ввод в эксплуатацию", "Ishga tushirish", "Commissioning"), "boot"], [lv("Гарантийное обслуживание", "Kafolat xizmati", "Warranty service"), "shield"],
    [lv("Постгарантийное обслуживание", "Kafolatdan keyingi xizmat", "Post-warranty service"), "clock"], [lv("Диагностика", "Diagnostika", "Diagnostics"), "gauge"], [lv("Ремонт", "Ta’mirlash", "Repair"), "wrench"],
    [lv("Калибровка", "Kalibrlash", "Calibration"), "tools"], [lv("Обновление ПО", "Dasturiy ta’minotni yangilash", "Software update"), "chip"], [lv("Обучение персонала", "Xodimlarni o‘qitish", "Staff training"), "users"], [lv("Консультации специалистов", "Mutaxassislar konsultatsiyasi", "Specialist consultations"), "headset"],
  ];
  // Блоки 1/4/8 редактируются через админку «Сервис и поддержка» (settings), блоки
  // 9/10 — через админки «Команда» и «Отзывы» (коллекции). Дефолты ниже показываются,
  // пока в админке ничего не сохранено.
  const heroMedia = useSsSetting("service_hero", null) || {};
  const hasHeroMedia = !!heroMedia.url;
  const EQUIPMENT_DEFAULTS = [
    lv("Ультразвуковые системы", "Ultratovush tizimlari", "Ultrasound systems"),
    lv("Рентгеновское оборудование", "Rentgen uskunalari", "X-ray equipment"),
    lv("Компьютерные томографы", "Kompyuter tomograflar", "CT scanners"),
    lv("Магнитно-резонансные томографы", "Magnit-rezonans tomograflar", "MRI scanners"),
    lv("Маммографы", "Mammograflar", "Mammographs"),
    lv("Эндоскопическое оборудование", "Endoskopik uskunalar", "Endoscopic equipment"),
    lv("Лабораторное оборудование", "Laboratoriya uskunalari", "Laboratory equipment"),
    lv("Офтальмология", "Oftalmologiya", "Ophthalmology"),
    lv("Реанимационное оборудование", "Reanimatsiya uskunalari", "Resuscitation equipment"),
    lv("Стоматологическое оборудование", "Stomatologiya uskunalari", "Dental equipment"),
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
    [lv("Получение заявки", "So‘rovni qabul qilish", "Receiving the request"), lv("Принимаем обращение по телефону, email или через форму.", "Murojaatni telefon, email yoki forma orqali qabul qilamiz.", "We accept the request by phone, email or via the form.")],
    [lv("Анализ обращения", "Murojaatni tahlil qilish", "Request analysis"), lv("Уточняем оборудование, характер проблемы и приоритет.", "Uskuna, muammo xarakteri va ustuvorlikni aniqlaymiz.", "We clarify the equipment, nature of the problem and priority.")],
    [lv("Связь с заказчиком", "Buyurtmachi bilan bog‘lanish", "Contacting the client"), lv("Согласуем детали, доступ на объект и удобное время.", "Tafsilotlar, obyektga kirish va qulay vaqtni kelishamiz.", "We agree on details, site access and a convenient time.")],
    [lv("Диагностика", "Diagnostika", "Diagnostics"), lv("Определяем причину неисправности и объём работ.", "Nosozlik sababi va ishlar hajmini aniqlaymiz.", "We determine the cause of the fault and the scope of work.")],
    [lv("Выезд инженера", "Muhandis tashrifi", "Engineer visit"), lv("Сертифицированный специалист выезжает на объект.", "Sertifikatlangan mutaxassis obyektga chiqadi.", "A certified specialist visits the site.")],
    [lv("Выполнение работ", "Ishlarni bajarish", "Performing the work"), lv("Ремонт, настройка, замена узлов оригинальными запчастями.", "Ta’mirlash, sozlash, tugunlarni original ehtiyot qismlar bilan almashtirish.", "Repair, adjustment, replacing units with original spare parts.")],
    [lv("Проверка оборудования", "Uskunani tekshirish", "Equipment check"), lv("Тестируем работоспособность и параметры.", "Ishlash qobiliyati va parametrlarni sinaymiz.", "We test operability and parameters.")],
    [lv("Передача оборудования", "Uskunani topshirish", "Handover"), lv("Сдаём оборудование и передаём отчёт о работах.", "Uskunani topshiramiz va ishlar hisobotini beramiz.", "We hand over the equipment and provide a work report.")],
  ];
  const WHY = [
    [lv("Сертифицированные инженеры", "Sertifikatlangan muhandislar", "Certified engineers"), "award"], [lv("Собственный сервисный центр", "O‘z servis markazi", "Own service center"), "building"], [lv("Оригинальные запасные части", "Original ehtiyot qismlar", "Original spare parts"), "shield"],
    [lv("Оперативный выезд", "Tezkor tashrif", "Prompt on-site visits"), "boot"], [lv("Поддержка по всему Узбекистану", "Butun O‘zbekiston bo‘ylab qo‘llab-quvvatlash", "Support across Uzbekistan"), "globe"], [lv("Гарантия на работы", "Ishlarga kafolat", "Warranty on work"), "check"],
    [lv("Современное диагностическое оборудование", "Zamonaviy diagnostika uskunalari", "Modern diagnostic equipment"), "gauge"], [lv("Индивидуальный подход", "Individual yondashuv", "Individual approach"), "users"],
  ];
  const CONTRACT_BENEFITS = [
    lv("Плановое техническое обслуживание", "Rejali texnik xizmat", "Planned maintenance"), lv("Профилактические осмотры", "Profilaktik ko‘riklar", "Preventive inspections"), lv("Приоритетное обслуживание", "Ustuvor xizmat", "Priority service"),
    lv("Персональный инженер", "Shaxsiy muhandis", "Personal engineer"), lv("Снижение простоев оборудования", "Uskuna to‘xtab qolishini kamaytirish", "Reduced equipment downtime"), lv("Контроль технического состояния", "Texnik holat nazorati", "Technical condition monitoring"),
  ];
  const DOC_ICONS = ["doc", "clipboard", "award", "doc", "chip", "headset", "star"];
  const DOCS_DEFAULTS = [
    lv("Руководства пользователя", "Foydalanuvchi qo‘llanmalari", "User manuals"), lv("Каталоги", "Kataloglar", "Catalogs"), lv("Сертификаты", "Sertifikatlar", "Certificates"), lv("Инструкции", "Ko‘rsatmalar", "Instructions"),
    lv("Программное обеспечение", "Dasturiy ta’minot", "Software"), lv("Часто задаваемые вопросы", "Tez-tez so‘raladigan savollar", "FAQ"), lv("Полезные статьи", "Foydali maqolalar", "Useful articles"),
  ].map((title) => ({ title, url: "" }));
  const docs = (docsSetting && Array.isArray(docsSetting.items)) ? docsSetting.items : DOCS_DEFAULTS;
  // Placeholder engineers/reviews — generic (no fabricated real people/clients); to be filled via admin later.
  const ENGINEERS = [
    [lv("Сервисный инженер", "Servis muhandisi", "Service engineer"), lv("Диагностика и ремонт", "Diagnostika va ta’mirlash", "Diagnostics and repair"), lv("Опыт: 8+ лет", "Tajriba: 8+ yil", "Experience: 8+ years"), [lv("Ультразвук", "Ultratovush", "Ultrasound"), lv("Рентген", "Rentgen", "X-ray")]],
    [lv("Сервисный инженер", "Servis muhandisi", "Service engineer"), lv("Лабораторное оборудование", "Laboratoriya uskunalari", "Laboratory equipment"), lv("Опыт: 6+ лет", "Tajriba: 6+ yil", "Experience: 6+ years"), [lv("Анализаторы", "Analizatorlar", "Analyzers"), lv("Центрифуги", "Sentrifugalar", "Centrifuges")]],
    [lv("Инженер-электроник", "Elektronika muhandisi", "Electronics engineer"), lv("Монтаж и пусконаладка", "Montaj va ishga tushirish", "Installation and commissioning"), lv("Опыт: 10+ лет", "Tajriba: 10+ yil", "Experience: 10+ years"), [lv("КТ / МРТ", "KT / MRT", "CT / MRI"), lv("Мониторинг", "Monitoring", "Monitoring")]],
    [lv("Инженер по ПО", "Dasturiy ta’minot muhandisi", "Software engineer"), lv("Настройка и обновления", "Sozlash va yangilanishlar", "Setup and updates"), lv("Опыт: 5+ лет", "Tajriba: 5+ yil", "Experience: 5+ years"), [lv("Системы", "Tizimlar", "Systems"), lv("Калибровка", "Kalibrlash", "Calibration")]],
  ];
  const REVIEWS = [
    [lv("Медицинское учреждение", "Tibbiyot muassasasi", "Medical institution"), lv("Отзыв клиента появится здесь после публикации в админ-панели.", "Mijoz sharhi admin-panelda chop etilgandan so‘ng shu yerda paydo bo‘ladi.", "A client review will appear here once published in the admin panel.")],
    [lv("Диагностический центр", "Diagnostika markazi", "Diagnostic center"), lv("Отзыв клиента появится здесь после публикации в админ-панели.", "Mijoz sharhi admin-panelda chop etilgandan so‘ng shu yerda paydo bo‘ladi.", "A client review will appear here once published in the admin panel.")],
    [lv("Частная клиника", "Xususiy klinika", "Private clinic"), lv("Отзыв клиента появится здесь после публикации в админ-панели.", "Mijoz sharhi admin-panelda chop etilgandan so‘ng shu yerda paydo bo‘ladi.", "A client review will appear here once published in the admin panel.")],
  ];
  const FAQ = [
    [lv("Как оформить сервисную заявку?", "Servis so‘rovini qanday rasmiylashtirish mumkin?", "How do I submit a service request?"), lv("Заполните форму на этой странице, позвоните по сервисному телефону или напишите на email. Укажите оборудование, производителя и характер неисправности.", "Ushbu sahifadagi formani to‘ldiring, servis telefoniga qo‘ng‘iroq qiling yoki emailga yozing. Uskuna, ishlab chiqaruvchi va nosozlik xarakterini ko‘rsating.", "Fill in the form on this page, call the service phone or write to the email. Provide the equipment, manufacturer and the nature of the fault.")],
    [lv("Какие регионы обслуживаются?", "Qaysi hududlarga xizmat ko‘rsatiladi?", "Which regions are served?"), lv("Сервисная поддержка доступна по всей территории Узбекистана. Сроки выезда зависят от региона и приоритета обращения.", "Servis qo‘llab-quvvatlashi O‘zbekistonning butun hududida mavjud. Tashrif muddatlari hudud va murojaat ustuvorligiga bog‘liq.", "Service support is available throughout Uzbekistan. Visit timing depends on the region and the request priority.")],
    [lv("Как вызвать инженера на объект?", "Muhandisni obyektga qanday chaqirish mumkin?", "How do I call an engineer to the site?"), lv("Оформите заявку с пометкой о необходимости выезда. После анализа обращения и согласования времени инженер выезжает на объект.", "So‘rovni tashrif zarurligi belgisi bilan rasmiylashtiring. Murojaat tahlil qilinib, vaqt kelishilgandan so‘ng muhandis obyektga chiqadi.", "Submit a request marked as needing an on-site visit. After the request is reviewed and a time agreed, an engineer visits the site.")],
    [lv("Как проходит гарантийное обслуживание?", "Kafolat xizmati qanday amalga oshiriladi?", "How does warranty service work?"), lv("В течение гарантийного срока диагностика и устранение заводских неисправностей выполняются на условиях гарантии производителя.", "Kafolat muddati davomida diagnostika va zavod nosozliklarini bartaraf etish ishlab chiqaruvchi kafolati shartlari asosida bajariladi.", "During the warranty period, diagnostics and fixing factory faults are done under the manufacturer’s warranty terms.")],
    [lv("Можно ли заключить сервисный договор?", "Servis shartnomasini tuzish mumkinmi?", "Can I sign a service contract?"), lv("Да. Сервисный договор включает плановое ТО, профилактику, приоритетное обслуживание и персонального инженера — оставьте запрос на коммерческое предложение.", "Ha. Servis shartnomasi rejali texnik xizmat, profilaktika, ustuvor xizmat va shaxsiy muhandisni o‘z ichiga oladi — tijorat taklifi uchun so‘rov qoldiring.", "Yes. A service contract includes planned maintenance, prevention, priority service and a personal engineer — leave a request for a commercial proposal.")],
    [lv("Как заказать запасные части?", "Ehtiyot qismlarni qanday buyurtma qilish mumkin?", "How do I order spare parts?"), lv("Укажите модель и серийный номер оборудования в заявке — подберём оригинальные запчасти и сроки поставки.", "So‘rovda uskuna modeli va seriya raqamini ko‘rsating — original ehtiyot qismlar va yetkazib berish muddatlarini tanlaymiz.", "Provide the model and serial number in the request — we will select original parts and delivery times.")],
    [lv("Работаете ли с оборудованием, купленным не у вас?", "Sizdan sotib olinmagan uskuna bilan ishlaysizmi?", "Do you work with equipment not bought from you?"), lv("Да, возможность обслуживания рассматривается после анализа модели, документации и технического состояния.", "Ha, xizmat ko‘rsatish imkoniyati model, hujjatlar va texnik holat tahlil qilingandan so‘ng ko‘rib chiqiladi.", "Yes, the possibility of service is considered after analyzing the model, documentation and technical condition.")],
    [lv("Есть ли экстренная поддержка?", "Shoshilinch qo‘llab-quvvatlash bormi?", "Is there emergency support?"), lv("Для критичного оборудования предусмотрено приоритетное обслуживание; условия фиксируются в сервисном договоре.", "Muhim uskunalar uchun ustuvor xizmat ko‘zda tutilgan; shartlar servis shartnomasida qayd etiladi.", "Priority service is provided for critical equipment; the terms are fixed in the service contract.")],
    [lv("Какие документы получает клиент после работ?", "Ishlardan so‘ng mijoz qanday hujjatlarni oladi?", "What documents does the client get after the work?"), lv("Отчёт о выполненных работах, при необходимости — акты, рекомендации по эксплуатации и гарантию на выполненные работы.", "Bajarilgan ishlar hisoboti, zarur bo‘lsa — dalolatnomalar, foydalanish bo‘yicha tavsiyalar va bajarilgan ishlarga kafolat.", "A report of completed work and, if needed, acts, operating recommendations and a warranty on the work performed.")],
    [lv("Проводится ли обучение персонала?", "Xodimlar o‘qitiladimi?", "Do you provide staff training?"), lv("Да, инструктаж по эксплуатации оборудования проводится в рамках ввода в эксплуатацию и как отдельная услуга.", "Ha, uskunadan foydalanish bo‘yicha instruktaj ishga tushirish doirasida va alohida xizmat sifatida o‘tkaziladi.", "Yes, operation briefing is provided as part of commissioning and as a separate service.")],
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
              <div className="ss-badges reveal"><span className="ss-badge"><CoIcon name="shield" size={14} />{lv("Полный цикл сопровождения", "To‘liq hamrohlik sikli", "Full support cycle")}</span></div>
              <h1 style={{ maxWidth: 620 }}>{lv("Сервис и поддержка медицинского оборудования", "Tibbiy uskunalar servisi va qo‘llab-quvvatlash", "Medical equipment service and support")}</h1>
              <p style={{ maxWidth: 640, marginTop: 16 }}>{lv("Полный цикл технического сопровождения медицинского оборудования — от ввода в эксплуатацию до модернизации и долгосрочного сервисного обслуживания.", "Tibbiy uskunalarni to‘liq texnik hamrohlik qilish — ishga tushirishdan modernizatsiya va uzoq muddatli servis xizmatigacha.", "Full technical support of medical equipment — from commissioning to modernization and long-term service.")}</p>
              <div className="hero-actions" style={{ marginTop: 26 }}>
                <button className="btn btn-pri btn-lg" onClick={() => { ssTrack("service_cta_click"); ssScrollTo("ss-form"); }}>{lv("Подать сервисную заявку", "Servis so‘rovini yuborish", "Submit a service request")}</button>
                <button className="btn btn-ghost btn-lg" onClick={() => { ssTrack("service_consult_click"); window.__openQuote ? window.__openQuote() : ssScrollTo("ss-form"); }}>{lv("Получить консультацию", "Konsultatsiya olish", "Get a consultation")}</button>
              </div>
            </div>
            {!hasHeroMedia && <div className="ss-photo ss-hero-photo reveal" data-label={lv("Фото: инженер у оборудования", "Foto: uskuna yonidagi muhandis", "Photo: engineer by the equipment")}><span className="ph-ic">{SsPhotoIcon}</span></div>}
          </div>
        </div>
      </section>

      {/* Block 2 — Быстрые действия */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Быстрые действия", "Tezkor amallar", "Quick actions")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Решите задачу в один клик", "Vazifani bir marta bosishda hal qiling", "Solve your task in one click")}</h2></div>
          <div className="ss-qa">
            {QUICK.map(([h, d, ic, act], i) => (
              <div className="ss-card link reveal" key={i} onClick={act}>
                <div className="ss-ic"><SsIcon name={ic} /></div>
                <h4>{h}</h4><p>{d}</p>
                <span className="arr">{lv("Перейти", "O‘tish", "Open")} <CoIcon name="arrow" size={14} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 3 — Сервисные услуги */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Услуги", "Xizmatlar", "Services")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Наши сервисные услуги", "Bizning servis xizmatlarimiz", "Our service offerings")}</h2></div>
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
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Оборудование", "Uskunalar", "Equipment")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Обслуживаемое оборудование", "Xizmat ko‘rsatiladigan uskunalar", "Serviced equipment")}</h2></div>
          <div className="ss-eq">
            {equipment.map((it, i) => (
              <a className="ss-eq-c reveal" key={i} onClick={() => eqLink(it)}>
                {it.photo
                  ? <img className="ss-eq-img" src={it.photo} alt={it.name} loading="lazy" />
                  : <div className="ss-photo ss-eq-ph" data-label={lv("Фото", "Foto", "Photo")}><span className="ph-ic">{SsPhotoIcon}</span></div>}
                <span>{it.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Block 5 — Как мы работаем */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Процесс", "Jarayon", "Process")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Как мы работаем", "Biz qanday ishlaymiz", "How we work")}</h2></div>
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
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Доверие", "Ishonch", "Trust")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Почему выбирают нас", "Nega bizni tanlashadi", "Why choose us")}</h2></div>
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
              <h2>{lv("Сервисные контракты", "Servis shartnomalari", "Service contracts")}</h2>
              <p className="lead">{lv("Долгосрочное техническое сопровождение оборудования с плановым обслуживанием, профилактикой и приоритетным сервисом — минимум простоев и предсказуемые расходы.", "Uskunaning rejali xizmat, profilaktika va ustuvor servis bilan uzoq muddatli texnik hamrohligi — minimal to‘xtab qolish va oldindan aniq xarajatlar.", "Long-term technical support with planned maintenance, prevention and priority service — minimal downtime and predictable costs.")}</p>
              <ul>
                {CONTRACT_BENEFITS.map((b, i) => (
                  <li key={i}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>{b}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div style={{ fontSize: 15, opacity: .9, marginBottom: 16 }}>{lv("Подберём условия под ваш парк оборудования и режим работы учреждения.", "Uskunalar parki va muassasa ish rejimiga mos shartlarni tanlaymiz.", "We tailor terms to your equipment fleet and the institution’s working hours.")}</div>
              <button className="btn btn-lg" style={{ background: "#fff", color: "var(--blue-600)", width: "100%", justifyContent: "center" }} onClick={() => { ssTrack("service_contract_cta"); ssScrollTo("ss-form"); }}>{lv("Получить коммерческое предложение", "Tijorat taklifini olish", "Get a commercial proposal")}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Block 8 — Документация и база знаний */}
      <section className="section" id="ss-docs">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("База знаний", "Bilimlar bazasi", "Knowledge base")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Документация и база знаний", "Hujjatlar va bilimlar bazasi", "Documentation and knowledge base")}</h2></div>
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
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Команда", "Jamoa", "Team")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Наши инженеры", "Bizning muhandislar", "Our engineers")}</h2></div>
          <div className="ss-eng">
            {engineers.length > 0
              ? engineers.map((m) => (
                <div className="ss-eng-c reveal" key={m.id}>
                  {m.photo
                    ? <img className="ss-eng-img" src={m.photo} alt={m.name} loading="lazy" />
                    : <div className="ss-photo ss-eng-ph" data-label={lv("Фото сотрудника", "Xodim fotosi", "Staff photo")}><span className="ph-ic">{SsPhotoIcon}</span></div>}
                  <div className="ss-eng-b">
                    <h4>{m.name}</h4>
                    <div className="role">{(m.role && (m.role[lang] || m.role.ru || m.role)) || lv("Сервисный инженер", "Servis muhandisi", "Service engineer")}</div>
                  </div>
                </div>
              ))
              : ENGINEERS.map(([name, role, exp, chips], i) => (
                <div className="ss-eng-c reveal" key={i}>
                  <div className="ss-photo ss-eng-ph" data-label={lv("Фото сотрудника", "Xodim fotosi", "Staff photo")}><span className="ph-ic">{SsPhotoIcon}</span></div>
                  <div className="ss-eng-b">
                    <h4>{name}</h4>
                    <div className="role">{role}</div>
                    <div className="exp">{exp}</div>
                    <div className="ss-chips">{chips.map((c, j) => <span className="ss-chip" key={j}>{c}</span>)}</div>
                  </div>
                </div>
              ))}
          </div>
          {engineers.length === 0 && <div className="ss-placeholder-note">{lv("Сотрудники добавляются в админ-панели «Команда» (флажок «Показывать на странице Сервис и поддержка»).", "Xodimlar «Jamoa» admin-panelida qo‘shiladi («Servis va qo‘llab-quvvatlash sahifasida ko‘rsatish» belgisi).", "Staff are added in the “Team” admin panel (the “Show on the Service & support page” checkbox).")}</div>}
        </div>
      </section>

      {/* Block 10 — Отзывы клиентов: опубликованные отзывы из админки «Отзывы». */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Отзывы", "Sharhlar", "Reviews")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Отзывы клиентов", "Mijozlar sharhlari", "Client reviews")}</h2></div>
          <div className="ss-rev">
            {cmsReviews.length > 0
              ? cmsReviews.map((r) => {
                const pick = (v) => (typeof v === "string" ? v : (v && (v[lang] || v.ru)) || "");
                const org = pick(r.company);
                const txt = pick(r.desc);
                const region = pick(r.region);
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
                  <div className="ss-photo ss-rev-obj" data-label={lv("Фото объекта", "Obyekt fotosi", "Site photo")}><span className="ph-ic">{SsPhotoIcon}</span></div>
                  <div className="ss-rev-b">
                    <div className="ss-photo ss-rev-logo" data-label=""><span className="ph-ic"><CoIcon name="building" size={16} /></span></div>
                    <p>{txt}</p>
                    <div className="ss-rev-org">{org}</div>
                  </div>
                </div>
              ))}
          </div>
          {cmsReviews.length === 0 && <div className="ss-placeholder-note">{lv("Отзывы публикуются через админ-панель «Отзывы» (статус «Опубликовано»).", "Sharhlar «Sharhlar» admin-paneli orqali chop etiladi («Chop etilgan» holati).", "Reviews are published via the “Reviews” admin panel (status “Published”).")}</div>}
        </div>
      </section>

      {/* Block 11 — FAQ */}
      <section className="section alt">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="sec-head center reveal"><h2 className="h-sec">{lv("Часто задаваемые вопросы", "Tez-tez so‘raladigan savollar", "Frequently asked questions")}</h2></div>
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
            <span className="eyebrow">{lv("Заявка", "So‘rov", "Request")}</span>
            <h2 className="h-sec">{lv("Форма сервисной заявки", "Servis so‘rovi formasi", "Service request form")}</h2>
            <p style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 600, margin: "12px auto 0", lineHeight: 1.6 }}>{lv("Опишите оборудование и неисправность — инженер сервисной службы свяжется с вами.", "Uskuna va nosozlikni tavsiflang — servis xizmati muhandisi siz bilan bog‘lanadi.", "Describe the equipment and fault — a service engineer will contact you.")}</p>
          </div>
          <SsForm lang={lang} />
        </div>
      </section>

      {/* Block 13 — Контакты сервисной службы */}
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">{lv("Контакты", "Kontaktlar", "Contacts")}</span><h2 className="h-sec" style={{ marginTop: 14 }}>{lv("Контакты сервисной службы", "Servis xizmati kontaktlari", "Service team contacts")}</h2></div>
          <div className="ss-contacts">
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="phone" size={18} /></div><div><h4>{lv("Телефон", "Telefon", "Phone")}</h4><a href={"tel:" + String(contacts.phone || "").replace(/[^+\d]/g, "")}>{contacts.phone}</a></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="mail" size={18} /></div><div><h4>Email</h4><a href={"mailto:" + contacts.email}>{contacts.email}</a></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="pin" size={18} /></div><div><h4>{lv("Адрес", "Manzil", "Address")}</h4><div className="v">{contacts.address || lv("100069, Ташкент, Узбекистан", "100069, Toshkent, O‘zbekiston", "100069, Tashkent, Uzbekistan")}</div></div></div>
            <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="clock" size={18} /></div><div><h4>{lv("Режим работы", "Ish rejimi", "Working hours")}</h4><div className="v">{lv("Пн–Пт, 9:00–18:00", "Du–Ju, 9:00–18:00", "Mon–Fri, 9:00–18:00")}</div></div></div>
            {contacts.telegram && <div className="ss-contact-i"><div className="ss-ic"><CoIcon name="globe" size={18} /></div><div><h4>Telegram</h4><a href={contacts.telegram} target="_blank" rel="noopener">{contacts.telegram.replace(/^https?:\/\//, "")}</a></div></div>}
            <div className="ss-contact-i urgent"><div className="ss-ic"><CoIcon name="phone" size={18} /></div><div><h4>{lv("Экстренная линия", "Shoshilinch liniya", "Emergency line")}</h4><a href={"tel:" + String(contacts.phone || "").replace(/[^+\d]/g, "")}>{contacts.phone}</a></div></div>
          </div>
          <div className="ss-photo ss-map-ph" data-label={lv("Карта — адрес сервисного центра", "Xarita — servis markazi manzili", "Map — service center address")}><span className="ph-ic"><CoIcon name="pin" size={26} /></span></div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className={"ss-sticky" + (sticky ? " show" : "")}>
        <button className="btn btn-pri btn-lg" onClick={() => { ssTrack("service_cta_click", { from: "sticky" }); ssScrollTo("ss-form"); }}>{lv("Подать заявку", "So‘rov yuborish", "Submit a request")}</button>
      </div>
    </div>
  );
}

window.ServiceSupportPage = ServiceSupportPage;
