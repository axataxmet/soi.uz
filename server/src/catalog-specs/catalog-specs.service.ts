import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import {
  CreateSpecCategoryDto,
  QuerySpecCategoryDto,
  UpdateSpecCategoryDto,
} from './dto/spec-category.dto';

@Injectable()
export class CatalogSpecsService extends BaseCrudService {
  constructor(prisma: PrismaService) {
    super(prisma, { model: 'specCategory', defaultOrderBy: [{ order: 'asc' }] });
  }

  findPublic(q: QuerySpecCategoryDto) {
    return this.paginate({ active: true }, q);
  }

  findAllAdmin(q: QuerySpecCategoryDto) {
    return this.paginate({}, q);
  }

  findOne(id: string) {
    return this.getOneOrFail({ id });
  }

  createSpec(dto: CreateSpecCategoryDto) {
    return this.create(this.toData(dto));
  }

  updateSpec(id: string, dto: UpdateSpecCategoryDto) {
    return this.update(id, this.toData(dto));
  }

  private toData(dto: CreateSpecCategoryDto | UpdateSpecCategoryDto) {
    return {
      name: dto.name as Prisma.InputJsonValue,
      slug: dto.slug,
      order: dto.order,
      active: dto.active,
    };
  }
}
