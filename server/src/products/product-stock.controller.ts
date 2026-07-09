import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductStockService } from './product-stock.service';
import { UpsertProductStockDto } from './dto/product-stock.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CONTENT_ROLES } from '../common/content-roles';

// Остатки — не публичные (покупатель видит только Product.inStock).
@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductStockController {
  constructor(private readonly stock: ProductStockService) {}

  @Get(':productId/stock')
  @Roles(...CONTENT_ROLES)
  find(@Param('productId') productId: string) {
    return this.stock.find(productId);
  }

  @Put(':productId/stock')
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Установить остаток (внутренний склад)' })
  upsert(@Param('productId') productId: string, @Body() dto: UpsertProductStockDto) {
    return this.stock.upsert(productId, dto);
  }
}
