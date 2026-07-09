/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Cases / Projects */
function AdminCases() {
  const { useState, useMemo } = React;
  const [items] = useCMS("cases");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [q, setQ] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    const list = [...(items || [])].reverse();
    if (!q) return list;
    const ql = q.toLowerCase();
    return list.filter(c => (c.title?.ru || c.title || "").toLowerCase().includes(ql) || (c.region || "").toLowerCase().includes(ql));
  }, [items, q]);

  const save = (item) => {
    const title = item.title?.ru || item.title || "";
    if (!title.trim()) { toast("Введите заголовок", "error"); return; }
    cmsOp(() => window.CMS.put("cases", { ...item, _updated: Date.now() }), toast, "Кейс сохранён", () => setEditing(null));
  };
  const del = (id) => cmsOp(() => window.CMS.remove("cases", id), toast, "Кейс удалён", () => setConfirm(null));

  const newItem = () => setEditing({
    _isNew: true,
    title: { ru: "", uz: "", en: "" },
    description: { ru: "" },
    tag: "",
    type: "gov",
    region: "",
    year: new Date().getFullYear().toString(),
    img: "",
    status: "published",
    _created: Date.now(),
  });

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Реализованные проекты</div>
          <div className="adm-page-sub">{filtered.length} кейсов</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Новый кейс</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <SearchInput value={q} onChange={setQ} placeholder="Поиск…" />
        </div>

        {!filtered.length
          ? <EmptyState title="Кейсов нет" action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Добавить</button>} />
          : <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Проект</th><th>Тег</th><th>Тип</th><th>Регион</th><th>Год</th><th>Статус</th><th className="actions"></th></tr></thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="adm-thumb-placeholder">
                            {c.img ? <img src={c.img} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} /> : <AdminIcon name="briefcase" size={16} />}
                          </div>
                          <div className="adm-cell-main truncate" style={{ maxWidth: 280 }}>{c.title?.ru || c.title || "—"}</div>
                        </div>
                      </td>
                      <td><span className="badge badge-blue">{c.tag || "—"}</span></td>
                      <td>{c.type === "private" ? "Частная клиника" : c.type === "gov" ? "Госучреждение" : "—"}</td>
                      <td>{c.region || "—"}</td>
                      <td>{c.year || "—"}</td>
                      <td><StatusBadge status={c.status || "draft"} /></td>
                      <td className="actions">
                        <div className="adm-flex">
                          <button className="btn btn-ghost btn-icon" onClick={() => setEditing({ ...c, title: typeof c.title === "string" ? { ru: c.title } : (c.title || { ru: "" }), description: typeof c.description === "string" ? { ru: c.description } : (c.description || { ru: "" }) })}><AdminIcon name="edit" size={15} /></button>
                          <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(c.id)}><AdminIcon name="trash" size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Редактировать кейс" size="lg"
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && (
          <div className="adm-form">
            <Field label="Заголовок (рус)" required>
              <input className="adm-input" value={editing.title?.ru || ""} onChange={e => setEditing(i => ({ ...i, title: { ...(i.title || {}), ru: e.target.value } }))} />
            </Field>
            <div className="adm-form-row">
              <Field label="Тег (произвольный, отображается на карточке)">
                <input className="adm-input" value={editing.tag || ""} onChange={e => setEditing(i => ({ ...i, tag: e.target.value }))} placeholder="Госучреждение, Частная клиника…" />
              </Field>
              <Field label="Регион">
                <input className="adm-input" value={editing.region || ""} onChange={e => setEditing(i => ({ ...i, region: e.target.value }))} placeholder="Ташкент" />
              </Field>
            </div>
            <div className="adm-form-row">
              <Field label="Тип" hint="определяет фильтр «Госучреждения / Частные клиники» на странице «Проекты»">
                <select className="adm-select" value={editing.type || "gov"} onChange={e => setEditing(i => ({ ...i, type: e.target.value }))}>
                  <option value="gov">Госучреждение</option>
                  <option value="private">Частная клиника</option>
                </select>
              </Field>
              <Field label="Год">
                <input className="adm-input" value={editing.year || ""} onChange={e => setEditing(i => ({ ...i, year: e.target.value }))} />
              </Field>
            </div>
            <div className="adm-form-row">
              <Field label="Статус">
                <select className="adm-select" value={editing.status || "published"} onChange={e => setEditing(i => ({ ...i, status: e.target.value }))}>
                  <option value="published">Опубликован</option>
                  <option value="draft">Черновик</option>
                </select>
              </Field>
            </div>
            <Field label="Описание">
              <textarea className="adm-textarea" rows={4} value={editing.description?.ru || ""} onChange={e => setEditing(i => ({ ...i, description: { ...(i.description || {}), ru: e.target.value } }))} />
            </Field>
            <ImageUpload label="Изображение" value={editing.img || ""} onChange={v => setEditing(i => ({ ...i, img: v }))} />
          </div>
        )}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить кейс?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminCases = AdminCases;
