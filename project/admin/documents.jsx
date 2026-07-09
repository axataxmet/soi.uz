/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Documents (REST-backed, files in MinIO) */
function AdminDocuments() {
  const { useState, useMemo, useRef } = React;
  const [items] = useCMS("documents");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const tx = (o) => typeof o === "string" ? o : (o && (o.ru || o.uz || o.en)) || "";
  const CAT_LABEL = { company: "Документы компании", clients: "Документы для клиентов", service: "Документы по сервису", legal: "Правовая информация" };

  const filtered = useMemo(() => {
    let list = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (q) { const ql = q.toLowerCase(); list = list.filter(d => tx(d.title).toLowerCase().includes(ql) || (d.cat || "").toLowerCase().includes(ql)); }
    return list;
  }, [items, q]);

  const save = (it) => {
    if (!tx(it.title).trim()) { toast("Введите название документа", "error"); return; }
    if (!(it.file && (it.file.data || it.file.url))) { toast("Прикрепите файл", "error"); return; }
    cmsOp(() => window.CMS.put("documents", { ...it }), toast, it._isNew ? "Документ добавлен" : "Сохранено", () => setEditing(null));
  };
  const del = (id) => cmsOp(() => window.CMS.remove("documents", id), toast, "Документ удалён", () => setConfirm(null));
  const newItem = () => setEditing({ _isNew: true, title: { ru: "", uz: "", en: "" }, cat: "company", file: null, order: 0 });

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Документы</div>
          <div className="adm-page-sub">{(items || []).length} документов</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Добавить</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head"><SearchInput value={q} onChange={setQ} placeholder="Поиск по названию / категории…" /></div>
        {!filtered.length
          ? <EmptyState title="Документов нет" sub="Добавьте сертификаты, лицензии, каталоги (PDF)"
              action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Добавить</button>} />
          : <div className="adm-table-wrap"><table className="adm-table">
              <thead><tr><th>Название</th><th>Категория</th><th>Файл</th><th>Порядок</th><th className="actions"></th></tr></thead>
              <tbody>{filtered.map(d => (
                <tr key={d.id}>
                  <td><div className="adm-cell-main truncate" style={{ maxWidth: 320 }}>{tx(d.title) || "—"}</div></td>
                  <td><span className="badge badge-blue">{CAT_LABEL[d.cat] || d.cat || "—"}</span></td>
                  <td>{d.file
                    ? <span style={{ fontSize: 12, color: "var(--c-success,#16a34a)" }}>{(d.fileType || "").includes("pdf") ? "PDF" : "Файл"}{d.fileSize ? ` · ${Math.round(d.fileSize / 1024)} KB` : ""}</span>
                    : <span style={{ color: "var(--c-faint,#94a3b8)" }}>—</span>}</td>
                  <td>{d.order || 0}</td>
                  <td className="actions"><div className="adm-flex">
                    <button className="btn btn-ghost btn-icon" onClick={() => setEditing({ ...d, title: typeof d.title === "string" ? { ru: d.title } : { ru: "", uz: "", en: "", ...d.title } })}><AdminIcon name="edit" size={15} /></button>
                    <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(d.id)}><AdminIcon name="trash" size={15} /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._isNew ? "Новый документ" : "Документ"} size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && <DocForm item={editing} onChange={setEditing} />}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить документ безвозвратно?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

function DocForm({ item, onChange }) {
  const { useState, useRef } = React;
  const [tab, setTab] = useState("ru");
  const fileRef = useRef(null);
  const set = (k, v) => onChange(i => ({ ...i, [k]: v }));
  const setT = (l, v) => onChange(i => ({ ...i, title: { ...(i.title || {}), [l]: v } }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) { alert("Файл слишком большой (макс. 15 МБ)"); return; }
    const reader = new FileReader();
    reader.onload = ev => set("file", { data: ev.target.result, name: f.name, type: f.type, size: f.size });
    reader.readAsDataURL(f);
  };

  return (
    <div className="adm-form">
      <div className="adm-form-row">
        <Field label="Категория" hint="определяет раздел на странице «Документы компании»">
          <select className="adm-select" value={item.cat || "company"} onChange={e => set("cat", e.target.value)}>
            <option value="company">Документы компании</option>
            <option value="clients">Документы для клиентов</option>
            <option value="service">Документы по сервису</option>
            <option value="legal">Правовая информация</option>
          </select>
        </Field>
        <Field label="Порядок">
          <input className="adm-input" type="number" value={item.order || 0} onChange={e => set("order", parseInt(e.target.value) || 0)} />
        </Field>
      </div>

      <div className="adm-tabs" style={{ marginBottom: 12 }}>
        {["ru", "uz", "en"].map(l => (
          <div key={l} className={`adm-tab ${tab === l ? "active" : ""}`} onClick={() => setTab(l)}>{{ ru: "Рус", uz: "Узб", en: "Eng" }[l]}</div>
        ))}
      </div>
      <Field label="Название документа" required>
        <input className="adm-input" value={item.title?.[tab] || ""} onChange={e => setT(tab, e.target.value)} placeholder="Лицензия / сертификат / каталог" />
      </Field>

      <Field label="Файл" hint="PDF или изображение — до 15 МБ">
        <div className={`adm-upload-zone${item.file ? " has-img" : ""}`} style={{ cursor: "pointer", minHeight: 96 }} onClick={() => fileRef.current?.click()}>
          {item.file ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <AdminIcon name="filetext" size={30} color="var(--c-primary,#1757c8)" />
              <div style={{ fontSize: 12, fontWeight: 600, maxWidth: 240, wordBreak: "break-all", textAlign: "center" }}>{item.file.name || "файл"}</div>
              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); set("file", null); }}><AdminIcon name="x" size={12} /> Удалить</button>
            </div>
          ) : (<><AdminIcon name="upload" size={22} /><div style={{ marginTop: 8, fontSize: 13 }}>Нажмите для загрузки</div></>)}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={handleFile} />
      </Field>
    </div>
  );
}

window.AdminDocuments = AdminDocuments;
