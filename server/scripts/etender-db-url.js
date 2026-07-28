#!/usr/bin/env node
/* Prints the e-tender database URL for the Prisma CLI.

   The app derives this at runtime (src/etender/etender-prisma.service.ts), but the
   CLI only reads ETENDER_DATABASE_URL from .env. Without this shim an unset var —
   the documented default — silently skips the etender migrations, and the tenders
   endpoints then fail with "table etender.etender_lots does not exist".

   Keep the fallback in sync with etenderDbUrl() in etender-prisma.service.ts. */
require('dotenv/config');

if (process.env.ETENDER_DATABASE_URL) {
  process.stdout.write(process.env.ETENDER_DATABASE_URL);
} else {
  const base = process.env.DATABASE_URL || '';
  if (!base) {
    console.error('Neither ETENDER_DATABASE_URL nor DATABASE_URL is set — check server/.env');
    process.exit(1);
  }
  const [core, query = ''] = base.split('?');
  const params = new URLSearchParams(query);
  params.set('schema', 'etender');
  process.stdout.write(`${core}?${params.toString()}`);
}
