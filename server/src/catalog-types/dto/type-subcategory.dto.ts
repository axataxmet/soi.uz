import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { AttrSchemaDto } from '../attr-schema';

export class CreateTypeSubcategoryDto {
  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ type: I18nDto })
  @ValidateNested() @Type(() => I18nDto)
  name: I18nDto;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @Type(() => Number) @IsInt()
  order?: number;

  @ApiPropertyOptional({ type: AttrSchemaDto, description: 'Поля уровня подкатегории (добавляются к унаследованным)' })
  @IsOptional() @ValidateNested() @Type(() => AttrSchemaDto)
  attrSchema?: AttrSchemaDto;
}

export class UpdateTypeSubcategoryDto extends PartialType(CreateTypeSubcategoryDto) {}
