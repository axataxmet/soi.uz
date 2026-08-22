import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { TelegramService, TgUpdate } from './telegram.service';

/* Адрес вебхука Telegram. Публичный по необходимости: Telegram обращается сюда
   без наших токенов. Подлинность проверяется секретом в заголовке — его знают
   только Telegram и сервер.

   Из Swagger скрыт: это служебная точка, вызывать её вручную незачем, а в
   документации она только приглашала бы к экспериментам. */
@ApiExcludeController()
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegram: TelegramService) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Body() update: TgUpdate,
    @Headers('x-telegram-bot-api-secret-token') secret?: string,
  ) {
    /* Ответ всегда 200, даже на чужой запрос: код ошибки подсказал бы
       подбирающему, что адрес существует и секрет не подошёл. Настоящий
       Telegram при 200 просто снимает обновление с очереди. */
    if (!this.telegram.webhookSecret || secret !== this.telegram.webhookSecret) {
      return { ok: true };
    }

    /* Обработка не ждётся: Telegram повторяет доставку, если ответ пришёл
       позже нескольких секунд, а отправка в группу зависит от внешней сети. */
    void this.telegram.handleUpdate(update);
    return { ok: true };
  }
}
