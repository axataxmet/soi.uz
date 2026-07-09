/* UzMedEx — Store overlay
   Merges manufacturer/product data created in the admin panel (saved in
   localStorage) into the static window.DATA from data.js, so imported items
   appear on the live site immediately. Loaded on BOTH the storefront and the
   admin panel, right AFTER app/data.js. */
(function () {
  const PKEY = "uzmedex_custom_products";
  const BKEY = "uzmedex_custom_brands";

  const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  const getCustomProducts = () => read(PKEY);
  const getCustomBrands = () => read(BKEY);

  // product field defaults — mirror the P() factory in data.js
  function makeProduct(o) {
    const sku = String(o.sku || ("X" + Date.now()));
    return Object.assign(
      {
        id: o.id || ("imp_" + sku.replace(/\s+/g, "")),
        sku,
        badge: null, old: null, pop: 60, isNew: false,
        extraCats: [], related: [], accessories: [], consumables: [], variants: [],
        glyph: "pulse", custom: true,
      },
      o
    );
  }

  // merge custom brands + products into window.DATA (idempotent)
  function applyOverlay() {
    if (!window.DATA) return;
    const D = window.DATA;
    // brands
    getCustomBrands().forEach((b) => {
      const ex = D.BRANDS.find((x) => x.id === b.id);
      if (ex) Object.assign(ex, b); else D.BRANDS.push(b);
    });
    // products
    getCustomProducts().forEach((p) => {
      const np = makeProduct(p);
      const i = D.PRODUCTS.findIndex((x) => x.id === np.id || (np.sku && x.sku === np.sku));
      if (i >= 0) D.PRODUCTS[i] = Object.assign({}, D.PRODUCTS[i], np);
      else D.PRODUCTS.push(np);
    });
  }

  // ---- writes (used by admin) ----
  function saveBrand(b) {
    const list = getCustomBrands();
    const i = list.findIndex((x) => x.id === b.id);
    if (i >= 0) list[i] = b; else list.push(b);
    write(BKEY, list);
    applyOverlay();
    return b;
  }
  function deleteBrand(id) {
    write(BKEY, getCustomBrands().filter((b) => b.id !== id));
  }

  // save imported products. mode: "update" (merge by sku) | "add" (always new)
  function saveProducts(arr, mode) {
    const list = getCustomProducts();
    arr.forEach((raw) => {
      const p = makeProduct(raw);
      const i = list.findIndex((x) => String(x.sku) === String(p.sku));
      if (i >= 0 && mode !== "add") list[i] = Object.assign({}, list[i], p);
      else if (i >= 0 && mode === "add") list.push(Object.assign({}, p, { id: p.id + "_" + Date.now() }));
      else list.push(p);
    });
    write(PKEY, list);
    applyOverlay();
    return list.length;
  }
  function clearCustomProducts() { write(PKEY, []); }
  function deleteCustomProduct(id) {
    write(PKEY, getCustomProducts().filter((p) => p.id !== id));
  }

  window.UzStore = {
    PKEY, BKEY,
    getCustomProducts, getCustomBrands,
    applyOverlay, makeProduct,
    saveBrand, deleteBrand,
    saveProducts, clearCustomProducts, deleteCustomProduct,
  };

  // apply immediately (data.js already ran)
  applyOverlay();
})();
