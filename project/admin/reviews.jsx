/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — Reviews / Testimonials management */

function AdminReviews() {
  const { useState, useMemo } = React;
  const [items]        = useCMS("reviews");
  const [q, setQ]      = useState("");
  const [typeF, setTypeF] = useState("all");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [page, setPage]   = useState(1);
  const toast = useToast();
  const PER = 20;

  const rtype = (r) => { const v = r.type || r.group || ""; if (v==="suppliers") return "supplier"; if (v==="buyers") return "buyer"; return v||"buyer"; };

  const filtered = useMemo(() => {
    let list = [...(items || [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (typeF !== "all") list = list.filter(r => rtype(r) === typeF);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(r => {
        const name = typeof r.company === "string" ? r.company : (r.company?.ru || "");
        return name.toLowerCase().includes(ql);
      });
    }
    return list;
  }, [items, q, typeF]);

  const save = (item) => {
    const name = typeof item.company === "string" ? item.company : (item.company?.ru || "");
    if (!name.trim()) { toast("Введите название организации", "error"); return; }
    cmsOp(() => window.CMS.put("reviews", { ...item, _updated: Date.now() }), toast,
      item._isNew ? "Отзыв добавлен" : "Отзыв обновлён", () => setEditing(null));
  };

  const del = (id) => cmsOp(() => window.CMS.remove("reviews", id), toast, "Отзыв удалён", () => setConfirm(null));

  const publish = (item) => {
    cmsOp(() => window.CMS.put("reviews", { ...item, status: item.status === "published" ? "draft" : "published", _updated: Date.now() }),
      toast, item.status === "published" ? "Снято с публикации" : "Опубликовано");
  };

  const newItem = () => setEditing({
    id:      window.CMS?.uid?.("reviews") || ("rev_" + Date.now()),
    company: { ru: "", uz: "", en: "" },
    type:    "buyer",
    region:  { ru: "" },
    logo:    "",
    desc:    { ru: "", uz: "", en: "" },
    date:    new Date().toISOString().slice(0, 10),
    letter:  null,
    status:  "draft",
    _isNew:  true,
  });

  const openEdit = (r) => {
    const norm = (v) => !v ? { ru: "", uz: "", en: "" }
      : typeof v === "string" ? { ru: v, uz: "", en: "" }
      : { ru: "", uz: "", en: "", ...v };
    setEditing({ ...r, company: norm(r.company), desc: norm(r.desc), region: norm(r.region) });
  };

  const paged     = filtered.slice((page - 1) * PER, page * PER);
  const typeName  = (t) => t === "buyer" ? "Покупатель" : t === "supplier" ? "Поставщик" : t || "—";

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <div className="adm-page-title">Отзывы и благодарности</div>
          <div className="adm-page-sub">{(items || []).length} записей</div>
        </div>
        <button className="btn btn-primary" onClick={newItem}>
          <AdminIcon name="plus" size={15} /> Добавить
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-head" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchInput value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Поиск по организации…" />
          <div style={{ display: "flex", gap: 6 }}>
            {[["all", "Все"], ["buyer", "Покупатели"], ["supplier", "Поставщики"]].map(([v, l]) => (
              <button key={v}
                className={"btn btn-ghost btn-sm" + (typeF === v ? " active" : "")}
                style={typeF === v ? { background: "var(--c-primary-light)", color: "var(--c-primary)" } : {}}
                onClick={() => { setTypeF(v); setPage(1); }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {!paged.length
          ? <EmptyState title="Отзывов нет" sub="Добавьте первый отзыв или благодарственное письмо"
              action={<button className="btn btn-primary" onClick={newItem}><AdminIcon name="plus" size={14} /> Добавить</button>} />
          : <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Организация</th>
                    <th>Тип</th>
                    <th>Документ</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th className="actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map(r => {
                    const name   = typeof r.company === "string" ? r.company : (r.company?.ru || "—");
                    const desc   = typeof r.desc    === "string" ? r.desc    : (r.desc?.ru    || "");
                    const hasDoc = !!r.letter?.data;
                    const docLabel = hasDoc
                      ? (r.letter.type?.includes("pdf") ? "PDF" : "Изображение")
                      : "—";
                    return (
                      <tr key={r.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="adm-thumb-placeholder" style={{ flexShrink: 0 }}>
                              {r.logo
                                ? <img src={r.logo} alt="" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 6 }} />
                                : <AdminIcon name="briefcase" size={16} />}
                            </div>
                            <div>
                              <div className="adm-cell-main truncate" style={{ maxWidth: 260 }}>{name}</div>
                              {desc && <div className="adm-cell-sub truncate">{desc}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${rtype(r) === "supplier" ? "badge-green" : "badge-blue"}`}>
                            {typeName(rtype(r))}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: hasDoc ? "var(--c-success,#16a34a)" : "var(--c-faint,#94a3b8)" }}>
                            {docLabel}
                          </span>
                        </td>
                        <td>{r.date || "—"}</td>
                        <td><StatusBadge status={r.status || "draft"} /></td>
                        <td className="actions">
                          <div className="adm-flex">
                            <button className="btn btn-ghost btn-sm" onClick={() => publish(r)}>
                              {r.status === "published" ? "Снять" : "Опубл."}
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => openEdit(r)}>
                              <AdminIcon name="edit" size={15} />
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => setConfirm(r.id)}>
                              <AdminIcon name="trash" size={15} />
                            </button>
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

      <Modal open={!!editing} onClose={() => setEditing(null)}
        title={editing?._isNew ? "Добавить отзыв" : "Редактировать отзыв"} size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setEditing(null)}>Отмена</button>
          <button className="btn btn-primary" onClick={() => save(editing)}>Сохранить</button>
        </>}>
        {editing && <ReviewForm item={editing} onChange={setEditing} />}
      </Modal>

      <Confirm open={!!confirm} danger message="Удалить отзыв безвозвратно?"
        onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

/* ── Review add/edit form ──────────────────────────── */
function ReviewForm({ item, onChange }) {
  const { useState, useRef } = React;
  const [tab, setTab] = useState("ru");
  const fileRef = useRef(null);
  const set   = (k, v)        => onChange(i => ({ ...i, [k]: v }));
  const setT  = (l, field, v) => onChange(i => ({ ...i, [field]: { ...(i[field] || {}), [l]: v } }));

  const handleLetter = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert("Файл слишком большой (максимум 10 МБ)"); return; }
    const reader = new FileReader();
    reader.onload = ev => set("letter", { data: ev.target.result, name: f.name, type: f.type, size: f.size });
    reader.readAsDataURL(f);
  };

  const letterLabel = item.letter?.data
    ? (item.letter.type?.includes("pdf")
        ? `PDF · ${item.letter.name || "документ"} · ${Math.round((item.letter.size || 0) / 1024)} KB`
        : `Изображение · ${item.letter.name || "файл"}`)
    : null;

  return (
    <div className="adm-form">

      {/* date / type / status */}
      <div className="adm-form-row">
        <Field label="Дата публикации" required>
          <input className="adm-input" type="date" value={item.date || ""}
            onChange={e => set("date", e.target.value)} />
        </Field>
        <Field label="Тип" required>
          <select className="adm-select" value={item.type || "buyer"}
            onChange={e => set("type", e.target.value)}>
            <option value="buyer">Покупатель</option>
            <option value="supplier">Поставщик</option>
          </select>
        </Field>
        <Field label="Статус">
          <select className="adm-select" value={item.status || "draft"}
            onChange={e => set("status", e.target.value)}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
          </select>
        </Field>
      </div>

      {/* lang tabs */}
      <div className="adm-tabs" style={{ marginBottom: 12 }}>
        {["ru", "uz", "en"].map(l => (
          <div key={l} className={`adm-tab ${tab === l ? "active" : ""}`} onClick={() => setTab(l)}>
            {{ ru: "Рус", uz: "Узб", en: "Eng" }[l]}
          </div>
        ))}
      </div>

      <Field label="Название организации" required>
        <input className="adm-input" value={item.company?.[tab] || ""}
          onChange={e => setT(tab, "company", e.target.value)}
          placeholder="Полное наименование организации" />
      </Field>
      <Field label="Регион">
        <input className="adm-input" value={item.region?.[tab] || ""}
          onChange={e => setT(tab, "region", e.target.value)}
          placeholder="Ташкент, Самарканд, Наманган…" />
      </Field>
      <Field label="Краткое описание">
        <textarea className="adm-textarea" rows={2} value={item.desc?.[tab] || ""}
          onChange={e => setT(tab, "desc", e.target.value)}
          placeholder="Тематика поставки или характер сотрудничества" />
      </Field>

      {/* logo + letter upload */}
      <div className="adm-form-row" style={{ alignItems: "flex-start", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <ImageUpload label="Логотип организации" value={item.logo || ""} onChange={v => set("logo", v)} />
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Благодарственное письмо" hint="PDF или изображение — до 10 МБ">
            <div
              className={`adm-upload-zone${item.letter?.data ? " has-img" : ""}`}
              style={{ cursor: "pointer", minHeight: 108 }}
              onClick={() => fileRef.current?.click()}>
              {item.letter?.data ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 0" }}>
                  {item.letter.type?.startsWith("image/")
                    ? <img src={item.letter.data} alt="" style={{ maxHeight: 80, maxWidth: "100%", borderRadius: 6 }} />
                    : <AdminIcon name="filetext" size={32} color="var(--c-primary,#1757c8)" />}
                  <div style={{ fontSize: 12, fontWeight: 600, textAlign: "center", maxWidth: 200, wordBreak: "break-all" }}>
                    {letterLabel}
                  </div>
                  <button className="btn btn-ghost btn-sm"
                    onClick={e => { e.stopPropagation(); set("letter", null); }}>
                    <AdminIcon name="x" size={12} /> Удалить
                  </button>
                </div>
              ) : (
                <>
                  <AdminIcon name="upload" size={24} />
                  <div style={{ marginTop: 8, fontSize: 13 }}>Нажмите для загрузки</div>
                  <div className="adm-hint" style={{ marginTop: 4 }}>PDF, PNG, JPG, WebP</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,image/*"
              style={{ display: "none" }} onChange={handleLetter} />
          </Field>
        </div>
      </div>
    </div>
  );
}

window.AdminReviews = AdminReviews;
