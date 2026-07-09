import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { I18nDto } from '../common/dto/i18n.dto';

// Типы полей динамической формы товара. Формат хранится в attrSchema (jsonb) на каждом
// уровне дерева типов и НАСЛЕДУЕТСЯ вниз: category → subcategory → group.
export enum AttrFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}

export class AttrFieldDto {
  @ApiProperty({ description: 'Ключ поля в Product.attrs (напр. channels)' })
  @IsString()
  key: string;

  @ApiProperty({ type: I18nDto })
  @ValidateNested() @Type(() => I18nDto)
  label: I18nDto;

  @ApiProperty({ enum: AttrFieldType })
  @IsEnum(AttrFieldType)
  type: AttrFieldType;

  @ApiPropertyOptional({ example: 'мм' })
  @IsOptional() @IsString()
  unit?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Варианты для select/multiselect' })
  @IsOptional() @IsArray() @IsString({ each: true })
  options?: string[];
}

export class AttrSchemaDto {
  @ApiProperty({ type: [AttrFieldDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => AttrFieldDto)
  fields: AttrFieldDto[];
}

// ── Слияние и валидация (runtime, работает с «сырым» jsonb) ──

export type AttrSchemaLevel = 'category' | 'subcategory' | 'group';

export interface EffectiveAttrField extends AttrFieldDto {
  source: AttrSchemaLevel; // с какого уровня пришло поле — для подсветки наследования в админке
}

interface RawSchema {
  fields?: unknown;
}

// Сливает схемы по уровням; поле с тем же key, объявленное ниже, переопределяет верхнее.
// Порядок аргументов — сверху вниз (category, subcategory, group).
export function mergeAttrSchemas(
  levels: Array<{ schema: unknown; source: AttrSchemaLevel }>,
): { fields: EffectiveAttrField[] } {
  const byKey = new Map<string, EffectiveAttrField>();
  for (const { schema, source } of levels) {
    const fields = (schema as RawSchema | null | undefined)?.fields;
    if (!Array.isArray(fields)) continue;
    for (const f of fields) {
      if (!f || typeof (f as AttrFieldDto).key !== 'string') continue;
      byKey.set((f as AttrFieldDto).key, { ...(f as AttrFieldDto), source });
    }
  }
  return { fields: [...byKey.values()] };
}

// Проверяет Product.attrs против эффективной схемы. Возвращает список ошибок (пустой = ок).
// Лишние ключи не запрещаются — только required и соответствие типа/вариантов.
export function validateAttrs(
  schema: { fields: EffectiveAttrField[] },
  attrs: Record<string, unknown> | null | undefined,
): string[] {
  const errors: string[] = [];
  const values = attrs ?? {};
  for (const f of schema.fields) {
    const v = values[f.key];
    const present = v !== undefined && v !== null && v !== '';
    if (f.required && !present) {
      errors.push(`Поле «${f.key}» обязательно`);
      continue;
    }
    if (!present) continue;
    switch (f.type) {
      case AttrFieldType.NUMBER:
        if (typeof v !== 'number' && Number.isNaN(Number(v)))
          errors.push(`Поле «${f.key}» должно быть числом`);
        break;
      case AttrFieldType.BOOLEAN:
        if (typeof v !== 'boolean') errors.push(`Поле «${f.key}» должно быть true/false`);
        break;
      case AttrFieldType.SELECT:
        if (f.options?.length && !f.options.includes(String(v)))
          errors.push(`Поле «${f.key}»: значение вне списка вариантов`);
        break;
      case AttrFieldType.MULTISELECT:
        if (!Array.isArray(v)) errors.push(`Поле «${f.key}» должно быть списком`);
        else if (f.options?.length && v.some((x) => !f.options!.includes(String(x))))
          errors.push(`Поле «${f.key}»: значение вне списка вариантов`);
        break;
    }
  }
  return errors;
}
