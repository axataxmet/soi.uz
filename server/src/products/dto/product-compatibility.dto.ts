import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// Создаётся со стороны оборудования: :productId в пути = equipmentId, consumableId — в теле.
export class CreateCompatibilityDto {
  @ApiProperty({ description: 'ID расходника (Product)' })
  @IsString()
  consumableId: string;

  @ApiPropertyOptional({ example: 'оригинальный | совместимый | универсальный' })
  @IsOptional() @IsString()
  notes?: string;
}
