import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PublishStatus, ReviewType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryReviewDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ReviewType })
  @IsOptional()
  @IsEnum(ReviewType)
  type?: ReviewType;

  @ApiPropertyOptional({ enum: PublishStatus })
  @IsOptional()
  @IsEnum(PublishStatus)
  status?: PublishStatus;
}
