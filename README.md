# ИНДУСТРИЯ ЗДОРОВЬЯ (soi.uz)

Сайт и админ-панель поставщика медицинского оборудования в Узбекистане.
Три языка (RU/UZ/EN), контент редактируется через собственную CMS.

## Структура

| Путь | Что это |
|------|---------|
| `project/` | фронтенд: сайт (`index.html`) и админка (`admin.html`) |
| `project/app/` | компоненты сайта (JSX, без сборки — Babel в браузере) |
| `project/admin/` | компоненты админ-панели |
| `project/lib/` | вендорные React/ReactDOM |
| `project/dev-server.js` | статический dev-сервер с SPA-fallback |
| `server/` | REST API: NestJS + Prisma + PostgreSQL ([подробности](server/README.md)) |
| `docker-compose.yml` | Postgres, MinIO, API |
| `extracted/`, `design-system/` | вспомогательные материалы, в рантайме не используются |

Сборки нет: JSX компилируется в браузере через `@babel/standalone`, поэтому
файлы подключаются в HTML вручную и версионируются через `?v=<timestamp>`.
Добавили новый `.jsx` — не забудьте `<script type="text/babel" src="...">`.

## Запуск

Нужны Node.js 20+, PostgreSQL и (опционально) MinIO.

```bash
# 1. Бэкенд
cd server
cp .env.example .env        # проверьте DATABASE_URL
npm install
npm run prisma:deploy       # ОБЕ схемы: основная + etender
npm run db:seed             # суперадмин + демо-контент
npm run start:dev           # → http://localhost:4000/api

# 2. Фронтенд (в другом терминале, из корня)
node project/dev-server.js  # → http://localhost:3456
```

| Что | Адрес |
|-----|-------|
| Сайт | http://localhost:3456 |
| Админ-панель | http://localhost:3456/admin |
| API | http://localhost:4000/api |
| Swagger | http://localhost:4000/api/docs |
| MinIO консоль | http://localhost:9001 |

Логин по умолчанию — `admin@soi.uz` / `ChangeMe123!` из `SEED_ADMIN_*` в `.env`.
**Смените его**: это значение лежит в репозитории и продублировано в примерах Swagger.

## Частые грабли

- **Пустой белый экран.** Скорее всего, упал рендер. Корневой error boundary
  (`project/app/error-boundary.jsx`) покажет ошибку и стек вместо пустой страницы.
- **«Тендеры» отдают 500.** Не применена схема `etender` — выполните
  `npm run prisma:deploy` (одной основной схемы недостаточно).
- **Логин не проходит.** База не засеяна: `npm run db:seed`.
- **`nest: command not found`.** Не установлены зависимости в `server/`.
- **Медиа не открываются (403).** Бакет MinIO создан вручную и остался приватным.
  Перезапустите API — он переустанавливает политику публичного чтения.
- **Правка `.jsx` не видна.** Браузер отдаёт старую версию из кэша: обновите
  `?v=` у соответствующего `<script>` в `index.html` / `admin.html`.

## Настройки CMS

Контент главной, страницы сервиса, SEO, контактов и меню хранится в таблице
`settings` и редактируется в админке. Если ключа в БД нет, API отдаёт
`{"value": null}`, а фронтенд подставляет значения по умолчанию из кода
(`CMS.getSetting(key, defaults)`).
