/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Import / Export */
function AdminImport() {
  const { useState, useRef } = React;
  const toast = useToast();
  const fileRef = useRef();
  const [importing, setImporting] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (msg, type = "info") => setLog(l => [...l, { msg, type, t: Date.now() }]);

  const importCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    let added = 0, skipped = 0;
    lines.slice(1).forEach(line => {
      const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
      if (!obj.ru && !obj.name) { skipped++; return; }
      const id = window.CMS.uid("imp");
      const r = window.CMS.put("products", {
        id,
        ru: obj.ru || obj.name,
        uz: obj.uz || "",
        en: obj.en || "",
        sku: obj.sku || obj.SKU || "",
        brand: obj.brand || obj.Brand || "",
        category: obj.category || obj.cat || "",
        price: parseFloat(obj.price) || 0,
        inStock: true,
        _cms: true,
        _created: Date.now(),
        _updated: Date.now(),
      });
      if (r && r.ok === false) { skipped++; return; }
      added++;
    });
    const hasErrors = added === 0 && skipped > 0;
    addLog(`Добавлено: ${added} товаров, пропущено: ${skipped}`, hasErrors ? "error" : "success");
    if (hasErrors) toast("Не удалось сохранить: хранилище браузера переполнено", "error");
    else toast(`Импортировано ${added} товаров`);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImporting(true);
    addLog(`Загружаем файл: ${f.name}`);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        if (f.name.endsWith(".csv")) {
          importCSV(ev.target.result);
        } else if (typeof XLSX !== "undefined") {
          const wb = XLSX.read(ev.target.result, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(ws);
          importCSV(csv);
        } else {
          addLog("XLSX библиотека не загружена", "error");
        }
      } catch (err) {
        addLog("Ошибка: " + err.message, "error");
        toast("Ошибка импорта", "error");
      } finally {
        setImporting(false);
        e.target.value = "";
      }
    };
    if (f.name.endsWith(".csv")) reader.readAsText(f, "utf-8");
    else reader.readAsBinaryString(f);
  };

  const exportProducts = () => {
    const items = window.CMS.list("products");
    const headers = ["id", "ru", "uz", "en", "sku", "brand", "category", "price"];
    const rows = items.map(p => headers.map(h => JSON.stringify(p[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "soi_products_" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    toast("Экспорт готов");
  };

  const wipeConfirm = () => {
    if (!confirm("Очистить ВСЕ данные CMS? Это действие нельзя отменить!")) return;
    window.CMS.wipeAll?.();
    toast("Все данные удалены");
    addLog("База данных очищена", "error");
  };

  return (
    <div>
      <div className="adm-page-head">
        <div className="adm-page-title">Импорт и экспорт</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="adm-card">
          <div className="adm-card-head"><AdminIcon name="import" size={16} color="var(--c-primary)" /><span className="adm-card-title">Импорт товаров</span></div>
          <div className="adm-card-body">
            <p style={{ fontSize: 13, color: "var(--c-muted)", marginBottom: 16 }}>
              Загрузите CSV или Excel файл с товарами. Обязательные колонки: <code>ru</code> (название), <code>sku</code> (артикул). Необязательные: <code>uz</code>, <code>en</code>, <code>brand</code>, <code>category</code>, <code>price</code>.
            </p>
            <div className="adm-upload-zone" onClick={() => fileRef.current.click()}>
              <AdminIcon name="upload" size={24} />
              <div style={{ marginTop: 8 }}>Нажмите для выбора CSV / XLSX</div>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFile} />
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => {
              const csv = "ru,sku,brand,category,price\nАппарат ИВЛ Mindray SV300,SV-300,Mindray,Анестезиология,0\nДефибриллятор Zoll R,ZOLL-R,Zoll,Кардиология,0";
              const blob = new Blob([csv], { type: "text/csv" });
              const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "template.csv"; a.click();
            }}>
              <AdminIcon name="copy" size={14} /> Скачать шаблон
            </button>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-head"><AdminIcon name="save" size={16} color="var(--c-success)" /><span className="adm-card-title">Экспорт данных</span></div>
          <div className="adm-card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-secondary" style={{ justifyContent: "flex-start" }} onClick={exportProducts}>
              <AdminIcon name="package" size={14} /> Экспорт товаров (CSV)
            </button>
            <hr className="adm-divider" />
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-danger)", marginBottom: 4 }}>Опасная зона</div>
            <button className="btn btn-danger" style={{ justifyContent: "flex-start" }} onClick={wipeConfirm}>
              <AdminIcon name="warning" size={14} /> Очистить все данные CMS
            </button>
          </div>
        </div>
      </div>

      {log.length > 0 && (
        <div className="adm-card" style={{ marginTop: 20 }}>
          <div className="adm-card-head"><span className="adm-card-title">Лог операций</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setLog([])}>Очистить</button>
          </div>
          <div className="adm-card-body" style={{ fontFamily: "monospace", fontSize: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {log.map(l => (
              <div key={l.t} style={{ color: l.type === "error" ? "var(--c-danger)" : l.type === "success" ? "var(--c-success)" : "var(--c-text)" }}>
                [{new Date(l.t).toLocaleTimeString()}] {l.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
window.AdminImport = AdminImport;
