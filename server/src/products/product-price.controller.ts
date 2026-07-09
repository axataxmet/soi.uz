import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductPriceService } from './product-price.service';
import { UpsertProductPriceDto } from './dto/product-price.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

@ApiTags('products')
@Controller('products')
export class ProductPriceController {
  constructor(private readonly price: ProductPriceService) {}

  @Public()
  @Get(':productId/price')
  find(@Param('productId') productId: string) {
    return this.price.find(productId);
  }

  @Put(':productId/price')
  @Roles(...CONTENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Установить цену (внутренний продавец ИНДУСТРИЯ ЗДОРОВЬЯ)' })
  upsert(@Param('productId') productId: string, @Body() dto: UpsertProductPriceDto) {
    return this.price.upsert(productId, dto);
  }
}
