# ИНДУСТРИЯ ЗДОРОВЬЯ — Backend (NestJS + Prisma + PostgreSQL)

REST API для платформы «ИНДУСТРИЯ ЗДОРОВЬЯ». Хранение данных — PostgreSQL,
медиафайлы — S3/MinIO. Аутентификация — JWT + RBAC.

## Быстрый старт (разработка)

```bash
# 1. Поднять Postgres + MinIO (из корня проекта soi.uz/)
docker compose up -d postgres minio minio-init

# 2. Зависимости и окружение
cd server
cp .env.example .env          # отредактируйте секреты (JWT_*, пароли)
npm install

# 3. Применить обе схемы к БД и сгенерировать клиенты
npm run prisma:deploy      # public (основная) + etender — обе обязательны
npm run prisma:generate

# 4. Заполнить БД (суперадмин + примеры)
npm run db:seed

# 5. Запустить API
npm run start:dev
```

> `npm run prisma:deploy` применяет **две** схемы: основную и `prisma/etender`
> (Postgres-схема `etender`, отдельный клиент). Пропустите её — и раздел
> «Тендеры» на сайте вернёт 500: `table etender.etender_lots does not exist`.
>
> `ETENDER_DATABASE_URL` можно не задавать: если он пуст, URL выводится из
> `DATABASE_URL` подстановкой `?schema=etender` — и в рантайме, и в Prisma CLI
> (через `scripts/etender-db-url.js`). Заполняйте его, только если тендеры
> переезжают в отдельную базу.

- API: `http://localhost:4000/api`
- Swagger / OpenAPI: `http://localhost:4000/api/docs`
- Health: `GET /api/health`
- MinIO консоль: `http://localhost:9001` (minioadmin / minioadmin)

Логин по умолчанию (из `.env`): `admin@soi.uz` / `ChangeMe123!` → **смените**.

## Полный запуск в Docker

```bash
docker compose up -d        # postgres + minio + api (миграции применятся на старте)
```

## Локальный запуск без Docker

Postgres и MinIO могут быть подняты нативно — `.env` по умолчанию настроен
именно на это:

```
DATABASE_URL=postgresql://soi:soi_password@localhost:5432/soi?schema=public
ETENDER_DATABASE_URL=          # пусто → выводится из DATABASE_URL
```

```bash
cd server && npm install
npm run prisma:deploy      # обе схемы
npm run db:seed
npm run start:dev          # → http://localhost:4000/api/docs
```

**MinIO без Docker** (для медиа; `.env` уже под него — minioadmin/minioadmin, :9000):
```bash
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin \
  minio server /tmp/soi-minio-data --address :9000 --console-address :9001 &
```

Бакет `soi-media` создаётся при старте API. Политика публичного чтения
переустанавливается на каждом старте — бакет, созданный вручную через консоль
MinIO, иначе остаётся приватным и все медиа-URL отвечают 403.

Без MinIO загрузки в dev не ломаются: файлы падают в `server/uploads/` и
раздаются с `/uploads` (см. `MEDIA_LOCAL_FALLBACK`). В production fallback выключен.

## Эндпоинты (Phase 1–2)

Полный список и схемы — в Swagger `/api/docs`. Кратко:

| Ресурс | Базовый путь | Публичное чтение |
|--------|--------------|------------------|
| auth | `/api/auth/login\|refresh\|logout\|me` | login/refresh |
| reviews, news, cases, pages, products | `/api/<ресурс>` (+`/manage/all`) | только PUBLISHED |
| brands, categories, documents, team | `/api/<ресурс>` | да |
| catalog | `/api/catalog/:entity` | да |
| submissions | `/api/submissions` | только POST (форма) |
| settings | `/api/settings/:key` | чтение по ключу |
| media | `/api/media/upload\|/:id` | нет (только роли) |

## Архитектура

| Слой | Назначение |
|------|-----------|
| `src/auth` | JWT (access+refresh с ротацией), RBAC (5 ролей), глобальные guard'ы |
| `src/prisma` | `PrismaService` (подключение к БД) |
| `src/common` | фильтр ошибок, логирование, пагинация, i18n-DTO |
| `src/reviews` | эталонный CRUD-модуль (по нему строятся остальные) |
| `prisma/schema.prisma` | модели всех сущностей |

### Роли (RBAC)
`SUPERADMIN` · `ADMIN` · `EDITOR` · `CONTENT_MANAGER` · `SUBMISSIONS_MANAGER`.
Глобально: каждый маршрут требует JWT, кроме помеченных `@Public()`.
`@Roles(...)` ограничивает доступ; `SUPERADMIN` проходит всегда.

### Соглашения REST (на примере `reviews`)
| Метод | Путь | Доступ |
|-------|------|--------|
| GET | `/api/reviews` | público (только PUBLISHED) |
| GET | `/api/reviews/:id` | público |
| GET | `/api/reviews/manage/all` | роли (все статусы) |
| POST | `/api/reviews` | роли |
| PATCH | `/api/reviews/:id` | роли |
| DELETE | `/api/reviews/:id` | ADMIN |

Мультиязычные поля — JSON `{ ru, uz, en }`. Медиа — только URL (файлы в MinIO).

## Дорожная карта
- **Фаза 1 (готово):** фундамент, auth+RBAC, эталонный модуль `reviews`, seed.
- **Фаза 2:** модули products, categories, catalog(`cat_*`), brands, news, cases,
  pages, documents, team, submissions, settings + media (MinIO upload/delete).
- **Фаза 3:** фронтенд — API-клиент + асинхронный `window.CMS` (слой совместимости).
- **Фаза 4:** сиды/миграция контента, продакшн-деплой.
