import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrmService } from '../crm/crm.service';

/* Приём сообщений от Telegram.
   До 22.08.2026 бот работал только «на выход»: код умел лишь отправить
   уведомление о заявке с сайта. Всё, что писали боту люди, копилось в очереди
   Telegram без ответа — на момент подключения там лежало 11 сообщений.

   Обновления приходят вебхуком на POST /api/telegram/webhook. Подлинность
   запроса проверяется заголовком X-Telegram-Bot-Api-Secret-Token: адрес
   эндпоинта публичный, и без проверки написать в группу мог бы кто угодно. */

type TgChat = { id: number; type: string; title?: string; first_name?: string; username?: string };
type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TgMessage = {
  message_id: number;
  from?: TgUser;
  chat: TgChat;
  text?: string;
  caption?: string;
  contact?: { phone_number?: string };
  photo?: unknown[];
  document?: unknown;
  voice?: unknown;
};
export type TgUpdate = { update_id: number; message?: TgMessage; edited_message?: TgMessage };

const SITE = 'https://soi.uz';
const PHONE = '+998 (77) 225-00-01';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly crm: CrmService,
    private readonly config: ConfigService,
  ) {}

  get webhookSecret(): string {
    return this.config.get<string>('TELEGRAM_WEBHOOK_SECRET') || '';
  }

  /* Вызов к Telegram с проверкой ответа: fetch не бросает исключение на 4xx,
     и без разбора тела отказ выглядел бы как успешная отправка. */
  private async call(token: string, method: string, body: unknown): Promise<boolean> {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text().catch(() => '');
      let ok = res.ok;
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.ok === 'boolean') ok = ok && parsed.ok;
      } catch {
        /* не JSON — судим по коду ответа */
      }
      if (!ok) this.logger.warn(`${method}: HTTP ${res.status} — ${text.slice(0, 300)}`);
      return ok;
    } catch (e) {
      this.logger.warn(`${method}: запрос не ушёл — ${(e as Error).message}`);
      return false;
    }
  }

  private who(m: TgMessage): string {
    const u = m.from || ({} as TgUser);
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || m.chat.first_name || 'без имени';
    return u.username ? `${name} (@${u.username})` : name;
  }

  /* Никогда не бросает наружу: на ошибку Telegram повторяет доставку по
     нарастающей, и один сбойный апдейт превратился бы в поток повторов. */
  async handleUpdate(update: TgUpdate): Promise<void> {
    try {
      const msg = update.message || update.edited_message;
      if (!msg) return;

      /* Только личные чаты. Бот состоит в служебной группе, и её сообщения
         тоже приходят сюда — без этой проверки ответ менеджера пересылался бы
         обратно в ту же группу, замыкая круг. */
      if (msg.chat.type !== 'private') return;

      const cfg = await this.crm.getConfig();
      const token = cfg.telegramToken || '';
      const group = cfg.telegramChatId || '';
      if (!token) {
        this.logger.warn('Приём включён, но токен бота не задан — ответить нечем');
        return;
      }

      const text = (msg.text || msg.caption || '').trim();

      if (text === '/start' || text === '/help') {
        await this.sendWelcome(token, msg.chat.id);
        return;
      }

      const hasAttachment = Boolean(msg.photo || msg.document || msg.voice);
      if (!text && !hasAttachment && !msg.contact) {
        await this.sendWelcome(token, msg.chat.id);
        return;
      }

      /* Сначала подтверждение автору, потом пересылка: если группа настроена
         неверно, человек всё равно получит ответ и не останется в тишине. */
      await this.call(token, 'sendMessage', {
        chat_id: msg.chat.id,
        text:
          'Спасибо, сообщение получено. Менеджер ответит в рабочее время: ' +
          'понедельник – пятница.\n\n' +
          `Срочный вопрос — позвоните: ${PHONE}`,
      });

      if (!group) {
        this.logger.warn('Сообщение боту получено, но группа для пересылки не задана');
        return;
      }

      const parts = [
        '💬 <b>Сообщение боту</b>',
        '',
        `<b>От:</b> ${this.escape(this.who(msg))}`,
        `<b>ID:</b> <code>${msg.from?.id ?? msg.chat.id}</code>`,
        msg.contact?.phone_number && `<b>Телефон:</b> ${this.escape(msg.contact.phone_number)}`,
        '',
        text ? this.escape(text) : '(вложение без текста — откройте чат с отправителем)',
        hasAttachment && text ? '\n<i>К сообщению приложен файл</i>' : '',
      ].filter(Boolean);

      const sent = await this.call(token, 'sendMessage', {
        chat_id: group,
        text: parts.join('\n'),
        parse_mode: 'HTML',
      });
      if (sent) this.logger.log(`Сообщение от ${this.who(msg)} передано в группу`);
    } catch (e) {
      this.logger.warn(`Обработка обновления не удалась: ${(e as Error).message}`);
    }
  }

  private async sendWelcome(token: string, chatId: number): Promise<void> {
    await this.call(token, 'sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text:
        'Здравствуйте! Это бот компании <b>ИНДУСТРИЯ ЗДОРОВЬЯ</b>.\n\n' +
        'Поставляем медицинское оборудование, мебель, инструменты и расходные ' +
        'материалы для клиник Узбекистана.\n\n' +
        'Напишите ваш вопрос прямо здесь — менеджер ответит в рабочее время.\n' +
        `Срочный вопрос — позвоните: ${PHONE}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🩺 Каталог оборудования', url: `${SITE}/catalog` }],
          [{ text: '📄 Оставить заявку', url: `${SITE}/contacts` }],
          [{ text: '📞 Контакты', url: `${SITE}/contacts` }],
        ],
      },
    });
  }

  /* Текст уходит с parse_mode HTML, поэтому угловые скобки и амперсанд из
     пользовательского сообщения нужно обезвредить — иначе Telegram отвергнет
     разметку целиком и сообщение до группы не дойдёт. */
  private escape(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
