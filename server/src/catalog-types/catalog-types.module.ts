import { Module } from '@nestjs/common';
import { CatalogTypesService } from './catalog-types.service';
import {
  CatalogTypesController,
  TypeSubcategoriesController,
  ProductGroupsController,
} from './catalog-types.controller';

@Module({
  controllers: [CatalogTypesController, TypeSubcategoriesController, ProductGroupsController],
  providers: [CatalogTypesService],
  exports: [CatalogTypesService], // используется ProductsService для пересчёта видимости/валидации
})
export class CatalogTypesModule {}
