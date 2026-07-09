import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BrandsService } from './brands.service';
import { CreateBrandDto, QueryBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Список брендов' })
  findAll(@Query() q: QueryBrandDto) {
    return this.brands.findAll(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brands.findOne(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Body() dto: CreateBrandDto) {
    return this.brands.createBrand(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brands.updateBrand(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.brands.remove(id);
  }
}
