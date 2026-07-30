import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, registerDecorator, ValidationOptions } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

const MED_CATEGORY_IDS = ['equipment', 'furniture', 'instruments', 'consumables', 'drugs', 'other'];

// "other" or "other,drugs" — every element has to be a known category.
function IsMedCategoryList(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMedCategoryList',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !value.trim()) return false;
          const parts = value.split(',').map((v) => v.trim()).filter(Boolean);
          return parts.length > 0 && parts.every((p) => MED_CATEGORY_IDS.includes(p));
        },
        defaultMessage() {
          return `medCategory must be one or more of: ${MED_CATEGORY_IDS.join(', ')}`;
        },
      },
    });
  };
}

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

  /* Accepts one category or a comma-separated set. The showcase shows five
     categories, not six: "Прочее" there means other + drugs, and asking for both
     in one request is cheaper than two round trips. */
  @ApiPropertyOptional({
    description: 'Мед. категория или несколько через запятую (equipment, furniture, instruments, consumables, drugs, other)',
    example: 'other,drugs',
  })
  @IsOptional()
  @IsMedCategoryList()
  medCategory?: string;

  @ApiPropertyOptional({ description: 'Площадка мониторинга', enum: ['uzex', 'xt-xarid', 'uzmedimpex', 'farma'] })
  @IsOptional()
  @IsIn(['uzex', 'xt-xarid', 'uzmedimpex', 'farma'])
  platform?: string;

  @ApiPropertyOptional({ description: 'Фильтр по региону (по названию, частичное совпадение)' })
  @IsOptional()
  @IsString()
  regionName?: string;

  @ApiPropertyOptional({ description: 'active | all | closed', default: 'active' })
  @IsOptional()
  @IsIn(['active', 'all', 'closed'])
  state?: 'active' | 'all' | 'closed' = 'active';

  @ApiPropertyOptional({
    description:
      'Порядок: fresh — недавно опубликованные, closing — ближайшие по дедлайну. ' +
      'По умолчанию дедлайн по убыванию (лоты с запасом времени первыми).',
    enum: ['fresh', 'closing'],
  })
  @IsOptional()
  @IsIn(['fresh', 'closing'])
  sort?: 'fresh' | 'closing';
}
