/* ИНДУСТРИЯ ЗДОРОВЬЯ — product detail page */

// Detect whether a stored description is rich HTML (from the WYSIWYG editor)
// or legacy plain text, so the page can render each correctly.
function rtIsHtmlSite(s) { return /<(p|h[1-6]|ul|ol|li|strong|em|b|i|br|div)\b/i.test(String(s || "")); }

const VAT_RATE = 0.12;
const ON_REQUEST_THRESHOLD = 90000000; // дорогое капитальное оборудование — цена по запросу

function B2BPriceBlock({ p, t, lang, basePrice, oldPrice, qty, setQty, store }) {
  const onRequest = p.priceOnRequest || p.showPrice === false || !(basePrice > 0) || basePrice >= ON_REQUEST_THRESHOLD;
  const [vatExcl, setVatExcl] = useState(() => localStorage.getItem("uzmedex_vat") === "excl");
  const setVat = (excl) => { setVatExcl(excl); localStorage.setItem("uzmedex_vat", excl ? "excl" : "incl"); };
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;

  const inCart = store.cart.some((c) => c.id === p.id);
  const inWish = store.wishlist.includes(p.id);
  const inCmp  = store.compare.includes(p.id);

  /* ----- price-on-request variant ----- */
  if (onRequest) {
    return (
      <div className="pdp-buy">
        <div className="por-block">
          <div className="por-label"><Icon name="spark" size={16} />{t.price_on_request}</div>
          <div className="por-note">{t.price_on_request_note}</div>
        </div>
        <div className="pdp-actions">
          <button className="btn btn-primary" onClick={() => window.__openQuote && window.__openQuote(p)}>
            <Icon name="doc" size={20} />{t.request_quote}
          </button>
          <button className={"pdp-icact " + (inWish ? "on" : "")} title={t.wishlist} onClick={() => store.toggleWish(p.id)}>
            <Icon name={inWish ? "heartFill" : "heart"} size={22} />
          </button>
          <button className={"pdp-icact " + (inCmp ? "on" : "")} title={t.add_compare} onClick={() => store.toggleCompare(p.id)}>
            <Icon name="compare" size={22} />
          </button>
        </div>
      </div>
    );
  }

  /* ----- normal price with VAT toggle + bulk ----- */
  const unit = vatExcl ? Math.round(basePrice / (1 + VAT_RATE)) : basePrice;
  const unitOld = oldPrice ? (vatExcl ? Math.round(oldPrice / (1 + VAT_RATE)) : oldPrice) : null;

  const tiers = [
    { min: 3,  off: 0.04 },
    { min: 10, off: 0.08 },
  ];

  return (
    <div className="pdp-buy">
      <div className="vat-toggle">
        <button className={!vatExcl ? "on" : ""} onClick={() => setVat(false)}>{t.vat_incl}</button>
        <button className={vatExcl ? "on" : ""} onClick={() => setVat(true)}>{t.vat_excl}</button>
      </div>
      <div className="pdp-buy-row">
        <Price value={unit * qty} old={unitOld ? unitOld * qty : null} t={t} size="lg" />
        <div style={{ textAlign: "right" }}>
          <QtyStepper value={qty} onChange={setQty} />
          <div className="perunit">{fmtPrice(unit)} {t.currency} {t.per_unit}</div>
        </div>
      </div>
      <div className="vat-note">{vatExcl ? "—" : t.vat_note}</div>

      {/* bulk pricing */}
      <div className="bulk-block">
        <div className="bulk-title">{t.bulk_title}</div>
        <div className="bulk-tiers">
          {tiers.map((tr, i) => {
            const bp = Math.round(unit * (1 - tr.off));
            const active = qty >= tr.min;
            return (
              <button key={i} className={"bulk-tier " + (active ? "on" : "")} onClick={() => setQty(tr.min)}>
                <span className="bt-qty">{t.bulk_from} {tr.min} {t.bulk_unit}</span>
                <span className="bt-price">{fmtPrice(bp)} {t.currency}</span>
                <span className="bt-save">−{Math.round(tr.off * 100)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pdp-actions">
        <button className={"btn " + (inCart ? "btn-dark" : "btn-primary")} onClick={() => store.addToCart(p.id, qty)}>
          <Icon name={inCart ? "check" : "cart"} size={20} />
          {inCart ? t.in_cart : t.add_to_cart}
        </button>
        <button className="btn btn-ghost" onClick={() => window.__openQuote && window.__openQuote(p)}>
          {t.request_quote}
        </button>
        <button className={"pdp-icact " + (inWish ? "on" : "")} title={t.wishlist} onClick={() => store.toggleWish(p.id)}>
          <Icon name={inWish ? "heartFill" : "heart"} size={22} />
        </button>
        <button className={"pdp-icact " + (inCmp ? "on" : "")} title={t.add_compare} onClick={() => store.toggleCompare(p.id)}>
          <Icon name="compare" size={22} />
        </button>
      </div>
      <NotifyAvailable t={t} lang={lang} product={p} />
    </div>
  );
}

function PdpGuarantees({ t }) {
  return (
    <div className="pdp-guarantees">
      <div className="pdp-g"><span className="pg-ic"><Icon name="shield" size={20} /></span>{t.g_warranty}</div>
      <div className="pdp-g"><span className="pg-ic"><Icon name="award" size={20} /></span>{t.g_original}</div>
      <div className="pdp-g"><span className="pg-ic"><Icon name="wrench" size={20} /></span>{t.g_install}</div>
      <div className="pdp-g"><span className="pg-ic"><Icon name="doc" size={20} /></span>{t.g_cert}</div>
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

  useEffect(() => { setQty(1); setThumb(0); setTab("specs"); setVariantIdx(0); window.scrollTo({ top: 0, behavior: "instant" }); rvPush(params.id); }, [params.id]);

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

  // gallery media: real images + optional YouTube video, else placeholders
  const ytId = (() => {
    const u = p.video || "";
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  })();
  const imgs = (p.images && p.images.length) ? p.images : (p.img ? [p.img] : []);
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
          <div className="pdp-thumbs">
            {hasMedia
              ? media.map((m, i) => (
                  <div key={i} className={"pdp-thumb " + (thumb === i ? "on" : "")} onClick={() => setThumb(i)}>
                    {m.type === "video"
                      ? <div className="pdp-thumb-vid"><Icon name="play" size={22} /></div>
                      : <img src={m.src} alt="" />}
                  </div>
                ))
              : [0, 1, 2].map((i) => (
                  <div key={i} className={"pdp-thumb " + (thumb === i ? "on" : "")} onClick={() => setThumb(i)}>
                    <ProductPlaceholder product={p} t={t} lang={lang} big />
                  </div>
                ))}
          </div>
        </div>

        <div className="pdp-info">
          <div className="pdp-tags">
            <Badge kind={p.badge} t={t} />
            <StockTag stock={p.stock} t={t} />
            <div className="view-counter"><Icon name="eye" size={15} style={{color:"var(--amber-600,#c87f15)"}}/><span>{lang==="uz"?`${viewers} kishi ko'rmoqda`:lang==="en"?`${viewers} people viewing`:`Смотрят ${viewers} человека`}</span></div>
            <span className="pdp-sku">{t.sku} {p.sku}</span>
            <span className="pdp-rating"><Icon name="star" size={15} style={{ fill: "currentColor" }} /> 4.8</span>
          </div>
          <h1>{name}</h1>
          {(p.extraCats||[]).length > 0 && (
            <div className="pdp-also-in">
              <span>{t.also_in}:</span>
              {(p.extraCats||[]).map((ec, i) => {
                const c2 = window.DATA.CATEGORIES.find(c => c.id === ec.cat);
                const s2 = c2?.subs?.[ec.sub];
                if (!c2) return null;
                return (
                  <a key={i} className="pdp-cat-tag" onClick={() => go("catalog", {cat:ec.cat, sub:ec.sub})}>
                    {tri(lang, c2.ru, c2.uz, c2.en)}{s2 ? ` / ${tri(lang, s2.ru, s2.uz, s2.en)}` : ""}
                  </a>
                );
              })}
            </div>
          )}

          <div className="pdp-quick">
            <div className="pq"><Icon name="award" size={16} style={{ color: "var(--blue-600)" }} /><span>{t.spec_brand}: <b>{brand.name}</b></span></div>
            <div className="pq"><Icon name="pin" size={16} style={{ color: "var(--blue-600)" }} /><span>{t.spec_country}: <b>{tri(lang, brand.country_ru, brand.country_uz, brand.country_en)}</b></span></div>
            <div className="pq"><Icon name="grid" size={16} style={{ color: "var(--blue-600)" }} /><span>{lang==="uz"?"Toifa":lang==="en"?"Category":"Категория"}: <b><a onClick={() => go("catalog", { cat: cat.id })} style={{cursor:"pointer",color:"var(--blue-600)"}}>{tri(lang, cat.ru, cat.uz, cat.en)}</a></b></span></div>
            <div className="pq"><Icon name="chevronRight" size={16} style={{ color: "var(--blue-600)" }} /><span>{lang==="uz"?"Subkategoriya":lang==="en"?"Subcategory":"Подкатегория"}: <b><a onClick={() => go("catalog", { cat: cat.id, sub: p.sub })} style={{cursor:"pointer",color:"var(--blue-600)"}}>{tri(lang, sub.ru, sub.uz, sub.en)}</a></b></span></div>
            {(() => {
              const DD = window.DIRECTIONS_DATA;
              const dirIds = DD && DD.PRODUCT_DIR_MAP ? (DD.PRODUCT_DIR_MAP[p.id] || []) : [];
              if (!dirIds.length) return null;
              const d0 = DD.getDirById(dirIds[0]);
              if (!d0) return null;
              return <div className="pq"><Icon name="pulse" size={16} style={{ color: "var(--blue-600)" }} /><span>{lang==="uz"?"Yoʻnalish":lang==="en"?"Direction":"Направление"}: <b><a onClick={() => go("catalog", { dir: d0.id })} style={{cursor:"pointer",color:"var(--blue-600)"}}>{tri(lang, d0.ru, d0.uz, d0.en)}</a></b></span></div>;
            })()}
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
          <B2BPriceBlock p={p} t={t} lang={lang} basePrice={effectivePrice} oldPrice={effectiveOld} qty={qty} setQty={setQty} store={store} />
        </div>
      </div>

      {/* tabs */}
      <div className="tabs">
        {[["desc", t.tab_desc], ["specs", t.tab_specs]].concat(p.kit && p.kit.length > 0 ? [["kit", t.tab_kit]] : []).concat([["delivery", t.tab_delivery], ["docs", t.tab_docs]]).map(([id, label]) => (
          <button key={id} className={"tab " + (tab === id ? "on" : "")} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      <div className="tab-body">
        {tab === "desc" && (
          (p.descFull || p.descShort)
            ? <div className="pdp-desc-rich">
                {p.descShort && <p className="pdp-desc-lead">{p.descShort}</p>}
                {p.descFull && (
                  rtIsHtmlSite(p.descFull)
                    ? <div className="pdp-desc-html" dangerouslySetInnerHTML={{ __html: p.descFull }} />
                    : p.descFull.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
                )}
              </div>
            : null
        )}
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

      {/* recently viewed */}
      <RecentlyViewed t={t} lang={lang} store={store} go={go} excludeId={p.id} />

      {/* related */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="sec-head"><h2 style={{ fontSize: 24 }}>{t.related}</h2></div>
        <div className="grid-4">
          {related.map((rp) => (
            <ProductCard key={rp.id} product={rp} t={t} lang={lang} store={store} onOpen={(pr) => go("product", { id: pr.id })} />
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { ProductPage });
