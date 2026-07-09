/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — shared UI atoms */
const { useState: useSt, useEffect: useEf, useRef: useRf, useCallback: useCb } = React;

/* ─── Icon ─── */
function AdminIcon({ name, size = 16, color }) {
  const icons = {
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff: <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    chevdown: <><polyline points="6 9 12 15 18 9"/></>,
    chevright: <><polyline points="9 18 15 12 9 6"/></>,
    chevleft: <><polyline points="15 18 9 12 15 6"/></>,
    bars: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    package: <><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    filetext: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    news: <><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    import: <><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"/></>,
    warning: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    arrowleft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    chevup: <><polyline points="18 15 12 9 6 15"/></>,
    chevronup: <><polyline points="18 15 12 9 6 15"/></>,
    chevrondown: <><polyline points="6 9 12 15 18 9"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  );
}

/* ─── Toast system ─── */
let _toastFn = null;
function useToast() {
  return _toastFn || (() => {});
}
function ToastContainer() {
  const [toasts, setToasts] = useSt([]);
  useEf(() => {
    _toastFn = (msg, type = "success") => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { _toastFn = null; };
  }, []);
  return (
    <div className="adm-toasts">
      {toasts.map(t => (
        <div key={t.id} className={`adm-toast ${t.type}`}>
          <AdminIcon name={t.type === "success" ? "check" : t.type === "error" ? "x" : "warning"} size={14} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── CMS operation wrapper ───
   Usage: cmsOp(() => CMS.put("col", item), toast, "Сохранено", () => setEditing(null))
   Shows success toast only on ok:true; shows error toast with server reason on ok:false. */
async function cmsOp(fn, toast, successMsg, onSuccess) {
  try {
    const r = await fn();                 // awaits both sync ({ok,error}) and async (Promise) results
    if (r && r.ok === false) {
      toast(r.error || "Ошибка сохранения", "error");
      return false;
    }
    if (successMsg) toast(successMsg);
    if (onSuccess) onSuccess();
    return true;
  } catch (e) {
    toast((e && e.message) || "Ошибка сохранения", "error");
    return false;
  }
}
window.cmsOp = cmsOp;

/* ─── Modal ─── */
function Modal({ open, onClose, title, size = "md", children, footer }) {
  useEf(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`adm-modal ${size}`} role="dialog">
        <div className="adm-modal-head">
          <span className="adm-modal-title">{title}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><AdminIcon name="x" size={16} /></button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Confirm dialog ─── */
function Confirm({ open, message, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="adm-modal sm">
        <div className="adm-modal-body" style={{ textAlign: "center", paddingTop: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: danger ? "var(--c-danger-light)" : "var(--c-warning-light)", color: danger ? "var(--c-danger)" : "var(--c-warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AdminIcon name="warning" size={22} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{message || "Вы уверены?"}</p>
        </div>
        <div className="adm-modal-foot">
          <button className="btn btn-secondary" onClick={onCancel}>Отмена</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>Подтвердить</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Image uploader ─── */
function ImageUpload({ value, onChange, label }) {
  const ref = useRf();
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(f);
  };
  return (
    <div>
      {label && <div className="adm-label" style={{ marginBottom: 6 }}>{label}</div>}
      <div className={`adm-upload-zone ${value ? "has-img" : ""}`} onClick={() => ref.current.click()}>
        {value ? (
          <div style={{ position: "relative" }}>
            <img src={value} alt="" style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6 }} />
            <button className="btn btn-danger btn-sm" style={{ position: "absolute", top: 4, right: 4 }}
              onClick={e => { e.stopPropagation(); onChange(""); }}>
              <AdminIcon name="x" size={12} />
            </button>
          </div>
        ) : (
          <>
            <AdminIcon name="upload" size={24} />
            <div style={{ marginTop: 8, fontSize: 13 }}>Нажмите для загрузки изображения</div>
            <div className="adm-hint" style={{ marginTop: 4 }}>PNG, JPG, WebP — до 2MB</div>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

/* ─── Search input ─── */
function SearchInput({ value, onChange, placeholder = "Поиск…" }) {
  return (
    <div className="adm-search">
      <span className="adm-search-icon"><AdminIcon name="search" size={14} /></span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

/* ─── Pagination ─── */
function Pagination({ page, total, perPage = 20, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  const nums = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) nums.push(i);
  return (
    <div className="adm-pagination">
      <span>{start}–{end} из {total}</span>
      <div className="adm-pagination-btns">
        <button className="adm-pager" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {nums[0] > 1 && <><button className="adm-pager" onClick={() => onChange(1)}>1</button>{nums[0] > 2 && <span style={{ padding: "0 4px", color: "var(--c-faint)" }}>…</span>}</>}
        {nums.map(n => <button key={n} className={`adm-pager ${n === page ? "active" : ""}`} onClick={() => onChange(n)}>{n}</button>)}
        {nums[nums.length - 1] < pages && <><span style={{ padding: "0 4px", color: "var(--c-faint)" }}>…</span><button className="adm-pager" onClick={() => onChange(pages)}>{pages}</button></>}
        <button className="adm-pager" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const map = {
    published: ["badge-green", "Опубликовано"],
    draft: ["badge-gray", "Черновик"],
    archived: ["badge-yellow", "Архив"],
    active: ["badge-green", "Активно"],
    inactive: ["badge-gray", "Неактивно"],
    new: ["badge-blue", "Новый"],
    processed: ["badge-green", "Обработан"],
    pending: ["badge-yellow", "Ожидает"],
  };
  const [cls, label] = map[status] || ["badge-gray", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

/* ─── Empty state ─── */
function EmptyState({ title = "Нет данных", sub = "Добавьте первую запись", action }) {
  return (
    <div className="adm-empty">
      <AdminIcon name="package" size={40} />
      <h4>{title}</h4>
      <p>{sub}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/* ─── Field component ─── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="adm-field">
      {label && <label className="adm-label">{label}{required && <span className="req">*</span>}</label>}
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
      {error && <span className="adm-error">{error}</span>}
    </div>
  );
}

/* ─── useCMS hook ─── */
function useCMS(col) {
  const [items, setItems] = useSt(() => window.CMS ? window.CMS.list(col) : []);
  useEf(() => {
    if (!window.CMS) return;
    setItems(window.CMS.list(col));
    return window.CMS.on(col, () => setItems(window.CMS.list(col)));
  }, [col]);
  return [items, setItems];
}

/* ─── useSettings hook ─── */
function useSettings(key, def) {
  const [val, setVal] = useSt(() => window.CMS ? window.CMS.getSetting(key, def) : def);
  const valRef = useRf(val);
  useEf(() => {
    if (!window.CMS) return;
    const latest = window.CMS.getSetting(key, def);
    valRef.current = latest;
    setVal(latest);
    // Re-read when the async settings prefetch completes (or another edit lands).
    return window.CMS.on ? window.CMS.on("settings", () => {
      const next = window.CMS.getSetting(key, def);
      valRef.current = next;
      setVal(next);
    }) : undefined;
  }, [key]);
  const save = (valueOrUpdater) => {
    const prev = valRef.current;
    const next = typeof valueOrUpdater === "function" ? valueOrUpdater(prev) : valueOrUpdater;
    valRef.current = next;
    setVal(next);
    return window.CMS ? window.CMS.setSetting(key, next) : undefined;
  };
  return [val, save];
}

window.AdminIcon = AdminIcon;
window.ToastContainer = ToastContainer;
window.useToast = useToast;
window.Modal = Modal;
window.Confirm = Confirm;
window.ImageUpload = ImageUpload;
window.SearchInput = SearchInput;
window.Pagination = Pagination;
window.StatusBadge = StatusBadge;
window.EmptyState = EmptyState;
window.Field = Field;
window.useCMS = useCMS;
window.useSettings = useSettings;
