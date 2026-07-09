import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { AttrSchemaDto } from '../attr-schema';

// Товарная группа — листовой уровень дерева типов (ЭКГ-аппараты, УЗИ-сканеры…).
export class CreateProductGroupDto {
  @ApiProperty({ description: 'ID подкатегории-родителя' })
  @IsString()
  subcatId: string;

  @ApiProperty({ type: I18nDto })
  @ValidateNested() @Type(() => I18nDto)
  name: I18nDto;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @Type(() => Number) @IsInt()
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ type: AttrSchemaDto, description: 'Специфические поля группы (channels, probe_types…)' })
  @IsOptional() @ValidateNested() @Type(() => AttrSchemaDto)
  attrSchema?: AttrSchemaDto;
}

export class UpdateProductGroupDto extends PartialType(CreateProductGroupDto) {}
