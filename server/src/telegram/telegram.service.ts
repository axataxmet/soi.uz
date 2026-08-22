import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrmService } from '../crm/crm.service';
import { PrismaService } from '../prisma/prisma.service';

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
  reply_to_message?: TgMessage;
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
    private readonly prisma: PrismaService,
  ) {}

  get webhookSecret(): string {
    return this.config.get<string>('TELEGRAM_WEBHOOK_SECRET') || '';
  }

  /* Вызов к Telegram с проверкой ответа: fetch не бросает исключение на 4xx,
     и без разбора тела отказ выглядел бы как успешная отправка.

     Возвращает поле result, а не просто признак успеха: при пересылке нужен
     message_id отправленного в группу сообщения — по нему потом находится
     автор, когда менеджер отвечает реплаем. */
  private async call(
    token: string,
    method: string,
    body: unknown,
  ): Promise<Record<string, any> | null> {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text().catch(() => '');
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        /* не JSON — судим по коду ответа */
      }
      const ok = res.ok && (!parsed || parsed.ok !== false);
      if (!ok) {
        this.logger.warn(`${method}: HTTP ${res.status} — ${text.slice(0, 300)}`);
        return null;
      }
      return (parsed && parsed.result) || {};
    } catch (e) {
      this.logger.warn(`${method}: запрос не ушёл — ${(e as Error).message}`);
      return null;
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

      const cfg = await this.crm.getConfig();
      const token = cfg.telegramToken || '';
      const group = cfg.telegramChatId || '';
      if (!token) {
        this.logger.warn('Приём включён, но токен бота не задан — ответить нечем');
        return;
      }

      /* Сообщение из служебной группы — это ответ менеджера. Пересылаем его
         автору и на этом заканчиваем: без разделения по типу чата ответ ушёл
         бы обратно в ту же группу, замыкая круг.

         Режим приватности бота при этом не мешает: в группе он получает
         реплаи на собственные сообщения, а именно ими и отвечают. */
      if (msg.chat.type !== 'private') {
        if (group && String(msg.chat.id) === String(group)) await this.relayReply(token, msg);
        return;
      }

      const text = (msg.text || msg.caption || '').trim();

      /* Отмечаем чат как известный сразу, любым первым сообщением — не
         только /start. Возвращает true один раз, для самого первого
         сообщения из этого чата, каким бы оно ни было. */
      const isFirstContact = await this.registerContact(msg.chat.id);

      if (text === '/start' || text === '/help') {
        await this.sendWelcome(token, msg.chat.id);
        return;
      }

      const hasAttachment = Boolean(msg.photo || msg.document || msg.voice);
      if (!text && !hasAttachment && !msg.contact) {
        await this.sendWelcome(token, msg.chat.id);
        return;
      }

      /* Первое сообщение из этого чата — приветствие обязательно, даже если
         человек сразу написал вопрос текстом, а не начал с /start: иначе
         часть контактов миновала бы приветствие вовсе. Ветки выше уже сами
         шлют приветствие и на этот случай не срабатывают повторно — здесь
         только путь «сразу написал по делу». Дальше сообщение всё равно
         обрабатывается как обычно — этот блок не return'ит. */
      if (isFirstContact) {
        await this.sendWelcome(token, msg.chat.id);
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
        text: parts.join('\n') + '\n\n<i>Ответьте на это сообщение — ответ уйдёт отправителю.</i>',
        parse_mode: 'HTML',
      });
      if (!sent) return;
      this.logger.log(`Сообщение от ${this.who(msg)} передано в группу`);

      /* Запоминаем, какому чату соответствует сообщение в группе. Без этой
         записи реплай менеджера некуда было бы адресовать. */
      if (sent.message_id) {
        await this.prisma.telegramThread
          .upsert({
            where: { groupMessageId: sent.message_id },
            update: { userChatId: String(msg.chat.id), userName: this.who(msg) },
            create: {
              groupMessageId: sent.message_id,
              userChatId: String(msg.chat.id),
              userName: this.who(msg),
            },
          })
          .catch((e: Error) => this.logger.warn(`Связь сообщений не сохранена: ${e.message}`));
      }
    } catch (e) {
      this.logger.warn(`Обработка обновления не удалась: ${(e as Error).message}`);
    }
  }

  /* Ответ менеджера из группы — обратно автору.
     Срабатывает только на реплай к сообщению, которое бот сам туда прислал:
     обычная переписка сотрудников в группе никого не касается и наружу не
     уходит. */
  private async relayReply(token: string, msg: TgMessage): Promise<void> {
    const target = msg.reply_to_message;
    if (!target) return;

    const thread = await this.prisma.telegramThread
      .findUnique({ where: { groupMessageId: target.message_id } })
      .catch(() => null);
    if (!thread) return;

    const text = (msg.text || msg.caption || '').trim();
    if (!text) {
      await this.call(token, 'sendMessage', {
        chat_id: msg.chat.id,
        reply_to_message_id: msg.message_id,
        text: '⚠️ Вложения бот пересылать не умеет — ответьте текстом.',
      });
      return;
    }

    const delivered = await this.call(token, 'sendMessage', {
      chat_id: thread.userChatId,
      text,
    });

    /* Подтверждение обязательно: без него менеджер не знает, дошёл ли ответ.
       Частый случай отказа — человек заблокировал бота, и тогда молчание
       выглядело бы как успешная отправка. */
    await this.call(token, 'sendMessage', {
      chat_id: msg.chat.id,
      reply_to_message_id: msg.message_id,
      text: delivered
        ? `✅ Отправлено: ${thread.userName || 'пользователю'}`
        : '❌ Не доставлено. Вероятно, пользователь заблокировал бота или удалил чат.',
    });

    if (delivered) this.logger.log(`Ответ менеджера доставлен: ${thread.userName}`);
  }

  /* Отмечает чат как известный (insert-if-not-exists) и возвращает true,
     если запись только что создана — то есть это первое сообщение из чата.
     На ошибку БД отвечает false: не срывать обработку сообщения из-за того,
     что не получилось проверить, писали ли этому чату раньше — в худшем
     случае лишний раз не пришлёт приветствие, а не потеряет сообщение. */
  private async registerContact(chatId: number): Promise<boolean> {
    try {
      await this.prisma.telegramContact.create({ data: { chatId: String(chatId) } });
      return true;
    } catch {
      return false;
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
