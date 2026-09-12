/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Product form (A3): classification by groups + specialties, dynamic attrs
   built from the group's effective schema (/product-groups/:id/schema), price + stock + main image.
   Uses window.CatalogAPI + window.api. */

/* Фирменный водяной знак раньше накладывался только CSS-ом поверх готовой
   страницы — на сайте выглядел нормально, но сам файл фото (скачанный или
   открытый напрямую по URL) знака не содержал вовсе. Теперь запекаем его в
   файл на этапе загрузки: рисуем оригинал на канвасе, поверх — тот же PNG
   (15% прозрачности уже заложено в сам файл), тем же углом/размером, что
   раньше задавал CSS (top 4%, right 4%, width 16%, квадрат). */
let _pfWatermarkImg = null;
function pfLoadWatermark() {
  if (_pfWatermarkImg) return _pfWatermarkImg;
  _pfWatermarkImg = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/assets/product-watermark.png";
  });
  return _pfWatermarkImg;
}
function pfCompositeWatermark(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const wm = await pfLoadWatermark();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      if (wm) {
        const size = canvas.width * 0.16;
        const x = canvas.width * (1 - 0.04) - size;
        const y = canvas.height * 0.04;
        ctx.drawImage(wm, x, y, size, size);
      }
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

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

/* Товары, заведённые в обход этой формы (одноразовыми скриптами при
   наполнении каталога — так у многих реальных товаров), несут в attrs
   ключи, которых нет в схеме выбранной товарной группы: например
   «Комплектация» у ЛОР-комбайна ЗЕРЦ EXPERT Plus. Блок «Характеристики»
   выше рендерит только schema.fields — такие ключи были в БД и на витрине,
   но их некуда было ни увидеть, ни отредактировать в самой форме. Этот блок
   показывает и даёт редактировать всё, что осталось в attrs сверх схемы (и
   сверх служебных _kit/_shipping/_video/_stock — у них своя форма ниже),
   плюс позволяет добавить новую произвольную характеристику. */
function ExtraAttrsEditor({ attrs, schemaKeys, onChange, onRemove, onRename }) {
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");
  const extraKeys = Object.keys(attrs || {}).filter(k => k.charAt(0) !== "_" && !schemaKeys.includes(k));
  const addNew = () => {
    const k = newKey.trim();
    if (!k || Object.prototype.hasOwnProperty.call(attrs, k)) return;
    onChange(k, newVal);
    setNewKey(""); setNewVal("");
  };
  return (
    <div style={{ marginTop: extraKeys.length ? 16 : 0 }}>
      {extraKeys.length > 0 && (
        <div className="adm-text-muted" style={{ fontSize: 12, marginBottom: 8 }}>
          Характеристики вне схемы группы (заведены напрямую) — можно отредактировать или удалить.
        </div>
      )}
      {extraKeys.map(k => (
        <div key={k} className="adm-form-row" style={{ alignItems: "flex-end", gap: 8 }}>
          <Field label="Название"><input className="adm-input" defaultValue={k} onBlur={e => onRename(k, e.target.value.trim())} /></Field>
          <Field label="Значение"><input className="adm-input" value={attrs[k] || ""} onChange={e => onChange(k, e.target.value)} /></Field>
          <button type="button" className="btn btn-secondary btn-sm" title="Удалить характеристику" onClick={() => onRemove(k)} style={{ marginBottom: 10 }}>
            <AdminIcon name="x" size={12} />
          </button>
        </div>
      ))}
      <div className="adm-form-row" style={{ alignItems: "flex-end", gap: 8, marginTop: extraKeys.length ? 4 : 0 }}>
        <Field label="Новая характеристика — название"><input className="adm-input" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="например, Комплектация" /></Field>
        <Field label="Значение"><input className="adm-input" value={newVal} onChange={e => setNewVal(e.target.value)} /></Field>
        <button type="button" className="btn btn-secondary btn-sm" onClick={addNew} style={{ marginBottom: 10 }}>Добавить</button>
      </div>
    </div>
  );
}

function AdminProductForm({ go, editId }) {
  const { useState, useEffect, useRef } = React;
  const toast = useToast();
  const isEdit = !!editId;

  const blank = {
    sku: "", status: "DRAFT",
    name: { ru: "", uz: "", en: "" }, description: { ru: "", uz: "", en: "" },
    manufacturerId: "", isNew: false, inStock: true, stockStatus: "", popularity: 60,
    groupIds: [], specCategoryIds: [], attrs: {},
    price: "", oldPrice: "", wholesalePrice: "", currency: "UZS", priceOnRequest: false, qty: "",
    /* images — вся галерея, а не одно «главное фото»: раньше форма несла
       единственный form.image, и при загрузке товара на редактирование
       (см. ниже) в него клался только один снимок (isMain || media[0]) —
       остальные фото ProductMedia существующего товара при сохранении
       молча исчезали, потому что форма о них вообще не знала. Элемент:
       { id? (есть только у уже сохранённого в БД снимка), url, isMain }. */
    images: [],
    /* Ссылка на YouTube — не отдельная колонка в БД (её там нет и не будет
       ради одного поля), а зарезервированный ключ attrs._video, тем же
       приёмом, что уже используют attrs._kit/_shipping (см. catalog-remote.js
       buildProducts — ключи с "_" не идут в таблицу характеристик). Публичная
       страница товара уже умеет показывать видео в галерее (product-detail.jsx
       читает p.video) — не хватало только способа его туда положить. */
    videoUrl: "",
  };

  const [form, setForm] = useState(blank);
  const [tree, setTree] = useState([]);
  const [brands, setBrands] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [schema, setSchema] = useState({ fields: [] });
  /* Документы (Паспорт/РУ/CE/…) — вкладка «Документы» на витрине товара
     (product-detail.jsx) их показывает, API (listRegDocs/addRegDoc/removeRegDoc
     в catalog-admin-api.js) и серверные эндпоинты давно готовы, но в самой
     форме редактирования раздела не было вовсе: все документы этой сессии
     приходилось грузить в обход формы, напрямую в БД скриптами. */
  const [docs, setDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [newDocFile, setNewDocFile] = useState(null);
  const [newDocType, setNewDocType] = useState("");
  const docFileRef = useRef();
  const [open, setOpen] = useState({ basic: true, cats: true, attrs: true });
  const [active, setActive] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const mainRef = useRef();
  // Снимок form.images на момент загрузки товара — с чем сравнивать при
  // сохранении, чтобы понять, что удалено/изменено, а что трогать не надо.
  const originalImagesRef = useRef([]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setName = (lang, v) => setForm(f => ({ ...f, name: { ...f.name, [lang]: v } }));
  const setDesc = (lang, v) => setForm(f => ({ ...f, description: { ...f.description, [lang]: v } }));
  const setAttr = (key, v) => setForm(f => ({ ...f, attrs: { ...f.attrs, [key]: v } }));
  const removeAttr = (key) => setForm(f => { const a = { ...f.attrs }; delete a[key]; return { ...f, attrs: a }; });
  const renameAttr = (oldKey, newKey) => setForm(f => {
    if (!newKey || newKey === oldKey || Object.prototype.hasOwnProperty.call(f.attrs, newKey)) return f;
    const a = { ...f.attrs };
    a[newKey] = a[oldKey];
    delete a[oldKey];
    return { ...f, attrs: a };
  });

  // reference data
  useEffect(() => {
    window.CatalogAPI.getTree().then(t => setTree(t || [])).catch(() => {});
    window.api.listPublic("brands", { limit: 100 }).then(r => setBrands((r && r.data) || r || [])).catch(() => {});
    window.api.listPublic("spec-categories", { limit: 100 }).then(r => setSpecs((r && r.data) || r || [])).catch(() => {});
  }, []);

  /* Артикул нового товара выдаётся автоматически: следующий свободный номер
     после максимального числового среди уже заведённых. Буквенные артикулы
     поставщиков (ECG-12-KM и т.п.) в нумерации не участвуют — они остаются
     как есть у своих товаров, но новые позиции нумеруются сквозным счётом. */
  useEffect(() => {
    if (isEdit) return;
    window.CatalogAPI.listProducts({})
      .then(r => {
        const list = (r && r.data) || r || [];
        const max = list.reduce((m, p) => {
          const n = /^\d+$/.test(p.sku || "") ? parseInt(p.sku, 10) : 0;
          return n > m ? n : m;
        }, 0);
        set("sku", String(max + 1).padStart(4, "0"));
      })
      .catch(() => set("sku", String(Date.now()).slice(-6)));
  }, [isEdit]);

  // load product for edit
  useEffect(() => {
    if (!isEdit) return;
    window.CatalogAPI.getProduct(editId).then(p => {
      const price = (p.prices && p.prices[0]) || {};
      const stock = (p.stocks && p.stocks[0]) || {};
      const images = (p.media || [])
        .slice()
        .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0) || (a.order || 0) - (b.order || 0))
        .map(m => ({ id: m.id, url: m.url, isMain: !!m.isMain }));
      setForm({
        ...blank,
        sku: p.sku || "", status: p.status || "DRAFT",
        name: p.name || blank.name, description: p.description || blank.description,
        manufacturerId: p.manufacturerId || "", isNew: !!p.isNew, inStock: p.inStock !== false,
        stockStatus: (p.attrs && p.attrs._stock) || "", popularity: p.popularity || 60,
        groupIds: (p.groups || []).map(g => g.groupId), specCategoryIds: (p.specs || []).map(s => s.specId), attrs: p.attrs || {},
        price: price.price != null ? price.price : "", oldPrice: price.oldPrice != null ? price.oldPrice : "",
        wholesalePrice: price.wholesalePrice != null ? price.wholesalePrice : "", currency: price.currency || "UZS",
        priceOnRequest: !!price.priceOnRequest, qty: stock.qty != null ? stock.qty : "",
        images,
        videoUrl: (p.attrs && p.attrs._video) || "",
      });
      originalImagesRef.current = images;
      setDocs(p.regDocuments || []);
      setLoading(false);
    }).catch(e => { toast(e.message || "Ошибка загрузки товара", "error"); setLoading(false); });
  }, [editId]);

  const REG_DOC_TYPES = [
    { value: "", label: "Паспорт (без типа — техническая документация)" },
    { value: "RU", label: "РУ — регистрационное удостоверение" },
    { value: "CE", label: "CE" },
    { value: "ISO", label: "ISO" },
    { value: "DECLARATION", label: "Декларация о соответствии" },
    { value: "CERTIFICATE", label: "Сертификат" },
  ];

  const uploadDoc = async () => {
    if (!newDocFile || !isEdit) return;
    setDocsLoading(true);
    try {
      const up = await window.api.uploadBlob(newDocFile, newDocFile.name);
      const body = { fileUrl: up.url, status: "PRESENT" };
      if (newDocType) body.type = newDocType;
      const created = await window.CatalogAPI.addRegDoc(editId, body);
      setDocs(d => [...d, created]);
      setNewDocFile(null); setNewDocType("");
      if (docFileRef.current) docFileRef.current.value = "";
      toast("Документ добавлен");
    } catch (e) { toast(e.message || "Ошибка загрузки документа", "error"); }
    finally { setDocsLoading(false); }
  };
  const removeDoc = async (id) => {
    setDocsLoading(true);
    try { await window.CatalogAPI.removeRegDoc(id); setDocs(d => d.filter(x => x.id !== id)); }
    catch (e) { toast(e.message || "Ошибка удаления документа", "error"); }
    finally { setDocsLoading(false); }
  };

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
    setSaving(true);
    try {
      const body = {
        sku: form.sku.trim() || String(Date.now()).slice(-6),
        name: form.name, description: form.description,
        manufacturerId: form.manufacturerId || undefined,
        status: form.status,
        isNew: form.isNew, inStock: form.inStock, popularity: Number(form.popularity) || 60,
        attrs: (() => {
          const a = { ...form.attrs };
          if (form.videoUrl.trim()) a._video = form.videoUrl.trim(); else delete a._video;
          if (form.stockStatus) a._stock = form.stockStatus; else delete a._stock;
          return a;
        })(),
        groupIds: form.groupIds, specCategoryIds: form.specCategoryIds,
      };
      /* Номер выдан на клиенте, поэтому два одновременно открытых бланка могут
         получить один и тот же — БД такой товар не примет (sku @unique).
         Ловим этот случай и берём следующий свободный номер, а не показываем
         оператору невнятную ошибку про constraint. */
      let saved;
      if (isEdit) saved = await window.CatalogAPI.updateProduct(editId, body);
      else {
        try { saved = await window.CatalogAPI.createProduct(body); }
        catch (e) {
          if (!/sku|unique|уник/i.test((e && e.message) || "")) throw e;
          const r = await window.CatalogAPI.listProducts({});
          const list = (r && r.data) || r || [];
          const max = list.reduce((m, p) => { const n = /^\d+$/.test(p.sku || "") ? parseInt(p.sku, 10) : 0; return n > m ? n : m; }, 0);
          body.sku = String(max + 1).padStart(4, "0");
          setForm(f => ({ ...f, sku: body.sku }));
          saved = await window.CatalogAPI.createProduct(body);
        }
      }
      const pid = saved.id;

      await window.CatalogAPI.setPrice(pid, {
        price: num(form.price), oldPrice: num(form.oldPrice), wholesalePrice: num(form.wholesalePrice),
        priceOnRequest: form.priceOnRequest, currency: form.currency, active: true,
      });
      if (form.qty !== "") await window.CatalogAPI.setStock(pid, { qty: Number(form.qty) || 0 });

      /* Галерея: удалённые из формы фото — удаляем; изменившийся статус
         «главное»/порядок у уже сохранённых — обновляем на месте (PATCH);
         новые снимки (data:URL, ещё не в MinIO) — грузим и создаём запись.
         Нетронутые записи не трогаем вовсе, без лишних запросов. */
      const orig = originalImagesRef.current;
      if (isEdit) {
        for (const o of orig) {
          if (!form.images.some(x => x.id === o.id)) await window.CatalogAPI.removeMedia(o.id);
        }
      }
      for (let i = 0; i < form.images.length; i++) {
        const img = form.images[i];
        if (!img.id) {
          const url = img.url.indexOf("data:") === 0 ? (await window.api.uploadDataUrl(img.url)).url : img.url;
          await window.CatalogAPI.addMedia(pid, { url, type: "PHOTO", isMain: !!img.isMain, order: i });
          continue;
        }
        const o = orig.find(x => x.id === img.id);
        if (o && (!!o.isMain !== !!img.isMain)) await window.CatalogAPI.updateMedia(img.id, { isMain: !!img.isMain, order: i });
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
    media: form.images.length + (form.videoUrl.trim() ? 1 : 0),
    docs: docs.length,
  };
  const NAV = [
    { key: "basic", label: "Основная информация" },
    { key: "cats", label: "Классификация" },
    { key: "attrs", label: "Характеристики" },
    { key: "price", label: "Цена и наличие" },
    { key: "media", label: "Фото и видео" },
    { key: "docs", label: "Документы" },
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
                <Field label="Артикул (SKU)" hint={isEdit ? "менять не рекомендуется — на него ссылаются счета и заявки" : "назначен автоматически"}>
                  <input className="adm-input mono" value={form.sku} readOnly />
                </Field>
                <Field label="Название (RU)" required><input className="adm-input" value={form.name.ru} onChange={e => setName("ru", e.target.value)} /></Field>
              </div>
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
              <Field label="Популярность" hint="чем больше число, тем выше товар в каталоге; по умолчанию 60">
                <input className="adm-input" type="number" value={form.popularity} onChange={e => set("popularity", e.target.value)} />
              </Field>
              <div className="adm-flex" style={{ gap: 24 }}>
                <PfToggle checked={form.isNew} onChange={v => set("isNew", v)} label="Новинка" />
                <PfToggle checked={form.inStock} onChange={v => set("inStock", v)} label="В наличии" />
              </div>
              {/* Раньше наличие было одним булевым переключателем — на витрине
                  это сводилось только к «В наличии» / «Ожидается поставка»,
                  хотя фильтр, сортировка и бейдж каталога уже умели показывать
                  и «Под заказ» отдельно. Точный статус хранится в attrs._stock
                  и на витрине перекрывает переключатель выше; «Авто» оставляет
                  прежнее поведение по переключателю, ничего не ломая для уже
                  заведённых товаров. */}
              <Field label="Статус наличия (для каталога)" hint="переопределяет переключатель «В наличии» на витрине; «Авто» — по переключателю">
                <select className="adm-input" value={form.stockStatus} onChange={e => set("stockStatus", e.target.value)}>
                  <option value="">Авто (по переключателю «В наличии»)</option>
                  <option value="in">В наличии</option>
                  <option value="order">Под заказ</option>
                  <option value="preorder">Ожидается поставка</option>
                </select>
              </Field>
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
              <ExtraAttrsEditor attrs={form.attrs} schemaKeys={schema.fields.map(f => f.key)}
                onChange={setAttr} onRemove={removeAttr} onRename={renameAttr} />
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

          {/* 5. Фото — вся галерея, не одно «главное фото»: можно добавить
              сразу несколько файлов, выбрать среди них главный и удалить
              любой, порядок — как добавлены (первым — сделанный главным). */}
          <PfAcc id="media" title="Фото и видео" badge={badges.media} isOpen={!!open.media} onToggle={toggleSection}>
            <div className="adm-form">
              <Field label={`Фото (${form.images.length})`}>
                {form.images.length > 0 && (
                  <div className="pf-gallery">
                    {form.images.map((img, i) => (
                      <div className="pf-gallery-item" key={img.id || img.url}>
                        <img src={img.url} alt="" />
                        {img.isMain && <span className="pf-gallery-main-badge">Главное</span>}
                        <div className="pf-gallery-actions">
                          {!img.isMain && (
                            <button type="button" className="btn btn-secondary btn-sm"
                              onClick={() => set("images", form.images.map((x, j) => ({ ...x, isMain: j === i })))}>
                              Сделать главным
                            </button>
                          )}
                          <button type="button" className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const next = form.images.filter((_, j) => j !== i);
                              // Убрали главное — им становится следующее по порядку, иначе товар остаётся без главного фото вовсе.
                              if (img.isMain && next.length) next[0] = { ...next[0], isMain: true };
                              set("images", next);
                            }}>
                            <AdminIcon name="x" size={12} /> Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pf-main-upload" onClick={() => mainRef.current.click()} style={{ marginTop: form.images.length ? 12 : 0 }}>
                  <AdminIcon name="upload" size={24} /><div style={{ marginTop: 8, fontSize: 13 }}>Добавить фото (можно несколько сразу)</div>
                </div>
                <input ref={mainRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => {
                  const files = [...e.target.files];
                  e.target.value = "";
                  /* setForm с функцией-апдейтером, а не set("images", ...): несколько
                     файлов читаются асинхронно и параллельно (FileReader), и каждый
                     onload должен видеть результат добавления предыдущего, а не
                     form.images, захваченный в замыкании на момент клика — иначе
                     при выборе сразу нескольких файлов в галерею попадал только
                     последний. */
                  files.forEach(f => {
                    const r = new FileReader();
                    r.onload = async ev => {
                      const watermarked = await pfCompositeWatermark(ev.target.result);
                      setForm(cur => ({ ...cur, images: [...cur.images, { url: watermarked, isMain: cur.images.length === 0 }] }));
                    };
                    r.readAsDataURL(f);
                  });
                }} />
              </Field>
              <Field label="Видео (ссылка на YouTube)">
                <input className="adm-input" value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..." />
                <div className="adm-hint">Необязательно. Ролик появится в галерее товара последним кадром.</div>
              </Field>
            </div>
          </PfAcc>

          {/* 6. Документы — вкладка «Документы» на витрине товара их уже умеет
              показывать, backend и API-клиент готовы (listRegDocs/addRegDoc/
              removeRegDoc), но раздела в самой форме не было. Доступен только
              для уже сохранённого товара — regDocument привязывается к id. */}
          <PfAcc id="docs" title="Документы" badge={badges.docs} isOpen={!!open.docs} onToggle={toggleSection}>
            <div className="adm-form">
              {!isEdit
                ? <div className="adm-text-muted" style={{ fontSize: 13 }}>Сохраните товар — документы можно прикрепить после этого.</div>
                : <React.Fragment>
                    {docs.length > 0 && (
                      <div className="pf-gallery" style={{ marginBottom: 12 }}>
                        {docs.map(d => (
                          <div className="pf-gallery-item" key={d.id} style={{ alignItems: "flex-start", padding: 10 }}>
                            <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 13 }}>
                              {REG_DOC_TYPES.find(t => t.value === (d.type || ""))?.label.split(" — ")[0] || d.type || "Паспорт"}
                            </a>
                            <div className="adm-text-muted" style={{ fontSize: 12, margin: "4px 0 8px" }}>{d.number || d.fileUrl.split("/").pop()}</div>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => removeDoc(d.id)} disabled={docsLoading}>
                              <AdminIcon name="x" size={12} /> Удалить
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Field label="Тип документа">
                      <select className="adm-select" value={newDocType} onChange={e => setNewDocType(e.target.value)}>
                        {REG_DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Файл (PDF)">
                      <input ref={docFileRef} type="file" accept="application/pdf" onChange={e => setNewDocFile(e.target.files[0] || null)} />
                    </Field>
                    <button type="button" className="btn btn-primary btn-sm" onClick={uploadDoc} disabled={!newDocFile || docsLoading}>
                      {docsLoading ? "Загрузка…" : "Добавить документ"}
                    </button>
                  </React.Fragment>
              }
            </div>
          </PfAcc>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}
window.AdminProductForm = AdminProductForm;
