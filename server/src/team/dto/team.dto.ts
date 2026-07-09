import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
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
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export class QueryTeamDto extends PaginationDto {}
