import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// Multilingual value: { ru, uz, en }. Stored as JSON in Postgres.
export class I18nDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ru?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uz?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  en?: string;
}
