import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// Isolated client generated from prisma/etender/schema.prisma — its own schema
// (`etender`) and its own connection pool, separate from the main PrismaService.
import { PrismaClient } from '../../prisma/etender/generated/client';

// Resolve the etender DB URL. Prefer an explicit ETENDER_DATABASE_URL; otherwise
// derive it from the main DATABASE_URL by pointing at the `etender` schema, so a
// single Postgres instance serves both today while staying trivially separable.
function etenderDbUrl(): string {
  if (process.env.ETENDER_DATABASE_URL) return process.env.ETENDER_DATABASE_URL;
  const base = process.env.DATABASE_URL || '';
  const [core, query = ''] = base.split('?');
  const params = new URLSearchParams(query);
  params.set('schema', 'etender');
  return `${core}?${params.toString()}`;
}

@Injectable()
export class EtenderPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ datasources: { db: { url: etenderDbUrl() } } });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
