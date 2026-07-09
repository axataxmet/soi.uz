import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CatalogTypesService } from './catalog-types.service';
import { CreateTypeCategoryDto, UpdateTypeCategoryDto } from './dto/type-category.dto';
import { CreateTypeSubcategoryDto, UpdateTypeSubcategoryDto } from './dto/type-subcategory.dto';
import { CreateProductGroupDto, UpdateProductGroupDto } from './dto/product-group.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

// Дерево типов товара: type_categories → type_subcategories → product_groups.
@ApiTags('catalog-types')
@Controller('type-categories')
export class CatalogTypesController {
  constructor(private readonly svc: CatalogTypesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Дерево типов (публичный) — активные + только видимые группы' })
  treePublic() {
    return this.svc.findTreePublic();
  }

  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Полное дерево типов всех 3 уровней (админ)' })
  treeAdmin() {
    return this.svc.findTreeAdmin();
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  createCategory(@Body() dto: CreateTypeCategoryDto) {
    return this.svc.createCategory(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  updateCategory(@Param('id') id: string, @Body() dto: UpdateTypeCategoryDto) {
    return this.svc.updateCategory(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  removeCategory(@Param('id') id: string) {
    return this.svc.removeCategory(id);
  }
}

@ApiTags('catalog-types')
@Controller('type-subcategories')
export class TypeSubcategoriesController {
  constructor(private readonly svc: CatalogTypesService) {}

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateTypeSubcategoryDto) {
    return this.svc.createSubcategory(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateTypeSubcategoryDto) {
    return this.svc.updateSubcategory(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.svc.removeSubcategory(id);
  }
}

@ApiTags('catalog-types')
@Controller('product-groups')
export class ProductGroupsController {
  constructor(private readonly svc: CatalogTypesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Товарные группы (опц. ?subcatId=)' })
  list(@Query('subcatId') subcatId?: string) {
    return this.svc.listGroups(subcatId);
  }

  @Public()
  @Get(':id/schema')
  @ApiOperation({ summary: 'Эффективная схема атрибутов группы (merge category→subcategory→group)' })
  schema(@Param('id') id: string) {
    return this.svc.getEffectiveSchema(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateProductGroupDto) {
    return this.svc.createGroup(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateProductGroupDto) {
    return this.svc.updateGroup(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.svc.removeGroup(id);
  }
}
