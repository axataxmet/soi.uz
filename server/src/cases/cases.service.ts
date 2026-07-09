import { Injectable } from '@nestjs/common';
import { Prisma, PublishStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateCaseDto, QueryCaseDto, UpdateCaseDto } from './dto/case.dto';

@Injectable()
export class CasesService extends BaseCrudService {
  constructor(prisma: PrismaService) {
    super(prisma, { model: 'case', defaultOrderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  }

  findPublic(q: QueryCaseDto) {
    return this.paginate({ status: PublishStatus.PUBLISHED }, q);
  }

  findAllAdmin(q: QueryCaseDto) {
    const where: Prisma.CaseWhereInput = {};
    if (q.status) where.status = q.status;
    return this.paginate(where, q);
  }

  findOnePublic(id: string) {
    return this.getOneOrFail({ id, status: PublishStatus.PUBLISHED });
  }

  createCase(dto: CreateCaseDto, role: Role) {
    return this.create({ ...this.toData(dto), status: this.resolveStatus(dto.status, role) });
  }

  updateCase(id: string, dto: UpdateCaseDto, role: Role) {
    return this.update(id, {
      ...this.toData(dto),
      ...(dto.status !== undefined ? { status: this.resolveStatus(dto.status, role) } : {}),
    });
  }

  private toData(dto: CreateCaseDto | UpdateCaseDto) {
    return {
      title: dto.title as Prisma.InputJsonValue,
      description: dto.description as Prisma.InputJsonValue,
      tag: dto.tag,
      type: dto.type,
      region: dto.region,
      year: dto.year,
      imageUrl: dto.imageUrl,
      metrics: dto.metrics as Prisma.InputJsonValue,
      order: dto.order,
    };
  }
}
