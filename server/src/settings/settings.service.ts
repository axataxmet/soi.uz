import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: string) {
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
