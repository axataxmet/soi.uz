import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Источник (id формы / страница)' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Доп. данные (JSON)' })
  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}

export class UpdateSubmissionStatusDto {
  @ApiProperty({ enum: SubmissionStatus })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;
}

export class QuerySubmissionDto extends PaginationDto {
  @ApiPropertyOptional({ enum: SubmissionStatus })
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}
