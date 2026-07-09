import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeCategoryDto, UpdateTypeCategoryDto } from './dto/type-category.dto';
import { CreateTypeSubcategoryDto, UpdateTypeSubcategoryDto } from './dto/type-subcategory.dto';
import { CreateProductGroupDto, UpdateProductGroupDto } from './dto/product-group.dto';
import { EffectiveAttrField, mergeAttrSchemas, validateAttrs } from './attr-schema';

// Порог, при котором товарная группа становится видимой на витрине (см. решение по A3:
// «каталог открывается по мере наполнения»).
const VISIBILITY_THRESHOLD = 3;

const asJson = (v: unknown): Prisma.InputJsonValue | undefined =>
  v === undefined ? undefined : (v as Prisma.InputJsonValue);

@Injectable()
export class CatalogTypesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── публичное дерево: активные категории → подкатегории с ≥1 видимой группой → видимые группы ──
  findTreePublic() {
    return this.prisma.typeCategory.findMany({
      where: { active: true, subcategories: { some: { groups: { some: { visible: true } } } } },
      orderBy: { order: 'asc' },
      include: {
        subcategories: {
          where: { groups: { some: { visible: true } } },
          orderBy: { order: 'asc' },
          include: { groups: { where: { visible: true }, orderBy: { order: 'asc' } } },
        },
      },
    });
  }

  // ── админ: полное дерево всех трёх уровней ──
  findTreeAdmin() {
    return this.prisma.typeCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        subcategories: {
          orderBy: { order: 'asc' },
          include: { groups: { orderBy: { order: 'asc' } } },
        },
      },
    });
  }

  // ── категории ──
  createCategory(dto: CreateTypeCategoryDto) {
    return this.prisma.typeCategory.create({
      data: {
        name: dto.name as Prisma.InputJsonValue,
        slug: dto.slug,
        order: dto.order,
        active: dto.active,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async updateCategory(id: string, dto: UpdateTypeCategoryDto) {
    await this.ensureCategory(id);
    return this.prisma.typeCategory.update({
      where: { id },
      data: {
        name: asJson(dto.name),
        slug: dto.slug,
        order: dto.order,
        active: dto.active,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async removeCategory(id: string) {
    await this.ensureCategory(id);
    await this.prisma.typeCategory.delete({ where: { id } });
    return { success: true };
  }

  // ── подкатегории ──
  createSubcategory(dto: CreateTypeSubcategoryDto) {
    return this.prisma.typeSubcategory.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name as Prisma.InputJsonValue,
        slug: dto.slug,
        order: dto.order,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async updateSubcategory(id: string, dto: UpdateTypeSubcategoryDto) {
    await this.ensureSubcategory(id);
    return this.prisma.typeSubcategory.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        name: asJson(dto.name),
        slug: dto.slug,
        order: dto.order,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async removeSubcategory(id: string) {
    await this.ensureSubcategory(id);
    await this.prisma.typeSubcategory.delete({ where: { id } });
    return { success: true };
  }

  // ── товарные группы ──
  listGroups(subcatId?: string) {
    return this.prisma.productGroup.findMany({
      where: subcatId ? { subcatId } : {},
      orderBy: { order: 'asc' },
    });
  }

  createGroup(dto: CreateProductGroupDto) {
    return this.prisma.productGroup.create({
      data: {
        subcatId: dto.subcatId,
        name: dto.name as Prisma.InputJsonValue,
        slug: dto.slug,
        order: dto.order,
        active: dto.active,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async updateGroup(id: string, dto: UpdateProductGroupDto) {
    await this.ensureGroup(id);
    return this.prisma.productGroup.update({
      where: { id },
      data: {
        subcatId: dto.subcatId,
        name: asJson(dto.name),
        slug: dto.slug,
        order: dto.order,
        active: dto.active,
        attrSchema: asJson(dto.attrSchema),
      },
    });
  }

  async removeGroup(id: string) {
    await this.ensureGroup(id);
    await this.prisma.productGroup.delete({ where: { id } });
    return { success: true };
  }

  // Эффективная схема формы товара = merge(category → subcategory → group).
  // Используется админкой (динамическая форма) и ProductsService (валидация attrs).
  async getEffectiveSchema(groupId: string): Promise<{ fields: EffectiveAttrField[] }> {
    const group = await this.prisma.productGroup.findUnique({
      where: { id: groupId },
      include: { subcat: { include: { category: true } } },
    });
    if (!group) throw new NotFoundException('Товарная группа не найдена');
    return mergeAttrSchemas([
      { schema: group.subcat.category.attrSchema, source: 'category' },
      { schema: group.subcat.attrSchema, source: 'subcategory' },
      { schema: group.attrSchema, source: 'group' },
    ]);
  }

  // Сводная эффективная схема по нескольким группам (у товара может быть несколько групп).
  async getEffectiveSchemaForGroups(groupIds: string[]): Promise<{ fields: EffectiveAttrField[] }> {
    const merged = new Map<string, EffectiveAttrField>();
    for (const gid of groupIds) {
      const { fields } = await this.getEffectiveSchema(gid);
      for (const f of fields) merged.set(f.key, f);
    }
    return { fields: [...merged.values()] };
  }

  async validateProductAttrs(groupIds: string[], attrs: Record<string, unknown> | null | undefined) {
    if (!groupIds.length) return [];
    const schema = await this.getEffectiveSchemaForGroups(groupIds);
    return validateAttrs(schema, attrs);
  }

  // Пересчитывает product_count/visible для группы. Вызывается ProductsService при любом
  // изменении привязок товар↔группа (нет БД-триггера — Postgres GENERATED-колонки не читают
  // другие таблицы).
  async recomputeVisibility(groupId: string) {
    const count = await this.prisma.productGroupItem.count({ where: { groupId } });
    await this.prisma.productGroup.update({
      where: { id: groupId },
      data: { productCount: count, visible: count >= VISIBILITY_THRESHOLD },
    });
  }

  private async ensureCategory(id: string) {
    const found = await this.prisma.typeCategory.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Категория не найдена');
  }

  private async ensureSubcategory(id: string) {
    const found = await this.prisma.typeSubcategory.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Подкатегория не найдена');
  }

  private async ensureGroup(id: string) {
    const found = await this.prisma.productGroup.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Товарная группа не найдена');
  }
}
