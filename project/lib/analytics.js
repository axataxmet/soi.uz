/* Счётчики посещаемости — Яндекс.Метрика и Google Analytics 4.
 *
 * Загружаются ТОЛЬКО после явного согласия «Принять все» в cookie-баннере.
 * Кнопка «Только необходимые» рядом с ней — обещание посетителю; если грузить
 * счётчик всё равно, обещание становится ложным, а закон «О персональных
 * данных» (№ ЗРУ-547) обязывает обрабатывать данные на заявленном основании.
 * Поэтому пока выбор не сделан или сделан в пользу необходимых — ни одного
 * запроса к аналитике не уходит.
 *
 * Номера счётчиков не зашиты в код: они лежат в настройке site_analytics и
 * правятся из админки. Пустое значение — счётчик просто не подключается,
 * это же и способ его выключить.
 */
(function () {
  "use strict";

  var CONSENT_KEY = "uzmedex_cookie_consent";
  var loaded = { metrika: false, ga4: false };

  function consentGiven() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      return JSON.parse(raw).choice === "accept";
    } catch (e) {
      return false; // нет доступа к хранилищу — считаем, что согласия нет
    }
  }

  function ids() {
    var s = (window.CMS && window.CMS.getSetting)
      ? window.CMS.getSetting("site_analytics", null)
      : null;
    return {
      metrika: (s && s.metrika ? String(s.metrika) : "").trim(),
      ga4: (s && s.ga4 ? String(s.ga4) : "").trim()
    };
  }

  function loadMetrika(id) {
    if (loaded.metrika || !id) return;
    loaded.metrika = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = +new Date();
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://mc.yandex.ru/metrika/tag.js";
    document.head.appendChild(s);
    /* webvisor намеренно выключен: он пишет движения курсора и ввод в поля,
       то есть куда более чувствительные данные, чем просмотры страниц.
       Включать такое стоит осознанно и отразив в политике. */
    window.ym(id, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
  }

  function loadGA4(id) {
    if (loaded.ga4 || !id) return;
    loaded.ga4 = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    /* anonymize_ip — меньше персональных данных на стороне Google при том же
       наборе отчётов по посещаемости. */
    window.gtag("config", id, { anonymize_ip: true });
  }

  function init() {
    if (!consentGiven()) return;
    var v = ids();
    if (v.metrika) loadMetrika(v.metrika);
    if (v.ga4) loadGA4(v.ga4);
  }

  /* Три точки входа, потому что согласие и номера счётчиков появляются
     независимо и в любом порядке:
       - страница открыта, согласие дано раньше и лежит в хранилище;
       - настройки догрузились из API уже после отрисовки;
       - посетитель только что нажал «Принять все». */
  window.addEventListener("soi:consent", init);
  window.addEventListener("soi:settings-ready", init);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  /* Настройки приезжают асинхронно, а события выше могут не сработать, если
     CMS их уже успела загрузить. Несколько коротких попыток закрывают этот
     разрыв, не превращаясь в постоянный таймер. */
  var tries = 0;
  var t = setInterval(function () {
    if (++tries > 10 || (loaded.metrika || loaded.ga4)) { clearInterval(t); return; }
    init();
  }, 1000);

  window.SoiAnalytics = { init: init, consentGiven: consentGiven };
})();
