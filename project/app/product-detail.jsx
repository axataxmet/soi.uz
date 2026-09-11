/* ИНДУСТРИЯ ЗДОРОВЬЯ — product detail page */

// Detect whether a stored description is rich HTML (from the WYSIWYG editor)
// or legacy plain text, so the page can render each correctly.
function rtIsHtmlSite(s) { return /<(p|h[1-6]|ul|ol|li|strong|em|b|i|br|div)\b/i.test(String(s || "")); }

const VAT_RATE = 0.12;
const ON_REQUEST_THRESHOLD = 90000000; // дорогое капитальное оборудование — цена по запросу

/* обложка-заглушка для документа без превью (та же схема, что в LicensesPage) */
function PdpDocFallback() {
  return (
    <svg viewBox="0 0 160 212" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="212" rx="6" fill="var(--surface,#fff)" stroke="var(--line)" />
      <rect x="20" y="24" width="120" height="10" rx="3" fill="var(--bg-2)" />
      <rect x="20" y="48" width="120" height="5" rx="2.5" fill="var(--bg-2)" />
      <rect x="20" y="60" width="120" height="5" rx="2.5" fill="var(--bg-2)" />
      <rect x="20" y="72" width="104" height="5" rx="2.5" fill="var(--bg-2)" />
      <rect x="20" y="92" width="120" height="5" rx="2.5" fill="var(--bg-2)" />
      <rect x="20" y="104" width="112" height="5" rx="2.5" fill="var(--bg-2)" />
      <circle cx="40" cy="170" r="15" stroke="var(--blue-600)" strokeWidth="1.5" opacity=".7" />
      <rect x="66" y="164" width="54" height="5" rx="2.5" fill="var(--line-soft)" />
      <rect x="66" y="174" width="40" height="5" rx="2.5" fill="var(--line-soft)" />
    </svg>
  );
}

/* миниатюра первой страницы PDF — тот же общий рендер window.rvpRenderPdfPage,
   что и на /documents и /reviews, просто без ленивого IntersectionObserver:
   на карточке товара документов всегда мало (2-3), рендерить их все сразу не проблема. */
function PdpDocThumb({ url }) {
  const [src, setSrc] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    let on = true; setSrc(null); setErr(false);
    if (!url || !window.rvpRenderPdfPage) { setErr(true); return; }
    // pdf.js изредка зависает без ошибки и без результата (замечено и на
    // /documents) — не даём миниатюре висеть скелетоном вечно, через 7с
    // считаем рендер неудавшимся и показываем статичную обложку.
    const timeout = setTimeout(() => on && setErr(true), 7000);
    window.rvpRenderPdfPage(url, 240)
      .then((d) => { if (on) { clearTimeout(timeout); setSrc(d.src); } })
      .catch(() => { if (on) { clearTimeout(timeout); setErr(true); } });
    return () => { on = false; clearTimeout(timeout); };
  }, [url]);
  if (src && !err) return <img src={src} alt="" loading="lazy" />;
  if (!err) return <div className="pdp-doc-skel" aria-hidden="true" />;
  return <PdpDocFallback />;
}

/* Карточка товара сделана по образцу medcomp.ru: минимальный блок покупки
   без опта, переключателя НДС и второстепенных кнопок (wishlist/compare/КП) —
   только статус НДС, цена, количество и «Купить». */
function B2BPriceBlock({ p, t, lang, basePrice, qty, setQty, store }) {
  const onRequest = p.priceOnRequest || p.showPrice === false || !(basePrice > 0) || basePrice >= ON_REQUEST_THRESHOLD;
  const inCart = store.cart.some((c) => c.id === p.id);

  if (onRequest) {
    return (
      <div className="pdp-buy">
        <div className="por-block">
          <div className="por-label"><Icon name="spark" size={16} />{t.price_on_request}</div>
          <div className="por-note">{t.price_on_request_note}</div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => window.__openQuote && window.__openQuote(p)}>
          <Icon name="doc" size={20} />{t.request_quote}
        </button>
      </div>
    );
  }

  return (
    <div className="pdp-buy">
      <div className="pdp-buy-status">
        <span className="pdp-instock">{t.in_stock || "В наличии"}</span>
        <span className="pdp-vat-static">{t.vat_incl_12 || t.vat_note}</span>
      </div>
      <div className="pdp-price-lg"><Price value={basePrice} t={t} size="lg" /></div>
      <div className="pdp-buy-row">
        <QtyStepper value={qty} onChange={setQty} />
        <button className={"btn btn-buy " + (inCart ? "btn-dark" : "btn-primary")} onClick={() => store.addToCart(p.id, qty)}>
          {inCart ? t.in_cart : (t.buy_now || t.add_to_cart)}
        </button>
      </div>
      <div className="pdp-buy-links">
        <a onClick={() => window.__openQuote && window.__openQuote(p)}>{lang === "uz" ? "To'lov usuli" : lang === "en" ? "Payment method" : "Способ оплаты"}</a>
        <a onClick={() => window.__openQuote && window.__openQuote(p)}>{lang === "uz" ? "Yetkazib berish usuli" : lang === "en" ? "Delivery method" : "Способ доставки"}</a>
      </div>
      <NotifyAvailable t={t} lang={lang} product={p} />
    </div>
  );
}

function ProductNotFound({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return (
    <div className="wrap" style={{ padding: "60px 0 80px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12, opacity: .25 }}>⚬</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>{lv("Товар не найден", "Mahsulot topilmadi", "Product not found")}</h1>
      <p style={{ color: "var(--slate-500)", maxWidth: 460, margin: "0 auto 22px", lineHeight: 1.55 }}>
        {lv("Возможно, позиция была снята с продажи или ссылка устарела. Напишите нам — подберём оборудование вручную и подготовим коммерческое предложение.",
          "Mahsulot sotuvdan olingan yoki havola eskirgan boʻlishi mumkin. Bizga yozing — uskunani qoʻlda tanlab, tijorat taklifini tayyorlaymiz.",
          "The item may have been removed or the link is outdated. Contact us — we’ll pick equipment manually and prepare a quote.")}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-pri" onClick={() => go("catalog", {})}>{lv("В каталог", "Katalogga", "To catalog")}</button>
        <button className="btn btn-ghost" onClick={() => window.__openQuote && window.__openQuote(null)}>{lv("Оставить заявку", "Ariza qoldirish", "Leave a request")}</button>
      </div>
    </div>);
}

function ProductPage({ t, lang, store, go, params }) {
  const P = window.DATA.PRODUCTS;
  const p = P.find((x) => x.id === params.id);
  if (!p) return <ProductNotFound t={t} lang={lang} go={go} />;
  const cat = window.DATA.CATEGORIES.find((c) => c.id === p.cat) || { id: p.cat, ru: "", uz: "", en: "", subs: [] };
  const sub = (cat.subs ? cat.subs[p.sub] : null) || { ru: "", uz: "", en: "" };
  const brand = window.DATA.BRANDS.find((b) => b.id === p.brand) || { name: "", country_ru: "", country_uz: "", country_en: "" };
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("specs");
  const [thumb, setThumb] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbsRef = React.useRef(null);
  const scrollThumbs = (dir) => {
    const el = thumbsRef.current;
    if (!el) return;
    el.scrollBy({ top: dir * (66 * 4), behavior: "smooth" });
  };
  const mayLikeRef = React.useRef(null);
  const scrollMayLike = (dir) => {
    const el = mayLikeRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };
  const [variantIdx, setVariantIdx] = useState(0);
  const [fullImages, setFullImages] = useState(null);
  const [regDocs, setRegDocs] = useState(null);
  const [showAllRelated, setShowAllRelated] = useState(false);

  useEffect(() => { setQty(1); setThumb(0); setTab("specs"); setVariantIdx(0); setLightbox(false); window.scrollTo({ top: 0, behavior: "instant" }); rvPush(params.id); }, [params.id]);

  /* Список товаров грузит только главное фото (media: isMain, take 1) и без
     regDocuments — иначе payload каталога распухает на каждую картинку и
     документ каждого товара. Полную галерею и реальные документы (когда
     они загружены в админке) подгружаем отдельным запросом на карточке. */
  useEffect(() => {
    setFullImages(null);
    setRegDocs(null);
    if (!p._remote || !window.api) return;
    let cancelled = false;
    window.api.getOne("products", p.id).then((full) => {
      if (cancelled || !full) return;
      if (Array.isArray(full.media)) {
        const urls = full.media.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((m) => m.url);
        if (urls.length > 1) setFullImages(urls);
      }
      if (Array.isArray(full.regDocuments) && full.regDocuments.length > 0) {
        setRegDocs(full.regDocuments.filter((d) => d.fileUrl && d.status === "PRESENT"));
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [p.id]);

  const effectivePrice = (p.variants && p.variants.length > 0) ? p.variants[variantIdx].price : p.price;
  const effectiveOld   = (p.variants && p.variants.length > 0) ? null : p.old;
  const inCart = store.cart.some((c) => c.id === p.id);
  const inWish = store.wishlist.includes(p.id);
  const inCmp = store.compare.includes(p.id);
  const name = tri(lang, p.ru, p.uz, p.en);
  const viewers = 2 + (parseInt((p.id || "p0").replace(/\D/g, ""), 10) % 7);
  const fromDir = (params.fromDir && window.DIRECTIONS_DATA)
    ? window.DIRECTIONS_DATA.getDirById(params.fromDir) : null;

  const related = (p.related && p.related.length > 0)
    ? P.filter(x => p.related.includes(x.id))
    : P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 12);
  const accs = P.filter(x => (p.accessories||[]).includes(x.id));
  const cons = P.filter(x => (p.consumables||[]).includes(x.id));
  // «Вам может быть интересно» — внизу страницы: не просто популярное, а
  // близкое к просматриваемому товару (та же подкатегория > категория > бренд),
  // и только при прочих равных — по популярности. Не пересекается с сайдбаром.
  const shownIds = new Set([p.id, ...related.slice(0, 3).map(r => r.id)]);
  const mayLike = P.filter(x => !shownIds.has(x.id))
    .map(x => ({
      x,
      score: (x.sub === p.sub && x.cat === p.cat ? 3 : x.cat === p.cat ? 2 : x.brand === p.brand ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || (b.x.pop || 0) - (a.x.pop || 0))
    .slice(0, 10)
    .map(e => e.x);

  // gallery media: real images + optional YouTube video, else placeholders
  const ytId = (() => {
    const u = p.video || "";
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  })();
  const imgs = fullImages || ((p.images && p.images.length) ? p.images : (p.img ? [p.img] : []));
  const media = imgs.map((src) => ({ type: "img", src }));
  if (ytId) media.push({ type: "video", id: ytId });
  const hasMedia = media.length > 0;
  const cur = hasMedia ? media[Math.min(thumb, media.length - 1)] : null;

  const descText = lang === "uz"
    ? `${name} — ${(sub.uz)} toifasidagi ${brand.name} (${brand.country_uz}) ishlab chiqargan professional tibbiy uskuna. ${t.desc_lead} Davlat va xususiy tibbiyot muassasalarini jihozlash uchun moʻljallangan.`
    : lang === "en"
    ? `${name} — professional medical equipment in the “${tri(lang, sub.ru, sub.uz, sub.en)}” category, manufactured by ${brand.name} (${tri(lang, brand.country_ru, brand.country_uz, brand.country_en)}). ${t.desc_lead} Suitable for equipping public and private medical institutions.`
    : `${name} — профессиональное медицинское оборудование категории «${sub.ru}» производства ${brand.name} (${brand.country_ru}). ${t.desc_lead} Подходит для оснащения государственных и частных медицинских учреждений.`;

  return (
    <>
    <div className="wrap">
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        {fromDir ? (
          <>
            <a onClick={() => go("catalog", { dir: fromDir.id })}>{tri(lang, fromDir.ru, fromDir.uz, fromDir.en)}</a>
            <Icon name="chevronRight" size={14} />
          </>
        ) : (
          <>
            <a onClick={() => go("catalog", { cat: cat.id })}>{tri(lang, cat.ru, cat.uz, cat.en)}</a>
            <Icon name="chevronRight" size={14} />
            <a onClick={() => go("catalog", { cat: cat.id, sub: p.sub })}>{tri(lang, sub.ru, sub.uz, sub.en)}</a>
            <Icon name="chevronRight" size={14} />
          </>
        )}
        <span className="cur">{name.slice(0, 40)}…</span>
      </div>

      <h1 className="pdp-h1">{name}</h1>
      <div className="pdp-topline">
        <span className="pdp-sku">{t.sku} {p.sku}</span>
      </div>

      <div className="pdp">
        <div className="pdp-gallery">
          {media.length > 1 && (
            <div className="pdp-thumbs-col">
              {media.length > 4 && (
                <button type="button" className="pdp-thumb-nav" onClick={() => scrollThumbs(-1)} aria-label={lang === "uz" ? "Yuqoriga" : lang === "en" ? "Up" : "Вверх"}>
                  <Icon name="chevronRight" size={16} style={{ transform: "rotate(-90deg)" }} />
                </button>
              )}
              <div className="pdp-thumbs" ref={thumbsRef} role="tablist" aria-label={lang === "uz" ? "Mahsulot fotolari" : lang === "en" ? "Product photos" : "Фото товара"}>
                {media.map((m, i) => (
                  <div key={i} className={"pdp-thumb " + (thumb === i ? "on" : "")} onClick={() => setThumb(i)}
                    role="tab" tabIndex={0} aria-selected={thumb === i}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setThumb(i); } }}>
                    {m.type === "video"
                      ? <div className="pdp-thumb-vid"><Icon name="play" size={22} /></div>
                      : <img src={thumbUrl(m.src, 56)} alt={name + " — " + (i + 1)} loading="lazy" />}
                  </div>
                ))}
              </div>
              {media.length > 4 && (
                <button type="button" className="pdp-thumb-nav" onClick={() => scrollThumbs(1)} aria-label={lang === "uz" ? "Pastga" : lang === "en" ? "Down" : "Вниз"}>
                  <Icon name="chevronRight" size={16} style={{ transform: "rotate(90deg)" }} />
                </button>
              )}
            </div>
          )}
          <div className="pdp-main-img" onClick={() => hasMedia && cur.type !== "video" && setLightbox(true)}>
            {!hasMedia ? (
              <ProductPlaceholder product={p} t={t} lang={lang} big />
            ) : cur.type === "video" ? (
              <iframe className="pdp-video" src={"https://www.youtube.com/embed/" + cur.id} title={name}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            ) : (
              <img className="pdp-photo" src={cur.src} alt={name} />
            )}
          </div>
        </div>

        {/* краткие характеристики буллетами — как на референсе, рядом с фото */}
        <ul className="pdp-brief-specs">
          {p.specs.slice(0, 9).map((s, i) => (
            <li key={i}>{tri(lang, s.kr, s.ku, s.ke)}: {lang === "en" && s.ve ? s.ve : s.v}</li>
          ))}
          {p.regNum && <li className="pdp-brief-reg">{t.spec_reg}</li>}
        </ul>

        <div className="pdp-buy-col">
          <div className="pdp-topline-actions">
            <button className={"pdp-wish-link " + (inWish ? "on" : "")} onClick={() => store.toggleWish(p.id)}>
              <Icon name={inWish ? "heartFill" : "heart"} size={15} />{t.wishlist}
            </button>
            <button className={"pdp-cmp-link " + (inCmp ? "on" : "")} onClick={() => store.toggleCompare(p.id)}>
              <Icon name="compare" size={15} />{t.add_compare}
            </button>
          </div>
          {p.variants && p.variants.length > 0 && (
            <div className="pdp-variants">
              <div className="pv-label">{t.variants}</div>
              <div className="pv-opts">
                {p.variants.map((v, i) => (
                  <button key={i} className={"pv-opt " + (variantIdx === i ? "on" : "")} onClick={() => setVariantIdx(i)}>
                    {tri(lang, v.label_ru, v.label_uz, v.label_en)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <B2BPriceBlock p={p} t={t} lang={lang} basePrice={effectivePrice} qty={qty} setQty={setQty} store={store} />
          {brand.name && (
            <div className="pdp-mfr-link">
              <span>{brand.name}{brand.country_ru ? ", " + tri(lang, brand.country_ru, brand.country_uz, brand.country_en) : ""}</span>
              <a onClick={() => go("catalog", { brand: p.brand })}>{lang === "uz" ? "Ishlab chiqaruvchining boshqa mahsulotlari" : lang === "en" ? "Other products by this manufacturer" : "Другие товары производителя"}</a>
            </div>
          )}
        </div>

        {/* «Похожие товары» — по вертикали продолжает карточку цены (тот же
            столбец сетки), по горизонтали начинается на уровне вкладок. */}
        {related.length > 0 && (
          <div className="pdp-lower-side">
            <div className="pdp-side-h">{lang === "uz" ? "O'xshash mahsulotlar" : lang === "en" ? "Similar products" : "Похожие товары"}</div>
            <div className="pdp-side-cards">
              {(showAllRelated ? related : related.slice(0, 4)).map((rp) => {
                const rname = tri(lang, rp.ru, rp.uz, rp.en);
                const rpInCart = store.cart.some((c) => c.id === rp.id);
                return (
                  <div key={rp.id} className="pdp-side-card" onClick={() => go("product", { id: rp.id })}>
                    <div className="psc-top">
                      <div className="psc-img">
                        {rp.img ? <img src={thumbUrl(rp.img, 52)} alt="" loading="lazy" /> : <ProductPlaceholder product={rp} t={t} lang={lang} />}
                      </div>
                      <div className="psc-info">
                        <div className="psc-name">{rname}</div>
                        <StockTag stock={rp.stock} t={t} />
                      </div>
                    </div>
                    <div className="psc-foot">
                      {rp.price ? <Price value={rp.price} t={t} /> : <span className="psc-onreq">{t.price_on_request}</span>}
                      <button type="button" className={"psc-cart " + (rpInCart ? "added" : "")} title={t.add_to_cart}
                        onClick={(e) => { e.stopPropagation(); store.addToCart(rp.id, 1); }}>
                        <Icon name={rpInCart ? "check" : "cart"} size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {related.length > 4 && (
              <button type="button" className="pdp-side-more" onClick={() => setShowAllRelated((v) => !v)}>
                {showAllRelated
                  ? (lang === "uz" ? "Yashirish" : lang === "en" ? "Show less" : "Скрыть")
                  : (lang === "uz" ? "Ko'proq ko'rsatish" : lang === "en" ? "Show more" : "Показать ещё") + ` (${related.length - 4})`}
              </button>
            )}
          </div>
        )}

        <div className="pdp-tabs-wrap">
          <div className="tabs">
            {[["desc", t.tab_desc], ["specs", t.tab_specs]].concat(p.kit && p.kit.length > 0 ? [["kit", t.tab_kit]] : []).concat([["delivery", t.tab_delivery], ["docs", t.tab_docs]]).map(([id, label]) => (
              <button key={id} className={"tab " + (tab === id ? "on" : "")} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>
          <div className="tab-body">
        {tab === "desc" && (() => {
          // API-товары везут descFull отдельно по языкам (descFull_ru/uz/en);
          // старые demo-товары из localStorage — одной строкой в p.descFull.
          const descFull = p.descFull || tri(lang, p.descFull_ru, p.descFull_uz, p.descFull_en);
          return (descFull || p.descShort)
            ? <div className="pdp-desc-rich">
                {p.descShort && <p className="pdp-desc-lead">{p.descShort}</p>}
                {descFull && (
                  rtIsHtmlSite(descFull)
                    ? <div className="pdp-desc-html" dangerouslySetInnerHTML={{ __html: descFull }} />
                    : descFull.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
                )}
              </div>
            : null;
        })()}
        {tab === "specs" && (
          <>
          <table className="spec-table">
            <tbody>
              {(() => { const c = p.country || tri(lang, brand.country_ru, brand.country_uz, brand.country_en); return c ? <tr><td>{t.spec_country}</td><td>{c}</td></tr> : null; })()}
              {p.model && <tr><td>{lang === "uz" ? "Model" : lang === "en" ? "Model" : "Модель"}</td><td>{p.model}</td></tr>}
              {p.specs.map((s, i) => (
                <tr key={i}><td>{tri(lang, s.kr, s.ku, s.ke)}</td><td>{lang === "en" && s.ve ? s.ve : s.v}</td></tr>
              ))}
              {p.warranty && <tr><td>{t.spec_warranty}</td><td>{p.warranty}</td></tr>}
              {p.regNum && <tr><td>{t.spec_reg}</td><td className="mono">{p.regNum}</td></tr>}
            </tbody>
          </table>
          </>
        )}
        {tab === "kit" && (
          (p.kit && p.kit.length > 0)
            ? <div className="pdp-kit">
                <ul className="pdp-kit-list">
                  {p.kit.map((k, i) => (
                    <li key={i}><span>{k.name}</span>{k.qty ? <span className="pdp-kit-qty">× {k.qty}</span> : null}</li>
                  ))}
                </ul>
              </div>
            : <p>{lang === "uz" ? "Toʻplam tarkibi koʻrsatilmagan." : lang === "en" ? "Package contents not specified." : "Комплектация не указана."}</p>
        )}
        {tab === "delivery" && (
          <div>
            {(() => {
              const sh = p.shipping || {};
              const lvd = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
              const rows = [
                [lvd("Вес товара", "Mahsulot vazni", "Item weight"), sh.weight && sh.weight + " кг"],
                [lvd("Вес в упаковке", "Qadoq vazni", "Packed weight"), sh.weightPack && sh.weightPack + " кг"],
                [lvd("Габариты товара", "Mahsulot oʻlchami", "Item dimensions"), sh.dims],
                [lvd("Габариты упаковки", "Qadoq oʻlchami", "Package dimensions"), sh.dimsPack],
                [lvd("Количество мест", "Joylar soni", "Number of packages"), sh.places],
                [lvd("Тип упаковки", "Qadoq turi", "Packaging type"), sh.packType],
              ].filter((r) => r[1]);
              // «Объём, м.куб.» показывается для всех товаров всегда (стандарт
              // каталога) — если не заведён в attrs._shipping.volume, строка
              // всё равно есть, с плейсхолдером вместо значения.
              rows.push([lvd("Объём, м.куб.", "Hajmi, m.kub.", "Volume, m³"), sh.volume ? sh.volume + " м³" : lvd("уточняется", "aniqlanmoqda", "on request")]);
              const flags = [
                sh.fragile && lvd("Хрупкий товар — требует осторожной транспортировки", "Moʻrt mahsulot — ehtiyotkorlik bilan tashish", "Fragile — handle with care"),
                sh.special && lvd("Требуется спецдоставка", "Maxsus yetkazib berish talab qilinadi", "Special delivery required"),
              ].filter(Boolean);
              if (!rows.length && !sh.transport && !sh.storage && !flags.length)
                return <p>{lvd("Информация о доставке предоставляется по запросу.", "Yetkazib berish maʼlumoti soʻrov boʻyicha taqdim etiladi.", "Delivery information is provided on request.")}</p>;
              return (
                <div className="pdp-ship">
                  {rows.length > 0 && (
                    <table className="spec-table" style={{ marginBottom: 16 }}>
                      <tbody>{rows.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody>
                    </table>
                  )}
                  {sh.transport && <p><b>{lvd("Транспортировка", "Tashish", "Transportation")}:</b> {sh.transport}</p>}
                  {sh.storage && <p><b>{lvd("Хранение", "Saqlash", "Storage")}:</b> {sh.storage}</p>}
                  {flags.map((f, i) => <div key={i} className="pdp-ship-flag"><Icon name="shield" size={15} />{f}</div>)}
                </div>
              );
            })()}
          </div>
        )}
        {tab === "docs" && (
          (() => {
            const dl = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
            // реальные документы, загруженные в админку (RegDocument.fileUrl) — приоритет
            if (regDocs && regDocs.length > 0) {
              const typeLabel = {
                RU: dl("Регистрационное удостоверение", "Roʻyxat guvohnomasi", "Registration certificate"),
                CERTIFICATE: dl("Сертификат соответствия", "Muvofiqlik sertifikati", "Certificate of conformity"),
                DECLARATION: dl("Декларация соответствия", "Muvofiqlik deklaratsiyasi", "Declaration of conformity"),
                CE: dl("Сертификат CE", "CE sertifikati", "CE certificate"),
                ISO: dl("Сертификат ISO", "ISO sertifikati", "ISO certificate"),
              };
              return (
                <div className="pdp-doc-grid">
                  {regDocs.map((d, i) => (
                    <a key={d.id || i} className="pdp-doc-card" href={d.fileUrl} target="_blank" rel="noopener">
                      <div className="pdp-doc-thumb"><PdpDocThumb url={d.fileUrl} /></div>
                      <div className="pdp-doc-name">{typeLabel[d.type] || dl("Паспорт", "Pasport", "Passport")}</div>
                    </a>
                  ))}
                </div>
              );
            }
            // Реальных файлов пока нет ни у одного товара — показываем список
            // документов, актуальных для этого типа оборудования (как у
            // референса: Паспорт / Сертификат соответствия / Регистрационное
            // удостоверение), с кнопкой запроса по каждому.
            const docNames = [
              dl("Паспорт", "Pasport", "Passport"),
              dl("Сертификат соответствия", "Muvofiqlik sertifikati", "Certificate of conformity"),
              dl("Регистрационное удостоверение", "Roʻyxatdan oʻtkazish guvohnomasi", "Registration certificate"),
            ];
            return (
              <div className="pdp-doc-grid">
                {docNames.map((n, i) => (
                  <div key={i} className="pdp-doc-card pdp-doc-card--request" onClick={() => window.__openQuote && window.__openQuote(p)}>
                    <div className="pdp-doc-thumb"><PdpDocFallback /></div>
                    <div className="pdp-doc-name">{n}</div>
                    <div className="pdp-doc-req">{dl("Запросить", "So'rash", "Request")}</div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
          </div>
        </div>
      </div>

      {hasMedia && cur.type !== "video" && lightbox && (
        <div className="pdp-lightbox" onClick={() => setLightbox(false)}>
          <button className="pdp-lightbox-close" onClick={() => setLightbox(false)}><Icon name="x" size={26} /></button>
          <img src={cur.src} alt={name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      </div>

      {/* accessories — секции ниже сами оборачивают контент в .wrap, поэтому
          не должны быть вложены в общий .wrap выше (иначе двойной паддинг
          сдвигает их заголовки на 32px правее остального контента страницы). */}
      {accs.length > 0 && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="wrap">
            <div className="sec-head"><h2 style={{ fontSize: 22 }}>{t.accessories}</h2></div>
            <div className="grid-4">{accs.map(ap => <ProductCard key={ap.id} product={ap} t={t} lang={lang} store={store} onOpen={pr => go("product", {id: pr.id})} />)}</div>
          </div>
        </section>
      )}

      {/* consumables */}
      {cons.length > 0 && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="wrap">
            <div className="sec-head"><h2 style={{ fontSize: 22 }}>{t.consumables_section}</h2></div>
            <div className="grid-4">{cons.map(cp => <ProductCard key={cp.id} product={cp} t={t} lang={lang} store={store} onOpen={pr => go("product", {id: cp.id})} />)}</div>
          </div>
        </section>
      )}

      {/* «Вам может быть интересно» — общая подборка, опущено вниз страницы */}
      {mayLike.length > 0 && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="wrap">
            <div className="sec-head"><h2 style={{ fontSize: 22 }}>{lang === "uz" ? "Sizga qiziqarli bo'lishi mumkin" : lang === "en" ? "You may also like" : "Вам может быть интересно"}</h2></div>
            <div className="pdp-mlk-carousel">
              <button type="button" className="pdp-mlk-nav pdp-mlk-nav-l" onClick={() => scrollMayLike(-1)} aria-label={lang === "uz" ? "Chapga" : lang === "en" ? "Previous" : "Назад"}>
                <Icon name="chevronRight" size={18} style={{ transform: "rotate(180deg)" }} />
              </button>
              <div className="pdp-mlk-track" ref={mayLikeRef}>
                {mayLike.map(bp => (
                  <div className="pdp-mlk-item" key={bp.id}>
                    <ProductTile product={bp} t={t} lang={lang} store={store} onOpen={pr => go("product", { id: pr.id })} buyLabel={t.buy_now} hideStock hidePriceOnRequest />
                  </div>
                ))}
              </div>
              <button type="button" className="pdp-mlk-nav pdp-mlk-nav-r" onClick={() => scrollMayLike(1)} aria-label={lang === "uz" ? "O'ngga" : lang === "en" ? "Next" : "Вперёд"}>
                <Icon name="chevronRight" size={18} />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

Object.assign(window, { ProductPage });
