import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from './dto/product.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Товары (публичный) — только ACTIVE' })
  findPublic(@Query() q: QueryProductDto) {
    return this.products.findPublic(q);
  }

  @Get('manage/all')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Товары (админ) — любой статус' })
  findAllAdmin(@Query() q: QueryProductDto) {
    return this.products.findAllAdmin(q);
  }

  @Get('manage/:id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Товар (админ, детально) — любой статус' })
  findOneAdmin(@Param('id') id: string) {
    return this.products.findOneAdmin(id);
  }

  @Public()
  @Get(':id')
  findOnePublic(@Param('id') id: string) {
    return this.products.findOnePublic(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateProductDto, @CurrentUser('role') role: Role) {
    return this.products.create(dto, role);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser('role') role: Role) {
    return this.products.update(id, dto, role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }
}
