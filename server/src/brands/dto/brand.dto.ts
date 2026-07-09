import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

// Производитель (REST-путь /api/brands сохранён; за ним теперь модель Manufacturer).
export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional() @ValidateNested() @Type(() => I18nDto)
  nameI18n?: I18nDto;

  @ApiPropertyOptional({ description: 'Юридическое наименование' })
  @IsOptional() @IsString()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Страна (ISO 3166-1 alpha-2, напр. UZ, DE, CN)' })
  @IsOptional() @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'ИНН / налоговый номер' })
  @IsOptional() @IsString()
  inn?: string;

  @ApiPropertyOptional({ description: 'URL логотипа (media API)' })
  @IsOptional() @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  url?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  fixed?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @Type(() => Number) @IsInt()
  order?: number;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class QueryBrandDto extends PaginationDto {}
