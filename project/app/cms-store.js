/* ============================================================
   ИНДУСТРИЯ ЗДОРОВЬЯ — lead submission
   The amoCRM/Telegram relay used to run here, in the visitor's own browser,
   reading config from localStorage — which meant it could never actually see
   the config an admin saved (that only exists in the admin's own browser).
   The relay now runs server-side (NestJS SubmissionsService → CrmService),
   triggered automatically when a submission is created below. Config is
   managed in admin/misc.jsx via the admin-only /api/crm/config route.
   ============================================================ */

/* ---- main send function: persist the lead; CRM relay happens server-side ---- */
async function sendToCRM(formData, product) {
  try {
    if (window.api && window.api.create) {
      await window.api.create("submissions", {
        name: formData.name || formData.org || "—",
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        message: [formData.comment, (formData.services || []).join(", ")].filter(Boolean).join(" · ") || undefined,
        source: product ? ("КП: " + (product.ru || product.sku || product.id || "товар")) : (formData.source || "Форма заявки"),
        meta: {
          org: formData.org || undefined, inn: formData.inn || undefined, city: formData.city || undefined,
          services: (formData.services && formData.services.length) ? formData.services : undefined,
          productId: product && product.id, productName: product && (product.ru || product.name),
        },
      });
      return { ok: true };
    }
    return { ok: false, error: "API недоступен" };
  } catch (e) {
    console.warn("[submissions] save failed:", e && e.message);
    return { ok: false, error: (e && e.message) || "Ошибка отправки" };
  }
}

/* ---- expose to window ---- */
window.UzCRM = { send: sendToCRM };
