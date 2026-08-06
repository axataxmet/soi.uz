/* ИНДУСТРИЯ ЗДОРОВЬЯ — REST API client (window.api)
   Plain ES (no build). Handles JWT (access + refresh rotation), JSON, errors, media upload. */
(function () {
  /* Opened on this machine, the API is where it has always been. Opened from
     anywhere else — a tunnel, a phone on the LAN — «localhost» would mean the
     visitor's own computer, so the client falls back to the origin it was
     served from and lets the dev server proxy /api onward. */
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var BASE = (window.SOI_API_BASE || (LOCAL ? "http://localhost:4000/api" : "/api")).replace(/\/$/, "");
  var TOKEN_KEY = "soi_token", REFRESH_KEY = "soi_refresh";

  function getToken() { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } }
  function getRefresh() { try { return localStorage.getItem(REFRESH_KEY) || ""; } catch (e) { return ""; } }
  function setTokens(a, r) { try { if (a) localStorage.setItem(TOKEN_KEY, a); if (r) localStorage.setItem(REFRESH_KEY, r); } catch (e) {} }
  function clearTokens() { try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); } catch (e) {} }

  function qs(q) {
    if (!q) return "";
    var p = Object.keys(q)
      .filter(function (k) { return q[k] != null && q[k] !== ""; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(q[k]); });
    return p.length ? "?" + p.join("&") : "";
  }

  async function tryRefresh() {
    var rt = getRefresh();
    if (!rt) return false;
    try {
      var res = await fetch(BASE + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) { clearTokens(); return false; }
      var d = await res.json();
      setTokens(d.accessToken, d.refreshToken);
      return true;
    } catch (e) { clearTokens(); return false; }
  }

  async function raw(path, opts, isRetry) {
    opts = opts || {};
    var headers = Object.assign({}, opts.headers || {});
    var tok = getToken();
    if (tok && !opts.noAuth) headers["Authorization"] = "Bearer " + tok;

    var res = await fetch(BASE + path, { method: opts.method || "GET", headers: headers, body: opts.body });

    if (res.status === 401 && !isRetry && !opts.noAuth && getRefresh()) {
      if (await tryRefresh()) return raw(path, opts, true);
      window.dispatchEvent(new CustomEvent("soi-auth-expired"));
    }

    var text = await res.text();
    var data; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      var msg = (data && (data.message || data.error)) || ("Ошибка " + res.status);
      if (Array.isArray(msg)) msg = msg.join(", ");
      var err = new Error(msg); err.status = res.status; err.body = data; throw err;
    }
    return data;
  }

  function jsonReq(path, method, body, opts) {
    opts = opts || {};
    return raw(path, Object.assign({}, opts, {
      method: method,
      headers: Object.assign({ "Content-Type": "application/json" }, opts.headers || {}),
      body: body != null ? JSON.stringify(body) : undefined,
    }));
  }

  function dataUrlToBlob(d) {
    var parts = d.split(",");
    var mime = (parts[0].match(/:(.*?);/) || [])[1] || "application/octet-stream";
    var bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  function extFromMime(m) { return ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "application/pdf": "pdf" })[m] || "bin"; }

  var api = {
    base: BASE,
    getToken: getToken,
    isAuthed: function () { return !!getToken(); },
    clearTokens: clearTokens,

    login: async function (email, password) {
      var d = await jsonReq("/auth/login", "POST", { email: email, password: password }, { noAuth: true });
      setTokens(d.accessToken, d.refreshToken);
      return d.user;
    },
    me: function () { return raw("/auth/me", {}); },
    logout: async function () { try { await jsonReq("/auth/logout", "POST", { refreshToken: getRefresh() }); } catch (e) {} clearTokens(); },

    listPublic: function (resource, q) { return raw("/" + resource + qs(q), { noAuth: true }); },
    listManage: function (resource, q) { return raw("/" + resource + "/manage/all" + qs(q), {}); },
    list: function (resource, q) { return raw("/" + resource + qs(q), {}); }, // authed GET /resource (no /manage/all)
    getSetting: function (key) { return raw("/settings/" + encodeURIComponent(key), { noAuth: true }); },
    setSetting: function (key, value) { return jsonReq("/settings/" + encodeURIComponent(key), "PUT", { value: value }); },
    // CRM config holds API/bot secrets — admin-only route, never the public /settings/:key path.
    getCrmConfig: function () { return raw("/crm/config", {}); },
    setCrmConfig: function (cfg) { return jsonReq("/crm/config", "PUT", cfg); },
    getOne: function (resource, id) { return raw("/" + resource + "/" + id, { noAuth: true }); },
    create: function (resource, body) { return jsonReq("/" + resource, "POST", body); },
    update: function (resource, id, body) { return jsonReq("/" + resource + "/" + id, "PATCH", body); },
    remove: function (resource, id) { return raw("/" + resource + "/" + id, { method: "DELETE" }); },

    // Generic escape hatch for nested/custom routes (type tree, product sub-resources).
    req: function (path, opts) { return raw(path, opts || {}); },
    reqJson: function (path, method, body, opts) { return jsonReq(path, method, body, opts); },

    uploadBlob: function (blob, filename) {
      var fd = new FormData();
      fd.append("file", blob, filename || "file");
      return raw("/media/upload", { method: "POST", body: fd });
    },
    uploadDataUrl: function (dataUrl, filename) {
      var blob = dataUrlToBlob(dataUrl);
      return api.uploadBlob(blob, filename || ("upload." + extFromMime(blob.type)));
    },
  };

  window.api = api;
})();
