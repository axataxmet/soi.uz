import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CatalogSpecsService } from './catalog-specs.service';
import {
  CreateSpecCategoryDto,
  QuerySpecCategoryDto,
  UpdateSpecCategoryDto,
} from './dto/spec-category.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

// Направления медицины (плоский список, вторая независимая ось классификации товара).
@ApiTags('catalog-specs')
@Controller('spec-categories')
export class CatalogSpecsController {
  constructor(private readonly specs: CatalogSpecsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Активные направления медицины (публичный)' })
  findPublic(@Query() q: QuerySpecCategoryDto) {
    return this.specs.findPublic(q);
  }

  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  findAllAdmin(@Query() q: QuerySpecCategoryDto) {
    return this.specs.findAllAdmin(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specs.findOne(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateSpecCategoryDto) {
    return this.specs.createSpec(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateSpecCategoryDto) {
    return this.specs.updateSpec(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.specs.remove(id);
  }
}
