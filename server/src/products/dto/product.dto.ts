import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiPropertyOptional({ description: 'Штрихкод EAN/UPC/GTIN' })
  @IsOptional() @IsString()
  gtin?: string;

  @ApiProperty({ type: I18nDto })
  @ValidateNested() @Type(() => I18nDto)
  name: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional() @ValidateNested() @Type(() => I18nDto)
  description?: I18nDto;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  manufacturerId?: string;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsOptional() @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Атрибуты, уникальные для типа товара (channels, display, battery_h, …)' })
  @IsOptional() @IsObject()
  attrs?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  badge?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ default: 60 })
  @IsOptional() @Type(() => Number) @IsInt()
  popularity?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  related?: string[];

  @ApiPropertyOptional({ type: [String], description: 'ID товарных групп (product_group_items)' })
  @IsOptional() @IsArray() @IsString({ each: true })
  groupIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'ID направлений медицины (product_spec)' })
  @IsOptional() @IsArray() @IsString({ each: true })
  specCategoryIds?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class QueryProductDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString()
  manufacturerId?: string;

  @ApiPropertyOptional({ description: 'Фильтр по товарной группе' })
  @IsOptional() @IsString()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Фильтр по направлению медицины' })
  @IsOptional() @IsString()
  specCategoryId?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional() @IsEnum(ProductStatus)
  status?: ProductStatus;
}
