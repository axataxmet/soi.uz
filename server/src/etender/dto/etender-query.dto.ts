import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

// Public query for cached tender lots (served from our DB, never upstream).
export class EtenderLotQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Источник (ETENDER_TENDER, BIZNESXARID, UZMEDIMPEX_TENDER, …)' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Тип записи', enum: ['lot', 'news'] })
  @IsOptional()
  @IsIn(['lot', 'news'])
  kind?: 'lot' | 'news';

  @ApiPropertyOptional({ description: 'Мед. категория', enum: ['equipment', 'furniture', 'instruments', 'consumables', 'drugs', 'other'] })
  @IsOptional()
  @IsIn(['equipment', 'furniture', 'instruments', 'consumables', 'drugs', 'other'])
  medCategory?: string;

  @ApiPropertyOptional({ description: 'Фильтр по региону (по названию, частичное совпадение)' })
  @IsOptional()
  @IsString()
  regionName?: string;

  @ApiPropertyOptional({ description: 'active | all | closed', default: 'active' })
  @IsOptional()
  @IsIn(['active', 'all', 'closed'])
  state?: 'active' | 'all' | 'closed' = 'active';
}
