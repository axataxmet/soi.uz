import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// Одна цена на товар от внутреннего продавца (ИНДУСТРИЯ ЗДОРОВЬЯ) — seller/warehouse скрыты от админки.
export class UpsertProductPriceDto {
  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Зачёркнутая цена (до скидки)' })
  @IsOptional() @Type(() => Number) @IsNumber()
  oldPrice?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber()
  wholesalePrice?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  priceOnRequest?: boolean;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber()
  priceWithVat?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber()
  priceWithoutVat?: number;

  @ApiPropertyOptional({ default: 'UZS' })
  @IsOptional() @IsString()
  currency?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  active?: boolean;
}
