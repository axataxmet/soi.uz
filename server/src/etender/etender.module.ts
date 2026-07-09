import { Module } from '@nestjs/common';
import { EtenderController } from './etender.controller';
import { EtenderService } from './etender.service';
import { EtenderAdapter } from './etender.adapter';

@Module({
  controllers: [EtenderController],
  providers: [EtenderService, EtenderAdapter],
  exports: [EtenderService],
})
export class EtenderModule {}
