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
