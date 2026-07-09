import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PublishStatus, ReviewType } from '@prisma/client';
import { I18nDto } from '../../common/dto/i18n.dto';

export class CreateReviewDto {
  @ApiPropertyOptional({ enum: ReviewType, default: ReviewType.BUYER })
  @IsOptional()
  @IsEnum(ReviewType)
  type?: ReviewType;

  @ApiProperty({ type: I18nDto, description: 'Название организации' })
  @ValidateNested()
  @Type(() => I18nDto)
  company: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  region?: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  description?: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  quote?: I18nDto;

  @ApiPropertyOptional({ type: I18nDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => I18nDto)
  body?: I18nDto;

  @ApiPropertyOptional({ description: 'URL логотипа (из media API)' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'URL благодарственного письма' })
  @IsOptional()
  @IsString()
  letterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ enum: PublishStatus, default: PublishStatus.DRAFT })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;

  @ApiPropertyOptional({ description: 'ISO date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;
}
