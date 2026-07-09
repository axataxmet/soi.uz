import { Module } from '@nestjs/common';
import { CatalogTypesModule } from '../catalog-types/catalog-types.module';
import { MediaModule } from '../media/media.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductMediaService } from './product-media.service';
import { ProductMediaController } from './product-media.controller';
import { ProductCompatibilityService } from './product-compatibility.service';
import { ProductCompatibilityController } from './product-compatibility.controller';
import { ProductPriceService } from './product-price.service';
import { ProductPriceController } from './product-price.controller';
import { ProductStockService } from './product-stock.service';
import { ProductStockController } from './product-stock.controller';
import { RegDocumentsService } from './reg-documents.service';
import { RegDocumentsController } from './reg-documents.controller';

@Module({
  imports: [CatalogTypesModule, MediaModule], // для пересчёта видимости и очистки media
  controllers: [
    ProductsController,
    ProductMediaController,
    ProductCompatibilityController,
    ProductPriceController,
    ProductStockController,
    RegDocumentsController,
  ],
  providers: [
    ProductsService,
    ProductMediaService,
    ProductCompatibilityService,
    ProductPriceService,
    ProductStockService,
    RegDocumentsService,
  ],
})
export class ProductsModule {}
