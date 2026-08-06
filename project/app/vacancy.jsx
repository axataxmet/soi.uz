/* UzMedEx — CRM Settings page (admin-only, accessed from /info?p=crm-settings) */
function CrmSettingsPage({ t, lang, go }) {
  const { useState: useCfgState, useEffect: useCfgEffect } = React;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  const [cfg, setCfg] = useCfgState(() => window.UzCRM ? window.UzCRM.get() : {});
  const [saved, setSaved] = useCfgState(false);
  const [testing, setTesting] = useCfgState(false);
  const [testResult, setTestResult] = useCfgState(null);

  function save() {
    if (window.UzCRM) window.UzCRM.set(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function test() {
    setTesting(true);
    setTestResult(null);
    const fakeData = { org: "Тест-клиника", name: "Тест Менеджер", phone: "+998000000000", email: "test@uzmedex.uz", comment: "Тестовая заявка", services: [] };
    const res = await window.UzCRM.send(fakeData, null);
    setTestResult(res);
    setTesting(false);
  }

  const inp = "height:44px;border:1.5px solid var(--line);border-radius:var(--r-sm);padding:0 14px;font-size:var(--fs-4);font-family:var(--font);width:100%;box-sizing:border-box;outline:none;background:var(--surface);color:var(--ink)";

  return (
    <div className="wrap" style={{ padding: "8px 0 70px", maxWidth: 680, margin: "0 auto" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{lv("Настройки CRM", "CRM sozlamalari", "CRM Settings")}</span>
      </div>

      <h1 className="info-title">{lv("Интеграция с amoCRM", "amoCRM integratsiyasi", "amoCRM Integration")}</h1>
      <p style={{ color: "var(--slate-500)", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
        {lv(
          "При каждой отправке формы КП автоматически создаётся лид и контакт в amoCRM.",
          "Har bir KP formasi yuborilganda amoCRM da avtomatik lead va kontakt yaratiladi.",
          "Each KP form submission automatically creates a lead and contact in amoCRM."
        )}
      </p>

      {/* enable toggle */}
      <div className="crm-cfg-block">
        <label className="crm-toggle">
          <input type="checkbox" checked={!!cfg.enabled} onChange={e => setCfg(c=>({...c, enabled:e.target.checked}))} />
          <span className="crm-toggle-track"><span className="crm-toggle-knob" /></span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{lv("Интеграция включена", "Integratsiya yoqilgan", "Integration enabled")}</span>
        </label>
      </div>

      <div className="crm-cfg-block">
        <div className="crm-cfg-label">{lv("Режим подключения", "Ulanish rejimi", "Connection mode")}</div>
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          {[["proxy", lv("Через webhook-прокси", "Webhook-proxy orqali", "Via webhook proxy")],
            ["direct", lv("Напрямую к API", "API ga to'g'ridan-to'g'ri", "Direct API")]].map(([v,l]) => (
            <button key={v} className={"btn " + (cfg.mode===v?"btn-primary":"btn-outline")}
              style={{ fontSize:13.5, height:42 }}
              onClick={() => setCfg(c=>({...c, mode:v}))}>{l}</button>
          ))}
        </div>
        {cfg.mode === "direct" && (
          <div className="crm-note warn">{lv("⚠️ Прямой режим требует настройки CORS-заголовков на стороне сервера amoCRM или обратного прокси. Для большинства случаев рекомендуется прокси-режим.", "⚠️ To'g'ridan-to'g'ri rejim CORS sozlamalarini talab qiladi.", "⚠️ Direct mode requires CORS headers from amoCRM or a reverse proxy. Proxy mode recommended.")}</div>
        )}
      </div>

      {cfg.mode === "proxy" && (
        <div className="crm-cfg-block">
          <div className="crm-cfg-label">Webhook URL <span className="crm-tag">Make.com / n8n / собственный сервер</span></div>
          <input style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:8 }}
            placeholder="https://hook.eu1.make.com/xxxxxxxx"
            value={cfg.proxyUrl || ""} onChange={e=>setCfg(c=>({...c,proxyUrl:e.target.value}))} />
          <div className="crm-note">{lv("Make.com (Integromat) / n8n принимает POST, создаёт лид в amoCRM через нативный модуль — CORS не нужен.", "Make.com yoki n8n POST qabul qilib, amoCRM da lead yaratadi.", "Make.com / n8n accepts POST and creates leads in amoCRM via native module — no CORS needed.")}</div>
        </div>
      )}

      {cfg.mode === "direct" && (
        <>
          <div className="crm-cfg-block">
            <div className="crm-cfg-label">amoCRM Subdomain</div>
            <input style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:8 }}
              placeholder="yourcompany.amocrm.ru"
              value={cfg.subdomain || ""} onChange={e=>setCfg(c=>({...c,subdomain:e.target.value}))} />
          </div>
          <div className="crm-cfg-block">
            <div className="crm-cfg-label">Access Token (Bearer)</div>
            <input type="password" style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:8 }}
              placeholder="eyJ0eXAiOiJKV1QiLCJhbGci..."
              value={cfg.token || ""} onChange={e=>setCfg(c=>({...c,token:e.target.value}))} />
          </div>
        </>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div className="crm-cfg-block">
          <div className="crm-cfg-label">Pipeline ID {lv("(воронка)", "(voronka)", "(pipeline)")}</div>
          <input className="mono" style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:8 }}
            placeholder="1234567" value={cfg.pipelineId || ""} onChange={e=>setCfg(c=>({...c,pipelineId:e.target.value}))} />
        </div>
        <div className="crm-cfg-block">
          <div className="crm-cfg-label">Status ID {lv("(этап)", "(bosqich)", "(stage)")}</div>
          <input className="mono" style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:8 }}
            placeholder="1234568" value={cfg.statusId || ""} onChange={e=>setCfg(c=>({...c,statusId:e.target.value}))} />
        </div>
      </div>

      <div className="crm-cfg-block" style={{ borderTop:"2px solid var(--line)", paddingTop:20, marginTop:8 }}>
        <div className="crm-cfg-label" style={{ fontSize:15, fontWeight:800, color:"var(--ink)" }}>
          Telegram {lv("(уведомление о новых заявках)", "(yangi arizalar bildirishnomasi)", "(new lead notifications)")}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:12 }}>
          <div>
            <div className="crm-cfg-label">Bot Token</div>
            <input type="password" style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:6 }}
              placeholder="1234567890:AAFxxxxxx"
              value={cfg.telegramToken || ""} onChange={e=>setCfg(c=>({...c,telegramToken:e.target.value}))} />
          </div>
          <div>
            <div className="crm-cfg-label">Chat ID</div>
            <input className="mono" style={{ ...Object.fromEntries(inp.split(";").map(s=>s.split(":").map(x=>x.trim())).filter(a=>a[0])), marginTop:6 }}
              placeholder="-1001234567890"
              value={cfg.telegramChatId || ""} onChange={e=>setCfg(c=>({...c,telegramChatId:e.target.value}))} />
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:12, marginTop:28, flexWrap:"wrap" }}>
        <button className="btn btn-primary btn-lg" style={{ minWidth:160 }} onClick={save}>
          {saved ? <><Icon name="check" size={18} />{lv("Сохранено!", "Saqlandi!", "Saved!")}</> : <>{lv("Сохранить", "Saqlash", "Save settings")}</>}
        </button>
        <button className="btn btn-outline btn-lg" onClick={test} disabled={testing}>
          {testing ? lv("Тест…", "Test…", "Testing…") : lv("Тест-заявка", "Test so'rov", "Send test lead")}
        </button>
      </div>

      {testResult && (
        <div className={"crm-note " + (testResult.ok ? "ok" : "warn")} style={{ marginTop:16 }}>
          {testResult.ok
            ? lv("✅ Тест прошёл — проверьте amoCRM и Telegram", "✅ Test muvaffaqiyatli — amoCRM va Telegramni tekshiring", "✅ Test passed — check amoCRM and Telegram")
            : lv(`❌ Ошибка: ${testResult.error || "нет ответа от сервера"}`, `❌ Xato: ${testResult.error||""}`, `❌ Error: ${testResult.error||"no response"}`)}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CrmSettingsPage });
