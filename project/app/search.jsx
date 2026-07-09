/* ИНДУСТРИЯ ЗДОРОВЬЯ — Регистрация медицинских изделий в Узбекистане (экспертная посадочная)
   ТЗ: ПКМ РУз №738 от 24.11.2025. RU-версия (uz/en показывают русский текст — переводы позже). */

/* ── page CSS (rmd-*) ─────────────────────────────────────── */
function useRmdCss() {
  React.useEffect(() => {
    const ID = "rmd-css";
    if (document.getElementById(ID)) return;
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `
.rmd-badges{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.rmd-badge{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--blue-700,#1749a6);background:var(--blue-50,#eef4ff);border:1px solid var(--blue-200,#cfe0fb);border-radius:8px;padding:7px 13px}
.rmd-grid-6{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rmd-aud{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:20px 22px}
.rmd-aud h4{font-size:15.5px;font-weight:800;margin:0 0 7px;color:var(--ink)}
.rmd-aud p{font-size:13.5px;color:var(--slate-600);line-height:1.55;margin:0}
.rmd-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.rmd-chip{font-size:13.5px;font-weight:600;color:var(--slate-700);background:var(--bg-2,#f4f7fb);border:1px solid var(--line);border-radius:8px;padding:8px 14px}
.rmd-risk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.rmd-risk{border:1px solid var(--line);border-radius:var(--r-lg);padding:20px;background:var(--surface);position:relative;overflow:hidden}
.rmd-risk::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--rc,#1d7ed8)}
.rmd-risk-c{font-size:22px;font-weight:900;letter-spacing:-.02em;color:var(--rc,#1d7ed8)}
.rmd-risk-l{font-size:14px;font-weight:700;margin-top:6px;color:var(--ink)}
.rmd-routes{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.rmd-route{display:flex;gap:14px;align-items:flex-start;border:1px solid var(--line);border-radius:var(--r-lg);padding:18px 20px;background:var(--surface)}
.rmd-route-ic{width:38px;height:38px;flex-shrink:0;border-radius:10px;background:var(--blue-50,#eef4ff);color:var(--blue-600);display:flex;align-items:center;justify-content:center}
.rmd-route h4{font-size:15px;font-weight:800;margin:0 0 5px;color:var(--ink)}
.rmd-route p{font-size:13.5px;color:var(--slate-600);line-height:1.5;margin:0}
.rmd-incl{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 30px}
.rmd-incl-i{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--line);font-size:14.5px;color:var(--slate-700);line-height:1.45}
.rmd-incl-n{flex-shrink:0;width:26px;height:26px;border-radius:8px;background:var(--blue-50,#eef4ff);color:var(--blue-600);font-size:12.5px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:1px}
.rmd-stage{border:1px solid var(--line);border-radius:var(--r-lg);background:var(--surface);margin-bottom:12px;overflow:hidden}
.rmd-stage-h{display:flex;align-items:center;gap:14px;width:100%;padding:18px 22px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left}
.rmd-stage-n{flex-shrink:0;width:34px;height:34px;border-radius:9px;background:var(--blue-600);color:#fff;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center}
.rmd-stage-t{flex:1;font-size:15.5px;font-weight:800;color:var(--ink)}
.rmd-stage-ch{color:var(--slate-400);transition:transform .2s;flex-shrink:0}
.rmd-stage.open .rmd-stage-ch{transform:rotate(180deg)}
.rmd-stage-body{padding:0 22px 20px 70px}
.rmd-stage-body .r{margin-top:10px;font-size:13.5px}
.rmd-stage-body .lbl{font-weight:800;color:var(--blue-700,#1749a6)}
.rmd-stage-body p{font-size:14px;color:var(--slate-600);line-height:1.6;margin:0}
.rmd-flow{display:flex;flex-direction:column;gap:0;max-width:760px}
.rmd-flow-i{display:flex;gap:16px;align-items:flex-start;position:relative;padding:0 0 22px 0}
.rmd-flow-i:not(:last-child)::before{content:"";position:absolute;left:17px;top:36px;bottom:0;width:2px;background:var(--line)}
.rmd-flow-n{flex-shrink:0;width:36px;height:36px;border-radius:50%;background:var(--surface);border:2px solid var(--blue-400,#7fb1ff);color:var(--blue-600);font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:1}
.rmd-flow-t{padding-top:7px;font-size:14.5px;font-weight:600;color:var(--slate-700)}
.rmd-docs{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.rmd-doc-g{border:1px solid var(--line);border-radius:var(--r-lg);padding:20px 22px;background:var(--surface)}
.rmd-doc-g h4{font-size:14.5px;font-weight:800;margin:0 0 12px;color:var(--ink);display:flex;align-items:center;gap:9px}
.rmd-doc-g h4 .d{width:8px;height:8px;border-radius:50%;background:var(--blue-500,#2b72e3);flex-shrink:0}
.rmd-doc-g ul{margin:0;padding:0;list-style:none}
.rmd-doc-g li{font-size:13.5px;color:var(--slate-600);line-height:1.5;padding:4px 0 4px 18px;position:relative}
.rmd-doc-g li::before{content:"";position:absolute;left:2px;top:11px;width:5px;height:5px;border-radius:50%;background:var(--slate-300)}
.rmd-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg)}
.rmd-table{width:100%;border-collapse:collapse;min-width:420px}
.rmd-table th,.rmd-table td{text-align:left;padding:14px 20px;font-size:14px;border-bottom:1px solid var(--line)}
.rmd-table th{background:var(--bg-2,#f4f7fb);font-weight:800;color:var(--ink);font-size:12.5px;letter-spacing:.02em;text-transform:uppercase}
.rmd-table tr:last-child td{border-bottom:none}
.rmd-table td:last-child{font-weight:800;color:var(--blue-700,#1749a6);white-space:nowrap}
.rmd-note{font-size:13px;color:var(--slate-500);line-height:1.6;margin-top:14px;padding:14px 16px;background:var(--bg-2,#f4f7fb);border-radius:10px;border:1px solid var(--line)}
.rmd-cost{display:grid;grid-template-columns:1.1fr 1fr;gap:32px;align-items:start}
.rmd-cost-factors{display:flex;flex-wrap:wrap;gap:9px}
.rmd-two{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.rmd-agree{border:1px solid var(--line);border-radius:var(--r-lg);padding:22px 24px;background:var(--surface)}
.rmd-agree h4{font-size:16px;font-weight:800;margin:0 0 8px;color:var(--ink)}
.rmd-agree p{font-size:13.5px;color:var(--slate-600);line-height:1.6;margin:0 0 16px}
.rmd-why{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rmd-why-c{border:1px solid var(--line);border-radius:var(--r-lg);padding:22px;background:var(--surface)}
.rmd-why-c .ic{width:42px;height:42px;border-radius:11px;background:var(--blue-50,#eef4ff);color:var(--blue-600);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.rmd-why-c h4{font-size:15px;font-weight:800;margin:0 0 7px;color:var(--ink)}
.rmd-why-c p{font-size:13.5px;color:var(--slate-600);line-height:1.55;margin:0}
.rmd-ctaband{margin:0;padding:36px 40px;border-radius:var(--r-lg);background:linear-gradient(135deg,#0e4ac6,#1d7ed8);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.rmd-ctaband h3{font-size:22px;font-weight:800;margin:0 0 6px;letter-spacing:-.01em;color:#fff}
.rmd-ctaband p{font-size:14.5px;opacity:.9;margin:0;max-width:560px;line-height:1.5}
.rmd-ctaband .btn{flex-shrink:0}
.rmd-form-wrap{max-width:820px;margin:0 auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(24px,4vw,40px);box-shadow:var(--sh-sm)}
.rmd-form-sec{margin-bottom:22px}
.rmd-form-sec-h{font-size:13px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--blue-700,#1749a6);margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid var(--line)}
.rmd-fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.rmd-field{display:flex;flex-direction:column;gap:6px}
.rmd-field.full{grid-column:1/-1}
.rmd-field label{font-size:13px;font-weight:600;color:var(--slate-700)}
.rmd-field label .req{color:#e0492f;margin-left:2px}
.rmd-input,.rmd-select,.rmd-textarea{height:44px;border:1.5px solid var(--line);border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;background:var(--bg);color:var(--ink);outline:none;transition:border-color .16s;width:100%;box-sizing:border-box}
.rmd-textarea{height:auto;padding:12px 14px;min-height:90px;resize:vertical}
.rmd-input:focus,.rmd-select:focus,.rmd-textarea:focus{border-color:var(--blue-400,#4d88e0)}
.rmd-tri{display:flex;gap:8px}
.rmd-tri button{flex:1;height:38px;border:1.5px solid var(--line);border-radius:9px;background:var(--bg);color:var(--slate-600);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:.14s}
.rmd-tri button.on{background:var(--blue-600);border-color:var(--blue-600);color:#fff}
.rmd-checks{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.rmd-check{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--slate-700);cursor:pointer;padding:6px 0}
.rmd-check input{width:17px;height:17px;flex-shrink:0;accent-color:var(--blue-600)}
.rmd-expand-btn{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--blue-600);background:var(--blue-50,#eef4ff);border:1.5px solid var(--blue-200,#cfe0fb);border-radius:10px;padding:11px 18px;cursor:pointer;font-family:inherit;width:100%;justify-content:center;transition:.16s;margin-bottom:22px}
.rmd-expand-btn:hover{background:var(--blue-100,#dceaff)}
.rmd-drop{display:block;border:1.5px dashed var(--blue-300,#9cc0f5);border-radius:12px;padding:22px;text-align:center;cursor:pointer;transition:.16s;background:var(--bg-2,#f8fafc)}
.rmd-drop:hover{border-color:var(--blue-500,#2b72e3);background:var(--blue-50,#eef4ff)}
.rmd-files{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.rmd-file{display:flex;align-items:center;gap:10px;font-size:13px;background:var(--bg-2,#f4f7fb);border:1px solid var(--line);border-radius:9px;padding:9px 12px}
.rmd-file .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rmd-file button{border:none;background:none;color:var(--slate-400);cursor:pointer;flex-shrink:0;display:flex}
.rmd-form-ok{text-align:center;padding:36px 20px}
.rmd-form-ok .ic{width:64px;height:64px;border-radius:50%;background:rgba(21,160,106,.12);color:#15A06A;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.rmd-form-ok h3{font-size:20px;font-weight:800;margin:0 0 8px}
.rmd-form-ok p{font-size:14.5px;color:var(--slate-600);max-width:420px;margin:0 auto;line-height:1.6}
.rmd-disc{font-size:12.5px;color:var(--slate-500);line-height:1.65;max-width:900px;margin:0 auto;padding:20px 24px;background:var(--bg-2,#f4f7fb);border:1px solid var(--line);border-radius:12px}
@media(max-width:900px){.rmd-grid-6{grid-template-columns:repeat(2,1fr)}.rmd-risk-grid{grid-template-columns:repeat(2,1fr)}.rmd-routes,.rmd-incl,.rmd-docs,.rmd-two,.rmd-why{grid-template-columns:1fr}.rmd-cost{grid-template-columns:1fr}}
@media(max-width:560px){.rmd-grid-6{grid-template-columns:1fr}.rmd-risk-grid{grid-template-columns:1fr}.rmd-fgrid,.rmd-checks{grid-template-columns:1fr}.rmd-stage-body{padding-left:22px}.rmd-ctaband{flex-direction:column;align-items:flex-start}}
    `;
    document.head.appendChild(s);
  }, []);
}

/* ── JSON-LD (FAQPage + Service + BreadcrumbList) ─────────── */
function useRmdJsonLd(faq) {
  React.useEffect(() => {
    const ID = "rmd-jsonld";
    const old = document.getElementById(ID); if (old) old.remove();
    const base = location.origin + location.pathname;
    const data = [
      { "@context": "https://schema.org", "@type": "Service",
        name: "Сопровождение регистрации медицинских изделий в Узбекистане",
        provider: { "@type": "Organization", name: "ИНДУСТРИЯ ЗДОРОВЬЯ" },
        areaServed: { "@type": "Country", name: "Узбекистан" },
        serviceType: "Регистрация медицинских изделий" },
      { "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: base + "#/" },
          { "@type": "ListItem", position: 2, name: "Услуги", item: base + "#/services" },
          { "@type": "ListItem", position: 3, name: "Регистрация медицинских изделий в Узбекистане" },
        ] },
      { "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ];
    const s = document.createElement("script");
    s.id = ID; s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
    return () => { const el = document.getElementById(ID); if (el) el.remove(); };
  }, []);
}

const scrollToForm = () => { const el = document.getElementById("rmd-form"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

/* ── Заявка «Оценить маршрут регистрации» ─────────────────── */
function RmdForm() {
  const { useState } = React;
  const [advanced, setAdvanced] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [files, setFiles] = useState([]);
  const [f, setF] = useState({
    name: "", company: "", position: "", phone: "", email: "", country: "", role: "",
    devName: "", devMaker: "", devCountry: "", devPurpose: "", devCategory: "", devRisk: "",
    devModels: "", sterile: "", invasive: "", measuring: "", software: "", ai: "", consumables: "",
    regInCountry: "", regOther: "", regCeFda: "", regUzBefore: "", needed: "",
    docs: {}, comment: "", urgency: false, consent: false,
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const tri3 = (k, label) => (
    <div className="rmd-field">
      <label>{label}</label>
      <div className="rmd-tri">
        {[["yes", "Да"], ["no", "Нет"], ["unknown", "Не знаю"]].map(([v, l]) => (
          <button type="button" key={v} className={f[k] === v ? "on" : ""} onClick={() => set(k, f[k] === v ? "" : v)}>{l}</button>
        ))}
      </div>
    </div>
  );
  const yn = (k, label) => (
    <div className="rmd-field">
      <label>{label}</label>
      <div className="rmd-tri">
        {[["yes", "Да"], ["no", "Нет"]].map(([v, l]) => (
          <button type="button" key={v} className={f[k] === v ? "on" : ""} onClick={() => set(k, f[k] === v ? "" : v)}>{l}</button>
        ))}
      </div>
    </div>
  );

  const DOC_OPTS = ["Инструкция", "Техническая документация", "ISO 13485", "Декларация безопасности и эффективности",
    "Free Sale / Export Certificate", "Протоколы испытаний", "Клиническая оценка / отчёт", "Маркировка / упаковка",
    "Фото изделия", "Каталог", "Документы по ПО", "Документы по биобезопасности", "Документы по стерилизации", "Другое"];

  const onFiles = (list) => {
    const allow = /\.(pdf|docx?|xlsx?|jpe?g|png)$/i;
    const add = [...list].filter((x) => allow.test(x.name) && x.size <= 15 * 1024 * 1024);
    setFiles((prev) => [...prev, ...add].slice(0, 10));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!f.name.trim() || !f.company.trim() || !f.phone.trim() || !f.email.trim()) { setErr("Заполните имя, компанию, телефон и email."); return; }
    if (!f.devName.trim() || !f.devMaker.trim() || !f.devCountry.trim() || !f.devPurpose.trim()) { setErr("Заполните основные данные об изделии (наименование, производитель, страна, назначение)."); return; }
    if (!f.consent) { setErr("Необходимо согласие на обработку персональных данных."); return; }
    setSending(true);
    try {
      let attachments = [];
      if (files.length && window.api && window.api.req) {
        const fd = new FormData();
        files.forEach((file) => fd.append("files", file));
        const res = await window.api.req("/submissions/attachments", { method: "POST", body: fd, noAuth: true });
        attachments = (res && res.files) || [];
      }
      const checkedDocs = DOC_OPTS.filter((d) => f.docs[d]);
      await window.api.create("submissions", {
        name: f.name, phone: f.phone, email: f.email,
        message: [f.comment, f.urgency ? "СРОЧНО" : ""].filter(Boolean).join(" · ") || undefined,
        source: "Регистрация МИ — Оценить маршрут",
        meta: {
          org: f.company, position: f.position || undefined, country: f.country || undefined, role: f.role || undefined,
          device: { name: f.devName, maker: f.devMaker, makerCountry: f.devCountry, purpose: f.devPurpose,
            category: f.devCategory || undefined, riskClass: f.devRisk || undefined, models: f.devModels || undefined,
            sterile: f.sterile || undefined, invasive: f.invasive || undefined, measuring: f.measuring || undefined,
            software: f.software || undefined, ai: f.ai || undefined, consumables: f.consumables || undefined },
          registration: { inCountry: f.regInCountry || undefined, inOthers: f.regOther || undefined,
            ceFda: f.regCeFda || undefined, uzBefore: f.regUzBefore || undefined, needed: f.needed || undefined },
          documents: checkedDocs.length ? checkedDocs : undefined,
          urgency: f.urgency || undefined,
          attachments: attachments.length ? attachments : undefined,
        },
      });
      setSent(true);
    } catch (ex) {
      setErr((ex && ex.message) || "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.");
    } finally { setSending(false); }
  };

  if (sent) return (
    <div className="rmd-form-wrap">
      <div className="rmd-form-ok">
        <div className="ic"><CoIcon name="check" size={30} /></div>
        <h3>Заявка отправлена</h3>
        <p>Мы предварительно оценим маршрут регистрации, состав документов и дальнейшие шаги и свяжемся с вами. При необходимости возможно предварительное заключение соглашения о конфиденциальности.</p>
      </div>
    </div>
  );

  return (
    <form className="rmd-form-wrap" onSubmit={submit} noValidate>
      <div className="rmd-form-sec">
        <div className="rmd-form-sec-h">Контактные данные</div>
        <div className="rmd-fgrid">
          <div className="rmd-field"><label>Имя<span className="req">*</span></label><input className="rmd-input" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="rmd-field"><label>Компания<span className="req">*</span></label><input className="rmd-input" value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div className="rmd-field"><label>Должность</label><input className="rmd-input" value={f.position} onChange={(e) => set("position", e.target.value)} /></div>
          <div className="rmd-field"><label>Телефон<span className="req">*</span></label><input className="rmd-input" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="rmd-field"><label>Email<span className="req">*</span></label><input className="rmd-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="rmd-field"><label>Страна</label><input className="rmd-input" value={f.country} onChange={(e) => set("country", e.target.value)} /></div>
          <div className="rmd-field full"><label>Роль заявителя</label>
            <select className="rmd-select" value={f.role} onChange={(e) => set("role", e.target.value)}>
              <option value="">Выберите…</option>
              {["Производитель", "Импортёр", "Дистрибьютор", "Поставщик", "Представитель производителя", "Другое"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rmd-form-sec">
        <div className="rmd-form-sec-h">Данные об изделии</div>
        <div className="rmd-fgrid">
          <div className="rmd-field"><label>Наименование изделия<span className="req">*</span></label><input className="rmd-input" value={f.devName} onChange={(e) => set("devName", e.target.value)} /></div>
          <div className="rmd-field"><label>Производитель<span className="req">*</span></label><input className="rmd-input" value={f.devMaker} onChange={(e) => set("devMaker", e.target.value)} /></div>
          <div className="rmd-field"><label>Страна производителя<span className="req">*</span></label><input className="rmd-input" value={f.devCountry} onChange={(e) => set("devCountry", e.target.value)} /></div>
          <div className="rmd-field"><label>Категория изделия</label><input className="rmd-input" value={f.devCategory} onChange={(e) => set("devCategory", e.target.value)} placeholder="оборудование, инструмент, ПО…" /></div>
          <div className="rmd-field full"><label>Назначение изделия<span className="req">*</span></label><textarea className="rmd-textarea" rows={2} value={f.devPurpose} onChange={(e) => set("devPurpose", e.target.value)} /></div>
        </div>
      </div>

      {!advanced && (
        <button type="button" className="rmd-expand-btn" onClick={() => setAdvanced(true)}>
          Уточнить детали изделия, статус и документы <CoIcon name="chevronDown" size={16} />
        </button>
      )}

      {advanced && (
        <React.Fragment>
          <div className="rmd-form-sec">
            <div className="rmd-form-sec-h">Характеристики изделия</div>
            <div className="rmd-fgrid">
              <div className="rmd-field"><label>Предполагаемый класс риска</label>
                <select className="rmd-select" value={f.devRisk} onChange={(e) => set("devRisk", e.target.value)}>
                  <option value="">Не знаю</option>{["I", "IIa", "IIb", "III"].map((o) => <option key={o} value={o}>{o} класс</option>)}
                </select>
              </div>
              <div className="rmd-field"><label>Кол-во моделей / модификаций</label><input className="rmd-input" value={f.devModels} onChange={(e) => set("devModels", e.target.value)} /></div>
              {tri3("sterile", "Изделие стерильное?")}
              {tri3("invasive", "Изделие инвазивное?")}
              {tri3("measuring", "Есть измерительная функция?")}
              {yn("software", "Является программным обеспечением?")}
              {yn("ai", "Содержит ИИ / автоматическую интерпретацию?")}
              {yn("consumables", "Есть комплектующие / расходные материалы?")}
            </div>
          </div>

          <div className="rmd-form-sec">
            <div className="rmd-form-sec-h">Регистрационный статус</div>
            <div className="rmd-fgrid">
              {tri3("regInCountry", "Есть регистрация в стране производителя?")}
              {tri3("regOther", "Есть регистрация в других странах?")}
              {tri3("regCeFda", "Есть CE / FDA / PMDA / MFDS и др.?")}
              {tri3("regUzBefore", "Была регистрация в Узбекистане ранее?")}
              <div className="rmd-field full"><label>Что требуется</label>
                <select className="rmd-select" value={f.needed} onChange={(e) => set("needed", e.target.value)}>
                  <option value="">Не знаю</option>
                  {["Новая регистрация", "Продление", "Внесение изменений", "Регистрация путём признания", "Консультация"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rmd-form-sec">
            <div className="rmd-form-sec-h">Документы в наличии</div>
            <div className="rmd-checks">
              {DOC_OPTS.map((d) => (
                <label className="rmd-check" key={d}><input type="checkbox" checked={!!f.docs[d]} onChange={(e) => setF((s) => ({ ...s, docs: { ...s.docs, [d]: e.target.checked } }))} />{d}</label>
              ))}
            </div>
          </div>

          <div className="rmd-form-sec">
            <div className="rmd-form-sec-h">Файлы для предварительного анализа</div>
            <label className="rmd-drop" htmlFor="rmd-file-inp" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
              <CoIcon name="upload" size={26} />
              <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 600 }}>Прикрепить документы</div>
              <div style={{ marginTop: 3, fontSize: 12, color: "var(--slate-500)" }}>PDF, DOC, DOCX, XLSX, JPG, PNG · до 15 МБ · до 10 файлов</div>
            </label>
            <input id="rmd-file-inp" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
            {files.length > 0 && (
              <div className="rmd-files">
                {files.map((file, i) => (
                  <div className="rmd-file" key={i}>
                    <CoIcon name="doc" size={15} />
                    <span className="nm">{file.name}</span>
                    <span style={{ color: "var(--slate-400)", fontSize: 12 }}>{Math.round(file.size / 1024)} KB</span>
                    <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} aria-label="Убрать"><CoIcon name="x" size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--slate-500)", marginTop: 10, lineHeight: 1.5 }}>Документы передаются для предварительной оценки. При необходимости возможно предварительное заключение соглашения о конфиденциальности.</div>
          </div>
        </React.Fragment>
      )}

      <div className="rmd-form-sec">
        <div className="rmd-field full"><label>Комментарий — что нужно оценить, есть ли срочность и вопросы по документам</label>
          <textarea className="rmd-textarea" rows={3} value={f.comment} onChange={(e) => set("comment", e.target.value)} />
        </div>
        <label className="rmd-check" style={{ marginTop: 10 }}><input type="checkbox" checked={f.urgency} onChange={(e) => set("urgency", e.target.checked)} />Есть срочность</label>
        <label className="rmd-check"><input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />Согласен с политикой конфиденциальности и обработкой персональных данных<span className="req">*</span></label>
      </div>

      {err && <div style={{ color: "#e0492f", fontSize: 13.5, marginBottom: 14, fontWeight: 600 }}>{err}</div>}
      <button className="btn btn-pri btn-lg" type="submit" disabled={sending} style={{ width: "100%", justifyContent: "center" }}>
        {sending ? "Отправка…" : "Оценить маршрут регистрации"}
      </button>
    </form>
  );
}

function RmdCtaBand() {
  return (
    <div className="rmd-ctaband reveal">
      <div>
        <h3>Не знаете, какой маршрут применим к вашему изделию?</h3>
        <p>Заполните короткую заявку — мы предварительно оценим маршрут регистрации, состав документов и дальнейшие шаги.</p>
      </div>
      <button className="btn btn-lg" style={{ background: "#fff", color: "#0e4ac6" }} onClick={scrollToForm}>Оценить маршрут регистрации</button>
    </div>
  );
}

function RegistrationPage({ t, lang, go }) {
  const { useState } = React;
  const [stage, setStage] = useState(0);
  const [faqOpen, setFaqOpen] = useState(-1);
  useRmdCss();

  const AUDIENCES = [
    ["Производителям медицинских изделий", "Если планируете вывести изделие на рынок Узбекистана и должны подготовить регистрационные документы."],
    ["Иностранным брендам", "Если бренд хочет работать в Узбекистане через импортёра, дистрибьютора или официального представителя."],
    ["Импортёрам", "Если компания планирует ввозить и реализовывать медицинские изделия на территории Узбекистана."],
    ["Дистрибьюторам", "Если нужно расширить продуктовый портфель и подготовить изделия к легальному выводу на рынок."],
    ["Поставщикам оборудования", "Если поставщик работает с клиниками, тендерами и государственными закупками."],
    ["Компаниям, выводящим изделие на рынок", "Если нужно понять маршрут регистрации, состав документов, сроки и возможные риски."],
  ];
  const DEVICE_TYPES = ["Медицинское оборудование", "Медицинская техника", "Медицинская мебель (как медизделие)", "Расходные материалы", "Инструменты", "ПО как медицинское изделие", "Изделия с ИИ / автоинтерпретацией", "Комплексы и системы медназначения"];
  const RISKS = [["I", "Низкий риск", "#15A06A"], ["IIa", "Средний риск", "#1d7ed8"], ["IIb", "Высокий риск", "#E0912F"], ["III", "Самый высокий риск", "#E0492F"]];
  const ROUTES = [
    ["Общий порядок регистрации", "Для изделий, которые проходят стандартную процедуру рассмотрения, экспертизы и, при необходимости, испытаний."],
    ["Регистрация путём признания", "Возможна для отдельных изделий при наличии действующих документов от признанных зарубежных регуляторных органов."],
    ["Продление регистрационного удостоверения", "Для изделий, ранее зарегистрированных в Узбекистане."],
    ["Внесение изменений", "При изменении производителя, документации, маркировки, комплектации, модели или иных регистрационных данных."],
    ["Оценка маршрута", "Если клиент не знает, какой порядок применим к изделию."],
  ];
  const INCLUDED = ["Первичный анализ изделия и имеющейся документации", "Предварительное определение категории / типа изделия", "Оценка предполагаемого класса риска", "Анализ маршрута регистрации", "Проверка инструкции, маркировки и технических материалов", "Формирование перечня недостающих документов", "Подготовка регистрационного досье", "Сопровождение подачи", "Коммуникация по замечаниям", "Сопровождение до результата рассмотрения заявки"];
  const STAGES = [
    ["Первичная консультация", "Определяем тип изделия, производителя, страну происхождения, наличие документов и цель обращения.", "Понятно, что нужно оценить и какие документы запросить."],
    ["Оценка маршрута регистрации", "Проверяем, какой маршрут может применяться: общий порядок, признание, продление, внесение изменений или консультация.", "Клиент получает предварительный маршрут."],
    ["Анализ документов", "Проверяем техническую документацию, сертификаты, инструкции, маркировку, упаковку и документы производителя.", "Выявлены недостающие или требующие корректировки документы."],
    ["Определение класса риска", "Оцениваем предполагаемый класс риска на основании назначения и характеристик изделия.", "Сформирована предварительная логика требований к досье."],
    ["Подготовка регистрационного досье", "Систематизируем документы, проверяем комплектность и соответствие требованиям ПКМ №738.", "Подготовлен комплект материалов для подачи."],
    ["Сопровождение подачи", "Сопровождаем процесс передачи документов и коммуникацию с ответственными сторонами.", "Заявка передана на рассмотрение."],
    ["Коммуникация по замечаниям", "Помогаем анализировать замечания, готовить ответы и корректировки документов.", "Замечания обработаны, документы уточнены."],
    ["Сопровождение до результата", "Сопровождаем клиента до завершения рассмотрения заявки.", "Получен результат рассмотрения: регистрация, отказ, запрос дополнительных материалов или иной официальный результат."],
  ];
  const FLOW = ["Подача документов и образцов, если применимо", "Первичная экспертиза", "Лабораторные испытания, если требуются", "Специализированная экспертиза", "Клинические исследования, если требуются", "Инспекция производства, если требуется", "Принятие решения о регистрации или отказе"];
  const DOC_GROUPS = [
    ["Заявительные документы", ["заявление", "сведения о заявителе", "электронная форма регистрационных документов", "доверенность / полномочия представителя, если применимо"]],
    ["Документы производителя", ["сведения о производителе", "документы о производственной площадке", "сертификат системы качества", "ISO 13485, если применимо"]],
    ["Документы на изделие", ["описание изделия", "назначение", "модели / модификации", "комплектация", "технические характеристики", "принцип действия", "область применения"]],
    ["Техническая документация", ["технический файл", "эксплуатационная документация", "руководство пользователя", "инструкция по применению", "паспорт изделия, если применимо"]],
    ["Маркировка и упаковка", ["макеты маркировки", "этикетка", "упаковка", "перевод маркировки", "инструкция на требуемых языках"]],
    ["Безопасность и эффективность", ["декларация безопасности и эффективности", "отчёты испытаний", "клиническая оценка", "биологическая безопасность, если применимо", "стерилизация, если применимо", "отчёты по верификации и валидации"]],
    ["Зарубежные регистрационные документы", ["регистрация в стране производителя", "Free Sale Certificate", "Export Certificate", "CE / FDA / другие документы, если применимо", "документы для маршрута признания"]],
    ["Фото, каталоги и образцы", ["фото изделия", "фото комплектующих", "фото расходных частей", "каталог производителя", "образцы изделия, если требуются для испытаний"]],
  ];
  const TIMELINES = [
    ["I класс", "60 рабочих дней"], ["IIa класс", "90 рабочих дней"], ["IIb класс", "120 рабочих дней"], ["III класс", "120 рабочих дней"],
    ["Регистрация путём признания", "15 рабочих дней"], ["Изделия, прошедшие преквалификацию ВОЗ", "60 рабочих дней"],
  ];
  const COST_FACTORS = ["класс риска", "тип изделия", "количество моделей и модификаций", "наличие документов производителя", "необходимость перевода", "подготовка / корректировка маркировки", "необходимость испытаний", "общий порядок или признание", "объём сопровождения", "подготовка дополнительных материалов"];
  const WHY = [
    ["Понимаем медицинское оборудование", "Работаем не только с документами, но и с назначением, применением и техническими особенностями изделий."],
    ["Сопровождаем производителей и импортёров", "Помогаем выстроить понятный маршрут вывода изделия на рынок Узбекистана."],
    ["Связываем регистрацию с поставкой", "После регистрации изделие может быть включено в каталог, коммерческие предложения и проекты поставки."],
    ["Работаем на договорной основе", "Конфиденциальность, ответственность сторон и объём сопровождения фиксируются документально."],
    ["Помогаем с замечаниями", "Сопровождаем анализ замечаний и подготовку корректировок по документам."],
  ];
  const FAQ = [
    ["Что такое регистрация медицинского изделия?", "Это установленная законодательством процедура допуска изделия на рынок Узбекистана. Порядок определяется ПКМ РУз №738 от 24.11.2025."],
    ["Какие изделия подлежат регистрации?", "Изделия, используемые в медицинских целях: оборудование, техника, инструменты, расходные материалы, отдельные виды мебели, ПО как медизделие и др. Точный статус определяется после анализа назначения и документации."],
    ["Чем медицинское изделие отличается от медицинского оборудования?", "Медицинское оборудование — частный случай медицинских изделий. Категория «медицинское изделие» шире и включает инструменты, расходные материалы, ПО и другие изделия медназначения."],
    ["Что такое класс риска изделия?", "Категория (I, IIa, IIb, III), отражающая потенциальный риск при применении. От класса риска зависят состав документов, необходимость испытаний и ориентировочные сроки."],
    ["Какие документы нужны для регистрации?", "Перечень зависит от типа изделия, класса риска, производителя, страны происхождения и маршрута. Обычно это заявительные документы, документы производителя и на изделие, техническая документация, маркировка, документы безопасности и эффективности."],
    ["Можно ли зарегистрировать изделие путём признания?", "Для отдельных изделий возможен маршрут признания при наличии действующих документов от признанных зарубежных регуляторных органов. Применимость оценивается индивидуально."],
    ["Сколько времени занимает регистрация?", "Сроки рассмотрения ориентировочные и зависят от класса риска и маршрута. Они могут не включать периоды устранения замечаний, испытаний, клинических исследований и инспекции производства."],
    ["Можно ли гарантировать получение регистрационного удостоверения?", "ИНДУСТРИЯ ЗДОРОВЬЯ не гарантирует решение уполномоченного органа, но сопровождает анализ документов, подготовку регистрационного досье, коммуникацию по замечаниям и процесс до результата рассмотрения заявки."],
    ["Что делать, если документы неполные?", "Мы проводим анализ, формируем перечень недостающих документов и помогаем подготовить или скорректировать материалы."],
    ["Можно ли сначала заключить NDA?", "Да. Перед началом работы может быть заключено соглашение о конфиденциальности для защиты технической, коммерческой и регистрационной информации."],
    ["Можно ли прикрепить документы для предварительного анализа?", "Да, в форме «Оценить маршрут регистрации» можно приложить документы. При необходимости — после заключения NDA."],
    ["Сопровождаете ли вы ответы на замечания?", "Да. Помогаем анализировать замечания, готовить ответы и корректировки документов."],
    ["Можно ли зарегистрировать программное обеспечение?", "ПО может рассматриваться как медицинское изделие, если используется в медицинских целях. Статус и требования определяются после анализа."],
    ["Что делать, если изделие содержит ИИ или автоматическую интерпретацию?", "Такие изделия анализируются отдельно — с учётом назначения, функций автоматической интерпретации и требований к документации."],
    ["Нужно ли переводить документы?", "В ряде случаев требуется перевод маркировки, инструкций и документов. Необходимость определяется по составу материалов и требованиям законодательства."],
  ];

  useRmdJsonLd(FAQ.map(([q, a]) => ({ q, a })));

  return (
    <div>
      <section className="page-hero">
        <div className="pw"></div>
        <div className="wrap">
          <div className="crumb">
            <a onClick={() => go("home")}>{t.nav_home}</a> / <a onClick={() => go("services")}>Услуги</a> / <span className="cur">Регистрация медицинских изделий</span>
          </div>
          <h1 style={{ maxWidth: 820 }}>Регистрация медицинских изделий в Узбекистане</h1>
          <p style={{ maxWidth: 780, marginTop: 16 }}>ИНДУСТРИЯ ЗДОРОВЬЯ сопровождает производителей, импортёров, дистрибьюторов и поставщиков медицинских изделий на всех этапах процедуры регистрации: от первичного анализа документов до подготовки досье, сопровождения подачи и коммуникации по замечаниям.</p>
          <div className="rmd-badges reveal">
            {["Анализ документов", "Регистрационное досье", "Оценка маршрута регистрации", "Коммуникация по замечаниям", "Сопровождение до результата"].map((b) => (
              <span className="rmd-badge" key={b}><CoIcon name="check" size={14} />{b}</span>
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: 26 }}>
            <button className="btn btn-pri btn-lg" onClick={scrollToForm}>Оценить маршрут регистрации</button>
            <button className="btn btn-ghost btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>Получить консультацию</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Аудитория</span><h2 className="h-sec" style={{ marginTop: 14 }}>Кому нужна услуга</h2></div>
          <div className="rmd-grid-6">{AUDIENCES.map(([h, p], i) => <div className="rmd-aud reveal" key={i}><h4>{h}</h4><p>{p}</p></div>)}</div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Область</span><h2 className="h-sec" style={{ marginTop: 14 }}>Какие изделия охватывает сопровождение</h2></div>
          <p className="reveal" style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 820, lineHeight: 1.65 }}>Сопровождение может применяться к медицинским изделиям, технике, оборудованию, инструментам, устройствам, расходным материалам, мебели, программному обеспечению и изделиям с автоматической интерпретацией данных, если они используются в медицинских целях.</p>
          <div className="rmd-chips reveal" style={{ marginTop: 18 }}>{DEVICE_TYPES.map((d) => <span className="rmd-chip" key={d}>{d}</span>)}</div>
          <div className="rmd-note reveal">Точный статус изделия определяется после анализа назначения, инструкции, технической документации, класса риска и требований законодательства.</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Классификация</span><h2 className="h-sec" style={{ marginTop: 14 }}>Класс риска изделия</h2></div>
          <p className="reveal" style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 820, lineHeight: 1.65, marginBottom: 22 }}>От класса риска зависят состав документов, необходимость испытаний, экспертизы и ориентировочные сроки рассмотрения.</p>
          <div className="rmd-risk-grid">{RISKS.map(([c, l, col], i) => <div className="rmd-risk reveal" key={i} style={{ "--rc": col }}><div className="rmd-risk-c">{c}</div><div className="rmd-risk-l">{l}</div></div>)}</div>
          <div className="rmd-note reveal">Предварительная оценка класса риска проводится на основании назначения изделия, способа применения, степени контакта с пациентом, стерильности, измерительной функции, инвазивности и документации производителя.</div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Маршруты</span><h2 className="h-sec" style={{ marginTop: 14 }}>Маршруты регистрации</h2></div>
          <div className="rmd-routes">{ROUTES.map(([h, p], i) => <div className="rmd-route reveal" key={i}><div className="rmd-route-ic"><CoIcon name="arrow" size={18} /></div><div><h4>{h}</h4><p>{p}</p></div></div>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Сопровождение</span><h2 className="h-sec" style={{ marginTop: 14 }}>Что входит в сопровождение</h2></div>
          <div className="rmd-incl">{INCLUDED.map((x, i) => <div className="rmd-incl-i reveal" key={i}><span className="rmd-incl-n">{i + 1}</span>{x}</div>)}</div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Процесс</span><h2 className="h-sec" style={{ marginTop: 14 }}>Этапы сопровождения регистрации</h2></div>
          {STAGES.map(([tt, doo, res], i) => (
            <div className={"rmd-stage reveal" + (stage === i ? " open" : "")} key={i}>
              <button className="rmd-stage-h" onClick={() => setStage(stage === i ? -1 : i)} aria-expanded={stage === i}>
                <span className="rmd-stage-n">{i + 1}</span><span className="rmd-stage-t">{tt}</span><span className="rmd-stage-ch"><CoIcon name="chevronDown" size={18} /></span>
              </button>
              {stage === i && (
                <div className="rmd-stage-body">
                  <div className="r"><p><span className="lbl">Что делаем: </span>{doo}</p></div>
                  <div className="r"><p><span className="lbl">Результат: </span>{res}</p></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">По ПКМ №738</span><h2 className="h-sec" style={{ marginTop: 14 }}>Как проходит рассмотрение заявки</h2></div>
          <div className="rmd-flow reveal">{FLOW.map((x, i) => <div className="rmd-flow-i" key={i}><span className="rmd-flow-n">{i + 1}</span><span className="rmd-flow-t">{x}</span></div>)}</div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Документы</span><h2 className="h-sec" style={{ marginTop: 14 }}>Документы для регистрации</h2></div>
          <p className="reveal" style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 820, lineHeight: 1.65, marginBottom: 22 }}>Точный перечень зависит от типа изделия, класса риска, производителя, страны происхождения, регистрационного статуса и выбранного маршрута.</p>
          <div className="rmd-docs">{DOC_GROUPS.map(([h, items], i) => <div className="rmd-doc-g reveal" key={i}><h4><span className="d"></span>{h}</h4><ul>{items.map((it, j) => <li key={j}>{it}</li>)}</ul></div>)}</div>
          <div className="reveal" style={{ marginTop: 24, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "24px 28px" }}>
            <span className="eyebrow">Правовой контекст</span>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "12px 0 8px" }}>Законодательство и ПКМ №738 от 24.11.2025</h3>
            <p style={{ fontSize: 14, color: "var(--slate-600)", lineHeight: 1.65, margin: 0 }}>Основной нормативный документ — Постановление Кабинета Министров РУз №738 «О порядке государственной регистрации медицинских изделий». Актуальные уведомления и разъяснения публикуются на Uzpharm Control.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <a className="lic-dl" href="https://lex.uz/ru/docs/7861694" target="_blank" rel="noopener">Открыть на lex.uz <CoIcon name="arrow" size={14} /></a>
              <a className="lic-dl" href="https://www.uzpharm-control.uz/" target="_blank" rel="noopener">Uzpharm Control <CoIcon name="arrow" size={14} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Сроки</span><h2 className="h-sec" style={{ marginTop: 14 }}>Ориентировочные сроки рассмотрения</h2></div>
          <div className="rmd-table-wrap reveal">
            <table className="rmd-table">
              <thead><tr><th>Маршрут / класс изделия</th><th>Срок</th></tr></thead>
              <tbody>{TIMELINES.map(([r, s], i) => <tr key={i}><td>{r}</td><td>{s}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="rmd-note reveal">Сроки могут не включать периоды устранения замечаний, предоставления дополнительных материалов, проведения клинических исследований, инспекции производства и иные периоды, которые не входят в общий срок рассмотрения.</div>
        </div>
      </section>

      <section className="section alt"><div className="wrap"><RmdCtaBand /></div></section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Стоимость</span><h2 className="h-sec" style={{ marginTop: 14 }}>Стоимость сопровождения</h2></div>
          <div className="rmd-cost">
            <div className="reveal">
              <p style={{ fontSize: 15, color: "var(--slate-600)", lineHeight: 1.7, margin: 0 }}>Стоимость сопровождения определяется после предварительного анализа изделия, класса риска, комплекта документов и маршрута регистрации.</p>
              <button className="btn btn-pri" style={{ marginTop: 20 }} onClick={scrollToForm}>Получить индивидуальную оценку</button>
            </div>
            <div className="reveal">
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--slate-500)", marginBottom: 12 }}>Факторы, влияющие на стоимость:</div>
              <div className="rmd-cost-factors">{COST_FACTORS.map((x) => <span className="rmd-chip" key={x}>{x}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Договорная основа</span><h2 className="h-sec" style={{ marginTop: 14 }}>Конфиденциальность и договор</h2></div>
          <p className="reveal" style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 820, lineHeight: 1.65, marginBottom: 22 }}>Перед началом работы может быть заключено соглашение о конфиденциальности. После первичного анализа маршрута и объёма работ заключается договор на сопровождение процедуры регистрации.</p>
          <div className="rmd-two">
            <div className="rmd-agree reveal">
              <h4>Соглашение о конфиденциальности</h4>
              <p>Защита технической документации, коммерческой информации, регистрационных материалов и данных производителя.</p>
              <a className="btn btn-ghost" href="assets/nda-draft.pdf" target="_blank" rel="noopener"><CoIcon name="download" size={16} /> Скачать проект NDA</a>
            </div>
            <div className="rmd-agree reveal">
              <h4>Договор на сопровождение регистрации</h4>
              <p>Фиксация объёма работ, этапов, ответственности сторон, стоимости сопровождения и порядка коммуникации.</p>
              <a className="btn btn-ghost" href="assets/service-contract-draft.pdf" target="_blank" rel="noopener"><CoIcon name="download" size={16} /> Скачать проект договора</a>
            </div>
          </div>
          <div className="rmd-note reveal">Документы представлены как проекты для предварительного ознакомления. Финальная версия согласуется сторонами индивидуально.</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow line">Доверие</span><h2 className="h-sec" style={{ marginTop: 14 }}>Почему ИНДУСТРИЯ ЗДОРОВЬЯ</h2></div>
          <div className="rmd-why">{WHY.map(([h, p], i) => <div className="rmd-why-c reveal" key={i}><div className="ic"><CoIcon name="shield" size={22} /></div><h4>{h}</h4><p>{p}</p></div>)}</div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="sec-head center reveal"><h2 className="h-sec">Частые вопросы</h2></div>
          <div className="faq-list">
            {FAQ.map(([q, a], i) => (
              <div className={"faq-it reveal" + (faqOpen === i ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>{q}<CoIcon name="chevronDown" size={17} /></button>
                {faqOpen === i && <div className="faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="rmd-form">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Заявка</span>
            <h2 className="h-sec">Оценить маршрут регистрации</h2>
            <p style={{ fontSize: 15, color: "var(--slate-600)", maxWidth: 620, margin: "12px auto 0", lineHeight: 1.6 }}>Заполните основные данные об изделии — мы предварительно оценим маршрут, документы и дальнейшие шаги.</p>
          </div>
          <RmdForm />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap"><div className="rmd-disc reveal">Информация на странице носит справочный характер. Окончательный перечень документов, сроки, стоимость сопровождения и порядок прохождения процедуры зависят от типа изделия, класса риска, производителя, страны происхождения, регистрационного статуса, выбранного маршрута регистрации и действующих требований законодательства Республики Узбекистан.</div></div>
      </section>
    </div>
  );
}

window.RegistrationPage = RegistrationPage;
