import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { CatalogTypesService } from '../catalog-types/catalog-types.service';
import { MediaService } from '../media/media.service';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './dto/product.dto';

const PUBLISHER_ROLES: Role[] = [Role.SUPERADMIN, Role.ADMIN, Role.EDITOR];

const LIST_INCLUDE = {
  manufacturer: true,
  media: { where: { isMain: true }, take: 1 },
  groups: { include: { group: true } },
  specs: { include: { spec: true } },
  prices: { where: { active: true } }, // публичный каталог показывает цену
} satisfies Prisma.ProductInclude;

const DETAIL_INCLUDE = {
  manufacturer: true,
  media: { orderBy: { order: 'asc' as const } },
  groups: { include: { group: { include: { subcat: { include: { category: true } } } } } },
  specs: { include: { spec: true } },
  prices: { where: { active: true } },
  stocks: true,
  regDocuments: true,
  compatAsEquip: { include: { consumable: true } },
  compatAsConsumable: { include: { equipment: true } },
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalogTypes: CatalogTypesService,
    private readonly media: MediaService,
  ) {}

  findPublic(q: QueryProductDto) {
    return this.list({ status: ProductStatus.ACTIVE }, q, LIST_INCLUDE);
  }

  findAllAdmin(q: QueryProductDto) {
    const where: Prisma.ProductWhereInput = {};
    if (q.status) where.status = q.status;
    return this.list(where, q, LIST_INCLUDE);
  }

  async findOnePublic(id: string) {
    const item = await this.prisma.product.findFirst({
      where: { id, status: ProductStatus.ACTIVE },
      include: DETAIL_INCLUDE,
    });
    if (!item) throw new NotFoundException('Товар не найден');
    return item;
  }

  async findOneAdmin(id: string) {
    const item = await this.prisma.product.findUnique({ where: { id }, include: DETAIL_INCLUDE });
    if (!item) throw new NotFoundException('Товар не найден');
    return item;
  }

  async create(dto: CreateProductDto, role: Role) {
    const groupIds = dto.groupIds ?? [];
    await this.assertAttrsValid(groupIds, dto.attrs);

    const product = await this.prisma.product.create({
      data: {
        sku: dto.sku,
        gtin: dto.gtin,
        name: dto.name as Prisma.InputJsonValue,
        description: dto.description as Prisma.InputJsonValue,
        manufacturerId: dto.manufacturerId,
        status: this.resolveStatus(dto.status, role),
        attrs: dto.attrs as Prisma.InputJsonValue,
        badge: dto.badge,
        isNew: dto.isNew,
        inStock: dto.inStock,
        popularity: dto.popularity,
        related: dto.related,
      },
    });

    if (groupIds.length) {
      await this.prisma.productGroupItem.createMany({
        data: groupIds.map((groupId) => ({ productId: product.id, groupId })),
        skipDuplicates: true,
      });
      await Promise.all(groupIds.map((id) => this.catalogTypes.recomputeVisibility(id)));
    }
    if (dto.specCategoryIds?.length) {
      await this.prisma.productSpec.createMany({
        data: dto.specCategoryIds.map((specId) => ({ productId: product.id, specId })),
        skipDuplicates: true,
      });
    }

    return this.findOneAdmin(product.id);
  }

  async update(id: string, dto: UpdateProductDto, role: Role) {
    await this.ensureExists(id);

    // attrs валидируем против будущего набора групп (если он передан) либо текущего.
    if (dto.attrs !== undefined) {
      const groupIds = dto.groupIds ?? (await this.currentGroupIds(id));
      await this.assertAttrsValid(groupIds, dto.attrs);
    }

    const data: Prisma.ProductUpdateInput = {
      sku: dto.sku,
      gtin: dto.gtin,
      name: dto.name as Prisma.InputJsonValue,
      description: dto.description as Prisma.InputJsonValue,
      attrs: dto.attrs as Prisma.InputJsonValue,
      badge: dto.badge,
      isNew: dto.isNew,
      inStock: dto.inStock,
      popularity: dto.popularity,
      related: dto.related,
    };
    if (dto.manufacturerId !== undefined) {
      data.manufacturer = dto.manufacturerId
        ? { connect: { id: dto.manufacturerId } }
        : { disconnect: true };
    }
    if (dto.status !== undefined) data.status = this.resolveStatus(dto.status, role);

    await this.prisma.product.update({ where: { id }, data });

    if (dto.groupIds !== undefined) {
      await this.syncGroups(id, dto.groupIds);
    }
    if (dto.specCategoryIds !== undefined) {
      await this.prisma.productSpec.deleteMany({ where: { productId: id } });
      if (dto.specCategoryIds.length) {
        await this.prisma.productSpec.createMany({
          data: dto.specCategoryIds.map((specId) => ({ productId: id, specId })),
          skipDuplicates: true,
        });
      }
    }

    return this.findOneAdmin(id);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    const affected = await this.prisma.productGroupItem.findMany({
      where: { productId: id },
      select: { groupId: true },
    });
    const productFiles = await this.prisma.product.findUnique({
      where: { id },
      select: {
        media: { select: { url: true } },
        regDocuments: { select: { fileUrl: true } },
      },
    });
    await this.prisma.product.delete({ where: { id } }); // cascades groups/specs/media/compat/price/stock/regDocs
    await Promise.all(affected.map((a) => this.catalogTypes.recomputeVisibility(a.groupId)));
    const urls = new Set([
      ...(productFiles?.media.map((m) => m.url) ?? []),
      ...(productFiles?.regDocuments.map((d) => d.fileUrl).filter(Boolean) ?? []),
    ]);
    await Promise.all([...urls].map((url) => this.media.removeByUrlIfUnused(url)));
    return { success: true };
  }

  // ── helpers ──
  private async list(where: Prisma.ProductWhereInput, q: QueryProductDto, include: Prisma.ProductInclude) {
    const finalWhere: Prisma.ProductWhereInput = { ...where };
    if (q.manufacturerId) finalWhere.manufacturerId = q.manufacturerId;
    if (q.groupId) finalWhere.groups = { some: { groupId: q.groupId } };
    if (q.specCategoryId) finalWhere.specs = { some: { specId: q.specCategoryId } };
    if (q.search) finalWhere.sku = { contains: q.search, mode: 'insensitive' };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: finalWhere,
        include,
        orderBy: [{ createdAt: 'desc' }],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.product.count({ where: finalWhere }),
    ]);
    return paginate(data, total, q.page, q.limit);
  }

  private async assertAttrsValid(groupIds: string[], attrs: Record<string, unknown> | undefined) {
    const errors = await this.catalogTypes.validateProductAttrs(groupIds, attrs);
    if (errors.length) throw new BadRequestException({ message: 'Ошибка атрибутов товара', errors });
  }

  private currentGroupIds(productId: string) {
    return this.prisma.productGroupItem
      .findMany({ where: { productId }, select: { groupId: true } })
      .then((rows) => rows.map((r) => r.groupId));
  }

  // Приводит набор групп товара к переданному списку; пересчитывает видимость только у
  // затронутых (добавленных или удалённых) групп.
  private async syncGroups(productId: string, groupIds: string[]) {
    const current = await this.prisma.productGroupItem.findMany({
      where: { productId },
      select: { groupId: true },
    });
    const currentIds = new Set(current.map((c) => c.groupId));
    const nextIds = new Set(groupIds);
    const toAdd = groupIds.filter((id) => !currentIds.has(id));
    const toRemove = [...currentIds].filter((id) => !nextIds.has(id));

    if (toRemove.length) {
      await this.prisma.productGroupItem.deleteMany({ where: { productId, groupId: { in: toRemove } } });
    }
    if (toAdd.length) {
      await this.prisma.productGroupItem.createMany({
        data: toAdd.map((groupId) => ({ productId, groupId })),
        skipDuplicates: true,
      });
    }
    await Promise.all([...toAdd, ...toRemove].map((id) => this.catalogTypes.recomputeVisibility(id)));
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.product.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Товар не найден');
  }

  // Контент-менеджер может сохранять только черновик; публикация — с роли редактора и выше.
  private resolveStatus(requested: ProductStatus | undefined, role: Role): ProductStatus {
    if (requested === ProductStatus.ACTIVE && !PUBLISHER_ROLES.includes(role)) {
      return ProductStatus.DRAFT;
    }
    return requested ?? ProductStatus.DRAFT;
  }
}
