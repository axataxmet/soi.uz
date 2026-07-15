import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: I18nDto, description: 'Должность' })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  role?: I18nDto;

  @ApiPropertyOptional({ description: 'URL фото' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ description: 'Показывать в блоке «Наши инженеры» на странице «Сервис и поддержка»', default: false })
  @IsOptional()
  @IsBoolean()
  service?: boolean;
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export class QueryTeamDto extends PaginationDto {}
