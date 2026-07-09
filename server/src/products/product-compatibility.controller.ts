import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProductCompatibilityService } from './product-compatibility.service';
import { CreateCompatibilityDto } from './dto/product-compatibility.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('products')
@Controller('products')
export class ProductCompatibilityController {
  constructor(private readonly compat: ProductCompatibilityService) {}

  @Public()
  @Get(':productId/compatibility')
  @ApiOperation({ summary: 'Совместимые расходники/оборудование (обе стороны)' })
  findAll(@Param('productId') productId: string) {
    return this.compat.findAll(productId);
  }

  @Post(':productId/compatibility')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: ':productId — оборудование; в теле — id расходника' })
  create(@Param('productId') productId: string, @Body() dto: CreateCompatibilityDto) {
    return this.compat.create(productId, dto);
  }

  @Delete('compatibility/:id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.compat.remove(id);
  }
}
