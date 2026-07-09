/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Product form (A3): classification by groups + specialties, dynamic attrs
   built from the group's effective schema (/product-groups/:id/schema), price + stock + main image.
   Uses window.CatalogAPI + window.api. */

function PfToggle({ checked, onChange, label }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
      <span className="adm-toggle-track" />
      <span>{label}</span>
    </label>
  );
}

function PfAcc({ id, title, badge, isOpen, onToggle, children }) {
  return (
    <div className={`pf-acc${isOpen ? " open" : ""}`} id={`pf-${id}`}>
      <div className="pf-acc-head" onClick={() => onToggle(id)}>
        <span className="pf-acc-title">{title}</span>
        {badge > 0 && <span className="pf-acc-badge">{badge}</span>}
        <AdminIcon name={isOpen ? "chevronup" : "chevrondown"} size={16} color="var(--c-muted)" />
      </div>
      {isOpen && <div className="pf-acc-body">{children}</div>}
    </div>
  );
}

// One dynamic attribute input, rendered from a schema field descriptor.
function AttrField({ field, value, onChange }) {
  const lab = ((field.label && field.label.ru) || field.key) + (field.unit ? ` (${field.unit})` : "") + (field.required ? " *" : "");
  if (field.type === "number") {
    return <Field label={lab}><input className="adm-input" type="number" value={value ?? ""} onChange={e => onChange(e.target.value === "" ? "" : Number(e.target.value))} /></Field>;
  }
  if (field.type === "boolean") {
    return <Field label={(field.label && field.label.ru) || field.key}><PfToggle checked={!!value} onChange={onChange} label="Да" /></Field>;
  }
  if (field.type === "textarea") {
    return <Field label={lab}><textarea className="adm-textarea" rows={2} value={value || ""} onChange={e => onChange(e.target.value)} /></Field>;
  }
  if (field.type === "select") {
    return <Field label={lab}><select className="adm-select" value={value || ""} onChange={e => onChange(e.target.value)}><option value="">—</option>{(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}</select></Field>;
  }
  if (field.type === "multiselect") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <Field label={lab}>
        <div className="adm-flex" style={{ flexWrap: "wrap", gap: 10 }}>
          {(field.options || []).map(o => (
            <label key={o} className="adm-check"><input type="checkbox" checked={arr.includes(o)} onChange={e => onChange(e.target.checked ? [...arr, o] : arr.filter(x => x !== o))} /> {o}</label>
          ))}
        </div>
      </Field>
    );
  }
  return <Field label={lab}><input className="adm-input" value={value || ""} onChange={e => onChange(e.target.value)} /></Field>;
}

function AdminProductForm({ go, editId }) {
  const { useState, useEffect, useRef } = React;
  const toast = useToast();
  const isEdit = !!editId;

  const blank = {
    sku: "", gtin: "", status: "DRAFT",
    name: { ru: "", uz: "", en: "" }, description: { ru: "", uz: "", en: "" },
    manufacturerId: "", badge: "", isNew: false, inStock: true, popularity: 60,
    groupIds: [], specCategoryIds: [], attrs: {},
    price: "", oldPrice: "", wholesalePrice: "", currency: "UZS", priceOnRequest: false, qty: "",
    image: "",
  };

  const [form, setForm] = useState(blank);
  const [tree, setTree] = useState([]);
  const [brands, setBrands] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [schema, setSchema] = useState({ fields: [] });
  const [open, setOpen] = useState({ basic: true, cats: true, attrs: true });
  const [active, setActive] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const mainRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setName = (lang, v) => setForm(f => ({ ...f, name: { ...f.name, [lang]: v } }));
  const setDesc = (lang, v) => setForm(f => ({ ...f, description: { ...f.description, [lang]: v } }));
  const setAttr = (key, v) => setForm(f => ({ ...f, attrs: { ...f.attrs, [key]: v } }));

  // reference data
  useEffect(() => {
    window.CatalogAPI.getTree().then(t => setTree(t || [])).catch(() => {});
    window.api.listPublic("brands", { limit: 100 }).then(r => setBrands((r && r.data) || r || [])).catch(() => {});
    window.api.listPublic("spec-categories", { limit: 100 }).then(r => setSpecs((r && r.data) || r || [])).catch(() => {});
  }, []);

  // load product for edit
  useEffect(() => {
    if (!isEdit) return;
    window.CatalogAPI.getProduct(editId).then(p => {
      const price = (p.prices && p.prices[0]) || {};
      const stock = (p.stocks && p.stocks[0]) || {};
      const main = (p.media || []).find(m => m.isMain) || (p.media || [])[0];
      setForm({
        ...blank,
        sku: p.sku || "", gtin: p.gtin || "", status: p.status || "DRAFT",
        name: p.name || blank.name, description: p.description || blank.description,
        manufacturerId: p.manufacturerId || "", badge: p.badge || "", isNew: !!p.isNew, inStock: p.inStock !== false, popularity: p.popularity || 60,
        groupIds: (p.groups || []).map(g => g.groupId), specCategoryIds: (p.specs || []).map(s => s.specId), attrs: p.attrs || {},
        price: price.price != null ? price.price : "", oldPrice: price.oldPrice != null ? price.oldPrice : "",
        wholesalePrice: price.wholesalePrice != null ? price.wholesalePrice : "", currency: price.currency || "UZS",
        priceOnRequest: !!price.priceOnRequest, qty: stock.qty != null ? stock.qty : "",
        image: main ? main.url : "",
      });
      setLoading(false);
    }).catch(e => { toast(e.message || "Ошибка загрузки товара", "error"); setLoading(false); });
  }, [editId]);

  // merged effective attribute schema for the selected groups
  const gids = form.groupIds.join(",");
  useEffect(() => {
    if (!form.groupIds.length) { setSchema({ fields: [] }); return; }
    Promise.all(form.groupIds.map(id => window.CatalogAPI.getGroupSchema(id).catch(() => ({ fields: [] }))))
      .then(list => {
        const byKey = {};
        list.forEach(s => (s.fields || []).forEach(f => { byKey[f.key] = f; }));
        setSchema({ fields: Object.keys(byKey).map(k => byKey[k]) });
      });
  }, [gids]);

  const toggleGroup = (id, on) => setForm(f => ({ ...f, groupIds: on ? [...f.groupIds, id] : f.groupIds.filter(x => x !== id) }));
  const toggleSpec = (id, on) => setForm(f => ({ ...f, specCategoryIds: on ? [...f.specCategoryIds, id] : f.specCategoryIds.filter(x => x !== id) }));
  const toggleSection = (key) => { setOpen(s => ({ ...s, [key]: !s[key] })); setActive(key); };
  const goSection = (key) => { setActive(key); setOpen(s => ({ ...s, [key]: true })); setTimeout(() => { const el = document.getElementById(`pf-${key}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30); };

  const num = (v) => v === "" || v == null ? undefined : Number(v);

  const save = async () => {
    if (!form.name.ru.trim()) { toast("Введите название (RU)", "error"); goSection("basic"); return; }
    if (!form.sku.trim()) { toast("Введите артикул (SKU)", "error"); goSection("basic"); return; }
    setSaving(true);
    try {
      const body = {
        sku: form.sku.trim(), gtin: form.gtin || undefined,
        name: form.name, description: form.description,
        manufacturerId: form.manufacturerId || undefined,
        status: form.status,
        badge: form.badge || undefined, isNew: form.isNew, inStock: form.inStock, popularity: Number(form.popularity) || 60,
        attrs: form.attrs, groupIds: form.groupIds, specCategoryIds: form.specCategoryIds,
      };
      const saved = isEdit ? await window.CatalogAPI.updateProduct(editId, body) : await window.CatalogAPI.createProduct(body);
      const pid = saved.id;

      await window.CatalogAPI.setPrice(pid, {
        price: num(form.price), oldPrice: num(form.oldPrice), wholesalePrice: num(form.wholesalePrice),
        priceOnRequest: form.priceOnRequest, currency: form.currency, active: true,
      });
      if (form.qty !== "") await window.CatalogAPI.setStock(pid, { qty: Number(form.qty) || 0 });
      if (form.image && form.image.indexOf("data:") === 0) {
        const up = await window.api.uploadDataUrl(form.image);
        await window.CatalogAPI.addMedia(pid, { url: up.url, type: "PHOTO", isMain: true });
      }

      toast(isEdit ? "Товар обновлён" : "Товар создан");
      go("products");
    } catch (e) {
      const msg = (e && e.body && Array.isArray(e.body.errors)) ? e.body.errors.join("; ") : (e && e.message) || "Ошибка сохранения";
      toast(msg, "error");
    } finally { setSaving(false); }
  };

  const badges = {
    cats: form.groupIds.length + form.specCategoryIds.length,
    attrs: schema.fields.length,
    media: form.image ? 1 : 0,
  };
  const NAV = [
    { key: "basic", label: "Основная информация" },
    { key: "cats", label: "Классификация" },
    { key: "attrs", label: "Характеристики" },
    { key: "price", label: "Цена и наличие" },
    { key: "media", label: "Фото" },
  ];

  if (loading) return <div style={{ padding: 40 }} className="adm-text-muted">Загрузка товара…</div>;

  return (
    <div className="pf-wrap">
      <div className="pf-head">
        <div className="pf-back" onClick={() => go("products")} title="Назад"><AdminIcon name="arrowleft" size={16} /></div>
        <div className="pf-head-icon"><AdminIcon name="package" size={18} color="white" /></div>
        <div className="pf-head-info">
          <div className="pf-head-title">{isEdit ? "Редактировать товар" : "Новый товар"}</div>
          <div className="pf-head-sub">{form.sku}{form.name.ru ? ` · ${form.name.ru}` : ""}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => go("products")}>Отмена</button>
        <button className="btn btn-primary" onClick={save} disabled={saving}><AdminIcon name="check" size={14} /> {saving ? "Сохранение…" : "Сохранить"}</button>
      </div>

      <div className="pf-body">
        <nav className="pf-nav">
          {NAV.map(s => (
            <div key={s.key} className={`pf-nav-item${active === s.key ? " active" : ""}`} onClick={() => goSection(s.key)}>
              <span>{s.label}</span>
              {badges[s.key] > 0 && <span className="pf-nav-badge">{badges[s.key]}</span>}
            </div>
          ))}
        </nav>

        <div className="pf-content">
          {/* 1. Основная информация */}
          <PfAcc id="basic" title="Основная информация" isOpen={!!open.basic} onToggle={toggleSection}>
            <div className="adm-form">
              <div className="adm-form-row">
                <Field label="Артикул (SKU)" required><input className="adm-input" value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="ECG-12-KM" /></Field>
                <Field label="Штрихкод (GTIN)"><input className="adm-input" value={form.gtin} onChange={e => set("gtin", e.target.value)} /></Field>
              </div>
              <Field label="Название (RU)" required><input className="adm-input" value={form.name.ru} onChange={e => setName("ru", e.target.value)} /></Field>
              <div className="adm-form-row">
                <Field label="Название (UZ)"><input className="adm-input" value={form.name.uz} onChange={e => setName("uz", e.target.value)} /></Field>
                <Field label="Название (EN)"><input className="adm-input" value={form.name.en} onChange={e => setName("en", e.target.value)} /></Field>
              </div>
              <Field label="Описание (RU)"><textarea className="adm-textarea" rows={3} value={form.description.ru} onChange={e => setDesc("ru", e.target.value)} /></Field>
              <div className="adm-form-row">
                <Field label="Описание (UZ)"><textarea className="adm-textarea" rows={2} value={form.description.uz} onChange={e => setDesc("uz", e.target.value)} /></Field>
                <Field label="Описание (EN)"><textarea className="adm-textarea" rows={2} value={form.description.en} onChange={e => setDesc("en", e.target.value)} /></Field>
              </div>
              <div className="adm-form-row">
                <Field label="Производитель">
                  <select className="adm-select" value={form.manufacturerId} onChange={e => set("manufacturerId", e.target.value)}>
                    <option value="">— не задан —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Статус">
                  <select className="adm-select" value={form.status} onChange={e => set("status", e.target.value)}>
                    <option value="DRAFT">Черновик</option>
                    <option value="ACTIVE">Опубликован</option>
                    <option value="ARCHIVED">Архив</option>
                  </select>
                </Field>
              </div>
              <div className="adm-form-row">
                <Field label="Бейдж" hint="хит, new…"><input className="adm-input" value={form.badge} onChange={e => set("badge", e.target.value)} /></Field>
                <Field label="Популярность"><input className="adm-input" type="number" value={form.popularity} onChange={e => set("popularity", e.target.value)} /></Field>
              </div>
              <div className="adm-flex" style={{ gap: 24 }}>
                <PfToggle checked={form.isNew} onChange={v => set("isNew", v)} label="Новинка" />
                <PfToggle checked={form.inStock} onChange={v => set("inStock", v)} label="В наличии" />
              </div>
            </div>
          </PfAcc>

          {/* 2. Классификация */}
          <PfAcc id="cats" title="Классификация" badge={badges.cats} isOpen={!!open.cats} onToggle={toggleSection}>
            <div className="adm-form">
              <div className="adm-form-label">Товарные группы <span className="adm-text-muted" style={{ fontWeight: 400 }}>— определяют характеристики</span></div>
              {!tree.length && <div className="adm-text-muted" style={{ fontSize: 13 }}>Дерево типов пусто. Создайте группы в разделе «Категории».</div>}
              {tree.map(cat => (
                <div key={cat.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginTop: 6 }}>{cat.name.ru}</div>
                  {(cat.subcategories || []).map(sub => (
                    <div key={sub.id} style={{ marginLeft: 12 }}>
                      <div className="adm-text-muted" style={{ fontSize: 12, margin: "4px 0" }}>{sub.name.ru}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginLeft: 12 }}>
                        {(sub.groups || []).length === 0 && <span className="adm-text-muted" style={{ fontSize: 12 }}>нет групп</span>}
                        {(sub.groups || []).map(g => (
                          <label key={g.id} className="adm-check"><input type="checkbox" checked={form.groupIds.includes(g.id)} onChange={e => toggleGroup(g.id, e.target.checked)} /> {g.name.ru}</label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="adm-form-label" style={{ marginTop: 16 }}>Направления медицины</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {specs.map(s => (
                  <label key={s.id} className="adm-check"><input type="checkbox" checked={form.specCategoryIds.includes(s.id)} onChange={e => toggleSpec(s.id, e.target.checked)} /> {(s.name && s.name.ru) || s.slug}</label>
                ))}
              </div>
            </div>
          </PfAcc>

          {/* 3. Характеристики (динамические) */}
          <PfAcc id="attrs" title="Характеристики" badge={badges.attrs} isOpen={!!open.attrs} onToggle={toggleSection}>
            <div className="adm-form">
              {!form.groupIds.length
                ? <div className="adm-text-muted" style={{ fontSize: 13 }}>Выберите товарную группу в «Классификации» — форма характеристик построится по её схеме.</div>
                : !schema.fields.length
                  ? <div className="adm-text-muted" style={{ fontSize: 13 }}>У выбранных групп нет заданных полей атрибутов.</div>
                  : <div>
                      <div className="adm-text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Поля построены по схеме выбранных групп (с наследованием от категории/подкатегории).</div>
                      {schema.fields.map(f => (
                        <AttrField key={f.key} field={f} value={form.attrs[f.key]} onChange={v => setAttr(f.key, v)} />
                      ))}
                    </div>
              }
            </div>
          </PfAcc>

          {/* 4. Цена и наличие */}
          <PfAcc id="price" title="Цена и наличие" isOpen={!!open.price} onToggle={toggleSection}>
            <div className="adm-form">
              <div className="adm-form-row">
                <Field label="Цена"><input className="adm-input" type="number" value={form.price} onChange={e => set("price", e.target.value)} /></Field>
                <Field label="Старая цена"><input className="adm-input" type="number" value={form.oldPrice} onChange={e => set("oldPrice", e.target.value)} /></Field>
              </div>
              <div className="adm-form-row">
                <Field label="Оптовая цена"><input className="adm-input" type="number" value={form.wholesalePrice} onChange={e => set("wholesalePrice", e.target.value)} /></Field>
                <Field label="Валюта"><input className="adm-input" value={form.currency} onChange={e => set("currency", e.target.value)} /></Field>
              </div>
              <PfToggle checked={form.priceOnRequest} onChange={v => set("priceOnRequest", v)} label="Цена по запросу" />
              <Field label="Остаток на складе (шт)"><input className="adm-input" type="number" value={form.qty} onChange={e => set("qty", e.target.value)} placeholder="0" /></Field>
            </div>
          </PfAcc>

          {/* 5. Фото */}
          <PfAcc id="media" title="Фото" badge={badges.media} isOpen={!!open.media} onToggle={toggleSection}>
            <div className="adm-form">
              <Field label="Главное фото">
                {form.image ? (
                  <div>
                    <img src={form.image} alt="" style={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain", borderRadius: 8, border: "1px solid var(--c-border)" }} />
                    <div style={{ marginTop: 8 }}><button className="btn btn-secondary btn-sm" onClick={() => set("image", "")} type="button"><AdminIcon name="x" size={12} /> Убрать</button></div>
                  </div>
                ) : (
                  <div className="pf-main-upload" onClick={() => mainRef.current.click()}><AdminIcon name="upload" size={24} /><div style={{ marginTop: 8, fontSize: 13 }}>Нажмите для загрузки</div></div>
                )}
                <input ref={mainRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => set("image", ev.target.result); r.readAsDataURL(f); e.target.value = ""; }} />
              </Field>
            </div>
          </PfAcc>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}
window.AdminProductForm = AdminProductForm;
