/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — News management */
function AdminNews() {
  const { useState, useMemo } = React;
  const [items] = useCMS("news");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const PER = 20;

  const filtered = useMemo(() => {
    if (!q) return [...(items || [])].reverse();
    const ql = q.toLowerCase();
    return [...(items || [])].reverse().filter(n => (n.title?.ru || n.title || "").toLowerCase().includes(ql));
  }, [items, q]);

  const save = (item) => {
    const title = item.title?.ru || item.title || "";
    if (!title.trim()) { toast("Введите заголовок", "error"); return; }
    cmsOp(() => window.CMS.put("news", { ...item, _updated: Date.now() }), toast,
      item._isNew ? "Новость добавлена" : "Новость обновлена", () => setEditing(null));
  };
  const del = (id) => cmsOp(() => window.CMS.remove("news", id), toast, "Новость удалена", () => setConfirm(null));
  const publish = (item) => {
    cmsOp(() => window.CMS.put("news", { ...item, status: item.status === "published" ? "draft" : "published", _updated: Date.now() }),
      toast, item.status === "published" ? "Снято с публикации" : "Опубликовано");
  };

  const newItem = () => setEditing({
    _isNew: true,
    title: { ru: "", uz: "", en: "" },
    body: { ru: "", uz: "", en: "" },
    excerpt: { ru: "" },
    cover: "",
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
  });

  const paged = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Новости</div>
          <div className="adm-page-sub">{filtered.length} статей</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Новая статья</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <SearchInput value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Поиск по заголовку…" />
        </div>

        {!paged.length
          ? <EmptyState title="Новостей нет" action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Создать</button>} />
          : <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Заголовок</th><th>Дата</th><th>Статус</th><th className="actions"></th></tr></thead>
                <tbody>
                  {paged.map(n => {
                    const title = n.title?.ru || n.title || "Без заголовка";
                    const cover = n.cover || n.img || "";
                    return (
                      <tr key={n.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="adm-thumb-placeholder">
                              {cover ? <img src={cover} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} /> : <AdminIcon name="news" size={16} />}
                            </div>
                            <div>
                              <div className="adm-cell-main truncate" style={{ maxWidth: 320 }}>{title}</div>
                              {n.excerpt?.ru && <div className="adm-cell-sub truncate">{n.excerpt.ru}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{n.date || "—"}</td>
                        <td><StatusBadge status={n.status || "draft"} /></td>
                        <td className="actions">
                          <div className="adm-flex">
                            <button className="btn btn-ghost btn-sm" onClick={() => publish(n)}>
                              {n.status === "published" ? "Снять" : "Опубликовать"}
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => setEditing({ ...n, title: n.title && typeof n.title === "string" ? { ru: n.title } : (n.title || { ru: "" }), body: n.body && typeof n.body === "string" ? { ru: n.body } : (n.body || { ru: "" }), excerpt: n.excerpt || { ru: "" } })}>
                              <AdminIcon name="edit" size={15} />
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(n.id)}><AdminIcon name="trash" size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} total={filtered.length} perPage={PER} onChange={setPage} />
          </>
        }
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Редактировать новость" size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && <NewsForm item={editing} onChange={setEditing} />}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить новость?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

function NewsForm({ item, onChange }) {
  const { useState } = React;
  const [tab, setTab] = useState("ru");
  const setT = (lang, field, v) => onChange(i => ({ ...i, [field]: { ...(i[field] || {}), [lang]: v } }));
  const set = (k, v) => onChange(i => ({ ...i, [k]: v }));

  return (
    <div className="adm-form">
      <div className="adm-form-row">
        <Field label="Дата публикации">
          <input className="adm-input" type="date" value={item.date || ""} onChange={e => set("date", e.target.value)} />
        </Field>
        <Field label="Статус">
          <select className="adm-select" value={item.status || "draft"} onChange={e => set("status", e.target.value)}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
          </select>
        </Field>
      </div>

      <div className="adm-tabs" style={{ marginBottom: 12 }}>
        {["ru", "uz", "en"].map(l => <div key={l} className={`adm-tab ${tab === l ? "active" : ""}`} onClick={() => setTab(l)}>{{ru:"Рус",uz:"Узб",en:"Eng"}[l]}</div>)}
      </div>

      <Field label="Заголовок" required>
        <input className="adm-input" value={item.title?.[tab] || ""} onChange={e => setT(tab, "title", e.target.value)} />
      </Field>
      <Field label="Краткое описание">
        <textarea className="adm-textarea" rows={2} value={item.excerpt?.[tab] || ""} onChange={e => setT(tab, "excerpt", e.target.value)} />
      </Field>
      <Field label="Текст статьи">
        <RichTextEditor value={item.body?.[tab] || ""} onChange={v => setT(tab, "body", v)} minHeight={200} />
      </Field>

      <ImageUpload label="Обложка новости" value={item.cover || ""} onChange={v => set("cover", v)} />
    </div>
  );
}
window.AdminNews = AdminNews;
