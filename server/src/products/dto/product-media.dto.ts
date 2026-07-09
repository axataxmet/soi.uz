import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreateProductMediaDto {
  @ApiProperty({ description: 'URL файла (media API)' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ enum: MediaType, default: MediaType.PHOTO })
  @IsOptional() @IsEnum(MediaType)
  type?: MediaType;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  altText?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional() @Type(() => Number) @IsInt()
  order?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  isMain?: boolean;
}

export class UpdateProductMediaDto extends PartialType(CreateProductMediaDto) {}
