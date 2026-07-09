import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCrmConfigDto {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ enum: ['proxy', 'direct'] })
  @IsIn(['proxy', 'direct'])
  mode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  proxyUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subdomain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pipelineId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  statusId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibleUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramChatId?: string;
}
