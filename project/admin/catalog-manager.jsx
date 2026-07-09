/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — A3 type tree editor (category → subcategory → group) + attrSchema editor.
   Replaces the legacy flat localStorage category manager. Uses window.CatalogAPI. */
const CM_TYPES = [["text", "Текст"], ["textarea", "Многострочный"], ["number", "Число"], ["boolean", "Да/Нет"], ["select", "Выбор"], ["multiselect", "Мультивыбор"]];

function slugify(s) {
  return String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function AttrSchemaEditor({ schema, onChange }) {
  const fields = (schema && schema.fields) || [];
  const setFields = (f) => onChange({ fields: f });
  const add = () => setFields([...fields, { key: "", label: { ru: "", uz: "", en: "" }, type: "text", unit: "", required: false, options: [] }]);
  const upd = (i, patch) => setFields(fields.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  const rm = (i) => setFields(fields.filter((_, idx) => idx !== i));

  return (
    <div style={{ marginTop: 6 }}>
      <div className="adm-form-label" style={{ marginBottom: 6 }}>
        Поля атрибутов ({fields.length}) <span className="adm-text-muted" style={{ fontWeight: 400 }}>— наследуются вниз по дереву</span>
      </div>
      {fields.length === 0 && <div className="adm-text-muted" style={{ fontSize: 13, marginBottom: 8 }}>Нет полей на этом уровне.</div>}
      {fields.map((f, i) => (
        <div key={i} style={{ border: "1px solid var(--adm-border, #e5e7eb)", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <div className="adm-form-row">
            <Field label="Ключ"><input className="adm-input" value={f.key} onChange={e => upd(i, { key: e.target.value })} placeholder="channels" /></Field>
            <Field label="Тип"><select className="adm-input" value={f.type} onChange={e => upd(i, { type: e.target.value })}>{CM_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
          </div>
          <div className="adm-form-row">
            <Field label="Метка (рус)"><input className="adm-input" value={(f.label && f.label.ru) || ""} onChange={e => upd(i, { label: { ...f.label, ru: e.target.value } })} placeholder="Каналов" /></Field>
            <Field label="Ед. изм."><input className="adm-input" value={f.unit || ""} onChange={e => upd(i, { unit: e.target.value })} placeholder="шт" /></Field>
          </div>
          <div className="adm-form-row">
            <Field label="Метка (узб)"><input className="adm-input" value={(f.label && f.label.uz) || ""} onChange={e => upd(i, { label: { ...f.label, uz: e.target.value } })} /></Field>
            <Field label="Метка (eng)"><input className="adm-input" value={(f.label && f.label.en) || ""} onChange={e => upd(i, { label: { ...f.label, en: e.target.value } })} /></Field>
          </div>
          {(f.type === "select" || f.type === "multiselect") && (
            <Field label="Варианты (через запятую)">
              <input className="adm-input" value={(f.options || []).join(", ")} onChange={e => upd(i, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="USB, Wi-Fi, Bluetooth" />
            </Field>
          )}
          <div className="adm-flex" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
            <label className="adm-check"><input type="checkbox" checked={!!f.required} onChange={e => upd(i, { required: e.target.checked })} /> Обязательное</label>
            <button className="btn btn-ghost btn-icon" onClick={() => rm(i)}><AdminIcon name="trash" size={14} /></button>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary btn-sm" onClick={add}><AdminIcon name="plus" size={13} /> Добавить поле</button>
    </div>
  );
}

function AdminCatalogManager() {
  const { useState, useEffect } = React;
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null); // { level, mode, parentId, data }
  const [confirm, setConfirm] = useState(null); // { level, id }
  const toast = useToast();

  const load = () => {
    setLoading(true);
    window.CatalogAPI.getTree()
      .then(t => { setTree(t || []); setLoading(false); })
      .catch(e => { toast(e.message || "Ошибка загрузки", "error"); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const openNew = (level, parentId) => setEditing({
    level, mode: "new", parentId,
    data: { name: { ru: "", uz: "", en: "" }, slug: "", order: 0, active: true, attrSchema: { fields: [] } },
  });
  const openEdit = (level, node) => setEditing({
    level, mode: "edit",
    data: {
      id: node.id, name: node.name || { ru: "", uz: "", en: "" }, slug: node.slug || "",
      order: node.order || 0, active: node.active !== false,
      attrSchema: node.attrSchema && node.attrSchema.fields ? node.attrSchema : { fields: [] },
    },
  });

  const save = () => {
    const e = editing, d = e.data;
    if (!d.name.ru) { toast("Введите название (рус)", "error"); return; }
    const prefix = e.level === "category" ? "cat" : e.level === "subcategory" ? "sub" : "grp";
    const body = {
      name: d.name,
      slug: d.slug || slugify(d.name.en || d.name.ru) || (prefix + "-" + Date.now()),
      order: d.order,
      attrSchema: { fields: (d.attrSchema.fields || []).filter(f => f.key && f.key.trim()) },
    };
    if (e.level !== "subcategory") body.active = d.active; // subcategory has no active flag

    let p;
    if (e.level === "category") p = e.mode === "new" ? window.CatalogAPI.createCategory(body) : window.CatalogAPI.updateCategory(d.id, body);
    else if (e.level === "subcategory") { if (e.mode === "new") body.categoryId = e.parentId; p = e.mode === "new" ? window.CatalogAPI.createSubcategory(body) : window.CatalogAPI.updateSubcategory(d.id, body); }
    else { if (e.mode === "new") body.subcatId = e.parentId; p = e.mode === "new" ? window.CatalogAPI.createGroup(body) : window.CatalogAPI.updateGroup(d.id, body); }

    p.then(() => { toast(e.mode === "new" ? "Создано" : "Сохранено"); setEditing(null); load(); })
      .catch(err => toast(err.message || "Ошибка сохранения", "error"));
  };

  const del = () => {
    const c = confirm;
    const fn = c.level === "category" ? window.CatalogAPI.deleteCategory : c.level === "subcategory" ? window.CatalogAPI.deleteSubcategory : window.CatalogAPI.deleteGroup;
    fn(c.id).then(() => { toast("Удалено"); setConfirm(null); load(); })
      .catch(err => { toast(err.message || "Ошибка удаления", "error"); setConfirm(null); });
  };

  const levelTitle = { category: "категория", subcategory: "подкатегория", group: "товарная группа" };

  const Row = ({ level, node, parentId, indent, hasKids }) => (
    <div className="adm-flex" style={{ alignItems: "center", gap: 8, padding: "9px 12px", marginLeft: indent, borderBottom: "1px solid var(--adm-border,#eef0f3)" }}>
      {hasKids
        ? <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => toggle(node.id)}><AdminIcon name={expanded[node.id] ? "chevronDown" : "chevronRight"} size={14} /></button>
        : <span style={{ width: 24, display: "inline-block" }} />}
      <div style={{ flex: 1 }}>
        <div className="adm-cell-main">{(node.name && node.name.ru) || node.slug}</div>
        <div className="adm-cell-sub" style={{ fontSize: 12 }}>
          <code>{node.slug}</code>
          {level === "group" && <> · {node.productCount || 0} тов. · {node.visible ? <span style={{ color: "var(--c-primary,#2563eb)" }}>видима</span> : "скрыта (&lt;3)"}</>}
          {node.attrSchema && node.attrSchema.fields && node.attrSchema.fields.length > 0 && <> · {node.attrSchema.fields.length} полей</>}
        </div>
      </div>
      {level === "category" && <button className="btn btn-ghost btn-sm" onClick={() => openNew("subcategory", node.id)}><AdminIcon name="plus" size={13} /> подкат.</button>}
      {level === "subcategory" && <button className="btn btn-ghost btn-sm" onClick={() => openNew("group", node.id)}><AdminIcon name="plus" size={13} /> группа</button>}
      <button className="btn btn-ghost btn-icon" onClick={() => openEdit(level, node)}><AdminIcon name="edit" size={15} /></button>
      <button className="btn btn-ghost btn-icon" onClick={() => setConfirm({ level, id: node.id })}><AdminIcon name="trash" size={15} /></button>
    </div>
  );

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Дерево типов товара</div>
          <div className="adm-page-sub">Категория → подкатегория → товарная группа · схема атрибутов наследуется вниз</div>
        </div>
        <button className="btn btn-primary" onClick={() => openNew("category", null)}><AdminIcon name="plus" size={15} /> Категория</button>
      </div>

      <div className="adm-card">
        {loading
          ? <div style={{ padding: 40, textAlign: "center" }} className="adm-text-muted">Загрузка…</div>
          : !tree.length
            ? <EmptyState title="Дерево пустое" action={<button className="btn btn-primary" onClick={() => openNew("category", null)}><AdminIcon name="plus" size={14} /> Добавить категорию</button>} />
            : <div>
                {tree.map(cat => (
                  <div key={cat.id}>
                    <Row level="category" node={cat} indent={0} hasKids={(cat.subcategories || []).length > 0} />
                    {expanded[cat.id] && (cat.subcategories || []).map(sub => (
                      <div key={sub.id}>
                        <Row level="subcategory" node={sub} parentId={cat.id} indent={28} hasKids={(sub.groups || []).length > 0} />
                        {expanded[sub.id] && (sub.groups || []).map(g => (
                          <Row key={g.id} level="group" node={g} parentId={sub.id} indent={56} hasKids={false} />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
        }
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg"
        title={editing ? (editing.mode === "new" ? "Новая " : "Редактировать ") + (levelTitle[editing.level] || "") : ""}
        footer={<><button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button><button className="btn btn-primary" onClick={save}>Сохранить</button></>}>
        {editing && (
          <div className="adm-form">
            <Field label="Название (рус)" required>
              <input className="adm-input" value={editing.data.name.ru} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, name: { ...s.data.name, ru: e.target.value } } }))} />
            </Field>
            <div className="adm-form-row">
              <Field label="Название (узб)"><input className="adm-input" value={editing.data.name.uz} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, name: { ...s.data.name, uz: e.target.value } } }))} /></Field>
              <Field label="Название (eng)"><input className="adm-input" value={editing.data.name.en} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, name: { ...s.data.name, en: e.target.value } } }))} /></Field>
            </div>
            <div className="adm-form-row">
              <Field label="Slug" hint="латиница; пусто = сгенерируется"><input className="adm-input" value={editing.data.slug} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, slug: e.target.value } }))} /></Field>
              <Field label="Порядок"><input className="adm-input" type="number" value={editing.data.order} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, order: parseInt(e.target.value, 10) || 0 } }))} /></Field>
            </div>
            {editing.level !== "subcategory" && (
              <Field label="Статус"><label className="adm-check"><input type="checkbox" checked={editing.data.active} onChange={e => setEditing(s => ({ ...s, data: { ...s.data, active: e.target.checked } }))} /> Активна</label></Field>
            )}
            <div style={{ borderTop: "1px solid var(--adm-border,#eef0f3)", marginTop: 12, paddingTop: 10 }}>
              <AttrSchemaEditor schema={editing.data.attrSchema} onChange={sch => setEditing(s => ({ ...s, data: { ...s.data, attrSchema: sch } }))} />
            </div>
          </div>
        )}
      </Modal>

      <Confirm open={!!confirm} danger
        message={confirm ? `Удалить ${levelTitle[confirm.level]}? Вложенные элементы удалятся каскадно.` : ""}
        onConfirm={del} onCancel={() => setConfirm(null)} />
    </div>
  );
}
window.AdminCatalogManager = AdminCatalogManager;
