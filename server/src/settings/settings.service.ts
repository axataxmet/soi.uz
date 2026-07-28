import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /* An unconfigured setting is a normal state, not an error, so this answers 200
     with a null value rather than 404. Callers MUST treat null as "fall back to
     your own default" — it is not a usable value. (404 would also defeat the
     client's negative caching and turn every render that reads a setting into a
     request; see ensureSettingKey in project/app/cms-remote.js.) */
  async get(key: string): Promise<{ key: string; value: unknown }> {
    const found = await this.prisma.setting.findUnique({ where: { key } });
    return found ?? { key, value: null };
  }

  findAll() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  set(key: string, value: unknown) {
    const v = value as Prisma.InputJsonValue;
    return this.prisma.setting.upsert({
      where: { key },
      update: { value: v },
      create: { key, value: v },
    });
  }
}
