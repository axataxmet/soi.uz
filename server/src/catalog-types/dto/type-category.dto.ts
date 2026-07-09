import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { AttrSchemaDto } from '../attr-schema';

export class CreateTypeCategoryDto {
  @ApiProperty({ type: I18nDto })
  @ValidateNested() @Type(() => I18nDto)
  name: I18nDto;

  @ApiProperty({ example: 'equipment' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @Type(() => Number) @IsInt()
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ type: AttrSchemaDto, description: 'Общие поля уровня категории (наследуются ниже)' })
  @IsOptional() @ValidateNested() @Type(() => AttrSchemaDto)
  attrSchema?: AttrSchemaDto;
}

export class UpdateTypeCategoryDto extends PartialType(CreateTypeCategoryDto) {}
