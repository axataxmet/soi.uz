import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EtenderController } from './etender.controller';
import { EtenderService } from './etender.service';
import { EtenderAdapter } from './etender.adapter';
import { GovUzAdapter } from './govuz.adapter';
import { XaridAdapter } from './xarid.adapter';
import { XtXaridAdapter } from './xtxarid.adapter';
import { FarmaAdapter } from './farma.adapter';
import { MedicalFilter } from './medical-filter';
import { MedCategoryClassifier } from './med-category';
import { EtenderPrismaService } from './etender-prisma.service';

// Self-contained multi-source tender module: its own Prisma client/pool (etender
// schema), its own scheduler, pluggable source adapters, no dependency on the
// main PrismaService — ready to be lifted into a standalone service.
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EtenderController],
  providers: [EtenderService, EtenderAdapter, GovUzAdapter, XaridAdapter, XtXaridAdapter, FarmaAdapter, MedicalFilter, MedCategoryClassifier, EtenderPrismaService],
  exports: [EtenderService],
})
export class EtenderModule {}
