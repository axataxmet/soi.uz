/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Направления медицины (spec-categories, A3) */
function AdminCatalogSpecs() {
  const { useState, useMemo } = React;
  const [items] = useCMS("spec_categories");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const filtered = useMemo(() => {
    const list = (items || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    if (!q) return list;
    const ql = q.toLowerCase();
    return list.filter(s => (s.ru || "").toLowerCase().includes(ql) || (s.slug || "").toLowerCase().includes(ql));
  }, [items, q]);

  const save = (item) => {
    if (!item.ru) { toast("Введите название", "error"); return false; }
    return cmsOp(() => window.CMS.put("spec_categories", { ...item }), toast,
      item._isNew ? "Направление добавлено" : "Направление обновлено", () => setEditing(null));
  };
  const del = (id) => cmsOp(() => window.CMS.remove("spec_categories", id), toast, "Направление удалено", () => setConfirm(null));

  const newItem = () => setEditing({ _isNew: true, ru: "", uz: "", en: "", slug: "", order: (items || []).length, active: true });

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Направления медицины</div>
          <div className="adm-page-sub">{filtered.length} направлений · вторая ось классификации товара</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Добавить</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head"><SearchInput value={q} onChange={setQ} placeholder="Поиск направления…" /></div>
        {!filtered.length
          ? <EmptyState title="Направлений нет" action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Добавить</button>} />
          : <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Направление</th><th>Slug</th><th>Порядок</th><th>Статус</th><th className="actions"></th></tr></thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="adm-cell-main">{s.ru}</div>
                        {(s.uz || s.en) && <div className="adm-cell-sub">{[s.uz, s.en].filter(Boolean).join(" · ")}</div>}
                      </td>
                      <td className="adm-cell-sub">{s.slug || "—"}</td>
                      <td>{s.order || 0}</td>
                      <td>{s.active ? <span className="adm-badge adm-badge-ok">активно</span> : <span className="adm-badge">скрыто</span>}</td>
                      <td className="actions">
                        <div className="adm-flex">
                          <button className="btn btn-ghost btn-icon" onClick={() => setEditing({ ...s })}><AdminIcon name="edit" size={15} /></button>
                          <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(s.id)}><AdminIcon name="trash" size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._isNew ? "Новое направление" : "Редактировать направление"}
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && (
          <div className="adm-form">
            <Field label="Название (рус)" required>
              <input className="adm-input" value={editing.ru || ""} onChange={e => setEditing(i => ({ ...i, ru: e.target.value }))} placeholder="Кардиология" />
            </Field>
            <div className="adm-form-row">
              <Field label="Название (узб)"><input className="adm-input" value={editing.uz || ""} onChange={e => setEditing(i => ({ ...i, uz: e.target.value }))} /></Field>
              <Field label="Название (eng)"><input className="adm-input" value={editing.en || ""} onChange={e => setEditing(i => ({ ...i, en: e.target.value }))} /></Field>
            </div>
            <div className="adm-form-row">
              <Field label="Slug" hint="латиница, напр. cardiology (пусто = сгенерируется)">
                <input className="adm-input" value={editing.slug || ""} onChange={e => setEditing(i => ({ ...i, slug: e.target.value }))} placeholder="cardiology" />
              </Field>
              <Field label="Порядок">
                <input className="adm-input" type="number" value={editing.order ?? 0} onChange={e => setEditing(i => ({ ...i, order: parseInt(e.target.value, 10) || 0 }))} />
              </Field>
            </div>
            <Field label="Статус">
              <label className="adm-check"><input type="checkbox" checked={editing.active !== false} onChange={e => setEditing(i => ({ ...i, active: e.target.checked }))} /> Показывать на витрине</label>
            </Field>
          </div>
        )}
      </Modal>
      <Confirm open={!!confirm} danger message="Удалить направление?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminCatalogSpecs = AdminCatalogSpecs;
