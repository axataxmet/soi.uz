import { Injectable, NotFoundException } from '@nestjs/common';
import { PublishStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginationDto } from './dto/pagination.dto';

const PUBLISHER_ROLES: Role[] = [Role.SUPERADMIN, Role.ADMIN, Role.EDITOR];

export interface CrudOptions {
  model: string; // Prisma delegate name, e.g. 'brand'
  defaultOrderBy?: unknown;
}

// Generic Prisma CRUD shared by all content resources.
@Injectable()
export abstract class BaseCrudService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly opts: CrudOptions,
  ) {}

  protected get model(): any {
    return (this.prisma as any)[this.opts.model];
  }

  protected async paginate(where: any, q: PaginationDto, orderBy?: unknown) {
    const [data, total] = await this.prisma.$transaction([
      this.model.findMany({
        where,
        orderBy: orderBy ?? this.opts.defaultOrderBy,
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.model.count({ where }),
    ]);
    return paginate(data, total, q.page, q.limit);
  }

  protected async getOneOrFail(where: any) {
    const item = await this.model.findFirst({ where });
    if (!item) throw new NotFoundException('Запись не найдена');
    return item;
  }

  protected async ensureExists(id: string) {
    const found = await this.model.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Запись не найдена');
    return found;
  }

  async create(data: any) {
    return this.model.create({ data });
  }

  async update(id: string, data: any) {
    await this.ensureExists(id);
    return this.model.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.model.delete({ where: { id } });
    return { success: true };
  }

  // Content managers can only save drafts; publishing needs editor+.
  protected resolveStatus(requested: PublishStatus | undefined, role: Role): PublishStatus {
    if (requested === PublishStatus.PUBLISHED && !PUBLISHER_ROLES.includes(role)) {
      return PublishStatus.DRAFT;
    }
    return requested ?? PublishStatus.DRAFT;
  }
}
