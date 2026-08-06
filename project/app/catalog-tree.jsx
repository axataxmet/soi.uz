/* ИНДУСТРИЯ ЗДОРОВЬЯ — News, Reviews, Kits, Tracking, Recently-Viewed */
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
      <div style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--line-2)", color: "var(--success)", borderRadius: 9, padding: "10px 14px", fontSize: 13.5, fontWeight: 700 }}>
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
  { author: "Юсупов Б.Р.", org: "Ташкент, ГКБ №7", date: "10.04.2026", rating: 5, text: "Аппарат Dräger полностью оправдал ожидания. Инженеры ИНДУСТРИЯ ЗДОРОВЬЯ провели пусконаладку за один день и обучили персонал." }],

  "p013": [
  { author: "Мирзаев Ш.Т.", org: "СОКБ, Самарканд", date: "20.03.2026", rating: 5, text: "Автоклав Tuttnauer работает стабильно. Документация в полном порядке, регистрационное удостоверение предоставлено." },
  { author: "Ниёзова Г.К.", org: "Shifa, Ташкент", date: "05.02.2026", rating: 4, text: "Хорошее оборудование. Единственный момент — упаковка при доставке могла быть надёжнее, но сам автоклав без нареканий." }]

};
const DEFAULT_REVIEWS = [
{ author: "Хасанов А.К.", org: "Наманганская ОБ", date: "01.06.2026", rating: 5, text: "Оперативная поставка, полный пакет документов. Рекомендуем ИНДУСТРИЯ ЗДОРОВЬЯ как надёжного партнёра." },
{ author: "Турсунова Н.Р.", org: "SilkMed Clinic", date: "18.05.2026", rating: 5, text: "Работаем с ИНДУСТРИЯ ЗДОРОВЬЯ второй год. Цены конкурентные, менеджеры всегда на связи." }];


function StarRow({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) =>
      <Icon key={i} name="star" size={size} sw={1.5} style={{ color: i <= rating ? "#f5a623" : "var(--line-soft)", fill: i <= rating ? "#f5a623" : "none" }} />
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

/* ============================================================
   TURNKEY KITS PAGE
   ============================================================ */
const KITS = [
{ id: "k1", icon: "scalpel", color: "var(--blue-600)",
  title_ru: "Операционный блок", title_en: "Operating suite",
  desc_ru: "Полное оснащение операционной: стол, наркозный аппарат, монитор, ИВЛ, светильники, электрохирургия, стерилизатор.",
  desc_en: "Full OR equipping: table, anesthesia machine, monitor, ventilator, lights, electrosurgery, sterilizer.",
  items_ru: ["Операционный стол Armed ST-III", "Наркозный аппарат Comen AX-600", "Монитор пациента Comen C60", "Аппарат ИВЛ Dräger Savina 300", "Светильник Midmark LED-720", "Электрохирургия BMT ESU-300", "Автоклав Tuttnauer 3870EA"],
  sum: 712000000, time_ru: "14–21 рабочих день", time_en: "14–21 working days" },
{ id: "k2", icon: "pulse", color: "var(--blue-500)",
  title_ru: "Отделение функциональной диагностики", title_en: "Functional diagnostics unit",
  desc_ru: "Кабинет УЗИ, ЭКГ, мониторинг. Всё оборудование с регистрационными удостоверениями.",
  desc_en: "Ultrasound, ECG and monitoring room. All equipment with registration certificates.",
  items_ru: ["УЗИ-сканер Edan Acclarix AX8", "ЭКГ-аппарат Edan SE-1201", "Монитор Comen C60 × 3", "Тонометры Armed × 5", "Пульсоксиметры ChoiceMMed × 5"],
  sum: 284000000, time_ru: "7–10 рабочих дней", time_en: "7–10 working days" },
{ id: "k3", icon: "shield-cross", color: "var(--accent)",
  title_ru: "Стерилизационное отделение (ЦСО)", title_en: "Central sterile services dept.",
  desc_ru: "Полный цикл стерилизации: паровые автоклавы, сухожар, ультразвуковые мойки, УФ-облучатели.",
  desc_en: "Full sterilization cycle: steam autoclaves, dry heat, ultrasonic cleaners, UV lamps.",
  items_ru: ["Автоклав Tuttnauer 3870EA", "Стерилизатор BMT Sterivap 23 л", "УЗ-мойка BMT UC-10 × 2", "Шкаф сухожаровой Armed ГП-80", "Рециркулятор Armed CH-215 × 2", "Облучатель Armed ОБН-150 × 3"],
  sum: 168000000, time_ru: "5–7 рабочих дней", time_en: "5–7 working days" },
{ id: "k4", icon: "cross-pulse", color: "var(--danger)",
  title_ru: "Машина скорой помощи", title_en: "Emergency ambulance kit",
  desc_ru: "Полная комплектация реанимобиля: ИВЛ транспортный, дефибриллятор, монитор, укладки, кислородный модуль.",
  desc_en: "Full paramedic vehicle kit: transport ventilator, defibrillator, monitor, medical bags, oxygen module.",
  items_ru: ["Дефибриллятор Mindray BeneHeart D6", "Транспортный ИВЛ Dräger Oxylog 3000+", "Монитор Comen C60", "Набор реанимационный Armed НР-01", "Укладка врача Armed УМСП-01", "Носилки Armed НТ-04"],
  sum: 299000000, time_ru: "7–14 рабочих дней", time_en: "7–14 working days" }];


/* KitsPage удалён: страницы нет в меню каталога. */
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
      <div style={{ background: "var(--bg-2)", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontWeight: 700 }}>
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
  ReviewsSection, StarRow,
  TrackingPage
});
