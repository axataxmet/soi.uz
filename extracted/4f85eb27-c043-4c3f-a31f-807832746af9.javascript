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

  function put(col, item) {
    DB[col] = DB[col] || [];
    if (!item.id) item.id = uid(col.slice(0, 3));
    const i = DB[col].findIndex((x) => x.id === item.id);
    if (i >= 0) DB[col][i] = Object.assign({}, DB[col][i], item, { _updated: Date.now() });
    else DB[col].push(Object.assign({ _created: Date.now(), _updated: Date.now() }, item));
    const ok = saveAll(DB); syncData(); emit(col);
    if (!ok) item._saveFailed = true;
    return item;
  }
  function remove(col, id) {
    DB[col] = (DB[col] || []).filter((x) => x.id !== id);
    saveAll(DB); syncData(); emit(col);
  }
  function removeMany(col, ids) {
    const set = new Set(ids);
    DB[col] = (DB[col] || []).filter((x) => !set.has(x.id));
    saveAll(DB); syncData(); emit(col);
  }
  function patchMany(col, ids, patch) {
    const set = new Set(ids);
    DB[col] = (DB[col] || []).map((x) => set.has(x.id) ? Object.assign({}, x, patch, { _updated: Date.now() }) : x);
    saveAll(DB); syncData(); emit(col);
  }
  function reorder(col, ids) {
    const map = {}; (DB[col] || []).forEach((x) => map[x.id] = x);
    DB[col] = ids.map((id) => map[id]).filter(Boolean);
    saveAll(DB); syncData(); emit(col);
  }
  function setCol(col, arr) { DB[col] = arr; saveAll(DB); syncData(); emit(col); }
  function replaceCollection(col, arr) { setCol(col, arr); }

  // settings (key-value)
  function getSetting(k, def) { return (DB._settings && k in DB._settings) ? DB._settings[k] : def; }
  function setSetting(k, v) { DB._settings = DB._settings || {}; DB._settings[k] = v; saveAll(DB); emit("settings"); }

  // ---- sync products/categories/brands into window.DATA (live site) ----
  function syncData() {
    if (!window.DATA) return;
    const D = window.DATA;
    // NEW normalized catalog (cat_categories + cat_subcategories) is the source of
    // truth when seeded — active-only, replaces legacy categories on the live site.
    if (DB.cat_categories && DB.cat_categories.length) {
      const subsAll = DB.cat_subcategories || [];
      D.CATEGORIES = DB.cat_categories
        .filter((c) => c.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((c) => ({
          id: c.id, icon: c.icon || "catalog",
          ru: c.name, uz: c.name, en: c.name,
          subs: subsAll
            .filter((s) => s.cat === c.id && s.active !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((s) => ({ ru: s.name, uz: s.name, en: s.name, _id: s.id })),
        }));
    } else if (DB.categories && DB.categories.length) {
      // legacy fallback
      D.CATEGORIES = DB.categories.map((c) => ({
        id: c.id, icon: c.icon || "catalog",
        ru: c.ru, uz: c.uz, en: c.en,
        subs: (c.subs || []).map((s) => ({ ru: s.ru, uz: s.uz, en: s.en })),
      }));
    }
    // brands: CMS is the source of truth when seeded — full replace so deletes propagate
    if (DB.brands) {
      const builtinNonCms = D.BRANDS.filter((b) => b._fixed);
      D.BRANDS = builtinNonCms.concat(DB.brands.map((b) => Object.assign({}, b)));
    }
    // products: CMS products are the source of truth when present
    if (DB.products) {
      const customs = DB.products.filter((p) => p.published !== false).map(normalizeProduct);
      // remove previous CMS products from DATA, then append
      D.PRODUCTS = D.PRODUCTS.filter((p) => !p._cms).concat(customs);
    }
  }

  function normalizeProduct(o) {
    const sku = String(o.sku || ("X" + Date.now()));
    // ---- media: admin stores objects {data,name,type,alt}; site wants src strings ----
    const srcOf = (v) => !v ? null : (typeof v === "string" ? v : (v.data || v.src || null));
    const imgSrc = srcOf(o.img);
    const gallerySrcs = (o.gallery || []).map((g) => ({ src: srcOf(g), alt: g && g.alt || "" })).filter((g) => g.src);
    const images = [imgSrc].concat(gallerySrcs.map((g) => g.src)).filter(Boolean);
    // ---- specs: admin shape {k,v,unit} → site shape {kr,ku,ke,v,ve} ----
    const specs = (o.specs || []).map((s) => {
      if (!s) return { kr: "", ku: "", ke: "", v: "" };
      if (s.kr != null || s.ku != null || s.ke != null) return s; // already site shape
      const val = [s.v, s.unit].filter((x) => x != null && x !== "").join(" ").trim();
      return { kr: s.k || "", ku: s.k || "", ke: s.k || "", v: val, ve: "" };
    }).filter((s) => (s.kr || s.v));
    // ---- documents: admin shape {file:{data,name,type,size},title,docType} ----
    const docs = (o.docs || []).map((d) => ({
      title: d.title || (d.file && d.file.name) || "Документ",
      docType: d.docType || "other",
      src: d.file ? d.file.data : (d.src || d.data || null),
      mime: d.file ? d.file.type : (d.mime || ""),
      size: d.file ? d.file.size : (d.size || 0),
    })).filter((d) => d.src);
    // ---- related: admin nested {analogs,accessories,consumables,parts} → flat id arrays ----
    const toIds = (a) => Array.isArray(a) ? a.map(String) : [];
    const relNested = o.related && !Array.isArray(o.related) ? o.related : null;
    const related = relNested ? toIds(relNested.analogs) : (o.related || []);
    const accessories = relNested ? toIds(relNested.accessories).concat(toIds(relNested.parts)) : (o.accessories || []);
    const consumables = relNested ? toIds(relNested.consumables) : (o.consumables || []);

    const base = Object.assign({
      id: o.id || ("p_" + sku), sku,
      badge: o.badge || null, old: o.old || null,
      pop: o.pop || 60, isNew: !!o.isNew,
      extraCats: o.extraCats || [],
      variants: o.variants || [],
      glyph: o.glyph || "pulse", _cms: true,
    }, o);
    // explicit overrides — must win over the raw admin fields spread above
    base.img = imgSrc;            // string src (or null) for placeholder/gallery
    base.images = images;         // ordered src list for the gallery
    base.gallery = gallerySrcs;   // [{src,alt}]
    base.specs = specs;
    base.docFiles = docs;
    base.video = o.youtube || o.video || "";
    base.related = related;
    base.accessories = accessories;
    base.consumables = consumables;
    return base;
  }

  // ---- seed: import current static DATA into CMS on first run (optional) ----
  function seedFromData(force) {
    if (!window.DATA) return;
    if (DB._seeded && !force) return;
    // We DON'T copy demo products (they were cleared). Seed categories + brands so they're editable.
    if (!DB.categories || force) {
      DB.categories = (window.DATA.CATEGORIES || []).map((c) => ({
        id: c.id, icon: c.icon, ru: c.ru, uz: c.uz, en: c.en,
        subs: (c.subs || []).map((s) => ({ ru: s.ru, uz: s.uz, en: s.en })),
        _created: Date.now(), _updated: Date.now(),
      }));
    }
    if (!DB.brands || force) {
      DB.brands = (window.DATA.BRANDS || []).map((b) => Object.assign({}, b));
    }
    // news & articles: seed from built-in set so the unified "Новости и публикации" admin has content
    if (!DB.news || force) {
      const N = (k, type, date, tags, title, excerpt) => ({
        id: k, type, date, published: true,
        tags: tags, title, excerpt, body: { ru: "", uz: "", en: "" }, cover: null,
        _created: Date.now(), _updated: Date.now(),
      });
      DB.news = [
        N("n_perinatal", "new", "2026-06-12", ["supply", "diagnostics"],
          { ru: "Завершено оснащение перинатального центра в Андижане", uz: "Andijonda perinatal markaz jihozlandi", en: "Perinatal center in Andijan equipped" },
          { ru: "Поставлены инкубаторы, открытые реанимационные системы и оборудование для неонатологии.", uz: "Inkubatorlar, ochiq reanimatsiya tizimlari va neonatologiya uskunalari yetkazildi.", en: "Incubators, open care systems and neonatology equipment delivered." }),
        N("n_mdreg", "article", "2026-05-28", ["mdreg"],
          { ru: "Обновление требований к регистрации медицинских изделий", uz: "Tibbiy buyumlarni ro'yxatga olish talablari yangilandi", en: "Updated medical device registration requirements" },
          { ru: "Краткий обзор изменений процедуры и что это значит для импортёров и производителей.", uz: "Jarayon o'zgarishlari sharhi va bu importchilar uchun nimani anglatishi.", en: "A short overview of procedure changes and what they mean for importers." }),
        N("n_diag", "new", "2026-05-15", ["brands", "diagnostics"],
          { ru: "Расширение линейки диагностического оборудования", uz: "Diagnostika uskunalari liniyasi kengaytirildi", en: "Diagnostic equipment range expanded" },
          { ru: "Новые модели УЗИ-систем и мониторов пациента доступны для заказа в каталоге.", uz: "Yangi UZI tizimlari va bemor monitorlari katalogda mavjud.", en: "New ultrasound systems and patient monitors available in the catalog." }),
        N("n_service", "guide", "2026-04-30", ["service"],
          { ru: "Как организовать сервисное обслуживание оборудования клиники", uz: "Klinika uskunasini servis qilishni qanday tashkil etish", en: "How to organize clinic equipment servicing" },
          { ru: "Гарантийное и постгарантийное обслуживание оборудования теперь ближе к клиникам.", uz: "Uskunaning kafolat va kafolatdan keyingi xizmati endi klinikalarga yaqinroq.", en: "Warranty and post-warranty service is now closer to clinics." }),
        N("n_warehouse", "company", "2026-04-12", ["supply"],
          { ru: "Открыт новый склад в Ташкенте площадью 3 000 м²", uz: "Toshkentda 3 000 m² yangi ombor ochildi", en: "New 3,000 m² warehouse opened in Tashkent" },
          { ru: "Расширение складских мощностей сокращает сроки поставки по Ташкенту до одного рабочего дня.", uz: "Ombor quvvati Toshkent bo'ylab yetkazishni bir ish kuniga qisqartiradi.", en: "Expanded warehouse capacity cuts Tashkent delivery times to one business day." }),
        N("n_tender", "tender", "2026-03-26", ["procurement", "diagnostics"],
          { ru: "Выигран тендер на оснащение центра онкологии на 2,1 млрд сум", uz: "Onkologiya markazi jihozlash tenderi yutildi", en: "Won oncology centre equipping tender worth 2.1B UZS" },
          { ru: "Комплексное оснащение нового отделения лучевой диагностики республиканского центра.", uz: "Respublika markazi nurli diagnostika bo'limini to'liq jihozlash.", en: "Turnkey equipping of the new diagnostic imaging department." }),
        N("n_case_clinic", "case", "2026-03-05", ["furniture", "supply"],
          { ru: "Кейс: оснащение частной клиники «под ключ» за 45 дней", uz: "Keys: xususiy klinikani 45 kunda «kalit topshirish»", en: "Case: turnkey private clinic equipping in 45 days" },
          { ru: "От проекта до запуска: мебель, оборудование, монтаж и обучение персонала.", uz: "Loyihadan ishga tushirishgacha: mebel, uskuna, montaj va o'qitish.", en: "From project to launch: furniture, equipment, installation and training." }),
      ];
    }
    seedReviews(force);
    DB._seeded = true;
    saveAll(DB); syncData();
  }

  // ---- seed: normalized catalog (categories/subcats/directions/sections/groups + links) ----
  // Source: core/catalog-data.js → window.SOI_CATALOG_DEFAULT. Idempotent per version flag.
  function seedCatalog(force) {
    const SRC = window.SOI_CATALOG_DEFAULT;
    if (!SRC) return;
    const VER = "v1";
    if (getSetting("catalog_seed") === VER && !force) return;
    const stamp = (arr) => (arr || []).map((o) => Object.assign({ _created: Date.now(), _updated: Date.now() }, o));
    DB.cat_categories    = stamp(SRC.categories);
    DB.cat_subcategories = stamp(SRC.subcategories);
    DB.cat_directions    = stamp(SRC.directions);
    DB.cat_sections      = stamp(SRC.sections);
    DB.cat_groups        = stamp(SRC.groups);
    // links carry a synthetic id so they're CRUD-able
    DB.cat_links   = (SRC.links   || []).map((l, i) => ({ id: "L" + (i + 1), group: l.group, section: l.section, _created: Date.now() }));
    DB.cat_seccats = (SRC.secCats || []).map((s, i) => ({ id: "SC" + (i + 1), group: s.group, cat: s.cat, _created: Date.now() }));
    DB._settings = DB._settings || {}; DB._settings.catalog_seed = VER;
    saveAll(DB); emit("cat_categories"); emit("cat_subcategories"); emit("cat_directions"); emit("cat_sections"); emit("cat_groups"); emit("cat_links");
  }

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
    on, emit, uid, syncData, seedFromData, seedCatalog, wipeAll, wipeCollection,
    normalizeProduct,
    raw: () => DB,
  };

  // ---- seed: thank-you letters (idempotent, runs even on already-seeded stores) ----
  function seedReviews(force) {
    if (DB.reviews && DB.reviews.length && !force) return;
    const RV = (id, group, color, company, region, supplied, quote, body) => ({
      id, group, color, status: "published",
      company, region, supplied, quote, body,
      _created: Date.now(), _updated: Date.now(),
    });
    const M = (ru, uz, en) => ({ ru, uz: uz || ru, en: en || ru });
    DB.reviews = [
      RV("rv_namangan", "buyers", "#c0392b",
        M("Наманганская областная больница", "Namangan viloyat shifoxonasi", "Namangan Regional Hospital"),
        M("Наманган · госучреждение", "Namangan · davlat", "Namangan · public"),
        M("Оборудование для отделения диагностики", "Diagnostika boʻlimi uchun uskunalar", "Diagnostics department equipment"),
        M("Выражаем благодарность Sog'liq Industriyasi за оперативную поставку и качественный монтаж оборудования для отделения диагностики.", "Sog'liq Industriyasi jamoasiga tez yetkazib berish va sifatli montaj uchun minnatdorchilik bildiramiz.", "We thank Sog'liq Industriyasi for prompt delivery and quality installation of equipment for our diagnostics department."),
        M("Наманганская областная больница выражает искреннюю благодарность компании Sog'liq Industriyasi за многолетнее плодотворное сотрудничество. Поставленное оборудование полностью соответствует заявленным характеристикам, монтаж и пусконаладочные работы выполнены в установленные сроки. Особо отмечаем профессионализм инженерной службы и оперативность сервисной поддержки.", "", "")),
      RV("rv_onco", "buyers", "#1a5fd0",
        M("РСНПМЦ Онкологии", "Onkologiya RIASTM", "National Oncology Centre"),
        M("Ташкент · госучреждение", "Toshkent · davlat", "Tashkent · public"),
        M("Лучевая диагностика «под ключ»", "Nurli diagnostika «kalit ostida»", "Turnkey radiology"),
        M("Комплексное оснащение отделения лучевой диагностики выполнено под ключ, с обучением персонала и полным пакетом документов.", "Nurli diagnostika boʻlimi toʻliq jihozlandi, xodimlar oʻqitildi.", "Turnkey equipping of the radiology department was completed with staff training and full documentation."),
        M("Республиканский специализированный научно-практический медицинский центр онкологии благодарит Sog'liq Industriyasi за комплексное оснащение нового отделения лучевой диагностики. Все этапы — от подбора оборудования до пусконаладки и обучения персонала — выполнены на высоком профессиональном уровне. Сроки поставки полностью соблюдены, предоставлен полный пакет регистрационных документов.", "", "")),
      RV("rv_silkmed", "buyers", "#15a06a",
        M("SilkMed Clinic", "SilkMed Clinic", "SilkMed Clinic"),
        M("Ташкент · частная клиника", "Toshkent · xususiy", "Tashkent · private"),
        M("Оборудование и расходные материалы", "Uskuna va sarf materiallari", "Equipment and consumables"),
        M("Работаем с Sog'liq Industriyasi второй год. Конкурентные цены, своевременные поставки и отзывчивая команда менеджеров.", "Sog'liq Industriyasi bilan ikkinchi yil ishlayapmiz. Raqobatbardosh narxlar va oʻz vaqtida yetkazib berish.", "We have worked with Sog'liq Industriyasi for two years. Competitive prices, timely deliveries and a responsive team."),
        M("Частная клиника SilkMed Clinic выражает признательность компании Sog'liq Industriyasi за стабильное и надёжное партнёрство. На протяжении двух лет мы закупаем оборудование и расходные материалы и неизменно получаем качественный сервис. Менеджеры всегда на связи, заявки обрабатываются оперативно, документация оформляется без задержек.", "", "")),
      RV("rv_mindray", "suppliers", "#e0492f",
        M("Mindray", "Mindray", "Mindray"), M("", "", ""), M("", "", ""),
        M("Mindray благодарит Sog'liq Industriyasi за надёжные и стабильные партнёрские отношения и профессиональное продвижение продукции на рынке Узбекистана.", "Mindray Sog'liq Industriyasi kompaniyasiga ishonchli hamkorlik uchun minnatdorchilik bildiradi.", "Mindray thanks Sog'liq Industriyasi for reliable and stable partnership and professional promotion in the Uzbekistan market."),
        M("Компания Mindray выражает искреннюю благодарность Sog'liq Industriyasi за настоящие, надёжные и стабильные партнёрские отношения. Sog'liq Industriyasi является авторизованным дистрибьютором нашей продукции и обеспечивает высокий уровень сервисной поддержки и технического сопровождения.", "", "")),
      RV("rv_drager", "suppliers", "#0d2650",
        M("Dräger", "Dräger", "Dräger"), M("", "", ""), M("", "", ""),
        M("Dräger выражает признательность коллективу Sog'liq Industriyasi за длительное и успешное сотрудничество на рынке медицинского оборудования.", "Dräger Sog'liq Industriyasi jamoasiga uzoq muddatli hamkorlik uchun minnatdorchilik bildiradi.", "Dräger expresses gratitude to the Sog'liq Industriyasi team for long and successful cooperation in the medical equipment market."),
        M("Компания Dräger выражает искреннюю признательность всему коллективу Sog'liq Industriyasi за длительное успешное сотрудничество. На протяжении многих лет Sog'liq Industriyasi демонстрирует высокий профессионализм в поставках и сервисном обслуживании нашего оборудования.", "", "")),
      RV("rv_edan", "suppliers", "#1757c8",
        M("Edan", "Edan", "Edan"), M("", "", ""), M("", "", ""),
        M("Edan благодарит Sog'liq Industriyasi за эффективное продвижение продукции и квалифицированную сервисную поддержку клиентов.", "Edan Sog'liq Industriyasi kompaniyasiga samarali hamkorlik uchun minnatdorchilik bildiradi.", "Edan thanks Sog'liq Industriyasi for effective product promotion and qualified customer service support."),
        M("Компания Edan выражает благодарность Sog'liq Industriyasi за эффективное продвижение нашей продукции на рынке Узбекистана и квалифицированную сервисную поддержку конечных потребителей. Партнёрство с Sog'liq Industriyasi отличается надёжностью, прозрачностью и взаимным уважением.", "", "")),
    ];
    saveAll(DB);
  }

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

  // seed categories+brands so the catalog manager has something to edit, then sync
  seedFromData(false);
  seedReviews(false);
  seedCatalog(false);
  syncData();
  reclaimSpace();
})();
