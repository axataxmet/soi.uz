/* ============================================================
   Sog'liq Industriyasi — amoCRM integration module
   Supports two modes:
   1. "proxy"  — POST to a relay (n8n / Make.com / own backend)
                 that forwards to amoCRM (avoids CORS)
   2. "direct" — POST straight to amoCRM API
                 (works only if server sets Access-Control-Allow headers)
   ============================================================ */

const CRM_KEY = "uzmedex_crm_config";

/* ---- default config ---- */
const CRM_DEFAULTS = {
  enabled: false,
  mode: "proxy",             // "proxy" | "direct"
  proxyUrl: "",              // e.g. https://hook.eu1.make.com/xxxx
  subdomain: "",             // e.g. yourcompany.amocrm.ru
  token: "",                 // Bearer access token
  pipelineId: "",            // pipeline (воронка) ID
  statusId: "",              // initial status ID in pipeline
  responsibleUserId: "",     // assigned manager user ID (optional)
  telegramToken: "",         // optional — also notify via Telegram
  telegramChatId: "",
};

function crmGet() {
  try { return { ...CRM_DEFAULTS, ...JSON.parse(localStorage.getItem(CRM_KEY) || "{}") }; }
  catch (e) { return { ...CRM_DEFAULTS }; }
}

function crmSet(cfg) {
  localStorage.setItem(CRM_KEY, JSON.stringify({ ...crmGet(), ...cfg }));
}

/* ---- build amoCRM lead payload ---- */
function buildLeadPayload(formData, product, cfg) {
  const lead = {
    name: `КП: ${formData.org} — ${product ? product.ru : "Общий запрос"}`,
    pipeline_id: cfg.pipelineId ? parseInt(cfg.pipelineId) : undefined,
    status_id:   cfg.statusId   ? parseInt(cfg.statusId)   : undefined,
    responsible_user_id: cfg.responsibleUserId ? parseInt(cfg.responsibleUserId) : undefined,
    custom_fields_values: [
      { field_code: "PHONE",   values: [{ value: formData.phone, enum_code: "WORK" }] },
      { field_code: "EMAIL",   values: [{ value: formData.email, enum_code: "WORK" }] },
    ],
    _embedded: {
      contacts: [{
        name:  formData.name,
        first_name: formData.name.split(" ")[0] || formData.name,
        last_name:  formData.name.split(" ").slice(1).join(" ") || "",
        custom_fields_values: [
          { field_code: "PHONE", values: [{ value: formData.phone, enum_code: "WORK" }] },
          { field_code: "EMAIL", values: [{ value: formData.email, enum_code: "WORK" }] },
        ],
      }],
      companies: formData.org ? [{ name: formData.org }] : [],
    },
    tags_values: [{ name: "Sog'liq Industriyasi" }, { name: "КП-сайт" }],
  };

  // note with full details
  const noteText = [
    `Организация: ${formData.org}`,
    `Контакт: ${formData.name}`,
    `Телефон: ${formData.phone}`,
    `Email: ${formData.email}`,
    product ? `Товар: ${product.ru} (арт. ${product.sku || "—"})` : "",
    formData.services?.length ? `Услуги: ${formData.services.join(", ")}` : "",
    formData.comment ? `Комментарий: ${formData.comment}` : "",
    `Источник: Sog'liq Industriyasi — форма КП`,
  ].filter(Boolean).join("\n");

  return { lead, noteText };
}

/* ---- send to Telegram (optional notify) ---- */
async function notifyTelegram(formData, product, cfg) {
  if (!cfg.telegramToken || !cfg.telegramChatId) return;
  const text = [
    "🏥 <b>Новая заявка КП</b>",
    "",
    `<b>Организация:</b> ${formData.org}`,
    `<b>Контакт:</b> ${formData.name}`,
    `<b>Телефон:</b> <a href="tel:${formData.phone}">${formData.phone}</a>`,
    `<b>Email:</b> ${formData.email}`,
    product ? `<b>Товар:</b> ${product.ru}` : "",
    formData.services?.length ? `<b>Услуги:</b> ${formData.services.join(", ")}` : "",
    formData.comment ? `<b>Комментарий:</b> ${formData.comment}` : "",
    "",
    `<i>Источник: Sog'liq Industriyasi — форма КП</i>`,
  ].filter(Boolean).join("\n");

  await fetch(`https://api.telegram.org/bot${cfg.telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: cfg.telegramChatId, text, parse_mode: "HTML" }),
  });
}

/* ---- main send function ---- */
async function sendToCRM(formData, product) {
  const cfg = crmGet();
  if (!cfg.enabled) return { ok: true, skipped: true };

  const { lead, noteText } = buildLeadPayload(formData, product, cfg);
  let crmResult = null;

  try {
    if (cfg.mode === "proxy" && cfg.proxyUrl) {
      // POST full payload to relay webhook
      const res = await fetch(cfg.proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _type: "uzmedex_kp",
          lead,
          noteText,
          subdomain: cfg.subdomain,
          token:     cfg.token,
          pipelineId: cfg.pipelineId,
          statusId:   cfg.statusId,
        }),
      });
      crmResult = { ok: res.ok, status: res.status };

    } else if (cfg.mode === "direct" && cfg.subdomain && cfg.token) {
      // Direct API call (requires CORS headers on amoCRM side — use with custom domain proxy)
      const res = await fetch(`https://${cfg.subdomain}/api/v4/leads/complex`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cfg.token}`,
        },
        body: JSON.stringify([lead]),
      });
      crmResult = { ok: res.ok, status: res.status };
    }

    // also notify Telegram if configured
    await notifyTelegram(formData, product, cfg);

    return crmResult || { ok: true, skipped: true };

  } catch (err) {
    console.warn("CRM send error:", err.message);
    return { ok: false, error: err.message };
  }
}

/* ---- expose to window ---- */
window.UzCRM = { get: crmGet, set: crmSet, send: sendToCRM };
