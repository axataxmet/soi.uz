/* UzMedEx — Quick View Modal (portal-based) */
const { useState: useQVState, useEffect: useQVEffect } = React;

/* ── inner modal content ── */
function QuickViewModal({ product, t, lang, store, go, onClose }) {
  const p = product;
  const [variantIdx, setVariantIdx] = useQVState(0);
  const [qty, setQty] = useQVState(1);

  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const name = tri(lang, p.ru, p.uz, p.en);
  const brand = (window.DATA.BRANDS || []).find(b => b.id === p.brand);
  const cat   = (window.DATA.CATEGORIES || []).find(c => c.id === p.cat);
  const sub   = cat?.subs?.[p.sub];

  const inCart = store.cart.some(c => c.id === p.id);
  const inWish = store.wishlist.includes(p.id);
  const inCmp  = store.compare.includes(p.id);

  const effectivePrice = (p.variants && p.variants.length > 0)
    ? p.variants[variantIdx].price : p.price;

  const keySpecs = (p.specs || []).slice(0, 5);

  const dirs = (window.DIRECTIONS_DATA)
    ? ((window.DIRECTIONS_DATA.PRODUCT_DIR_MAP[p.id] || [])
        .slice(0, 3)
        .map(did => window.DIRECTIONS_DATA.getDirById(did))
        .filter(Boolean))
    : [];

  useQVEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const modalContent = (
    <div
      style={{
        position:"fixed",inset:0,
        background:"rgba(9,24,48,.58)",
        zIndex:9999,
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"16px",
        animation:"qvFadeIn .15s ease"
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes qvFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes qvSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div
        className="qv-box"
        style={{ animation:"qvSlideUp .2s ease" }}
        onClick={e => e.stopPropagation()}
      >
        <button className="qv-close" onClick={onClose}>
          <Icon name="x" size={20} />
        </button>

        <div className="qv-layout">
          {/* image column */}
          <div className="qv-img-col">
            <ProductPlaceholder product={p} t={t} lang={lang} big />
            {dirs.length > 0 && (
              <div className="qv-dirs">
                {dirs.map(d => (
                  <span key={d.id} className="qv-dir-tag">
                    {lv(d.ru, d.uz, d.en)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* info column */}
          <div className="qv-info">
            <div className="qv-tags">
              <Badge kind={p.badge} t={t} />
              <StockTag stock={p.stock} t={t} />
            </div>

            <h2 className="qv-title">{name}</h2>

            <div className="qv-meta">
              {brand && (
                <span className="qv-brand">
                  <Icon name="award" size={14} style={{ color:"var(--blue-600)" }} />
                  {brand.name}
                  {brand.country_ru &&
                    <span className="qv-country">
                      · {lv(brand.country_ru, brand.country_uz, brand.country_en)}
                    </span>
                  }
                </span>
              )}
              <span className="qv-sku mono">{t.sku} {p.sku}</span>
            </div>

            {keySpecs.length > 0 && (
              <div className="qv-specs">
                {keySpecs.map((s, i) => (
                  <div key={i} className="qvs-row">
                    <span className="qvs-k">{tri(lang, s.kr, s.ku, s.ke)}</span>
                    <span className="qvs-v">{lang === "en" && s.ve ? s.ve : s.v}</span>
                  </div>
                ))}
              </div>
            )}

            {p.variants && p.variants.length > 0 && (
              <div>
                <div className="pv-label">{t.variants}</div>
                <div className="pv-opts">
                  {p.variants.map((v, i) => (
                    <button key={i}
                      className={"pv-opt " + (variantIdx === i ? "on" : "")}
                      onClick={() => setVariantIdx(i)}>
                      {tri(lang, v.label_ru, v.label_uz, v.label_en)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="qv-buy-row">
              <Price value={effectivePrice * qty} t={t} size="lg" />
              <QtyStepper value={qty} onChange={setQty} />
            </div>

            <div className="qv-actions">
              <button
                className={"btn " + (inCart ? "btn-dark" : "btn-primary")}
                style={{ flex:1, justifyContent:"center" }}
                onClick={() => store.addToCart(p.id, qty)}>
                <Icon name={inCart ? "check" : "cart"} size={18} />
                {inCart ? t.in_cart : t.add_to_cart}
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex:1, justifyContent:"center" }}
                onClick={() => { onClose(); window.__openQuote && window.__openQuote(p); }}>
                {t.request_quote}
              </button>
              <button
                className={"pdp-icact " + (inWish ? "on" : "")}
                title={t.wishlist}
                onClick={() => store.toggleWish(p.id)}>
                <Icon name={inWish ? "heartFill" : "heart"} size={20} />
              </button>
              <button
                className={"pdp-icact " + (inCmp ? "on" : "")}
                title={t.add_compare}
                onClick={() => store.toggleCompare(p.id)}>
                <Icon name="compare" size={20} />
              </button>
            </div>

            <button className="qv-fullpage"
              onClick={() => { go("product", { id: p.id }); onClose(); }}>
              {lv("Открыть страницу товара","Mahsulot sahifasini ochish","View full product page")}
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

/* ── portal host — rendered once inside App ── */
function QuickViewPortal({ t, lang, store, go }) {
  const [product, setProduct] = useQVState(null);

  useQVEffect(() => {
    window.__openQuickView = (p) => {
      try { ReactDOM.flushSync(() => setProduct(p)); }
      catch(e) { setProduct(p); }
    };
    return () => { window.__openQuickView = null; };
  }, []);

  if (!product) return null;

  return ReactDOM.createPortal(
    <QuickViewModal
      product={product}
      t={t} lang={lang} store={store} go={go}
      onClose={() => setProduct(null)}
    />,
    document.body
  );
}

Object.assign(window, { QuickViewModal, QuickViewPortal });
