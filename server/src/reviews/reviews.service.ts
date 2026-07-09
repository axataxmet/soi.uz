import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublishStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';

const PUBLISHER_ROLES: Role[] = [Role.SUPERADMIN, Role.ADMIN, Role.EDITOR];

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public: only published ──
  async findPublic(q: QueryReviewDto) {
    const where: Prisma.ReviewWhereInput = { status: PublishStatus.PUBLISHED };
    if (q.type) where.type = q.type;
    return this.list(where, q);
  }

  async findOnePublic(id: string) {
    const item = await this.prisma.review.findFirst({
      where: { id, status: PublishStatus.PUBLISHED },
    });
    if (!item) throw new NotFoundException('Отзыв не найден');
    return item;
  }

  // ── Admin: all statuses ──
  async findAllAdmin(q: QueryReviewDto) {
    const where: Prisma.ReviewWhereInput = {};
    if (q.type) where.type = q.type;
    if (q.status) where.status = q.status;
    return this.list(where, q);
  }

  async create(dto: CreateReviewDto, role: Role) {
    const item = await this.prisma.review.create({
      data: { ...this.toData(dto), status: this.resolveStatus(dto.status, role) },
    });
    return item;
  }

  async update(id: string, dto: UpdateReviewDto, role: Role) {
    await this.ensureExists(id);
    return this.prisma.review.update({
      where: { id },
      data: {
        ...this.toData(dto),
        ...(dto.status !== undefined ? { status: this.resolveStatus(dto.status, role) } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.review.delete({ where: { id } });
    return { success: true };
  }

  // ── helpers ──
  private async list(where: Prisma.ReviewWhereInput, q: QueryReviewDto) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        orderBy: [{ order: 'asc' }, { date: 'desc' }, { createdAt: 'desc' }],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.review.count({ where }),
    ]);
    return paginate(data, total, q.page, q.limit);
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.review.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Отзыв не найден');
  }

  // Content managers can only save drafts; publishing requires editor+.
  private resolveStatus(requested: PublishStatus | undefined, role: Role): PublishStatus {
    if (requested === PublishStatus.PUBLISHED && !PUBLISHER_ROLES.includes(role)) {
      return PublishStatus.DRAFT;
    }
    return requested ?? PublishStatus.DRAFT;
  }

  private toData(dto: CreateReviewDto | UpdateReviewDto): Prisma.ReviewUncheckedCreateInput {
    return {
      type: dto.type,
      company: dto.company as Prisma.InputJsonValue,
      region: dto.region as Prisma.InputJsonValue,
      description: dto.description as Prisma.InputJsonValue,
      quote: dto.quote as Prisma.InputJsonValue,
      body: dto.body as Prisma.InputJsonValue,
      logoUrl: dto.logoUrl,
      letterUrl: dto.letterUrl,
      color: dto.color,
      order: dto.order,
      date: dto.date ? new Date(dto.date) : undefined,
    } as Prisma.ReviewUncheckedCreateInput;
  }
}
