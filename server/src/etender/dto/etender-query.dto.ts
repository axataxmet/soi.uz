import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

// Public query for cached e-tender lots (served from our DB, never upstream).
export class EtenderLotQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Тип торговой системы (route :typeId)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;

  @ApiPropertyOptional({ description: 'Фильтр по региону (по названию, частичное совпадение)' })
  @IsOptional()
  @IsString()
  regionName?: string;

  @ApiPropertyOptional({ description: 'active | all | closed', default: 'active' })
  @IsOptional()
  @IsIn(['active', 'all', 'closed'])
  state?: 'active' | 'all' | 'closed' = 'active';
}
