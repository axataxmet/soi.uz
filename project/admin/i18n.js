/* UzMedEx — Unified CMS Store
   Single persistence layer for ALL site content, backed by localStorage.
   Collections: products, categories, brands, pages, blocks, banners,
   advantages, directions, news, documents, media, seo, users, roles,
   submissions, settings.
   Loaded on BOTH storefront and admin, right AFTER app/data.js.
   Syncs products/categories/brands into window.DATA so the live site reflects edits. */
(function () {
  const NS = "uzmedex_cms_v1";

  // ---- low-level persistence ----
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(NS)) || {}; }
    catch (e) { return {}; }
  }
  function saveAll(db) {
    try { localStorage.setItem(NS, JSON.stringify(db)); return true; }
    catch (e) {
      const quota = e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014);
      try { window.dispatchEvent(new CustomEvent("cms-save-error", { detail: { quota: !!quota, error: e } })); } catch (_) {}
      console.error("[CMS] save failed" + (quota ? " — localStorage quota exceeded" : ""), e);
      return false;
    }
  }

  let DB = loadAll();

  // ---- pub/sub ----
  const subs = {};
  function emit(col) {
    (subs[col] || []).forEach((fn) => { try { fn(); } catch (e) {} });
    (subs["*"]   || []).forEach((fn) => { try { fn(col); } catch (e) {} });
  }
  function on(col, fn) {
    (subs[col] = subs[col] || []).push(fn);
    return () => { subs[col] = (subs[col] || []).filter((f) => f !== fn); };
  }

  const uid = (pre) => (pre || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // ---- generic collection CRUD ----
  function list(col) { return (DB[col] || []).slice(); }
  function get(col, id) { return (DB[col] || []).find((x) => x.id === id) || null; }

  const ERR_QUOTA = "Не удалось сохранить: хранилище браузера переполнено. Удалите неиспользуемые данные.";
  const ERR_SAVE  = "Не удалось сохранить: ошибка записи в хранилище.";

  function put(col, item) {
    DB[col] = DB[col] || [];
    if (!item.id) item.id = uid(col.slice(0, 3));
    const i = DB[col].findIndex((x) => x.id === item.id);
    if (i >= 0) DB[col][i] = Object.assign({}, DB[col][i], item, { _updated: Date.now() });
    else DB[col].push(Object.assign({ _created: Date.now(), _updated: Date.now() }, item));
    const ok = saveAll(DB); syncData(); emit(col);
    return { ok, item, error: ok ? null : ERR_QUOTA };
  }
  function remove(col, id) {
    DB[col] = (DB[col] || []).filter((x) => x.id !== id);
    const ok = saveAll(DB); syncData(); emit(col);
    return { ok, error: ok ? null : ERR_SAVE };
  }
  function removeMany(col, ids) {
    const set = new Set(ids);
    DB[col] = (DB[col] || []).filter((x) => !set.has(x.id));
    const ok = saveAll(DB); syncData(); emit(col);
    return { ok, error: ok ? null : ERR_SAVE };
  }
  function patchMany(col, ids, patch) {
    const set = new Set(ids);
    DB[col] = (DB[col] || []).map((x) => set.has(x.id) ? Object.assign({}, x, patch, { _updated: Date.now() }) : x);
    const ok = saveAll(DB); syncData(); emit(col);
    return { ok, error: ok ? null : ERR_SAVE };
  }
  function reorder(col, ids) {
    const map = {}; (DB[col] || []).forEach((x) => map[x.id] = x);
    DB[col] = ids.map((id) => map[id]).filter(Boolean);
    const ok = saveAll(DB); syncData(); emit(col);
    return { ok, error: ok ? null : ERR_SAVE };
  }
  function setCol(col, arr) { DB[col] = arr; const ok = saveAll(DB); syncData(); emit(col); return { ok, error: ok ? null : ERR_SAVE }; }
  function replaceCollection(col, arr) { return setCol(col, arr); }

  // settings (key-value)
  function getSetting(k, def) { return (DB._settings && k in DB._settings) ? DB._settings[k] : def; }
  function setSetting(k, v) { DB._settings = DB._settings || {}; DB._settings[k] = v; const ok = saveAll(DB); emit("settings"); return { ok, error: ok ? null : ERR_SAVE }; }

  // Каталог (categories/brands/products) больше НЕ строится из localStorage — им владеет
  // app/catalog-remote.js (REST API, PostgreSQL). Функция оставлена как no-op, т.к. её всё
  // ещё дёргают generic-мутаторы CMS (setCol/removeMany/…) для не-каталожных коллекций.
  function syncData() { /* retired: catalog lives only in PostgreSQL (A3) */ }

  // ---- wipe everything (clear test/default data before launch) ----
  function wipeAll() {
    DB = {};
    localStorage.removeItem(NS);
    // also clear legacy overlay keys
    try {
      localStorage.removeItem("uzmedex_custom_products");
      localStorage.removeItem("uzmedex_custom_brands");
    } catch (e) {}
    saveAll(DB);
    if (window.DATA) window.DATA.PRODUCTS = (window.DATA.PRODUCTS || []).filter((p) => !p._cms);
    emit("*");
  }
  function wipeCollection(col) { setCol(col, []); }

  window.CMS = {
    NS, list, get, put, remove, removeMany, patchMany, reorder,
    setCol, replaceCollection, getSetting, setSetting,
    on, emit, uid, syncData, wipeAll, wipeCollection,
    raw: () => DB,
  };

  // ---- one-time migration: recompress oversized base64 images already in the store ----
  // Large uncompressed logos/photos saved before the compressor existed can fill the
  // ~5MB localStorage quota and block ALL new uploads. This reclaims that space.
  function recompressDataUrl(dataUrl, maxPx, quality) {
    return new Promise((resolve) => {
      if (typeof dataUrl !== "string" || !/^data:image\/(png|jpe?g|webp)/i.test(dataUrl)) { resolve(null); return; }
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.width, h = img.height; const MAX = maxPx || 900;
          if (w > MAX || h > MAX) { const s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL("image/jpeg", quality || 0.8));
        } catch (e) { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }
  async function reclaimSpace() {
    try {
      if (DB._reclaimed_v1) return;
      const THRESH = 160 * 1024; // recompress base64 images larger than ~160KB
      let changed = false, saved = 0;
      // fields that may hold an image: either a raw dataURL string or {data} object
      const visit = async (obj, key) => {
        const v = obj[key];
        if (!v) return;
        if (typeof v === "string" && v.startsWith("data:image") && v.length > THRESH) {
          const nu = await recompressDataUrl(v); if (nu && nu.length < v.length) { saved += v.length - nu.length; obj[key] = nu; changed = true; }
        } else if (v && typeof v === "object" && typeof v.data === "string" && v.data.startsWith("data:image") && v.data.length > THRESH) {
          const nu = await recompressDataUrl(v.data); if (nu && nu.length < v.data.length) { saved += v.data.length - nu.length; v.data = nu; v.type = "image/jpeg"; v.size = Math.round(nu.length * 0.75); changed = true; }
        }
      };
      for (const col of Object.keys(DB)) {
        const arr = DB[col]; if (!Array.isArray(arr)) continue;
        for (const it of arr) {
          if (!it || typeof it !== "object") continue;
          for (const k of ["logo", "img", "image", "cover", "photo", "flag", "file", "thumb"]) await visit(it, k);
          if (Array.isArray(it.gallery)) for (let i = 0; i < it.gallery.length; i++) { const g = it.gallery[i]; if (typeof g === "string") { const nu = await recompressDataUrl(g); if (nu && nu.length < g.length) { saved += g.length - nu.length; it.gallery[i] = nu; changed = true; } } else if (g) await visit(it.gallery, i); }
        }
      }
      DB._reclaimed_v1 = true;
      if (changed) { saveAll(DB); syncData(); emit("*"); console.info("[CMS] reclaimSpace freed ~" + Math.round(saved / 1024) + "KB"); }
      else saveAll(DB);
    } catch (e) { console.error("[CMS] reclaimSpace failed", e); }
  }
  window.CMS.reclaimSpace = reclaimSpace;

  // Весь контент (каталог + новости/отзывы) теперь живёт только в PostgreSQL и приходит
  // через REST API (catalog-remote.js + cms-remote.js адаптеры). Legacy localStorage-сиды
  // выключены. Одноразовая чистка устаревших данных прошлых сессий, чтобы не осталось
  // дублирующего механизма хранения (требование A3).
  (function purgeLegacyContent() {
    if (DB._content_purged_a3) return;
    ["categories", "brands", "products", "subcategories", "directions",
     "cat_categories", "cat_subcategories", "cat_directions", "cat_sections",
     "cat_groups", "cat_links", "cat_seccats",
     "news", "reviews"].forEach((k) => { delete DB[k]; });
    DB._content_purged_a3 = true;
    delete DB._catalog_purged_a3; delete DB._seeded;
    saveAll(DB);
    try { localStorage.removeItem("uzmedex_custom_products"); localStorage.removeItem("uzmedex_custom_brands"); } catch (e) {}
  })();

  reclaimSpace();
})();
