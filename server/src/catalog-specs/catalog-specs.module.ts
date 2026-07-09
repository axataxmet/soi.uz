import { Module } from '@nestjs/common';
import { CatalogSpecsService } from './catalog-specs.service';
import { CatalogSpecsController } from './catalog-specs.controller';

@Module({
  controllers: [CatalogSpecsController],
  providers: [CatalogSpecsService],
})
export class CatalogSpecsModule {}
