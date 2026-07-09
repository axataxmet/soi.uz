import { Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EtenderService } from './etender.service';
import { EtenderLotQueryDto } from './dto/etender-query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

// e-tender (UZEX) lots. Public reads are served from our PostgreSQL cache;
// only the scheduled sync (or an admin-triggered one) touches the upstream.
@ApiTags('etender')
@Controller('etender')
export class EtenderController {
  constructor(private readonly etender: EtenderService) {}

  @Public()
  @Get('lots')
  @ApiOperation({ summary: 'Список лотов e-tender (из кэша, публичный)' })
  listLots(@Query() q: EtenderLotQueryDto) {
    return this.etender.listLots(q);
  }

  @Public()
  @Get('lots/:externalId')
  @ApiOperation({ summary: 'Лот e-tender по внешнему id (из кэша, публичный)' })
  getLot(@Param('externalId', ParseIntPipe) externalId: number) {
    return this.etender.getLot(externalId);
  }

  @Get('sync-logs')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Журнал синхронизации (админ)' })
  syncLogs() {
    return this.etender.recentSyncLogs();
  }

  @Post('sync')
  @HttpCode(202)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Запустить синхронизацию вручную (админ)' })
  triggerSync() {
    return this.etender.syncAll('manual');
  }
}
