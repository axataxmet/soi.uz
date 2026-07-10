// Loads & lightly validates required env vars at boot.
export interface AppConfig {
  nodeEnv: string;
  port: number;
}

const REQUIRED = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

export function validateEnv(env: Record<string, string | undefined>) {
  const missing = REQUIRED.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
  return env;
}

export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3456',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '15m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '30d',
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
  S3_REGION: process.env.S3_REGION || 'us-east-1',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET: process.env.S3_BUCKET || 'soi-media',
  // e-tender (UZEX) — isolated schema/pool + daily sync
  ETENDER_DATABASE_URL: process.env.ETENDER_DATABASE_URL, // own Postgres schema (derived from DATABASE_URL if unset)
  ETENDER_API_BASE: process.env.ETENDER_API_BASE || 'https://apietender.uzex.uz',
  ETENDER_SYNC_ENABLED: process.env.ETENDER_SYNC_ENABLED || 'true',
  ETENDER_SYNC_SOURCES: process.env.ETENDER_SYNC_SOURCES || '', // allow-list of source ids; empty = all
  ETENDER_GOVUZ_ENABLED: process.env.ETENDER_GOVUZ_ENABLED || 'true',
  ETENDER_GOVUZ_API_BASE: process.env.ETENDER_GOVUZ_API_BASE || 'https://api-portal.gov.uz',
  ETENDER_GOVUZ_LANG: process.env.ETENDER_GOVUZ_LANG || 'ru',
  ETENDER_XARID_ENABLED: process.env.ETENDER_XARID_ENABLED || 'true',
  ETENDER_XARID_API_BASE: process.env.ETENDER_XARID_API_BASE || 'https://xarid-api-purchase.uzex.uz',
  ETENDER_XARID_LANG: process.env.ETENDER_XARID_LANG || 'ru',
  ETENDER_XT_ENABLED: process.env.ETENDER_XT_ENABLED || 'true',
  ETENDER_XT_API_BASE: process.env.ETENDER_XT_API_BASE || 'https://api.xt-xarid.uz',
  ETENDER_XT_LANG: process.env.ETENDER_XT_LANG || 'ru',
  ETENDER_SYNC_CRON: process.env.ETENDER_SYNC_CRON || '0 20 * * *', // daily 20:00
  ETENDER_SYNC_TZ: process.env.ETENDER_SYNC_TZ || 'Asia/Tashkent',
  ETENDER_SYNC_PAGE_SIZE: parseInt(process.env.ETENDER_SYNC_PAGE_SIZE || '50', 10),
  ETENDER_SYNC_MAX_PAGES: parseInt(process.env.ETENDER_SYNC_MAX_PAGES || '40', 10),
  ETENDER_LIST_CACHE_TTL_MS: parseInt(process.env.ETENDER_LIST_CACHE_TTL_MS || '300000', 10),
});
