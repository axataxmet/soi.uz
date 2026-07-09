/* Sog'liq Industriyasi — catalog / listing page */

function Checkbox({ label, count, on, onClick }) {
  return (
    <div className={"chk " + (on ? "on" : "")} onClick={onClick}>
      <span className="box">{on && <Icon name="check" size={14} sw={2.4} />}</span>
      <span>{label}</span>
      {count != null && <span className="ct">{count}</span>}
    </div>
  );
}

function CatalogPage({ t, lang, store, go, params }) {
  const ALL = window.DATA.PRODUCTS;
  const cats = window.DATA.CATEGORIES;
  const brands = window.DATA.BRANDS;

  const [brandSel, setBrandSel] = useState(params.brand ? [params.brand] : []);
  const [stockSel, setStockSel] = useState(params.stock ? [params.stock] : []);
  const [featSel, setFeatSel] = useState([]);
  const lvf = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const featOpts = [
    { id: "fast", label: lvf("Быстрая доставка", "Tez yetkazish", "Fast delivery"), test: (p) => p.stock === "in" },
    { id: "docs", label: lvf("С документами", "Hujjatlar bilan", "With documents"), test: (p) => p.stock === "in" || p.badge === "hit" },
    { id: "warranty", label: lvf("С гарантией", "Kafolat bilan", "With warranty"), test: (p) => p.stock !== "preorder" },
  ];
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [sort, setSort] = useState("pop");
  const PAGE = 12;
  const [visible, setVisible] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sentinelRef = useRef(null);

  // reset when route params change
  useEffect(() => {
    setBrandSel(params.brand ? [params.brand] : []);
    setStockSel(params.stock ? [params.stock] : []);
    setFeatSel([]);
    setMinP(""); setMaxP("");
  }, [params.cat, params.sub, params.brand, params.stock, params.badge, params.q, params.dir]);

  // reset visible count when filters/sort/route change
  useEffect(() => { setVisible(PAGE); }, [params.cat, params.sub, params.brand, params.stock, params.badge, params.q, params.dir, sort, brandSel, stockSel, featSel, minP, maxP]);

  const cat = params.cat ? cats.find((c) => c.id === params.cat) : null;
  const sub = cat && params.sub != null ? cat.subs[params.sub] : null;
  let dirObj    = params.dir && window.DIRECTIONS_DATA ? window.DIRECTIONS_DATA.getDirById(params.dir) : null;
  // fallback: resolve direction from the normalized CMS catalog (new model)
  if (!dirObj && params.dir && window.CMS) {
    const d = window.CMS.list("cat_directions").find((x) => x.id === params.dir);
    if (d) dirObj = { id: d.id, ru: d.name, uz: d.name, en: d.name };
  }
  // direction subsection (new model)
  let sectionObj = null;
  if (params.section && window.CMS) {
    const s = window.CMS.list("cat_sections").find((x) => x.id === params.section);
    if (s) sectionObj = { id: s.id, ru: s.name, uz: s.name, en: s.name };
  }
  const groupDirs = dirObj && window.DIRECTIONS_DATA && window.DIRECTIONS_DATA.getDirById(params.dir) ? window.DIRECTIONS_DATA.getDirsForGroup(dirObj.group) : [];

  // ── normalized catalog browse model (categories→subs→groups, directions→sections→groups) ──
  const CAT = window.CMS ? {
    groups:   window.CMS.list("cat_groups").filter((g) => g.active !== false),
    links:    window.CMS.list("cat_links"),
    sections: window.CMS.list("cat_sections").filter((s) => s.active !== false),
    seccats:  window.CMS.list("cat_seccats"),
  } : null;
  // sections of the current direction (подразделы/кабинеты)
  const dirSections = (CAT && params.dir) ? CAT.sections.filter((s) => s.dir === params.dir).sort((a, b) => (a.order || 0) - (b.order || 0)) : [];
  // product groups relevant to the current route
  const subSid = (cat && params.sub != null && cat.subs[params.sub]) ? cat.subs[params.sub]._id : null;
  const groupList = (() => {
    if (!CAT) return [];
    if (params.section) {
      const ids = new Set(CAT.links.filter((l) => l.section === params.section).map((l) => l.group));
      return CAT.groups.filter((g) => ids.has(g.id));
    }
    if (params.dir) {
      const secIds = new Set(CAT.sections.filter((s) => s.dir === params.dir).map((s) => s.id));
      const ids = new Set(CAT.links.filter((l) => secIds.has(l.section)).map((l) => l.group));
      return CAT.groups.filter((g) => ids.has(g.id));
    }
    if (params.cat) {
      return CAT.groups.filter((g) => {
        const primary = g.cat === params.cat && (!subSid || g.sub === subSid);
        const secondary = !subSid && (CAT.seccats || []).some((sc) => sc.group === g.id && sc.cat === params.cat);
        return primary || secondary;
      }).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [];
  })();
  // show the group-browse (taxonomy) layer at a category/direction/section root —
  // i.e. before the user drills into a specific subcategory or runs a search
  const browseGroups = groupList.length > 0 && params.sub == null && !params.q && !params.badge;
  // navigate from a group tile to its category + subcategory listing
  const goGroup = (g) => {
    const c = cats.find((x) => x.id === g.cat);
    const idx = c ? c.subs.findIndex((s) => s._id === g.sub) : -1;
    go("catalog", idx >= 0 ? { cat: g.cat, sub: idx } : { cat: g.cat });
  };
  const secName = (id) => { const s = CAT && CAT.sections.find((x) => x.id === id); return s ? s.name : ""; };

  // base set by route
  let base = ALL.filter((p) => {
    if (params.cat) {
      const inPrimary = p.cat === params.cat && (params.sub == null || p.sub === params.sub);
      const inExtra = (p.extraCats || []).some(ec => ec.cat === params.cat && (params.sub == null || ec.sub === params.sub));
      if (!inPrimary && !inExtra) return false;
    }
    if (params.dir) {
      const dm = (window.DIRECTIONS_DATA || {}).PRODUCT_DIR_MAP || {};
      if (!(dm[p.id] || []).includes(params.dir)) return false;
    }
    if (params.badge && p.badge !== params.badge) return false;
    if (params.q) {
      const hay = (p.ru + " " + p.uz + " " + p.en + " " + brandName(p.brand) + " " + (p.sku || "")).toLowerCase();
      if (!hay.includes(params.q.toLowerCase())) return false;
    }
    return true;
  });

  // brands available in base for the filter list
  const brandsInBase = brands.filter((b) => base.some((p) => p.brand === b.id));

  // apply sidebar filters
  let list = base.filter((p) => {
    if (brandSel.length && !brandSel.includes(p.brand)) return false;
    if (stockSel.length && !stockSel.includes(p.stock)) return false;
    if (featSel.length) {
      for (const f of featSel) {
        const opt = featOpts.find((o) => o.id === f);
        if (opt && !opt.test(p)) return false;
      }
    }
    if (minP && p.price < parseInt(minP, 10)) return false;
    if (maxP && p.price > parseInt(maxP, 10)) return false;
    return true;
  });

  // sort
  list = [...list].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "new") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.pop - a.pop;
    return b.pop - a.pop;
  });

  const shown = list.slice(0, visible);
  const hasMore = visible < list.length;

  // infinite scroll: load next page when sentinel enters viewport
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible((v) => Math.min(v + PAGE, list.length));
      }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, list.length]);

  const title = sectionObj ? tri(lang, sectionObj.ru, sectionObj.uz, sectionObj.en)
    : dirObj ? tri(lang, dirObj.ru, dirObj.uz, dirObj.en)
    : sub ? (tri(lang, sub.ru, sub.uz, sub.en))
    : cat ? (tri(lang, cat.ru, cat.uz, cat.en))
    : params.badge === "hit" ? t.sec_featured
    : params.badge === "sale" ? t.nav_promo
    : params.q ? `«${params.q}»`
    : t.catalog;

  const toggle = (arr, setArr, v) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const stockOpts = [
    { id: "in", label: t.in_stock },
    { id: "order", label: t.on_order },
    { id: "preorder", label: t.preorder },
  ];

  const hasFilters = brandSel.length || stockSel.length || featSel.length || minP || maxP;
  const resetAll = () => { setBrandSel([]); setStockSel([]); setFeatSel([]); setMinP(""); setMaxP(""); };

  return (
    <div className="wrap">
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <a onClick={() => go("catalog", {})}>{t.catalog}</a>
        {cat && <><Icon name="chevronRight" size={14} /><a onClick={() => go("catalog", { cat: cat.id })}>{tri(lang, cat.ru, cat.uz, cat.en)}</a></>}
        {sub && <><Icon name="chevronRight" size={14} /><span className="cur">{tri(lang, sub.ru, sub.uz, sub.en)}</span></>}
        {!sub && cat && <span className="cur" style={{ display: "none" }} />}
        {dirObj && <><Icon name="chevronRight" size={14} /><span className={sectionObj ? "" : "cur"} {...(sectionObj ? { onClick: () => go("catalog", { dir: dirObj.id }), style: { cursor: "pointer" } } : {})}>{tri(lang, dirObj.ru, dirObj.uz, dirObj.en)}</span></>}
        {sectionObj && <><Icon name="chevronRight" size={14} /><span className="cur">{tri(lang, sectionObj.ru, sectionObj.uz, sectionObj.en)}</span></>}
      </div>

      <div className="cat-layout">
        <div className={"filters-backdrop " + (filtersOpen ? "show" : "")} onClick={() => setFiltersOpen(false)} />
        <aside className={"filters " + (filtersOpen ? "open" : "")}>
          <div className="flt-head">
            <h3>{t.cat_filters}</h3>
            {hasFilters ? <button className="flt-reset" onClick={resetAll}>{t.cat_reset}</button> : null}
            <button className="flt-close" onClick={() => setFiltersOpen(false)}><Icon name="x" size={20} /></button>
          </div>

          {!params.cat && !params.dir && (
            <div className="flt-grp">
              <h4>{t.all_categories}</h4>
              {cats.map((c) => (
                <Checkbox key={c.id} label={tri(lang, c.ru, c.uz, c.en)}
                  count={ALL.filter((p) => p.cat === c.id || (p.extraCats||[]).some(ec=>ec.cat===c.id)).length}
                  on={false} onClick={() => go("catalog", { cat: c.id })} />
              ))}
            </div>
          )}

          {cat && (
            <div className="flt-grp">
              <h4>{tri(lang, cat.ru, cat.uz, cat.en)}</h4>
              {cat.subs.map((s, i) => (
                <Checkbox key={i} label={tri(lang, s.ru, s.uz, s.en)}
                  count={ALL.filter(p=>(p.cat===cat.id&&p.sub===i)||(p.extraCats||[]).some(ec=>ec.cat===cat.id&&ec.sub===i)).length}
                  on={params.sub === i}
                  onClick={() => go("catalog", params.sub === i ? { cat: cat.id } : { cat: cat.id, sub: i })} />
              ))}
            </div>
          )}

          <div className="flt-grp">
            <h4>{lang==="uz"?"Yoʻnalishlar":lang==="en"?"Directions":"Направления"}</h4>
              {groupDirs.map(d => {
                const cnt = window.DIRECTIONS_DATA ? window.DIRECTIONS_DATA.getProductsForDir(d.id, ALL).length : 0;
                return <Checkbox key={d.id} label={tri(lang, d.ru, d.uz, d.en)} count={cnt > 0 ? cnt : null} on={params.dir===d.id} onClick={()=>go("catalog",{dir:d.id})} />;
              })}
            </div>
          )}

          <div className="flt-grp">
            <h4>{t.cat_brand}</h4>
            {brandsInBase.map((b) => (
              <Checkbox key={b.id} label={b.name}
                count={base.filter((p) => p.brand === b.id).length}
                on={brandSel.includes(b.id)}
                onClick={() => toggle(brandSel, setBrandSel, b.id)} />
            ))}
          </div>

          <div className="flt-grp">
            <h4>{t.cat_availability}</h4>
            {stockOpts.map((s) => (
              <Checkbox key={s.id} label={s.label}
                count={base.filter((p) => p.stock === s.id).length}
                on={stockSel.includes(s.id)}
                onClick={() => toggle(stockSel, setStockSel, s.id)} />
            ))}
          </div>

          <div className="flt-grp">
            <h4>{lvf("Дополнительно", "Qo'shimcha", "Additional")}</h4>
            {featOpts.map((f) => (
              <Checkbox key={f.id} label={f.label}
                count={base.filter(f.test).length}
                on={featSel.includes(f.id)}
                onClick={() => toggle(featSel, setFeatSel, f.id)} />
            ))}
          </div>

          <div className="flt-grp">
            <h4>{t.cat_price}</h4>
            <div className="flt-price">
              <input className="mono" inputMode="numeric" placeholder={t.from + " 0"} value={minP}
                onChange={(e) => setMinP(e.target.value.replace(/\D/g, ""))} />
              <span>—</span>
              <input className="mono" inputMode="numeric" placeholder="∞" value={maxP}
                onChange={(e) => setMaxP(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
          <button className="flt-apply" onClick={() => setFiltersOpen(false)}>
            {lang === "uz" ? `${list.length} ta ko'rsatish` : lang === "en" ? `Show ${list.length}` : `Показать ${list.length}`}
          </button>
        </aside>

        <main className="cat-main">
          <div className="cat-bar">
            <div>
              {(() => {
                const lvl = dirObj
                  ? { txt: lvf("Медицинское направление","Tibbiy yoʻnalish","Medical direction"), cls: "dir" }
                  : sub
                  ? { txt: lvf("Подкатегория","Subkategoriya","Subcategory"), cls: "sub" }
                  : cat
                  ? { txt: lvf("Категория товаров","Mahsulot toifasi","Product category"), cls: "cat" }
                  : params.badge || params.q
                  ? null
                  : { txt: lvf("Весь каталог","Butun katalog","Full catalog"), cls: "all" };
                return lvl ? <div className={"cat-level cat-level-" + lvl.cls}>{lvl.txt}</div> : null;
              })()}
              <h1>{title}</h1>
              {sub && cat && <div className="cb-parent">{lvf("в категории","toifada","in category")} <a onClick={() => go("catalog", { cat: cat.id })}>{tri(lang, cat.ru, cat.uz, cat.en)}</a></div>}
              <div className="cb-found">{browseGroups
                ? <>{lvf("Товарных групп","Mahsulot guruhlari","Product groups")}: <b>{groupList.length}</b></>
                : <>{t.found}: <b>{list.length}</b> {t.items_count}</>}</div>
            </div>
            <div className="cat-bar-controls">
              <button className="flt-trigger" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" size={17} />
                {t.cat_filters}
                {hasFilters ? <span className="flt-trigger-dot" /> : null}
              </button>
              <div className="sort-sel">
                <label>{t.cat_sort}:</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="pop">{t.sort_pop}</option>
                  <option value="price_asc">{t.sort_price_asc}</option>
                <option value="price_desc">{t.sort_price_desc}</option>
                <option value="new">{t.sort_new}</option>
              </select>
            </div>
          </div>
          </div>

          {hasFilters ? (
            <div className="chips">
              {brandSel.map((id) => (
                <span key={id} className="chip">{brandName(id)}<button onClick={() => toggle(brandSel, setBrandSel, id)}><Icon name="x" size={13} /></button></span>
              ))}
              {stockSel.map((id) => (
                <span key={id} className="chip">{stockOpts.find((s) => s.id === id).label}<button onClick={() => toggle(stockSel, setStockSel, id)}><Icon name="x" size={13} /></button></span>
              ))}
              {featSel.map((id) => (
                <span key={id} className="chip">{featOpts.find((f) => f.id === id).label}<button onClick={() => toggle(featSel, setFeatSel, id)}><Icon name="x" size={13} /></button></span>
              ))}
              {(minP || maxP) && (
                <span className="chip">{t.cat_price}: {minP || 0}—{maxP || "∞"}<button onClick={() => { setMinP(""); setMaxP(""); }}><Icon name="x" size={13} /></button></span>
              )}
            </div>
          ) : null}

          {dirSections.length > 0 ? (
            <div className="cat-sections">
              <button className={"cat-sec-chip" + (!params.section ? " on" : "")} onClick={() => go("catalog", { dir: params.dir })}>
                {lvf("Все подразделы","Barcha boʻlimlar","All sections")}
              </button>
              {dirSections.map((s) => (
                <button key={s.id} className={"cat-sec-chip" + (params.section === s.id ? " on" : "")} onClick={() => go("catalog", { dir: params.dir, section: s.id })}>
                  {s.name}
                </button>
              ))}
            </div>
          ) : null}

          {browseGroups ? (
            <div className="cat-groups">
              {groupList.map((g) => (
                <button key={g.id} className="cat-group-tile" onClick={() => goGroup(g)}>
                  <span className="cgt-ic"><Icon name="catalog" size={18} /></span>
                  <span className="cgt-name">{g.name}</span>
                  <Icon name="chevronRight" size={16} className="cgt-chev" />
                </button>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="empty empty-rich">
              <div className="e-ic"><Icon name="box" size={32} /></div>
              <h3>{lvf("Товары скоро появятся","Mahsulotlar tez orada paydo bo'ladi","Products coming soon")}</h3>
              <p>{lvf(
                "В этом разделе пока нет позиций. Оставьте заявку — мы подберём оборудование вручную и подготовим коммерческое предложение.",
                "Bu bo'limda hozircha pozitsiyalar yo'q. Ariza qoldiring — biz uskunani qo'lda tanlab, tijorat taklifini tayyorlaymiz.",
                "No items here yet. Leave a request — we'll select equipment manually and prepare a commercial offer.")}</p>
              <div className="empty-actions">
                <button className="btn btn-primary btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>
                  <Icon name="doc" size={18} />{lvf("Получить КП","KP olish","Request a quote")}
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => go("catalog", {})}>
                  <Icon name="grid" size={18} />{lvf("Весь каталог","Butun katalog","Full catalog")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="cat-grid-p">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} t={t} lang={lang} store={store} onOpen={(pr) => go("product", { id: pr.id, fromDir: params.dir })} />
                ))}
              </div>
              {hasMore && (
                <div className="cat-loadmore" ref={sentinelRef}>
                  <div className="cat-progress"><div className="cat-progress-bar" style={{ width: Math.round((visible / list.length) * 100) + "%" }} /></div>
                  <button className="btn btn-outline" onClick={() => setVisible((v) => Math.min(v + PAGE, list.length))}>
                    {lang === "uz" ? "Yana yuklash" : lang === "en" ? "Load more" : "Загрузить ещё"}
                    <span className="lm-count">{shown.length} / {list.length}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { CatalogPage, Checkbox });
