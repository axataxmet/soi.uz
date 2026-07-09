import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProductMediaService } from './product-media.service';
import { CreateProductMediaDto, UpdateProductMediaDto } from './dto/product-media.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('products')
@Controller('products')
export class ProductMediaController {
  constructor(private readonly media: ProductMediaService) {}

  @Public()
  @Get(':productId/media')
  @ApiOperation({ summary: 'Галерея товара' })
  findAll(@Param('productId') productId: string) {
    return this.media.findAll(productId);
  }

  @Post(':productId/media')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  create(@Param('productId') productId: string, @Body() dto: CreateProductMediaDto) {
    return this.media.create(productId, dto);
  }

  @Patch('media/:id')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateProductMediaDto) {
    return this.media.update(id, dto);
  }

  @Delete('media/:id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.media.remove(id);
  }
}
