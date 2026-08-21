// Визуальные эталоны для сайта. Задача узкая: поймать непреднамеренный сдвиг
// вёрстки после правок стилей — за одну сессию футер переделывался четыре раза,
// и каждый раз проверялся глазами.
//
// Запускается против уже поднятого dev-сервера (npm run dev, порт 3456), а не
// поднимает свой: сервер в этом проекте держится вручную, и второй экземпляр
// на том же порту просто упал бы.
const { defineConfig, devices } = require("@playwright/test");

const BASE_URL = process.env.SOI_BASE_URL || "http://127.0.0.1:3456";

module.exports = defineConfig({
  testDir: "./tests/visual",
  // Эталоны кладём рядом с тестом, без суффикса платформы: снимаются и
  // сверяются они на одной машине, а имя вида "-darwin" только шумит в diff.
  snapshotPathTemplate: "{testDir}/baseline/{arg}{ext}",
  fullyParallel: false,
  // Один воркер: все тесты ходят на общий dev-сервер и переключают размер окна.
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "tests/visual/report" }]],
  use: {
    baseURL: BASE_URL,
    // Скриншоты сравниваются попиксельно, поэтому анимации выключены:
    // reveal-эффекты секций иначе дают разный кадр на каждом прогоне.
    screenshot: "only-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      // Небольшой допуск: рендер шрифтов даёт единичные пиксели расхождения
      // даже без изменений в коде.
      maxDiffPixelRatio: 0.002,
      animations: "disabled",
      caret: "hide",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
