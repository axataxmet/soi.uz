import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateBrandDto, QueryBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService extends BaseCrudService {
  constructor(prisma: PrismaService) {
    super(prisma, { model: 'manufacturer', defaultOrderBy: [{ order: 'asc' }, { name: 'asc' }] });
  }

  findAll(q: QueryBrandDto) {
    const where: Prisma.ManufacturerWhereInput = q.search
      ? { name: { contains: q.search, mode: 'insensitive' } }
      : {};
    return this.paginate(where, q);
  }

  findOne(id: string) {
    return this.getOneOrFail({ id });
  }

  createBrand(dto: CreateBrandDto) {
    return this.create(this.toData(dto));
  }

  updateBrand(id: string, dto: UpdateBrandDto) {
    return this.update(id, this.toData(dto));
  }

  /* Сайт производителя в модели называется website, а наружу и в админку он
     всегда ходил как url (см. ADAPTERS.brands в app/cms-remote.js: toFE читает
     r.website и кладёт в url, toAPI отправляет url обратно). Здесь url уходил
     в Prisma как есть — поля с таким именем у Manufacturer нет, и запрос падал
     с PrismaClientValidationError, то есть «Некорректные данные запроса».
     Undefined Prisma отбрасывает молча, поэтому ломались только бренды с
     заполненным сайтом — а это почти все. Принимаем оба имени, пишем в website. */
  private toData(dto: CreateBrandDto | UpdateBrandDto) {
    return {
      name: dto.name,
      nameI18n: dto.nameI18n as Prisma.InputJsonValue,
      legalName: dto.legalName,
      country: dto.country,
      inn: dto.inn,
      logoUrl: dto.logoUrl,
      website: dto.website ?? dto.url,
      fixed: dto.fixed,
      order: dto.order,
    };
  }
}
