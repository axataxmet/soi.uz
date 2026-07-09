/* Sog'liq Industriyasi — News, Reviews, Kits, Tracking, Recently-Viewed */
const { useState: useStateX, useEffect: useEffectX } = React;

/* ============================================================
   RECENTLY VIEWED — global singleton, max 8
   ============================================================ */
const RV_KEY = "uzmedex_rv";
function rvGet() {try {return JSON.parse(localStorage.getItem(RV_KEY)) || [];} catch (e) {return [];}}
function rvPush(id) {
  const a = [id, ...rvGet().filter((x) => x !== id)].slice(0, 8);
  localStorage.setItem(RV_KEY, JSON.stringify(a));
}
function RecentlyViewed({ t, lang, store, go, excludeId }) {
  const ids = rvGet().filter((id) => id !== excludeId).slice(0, 4);
  const prods = (window.DATA?.PRODUCTS || []).filter((p) => ids.includes(p.id));
  if (!prods.length) return null;
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="sec-head"><h2 style={{ fontSize: 22 }}>{lv("Недавно просмотренные", "So\u02bbnggi ko\u02bbrilganlar", "Recently viewed")}</h2></div>
        <div className="grid-4">
          {prods.map((p) => <ProductCard key={p.id} product={p} t={t} lang={lang} store={store} onOpen={(pr) => go("product", { id: pr.id })} />)}
        </div>
      </div>
    </section>);

}

/* ============================================================
   NOTIFY WHEN AVAILABLE
   ============================================================ */
function NotifyAvailable({ t, lang, product }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [open, setOpen] = useStateX(false);
  const [sent, setSent] = useStateX(false);
  if (product.stock !== "order" && product.stock !== "preorder") return null;
  return (
    <div style={{ marginTop: 10 }}>
      {!open && !sent &&
      <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => setOpen(true)}>
          <Icon name="bell" size={17} />{lv("Сообщить о поступлении", "Kelishi haqida xabar bering", "Notify me when available")}
        </button>
      }
      {open && !sent &&
      <form style={{ display: "flex", gap: 8, marginTop: 6 }} onSubmit={(e) => {e.preventDefault();setSent(true);setOpen(false);}}>
          <input required type="email" placeholder="email@clinic.uz" className="field-input" style={{ flex: 1, height: 42, border: "1.5px solid var(--line)", borderRadius: 9, padding: "0 13px", fontSize: 14, fontFamily: "var(--font)", outline: "none" }} />
          <button type="submit" className="btn btn-primary" style={{ height: 42, flexShrink: 0 }}>{lv("Подписаться", "Obuna bo\u02bblish", "Subscribe")}</button>
        </form>
      }
      {sent &&
      <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#e7f6ef", color: "var(--success)", borderRadius: 9, padding: "10px 14px", fontSize: 13.5, fontWeight: 700 }}>
          <Icon name="check" size={16} sw={2.5} />{lv("Вы подписаны — уведомим по e-mail", "Obuna bo\u02bbldingiz — e-mail orqali xabar beramiz", "Subscribed — we'll notify by email")}
        </div>
      }
    </div>);

}

/* ============================================================
   REVIEWS WIDGET
   ============================================================ */
const REVIEW_DATA = {
  "p001": [
  { author: "Рашидов М.А.", org: "РСНПМЦ Онкологии", date: "15.05.2026", rating: 5, text: "Отличный портативный сканер. Изображение чёткое, быстрый старт, удобный интерфейс. Поставка и монтаж прошли точно в срок." },
  { author: "Каримова Д.Б.", org: "Медика Клиника", date: "02.04.2026", rating: 5, text: "Используем уже 6 месяцев. Надёжная техника Mindray, всё заявленные характеристики подтвердились на практике." }],

  "p008": [
  { author: "Юсупов Б.Р.", org: "Ташкент, ГКБ №7", date: "10.04.2026", rating: 5, text: "Аппарат Dräger полностью оправдал ожидания. Инженеры Sog'liq Industriyasi провели пусконаладку за один день и обучили персонал." }],

  "p013": [
  { author: "Мирзаев Ш.Т.", org: "СОКБ, Самарканд", date: "20.03.2026", rating: 5, text: "Автоклав Tuttnauer работает стабильно. Документация в полном порядке, регистрационное удостоверение предоставлено." },
  { author: "Ниёзова Г.К.", org: "Shifa, Ташкент", date: "05.02.2026", rating: 4, text: "Хорошее оборудование. Единственный момент — упаковка при доставке могла быть надёжнее, но сам автоклав без нареканий." }]

};
const DEFAULT_REVIEWS = [
{ author: "Хасанов А.К.", org: "Наманганская ОБ", date: "01.06.2026", rating: 5, text: "Оперативная поставка, полный пакет документов. Рекомендуем Sog'liq Industriyasi как надёжного партнёра." },
{ author: "Турсунова Н.Р.", org: "SilkMed Clinic", date: "18.05.2026", rating: 5, text: "Работаем с Sog'liq Industriyasi второй год. Цены конкурентные, менеджеры всегда на связи." }];


function StarRow({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) =>
      <Icon key={i} name="star" size={size} sw={1.5} style={{ color: i <= rating ? "#f5a623" : "#e0e5ee", fill: i <= rating ? "#f5a623" : "none" }} />
      )}
    </div>);

}

function ReviewsSection({ t, lang, productId }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const reviews = REVIEW_DATA[productId] || DEFAULT_REVIEWS;
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="rev-head">
          <div>
            <h2 style={{ fontSize: 22 }}>{lv("Отзывы клиентов", "Mijozlar sharhlari", "Client reviews")}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 800 }}>{avg}</span>
              <StarRow rating={Math.round(avg)} size={20} />
              <span style={{ color: "var(--slate-500)", fontSize: 14 }}>({reviews.length} {lv("отзыва", "sharh", "reviews")})</span>
            </div>
          </div>
        </div>
        <div className="rev-grid">
          {reviews.map((r, i) =>
          <div key={i} className="rev-card">
              <div className="rc-top"><StarRow rating={r.rating} /><span className="rc-date">{r.date}</span></div>
              <p className="rc-text">"{r.text}"</p>
              <div className="rc-author"><b>{r.author}</b> · {r.org}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---- letters of recommendation (Покупатели / Поставщики) ---- */
const RECO_LETTERS = {
  buyers: [
  { company_ru: "Наманганская областная больница", company_uz: "Namangan viloyat shifoxonasi", company_en: "Namangan Regional Hospital",
    color: "#c0392b",
    region_ru: "Наманган · госучреждение", region_uz: "Namangan · davlat", region_en: "Namangan · public",
    supplied_ru: "Оборудование для отделения диагностики", supplied_uz: "Diagnostika boʻlimi uchun uskunalar", supplied_en: "Diagnostics department equipment",
    quote_ru: "Выражаем благодарность Sog'liq Industriyasi за оперативную поставку и качественный монтаж оборудования для отделения диагностики.",
    quote_uz: "Sog'liq Industriyasi jamoasiga tez yetkazib berish va sifatli montaj uchun minnatdorchilik bildiramiz.",
    quote_en: "We thank Sog'liq Industriyasi for prompt delivery and quality installation of equipment for our diagnostics department.",
    body_ru: "Наманганская областная больница выражает искреннюю благодарность компании Sog'liq Industriyasi за многолетнее плодотворное сотрудничество. Поставленное оборудование полностью соответствует заявленным характеристикам, монтаж и пусконаладочные работы выполнены в установленные сроки. Особо отмечаем профессионализм инженерной службы и оперативность сервисной поддержки. Рекомендуем Sog'liq Industriyasi как надёжного и ответственного поставщика медицинского оборудования." },
  { company_ru: "РСНПМЦ Онкологии", company_uz: "Onkologiya RIASTM", company_en: "National Oncology Centre",
    color: "#1a5fd0",
    region_ru: "Ташкент · госучреждение", region_uz: "Toshkent · davlat", region_en: "Tashkent · public",
    supplied_ru: "Лучевая диагностика «под ключ»", supplied_uz: "Nurli diagnostika «kalit ostida»", supplied_en: "Turnkey radiology",
    quote_ru: "Комплексное оснащение отделения лучевой диагностики выполнено под ключ, с обучением персонала и полным пакетом документов.",
    quote_uz: "Nurli diagnostika bo\u02bblimi to\u02bbliq jihozlandi, xodimlar o\u02bbqitildi.",
    quote_en: "Turnkey equipping of the radiology department was completed with staff training and full documentation.",
    body_ru: "Республиканский специализированный научно-практический медицинский центр онкологии благодарит Sog'liq Industriyasi за комплексное оснащение нового отделения лучевой диагностики. Все этапы — от подбора оборудования до пусконаладки и обучения персонала — выполнены на высоком профессиональном уровне. Сроки поставки полностью соблюдены, предоставлен полный пакет регистрационных документов. Выражаем готовность к дальнейшему сотрудничеству." },
  { company_ru: "SilkMed Clinic", company_uz: "SilkMed Clinic", company_en: "SilkMed Clinic",
    color: "#15a06a",
    region_ru: "Ташкент · частная клиника", region_uz: "Toshkent · xususiy", region_en: "Tashkent · private",
    supplied_ru: "Оборудование и расходные материалы", supplied_uz: "Uskuna va sarf materiallari", supplied_en: "Equipment and consumables",
    quote_ru: "Работаем с Sog'liq Industriyasi второй год. Конкурентные цены, своевременные поставки и отзывчивая команда менеджеров.",
    quote_uz: "Sog'liq Industriyasi bilan ikkinchi yil ishlayapmiz. Raqobatbardosh narxlar va o\u02bbz vaqtida yetkazib berish.",
    quote_en: "We have worked with Sog'liq Industriyasi for two years. Competitive prices, timely deliveries and a responsive team.",
    body_ru: "Частная клиника SilkMed Clinic выражает признательность компании Sog'liq Industriyasi за стабильное и надёжное партнёрство. На протяжении двух лет мы закупаем оборудование и расходные материалы и неизменно получаем качественный сервис. Менеджеры всегда на связи, заявки обрабатываются оперативно, документация оформляется без задержек. Благодарим за профессиональный подход." }],

  suppliers: [
  { company_ru: "Mindray", company_uz: "Mindray", company_en: "Mindray", color: "#e0492f",
    quote_ru: "Mindray благодарит Sog'liq Industriyasi за надёжные и стабильные партнёрские отношения и профессиональное продвижение продукции на рынке Узбекистана.",
    quote_uz: "Mindray Sog'liq Industriyasi kompaniyasiga ishonchli hamkorlik uchun minnatdorchilik bildiradi.",
    quote_en: "Mindray thanks Sog'liq Industriyasi for reliable and stable partnership and professional promotion in the Uzbekistan market.",
    body_ru: "Компания Mindray выражает искреннюю благодарность Sog'liq Industriyasi за настоящие, надёжные и стабильные партнёрские отношения. Sog'liq Industriyasi является авторизованным дистрибьютором нашей продукции и обеспечивает высокий уровень сервисной поддержки и технического сопровождения. Ценим профессионализм команды и желаем дальнейшего успешного развития сотрудничества." },
  { company_ru: "Dräger", company_uz: "Dräger", company_en: "Dräger", color: "#0d2650",
    quote_ru: "Dräger выражает признательность коллективу Sog'liq Industriyasi за длительное и успешное сотрудничество на рынке медицинского оборудования.",
    quote_uz: "Dräger Sog'liq Industriyasi jamoasiga uzoq muddatli hamkorlik uchun minnatdorchilik bildiradi.",
    quote_en: "Dräger expresses gratitude to the Sog'liq Industriyasi team for long and successful cooperation in the medical equipment market.",
    body_ru: "Компания Dräger выражает искреннюю признательность всему коллективу Sog'liq Industriyasi за длительное успешное сотрудничество. На протяжении многих лет Sog'liq Industriyasi демонстрирует высокий профессионализм в поставках и сервисном обслуживании нашего оборудования. Благодарим за добросовестное выполнение обязательств и надеемся на продолжение плодотворного партнёрства." },
  { company_ru: "Edan", company_uz: "Edan", company_en: "Edan", color: "#1757c8",
    quote_ru: "Edan благодарит Sog'liq Industriyasi за эффективное продвижение продукции и квалифицированную сервисную поддержку клиентов.",
    quote_uz: "Edan Sog'liq Industriyasi kompaniyasiga samarali hamkorlik uchun minnatdorchilik bildiradi.",
    quote_en: "Edan thanks Sog'liq Industriyasi for effective product promotion and qualified customer service support.",
    body_ru: "Компания Edan выражает благодарность Sog'liq Industriyasi за эффективное продвижение нашей продукции на рынке Узбекистана и квалифицированную сервисную поддержку конечных потребителей. Партнёрство с Sog'liq Industriyasi отличается надёжностью, прозрачностью и взаимным уважением. Высоко ценим вклад команды и подтверждаем готовность к дальнейшему сотрудничеству." }]

};

function getRecoLetters() {
  const cms = (window.CMS && window.CMS.list("reviews")) || [];
  if (!cms.length) return RECO_LETTERS;
  const vis = cms.filter((r) => r.status !== "hidden");
  const mlv = (o) => o || { ru: "", uz: "", en: "" };
  const map = (r) => {
    const c = mlv(r.company), rg = mlv(r.region), sp = mlv(r.supplied), q = mlv(r.quote), b = mlv(r.body);
    return {
      company_ru: c.ru, company_uz: c.uz || c.ru, company_en: c.en || c.ru, color: r.color || "#1a5fd0",
      region_ru: rg.ru, region_uz: rg.uz || rg.ru, region_en: rg.en || rg.ru,
      supplied_ru: sp.ru, supplied_uz: sp.uz || sp.ru, supplied_en: sp.en || sp.ru,
      quote_ru: q.ru, quote_uz: q.uz || q.ru, quote_en: q.en || q.ru,
      body_ru: b.ru || q.ru, body_uz: b.uz || b.ru, body_en: b.en || b.ru,
      file: r.file || null,
    };
  };
  return {
    buyers: vis.filter((r) => (r.group || "buyers") === "buyers").map(map),
    suppliers: vis.filter((r) => r.group === "suppliers").map(map),
  };
}

function LetterThumb({ color, file }) {
  const isImg = file && file.data && (file.type || "").startsWith("image");
  if (isImg) {
    return (
      <div className="reco-thumb reco-thumb-img" style={{ "--lc": color }}>
        <img src={file.data} alt="" loading="lazy" />
      </div>);
  }
  const isPdf = file && file.data && /pdf/i.test(file.type || "");
  if (isPdf) {
    return (
      <div className="reco-thumb reco-thumb-pdf" style={{ "--lc": color }}>
        <iframe className="reco-thumb-frame" src={file.data + "#toolbar=0&navpanes=0&scrollbar=0&view=FitH"} title="PDF" tabIndex={-1} scrolling="no" />
        <span className="rt-pdf-badge">PDF</span>
      </div>);
  }
  return (
    <div className="reco-thumb" style={{ "--lc": color }}>
      <div className="rt-sheet">
        <div className="rt-head"><span className="rt-logo" /></div>
        <div className="rt-lines">
          {[92, 84, 88, 70, 80, 60].map((w, i) => <span key={i} style={{ width: w + "%" }} />)}
        </div>
        <div className="rt-foot"><span className="rt-stamp" /><span className="rt-sign" /></div>
      </div>
    </div>);

}

function RecoModal({ letter, lang, onClose }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const isPdf = letter.file && letter.file.data && /pdf/i.test(letter.file.type || "");
  const isImg = letter.file && letter.file.data && (letter.file.type || "").startsWith("image");
  const mode = isPdf ? " reco-modal--pdf" : isImg ? " reco-modal--img" : "";
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className={"modal reco-modal" + mode} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="x" size={20} /></button>
        <div className="reco-modal-body">
          {isPdf
            ? <iframe className="reco-modal-pdf" src={letter.file.data + "#toolbar=1&navpanes=0&view=FitH"} title={lv(letter.company_ru, letter.company_uz, letter.company_en)} />
            : isImg
              ? <img className="reco-modal-img" src={letter.file.data} alt="" style={{ "--lc": letter.color }} />
              : <div className="reco-modal-text-col">
                  <div className="reco-modal-co" style={{ color: letter.color }}>{lv(letter.company_ru, letter.company_uz, letter.company_en)}</div>
                  <p className="reco-modal-text">{lv(letter.body_ru, letter.body_uz || letter.body_ru, letter.body_en || letter.body_ru)}</p>
                </div>}
        </div>
      </div>
    </div>);

}

function HomeReviews({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [tab, setTab] = useStateX("buyers");
  const [idx, setIdx] = useStateX(0);
  const [open, setOpen] = useStateX(null);
  const RECO = getRecoLetters();
  const letters = RECO[tab] || [];
  const perView = 2;
  const maxIdx = Math.max(0, letters.length - perView);
  const clamped = Math.min(idx, maxIdx);

  const switchTab = (tb) => {setTab(tb);setIdx(0);};
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(maxIdx, i + 1));

  return (
    <section className="section reco-section">
      <div className="wrap">
        <div className="reco-head">
          <div>
            <h2 className="reco-title" onClick={() => go && go("info", { page: "about" })}>
              {lv("Отзывы", "Sharhlar", "Reviews")}<Icon name="chevronRight" size={22} />
            </h2>
            <div className="reco-sub">{lv("Благодарственные письма клиник и партнёров-производителей", "Klinikalar va ishlab chiqaruvchi hamkorlarning minnatdorchilik xatlari", "Letters of gratitude from clinics and manufacturer partners")}</div>
          </div>
          <div className="reco-tabs">
            <button className={tab === "buyers" ? "on" : ""} onClick={() => switchTab("buyers")}>{lv("Покупатели", "Xaridorlar", "Buyers")}</button>
            <button className={tab === "suppliers" ? "on" : ""} onClick={() => switchTab("suppliers")}>{lv("Поставщики", "Yetkazib beruvchilar", "Suppliers")}</button>
          </div>
        </div>

        <div className="reco-carousel">
          <button className="reco-arrow" onClick={prev} disabled={clamped === 0} aria-label="prev"><Icon name="chevronLeft" size={26} /></button>
          <div className="reco-viewport">
            <div className="reco-track" style={{ transform: `translateX(-${clamped * (100 / perView)}%)` }}>
              {letters.map((l, i) =>
              <div key={tab + i} className="reco-card">
                  <LetterThumb color={l.color} file={l.file} />
                  <div className="reco-card-body">
                    <div className="reco-co">{lv("Компания", "Kompaniya", "Company")} «{lv(l.company_ru, l.company_uz, l.company_en)}»</div>
                    {l.region_ru &&
                  <div className="reco-meta">
                        <span className="reco-meta-it"><Icon name="pin" size={12} />{lv(l.region_ru, l.region_uz, l.region_en)}</span>
                        <span className="reco-meta-it"><Icon name="box" size={12} />{lv(l.supplied_ru, l.supplied_uz, l.supplied_en)}</span>
                      </div>
                  }
                    <p className="reco-quote">{lv(l.quote_ru, l.quote_uz, l.quote_en)}</p>
                    <button className="reco-read" onClick={() => setOpen(l)}>{lv("Смотреть кейс", "Keysni ko\u02bbrish", "View case")}<Icon name="chevronRight" size={15} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button className="reco-arrow" onClick={next} disabled={clamped >= maxIdx} aria-label="next"><Icon name="chevronRight" size={26} /></button>
        </div>
      </div>
      {open && <RecoModal letter={open} lang={lang} onClose={() => setOpen(null)} />}
    </section>);

}

/* ============================================================
   NEWS PAGE + SECTION
   ============================================================ */
const NEWS_FALLBACK = [
{ id: "n1", kind: "news", date: "2026-06-10", cat_ru: "Новинки", cat_en: "New arrivals",
  title_ru: "Mindray DP-50 — новинка в каталоге портативных УЗИ", title_en: "Mindray DP-50 — new in the portable ultrasound catalog",
  body_ru: "Sog'liq Industriyasi добавил в каталог портативный УЗИ-сканер Mindray DP-50 с расширенными режимами визуализации и обновлённым интерфейсом. Доступен к заказу со склада в Ташкенте.",
  body_en: "Sog'liq Industriyasi has added the Mindray DP-50 portable ultrasound scanner with expanded imaging modes to the catalog, available from the Tashkent warehouse.",
  icon: "pulse" },
{ id: "n2", kind: "news", date: "2026-05-28", cat_ru: "Тендеры", cat_en: "Tenders",
  title_ru: "Поставка оборудования для РСНПМЦ Онкологии на 2,1 млрд сум", title_en: "Equipment supply for the National Oncology Centre: 2.1B UZS",
  body_ru: "Sog'liq Industriyasi выиграл тендер на комплексное оснащение нового отделения лучевой диагностики Республиканского специализированного научно-практического медицинского центра онкологии.",
  body_en: "Sog'liq Industriyasi won the tender for turnkey equipping of the new diagnostic imaging department at the Republican Specialized Scientific-Practical Medical Centre of Oncology.",
  icon: "award" },
{ id: "n3", kind: "article", date: "2026-05-14", cat_ru: "Статья", cat_en: "Article",
  title_ru: "Как выбрать автоклав для стоматологической клиники", title_en: "How to choose an autoclave for a dental clinic",
  body_ru: "Разбираем классы стерилизаторов (N, S, B), требования СанПиН и критерии выбора оборудования для dental-кабинетов различной пропускной способности.",
  body_en: "We break down sterilizer classes (N, S, B), sanitary requirements, and selection criteria for dental offices of various capacities.",
  icon: "shield-cross" },
{ id: "n4", kind: "article", date: "2026-04-30", cat_ru: "Сервис", cat_en: "Service",
  title_ru: "Плановое ТО: почему это важнее, чем кажется", title_en: "Planned maintenance: why it matters more than you think",
  body_ru: "Медицинское оборудование требует регулярного технического обслуживания. Рассказываем, что входит в плановое ТО и как составить контракт с сервисным центром.",
  body_en: "Medical equipment requires regular maintenance. We explain what planned servicing includes and how to set up a service contract.",
  icon: "wrench" },
{ id: "n5", kind: "news", date: "2026-04-15", cat_ru: "Новинки", cat_en: "New arrivals",
  title_ru: "Dräger Oxylog 3000+ — транспортный ИВЛ для скорой помощи", title_en: "Dräger Oxylog 3000+ — transport ventilator for emergency care",
  body_ru: "Транспортный аппарат ИВЛ Dräger Oxylog 3000+ теперь доступен под заказ. Режимы IPPV, SIMV, CPAP, автономная работа до 4 часов.",
  body_en: "The Dräger Oxylog 3000+ transport ventilator is now available on order. IPPV, SIMV, CPAP modes, up to 4 hours battery life.",
  icon: "ventilator" },
{ id: "n6", kind: "news", date: "2026-03-28", cat_ru: "Компания", cat_en: "Company",
  title_ru: "Sog'liq Industriyasi открыл новый склад в Ташкенте площадью 3 000 м²", title_en: "Sog'liq Industriyasi opens new 3,000 m² warehouse in Tashkent",
  body_ru: "Расширение складских мощностей позволит сократить сроки поставки по Ташкенту до 1 рабочего дня и увеличить запасы наиболее востребованных позиций.",
  body_en: "Expanding warehouse capacity will reduce Tashkent delivery times to 1 business day and increase stock of the most popular items.",
  icon: "package" },
{ id: "n7", kind: "article", date: "2026-03-12", cat_ru: "Гайд", cat_en: "Guide",
  title_ru: "Чек-лист оснащения процедурного кабинета", title_en: "Treatment room equipping checklist",
  body_ru: "Собрали полный перечень оборудования, мебели и расходников для процедурного кабинета — с учётом требований СанПиН и рекомендаций по эргономике.",
  body_en: "A complete checklist of equipment, furniture and consumables for a treatment room, aligned with sanitary requirements and ergonomics.",
  icon: "doc" },
{ id: "n8", kind: "article", date: "2026-02-26", cat_ru: "Гайд", cat_en: "Guide",
  title_ru: "СИЗ и расходники: как рассчитать месячный запас", title_en: "PPE & consumables: how to plan a monthly stock",
  body_ru: "Простая методика расчёта потребности в перчатках, масках и расходных материалах исходя из проходимости отделения.",
  body_en: "A simple method to estimate gloves, masks and consumables based on your department’s patient flow.",
  icon: "package" }];


// Unified source: read "Новости и публикации" from the CMS, mapped to the catalog card shape.
function getCatalogNews() {
  const cms = window.CMS && window.CMS.list("news") || null;
  if (cms && cms.length) {
    const CATS = window.SOI_CORE && window.SOI_CORE.NEWS_CATEGORIES || [];
    const catOf = (type) => {const ty = type === "news" ? "new" : type || "new";return CATS.find((c) => c.id === ty) || { ru: "Новости", uz: "Yangiliklar", en: "News" };};
    return cms.
    filter((n) => n.published !== false).
    sort((a, b) => (b.date || "").localeCompare(a.date || "")).
    map((n) => {
      const c = catOf(n.type);
      const cu = !n.cover ? "" : (typeof n.cover === "string" ? n.cover : (n.cover.data || n.cover.url || n.cover.src || ""));
      return {
        id: n.id, kind: n.type === "article" || n.type === "guide" ? "article" : "news", type: n.type,
        date: (n.date || "").split("-").reverse().join("."), tags: n.tags || [], cover: cu,
        cat_ru: c.ru, cat_uz: c.uz, cat_en: c.en,
        title_ru: n.title && n.title.ru || "", title_uz: n.title && n.title.uz || "", title_en: n.title && n.title.en || n.title && n.title.ru || "",
        body_ru: n.excerpt && n.excerpt.ru || n.body && n.body.ru || "", body_en: n.excerpt && n.excerpt.en || n.body && n.body.en || n.excerpt && n.excerpt.ru || "",
        icon: "spark"
      };});
  }
  return NEWS_FALLBACK;
}

function NewsPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [cat, setCat] = useStateX("all");
  const NEWS = getCatalogNews();
  const cats = [...new Set(NEWS.map((n) => lang === "en" ? n.cat_en : n.cat_ru))];
  const filtered = cat === "all" ? NEWS : NEWS.filter((n) => (lang === "en" ? n.cat_en : n.cat_ru) === cat);

  return (
    <div className="wrap" style={{ padding: "8px 0 64px" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{lv("Новости", "Yangiliklar", "News")}</span>
      </div>
      <div className="news-layout">
        <div>
          <div className="sec-head" style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.02em" }}>{lv("Новости и статьи", "Yangiliklar va maqolalar", "News & Articles")}</h1>
          </div>
          <div className="news-cats">
            <button className={"nc " + (cat === "all" ? "on" : "")} onClick={() => setCat("all")}>{lv("Все", "Barchasi", "All")}</button>
            {cats.map((c) => <button key={c} className={"nc " + (cat === c ? "on" : "")} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="news-list">
            {filtered.map((n) =>
            <div key={n.id} className="news-card">
                <div className="nc-ic"><Icon name={n.icon in (window.ICONS || {}) ? n.icon : "spark"} size={28} /></div>
                <div className="nc-body">
                  <div className="nc-meta">
                    <span className="nc-cat">{lang === "en" ? n.cat_en : n.cat_ru}</span>
                    <span className="nc-date">{n.date}</span>
                  </div>
                  <h3 className="nc-title">{lang === "en" ? n.title_en : n.title_ru}</h3>
                  <p className="nc-text">{lang === "en" ? n.body_en : n.body_ru}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <aside className="news-side">
          <div className="info-side-card">
            <h4>{lv("Подписка на новости", "Yangiliklarga obuna", "Subscribe to news")}</h4>
            <p style={{ marginBottom: 14 }}>{lv("Раз в месяц — обзор новинок, тендеров и акций.", "Oyda bir marta — yangiliklar sharhi.", "Monthly digest of new products, tenders and deals.")}</p>
            <form style={{ display: "flex", flexDirection: "column", gap: 8 }} onSubmit={(e) => {e.preventDefault();}}>
              <input required type="email" placeholder="email@clinic.uz" style={{ height: 42, border: "1.5px solid var(--line)", borderRadius: 9, padding: "0 13px", fontSize: 14, fontFamily: "var(--font)", outline: "none" }} />
              <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>{lv("Подписаться", "Obuna bo\u02bblish", "Subscribe")}</button>
            </form>
          </div>
          <div className="info-side-card" style={{ marginTop: 16 }}>
            <h4>{lv("Популярные статьи", "Mashhur maqolalar", "Popular articles")}</h4>
            {NEWS.slice(2, 5).map((n, i) =>
            <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5, fontWeight: 600, lineHeight: 1.4, cursor: "pointer", color: "var(--blue-700)" }}>
                {lang === "en" ? n.title_en : n.title_ru}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>);

}

function NewsHomeModal({ item, lang, onClose }) {
  if (!item) return null;
  const n = item;
  const cat = lang === "en" ? (n.cat_en || n.cat_ru) : n.cat_ru;
  const title = lang === "en" ? (n.title_en || n.title_ru) : n.title_ru;
  const body = (lang === "en" ? (n.body_en || n.body_ru) : n.body_ru) || "";
  const cover = n.cover ? (typeof n.cover === "string" ? n.cover : (n.cover.data || n.cover.src)) : null;
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal news-home-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="close"><Icon name="x" size={20} /></button>
        {cover
          ? <div className="nhm-cover"><img src={cover} alt={title} /></div>
          : <div className="nhm-cover nhm-cover-ic"><Icon name={n.icon in (window.ICONS || {}) ? n.icon : "spark"} size={40} /></div>}
        <div className="nhm-body">
          <div className="nhm-meta">{cat}{n.date ? " · " + n.date : ""}</div>
          <h2 className="nhm-title">{title}</h2>
          <div className="nhm-text">{body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
      </div>
    </div>);
}

function NewsSection({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [preview, setPreview] = React.useState(null);
  const items = getCatalogNews().filter((n) => n.type !== "article").slice(0, 3);
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 data-comment-anchor="0d0ab5af39-h2-400-13">{lv("Новости", "Yangiliklar", "News")}</h2>
            <div className="sub">{lv("Поставки, тендеры и события компании Sog'liq Industriyasi", "Sog'liq Industriyasi yetkazib berishlari, tenderlar va voqealari", "Deliveries, tenders and company updates")}</div>
          </div>
          <button className="btn btn-ghost" onClick={() => go("news", {})}>{t.view_all}<Icon name="arrowRight" size={16} /></button>
        </div>
        <div className="news-home-grid">
          {items.map((n) =>
          <div key={n.id} className="nhg-card" onClick={() => setPreview(n)} style={{ cursor: "pointer" }}>
              <div className="nhg-ic"><Icon name={n.icon in (window.ICONS || {}) ? n.icon : "spark"} size={22} /></div>
              <div className="nhg-cat">{lang === "en" ? n.cat_en : n.cat_ru} · {n.date}</div>
              <h3 className="nhg-title">{lang === "en" ? n.title_en : n.title_ru}</h3>
              <p className="nhg-text">{(lang === "en" ? n.body_en : n.body_ru).slice(0, 100)}…</p>
            </div>
          )}
        </div>
      </div>
      <NewsHomeModal item={preview} lang={lang} onClose={() => setPreview(null)} />
    </section>);

}

function ArticlesSection({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [preview, setPreview] = React.useState(null);
  const items = getCatalogNews().filter((n) => n.type === "article").slice(0, 3);
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <h2 data-comment-anchor="36e73b5fe9-h2-428-13">{lv("Статьи", "Maqolalar", "Articles")}</h2>
            <div className="sub">{lv("Гайды по выбору, эксплуатации и сервису медтехники", "Tibbiy texnikani tanlash va xizmat ko\u02bbrsatish bo\u02bbyicha qo\u02bbllanmalar", "Guides on choosing, operating and servicing equipment")}</div>
          </div>
          <button className="btn btn-ghost" onClick={() => go("news", {})}>{t.view_all}<Icon name="arrowRight" size={16} /></button>
        </div>
        <div className="news-home-grid">
          {items.map((n) =>
          <div key={n.id} className="nhg-card" onClick={() => setPreview(n)} style={{ cursor: "pointer" }}>
              <div className="nhg-ic"><Icon name={n.icon in (window.ICONS || {}) ? n.icon : "spark"} size={22} /></div>
              <div className="nhg-cat">{lang === "en" ? n.cat_en : n.cat_ru} · {n.date}</div>
              <h3 className="nhg-title">{lang === "en" ? n.title_en : n.title_ru}</h3>
              <p className="nhg-text">{(lang === "en" ? n.body_en : n.body_ru).slice(0, 100)}…</p>
            </div>
          )}
        </div>
      </div>
      <NewsHomeModal item={preview} lang={lang} onClose={() => setPreview(null)} />
    </section>);

}

/* ============================================================
   TURNKEY KITS PAGE
   ============================================================ */
const KITS = [
{ id: "k1", icon: "scalpel", color: "#1a5fd0",
  title_ru: "Операционный блок", title_en: "Operating suite",
  desc_ru: "Полное оснащение операционной: стол, наркозный аппарат, монитор, ИВЛ, светильники, электрохирургия, стерилизатор.",
  desc_en: "Full OR equipping: table, anesthesia machine, monitor, ventilator, lights, electrosurgery, sterilizer.",
  items_ru: ["Операционный стол Armed ST-III", "Наркозный аппарат Comen AX-600", "Монитор пациента Comen C60", "Аппарат ИВЛ Dräger Savina 300", "Светильник Midmark LED-720", "Электрохирургия BMT ESU-300", "Автоклав Tuttnauer 3870EA"],
  sum: 712000000, time_ru: "14–21 рабочих день", time_en: "14–21 working days" },
{ id: "k2", icon: "pulse", color: "#18b4e0",
  title_ru: "Отделение функциональной диагностики", title_en: "Functional diagnostics unit",
  desc_ru: "Кабинет УЗИ, ЭКГ, мониторинг. Всё оборудование с регистрационными удостоверениями.",
  desc_en: "Ultrasound, ECG and monitoring room. All equipment with registration certificates.",
  items_ru: ["УЗИ-сканер Edan Acclarix AX8", "ЭКГ-аппарат Edan SE-1201", "Монитор Comen C60 × 3", "Тонометры Armed × 5", "Пульсоксиметры ChoiceMMed × 5"],
  sum: 284000000, time_ru: "7–10 рабочих дней", time_en: "7–10 working days" },
{ id: "k3", icon: "shield-cross", color: "#15a06a",
  title_ru: "Стерилизационное отделение (ЦСО)", title_en: "Central sterile services dept.",
  desc_ru: "Полный цикл стерилизации: паровые автоклавы, сухожар, ультразвуковые мойки, УФ-облучатели.",
  desc_en: "Full sterilization cycle: steam autoclaves, dry heat, ultrasonic cleaners, UV lamps.",
  items_ru: ["Автоклав Tuttnauer 3870EA", "Стерилизатор BMT Sterivap 23 л", "УЗ-мойка BMT UC-10 × 2", "Шкаф сухожаровой Armed ГП-80", "Рециркулятор Armed CH-215 × 2", "Облучатель Armed ОБН-150 × 3"],
  sum: 168000000, time_ru: "5–7 рабочих дней", time_en: "5–7 working days" },
{ id: "k4", icon: "cross-pulse", color: "#e0492f",
  title_ru: "Машина скорой помощи", title_en: "Emergency ambulance kit",
  desc_ru: "Полная комплектация реанимобиля: ИВЛ транспортный, дефибриллятор, монитор, укладки, кислородный модуль.",
  desc_en: "Full paramedic vehicle kit: transport ventilator, defibrillator, monitor, medical bags, oxygen module.",
  items_ru: ["Дефибриллятор Mindray BeneHeart D6", "Транспортный ИВЛ Dräger Oxylog 3000+", "Монитор Comen C60", "Набор реанимационный Armed НР-01", "Укладка врача Armed УМСП-01", "Носилки Armed НТ-04"],
  sum: 299000000, time_ru: "7–14 рабочих дней", time_en: "7–14 working days" }];


function KitsPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [sel, setSel] = useStateX(null);

  return (
    <div className="wrap" style={{ padding: "8px 0 64px" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{lv("Комплекты под ключ", "Kompleks jihozlash", "Turnkey kits")}</span>
      </div>
      <div className="sec-head" style={{ marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.02em" }}>{lv("Комплексное оснащение", "Kompleks jihozlash", "Turnkey equipping")}</h1>
          <div className="sub" style={{ marginTop: 6 }}>{lv("Готовые комплекты оборудования для отделений и кабинетов", "Bo\u02bblimlar va kabinetlar uchun tayyor uskunalar to\u02bbplamlari", "Ready equipment packages for departments and offices")}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(460px,1fr))", gap: 22 }}>
        {KITS.map((k) =>
        <div key={k.id} className="kit-card" onClick={() => setSel(k === sel ? null : k)}>
            <div className="kc-head" style={{ borderLeft: `4px solid ${k.color}` }}>
              <div className="kc-ic" style={{ background: k.color + "18", color: k.color }}><Icon name={k.icon} size={26} /></div>
              <div>
                <h3 className="kc-title">{lang === "en" ? k.title_en : k.title_ru}</h3>
                <p className="kc-desc">{lang === "en" ? k.desc_en : k.desc_ru}</p>
              </div>
            </div>
            <div className="kc-meta">
              <div className="kc-sum">
                <div className="kcs-from">{t.from}</div>
                <div className="kcs-val">{fmtPrice(k.sum)}</div>
                <div className="kcs-cur">{t.currency}</div>
              </div>
              <div className="kc-time"><Icon name="truck" size={15} style={{ color: "var(--slate-400)" }} />{lang === "en" ? k.time_en : k.time_ru}</div>
            </div>
            {sel?.id === k.id &&
          <div className="kc-items">
                {k.items_ru.map((item, i) =>
            <div key={i} style={{ display: "flex", gap: 9, padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                    <Icon name="check" size={15} sw={2.5} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </div>
            )}
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={(e) => {e.stopPropagation();window.__openQuote && window.__openQuote();}}>
                  <Icon name="doc" size={17} />{lv("Запросить КП на комплект", "Komplekt uchun KP so\u02bbra", "Get a quote for this kit")}
                </button>
              </div>
          }
          </div>
        )}
      </div>

      <div className="ctaband" style={{ marginTop: 48 }}>
        <div className="cb-grid" />
        <div className="cb-l" style={{ position: "relative" }}>
          <h2>{lv("Нужен индивидуальный проект?", "Individual loyiha kerakmi?", "Need a custom project?")}</h2>
          <p>{lv("Разработаем спецификацию и КП под любой бюджет и техническое задание.", "Har qanday byudjet va texnik topshiriq uchun spetsifikatsiya va KP ishlab chiqamiz.", "We'll develop a specification and quote for any budget and technical requirement.")}</p>
        </div>
        <div className="cb-r" style={{ position: "relative" }}>
          <button className="btn btn-cyan btn-lg" onClick={() => window.__openQuote && window.__openQuote()}>
            {t.cta_btn}<Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </div>);

}

/* ============================================================
   ORDER TRACKING WIDGET
   ============================================================ */
const TRACK_DATA = {
  "ORD-2026-037": { client: "НОБ, Наманган", status: "shipped", date: "2026-06-09", items: [{ name: "УЗИ-сканер Mindray DP-50", qty: 1 }], steps: [{ s: "new", d: "2026-06-02" }, { s: "processing", d: "2026-06-05" }, { s: "shipped", d: "2026-06-09" }, { s: "completed", d: null }] },
  "ORD-2026-036": { client: "ФГМБ, Фергана", status: "shipped", date: "2026-06-07", items: [{ name: "Дефибриллятор Mindray BeneHeart D6", qty: 1 }], steps: [{ s: "new", d: "2026-06-01" }, { s: "processing", d: "2026-06-03" }, { s: "shipped", d: "2026-06-07" }, { s: "completed", d: null }] },
  "ORD-2026-039": { client: "СОКБ, Самарканд", status: "processing", date: "2026-06-05", items: [{ name: "Автоклав Tuttnauer 3870EA", qty: 1 }], steps: [{ s: "new", d: "2026-06-04" }, { s: "processing", d: "2026-06-05" }, { s: "shipped", d: null }, { s: "completed", d: null }] }
};

function TrackingPage({ t, lang, go }) {
  const lv = (ru, uz, en) => lang === "uz" ? uz : lang === "en" ? en : ru;
  const [q, setQ] = useStateX("");
  const [res, setRes] = useStateX(null);
  const [notFound, setNotFound] = useStateX(false);

  const STATUS_STEPS = ["new", "processing", "shipped", "completed"];
  const STATUS_LABELS = {
    new: lv("Принята", "Qabul qilindi", "Received"),
    processing: lv("В работе", "Ishda", "Processing"),
    shipped: lv("Отгружено", "Jo\u02bbnatildi", "Shipped"),
    completed: lv("Доставлено", "Yetkazildi", "Delivered")
  };
  const STATUS_ICONS = { new: "check", processing: "wrench", shipped: "truck", completed: "award" };

  const search = (e) => {
    e.preventDefault();
    const found = TRACK_DATA[q.trim().toUpperCase()] || TRACK_DATA["ORD-2026-037"];
    if (found) {setRes({ id: q.trim().toUpperCase() || "ORD-2026-037", ...found });setNotFound(false);} else
    {setRes(null);setNotFound(true);}
  };

  const stepIdx = res ? STATUS_STEPS.indexOf(res.status) : -1;

  return (
    <div className="wrap" style={{ padding: "8px 0 64px", maxWidth: 700, margin: "0 auto" }}>
      <div className="crumb">
        <a onClick={() => go("home")}>{t.breadcrumb_home}</a>
        <Icon name="chevronRight" size={14} />
        <span className="cur">{lv("Отслеживание заявки", "Ariza holati", "Track request")}</span>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 8px" }}>{lv("Отследить заявку", "Ariza holatini kuzatish", "Track your request")}</h1>
      <p style={{ fontSize: 15, color: "var(--slate-500)", marginBottom: 28 }}>{lv("Введите номер заявки — без входа в личный кабинет", "Ariza raqamini kiriting — kabinetsiz", "Enter your request number — no sign-in required")}</p>

      <form onSubmit={search} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ORD-2026-037" className="adm-inp"
        style={{ flex: 1, height: 52, border: "1.5px solid var(--line)", borderRadius: 12, padding: "0 18px", fontSize: 16, fontFamily: "var(--font)", outline: "none", fontFamily: "var(--mono)" }} />
        <button type="submit" className="btn btn-primary btn-lg" style={{ height: 52, flexShrink: 0 }}>
          <Icon name="search" size={18} />{lv("Найти", "Qidirish", "Search")}
        </button>
      </form>
      <div style={{ fontSize: 13, color: "var(--slate-400)", marginTop: -20, marginBottom: 28 }}>{lv("Пример: ORD-2026-037 (попробуйте этот номер)", "Misol: ORD-2026-037", "Example: ORD-2026-037 (try this number)")}</div>

      {notFound &&
      <div style={{ background: "#fdecea", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontWeight: 700 }}>
          <Icon name="x" size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />{lv("Заявка не найдена. Проверьте номер.", "Ariza topilmadi. Raqamni tekshiring.", "Request not found. Please check the number.")}
        </div>
      }

      {res &&
      <div className="track-card">
          <div className="trk-head">
            <div>
              <div className="trk-num mono">{res.id}</div>
              <div style={{ color: "var(--slate-500)", fontSize: 14 }}>{res.client}</div>
            </div>
            <span className={"adm-badge dot " + res.status}>{STATUS_LABELS[res.status] || res.status}</span>
          </div>

          {/* progress steps */}
          <div className="trk-steps">
            {STATUS_STEPS.map((s, i) => {
            const done = i <= stepIdx;
            const active = i === stepIdx;
            return (
              <div key={s} className="trk-step">
                  <div className={"trk-dot " + (done ? "done" : "") + (active ? " active" : "")}><Icon name={STATUS_ICONS[s]} size={14} sw={2.2} /></div>
                  {i < STATUS_STEPS.length - 1 && <div className={"trk-line " + (i < stepIdx ? "done" : "")} />}
                  <div className="trk-s-label">{STATUS_LABELS[s]}</div>
                  {res.steps[i]?.d && <div className="trk-s-date mono">{res.steps[i].d}</div>}
                </div>);

          })}
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--slate-400)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>{lv("Позиции", "Pozitsiyalar", "Items")}</div>
            {res.items.map((it, i) =>
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontWeight: 600 }}>{it.name}</span>
                <span style={{ color: "var(--slate-500)" }}>{it.qty} {lv("шт.", "ta", "pcs.")}</span>
              </div>
          )}
          </div>

          <div style={{ marginTop: 18, background: "var(--bg-2)", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "var(--slate-600)" }}>
            <Icon name="phone" size={15} style={{ verticalAlign: "middle", marginRight: 8, color: "var(--blue-600)" }} />
            {lv("По вопросам доставки: ", "Yetkazish bo'yicha savollar: ", "Delivery questions: ")}
            <a href="tel:+998772250001" style={{ fontWeight: 800, color: "var(--blue-700)" }}>+998 (77) 225-00-01</a>
          </div>
        </div>
      }
    </div>);

}

Object.assign(window, {
  RecentlyViewed, rvPush, NotifyAvailable,
  ReviewsSection, HomeReviews, StarRow,
  NewsPage, NewsSection, ArticlesSection,
  KitsPage,
  TrackingPage
});