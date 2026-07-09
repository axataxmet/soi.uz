/* ИНДУСТРИЯ ЗДОРОВЬЯ Admin — A3 catalog API helper (type tree + product sub-resources).
   Nested routes that don't fit the flat CMS-overlay CRUD live here. */
(function () {
  if (!window.api) { console.warn("[catalog-api] window.api missing"); return; }
  var api = window.api;
  function del(path) { return api.req(path, { method: "DELETE" }); }

  window.CatalogAPI = {
    // ── type tree (3 levels) ──
    getTree: function () { return api.req("/type-categories/manage/all", {}); },
    createCategory: function (b) { return api.reqJson("/type-categories", "POST", b); },
    updateCategory: function (id, b) { return api.reqJson("/type-categories/" + id, "PATCH", b); },
    deleteCategory: function (id) { return del("/type-categories/" + id); },
    createSubcategory: function (b) { return api.reqJson("/type-subcategories", "POST", b); },
    updateSubcategory: function (id, b) { return api.reqJson("/type-subcategories/" + id, "PATCH", b); },
    deleteSubcategory: function (id) { return del("/type-subcategories/" + id); },
    listGroups: function (subcatId) { return api.req("/product-groups" + (subcatId ? ("?subcatId=" + encodeURIComponent(subcatId)) : ""), { noAuth: true }); },
    createGroup: function (b) { return api.reqJson("/product-groups", "POST", b); },
    updateGroup: function (id, b) { return api.reqJson("/product-groups/" + id, "PATCH", b); },
    deleteGroup: function (id) { return del("/product-groups/" + id); },
    getGroupSchema: function (id) { return api.req("/product-groups/" + id + "/schema", { noAuth: true }); },

    // ── products + nested sub-resources (used by the product form, п.2d) ──
    listProducts: function (q) { return api.req("/products/manage/all" + qs(q), {}); },
    getProduct: function (id) { return api.req("/products/manage/" + id, {}); },
    createProduct: function (b) { return api.reqJson("/products", "POST", b); },
    updateProduct: function (id, b) { return api.reqJson("/products/" + id, "PATCH", b); },
    deleteProduct: function (id) { return del("/products/" + id); },
    setPrice: function (id, b) { return api.reqJson("/products/" + id + "/price", "PUT", b); },
    setStock: function (id, b) { return api.reqJson("/products/" + id + "/stock", "PUT", b); },
    addMedia: function (id, b) { return api.reqJson("/products/" + id + "/media", "POST", b); },
    removeMedia: function (mid) { return del("/products/media/" + mid); },
    listRegDocs: function (id) { return api.req("/products/" + id + "/reg-documents", { noAuth: true }); },
    addRegDoc: function (id, b) { return api.reqJson("/products/" + id + "/reg-documents", "POST", b); },
    removeRegDoc: function (rid) { return del("/products/reg-documents/" + rid); },
  };

  function qs(q) {
    if (!q) return "";
    var p = Object.keys(q).filter(function (k) { return q[k] != null && q[k] !== ""; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(q[k]); });
    return p.length ? "?" + p.join("&") : "";
  }
})();
