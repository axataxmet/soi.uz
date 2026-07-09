import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateSpecCategoryDto {
  @ApiProperty({ type: I18nDto, description: 'Направление медицины' })
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
}

export class UpdateSpecCategoryDto extends PartialType(CreateSpecCategoryDto) {}

export class QuerySpecCategoryDto extends PaginationDto {}
