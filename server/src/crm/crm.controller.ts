import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CrmService } from './crm.service';
import { UpdateCrmConfigDto } from './dto/crm-config.dto';
import { Roles } from '../auth/decorators/roles.decorator';

// Admin-only: config includes API/bot secrets and must never be reachable
// without auth (unlike SettingsController's GET /settings/:key, which is public).
@ApiTags('crm')
@Controller('crm')
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @Get('config')
  @ApiOperation({ summary: 'CRM/Telegram relay config (только админ)' })
  getConfig() {
    return this.crm.getConfig();
  }

  @Put('config')
  @ApiOperation({ summary: 'Сохранить CRM/Telegram relay config' })
  setConfig(@Body() dto: UpdateCrmConfigDto) {
    return this.crm.setConfig(dto);
  }
}
