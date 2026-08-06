/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — A3 type tree editor (category → subcategory → group) + attrSchema editor.
   Replaces the legacy flat localStorage category manager. Uses window.CatalogAPI. */
const CM_TYPES = [["text", "Текст"], ["textarea", "Многострочный"], ["number", "Число"], ["boolean", "Да/Нет"], ["select", "Выбор"], ["multiselect", "Мультивыбор"]];

/* Cyrillic→Latin map: without it, a name typed in Russian only (the common
   case — nobody types a slug by hand for node #80) produced an empty slug and
   silently fell back to a timestamp like "sub-1735689234567". Bulk-adding a
   list of Russian names, the whole point of the paste box below, would have
   hit that on every single row. */
var CM_TRANSLIT = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",
  о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
function slugify(s) {
  return String(s || "").toLowerCase().trim()
    .replace(/[а-яё]/g, function (c) { return CM_TRANSLIT[c] != null ? CM_TRANSLIT[c] : c; })
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

/* Bulk-add a whole list of subcategories or groups from one pasted block of
   text instead of the create-modal, one node at a time — the thing that made
   building out "Медицинское оборудование" (13 subcategories, 145 groups) mean
   asking a developer to script it against the API instead of just pasting a
   list here. One line per node: "Название" for Russian only (uz/en stay blank
   for the admin to fill later), or "Название | O'zbekcha | English" for all
   three at once. Creates run sequentially — the API has no bulk-insert route,
   and firing 145 POSTs in parallel would just as easily fail 145 times over
   from one dropped connection. */
function BulkAddModal({ open, level, count, onSubmit, onClose }) {
  const { useState } = React;
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total }

  const parse = () => text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [ru, uz, en] = line.split("|").map((s) => (s || "").trim());
    return { ru, uz: uz || "", en: en || "" };
  });
  const rows = parse();

  const submit = async () => {
    if (!rows.length) return;
    setBusy(true);
    for (let i = 0; i < rows.length; i++) {
      setProgress({ done: i, total: rows.length });
      try { await onSubmit(rows[i]); } catch (e) { /* one bad line shouldn't stop the rest */ }
    }
    setProgress({ done: rows.length, total: rows.length });
    setBusy(false);
    setText("");
    onClose(true);
  };

  return (
    <Modal open={open} onClose={() => !busy && onClose(false)} size="lg"
      title={"Массовое добавление" + (level ? ": " + level : "")}
      footer={<>
        <button className="btn btn-secondary" disabled={busy} onClick={() => onClose(false)}>Отмена</button>
        <button className="btn btn-primary" disabled={busy || !rows.length} onClick={submit}>
          {busy ? `Создаётся ${(progress && progress.done) || 0} / ${rows.length}…` : `Создать (${rows.length})`}
        </button>
      </>}>
      <div className="adm-form">
        <Field label="По одной позиции на строку" hint="Название — только русское, slug и остальные языки заполните позже. Название | O'zbekcha | English — сразу на трёх языках.">
          <textarea className="adm-input" rows={12} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={"Акушерство и гинекология\nАнестезиология и реанимация | Anesteziologiya va reanimatsiya | Anesthesiology and intensive care"} />
        </Field>
        <div className="adm-text-muted" style={{ fontSize: 13 }}>
          {rows.length ? `Будет создано: ${rows.length}. Порядок — сверху вниз, следом за уже существующими.` : "Вставьте список — по строке на позицию."}
        </div>
      </div>
    </Modal>
  );
}

function CmBadge(label, tone) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "1px 7px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, lineHeight: "16px",
      background: tone === "blue" ? "rgba(37,99,235,.1)" : tone === "green" ? "rgba(16,163,74,.1)" : "rgba(100,116,139,.12)",
      color: tone === "blue" ? "var(--c-primary,#2563eb)" : tone === "green" ? "#0f9960" : "var(--adm-text-muted,#64748b)",
    }}>{label}</span>
  );
}

/* Defined at module scope, not inline in AdminCatalogManager, on purpose:
   a component declared inside another component's body is a fresh function
   identity on every render, so React tears down and rebuilds every row (and
   its DOM nodes) on any parent state change — including the drag state set
   the instant a drag starts. Real mouse-driven drags survive that (the
   browser re-hit-tests the element under the cursor), but it's still
   pointless churn, and it broke the very first thing tested here: firing
   dragover/drop against a JS reference captured before the remount. */
function CmRow({ level, node, parentId, indent, hasKids, siblings, ctx }) {
  const dragging = ctx.dragNode && ctx.dragNode.level === level && ctx.dragNode.id === node.id;
  return (
    <div className="adm-flex" draggable onDragStart={ctx.onRowDragStart(level, parentId, node.id)}
      onDragOver={ctx.onRowDragOver} onDrop={ctx.onRowDrop(level, parentId, siblings, node.id)}
      style={{ alignItems: "center", gap: 8, padding: "9px 12px", marginLeft: indent, borderBottom: "1px solid var(--adm-border,#eef0f3)", opacity: dragging ? 0.4 : 1, cursor: "grab" }}>
      <span title="Перетащите, чтобы изменить порядок" style={{ display: "inline-flex", color: "var(--adm-text-muted,#94a3b8)" }}><AdminIcon name="menu" size={13} /></span>
      <input type="checkbox" checked={ctx.isSelected(level, node.id)} onChange={() => ctx.toggleSelect(level, node.id)} onClick={e => e.stopPropagation()} />
      {hasKids
        ? <button className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }} onClick={() => ctx.toggle(node.id)}><AdminIcon name={ctx.isOpen(node.id) ? "chevronDown" : "chevronRight"} size={14} /></button>
        : <span style={{ width: 24, display: "inline-block" }} />}
      <div style={{ flex: 1 }}>
        <div className="adm-cell-main">{(node.name && node.name.ru) || node.slug}</div>
        <div className="adm-cell-sub" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <code>{node.slug}</code>
          {level === "group" && CmBadge(`${node.productCount || 0} тов.`, "gray")}
          {level === "group" && (node.active === false ? CmBadge("скрыта", "gray") : CmBadge("на витрине", "green"))}
          {node.attrSchema && node.attrSchema.fields && node.attrSchema.fields.length > 0 && CmBadge(`${node.attrSchema.fields.length} полей`, "blue")}
        </div>
      </div>
      {level === "category" && <>
        <button className="btn btn-ghost btn-sm" onClick={() => ctx.openNew("subcategory", node.id)}><AdminIcon name="plus" size={13} /> подкат.</button>
        <button className="btn btn-ghost btn-sm" onClick={() => ctx.setBulk({ level: "subcategory", parentId: node.id })} title="Вставить список подкатегорий"><AdminIcon name="import" size={13} /> списком</button>
      </>}
      {level === "subcategory" && <>
        <button className="btn btn-ghost btn-sm" onClick={() => ctx.openNew("group", node.id)}><AdminIcon name="plus" size={13} /> группа</button>
        <button className="btn btn-ghost btn-sm" onClick={() => ctx.setBulk({ level: "group", parentId: node.id })} title="Вставить список товарных групп"><AdminIcon name="import" size={13} /> списком</button>
      </>}
      <button className="btn btn-ghost btn-icon" onClick={() => ctx.openEdit(level, node)}><AdminIcon name="edit" size={15} /></button>
      <button className="btn btn-ghost btn-icon" onClick={() => ctx.setConfirm({ level, id: node.id })}><AdminIcon name="trash" size={15} /></button>
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
  const [bulk, setBulk] = useState(null); // { level: "subcategory"|"group", parentId }
  const [q, setQ] = useState("");
  // Multi-select is scoped to one level at a time — mixing categories and
  // groups in one bulk delete/move doesn't map to a single API call anyway.
  const [selection, setSelection] = useState(null); // { level, ids: Set }
  const [confirmBulkDel, setConfirmBulkDel] = useState(false);
  const [moving, setMoving] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [dragNode, setDragNode] = useState(null); // { level, parentId, id }
  const toast = useToast();

  const load = () => {
    setLoading(true);
    window.CatalogAPI.getTree()
      .then(t => { setTree(t || []); setLoading(false); })
      .catch(e => { toast(e.message || "Ошибка загрузки", "error"); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const allExpandableIds = () => {
    const ids = [];
    tree.forEach(cat => {
      if ((cat.subcategories || []).length) ids.push(cat.id);
      (cat.subcategories || []).forEach(sub => { if ((sub.groups || []).length) ids.push(sub.id); });
    });
    return ids;
  };
  const expandAll = () => setExpanded(Object.fromEntries(allExpandableIds().map(id => [id, true])));
  const collapseAll = () => setExpanded({});

  const isSelected = (level, id) => !!(selection && selection.level === level && selection.ids.has(id));
  const toggleSelect = (level, id) => setSelection(s => {
    if (!s || s.level !== level) return { level, ids: new Set([id]) };
    const ids = new Set(s.ids);
    ids.has(id) ? ids.delete(id) : ids.add(id);
    return ids.size ? { level, ids } : null;
  });
  const clearSelection = () => setSelection(null);

  const bulkDelete = async () => {
    if (!selection) return;
    const fn = selection.level === "category" ? window.CatalogAPI.deleteCategory
      : selection.level === "subcategory" ? window.CatalogAPI.deleteSubcategory
      : window.CatalogAPI.deleteGroup;
    const ids = [...selection.ids];
    setBulkBusy(true);
    for (const id of ids) { try { await fn(id); } catch (e) { /* keep going, report count at the end */ } }
    setBulkBusy(false);
    setConfirmBulkDel(false);
    setSelection(null);
    toast(`Удалено: ${ids.length}`);
    load();
  };

  /* Subcategories move between categories, groups move between subcategories
     — categories have no parent to move into, so bulk move is unavailable
     at that level (the toolbar hides the button there). */
  const bulkMoveTargets = () => {
    if (!selection) return [];
    if (selection.level === "subcategory") return tree.map(c => ({ id: c.id, label: (c.name && c.name.ru) || c.slug }));
    if (selection.level === "group") {
      const opts = [];
      tree.forEach(c => (c.subcategories || []).forEach(s => opts.push({ id: s.id, label: `${(c.name && c.name.ru) || c.slug} / ${(s.name && s.name.ru) || s.slug}` })));
      return opts;
    }
    return [];
  };
  const bulkMove = async (targetId) => {
    if (!selection || !targetId) return;
    const ids = [...selection.ids];
    setBulkBusy(true);
    for (const id of ids) {
      try {
        if (selection.level === "subcategory") await window.CatalogAPI.updateSubcategory(id, { categoryId: targetId });
        else await window.CatalogAPI.updateGroup(id, { subcatId: targetId });
      } catch (e) { /* keep going */ }
    }
    setBulkBusy(false);
    setMoving(false);
    setSelection(null);
    toast(`Перемещено: ${ids.length}`);
    load();
  };

  /* Drag-and-drop reordering: siblings within one parent only (dropping a
     group onto a different subcategory's list would silently re-parent it,
     which is what the "переместить" bulk action is for — kept explicit). */
  const reorderSiblings = async (level, siblings, fromId, toId) => {
    const ids = siblings.map(s => s.id);
    const from = ids.indexOf(fromId), to = ids.indexOf(toId);
    if (from < 0 || to < 0 || from === to) return;
    const reordered = ids.slice();
    reordered.splice(from, 1);
    reordered.splice(to, 0, fromId);
    const fn = level === "category" ? window.CatalogAPI.updateCategory : level === "subcategory" ? window.CatalogAPI.updateSubcategory : window.CatalogAPI.updateGroup;
    try { await Promise.all(reordered.map((id, i) => fn(id, { order: i }))); load(); }
    catch (e) { toast(e.message || "Ошибка сортировки", "error"); load(); }
  };
  const onRowDragStart = (level, parentId, id) => (e) => { setDragNode({ level, parentId, id }); e.dataTransfer.effectAllowed = "move"; };
  const onRowDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onRowDrop = (level, parentId, siblings, id) => (e) => {
    e.preventDefault();
    if (!dragNode || dragNode.level !== level || dragNode.parentId !== parentId || dragNode.id === id) { setDragNode(null); return; }
    reorderSiblings(level, siblings, dragNode.id, id);
    setDragNode(null);
  };

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

  /* One row from the paste box → one API call, same shape save() builds for a
     single node, minus the modal round-trip. */
  const bulkCreateOne = (b, row) => {
    const prefix = b.level === "subcategory" ? "sub" : "grp";
    const body = {
      name: { ru: row.ru, uz: row.uz, en: row.en },
      slug: slugify(row.en || row.ru) || (prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6)),
      order: 999,
      attrSchema: { fields: [] },
    };
    if (b.level === "subcategory") { body.categoryId = b.parentId; return window.CatalogAPI.createSubcategory(body); }
    body.subcatId = b.parentId; body.active = true;
    return window.CatalogAPI.createGroup(body);
  };
  const closeBulk = (didCreate) => { setBulk(null); if (didCreate) { toast("Список создан"); load(); } };

  const del = () => {
    const c = confirm;
    const fn = c.level === "category" ? window.CatalogAPI.deleteCategory : c.level === "subcategory" ? window.CatalogAPI.deleteSubcategory : window.CatalogAPI.deleteGroup;
    fn(c.id).then(() => { toast("Удалено"); setConfirm(null); load(); })
      .catch(err => { toast(err.message || "Ошибка удаления", "error"); setConfirm(null); });
  };

  const levelTitle = { category: "категория", subcategory: "подкатегория", group: "товарная группа" };

  /* Search across all three levels at once — with 13 subcategories and 145
     groups, "find Дефибрилляторы" by expanding branches one at a time isn't
     a real option. A category/subcategory survives the filter if it matches
     itself or has a matching descendant; branches containing a match force
     themselves open regardless of the manual expand/collapse state below,
     so the result is visible without an extra click per level. */
  const nameHit = (node, needle) => {
    const n = node.name || {};
    return [n.ru, n.uz, n.en, node.slug].some((s) => s && s.toLowerCase().includes(needle));
  };
  const filterTree = (nodes, needle) => nodes
    .map((cat) => {
      const subs = (cat.subcategories || [])
        .map((sub) => {
          const groups = (sub.groups || []).filter((g) => nameHit(g, needle));
          if (groups.length || nameHit(sub, needle)) return Object.assign({}, sub, { groups: nameHit(sub, needle) ? (sub.groups || []) : groups });
          return null;
        })
        .filter(Boolean);
      if (subs.length || nameHit(cat, needle)) return Object.assign({}, cat, { subcategories: nameHit(cat, needle) ? (cat.subcategories || []) : subs });
      return null;
    })
    .filter(Boolean);
  const searching = q.trim().length > 0;
  const visibleTree = searching ? filterTree(tree, q.trim().toLowerCase()) : tree;
  const isOpen = (id) => searching || !!expanded[id];

  const rowCtx = { dragNode, isSelected, toggleSelect, isOpen, toggle, onRowDragStart, onRowDragOver, onRowDrop, openNew, setBulk, openEdit, setConfirm };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Дерево типов товара</div>
          <div className="adm-page-sub">Категория → подкатегория → товарная группа · схема атрибутов наследуется вниз</div>
        </div>
        <div className="adm-flex" style={{ gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={expandAll}><AdminIcon name="chevronDown" size={13} /> Развернуть всё</button>
          <button className="btn btn-secondary btn-sm" onClick={collapseAll}><AdminIcon name="chevronRight" size={13} /> Свернуть всё</button>
          <button className="btn btn-primary" onClick={() => openNew("category", null)}><AdminIcon name="plus" size={15} /> Категория</button>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 12, padding: "10px 12px" }}>
        <div className="adm-flex" style={{ alignItems: "center", gap: 8 }}>
          <AdminIcon name="search" size={16} className="adm-text-muted" />
          <input className="adm-input" style={{ border: "none", padding: "6px 0" }}
            placeholder="Найти по названию или slug — на любом из трёх уровней…"
            value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button className="btn btn-ghost btn-icon" onClick={() => setQ("")}><AdminIcon name="x" size={14} /></button>}
        </div>
      </div>

      {selection && selection.ids.size > 0 && (
        <div className="adm-card" style={{ marginBottom: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, background: "rgba(37,99,235,.06)" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Выбрано: {selection.ids.size} ({levelTitle[selection.level]})</span>
          <div style={{ flex: 1 }} />
          {selection.level !== "category" && (
            <button className="btn btn-secondary btn-sm" disabled={bulkBusy} onClick={() => setMoving(true)}><AdminIcon name="link" size={13} /> Переместить…</button>
          )}
          <button className="btn btn-secondary btn-sm" disabled={bulkBusy} onClick={() => setConfirmBulkDel(true)}><AdminIcon name="trash" size={13} /> Удалить</button>
          <button className="btn btn-ghost btn-sm" disabled={bulkBusy} onClick={clearSelection}>Отменить выбор</button>
        </div>
      )}

      <div className="adm-card">
        {loading
          ? <div style={{ padding: 40, textAlign: "center" }} className="adm-text-muted">Загрузка…</div>
          : !tree.length
            ? <EmptyState title="Дерево пустое" action={<button className="btn btn-primary" onClick={() => openNew("category", null)}><AdminIcon name="plus" size={14} /> Добавить категорию</button>} />
            : searching && !visibleTree.length
              ? <div style={{ padding: 40, textAlign: "center" }} className="adm-text-muted">Ничего не найдено по «{q}».</div>
              : <div>
                {visibleTree.map(cat => (
                  <div key={cat.id}>
                    <CmRow level="category" node={cat} indent={0} hasKids={(cat.subcategories || []).length > 0} siblings={visibleTree} ctx={rowCtx} />
                    {isOpen(cat.id) && (cat.subcategories || []).map(sub => (
                      <div key={sub.id}>
                        <CmRow level="subcategory" node={sub} parentId={cat.id} indent={28} hasKids={(sub.groups || []).length > 0} siblings={cat.subcategories || []} ctx={rowCtx} />
                        {isOpen(sub.id) && (sub.groups || []).map(g => (
                          <CmRow key={g.id} level="group" node={g} parentId={sub.id} indent={56} hasKids={false} siblings={sub.groups || []} ctx={rowCtx} />
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

      <BulkAddModal open={!!bulk} level={bulk && levelTitle[bulk.level]}
        onSubmit={(row) => bulkCreateOne(bulk, row)} onClose={closeBulk} />

      <Confirm open={confirmBulkDel} danger
        message={selection ? `Удалить ${selection.ids.size} (${levelTitle[selection.level]})? Вложенные элементы удалятся каскадно.` : ""}
        onConfirm={bulkDelete} onCancel={() => setConfirmBulkDel(false)} />

      <Modal open={moving} onClose={() => setMoving(false)} size="md"
        title={selection ? `Переместить ${selection.ids.size} (${levelTitle[selection.level]})` : ""}
        footer={<button className="btn btn-secondary" onClick={() => setMoving(false)}>Отмена</button>}>
        <div className="adm-form">
          <div className="adm-text-muted" style={{ fontSize: 13, marginBottom: 8 }}>
            {selection && selection.level === "subcategory" ? "Выберите категорию‑получателя:" : "Выберите подкатегорию‑получателя:"}
          </div>
          {bulkMoveTargets().map(opt => (
            <button key={opt.id} className="btn btn-secondary" disabled={bulkBusy}
              style={{ width: "100%", justifyContent: "flex-start", marginBottom: 6 }}
              onClick={() => bulkMove(opt.id)}>{opt.label}</button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
window.AdminCatalogManager = AdminCatalogManager;
