import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PublishStatus } from '@prisma/client';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateCaseDto {
  @ApiProperty({ type: I18nDto })
  @ValidateNested()
  @Type(() => I18nDto)
  title: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  description?: I18nDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: '"gov" | "private" — for the /projects filter' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  year?: string;

  @ApiPropertyOptional({ description: 'URL изображения' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Произвольные метрики (JSON)' })
  @IsOptional()
  @IsObject()
  metrics?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;
}

export class UpdateCaseDto extends PartialType(CreateCaseDto) {}

export class QueryCaseDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}
