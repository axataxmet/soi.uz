import { Injectable } from '@nestjs/common';
import { Prisma, PublishStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateNewsDto, QueryNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService extends BaseCrudService {
  constructor(prisma: PrismaService) {
    super(prisma, { model: 'news', defaultOrderBy: [{ date: 'desc' }, { createdAt: 'desc' }] });
  }

  findPublic(q: QueryNewsDto) {
    const where: Prisma.NewsWhereInput = { status: PublishStatus.PUBLISHED };
    if (q.type) where.type = q.type;
    return this.paginate(where, q);
  }

  findAllAdmin(q: QueryNewsDto) {
    const where: Prisma.NewsWhereInput = {};
    if (q.type) where.type = q.type;
    if (q.status) where.status = q.status;
    return this.paginate(where, q);
  }

  findOnePublic(id: string) {
    return this.getOneOrFail({ id, status: PublishStatus.PUBLISHED });
  }

  createNews(dto: CreateNewsDto, role: Role) {
    return this.create({ ...this.toData(dto), status: this.resolveStatus(dto.status, role) });
  }

  updateNews(id: string, dto: UpdateNewsDto, role: Role) {
    return this.update(id, {
      ...this.toData(dto),
      ...(dto.status !== undefined ? { status: this.resolveStatus(dto.status, role) } : {}),
    });
  }

  private toData(dto: CreateNewsDto | UpdateNewsDto) {
    return {
      type: dto.type,
      slug: dto.slug,
      title: dto.title as Prisma.InputJsonValue,
      excerpt: dto.excerpt as Prisma.InputJsonValue,
      body: dto.body as Prisma.InputJsonValue,
      coverUrl: dto.coverUrl,
      tags: dto.tags,
      date: dto.date ? new Date(dto.date) : undefined,
    };
  }
}
