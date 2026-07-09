import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RegDocStatus, RegDocType, RiskClass } from '@prisma/client';

export class CreateRegDocumentDto {
  @ApiPropertyOptional({ enum: RegDocType })
  @IsOptional() @IsEnum(RegDocType)
  type?: RegDocType;

  @ApiPropertyOptional({ description: 'Номер РУ / сертификата' })
  @IsOptional() @IsString()
  number?: string;

  @ApiPropertyOptional({ enum: RiskClass, description: 'Класс риска медизделия' })
  @IsOptional() @IsEnum(RiskClass)
  classRisk?: RiskClass;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  issuedAt?: string;

  @ApiPropertyOptional({ description: 'NULL = бессрочно' })
  @IsOptional() @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({ example: 'Агентство по развитию рынка медизделий РУз' })
  @IsOptional() @IsString()
  issuer?: string;

  @ApiPropertyOptional({ description: 'URL скана документа (media API)' })
  @IsOptional() @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ enum: RegDocStatus, default: RegDocStatus.NO_DATA })
  @IsOptional() @IsEnum(RegDocStatus)
  status?: RegDocStatus;
}

export class UpdateRegDocumentDto extends PartialType(CreateRegDocumentDto) {}
