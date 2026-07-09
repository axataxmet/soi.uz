/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Brands / Manufacturers */
function AdminManufacturers() {
  const { useState, useMemo } = React;
  const [items] = useCMS("brands");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const filtered = useMemo(() => {
    if (!q) return items || [];
    const ql = q.toLowerCase();
    return (items || []).filter(b => (b.ru || b.name || "").toLowerCase().includes(ql) || (b.country || "").toLowerCase().includes(ql));
  }, [items, q]);

  const save = (item) => {
    if (!item.ru) { toast("Введите название", "error"); return false; }
    return cmsOp(() => window.CMS.put("brands", { ...item }), toast,
      item._isNew ? "Бренд добавлен" : "Бренд обновлён", () => setEditing(null));
  };
  const del = (id) => cmsOp(() => window.CMS.remove("brands", id), toast, "Бренд удалён", () => setConfirm(null));

  const newItem = () => setEditing({ _isNew: true, ru: "", uz: "", en: "", country: "", logo: "", url: "" });

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Бренды и производители</div>
          <div className="adm-page-sub">{filtered.length} брендов</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={15} /> Добавить бренд</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <SearchInput value={q} onChange={setQ} placeholder="Поиск бренда…" />
        </div>

        {!filtered.length
          ? <EmptyState title="Брендов нет" action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Добавить</button>} />
          : <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Бренд</th><th>Страна</th><th>Логотип</th><th>Сайт</th><th className="actions"></th></tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div className="adm-cell-main">{b.ru || b.name}</div>
                        {b.uz && <div className="adm-cell-sub">{b.uz}</div>}
                      </td>
                      <td>{b.country || "—"}</td>
                      <td>
                        {b.logo
                          ? <img src={b.logo} alt="" style={{ height: 28, maxWidth: 70, objectFit: "contain" }} />
                          : <span className="adm-text-muted">нет</span>
                        }
                      </td>
                      <td>{b.url ? <a href={b.url} target="_blank" rel="noopener" style={{ color: "var(--c-primary)", fontSize: 12 }}>↗ сайт</a> : "—"}</td>
                      <td className="actions">
                        <div className="adm-flex">
                          <button className="btn btn-ghost btn-icon" onClick={() => setEditing({ ...b })}><AdminIcon name="edit" size={15} /></button>
                          <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(b.id)}><AdminIcon name="trash" size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._isNew ? "Новый бренд" : "Редактировать бренд"}
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button></>}>
        {editing && <BrandForm item={editing} onChange={setEditing} />}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить бренд?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

function BrandForm({ item, onChange }) {
  const set = (k, v) => onChange(i => ({ ...i, [k]: v }));
  return (
    <div className="adm-form">
      <Field label="Название (рус)" required>
        <input className="adm-input" value={item.ru || ""} onChange={e => set("ru", e.target.value)} />
      </Field>
      <div className="adm-form-row">
        <Field label="Название (узб)">
          <input className="adm-input" value={item.uz || ""} onChange={e => set("uz", e.target.value)} />
        </Field>
        <Field label="Название (eng)">
          <input className="adm-input" value={item.en || ""} onChange={e => set("en", e.target.value)} />
        </Field>
      </div>
      <div className="adm-form-row">
        <Field label="Страна происхождения">
          <input className="adm-input" value={item.country || ""} onChange={e => set("country", e.target.value)} placeholder="Германия, Китай…" />
        </Field>
        <Field label="Сайт производителя">
          <input className="adm-input" type="url" value={item.url || ""} onChange={e => set("url", e.target.value)} placeholder="https://…" />
        </Field>
      </div>
      <ImageUpload label="Логотип" value={item.logo || ""} onChange={v => set("logo", v)} />
    </div>
  );
}
window.AdminManufacturers = AdminManufacturers;
