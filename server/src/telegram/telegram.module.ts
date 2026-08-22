import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { CrmModule } from '../crm/crm.module';

/* Токен бота и id группы берутся из настроек CRM (админка), а не из окружения:
   так их меняют без доступа к серверу. Поэтому модуль зависит от CrmModule. */
@Module({
  imports: [CrmModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
