import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Role } from '@prisma/client';
import { SettingsService } from './settings.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

class SetSettingDto {
  @ApiProperty({ description: 'Любое JSON-значение (объект/массив/строка)' })
  @IsDefined()
  value: unknown;
}

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Все настройки' })
  findAll() {
    return this.settings.findAll();
  }

  @Public()
  @Get(':key')
  @ApiOperation({
    summary: 'Настройка по ключу (например seo, contacts)',
    description:
      'Всегда 200. Если настройка не задана, возвращается {"key": "...", "value": null} — ' +
      'это признак «не сконфигурировано», а не значение: подставляйте свои значения по умолчанию.',
  })
  get(@Param('key') key: string) {
    return this.settings.get(key);
  }

  @Put(':key')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сохранить настройку' })
  set(@Param('key') key: string, @Body() dto: SetSettingDto) {
    return this.settings.set(key, dto.value);
  }
}
