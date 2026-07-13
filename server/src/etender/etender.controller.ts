import { Controller, Get, Header, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EtenderService } from './etender.service';
import { EtenderLotQueryDto } from './dto/etender-query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

// Tender lots aggregated from multiple sources (UZEX etender/biznesxarid,
// gov.uz UzMedImpex, …). Public reads are served from our PostgreSQL cache; only
// the daily sync (or an admin-triggered one) touches the upstreams.
@ApiTags('etender')
@Controller('etender')
export class EtenderController {
  constructor(private readonly etender: EtenderService) {}

  @Public()
  @Get('sources')
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({ summary: 'Список источников и число активных лотов (публичный)' })
  sources() {
    return this.etender.sources();
  }

  @Public()
  @Get('categories')
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({ summary: 'Мед. категории лотов + счётчики (публичный)' })
  categories() {
    return this.etender.categories();
  }

  @Public()
  @Get('lots')
  // Data refreshes once a day, so it is safe (and cheap under 1000+ traffic) to
  // let browsers/proxies cache the list briefly.
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({ summary: 'Список лотов (из кэша, публичный) — фильтр по source/kind' })
  listLots(@Query() q: EtenderLotQueryDto) {
    return this.etender.listLots(q);
  }

  @Public()
  @Get('lots/:source/:externalId')
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({ summary: 'Лот по (source, externalId) (из кэша, публичный)' })
  getLot(@Param('source') source: string, @Param('externalId') externalId: string) {
    return this.etender.getLot(source, externalId);
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
