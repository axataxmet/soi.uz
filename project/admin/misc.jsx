/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Settings / Misc */
function AdminMisc() {
  const { useState } = React;
  const toast = useToast();
  const [tab, setTab] = useState("crm");

  const [crm, setCrm] = useState({ enabled: false, mode: "proxy" });
  useEffect(() => {
    window.api.getCrmConfig().then(setCrm).catch(() => {});
  }, []);
  const setC = (k, v) => setCrm(c => ({ ...c, [k]: v }));
  const saveCrm = () => cmsOp(() => window.api.setCrmConfig(crm), toast, "Настройки CRM сохранены");

  const [contacts, setContacts] = useSettings("site_contacts", {
    phone: "+998 (77) 225-00-01",
    phone2: "+998 (77) 224-00-01",
    email: "info@sogliqindustriyasi.uz",
    address: "100069, Ташкент, Узбекистан, ул. МКАД, д. 16",
    telegram: "https://t.me/uzmedex", instagram: "https://instagram.com/uzmedex",
    facebook: "https://facebook.com/uzmedex", youtube: "https://youtube.com/@uzmedex",
  });
  const setK = (k, v) => setContacts(c => ({ ...c, [k]: v }));
  const saveContacts = () => cmsOp(() => setContacts(contacts), toast, "Контакты сохранены");

  return (
    <div>
      <div className="adm-page-head"><div className="adm-page-title">Настройки</div></div>
      <div className="adm-tabs">
        {[["crm","CRM / amoCRM"],["contacts","Контакты"]].map(([k,l]) => (
          <div key={k} className={`adm-tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {tab === "crm" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Настройки CRM интеграции</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <div className="adm-field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <label style={{ fontWeight: 600, fontSize: 13 }}>Включить CRM интеграцию</label>
                <input type="checkbox" checked={!!crm.enabled} onChange={e => setC("enabled", e.target.checked)} style={{ width: 18, height: 18 }} />
              </div>
              <Field label="Режим" hint="proxy — через n8n/Make.com; direct — напрямую через API">
                <select className="adm-select" value={crm.mode || "proxy"} onChange={e => setC("mode", e.target.value)}>
                  <option value="proxy">Proxy (через webhook)</option>
                  <option value="direct">Direct API</option>
                </select>
              </Field>
              {crm.mode === "proxy" || !crm.mode ? (
                <Field label="URL прокси (n8n / Make.com webhook)">
                  <input className="adm-input" type="url" value={crm.proxyUrl || ""} onChange={e => setC("proxyUrl", e.target.value)} placeholder="https://hook.eu1.make.com/xxx" />
                </Field>
              ) : (
                <>
                  <Field label="Поддомен amoCRM"><input className="adm-input" value={crm.subdomain || ""} onChange={e => setC("subdomain", e.target.value)} placeholder="yourcompany.amocrm.ru" /></Field>
                  <Field label="Access Token"><input className="adm-input" type="password" value={crm.token || ""} onChange={e => setC("token", e.target.value)} /></Field>
                </>
              )}
              <div className="adm-form-row">
                <Field label="Pipeline ID"><input className="adm-input" value={crm.pipelineId || ""} onChange={e => setC("pipelineId", e.target.value)} /></Field>
                <Field label="Status ID"><input className="adm-input" value={crm.statusId || ""} onChange={e => setC("statusId", e.target.value)} /></Field>
              </div>
              <hr className="adm-divider" />
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Уведомления Telegram</div>
              <div className="adm-form-row">
                <Field label="Bot Token"><input className="adm-input" type="password" value={crm.telegramToken || ""} onChange={e => setC("telegramToken", e.target.value)} /></Field>
                <Field label="Chat ID"><input className="adm-input" value={crm.telegramChatId || ""} onChange={e => setC("telegramChatId", e.target.value)} /></Field>
              </div>
              <button className="btn btn-primary" onClick={saveCrm}><AdminIcon name="save" size={14} /> Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Контактная информация</span></div>
          <div className="adm-card-body">
            <div className="adm-form">
              <div className="adm-form-row">
                <Field label="Основной телефон"><input className="adm-input" value={contacts.phone} onChange={e => setK("phone", e.target.value)} /></Field>
                <Field label="Отдел продаж"><input className="adm-input" value={contacts.phone2} onChange={e => setK("phone2", e.target.value)} /></Field>
              </div>
              <Field label="Email"><input className="adm-input" type="email" value={contacts.email} onChange={e => setK("email", e.target.value)} /></Field>
              <Field label="Адрес"><textarea className="adm-textarea" rows={2} value={contacts.address} onChange={e => setK("address", e.target.value)} /></Field>
              <div className="adm-form-row">
                <Field label="Telegram"><input className="adm-input" value={contacts.telegram} onChange={e => setK("telegram", e.target.value)} placeholder="@username" /></Field>
                <Field label="Instagram"><input className="adm-input" value={contacts.instagram} onChange={e => setK("instagram", e.target.value)} /></Field>
              </div>
              <div className="adm-form-row">
                <Field label="Facebook"><input className="adm-input" value={contacts.facebook} onChange={e => setK("facebook", e.target.value)} /></Field>
                <Field label="YouTube"><input className="adm-input" value={contacts.youtube} onChange={e => setK("youtube", e.target.value)} /></Field>
              </div>
              <button className="btn btn-primary" onClick={saveContacts}><AdminIcon name="save" size={14} /> Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
window.AdminMisc = AdminMisc;
