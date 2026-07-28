/* ИНДУСТРИЯ ЗДОРОВЬЯ — CMS remote overlay
   Routes whitelisted collections to the REST API while keeping the window.CMS facade.
   Reads stay synchronous via an in-memory cache; first access triggers an async fetch
   that populates the cache and fires CMS.emit(col) so existing CMS.on subscribers re-render.
   Writes (put/remove) return a Promise<{ok,error}> — cmsOp awaits it.
   Each migrated collection is fully disconnected from localStorage (CRUD goes only to REST). */
(function () {
  if (!window.CMS || !window.api) { console.warn("[cms-remote] CMS or api not available"); return; }
  var CMS = window.CMS, api = window.api;

  function isAdmin() { return !!window.SOI_ADMIN; }
  function pick3(o) { if (!o || typeof o !== "object") return undefined; return { ru: o.ru || "", uz: o.uz || "", en: o.en || "" }; }
  function strip(o) { Object.keys(o).forEach(function (k) { if (o[k] === undefined) delete o[k]; }); return o; }
  // Distribute an A3 medical direction into one of the mega-menu's 4 columns by keyword.
  function dirGroup(nameRu) {
    var s = (nameRu || "").toLowerCase();
    if (/хирург|реаним|анестез|операц|экстрен|травматол/.test(s)) return "surgery";
    if (/диагност|лаборат|визуал|луч|эндоскоп|радиол/.test(s)) return "diag";
    if (/реабилит|ортопед|физиотерап|восстан/.test(s)) return "rehab";
    return "clinical";
  }
  function mimeFromUrl(u) {
    u = (u || "").toLowerCase();
    if (/\.png$/.test(u)) return "image/png";
    if (/\.jpe?g$/.test(u)) return "image/jpeg";
    if (/\.webp$/.test(u)) return "image/webp";
    if (/\.pdf$/.test(u)) return "application/pdf";
    return "image/*";
  }
  // Upload base64 dataURLs to MinIO via the media API; pass through existing URLs.
  async function resolveMedia(val) {
    if (!val || typeof val !== "string") return undefined;
    if (val.indexOf("data:") === 0) { var r = await api.uploadDataUrl(val); return r.url; }
    return val;
  }

  /* ─────────── adapters: frontend record shape ↔ API shape ─────────── */
  var ADAPTERS = {
    reviews: {
      resource: "reviews",
      toFE: function (r) {
        if (!r) return r;
        var L = r.letterUrl;
        return {
          id: r.id, type: (r.type || "BUYER").toLowerCase(),
          company: r.company, region: r.region, desc: r.description, quote: r.quote, body: r.body,
          logo: r.logoUrl || "",
          letter: L ? { data: L, url: L, type: mimeFromUrl(L), name: String(L).split("/").pop() } : null,
          color: r.color || "", status: (r.status || "DRAFT").toLowerCase(),
          date: r.date ? String(r.date).slice(0, 10) : "", order: r.order || 0, _remote: true,
        };
      },
      toAPI: async function (it) {
        var t = (it.type || it.group || "buyer").toLowerCase();
        if (t === "buyers") t = "buyer"; if (t === "suppliers") t = "supplier";
        return strip({
          type: t === "supplier" ? "SUPPLIER" : "BUYER",
          company: pick3(it.company), region: pick3(it.region), description: pick3(it.desc),
          quote: pick3(it.quote), body: pick3(it.body), color: it.color || undefined,
          status: (it.status || "draft").toLowerCase() === "published" ? "PUBLISHED" : "DRAFT",
          date: it.date ? new Date(it.date).toISOString() : undefined,
          order: typeof it.order === "number" ? it.order : undefined,
          logoUrl: await resolveMedia(it.logo),
          letterUrl: await resolveMedia(it.letter && (it.letter.data || it.letter.url)),
        });
      },
    },

    news: {
      resource: "news",
      toFE: function (r) {
        if (!r) return r;
        var st = (r.status || "DRAFT").toLowerCase();
        return {
          id: r.id, title: r.title, body: r.body, excerpt: r.excerpt,
          cover: r.coverUrl || "", tags: r.tags || [], type: r.type || "new",
          date: r.date ? String(r.date).slice(0, 10) : "",
          status: st, published: st === "published", _remote: true,
        };
      },
      toAPI: async function (it) {
        return strip({
          title: pick3(it.title), excerpt: pick3(it.excerpt), body: pick3(it.body),
          type: it.type || undefined, tags: Array.isArray(it.tags) ? it.tags : undefined,
          date: it.date ? new Date(it.date).toISOString() : undefined,
          status: (it.status || (it.published ? "published" : "draft")).toString().toLowerCase() === "published" ? "PUBLISHED" : "DRAFT",
          coverUrl: await resolveMedia(it.cover),
        });
      },
    },

    cases: {
      resource: "cases",
      toFE: function (r) {
        if (!r) return r;
        var img = r.imageUrl || "", d = r.description;
        return {
          id: r.id, title: r.title, description: d, desc: d,
          tag: r.tag || "", type: r.type || "", region: r.region || "", year: r.year || "",
          img: img, image: img, metrics: r.metrics,
          status: (r.status || "PUBLISHED").toLowerCase(), order: r.order || 0, _remote: true,
        };
      },
      toAPI: async function (it) {
        return strip({
          title: pick3(it.title), description: pick3(it.description || it.desc),
          tag: it.tag || undefined, type: it.type || undefined, region: it.region || undefined, year: it.year || undefined,
          metrics: (it.metrics && typeof it.metrics === "object") ? it.metrics : undefined,
          status: (it.status || "published").toLowerCase() === "published" ? "PUBLISHED" : "DRAFT",
          order: typeof it.order === "number" ? it.order : undefined,
          imageUrl: await resolveMedia(it.img || it.image),
        });
      },
    },

    team: {
      resource: "team",
      toFE: function (r) {
        if (!r) return r;
        return { id: r.id, name: r.name, role: r.role, photo: r.photoUrl || "", order: r.order || 0, service: !!r.service, _remote: true };
      },
      fetchAll: async function () {
        var res = await api.listPublic("team", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.team.toFE);
      },
      toAPI: async function (it) {
        return strip({
          name: it.name, role: pick3(it.role),
          order: typeof it.order === "number" ? it.order : undefined,
          service: !!it.service,
          photoUrl: await resolveMedia(it.photo),
        });
      },
    },

    submissions: {
      resource: "submissions",
      toFE: function (r) {
        if (!r) return r;
        var m = r.meta || {};
        return {
          id: r.id, name: r.name, phone: r.phone, email: r.email,
          message: r.message, comment: r.message, source: r.source, type: r.source || "Заявка",
          org: m.org || "", inn: m.inn || "", city: m.city || "", services: m.services || [],
          product: m.productName || "", meta: m,
          status: (r.status || "NEW").toLowerCase(),
          date: r.createdAt, _created: r.createdAt, _remote: true,
        };
      },
      // Submissions admin list is GET /submissions (no /manage/all); always authed.
      fetchAll: async function () {
        var res = await api.list("submissions", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.submissions.toFE);
      },
      // Custom: create sends the full lead; admin update sends only the status (PATCH DTO).
      save: async function (it) {
        if (it && it.id && !it._isNew) {
          var up = await api.update("submissions", it.id, { status: (it.status || "new").toUpperCase() });
          return ADAPTERS.submissions.toFE(up);
        }
        var cr = await api.create("submissions", {
          name: it.name || it.org || "—", phone: it.phone || undefined, email: it.email || undefined,
          message: it.message || it.comment || undefined, source: it.source || undefined, meta: it.meta,
        });
        return ADAPTERS.submissions.toFE(cr);
      },
    },

    documents: {
      resource: "documents",
      toFE: function (r) {
        if (!r) return r;
        var u = r.fileUrl;
        return {
          id: r.id, title: r.title, cat: r.category || "", category: r.category || "",
          file: u ? { data: u, url: u, name: String(u).split("/").pop(), type: r.fileType, size: r.fileSize } : null,
          fileType: r.fileType, fileSize: r.fileSize, order: r.order || 0, _remote: true,
        };
      },
      toAPI: async function (it) {
        return strip({
          title: pick3(it.title), category: it.cat || it.category || undefined,
          fileUrl: await resolveMedia(it.file && (it.file.data || it.file.url)),
          fileType: (it.file && it.file.type) || undefined,
          fileSize: (it.file && it.file.size) || undefined,
          order: typeof it.order === "number" ? it.order : undefined,
        });
      },
      // documents has no /manage/all — all are public; admin reads the same list.
      fetchAll: async function () {
        var res = await api.listPublic("documents", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.documents.toFE);
      },
    },

    users: {
      resource: "users",
      toFE: function (r) {
        if (!r) return r;
        return {
          id: r.id, email: r.email, name: r.name, role: r.role,
          active: r.isActive !== false, lastLoginAt: r.lastLoginAt, createdAt: r.createdAt, _remote: true,
        };
      },
      fetchAll: async function () {
        var res = await api.list("users", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.users.toFE);
      },
      save: async function (it) {
        if (it && it.id && !it._isNew) {
          var up = await api.update("users", it.id, { name: it.name, role: it.role, isActive: it.active });
          return ADAPTERS.users.toFE(up);
        }
        var cr = await api.create("users", { email: it.email, name: it.name, password: it.password, role: it.role });
        return ADAPTERS.users.toFE(cr);
      },
    },

    // Производители (A3). REST-путь /brands (за ним модель Manufacturer). UI-поля ru/uz/en/country/url/logo.
    brands: {
      resource: "brands",
      toFE: function (r) {
        if (!r) return r;
        var n = r.nameI18n || {};
        return {
          id: r.id, name: r.name || n.ru || "",
          ru: n.ru || r.name || "", uz: n.uz || "", en: n.en || "",
          legalName: r.legalName || "", country: r.country || "", inn: r.inn || "",
          logo: r.logoUrl || "", url: r.url || r.website || "", order: r.order || 0, _remote: true,
        };
      },
      toAPI: async function (it) {
        var ru = it.ru || it.name || "";
        var i18n = (it.uz || it.en) ? { ru: ru, uz: it.uz || "", en: it.en || "" } : undefined;
        return strip({
          name: ru, nameI18n: i18n,
          legalName: it.legalName || undefined, country: it.country || undefined,
          inn: it.inn || undefined, url: it.url || undefined,
          order: typeof it.order === "number" ? it.order : undefined,
          logoUrl: await resolveMedia(it.logo),
        });
      },
      // brands GET / is public + paginated (no /manage/all).
      fetchAll: async function () {
        var res = await api.listPublic("brands", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.brands.toFE);
      },
    },

    // Направления медицины (A3, вторая ось классификации). REST /spec-categories, плоский список.
    spec_categories: {
      resource: "spec-categories",
      toFE: function (r) {
        if (!r) return r;
        var n = r.name || {};
        return { id: r.id, ru: n.ru || "", uz: n.uz || "", en: n.en || "",
          slug: r.slug || "", order: r.order || 0, active: r.active !== false, _remote: true };
      },
      toAPI: function (it) {
        return strip({
          name: { ru: it.ru || "", uz: it.uz || "", en: it.en || "" },
          slug: it.slug || ("spec-" + Date.now()),
          order: typeof it.order === "number" ? it.order : undefined,
          active: typeof it.active === "boolean" ? it.active : undefined,
        });
      },
    },

    // Направления мед. для витрины (мега-меню/browse/сравнение) — read-only проекция
    // A3 spec-categories в форму старой таксономии cat_directions. Правятся через "spec_categories".
    cat_directions: {
      resource: "spec-categories",
      toFE: function (r) {
        if (!r) return r;
        var n = r.name || {};
        return { id: r.id, name: n.ru || r.slug, ru: n.ru || "", uz: n.uz || "", en: n.en || "",
          group: dirGroup(n.ru), icon: "pulse", order: r.order || 0, active: r.active !== false, _remote: true };
      },
      fetchAll: async function () {
        var res = await api.listPublic("spec-categories", { limit: 100 });
        var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
        return arr.map(ADAPTERS.cat_directions.toFE);
      },
    },
  };

  // Attach generic fetchAll/save (admin → /manage/all + auth, public → published only).
  Object.keys(ADAPTERS).forEach(function (col) {
    var ad = ADAPTERS[col];
    if (!ad.fetchAll) ad.fetchAll = async function () {
      var res = isAdmin() ? await api.listManage(ad.resource, { limit: 100 }) : await api.listPublic(ad.resource, { limit: 100 });
      var arr = res && res.data ? res.data : (Array.isArray(res) ? res : []);
      return arr.map(ad.toFE);
    };
    if (!ad.save) ad.save = async function (item) {
      var body = await ad.toAPI(item);
      var saved = (item && item.id && !item._isNew)
        ? await api.update(ad.resource, item.id, body)
        : await api.create(ad.resource, body);
      return ad.toFE(saved);
    };
  });

  /* ─────────── window.CMS wrapping ─────────── */
  var cache = {}, loaded = {}, loading = {};
  var _list = CMS.list.bind(CMS), _get = CMS.get.bind(CMS),
    _put = CMS.put.bind(CMS), _remove = CMS.remove.bind(CMS);

  function ensure(col) {
    if (loaded[col] || loading[col]) return;
    loading[col] = true;
    ADAPTERS[col].fetchAll().then(function (arr) {
      cache[col] = arr; loaded[col] = true; loading[col] = false; CMS.emit(col);
    }).catch(function (e) {
      loading[col] = false;
      console.warn("[cms-remote] load '" + col + "' failed:", e && e.message);
    });
  }

  CMS.list = function (col) {
    if (ADAPTERS[col]) { ensure(col); return (cache[col] || []).slice(); }
    return _list(col);
  };
  CMS.get = function (col, id) {
    if (ADAPTERS[col]) return (cache[col] || []).find(function (x) { return x.id === id; }) || null;
    return _get(col, id);
  };
  CMS.put = function (col, item) {
    if (!ADAPTERS[col]) return _put(col, item);
    return ADAPTERS[col].save(item).then(function (saved) {
      var a = cache[col] || (cache[col] = []);
      var i = a.findIndex(function (x) { return x.id === saved.id; });
      if (i >= 0) a[i] = saved; else a.unshift(saved);
      CMS.emit(col);
      return { ok: true, item: saved };
    }).catch(function (e) { return { ok: false, error: (e && e.message) || "Ошибка сохранения" }; });
  };
  CMS.remove = function (col, id) {
    if (!ADAPTERS[col]) return _remove(col, id);
    return api.remove(ADAPTERS[col].resource, id).then(function () {
      cache[col] = (cache[col] || []).filter(function (x) { return x.id !== id; });
      CMS.emit(col);
      return { ok: true };
    }).catch(function (e) { return { ok: false, error: (e && e.message) || "Ошибка удаления" }; });
  };

  CMS.isRemote = function (col) { return !!ADAPTERS[col]; };
  CMS.refreshRemote = function (col) {
    var cols = col ? [col] : Object.keys(ADAPTERS);
    cols.forEach(function (c) { loaded[c] = false; loading[c] = false; ensure(c); });
  };

  // ── settings (key-value): content settings routed to the API; internal flags stay local ──
  var SETTINGS_REMOTE = { site_seo: 1, site_contacts: 1, nav_menu_custom: 1, homepage_impact: 1, homepage_hero: 1, homepage_cta: 1, homepage_ecosystem: 1, service_hero: 1, service_equipment: 1, service_docs: 1 };
  var settingsCache = {}, settingsLoaded = false, settingsLoading = false;
  var _getSetting = CMS.getSetting ? CMS.getSetting.bind(CMS) : function (k, d) { return d; };
  var _setSetting = CMS.setSetting ? CMS.setSetting.bind(CMS) : function () {};

  function ensureSettings() {
    if (settingsLoaded || settingsLoading || !isAdmin()) return;
    settingsLoading = true;
    api.list("settings").then(function (res) {
      var arr = Array.isArray(res) ? res : (res && res.data) || [];
      arr.forEach(function (s) { settingsCache[s.key] = s.value; });
      settingsLoaded = true; settingsLoading = false; CMS.emit("settings");
    }).catch(function (e) { settingsLoading = false; console.warn("[cms-remote] settings load failed:", e && e.message); });
  }
  // Public visitors aren't admin, so the bulk /settings list (admin-only) never runs for them;
  // fetch the individual whitelisted key instead via the public GET /settings/:key route.
  var settingKeyLoading = {}, settingKeyFailedAt = {};
  // getSetting runs on every render that reads a setting (~36 calls over a few
  // navigations), so a failed fetch must not be retried per call — without a
  // cooldown one API blip turns into one request per render.
  var SETTING_RETRY_MS = 30000;
  function ensureSettingKey(key) {
    if (key in settingsCache || settingKeyLoading[key]) return;
    var failedAt = settingKeyFailedAt[key];
    if (failedAt && Date.now() - failedAt < SETTING_RETRY_MS) return;
    settingKeyLoading[key] = true;
    api.getSetting(key).then(function (res) {
      settingsCache[key] = res && typeof res === "object" && "value" in res ? res.value : res;
      settingKeyLoading[key] = false; delete settingKeyFailedAt[key]; CMS.emit("settings");
    }).catch(function (e) {
      settingKeyLoading[key] = false; settingKeyFailedAt[key] = Date.now();
      console.warn("[cms-remote] setting fetch failed:", key, e && e.message);
    });
  }
  CMS.getSetting = function (key, def) {
    if (SETTINGS_REMOTE[key]) {
      if (isAdmin()) ensureSettings(); else ensureSettingKey(key);
      // A setting absent from the DB comes back as {value: null}; fall back to the
      // caller's default instead of handing out null, which callers don't expect.
      return settingsCache[key] != null ? settingsCache[key] : def;
    }
    return _getSetting(key, def);
  };
  CMS.setSetting = function (key, value) {
    if (!SETTINGS_REMOTE[key]) return _setSetting(key, value);
    return api.setSetting(key, value).then(function () {
      settingsCache[key] = value; CMS.emit("settings"); return { ok: true };
    }).catch(function (e) { return { ok: false, error: (e && e.message) || "Ошибка сохранения" }; });
  };

  window.addEventListener("soi-auth-changed", function () {
    settingsLoaded = false; settingsLoading = false; settingsCache = {};
    CMS.refreshRemote();
    ensureSettings();
  });

  console.log("[cms-remote] active for:", Object.keys(ADAPTERS).join(", "), "+ settings | admin:", isAdmin());
})();
