import { execFileSync } from 'child_process';
import { join } from 'path';
import { etenderDbUrl } from './etender-prisma.service';

/* This derivation is the reason the tenders endpoints once returned 500: the rule
   lived only here, so the Prisma CLI never applied the etender migrations. It now
   also exists in scripts/etender-db-url.js — these tests pin both, and that they
   agree. */
describe('etenderDbUrl', () => {
  const saved = { etender: process.env.ETENDER_DATABASE_URL, main: process.env.DATABASE_URL };

  afterEach(() => {
    process.env.ETENDER_DATABASE_URL = saved.etender;
    process.env.DATABASE_URL = saved.main;
  });

  it('prefers an explicit ETENDER_DATABASE_URL', () => {
    process.env.ETENDER_DATABASE_URL = 'postgresql://u:p@tenders-host:5432/tenders?schema=public';
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/soi?schema=public';

    expect(etenderDbUrl()).toBe('postgresql://u:p@tenders-host:5432/tenders?schema=public');
  });

  it('derives the etender schema from DATABASE_URL when unset', () => {
    delete process.env.ETENDER_DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/soi?schema=public';

    expect(etenderDbUrl()).toBe('postgresql://u:p@localhost:5432/soi?schema=etender');
  });

  it('adds the schema when DATABASE_URL carries no query string', () => {
    delete process.env.ETENDER_DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/soi';

    expect(etenderDbUrl()).toBe('postgresql://u:p@localhost:5432/soi?schema=etender');
  });

  it('keeps other connection params while overriding the schema', () => {
    delete process.env.ETENDER_DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/soi?schema=public&connection_limit=5';

    const url = new URL(etenderDbUrl());
    expect(url.searchParams.get('schema')).toBe('etender');
    expect(url.searchParams.get('connection_limit')).toBe('5');
  });

  it('matches what the Prisma CLI shim prints', () => {
    const script = join(__dirname, '../../scripts/etender-db-url.js');
    const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: 'postgresql://u:p@localhost:5432/soi?schema=public' };
    delete env.ETENDER_DATABASE_URL;

    // The shim loads .env itself, which would reintroduce the real values — point
    // it at a directory without one so it sees only the env we pass in.
    const fromCli = execFileSync('node', [script], { env, cwd: __dirname, encoding: 'utf8' });

    delete process.env.ETENDER_DATABASE_URL;
    process.env.DATABASE_URL = env.DATABASE_URL;
    expect(fromCli).toBe(etenderDbUrl());
  });
});
