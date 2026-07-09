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

function CookieBanner({ lang, go }) {
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
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-inner">
        <div className="cookie-ic"><Icon name="shield" size={22} /></div>
        <div className="cookie-text">
          <div className="cookie-title">{c.title}</div>
          <p>{c.body} <a onClick={() => { go("info", { p: "privacy" }); decide("accept"); }}>{c.policy}</a></p>
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
