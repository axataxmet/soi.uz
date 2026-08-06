/* ИНДУСТРИЯ ЗДОРОВЬЯ — cart, wishlist, compare, quote modal, compare bar, info pages */

function CartPage({ t, lang, store, go }) {
  const items = store.cart.map((c) => { const pr = window.DATA.PRODUCTS.find((p) => p.id === c.id); return pr ? { ...pr, q: c.q } : null; }).filter(Boolean);
  const subtotal = items.reduce((s, p) => s + p.price * p.q, 0);
  const contacts = useSiteContacts();

  function downloadCartPDF() {
    const date = new Date().toLocaleDateString("ru-RU");
    const num  = "КП-" + Date.now().toString().slice(-6);
    const rows = items.map((p, i) => {
      const name = tri(lang, p.ru, p.uz, p.en);
      return `<tr><td style="text-align:center">${i + 1}</td><td>${name}</td><td style="font-family:monospace;color:#555">${p.sku || "—"}</td><td style="text-align:center">${p.q}</td><td style="text-align:right">${fmtPrice(p.price)} ${t.currency}</td><td style="text-align:right;font-weight:700">${fmtPrice(p.price * p.q)} ${t.currency}</td></tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"/>
<title>${num} — ИНДУСТРИЯ ЗДОРОВЬЯ</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;font-size:var(--fs-3);color:#111;padding:40px}
  .logo{font-size:var(--fs-7);font-weight:900;color:var(--blue-600);letter-spacing:-1px}
  .logo span{color:var(--blue-600)}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;margin-bottom:24px}
  .meta{text-align:right;font-size:var(--fs-2);color:#555;line-height:1.6}
  h2{font-size:var(--fs-5);font-weight:700;margin-bottom:16px;color:var(--blue-600)}
  table{width:100%;border-collapse:collapse;margin-bottom:18px}
  th{background:var(--bg-2);padding:8px 10px;text-align:left;font-size:var(--fs-2);color:var(--blue-600);border:1px solid var(--line-soft)}
  td{padding:8px 10px;border:1px solid var(--line-soft);font-size:var(--fs-3)}
  .total-row td{font-size:var(--fs-4);font-weight:800;color:var(--blue-600);background:var(--bg-2)}
  .footer-note{font-size:var(--fs-1);color:#777;padding-top:12px;margin-top:12px}
  .stamp{border:2px solid var(--blue-600);border-radius:var(--r-sm);padding:8px 16px;display:inline-block;color:var(--blue-600);font-weight:700;font-size:var(--fs-3);margin-top:16px}
  @media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div>
    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcxLjgwOTcgNDQuODFDNjUuOTI1MyA0NC44MSA2MC4wOTg4IDQzLjY1MSA1NC42NjIxIDQxLjM5ODhDNDkuMjI1NSAzOS4xNDczIDQ0LjI4NTMgMzUuODQ2MyA0MC4xMjQ4IDMxLjY4NTJDMzUuOTYzNiAyNy41MjQ3IDMyLjY2MjYgMjIuNTg0NiAzMC40MTExIDE3LjE0OEMyOC4xNTg5IDExLjcxMTQgMjcgNS44ODQ1NSAyNyAwSDQ0LjUyNEM0NC41MjQgMy41ODMyNiA0NS4yMjk1IDcuMTMxNDMgNDYuNjAxIDEwLjQ0MTlDNDcuOTcxOSAxMy43NTI0IDQ5Ljk4MTggMTYuNzYwMyA1Mi41MTU4IDE5LjI5NDFDNTUuMDQ5OCAyMS44Mjc4IDU4LjA1NzcgMjMuODM3NCA2MS4zNjc5IDI1LjIwODlDNjQuNjc4NyAyNi41ODA0IDY4LjIyNjkgMjcuMjg2IDcxLjgwOTcgMjcuMjg2VjQ0LjgxWiIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzIyMF84OTIpIj48L3BhdGg+CjxwYXRoIGQ9Ik0wIDI3QzUuODg0NDEgMjcgMTEuNzExNiAyOC4xNTg5IDE3LjE0ODMgMzAuNDExMkMyMi41ODQ5IDMyLjY2MjcgMjcuNTI0NCAzNS45NjM2IDMxLjY4NTYgNDAuMTI0OEMzNS44NDY4IDQ0LjI4NTMgMzkuMTQ3IDQ5LjIyNTUgNDEuMzk5MiA1NC42NjIxQzQzLjY1MDcgNjAuMDk4OCA0NC44MDk3IDY1LjkyNTMgNDQuODA5NyA3MS44MDk3SDI3LjI4NjRDMjcuMjg2NCA2OC4yMjY5IDI2LjU4MDEgNjQuNjc4NyAyNS4yMDkzIDYxLjM2NzlDMjMuODM3OCA1OC4wNTc3IDIxLjgyNzggNTUuMDQ5OCAxOS4yOTQ1IDUyLjUxNThDMTYuNzYwNiA0OS45ODE4IDEzLjc1MjcgNDcuOTcyNiAxMC40NDE4IDQ2LjYwMTFDNy4xMzE2NCA0NS4yMjk1IDMuNTgzNDcgNDQuNTI0IDAgNDQuNTI0VjI3WiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsXzIyMF84OTIpIj48L3BhdGg+CjxwYXRoIGQ9Ik0wIDQ0LjgxQzUuODg0NDEgNDQuODEgMTEuNzExNiA0My42NTEgMTcuMTQ4MyA0MS4zOTg4QzIyLjU4NDkgMzkuMTQ3MyAyNy41MjQ0IDM1Ljg0NjMgMzEuNjg1NiAzMS42ODUxQzM1Ljg0NjggMjcuNTI0NyAzOS4xNDcgMjIuNTg0NiA0MS4zOTkyIDE3LjE0OEM0My42NTA3IDExLjcxMTQgNDQuODA5NyA1Ljg4NDU1IDQ0LjgwOTcgMEgyNy4yODY0QzI3LjI4NjQgMy41ODMyNiAyNi41ODAxIDcuMTMxNDMgMjUuMjA5MyAxMC40NDE5QzIzLjgzNzggMTMuNzUyNCAyMS44Mjc4IDE2Ljc2MDMgMTkuMjk0NSAxOS4yOTQxQzE2Ljc2MDYgMjEuODI3OCAxMy43NTI3IDIzLjgzNzQgMTAuNDQxOCAyNS4yMDg5QzcuMTMxNjQgMjYuNTgwNCAzLjU4MzQ3IDI3LjI4NiAwIDI3LjI4NlY0NC44MVoiIGZpbGw9InVybCgjcGFpbnQyX3JhZGlhbF8yMjBfODkyKSI+PC9wYXRoPgo8cGF0aCBkPSJNNzEuODA5NyAyN0M2NS45MjUzIDI3IDYwLjA5ODggMjguMTU4OSA1NC42NjIxIDMwLjQxMTJDNDkuMjI1NSAzMi42NjI3IDQ0LjI4NTMgMzUuOTYzNiA0MC4xMjQ4IDQwLjEyNDhDMzUuOTYzNiA0NC4yODUzIDMyLjY2MjYgNDkuMjI1NSAzMC40MTExIDU0LjY2MjFDMjguMTU4OSA2MC4wOTg4IDI3IDY1LjkyNTMgMjcgNzEuODA5N0g0NC41MjRDNDQuNTI0IDY4LjIyNjkgNDUuMjI5NSA2NC42Nzg3IDQ2LjYwMSA2MS4zNjc5QzQ3Ljk3MTkgNTguMDU3NyA0OS45ODE4IDU1LjA0OTggNTIuNTE1OCA1Mi41MTU4QzU1LjA0OTggNDkuOTgxOCA1OC4wNTc3IDQ3Ljk3MjYgNjEuMzY3OSA0Ni42MDExQzY0LjY3ODcgNDUuMjI5NSA2OC4yMjY5IDQ0LjUyNCA3MS44MDk3IDQ0LjUyNFYyN1oiIGZpbGw9InVybCgjcGFpbnQzX3JhZGlhbF8yMjBfODkyKSI+PC9wYXRoPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDBfcmFkaWFsXzIyMF84OTIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTcuMzc3KSByb3RhdGUoMTgwKSBzY2FsZSg3MC4zNzcgNzAuMzc3MSkiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzBFNEFDNiI+PC9zdG9wPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MV9yYWRpYWxfMjIwXzg5MiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuNTY3MSA3MS44MDk3KSBzY2FsZSg3MC4zNzcxKSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEU0QUM2Ij48L3N0b3A+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQyX3JhZGlhbF8yMjBfODkyIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNS41NjcxKSBzY2FsZSg3MC4zNzcxIDcwLjM3NzEpIj4KPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwRTRBQzYiPjwvc3RvcD4KPC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDNfcmFkaWFsXzIyMF84OTIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTcuMzc3IDcxLjgwOTcpIHJvdGF0ZSgxODApIHNjYWxlKDcwLjM3NyA3MC4zNzcxKSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEU0QUM2Ij48L3N0b3A+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+" style="height:44px;width:44px;display:block" alt="SOI" />
    <div style="font-size:var(--fs-1);color:#555;margin-top:4px">${contacts.address}<br>
    ${contacts.phone} · ${contacts.email}</div>
  </div>
  <div class="meta">
    <strong style="font-size:var(--fs-4)">${num}</strong><br>
    Дата: ${date}<br>
    Действителен: 14 дней
  </div>
</div>
<h2>Коммерческое предложение</h2>
<table>
  <tr><th style="width:36px;text-align:center">№</th><th>Наименование</th><th>Артикул</th><th style="text-align:center">Кол-во</th><th style="text-align:right">Цена</th><th style="text-align:right">Сумма</th></tr>
  ${rows}
  <tr class="total-row"><td colspan="5" style="text-align:right">Итого</td><td style="text-align:right">${fmtPrice(subtotal)} ${t.currency}</td></tr>
</table>
<div class="footer-note">
  Цены указаны без НДС и носят справочный характер. Для получения актуального коммерческого предложения менеджер ИНДУСТРИЯ ЗДОРОВЬЯ свяжется с вами в течение одного рабочего дня.
</div>
<div class="stamp">ИНДУСТРИЯ ЗДОРОВЬЯ · Коммерческое предложение</div>
</body></html>`;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) { alert(lang === "uz" ? "Brauzer pop-up oynani bloklab qoʻydi" : lang === "en" ? "Browser blocked the popup" : "Браузер заблокировал всплывающее окно. Разрешите всплывающие окна."); return; }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 400);
  }

  if (items.length === 0) {
    return (
      <div className="wrap cart-page">
        <h1>{t.cart_title}</h1>
        <div className="empty">
          <div className="e-ic"><Icon name="cart" size={32} /></div>
          <h3>{t.cart_empty}</h3>
          <p>{t.cart_empty_sub}</p>
          <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => go("catalog", {})}>
            <Icon name="grid" size={18} />{t.cart_to_catalog}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap cart-page">
      <h1>{t.cart_title} <span style={{ color: "var(--slate-400)", fontWeight: 700, fontSize: 20 }}>· {store.cartCount}</span></h1>
      <div className="cart-layout">
        <div>
          <div className="cart-items">
            {items.map((p) => {
              const name = tri(lang, p.ru, p.uz, p.en);
              return (
                <div key={p.id} className="cart-row">
                  <div className="cr-img" onClick={() => go("product", { id: p.id })} style={{ cursor: "pointer" }}>
                    <ProductPlaceholder product={p} t={t} lang={lang} />
                  </div>
                  <div>
                    <h4 className="cr-name" onClick={() => go("product", { id: p.id })}>{name}</h4>
                    <div className="cr-meta">
                      <span className="card-sku mono">{t.sku} {p.sku}</span>
                      <StockTag stock={p.stock} t={t} />
                    </div>
                  </div>
                  <div className="cr-right">
                    <Price value={p.price * p.q} t={t} size="sm" />
                    <QtyStepper value={p.q} onChange={(v) => store.setQty(p.id, v)} size="sm" />
                    <button className="cr-del" onClick={() => store.removeFromCart(p.id)}>
                      <Icon name="trash" size={15} />{lang === "uz" ? "Oʻchirish" : lang === "en" ? "Remove" : "Удалить"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="cart-clear-link" onClick={() => store.clearCart()}>
            <Icon name="trash" size={15} />{t.cart_clear}
          </button>
        </div>

        <div className="cart-sum">
          <h3>{t.cart_total}</h3>
          <div className="sum-row"><span>{t.cart_subtotal} ({store.cartCount})</span><span className="mono" style={{ fontWeight: 700 }}>{fmtPrice(subtotal)} {t.currency}</span></div>
          <div className="sum-row total">
            <span>{t.cart_total}</span>
            <div style={{ textAlign: "right" }}>
              <div className="st-val">{fmtPrice(subtotal)} <span style={{ fontSize: 15, color: "var(--slate-500)", fontWeight: 600 }}>{t.currency}</span></div>
              <div className="sum-vat">{t.cart_vat}</div>
            </div>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={() => window.__openQuote && window.__openQuote()}>
            {t.cart_checkout}<Icon name="arrowRight" size={18} />
          </button>
          <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={downloadCartPDF}>
            <Icon name="doc" size={18} />{lang === "uz" ? "KP ni PDF sifatida yuklash" : lang === "en" ? "Export quote as PDF" : "Скачать КП в PDF"}
          </button>
          <div className="cart-note">
            <Icon name="shield" size={18} />
            <span>{t.cart_note}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleListPage({ t, lang, store, go, ids, title, emptyTitle, emptyIcon }) {
  const items = ids.map((id) => window.DATA.PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  return (
    <div className="wrap cart-page">
      <h1>{title} {items.length > 0 && <span style={{ color: "var(--slate-400)", fontWeight: 700, fontSize: 20 }}>· {items.length}</span>}</h1>
      {items.length === 0 ? (
        <div className="empty">
          <div className="e-ic"><Icon name={emptyIcon} size={32} /></div>
          <h3>{emptyTitle}</h3>
          <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => go("catalog", {})}>
            <Icon name="grid" size={18} />{t.cart_to_catalog}
          </button>
        </div>
      ) : (
        <div className="cat-grid-p">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} t={t} lang={lang} store={store} onOpen={(pr) => go("product", { id: pr.id })} />
          ))}
        </div>
      )}
    </div>
  );
}

function ComparePage({ t, lang, store, go }) {
  const items = store.compare.map((id) => window.DATA.PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  if (items.length === 0) {
    return <SimpleListPage t={t} lang={lang} store={store} go={go} ids={[]} title={t.compare}
      emptyTitle={lang === "uz" ? "Taqqoslash boʻsh" : lang === "en" ? "Compare list is empty" : "Список сравнения пуст"} emptyIcon="compare" />;
  }
  // collect spec keys
  const keys = [];
  items.forEach((p) => p.specs.forEach((s) => { const k = tri(lang, s.kr, s.ku, s.ke); if (!keys.includes(k)) keys.push(k); }));
  return (
    <div className="wrap cart-page">
      <h1>{t.compare} <span style={{ color: "var(--slate-400)", fontWeight: 700, fontSize: 20 }}>· {items.length}</span></h1>
      <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 16, background: "#fff" }}>
        <table className="spec-table" style={{ minWidth: 200 + items.length * 240 }}>
          <tbody>
            <tr>
              <td style={{ width: 200 }}></td>
              {items.map((p) => (
                <td key={p.id} style={{ width: 240, verticalAlign: "top" }}>
                  <div style={{ borderRadius: 11, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 12, cursor: "pointer" }} onClick={() => go("product", { id: p.id })}>
                    <ProductPlaceholder product={p} t={t} lang={lang} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, marginBottom: 8, cursor: "pointer" }} onClick={() => go("product", { id: p.id })}>{tri(lang, p.ru, p.uz, p.en)}</div>
                  <Price value={p.price} old={p.old} t={t} size="sm" />
                  <button className="btn btn-primary" style={{ height: 40, marginTop: 10, fontSize: 13 }} onClick={() => store.addToCart(p.id, 1)}>
                    <Icon name="cart" size={16} />{t.buy}
                  </button>
                  <button className="cr-del" style={{ marginTop: 10 }} onClick={() => store.toggleCompare(p.id)}>
                    <Icon name="x" size={14} />{lang === "uz" ? "Olib tashlash" : lang === "en" ? "Remove" : "Убрать"}
                  </button>
                </td>
              ))}
            </tr>
            <tr><td colSpan={items.length + 1} style={{ paddingTop: 18, fontWeight: 800, color: "var(--slate-500)", textTransform: "uppercase", fontSize: 12, letterSpacing: ".04em" }}>{t.cat_brand} / {t.in_stock}</td></tr>
            <tr><td>{t.spec_brand}</td>{items.map((p) => <td key={p.id} style={{ fontWeight: 600 }}>{brandName(p.brand)}</td>)}</tr>
            <tr><td>{t.cat_availability}</td>{items.map((p) => <td key={p.id}><StockTag stock={p.stock} t={t} /></td>)}</tr>
            {keys.map((k) => (
              <tr key={k}>
                <td>{k}</td>
                {items.map((p) => {
                  const s = p.specs.find((x) => (tri(lang, x.kr, x.ku, x.ke)) === k);
                  return <td key={p.id} style={{ fontWeight: 600 }}>{s ? (lang === "en" && s.ve ? s.ve : s.v) : "—"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="cart-clear-link" onClick={() => store.clearCompare()}><Icon name="trash" size={15} />{t.compare_clear}</button>
    </div>
  );
}

function CompareBar({ t, lang, store, go }) {
  const items = store.compare.map((id) => window.DATA.PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  return (
    <div className={"cmpbar " + (items.length > 0 ? "show" : "")}>
      <div className="wrap">
        <div className="cm-tx">{t.compare_bar} <span>{items.length}</span></div>
        <div className="cm-thumbs">
          {items.map((p) => (
            <div key={p.id} className="cm-th">
              <ProductPlaceholder product={p} t={t} lang={lang} />
              <button className="x" onClick={() => store.toggleCompare(p.id)}><Icon name="x" size={11} /></button>
            </div>
          ))}
        </div>
        <div className="cm-act">
          <button className="cm-clear" onClick={() => store.clearCompare()}>{t.compare_clear}</button>
          <button className="btn btn-cyan" style={{ height: 44 }} onClick={() => go("compare")}>
            <Icon name="compare" size={18} />{t.compare_open}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuoteModal({ t, lang, product, onClose }) {
  const contacts = useSiteContacts();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [crmStatus, setCrmStatus] = useState(null); // null | "ok" | "error"
  const [services, setServices] = useState({ install: false, training: false, service: false, leasing: false });
  const [formData, setFormData] = useState({ org: "", name: "", phone: "", email: "", comment: "" });
  const lv = (ru, uz, en) => lang==="uz" ? uz : lang==="en" ? en : ru;

  const SERVICE_OPTS = [
    { key:"install",  label: lv("Монтаж и пусконаладка", "Montaj va ishga tushirish", "Installation & commissioning") },
    { key:"training", label: lv("Обучение персонала",   "Xodimlarni o'qitish",       "Staff training") },
    { key:"service",  label: lv("Сервисный контракт",   "Servis shartnomasi",        "Service contract") },
    { key:"leasing",  label: lv("Рассрочка / лизинг",   "Bo'lib to'lash",            "Instalment / leasing") },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.target);
    const data = {
      org:     fd.get("org")     || "",
      name:    fd.get("name")    || "",
      phone:   fd.get("phone")   || "",
      email:   fd.get("email")   || "",
      inn:     fd.get("inn")     || "",
      city:    fd.get("city")    || "",
      tz:      (fd.get("tz") && fd.get("tz").name) || "",
      comment: fd.get("comment") || "",
      services: SERVICE_OPTS.filter(s => services[s.key]).map(s => s.label),
    };
    setFormData(data);

    // send to CRM if configured
    if (window.UzCRM) {
      const res = await window.UzCRM.send(data, product);
      setCrmStatus(res.ok ? "ok" : "error");
    }

    setSending(false);
    setSent(true);
  }

  function downloadPDF() {
    const date = new Date().toLocaleDateString("ru-RU");
    const num  = "КП-" + Date.now().toString().slice(-6);
    const activeServices = SERVICE_OPTS.filter(s => services[s.key]).map(s => s.label);
    const productName = product ? tri(lang, product.ru, product.uz, product.en) : "";

    const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"/>
<title>${num} — ИНДУСТРИЯ ЗДОРОВЬЯ</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;font-size:var(--fs-3);color:#111;padding:40px}
  .logo{font-size:var(--fs-7);font-weight:900;color:var(--blue-600);letter-spacing:-1px}
  .logo span{color:var(--blue-600)}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;margin-bottom:24px}
  .meta{text-align:right;font-size:var(--fs-2);color:#555;line-height:1.6}
  h2{font-size:var(--fs-5);font-weight:700;margin-bottom:16px;color:var(--blue-600)}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  th{background:var(--bg-2);padding:8px 10px;text-align:left;font-size:var(--fs-2);color:var(--blue-600);border:1px solid var(--line-soft)}
  td{padding:8px 10px;border:1px solid var(--line-soft);font-size:var(--fs-3)}
  .services span{display:inline-block;background:var(--blue-50);color:var(--blue-600);border-radius:4px;padding:2px 8px;font-size:var(--fs-1);margin:2px 3px 2px 0}
  .footer-note{font-size:var(--fs-1);color:#777;padding-top:12px;margin-top:12px}
  .stamp{border:2px solid var(--blue-600);border-radius:var(--r-sm);padding:8px 16px;display:inline-block;color:var(--blue-600);font-weight:700;font-size:var(--fs-3);margin-top:16px}
  @media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div>
    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcxLjgwOTcgNDQuODFDNjUuOTI1MyA0NC44MSA2MC4wOTg4IDQzLjY1MSA1NC42NjIxIDQxLjM5ODhDNDkuMjI1NSAzOS4xNDczIDQ0LjI4NTMgMzUuODQ2MyA0MC4xMjQ4IDMxLjY4NTJDMzUuOTYzNiAyNy41MjQ3IDMyLjY2MjYgMjIuNTg0NiAzMC40MTExIDE3LjE0OEMyOC4xNTg5IDExLjcxMTQgMjcgNS44ODQ1NSAyNyAwSDQ0LjUyNEM0NC41MjQgMy41ODMyNiA0NS4yMjk1IDcuMTMxNDMgNDYuNjAxIDEwLjQ0MTlDNDcuOTcxOSAxMy43NTI0IDQ5Ljk4MTggMTYuNzYwMyA1Mi41MTU4IDE5LjI5NDFDNTUuMDQ5OCAyMS44Mjc4IDU4LjA1NzcgMjMuODM3NCA2MS4zNjc5IDI1LjIwODlDNjQuNjc4NyAyNi41ODA0IDY4LjIyNjkgMjcuMjg2IDcxLjgwOTcgMjcuMjg2VjQ0LjgxWiIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzIyMF84OTIpIj48L3BhdGg+CjxwYXRoIGQ9Ik0wIDI3QzUuODg0NDEgMjcgMTEuNzExNiAyOC4xNTg5IDE3LjE0ODMgMzAuNDExMkMyMi41ODQ5IDMyLjY2MjcgMjcuNTI0NCAzNS45NjM2IDMxLjY4NTYgNDAuMTI0OEMzNS44NDY4IDQ0LjI4NTMgMzkuMTQ3IDQ5LjIyNTUgNDEuMzk5MiA1NC42NjIxQzQzLjY1MDcgNjAuMDk4OCA0NC44MDk3IDY1LjkyNTMgNDQuODA5NyA3MS44MDk3SDI3LjI4NjRDMjcuMjg2NCA2OC4yMjY5IDI2LjU4MDEgNjQuNjc4NyAyNS4yMDkzIDYxLjM2NzlDMjMuODM3OCA1OC4wNTc3IDIxLjgyNzggNTUuMDQ5OCAxOS4yOTQ1IDUyLjUxNThDMTYuNzYwNiA0OS45ODE4IDEzLjc1MjcgNDcuOTcyNiAxMC40NDE4IDQ2LjYwMTFDNy4xMzE2NCA0NS4yMjk1IDMuNTgzNDcgNDQuNTI0IDAgNDQuNTI0VjI3WiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsXzIyMF84OTIpIj48L3BhdGg+CjxwYXRoIGQ9Ik0wIDQ0LjgxQzUuODg0NDEgNDQuODEgMTEuNzExNiA0My42NTEgMTcuMTQ4MyA0MS4zOTg4QzIyLjU4NDkgMzkuMTQ3MyAyNy41MjQ0IDM1Ljg0NjMgMzEuNjg1NiAzMS42ODUxQzM1Ljg0NjggMjcuNTI0NyAzOS4xNDcgMjIuNTg0NiA0MS4zOTkyIDE3LjE0OEM0My42NTA3IDExLjcxMTQgNDQuODA5NyA1Ljg4NDU1IDQ0LjgwOTcgMEgyNy4yODY0QzI3LjI4NjQgMy41ODMyNiAyNi41ODAxIDcuMTMxNDMgMjUuMjA5MyAxMC40NDE5QzIzLjgzNzggMTMuNzUyNCAyMS44Mjc4IDE2Ljc2MDMgMTkuMjk0NSAxOS4yOTQxQzE2Ljc2MDYgMjEuODI3OCAxMy43NTI3IDIzLjgzNzQgMTAuNDQxOCAyNS4yMDg5QzcuMTMxNjQgMjYuNTgwNCAzLjU4MzQ3IDI3LjI4NiAwIDI3LjI4NlY0NC44MVoiIGZpbGw9InVybCgjcGFpbnQyX3JhZGlhbF8yMjBfODkyKSI+PC9wYXRoPgo8cGF0aCBkPSJNNzEuODA5NyAyN0M2NS45MjUzIDI3IDYwLjA5ODggMjguMTU4OSA1NC42NjIxIDMwLjQxMTJDNDkuMjI1NSAzMi42NjI3IDQ0LjI4NTMgMzUuOTYzNiA0MC4xMjQ4IDQwLjEyNDhDMzUuOTYzNiA0NC4yODUzIDMyLjY2MjYgNDkuMjI1NSAzMC40MTExIDU0LjY2MjFDMjguMTU4OSA2MC4wOTg4IDI3IDY1LjkyNTMgMjcgNzEuODA5N0g0NC41MjRDNDQuNTI0IDY4LjIyNjkgNDUuMjI5NSA2NC42Nzg3IDQ2LjYwMSA2MS4zNjc5QzQ3Ljk3MTkgNTguMDU3NyA0OS45ODE4IDU1LjA0OTggNTIuNTE1OCA1Mi41MTU4QzU1LjA0OTggNDkuOTgxOCA1OC4wNTc3IDQ3Ljk3MjYgNjEuMzY3OSA0Ni42MDExQzY0LjY3ODcgNDUuMjI5NSA2OC4yMjY5IDQ0LjUyNCA3MS44MDk3IDQ0LjUyNFYyN1oiIGZpbGw9InVybCgjcGFpbnQzX3JhZGlhbF8yMjBfODkyKSI+PC9wYXRoPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDBfcmFkaWFsXzIyMF84OTIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTcuMzc3KSByb3RhdGUoMTgwKSBzY2FsZSg3MC4zNzcgNzAuMzc3MSkiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzBFNEFDNiI+PC9zdG9wPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MV9yYWRpYWxfMjIwXzg5MiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMjUuNTY3MSA3MS44MDk3KSBzY2FsZSg3MC4zNzcxKSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEU0QUM2Ij48L3N0b3A+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQyX3JhZGlhbF8yMjBfODkyIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNS41NjcxKSBzY2FsZSg3MC4zNzcxIDcwLjM3NzEpIj4KPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwRTRBQzYiPjwvc3RvcD4KPC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDNfcmFkaWFsXzIyMF84OTIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTcuMzc3IDcxLjgwOTcpIHJvdGF0ZSgxODApIHNjYWxlKDcwLjM3NyA3MC4zNzcxKSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEU0QUM2Ij48L3N0b3A+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+" style="height:44px;width:44px;display:block" alt="SOI" />
    <div style="font-size:var(--fs-1);color:#555;margin-top:4px">${contacts.address}<br>
    ${contacts.phone} · ${contacts.email}</div>
  </div>
  <div class="meta">
    <strong style="font-size:var(--fs-4)">${num}</strong><br>
    Дата: ${date}<br>
    Действителен: 14 дней
  </div>
</div>

<h2>Запрос коммерческого предложения</h2>
<table>
  <tr><th colspan="2">Контактные данные</th></tr>
  <tr><td style="width:40%;color:#555">Организация</td><td>${formData.org}</td></tr>
  <tr><td style="color:#555">Контактное лицо</td><td>${formData.name}</td></tr>
  <tr><td style="color:#555">Телефон</td><td>${formData.phone}</td></tr>
  <tr><td style="color:#555">E-mail</td><td>${formData.email}</td></tr>
  ${formData.inn ? `<tr><td style="color:#555">ИНН</td><td>${formData.inn}</td></tr>` : ""}
  ${formData.city ? `<tr><td style="color:#555">Город</td><td>${formData.city}</td></tr>` : ""}
  ${formData.tz ? `<tr><td style="color:#555">Файл ТЗ</td><td>${formData.tz}</td></tr>` : ""}
</table>

${productName ? `<table>
  <tr><th colspan="2">Запрашиваемое оборудование</th></tr>
  <tr><td style="width:40%;color:#555">Наименование</td><td>${productName}</td></tr>
  ${product.sku ? `<tr><td style="color:#555">Артикул</td><td>${product.sku}</td></tr>` : ""}
  ${product.brand ? `<tr><td style="color:#555">Производитель</td><td>${product.brand}</td></tr>` : ""}
</table>` : ""}

${activeServices.length > 0 ? `<table>
  <tr><th>Дополнительные услуги</th></tr>
  <tr><td><div class="services">${activeServices.map(s=>`<span>${s}</span>`).join("")}</div></td></tr>
</table>` : ""}

${formData.comment ? `<table>
  <tr><th>Комментарий</th></tr>
  <tr><td>${formData.comment}</td></tr>
</table>` : ""}

<div class="footer-note">
  Настоящий документ является запросом коммерческого предложения. Менеджер ИНДУСТРИЯ ЗДОРОВЬЯ свяжется с вами в течение одного рабочего дня для уточнения деталей и предоставления актуального прайса.
</div>
<div class="stamp">ИНДУСТРИЯ ЗДОРОВЬЯ · Запрос принят</div>
</body></html>`;

    const w = window.open("", "_blank", "width=800,height=900");
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 400);
  }

  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="modal-head">
              <button className="modal-close" onClick={onClose}><Icon name="x" size={20} /></button>
              <h3>{t.quote_title}</h3>
              <p>{t.quote_sub}</p>
            </div>
            <div className="modal-body">
              {product && (
                <div style={{ display:"flex", gap:12, alignItems:"center", background:"var(--bg)", borderRadius:11, padding:12, marginBottom:18 }}>
                  <div style={{ width:56, height:50, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                    <ProductPlaceholder product={product} t={t} lang={lang} />
                  </div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{tri(lang, product.ru, product.uz, product.en)}</div>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="field"><label>{t.quote_org}</label><input name="org" required placeholder={lv("Название клиники / организации", "Klinika / tashkilot nomi", "Clinic / organization name")} /></div>
                <div className="field-row">
                  <div className="field"><label>{t.quote_name}</label><input name="name" required /></div>
                  <div className="field"><label>{t.quote_phone}</label><input name="phone" required placeholder="+998 __ ___-__-__" /></div>
                </div>
                <div className="field"><label>{t.quote_email}</label><input name="email" type="email" placeholder="mail@clinic.uz" /></div>
                <div className="field-row">
                  <div className="field"><label>{lv("ИНН", "STIR", "TIN")}</label><input name="inn" placeholder="000000000" /></div>
                  <div className="field"><label>{lv("Город", "Shahar", "City")}</label><input name="city" placeholder={lv("Ташкент", "Toshkent", "Tashkent")} /></div>
                </div>
                <div className="field">
                  <label>{lv("Техническое задание (ТЗ)", "Texnik topshiriq (TT)", "Technical spec (file)")}</label>
                  <input name="tz" type="file" className="qm-file" />
                  <div className="qm-file-hint">{lv("Прикрепите спецификацию или ТЗ для тендера — PDF, Word, Excel", "Tender uchun spetsifikatsiya yoki TT biriktiring — PDF, Word, Excel", "Attach a specification or tender spec — PDF, Word, Excel")}</div>
                </div>
                <div className="field">
                  <label>{lv("Дополнительные услуги", "Qo'shimcha xizmatlar", "Additional services")}</label>
                  <div className="qm-services">
                    {SERVICE_OPTS.map(s => (
                      <label key={s.key} className={"qm-svc " + (services[s.key] ? "on" : "")}>
                        <input type="checkbox" checked={services[s.key]}
                          onChange={() => setServices(prev => ({...prev, [s.key]: !prev[s.key]}))}
                          style={{ display:"none" }} />
                        <span className="qm-svc-ic"><Icon name="check" size={12} sw={2.5} /></span>
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>{t.quote_comment}</label>
                  <textarea name="comment" rows={4} placeholder={lv(
                    "Укажите количество единиц, сроки, особые требования к комплектации...",
                    "Miqdor, muddatlar va maxsus talablarni ko'rsating...",
                    "Specify quantity, delivery timeline, special requirements..."
                  )} style={{ resize:"vertical", minHeight:96 }}></textarea>
                </div>
                <label className="qm-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{lv("Согласен с политикой конфиденциальности и обработкой персональных данных.", "Maxfiylik siyosati va shaxsiy ma'lumotlarni qayta ishlashga roziman.", "I agree with the privacy policy and processing of personal data.")}</span>
                </label>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={sending}>
                  {sending
                    ? <><span className="btn-spin" />{lv("Отправка…", "Yuborilmoqda…", "Sending…")}</>
                    : t.quote_send}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="modal-ok">
              <div className="ok-ic"><Icon name="check" size={34} sw={2.4} /></div>
              <h3>{t.quote_ok_t}</h3>
              <p>{t.quote_ok_d}</p>
              {crmStatus === "ok" && (
                <div className="crm-badge ok">
                  <Icon name="check" size={15} sw={2.5} />
                  {lv("Заявка передана в CRM", "Ariza CRM ga yuborildi", "Lead sent to CRM")}
                </div>
              )}
              {crmStatus === "error" && (
                <div className="crm-badge err">
                  <Icon name="bell" size={15} />
                  {lv("CRM недоступна — проверьте настройки", "CRM ishlamayapti — sozlamalarni tekshiring", "CRM unavailable — check settings")}
                </div>
              )}
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginTop:8 }}>
                <button className="btn btn-outline btn-lg" onClick={downloadPDF} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Icon name="doc" size={18} />
                  {lv("Скачать PDF", "PDF yuklab olish", "Download PDF")}
                </button>
                <button className="btn btn-primary btn-lg" onClick={onClose}>{t.quote_close}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPage({ t, lang, go, params }) {
  const titles = {
    about: t.about, service: t.foot_warranty, suppliers: t.for_suppliers, contacts: t.foot_contacts,
    payment: t.foot_payment, shipping: t.foot_shipping, docs: t.foot_docs,
  };
  return (
    <div className="wrap" style={{ padding: "8px 0 60px" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{titles[params.p] || ""}</span>
      </div>
      <div style={{ maxWidth: 760 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.02em", marginTop: 8 }}>{titles[params.p] || ""}</h1>
        <p style={{ color: "var(--slate-600)", fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>
          {lang === "uz"
            ? "Ushbu boʻlim namoyish prototipida toʻldirilmagan. SOG’LIQ INDUSTRIYASI — Oʻzbekiston tibbiyot muassasalari uchun uskunalar yetkazib beruvchi platforma."
            : lang === "en"
            ? "This section is not filled in the demo prototype. HEALTH INDUSTRY is a platform supplying equipment for medical institutions in Uzbekistan."
            : "Этот раздел не заполнен в демонстрационном прототипе. ИНДУСТРИЯ ЗДОРОВЬЯ — платформа поставки оборудования для медицинских учреждений Узбекистана."}
        </p>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => go("catalog", {})}><Icon name="grid" size={18} />{t.cart_to_catalog}</button>
      </div>
    </div>
  );
}

Object.assign(window, { CartPage, SimpleListPage, ComparePage, CompareBar, QuoteModal });
