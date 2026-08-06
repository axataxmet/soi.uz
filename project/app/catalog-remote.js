/* ИНДУСТРИЯ ЗДОРОВЬЯ — catalog remote feed.
   Populates window.DATA.{CATEGORIES,BRANDS,PRODUCTS} from the A3 REST API, replacing the
   localStorage / window.SOI_CATALOG_DEFAULT seed. Runs asynchronously and dispatches
   "soi-data-changed" so app-root re-renders once data arrives. If the API is unreachable,
   the existing localStorage-backed window.DATA is left untouched (graceful fallback).

   Shape mapping (A3 API → legacy window.DATA):
     type-categories tree (category → subcategory → group) → 2-level CATEGORIES (category → subs),
       the 3rd level (group) is folded into a groupId→(catId, subIndex, attr-labels) lookup;
     manufacturers (/brands) → BRANDS (keyed by id, matched via product.brand === b.id);
     products → flat PRODUCTS (cat/sub from the product's first group, brand=manufacturerId,
       price from active price, specs built from attrs via the group's merged attrSchema labels). */
(function () {
  "use strict";
  var api = window.api;
  if (!api) { console.warn("[catalog-remote] window.api missing — skipping"); return; }
  if (window.SOI_CATALOG_REMOTE === false) return; // escape hatch for offline/demo

  function tx(o) {
    if (o && typeof o === "object") return { ru: o.ru || "", uz: o.uz || o.ru || "", en: o.en || o.ru || "" };
    var s = o == null ? "" : String(o);
    return { ru: s, uz: s, en: s };
  }
  function fieldsOf(schema) { return (schema && Array.isArray(schema.fields)) ? schema.fields : []; }

  var COUNTRY = { RU: "Россия", UZ: "Узбекистан", DE: "Германия", CN: "Китай", US: "США",
    IT: "Италия", CZ: "Чехия", CH: "Швейцария", JP: "Япония", KR: "Корея", FR: "Франция", GB: "Великобритания" };

  // 3-level tree → legacy CATEGORIES (category→subs) + groupId lookup with merged attr labels.
  function buildTree(tree) {
    var CATEGORIES = [];
    var groupMap = {}; // groupId → { catId, subIndex, labels: {key:{ru,uz,en,unit}} }
    (tree || []).forEach(function (cat) {
      var catFields = fieldsOf(cat.attrSchema);
      var subs = [];
      (cat.subcategories || []).forEach(function (sub, subIndex) {
        var upper = catFields.concat(fieldsOf(sub.attrSchema));
        /* Третий уровень дерева (товарная группа: «Кольпоскопы», «Кресла
           гинекологические») раньше здесь терялся — от группы оставался только
           её вклад в groupMap, а название и slug выбрасывались, поэтому витрина
           подраздела не могла показать вложенные разделы. Теперь группы едут
           вместе с подразделом. Пустые не отфильтровываем: дерево типов — это
           навигация, а не витрина, и раздел без товаров всё равно должен быть
           виден (счётчик показывает 0). */
        var groups = (sub.groups || [])
          .filter(function (g) { return g.active !== false; })
          .slice()
          .sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
          .map(function (g) {
            /* Схема характеристик группы = поля категории + подкатегории + свои.
               Она нужна витрине уровня 5, чтобы построить фасеты («Тип»,
               «Режимы работы», «Каналов»), поэтому едет на клиент целиком,
               а не сворачивается в одни только подписи, как раньше. */
            var fields = upper.concat(fieldsOf(g.attrSchema)).filter(function (f) { return f && f.key; });
            return Object.assign({ _id: g.id, slug: g.slug, count: g.productCount || 0, fields: fields }, tx(g.name));
          });
        subs.push(Object.assign({ _id: sub.id, slug: sub.slug, groups: groups }, tx(sub.name)));
        (sub.groups || []).forEach(function (g) {
          var labels = {};
          upper.concat(fieldsOf(g.attrSchema)).forEach(function (f) {
            if (!f || !f.key) return;
            var l = f.label || {};
            labels[f.key] = { ru: l.ru || f.key, uz: l.uz || l.ru || f.key, en: l.en || l.ru || f.key, unit: f.unit || "" };
          });
          groupMap[g.id] = { catId: cat.id, subIndex: subIndex, groupId: g.id, labels: labels };
        });
      });
      // slug обязателен: по нему меню и плитки находят категорию. Раньше сюда
      // попадал только cuid, а в разметке ссылки записаны как equipment,
      // furniture и прочие — сравнение не совпадало никогда, и любой переход
      // в категорию открывал пустой листинг.
      CATEGORIES.push(Object.assign({ id: cat.id, slug: cat.slug, icon: "catalog", subs: subs }, tx(cat.name)));
    });
    return { CATEGORIES: CATEGORIES, groupMap: groupMap };
  }

  function buildBrands(list) {
    return (list || []).map(function (b) {
      var countryRu = b.country ? (COUNTRY[b.country] || b.country) : "";
      return { id: b.id, name: b.name, logo: b.logoUrl || null,
        country: tx(countryRu), flag: "", cat: tx("") };
    });
  }

  function buildProducts(list, groupMap) {
    return (list || []).map(function (p) {
      var groups = p.groups || [];
      var primary = groups.length ? groupMap[groups[0].groupId] : null;
      var name = tx(p.name);
      var priceRow = (p.prices && p.prices[0]) || null;
      var main = (p.media && p.media[0]) ? p.media[0].url : null;

      var attrs = p.attrs || {};
      var labels = primary ? primary.labels : {};
      var specs = Object.keys(attrs).map(function (k) {
        var v = attrs[k];
        if (v == null || v === "") return null;
        var lab = labels[k] || { ru: k, uz: k, en: k, unit: "" };
        var val = Array.isArray(v) ? v.join(", ") : String(v);
        if (lab.unit) val += " " + lab.unit;
        return { kr: lab.ru, ku: lab.uz, ke: lab.en, v: val, ve: "" };
      }).filter(Boolean);

      var extraCats = groups.slice(1).map(function (gi) {
        var m = groupMap[gi.groupId];
        return m ? { cat: m.catId, sub: m.subIndex, group: m.groupId } : null;
      }).filter(Boolean);

      return {
        id: p.id, sku: p.sku,
        ru: name.ru, uz: name.uz, en: name.en,
        cat: primary ? primary.catId : null,
        sub: primary ? primary.subIndex : null,
        group: primary ? primary.groupId : null,
        extraCats: extraCats,
        specIds: (p.specs || []).map(function (s) { return s.specId; }), // направления медицины (A3)
        brand: p.manufacturerId || (p.manufacturer && p.manufacturer.id) || null,
        price: priceRow && priceRow.price != null ? Number(priceRow.price) : null,
        old: priceRow && priceRow.oldPrice != null ? Number(priceRow.oldPrice) : null,
        stock: p.inStock ? "in" : "preorder",
        badge: p.badge || null,
        pop: p.popularity || 60,
        isNew: !!p.isNew,
        img: main, images: main ? [main] : [], gallery: main ? [{ src: main, alt: name.ru }] : [],
        specs: specs,
        attrs: attrs, // сырые значения — по ним фасеты уровня 5 фильтруют товары
        related: p.related || [], accessories: [], consumables: [],
        glyph: "pulse", _remote: true,
      };
    });
  }

  /* Витрина товарных групп показывает снимок первого товара группы — своих
     иллюстраций у групп в базе нет, а 140+ нарисованных глифов заказчик
     заводить не стал. Считаем после сборки товаров: раньше их просто нет. */
  function attachGroupImages(CATEGORIES, products) {
    var byGroup = {};
    (products || []).forEach(function (p) {
      if (!p.img) return;
      var ids = [p.group].concat((p.extraCats || []).map(function (ec) { return ec.group; }));
      ids.forEach(function (gid) { if (gid && !byGroup[gid]) byGroup[gid] = p.img; });
    });
    (CATEGORIES || []).forEach(function (cat) {
      (cat.subs || []).forEach(function (sub) {
        (sub.groups || []).forEach(function (g) { g.img = byGroup[g._id] || null; });
      });
    });
  }

  function unwrap(res) { return (res && res.data) ? res.data : (Array.isArray(res) ? res : []); }

  // Paginated fetch — the API caps limit at 100, so walk pages until all rows are collected.
  function fetchAll(resource) {
    var LIMIT = 100, acc = [];
    function page(n) {
      return api.listPublic(resource, { limit: LIMIT, page: n }).then(function (res) {
        var rows = unwrap(res);
        acc = acc.concat(rows);
        var total = (res && typeof res.total === "number") ? res.total : acc.length;
        if (acc.length < total && rows.length === LIMIT) return page(n + 1);
        return acc;
      });
    }
    return page(1);
  }

  function reload() {
    return Promise.all([
      api.listPublic("type-categories"),
      fetchAll("products"),
      fetchAll("brands"),
    ]).then(function (res) {
      var built = buildTree(res[0] || []);
      var D = window.DATA || (window.DATA = { CATEGORIES: [], BRANDS: [], PRODUCTS: [] });
      D.CATEGORIES = built.CATEGORIES;
      D.BRANDS = buildBrands(res[2]);
      D.PRODUCTS = buildProducts(res[1], built.groupMap);
      attachGroupImages(D.CATEGORIES, D.PRODUCTS);
      window.SOI_CATALOG_SOURCE = "api";
      window.dispatchEvent(new CustomEvent("soi-data-changed", { detail: { source: "api" } }));
      console.log("[catalog-remote] loaded from API:", D.CATEGORIES.length, "categories,",
        D.BRANDS.length, "brands,", D.PRODUCTS.length, "products");
      return D;
    }).catch(function (e) {
      console.warn("[catalog-remote] API unreachable — keeping localStorage catalog:", e && e.message);
    });
  }

  window.CATALOG_REMOTE = { reload: reload };
  reload();
  window.addEventListener("soi-auth-changed", reload);
})();
