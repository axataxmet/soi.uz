/* UzMedEx — Cookie consent banner (РУз: Закон «О персональных данных» № ЗРУ-547) */
const { useState: useCkState, useEffect: useCkEffect } = React;

const COOKIE_KEY = "uzmedex_cookie_consent";

const COOKIE_TXT = {
  ru: {
    title: "Мы используем файлы cookie",
    body: "Сайт использует cookie и обрабатывает персональные данные для корректной работы, аналитики и улучшения сервиса. Данные хранятся на серверах на территории Республики Узбекистан в соответствии с Законом «О персональных данных» (№ ЗРУ-547).",
    policy: "Политика конфиденциальности",
    accept: "Принять все",
    necessary: "Только необходимые",
  },
  uz: {
    title: "Biz cookie fayllaridan foydalanamiz",
    body: "Sayt to'g'ri ishlashi, tahlil va xizmatni yaxshilash uchun cookie fayllaridan foydalanadi va shaxsiy ma'lumotlarni qayta ishlaydi. Ma'lumotlar «Shaxsga doir ma'lumotlar to'g'risida»gi qonun (№ O'RQ-547) talablariga muvofiq O'zbekiston Respublikasi hududidagi serverlarda saqlanadi.",
    policy: "Maxfiylik siyosati",
    accept: "Hammasini qabul qilish",
    necessary: "Faqat zarurlari",
  },
  en: {
    title: "We use cookies",
    body: "This site uses cookies and processes personal data to function properly, for analytics and to improve our service. Data is stored on servers located within the Republic of Uzbekistan in accordance with the Law on Personal Data (No. ZRU-547).",
    policy: "Privacy Policy",
    accept: "Accept all",
    necessary: "Necessary only",
  },
};

/* Баннер живёт в корпоративной оболочке (App в news.jsx) и потому виден на
   любой странице. До 22.08.2026 он монтировался в app-root.jsx — оболочке
   каталога, которая на остальных разделах скрыта, — и согласие спрашивалось
   только у тех, кто зашёл в каталог.

   goCat нужен для ссылки на политику: сама страница политики (InfoPage) живёт
   в каталожной оболочке, и добраться до неё можно только через неё. У
   корпоративного go() вида «info» нет — он молча открыл бы главную. */
function CookieBanner({ lang, go, goCat }) {
  const [show, setShow] = useCkState(false);
  const c = COOKIE_TXT[lang] || COOKIE_TXT.ru;

  useCkEffect(() => {
    const t = setTimeout(() => {
      try { if (!localStorage.getItem(COOKIE_KEY)) setShow(true); } catch (e) {}
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const decide = (choice) => {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ choice, ts: Date.now() })); } catch (e) {}
    /* Счётчики слушают это событие и подключаются в тот же момент, а не со
       следующей загрузки страницы. При выборе «Только необходимые» событие
       тоже уходит, но analytics.js на нём ничего не грузит — решение
       принимается там, в одном месте. */
    try { window.dispatchEvent(new CustomEvent("soi:consent", { detail: { choice } })); } catch (e) {}
    setShow(false);
  };

  /* Открыть политику — не то же самое, что согласиться. Раньше этот переход
     записывал выбор «accept», то есть согласие на всё фиксировалось за то, что
     человек пошёл читать условия. Баннер остаётся на экране, выбор за
     пользователем. */
  const openPolicy = () => {
    if (goCat) goCat("info", "privacy");
    else go("info", { p: "privacy" });
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-inner">
        <div className="cookie-ic"><Icon name="shield" size={22} /></div>
        <div className="cookie-text">
          <div className="cookie-title">{c.title}</div>
          <p>{c.body} <a onClick={openPolicy}>{c.policy}</a></p>
        </div>
        <div className="cookie-actions">
          <button className="btn btn-outline" onClick={() => decide("necessary")}>{c.necessary}</button>
          <button className="btn btn-primary" onClick={() => decide("accept")}>{c.accept}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CookieBanner });
