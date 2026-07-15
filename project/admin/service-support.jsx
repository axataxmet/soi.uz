/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — страница «Сервис и поддержка»
   Три вкладки: Hero (фото/видео фоном), Обслуживаемое оборудование (добавление/скрытие),
   База знаний (добавление ссылок). Данные — в settings service_hero / service_equipment /
   service_docs (см. SETTINGS_REMOTE в cms-remote.js); медиа грузится сразу в MinIO,
   в настройке хранится только URL. Дефолты зеркалят app/service-support.jsx. */

const SS_ADMIN_EQUIPMENT_DEFAULTS = [
  "Ультразвуковые системы", "Рентгеновское оборудование", "Компьютерные томографы",
  "Магнитно-резонансные томографы", "Маммографы", "Эндоскопическое оборудование",
  "Лабораторное оборудование", "Офтальмология", "Реанимационное оборудование",
  "Стоматологическое оборудование",
].map((name) => ({ name, photo: "", link: "", hidden: false }));

const SS_ADMIN_DOCS_DEFAULTS = [
  "Руководства пользователя", "Каталоги", "Сертификаты", "Инструкции",
  "Программное обеспечение", "Часто задаваемые вопросы", "Полезные статьи",
].map((title) => ({ title, url: "" }));

/* Загрузка сразу в MinIO через /media/upload — принимает и изображения, и видео. */
function SsMediaUpload({ label, hint, accept, value, isVideo, onChange }) {
  const { useState, useRef } = React;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef(null);
  const toast = useToast();
  const handle = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setErr(""); setBusy(true);
    try {
      const res = await window.api.uploadBlob(f, f.name);
      onChange(res.url, f.type);
      toast("Файл загружен");
    } catch (ex) {
      setErr((ex && ex.message) || "Ошибка загрузки");
    } finally { setBusy(false); }
  };
  return (
    <div>
      {label && <div className="adm-label" style={{ marginBottom: 6 }}>{label}</div>}
      <div className={`adm-upload-zone ${value ? "has-img" : ""}`} onClick={() => !busy && ref.current.click()}>
        {value ? (
          <div style={{ position: "relative" }}>
            {isVideo
              ? <video src={value} muted loop playsInline style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 6 }} />
              : <img src={value} alt="" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 6 }} />}
            <button className="btn btn-danger btn-sm" style={{ position: "absolute", top: 4, right: 4 }}
              onClick={(e) => { e.stopPropagation(); onChange("", ""); }}>
              <AdminIcon name="x" size={12} />
            </button>
          </div>
        ) : (
          <>
            <AdminIcon name="upload" size={24} />
            <div style={{ marginTop: 8, fontSize: 13 }}>{busy ? "Загрузка…" : "Нажмите для загрузки"}</div>
            {hint && <div className="adm-hint" style={{ marginTop: 4 }}>{hint}</div>}
          </>
        )}
      </div>
      {err && <div style={{ color: "var(--c-danger,#d33)", fontSize: 12.5, marginTop: 6 }}>{err}</div>}
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={handle} />
    </div>
  );
}

function AdminServiceSupport() {
  const { useState } = React;
  const toast = useToast();
  const [tab, setTab] = useState("hero");

  // getSetting отдаёт null для ещё не сохранённых ключей — страхуемся дефолтами.
  const [heroRaw, saveHero] = useSettings("service_hero", { type: "", url: "" });
  const hero = heroRaw || { type: "", url: "" };
  const [eqRaw, saveEq] = useSettings("service_equipment", { items: SS_ADMIN_EQUIPMENT_DEFAULTS });
  const eqItems = (eqRaw && Array.isArray(eqRaw.items)) ? eqRaw.items : SS_ADMIN_EQUIPMENT_DEFAULTS;
  const [docsRaw, saveDocs] = useSettings("service_docs", { items: SS_ADMIN_DOCS_DEFAULTS });
  const docItems = (docsRaw && Array.isArray(docsRaw.items)) ? docsRaw.items : SS_ADMIN_DOCS_DEFAULTS;

  const persist = (saver, val, msg) => cmsOp(() => saver(val), toast, msg || "Сохранено");

  const setEqItem = (i, patch) => {
    const next = eqItems.map((it, j) => (j === i ? { ...it, ...patch } : it));
    persist(saveEq, { items: next });
  };
  const addEq = () => persist(saveEq, { items: [...eqItems, { name: "Новая категория", photo: "", link: "", hidden: false }] }, "Категория добавлена");
  const delEq = (i) => persist(saveEq, { items: eqItems.filter((_, j) => j !== i) }, "Удалено");

  const setDoc = (i, patch) => persist(saveDocs, { items: docItems.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  const addDoc = () => persist(saveDocs, { items: [...docItems, { title: "Новый раздел", url: "" }] }, "Раздел добавлен");
  const delDoc = (i) => persist(saveDocs, { items: docItems.filter((_, j) => j !== i) }, "Удалено");

  const TABS = [["hero", "Hero (фото/видео)"], ["equipment", "Оборудование"], ["docs", "База знаний"]];

  return (
    <div>
      <div className="adm-page-head">
        <div className="adm-page-title">Сервис и поддержка</div>
        <a className="btn btn-secondary" href="/#/service-support" target="_blank" rel="noopener">Открыть страницу</a>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TABS.map(([id, label]) => (
          <button key={id} className={"btn " + (tab === id ? "btn-primary" : "btn-secondary")} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="adm-card" style={{ padding: 24, maxWidth: 620 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Фон Hero-блока</div>
          <div className="adm-hint" style={{ marginBottom: 16 }}>
            Фото или видео растягивается на весь Hero-блок страницы. Без файла показывается стандартный фон.
          </div>
          <SsMediaUpload
            accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
            hint="PNG, JPG, WebP до 15 МБ · видео MP4/WebM до 100 МБ"
            value={hero.url}
            isVideo={hero.type === "video"}
            onChange={(url, mime) => persist(saveHero, url ? { type: (mime || "").indexOf("video/") === 0 ? "video" : "image", url } : { type: "", url: "" })}
          />
          {hero.url && (
            <div className="adm-hint" style={{ marginTop: 12 }}>
              Тип: {hero.type === "video" ? "видео (autoplay, без звука, по кругу)" : "изображение"}
            </div>
          )}
        </div>
      )}

      {tab === "equipment" && (
        <div>
          <div className="adm-flex" style={{ justifyContent: "space-between", marginBottom: 14 }}>
            <div className="adm-hint">Скрытые категории не показываются на странице. Ссылка — например #/catalog или #/catalog/listing/equipment.</div>
            <button className="btn btn-primary" onClick={addEq}><AdminIcon name="plus" size={15} /> Добавить</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
            {eqItems.map((it, i) => (
              <div key={i} className="adm-card" style={{ padding: 16, opacity: it.hidden ? 0.55 : 1 }}>
                <Field label="Название">
                  <input className="adm-input" value={it.name || ""} onChange={(e) => setEqItem(i, { name: e.target.value })} />
                </Field>
                <Field label="Ссылка (куда ведёт карточка)">
                  <input className="adm-input" placeholder="#/catalog" value={it.link || ""} onChange={(e) => setEqItem(i, { link: e.target.value })} />
                </Field>
                <SsMediaUpload label="Фото" accept="image/png,image/jpeg,image/webp" hint="PNG, JPG, WebP"
                  value={it.photo || ""} onChange={(url) => setEqItem(i, { photo: url })} />
                <div className="adm-flex" style={{ justifyContent: "space-between", marginTop: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!it.hidden} onChange={(e) => setEqItem(i, { hidden: e.target.checked })} style={{ width: 15, height: 15 }} />
                    Скрыть
                  </label>
                  <button className="btn btn-ghost btn-icon" onClick={() => delEq(i)}><AdminIcon name="trash" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "docs" && (
        <div style={{ maxWidth: 680 }}>
          <div className="adm-flex" style={{ justifyContent: "space-between", marginBottom: 14 }}>
            <div className="adm-hint">Разделы блока «Документация и база знаний». URL — ссылка на документ или страницу (пусто = карточка ведёт к форме заявки).</div>
            <button className="btn btn-primary" onClick={addDoc}><AdminIcon name="plus" size={15} /> Добавить</button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {docItems.map((it, i) => (
              <div key={i} className="adm-card" style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center" }}>
                <input className="adm-input" value={it.title || ""} onChange={(e) => setDoc(i, { title: e.target.value })} placeholder="Название" />
                <input className="adm-input" value={it.url || ""} onChange={(e) => setDoc(i, { url: e.target.value })} placeholder="URL (необязательно)" />
                <button className="btn btn-ghost btn-icon" onClick={() => delDoc(i)}><AdminIcon name="trash" size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
window.AdminServiceSupport = AdminServiceSupport;
