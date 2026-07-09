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

# 3. Применить схему к БД и сгенерировать клиент
npx prisma migrate dev --name init
npm run prisma:generate

# 4. Заполнить БД (суперадмин + примеры)
npm run db:seed

# 5. Запустить API
npm run start:dev
```

- API: `http://localhost:4000/api`
- Swagger / OpenAPI: `http://localhost:4000/api/docs`
- Health: `GET /api/health`
- MinIO консоль: `http://localhost:9001` (minioadmin / minioadmin)

Логин по умолчанию (из `.env`): `admin@soi.uz` / `ChangeMe123!` → **смените**.

## Полный запуск в Docker

```bash
docker compose up -d        # postgres + minio + api (миграции применятся на старте)
```

## Локальный запуск без Docker (macOS / Homebrew)

На этой машине порт 5432 занят PostgreSQL 18 (EnterpriseDB), поэтому наш
кластер Postgres 16 (Homebrew) поднят на **5433**. `.env` уже настроен под него
(`DATABASE_URL=postgresql://aa@localhost:5433/soi?schema=public`).

```bash
# 1. Запустить наш Postgres 16 на 5433 (LC_ALL обязателен — macOS-баг)
LC_ALL=en_US.UTF-8 /opt/homebrew/opt/postgresql@16/bin/pg_ctl \
  -D /opt/homebrew/var/postgresql@16 -o "-p 5433" \
  -l /opt/homebrew/var/postgresql@16/server-5433.log start

# 2. (однократно) база + схема + данные
/opt/homebrew/opt/postgresql@16/bin/createdb -h localhost -p 5433 soi   # если ещё нет
cd server && npm install
npx prisma migrate dev --name init
npm run db:seed

# 3. Запустить API
npm run start:dev          # → http://localhost:4000/api/docs
```

Остановить Postgres: `/opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 stop`.
Логин: `admin@soi.uz` / `ChangeMe123!`.

**MinIO без Docker** (для медиа; `.env` уже под него — minioadmin/minioadmin, :9000):
```bash
MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin \
  minio server /tmp/soi-minio-data --address :9000 --console-address :9001 &
```
Бакет `soi-media` создаётся автоматически при старте API.

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
