/* Ранняя инициализация страницы.
   Оба фрагмента раньше были инлайновыми в index.html. Вынесены в файл, чтобы
   Content-Security-Policy мог запретить инлайновые скрипты целиком: политика
   с 'unsafe-inline' почти не защищает от XSS, а вариант с sha256-хешами
   ломался бы при любой правке index.html — молча и на всём сайте.
   Скрипт подключается синхронно и до бандлов: тема должна примениться
   до первой отрисовки, а __asset — существовать к моменту запуска React. */

// Сохранённая тема — до первой отрисовки, иначе при перезагрузке моргает светлым.
try {
  if (localStorage.getItem("si_theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
} catch (e) {
  /* приватный режим может запрещать localStorage — тогда просто светлая тема */
}

/* Разрешение путей к ресурсам: при сборке в один файл картинки и PDF
   встраиваются как blob-ссылки в window.__resources, и тогда возвращается
   она; в обычной раздаче — исходный путь. */
window.__assetMap = {
  "assets/soi-mark-white.svg": "soiMarkWhite",
  "assets/soi-mark.svg": "soiMark",
  "assets/company-card.pdf": "pdfCompanyCard",
  "assets/registration.pdf": "pdfRegistration",
  "assets/egrul.pdf": "pdfEgrul",
  "assets/supply-contract.pdf": "pdfSupply"
};
window.__asset = function (p) {
  var R = window.__resources || {};
  var id = window.__assetMap[p];
  return (id && R[id]) || p;
};

/* ── Отложенные бандлы каталога ──────────────────────────────────────────
   Магазинная часть — оболочка каталога, корзина, карточка товара, поиск по
   товарам — на корпоративных страницах не нужна, но грузилась всегда: 34
   файла на любой странице. Её теги в index.html помечены типом
   text/soi-deferred, поэтому браузер их не скачивает и не выполняет, а
   адрес лежит в data-src. Здесь они подключаются по требованию — когда
   корпоративная оболочка собирается показать каталог.

   Порядок обязателен: файлы не модули, они делятся глобальными именами, и
   их относительный порядок в index.html значим (например, InfoPage из
   cart.js намеренно перекрывается версией из company-info.js). async=false
   у динамически созданного тега как раз и означает «качать параллельно,
   выполнять по очереди», в отличие от значения по умолчанию.

   Промис один на страницу: повторные вызовы получают тот же самый, поэтому
   бандлы не загрузятся дважды, сколько бы раз ни открыли каталог. */
window.__loadDeferredBundles = function () {
  if (window.__deferredPromise) return window.__deferredPromise;

  var tags = [].slice.call(
    document.querySelectorAll('script[type="text/soi-deferred"][data-src]')
  );
  if (!tags.length) return (window.__deferredPromise = Promise.resolve());

  window.__deferredPromise = new Promise(function (resolve, reject) {
    var left = tags.length;
    tags.forEach(function (tag) {
      var s = document.createElement("script");
      s.src = tag.getAttribute("data-src");
      s.async = false;
      s.onload = function () { if (--left === 0) resolve(); };
      /* Один непрогрузившийся файл оставит каталог нерабочим, и молчать об
         этом хуже, чем показать ошибку: вызывающая сторона сможет отличить
         «ещё грузится» от «не загрузилось». */
      s.onerror = function () { reject(new Error("не загрузился " + s.src)); };
      document.head.appendChild(s);
    });
  });
  return window.__deferredPromise;
};
