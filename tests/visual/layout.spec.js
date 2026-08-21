const { test, expect } = require("@playwright/test");

// Три ширины: десктоп, планшет (ниже брейкпоинта 980px, где футер
// перестраивается) и мобильный.
const WIDTHS = [
  { name: "desktop", width: 1400, height: 900 },
  { name: "tablet", width: 900, height: 900 },
  { name: "mobile", width: 375, height: 812 }];


/* Страница приводится в детерминированное состояние:

   1. reveal-эффекты. Секции появляются по IntersectionObserver (.sx-rv →
      .sx-in). Без принудительного включения нижние блоки попадают в кадр
      полупрозрачными и сдвинутыми — снимок отличался бы от прогона к прогону.
   2. плавная прокрутка. html{scroll-behavior:smooth} превращает переход к
      футеру в анимацию, и снимок ловил бы её середину.
   3. шрифты. Montserrat подключён локально, но до document.fonts.ready текст
      меряется запасным шрифтом и переносы строк другие. */
/* Настройки сайта (контакты в футере, счётчики в плитках) приезжают из API и
   меняются вместе с содержимым базы. Для снимка это шум: тест стережёт вёрстку,
   а падал он на других телефонах — эталон снят при поднятом бэкенде, а без него
   подставляются значения по умолчанию, и вся колонка съезжает по высоте.

   Запрос глушим, поэтому страница всегда берёт зашитые значения по умолчанию.
   Снимок становится воспроизводимым и с работающим бэкендом, и без него. */
async function stubSettings(page) {
  await page.route("**/api/settings/**", (route) => route.abort());
}

/* Ждём, пока элемент перестанет менять размер. Футер догружает контакты и
   логотип уже после монтирования, и его высота какое-то время «дышит» — снимок
   ловил кадр на пиксель выше или ниже, и прогон падал через раз с почти пустым
   diff. Два одинаковых замера подряд означают, что вёрстка устоялась. */
async function waitStable(locator, page) {
  let prev = null;
  for (let i = 0; i < 25; i++) {
    const box = await locator.boundingBox();
    const now = box ? Math.round(box.width) + "x" + Math.round(box.height) : null;
    if (now && now === prev) return;
    prev = now;
    await page.waitForTimeout(120);
  }
}

async function settle(page) {
  /* Ждём отрисованный футер, а не networkidle: страница постоянно держит
     открытые соединения — видео в герое отдаётся по частям, — и состояние
     «сеть тиха» не наступает вовсе, прогон упирался в таймаут. Футер
     монтируется последним, поэтому его появление и есть признак готовности. */
  await page.locator("footer.foot:visible").waitFor({ timeout: 20000 });
  await page.addStyleTag({
    content: "html{scroll-behavior:auto !important}" });

  await page.evaluate(() => {
    document.querySelectorAll(".sx-rv").forEach((el) => el.classList.add("sx-in"));
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const vp of WIDTHS) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("первый экран главной", async ({ page }) => {
      await stubSettings(page);
      await page.goto("/");
      await settle(page);

      /* Герой — слайдер с автопереключением: заголовок, подпись и фон меняются
         каждые несколько секунд. Клик по первому индикатору возвращает слайд 0
         и перезапускает его таймер, давая запас до следующего переключения.
         Видео и фоновые изображения всё равно маскируются: кадр видео на паузе
         не гарантирован, а маска убирает этот источник расхождений. */
      const firstBar = page.locator(".soi-chero-bar").first();
      if (await firstBar.count()) {
        await firstBar.click();
        await page.waitForTimeout(300);
      }

      await expect(page).toHaveScreenshot(`home-top-${vp.name}.png`, {
        mask: [page.locator(".soi-chero-media"), page.locator(".soi-chero-stage video")],
        maskColor: "#0E4AC6" });

    });

    test("футер", async ({ page }) => {
      await stubSettings(page);
      await page.goto("/");
      await settle(page);

      /* Футеров в DOM два: встроенная каталожная оболочка (.z-catalog) держит
         свой, скрытый через display:none, и он идёт первым. Без «:visible»
         селектор неоднозначен, и снимок брался не с того элемента — отсюда
         расхождения, появлявшиеся будто бы сами собой. */
      const footer = page.locator("footer.foot:visible");
      /* Прокручиваем в самый низ, а не «до появления футера»: высота футера
         дробная, и то, в какую сторону округлится последний пиксель, зависит
         от позиции прокрутки. scrollIntoViewIfNeeded оставляет её разной, и
         снимок отличался на 1px — «366px против 365px». Конец документа —
         единственная позиция, одинаковая в каждом прогоне. */
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      /* Ждём телефон: контакты подставляются после монтирования футера, и до
         этого момента колонка ещё меняет высоту. Значения здесь всегда
         зашитые по умолчанию — запрос настроек заглушен в stubSettings. */
      await footer.locator("text=/\\+998/").first().waitFor({ timeout: 15000 });

      // Секции футера участвуют и в reveal — даём кадр на применение классов.
      await page.waitForTimeout(300);
      await waitStable(footer, page);

      await expect(footer).toHaveScreenshot(`footer-${vp.name}.png`);

    });
  });
}
