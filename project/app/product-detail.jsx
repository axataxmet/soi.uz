/* ИНДУСТРИЯ ЗДОРОВЬЯ — product detail page */

// Detect whether a stored description is rich HTML (from the WYSIWYG editor)
// or legacy plain text, so the page can render each correctly.
function rtIsHtmlSite(s) { return /<(p|h[1-6]|ul|ol|li|strong|em|b|i|br|div)\b/i.test(String(s || "")); }

const VAT_RATE = 0.12;
const ON_REQUEST_THRESHOLD = 90000000; // дорогое капитальное оборудование — цена по запросу

/* Карточка товара сделана по образцу medcomp.ru: минимальный блок покупки
   без опта, переключателя НДС и второстепенных кнопок (wishlist/compare/КП) —
   только статус НДС, цена, количество и «Купить». */
function B2BPriceBlock({ p, t, lang, basePrice, qty, setQty, store }) {
  const onRequest = p.priceOnRequest || p.showPrice === false || !(basePrice > 0) || basePrice >= ON_REQUEST_THRESHOLD;
  const inCart = store.cart.some((c) => c.id === p.id);
  const inWish = store.wishlist.includes(p.id);
  const wishBtn = (
    <button className={"pdp-wish-btn " + (inWish ? "on" : "")} title={t.wishlist} onClick={() => store.toggleWish(p.id)}>
      <Icon name={inWish ? "heartFill" : "heart"} size={20} />
    </button>
  );

  if (onRequest) {
    return (
      <div className="pdp-buy">
        <div className="por-block">
          <div className="por-label"><Icon name="spark" size={16} />{t.price_on_request}</div>
          <div className="por-note">{t.price_on_request_note}</div>
        </div>
        <div className="pdp-buy-row">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.__openQuote && window.__openQuote(p)}>
            <Icon name="doc" size={20} />{t.request_quote}
          </button>
          {wishBtn}
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-buy">
      <div className="pdp-buy-status">
        <span className="pdp-instock">{t.in_stock || "В наличии"}</span>
        <span className="pdp-vat-static">{t.vat_excl}</span>
      </div>
      <div className="pdp-price-lg"><Price value={basePrice} t={t} size="lg" /></div>
      <div className="pdp-buy-row">
        <QtyStepper value={qty} onChange={setQty} />
        <button className={"btn btn-buy " + (inCart ? "btn-dark" : "btn-primary")} onClick={() => store.addToCart(p.id, qty)}>
          {inCart ? t.in_cart : (t.buy_now || t.add_to_cart)}
        </button>
        {wishBtn}
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
  const [variantIdx, setVariantIdx] = useState(0);
  const [fullImages, setFullImages] = useState(null);

  useEffect(() => { setQty(1); setThumb(0); setTab("specs"); setVariantIdx(0); window.scrollTo({ top: 0, behavior: "instant" }); rvPush(params.id); }, [params.id]);

  /* Список товаров грузит только главное фото (media: isMain, take 1) —
     иначе payload каталога распухает на каждую картинку каждого товара.
     Остальные фото галереи подгружаем отдельным запросом уже на карточке. */
  useEffect(() => {
    setFullImages(null);
    if (!p._remote || !window.api) return;
    let cancelled = false;
    window.api.getOne("products", p.id).then((full) => {
      if (cancelled || !full || !Array.isArray(full.media)) return;
      const urls = full.media.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((m) => m.url);
      if (urls.length > 1) setFullImages(urls);
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
    : P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const accs = P.filter(x => (p.accessories||[]).includes(x.id));
  const cons = P.filter(x => (p.consumables||[]).includes(x.id));
  // «С этим товаром покупают» — внизу страницы: сначала реальные аксессуары/расходники,
  // если для товара они не заданы — остаток из «Похожие товары», не попавший в сайдбар.
  const boughtTogether = (accs.length || cons.length) ? accs.concat(cons) : related.slice(3, 7);

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
        <button className={"pdp-cmp-link " + (inCmp ? "on" : "")} onClick={() => store.toggleCompare(p.id)}>
          <Icon name="compare" size={15} />{t.add_compare}
        </button>
      </div>

      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main-img">
            {!hasMedia ? (
              <ProductPlaceholder product={p} t={t} lang={lang} big />
            ) : cur.type === "video" ? (
              <iframe className="pdp-video" src={"https://www.youtube.com/embed/" + cur.id} title={name}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            ) : (
              <img className="pdp-photo" src={cur.src} alt={name} />
            )}
          </div>
          {media.length > 1 && (
            <div className="pdp-thumbs">
              {media.map((m, i) => (
                <div key={i} className={"pdp-thumb " + (thumb === i ? "on" : "")} onClick={() => setThumb(i)}>
                  {m.type === "video"
                    ? <div className="pdp-thumb-vid"><Icon name="play" size={22} /></div>
                    : <img src={m.src} alt="" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* краткие характеристики буллетами — как на референсе, рядом с фото */}
        <ul className="pdp-brief-specs">
          {p.specs.slice(0, 9).map((s, i) => (
            <li key={i}>{tri(lang, s.kr, s.ku, s.ke)}: {lang === "en" && s.ve ? s.ve : s.v}</li>
          ))}
          {p.regNum && <li className="pdp-brief-reg">{t.spec_reg}</li>}
        </ul>

        <div className="pdp-info">
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

          {related.length > 0 && (
            <div className="pdp-side-related">
              <div className="pdp-side-h">{lang === "uz" ? "O'xshash mahsulotlar" : lang === "en" ? "Similar products" : "Похожие товары"}</div>
              {related.slice(0, 3).map((rp) => {
                const rname = tri(lang, rp.ru, rp.uz, rp.en);
                return (
                  <div key={rp.id} className="pdp-side-card" onClick={() => go("product", { id: rp.id })}>
                    <img src={rp.img} alt="" />
                    <div className="psc-info">
                      <div className="psc-name">{rname}</div>
                      <StockTag stock={rp.stock} t={t} />
                      {rp.price ? <Price value={rp.price} t={t} /> : <span className="psc-onreq">{t.price_on_request}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* tabs */}
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
              <tr><td>{t.spec_brand}</td><td>{brand.name}</td></tr>
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
            // real documents uploaded in the admin take priority
            if (p.docFiles && p.docFiles.length > 0) {
              const typeLabel = {
                reg: dl("Регистрационное удостоверение", "Roʻyxat guvohnomasi", "Registration certificate"),
                cert: dl("Сертификат", "Sertifikat", "Certificate"),
                manual: dl("Инструкция / руководство", "Qoʻllanma", "Manual"),
                passport: dl("Паспорт изделия", "Buyum pasporti", "Device passport"),
                warranty: dl("Гарантия", "Kafolat", "Warranty"),
                other: dl("Документ", "Hujjat", "Document"),
              };
              const fmtSize = (b) => !b ? "" : b > 1e6 ? (b / 1e6).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1e3)) + " KB";
              return (
                <div>
                  {p.docFiles.map((d, i) => (
                    <div key={i} className="doc-row">
                      <span className="dr-ic"><Icon name={(d.mime || "").startsWith("image") ? "image" : "doc"} size={26} /></span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{d.title}</div>
                        <div className="dr-meta">{typeLabel[d.docType] || typeLabel.other}{d.size ? " · " + fmtSize(d.size) : ""}</div>
                      </div>
                      <a className="btn btn-ghost" href={d.src} download={d.title} target="_blank" rel="noopener">
                        <Icon name="download" size={16} />{dl("Скачать", "Yuklab olish", "Download")}
                      </a>
                    </div>
                  ))}
                </div>
              );
            }
            const hasDocs = false;
            if (!hasDocs) {
              return (
                <div className="docs-onreq">
                  <span className="dor-ic"><Icon name="doc" size={30} /></span>
                  <div className="dor-tx">
                    <div className="dor-t">{dl("Документы предоставляются по запросу", "Hujjatlar so'rov bo'yicha taqdim etiladi", "Documents are provided on request")}</div>
                    <div className="dor-d">{dl("Регистрационное удостоверение, сертификаты и паспорт изделия вышлем по вашему запросу.", "Ro'yxat guvohnomasi, sertifikatlar va buyum pasportini so'rovingiz bo'yicha yuboramiz.", "We will send the registration certificate, certificates and device passport upon your request.")}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => window.__openQuote && window.__openQuote(p)}>
                    <Icon name="doc" size={18} />{dl("Запросить документы", "Hujjatlarni so'rash", "Request documents")}
                  </button>
                </div>
              );
            }
            return (
              <div>
                {[
                  { n: dl("Регистрационное удостоверение", "Roʻyxatdan oʻtkazish guvohnomasi", "Registration certificate"), s: "PDF · 1.2 MB" },
                  { n: dl("Сертификат соответствия", "Muvofiqlik sertifikati", "Certificate of conformity"), s: "PDF · 0.8 MB" },
                  { n: dl("Руководство по эксплуатации", "Foydalanish boʻyicha qoʻllanma", "User manual"), s: "PDF · 4.6 MB" },
                  { n: dl("Паспорт изделия", "Buyum pasporti", "Device passport"), s: "PDF · 0.6 MB" },
                ].map((d, i) => (
                  <div key={i} className="doc-row">
                    <span className="dr-ic"><Icon name="doc" size={26} /></span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.n}</div>
                      <div className="dr-meta">{d.s}</div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => window.__openQuote && window.__openQuote(p)}>
                      <Icon name="download" size={16} />{dl("Скачать", "Yuklab olish", "Download")}
                    </button>
                  </div>
                ))}
                <div className="docs-foot-note">
                  <Icon name="shield" size={16} />
                  {dl("Полный комплект документов для закупки и тендера предоставляется по запросу.", "Xarid va tender uchun to'liq hujjatlar to'plami so'rov bo'yicha beriladi.", "The full document package for procurement and tenders is available on request.")}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* accessories */}
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

      {/* «С этим товаром покупают» — сопутствующие товары, опущено вниз страницы */}
      {boughtTogether.length > 0 && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="wrap">
            <div className="sec-head"><h2 style={{ fontSize: 22 }}>{t.related}</h2></div>
            <div className="grid-4">
              {boughtTogether.map(bp => (
                <ProductCard key={bp.id} product={bp} t={t} lang={lang} store={store} onOpen={pr => go("product", { id: pr.id })} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

Object.assign(window, { ProductPage });
