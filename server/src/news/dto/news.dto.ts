import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PublishStatus } from '@prisma/client';
import { I18nDto } from '../../common/dto/i18n.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateNewsDto {
  @ApiPropertyOptional({ default: 'new' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ type: I18nDto })
  @ValidateNested()
  @Type(() => I18nDto)
  title: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  excerpt?: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  body?: I18nDto;

  @ApiPropertyOptional({ description: 'URL обложки' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ description: 'Ссылка на ролик YouTube (для type = "video")' })
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'ISO date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export class QueryNewsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}
