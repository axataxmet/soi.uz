import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EtenderController } from './etender.controller';
import { EtenderService } from './etender.service';
import { EtenderAdapter } from './etender.adapter';
import { GovUzAdapter } from './govuz.adapter';
import { EtenderPrismaService } from './etender-prisma.service';

// Self-contained multi-source tender module: its own Prisma client/pool (etender
// schema), its own scheduler, pluggable source adapters, no dependency on the
// main PrismaService — ready to be lifted into a standalone service.
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EtenderController],
  providers: [EtenderService, EtenderAdapter, GovUzAdapter, EtenderPrismaService],
  exports: [EtenderService],
})
export class EtenderModule {}
