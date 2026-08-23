import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrmService } from '../crm/crm.service';
import { PrismaService } from '../prisma/prisma.service';

/* Приём сообщений от Telegram.
   До 22.08.2026 бот работал только «на выход»: код умел лишь отправить
   уведомление о заявке с сайта. Всё, что писали боту люди, копилось в очереди
   Telegram без ответа — на момент подключения там лежало 11 сообщений.

   С 23.08.2026 первое обращение из чата запускает короткий онбординг:
   выбор языка (кнопки под сообщением) → запрос контакта (кнопка «Поделиться
   номером» на клавиатуре, либо «Пропустить») → обычное приветствие. Шаг
   хранится в TelegramContact.step ('lang' | 'contact' | 'done'), поэтому
   переживает перезапуск процесса и не сбрасывается на каждое сообщение.

   Обновления приходят вебхуком на POST /api/telegram/webhook. Подлинность
   запроса проверяется заголовком X-Telegram-Bot-Api-Secret-Token: адрес
   эндпоинта публичный, и без проверки написать в группу мог бы кто угодно. */

type Lang = 'ru' | 'uz' | 'en';
const LANGS: Lang[] = ['ru', 'uz', 'en'];

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
type TgCallbackQuery = { id: string; from: TgUser; message?: TgMessage; data?: string };
export type TgUpdate = {
  update_id: number;
  message?: TgMessage;
  edited_message?: TgMessage;
  callback_query?: TgCallbackQuery;
};

const SITE = 'https://soi.uz';
const PHONE = '+998 (77) 225-00-01';

/* Тексты онбординга и приветствия по языкам. Собраны в одном месте, а не
   раскиданы по методам — иначе при добавлении фразы легко забыть один из
   трёх языков. */
const T: Record<Lang, {
  askContact: string;
  shareContact: string;
  skip: string;
  thanksContact: string;
  skippedContact: string;
  welcomeIntro: string;
  welcomeQuestion: string;
  urgent: string;
  catalogBtn: string;
  leadBtn: string;
  contactsBtn: string;
  received: string;
  attachmentOnly: string;
}> = {
  ru: {
    askContact: 'Поделитесь номером телефона, чтобы менеджер мог связаться с вами напрямую — либо нажмите «Пропустить».',
    shareContact: '📱 Поделиться номером',
    skip: 'Пропустить',
    thanksContact: 'Спасибо, номер сохранён.',
    skippedContact: 'Хорошо, продолжим без номера.',
    welcomeIntro: 'Это бот компании <b>ИНДУСТРИЯ ЗДОРОВЬЯ</b>.\n\nПоставляем медицинское оборудование, мебель, инструменты и расходные материалы для клиник Узбекистана.',
    welcomeQuestion: 'Напишите ваш вопрос прямо здесь — менеджер ответит в рабочее время.',
    urgent: 'Срочный вопрос — позвоните',
    catalogBtn: '🩺 Каталог оборудования',
    leadBtn: '📄 Оставить заявку',
    contactsBtn: '📞 Контакты',
    received: 'Спасибо, сообщение получено. Менеджер ответит в рабочее время: понедельник – пятница.',
    attachmentOnly: '(вложение без текста — откройте чат с отправителем)',
  },
  uz: {
    askContact: 'Menejer siz bilan bevosita bog’lansin uchun telefon raqamingizni yuboring — yoki «O’tkazib yuborish» tugmasini bosing.',
    shareContact: '📱 Raqamni yuborish',
    skip: 'O’tkazib yuborish',
    thanksContact: 'Rahmat, raqam saqlandi.',
    skippedContact: 'Yaxshi, raqamsiz davom etamiz.',
    welcomeIntro: 'Bu <b>SOG‘LIQ INDUSTRIYASI</b> kompaniyasining boti.\n\nO‘zbekiston klinikalari uchun tibbiy uskuna, mebel, asboblar va sarf materiallarini yetkazib beramiz.',
    welcomeQuestion: 'Savolingizni shu yerga yozing — menejer ish vaqtida javob beradi.',
    urgent: 'Shoshilinch savol — qo’ng’iroq qiling',
    catalogBtn: '🩺 Uskunalar katalogi',
    leadBtn: '📄 Ariza qoldirish',
    contactsBtn: '📞 Kontaktlar',
    received: 'Rahmat, xabaringiz qabul qilindi. Menejer ish vaqtida javob beradi: dushanba – juma.',
    attachmentOnly: '(matnsiz fayl — yuboruvchi bilan chatni oching)',
  },
  en: {
    askContact: 'Share your phone number so a manager can reach you directly — or tap «Skip».',
    shareContact: '📱 Share phone number',
    skip: 'Skip',
    thanksContact: 'Thanks, your number is saved.',
    skippedContact: 'Alright, we’ll continue without a phone number.',
    welcomeIntro: 'This is the <b>HEALTH INDUSTRY</b> company bot.\n\nWe supply medical equipment, furniture, instruments and consumables for clinics in Uzbekistan.',
    welcomeQuestion: 'Write your question right here — a manager will reply during business hours.',
    urgent: 'Urgent question — call',
    catalogBtn: '🩺 Equipment catalog',
    leadBtn: '📄 Leave a request',
    contactsBtn: '📞 Contacts',
    received: 'Thank you, your message has been received. A manager will reply during business hours: Monday – Friday.',
    attachmentOnly: '(attachment without text — open the chat with the sender)',
  },
};

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

  /* Ретрансляция исходного обновления в amoCRM.

     Telegram доставляет вебхук строго по одному адресу, поэтому «работает и
     бот, и amoCRM» достижимо только так: обновление принимаем мы, обрабатываем
     онбординг, и следом отдаём копию тем же телом в прокси amoCRM. Раньше
     вебхук был уведён прямо на prx.amocrm.com — тогда до нашего сервера не
     доходило вообще ничего, и онбординг молчал.

     Адрес живёт в TELEGRAM_FORWARD_URL (server/.env), а не в git: в него
     вшит токен бота. Пусто — ретрансляция просто выключена.

     Намеренно не await: amoCRM недоступен или отвечает медленно — это не
     повод задерживать ответ Telegram (он повторит доставку) и тем более не
     повод терять сообщение клиента. Ошибку только пишем в лог. */
  private forwardToAmo(update: TgUpdate): void {
    const url = this.config.get<string>('TELEGRAM_FORWARD_URL') || '';
    if (!url) return;
    /* Свой секрет вебхука не передаём: он предназначен только для проверки
       «это правда Telegram» на нашей стороне. amoCRM опознаёт вызов по
       токену в query-строке своего адреса. */
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
      .then((res) => {
        if (!res.ok) this.logger.warn(`Ретрансляция в amoCRM: HTTP ${res.status}`);
      })
      .catch((e: Error) => this.logger.warn(`Ретрансляция в amoCRM не ушла: ${e.message}`));
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
      /* Первым делом и безусловно: копия обновления уходит в amoCRM, что бы
         дальше ни решила наша логика. Ставим до всех проверок и ранних
         return'ов — иначе, например, незаданный токен бота лишил бы amoCRM
         сообщений заодно с нами. */
      this.forwardToAmo(update);

      const cfg = await this.crm.getConfig();
      const token = cfg.telegramToken || '';
      const group = cfg.telegramChatId || '';
      if (!token) {
        this.logger.warn('Приём включён, но токен бота не задан — ответить нечем');
        return;
      }

      if (update.callback_query) {
        await this.handleCallback(token, update.callback_query);
        return;
      }

      const msg = update.message || update.edited_message;
      if (!msg) return;

      /* Сообщение из служебной группы — это ответ менеджера. Пересылаем его
         автору и на этом заканчиваем: без разделения по типу чата ответ ушёл
         бы обратно в ту же группу, замыкая круг.

         Режим приватности бота при этом не мешает: в группе он получает
         реплаи на собственные сообщения, а именно ими и отвечают. */
      if (msg.chat.type !== 'private') {
        if (group && String(msg.chat.id) === String(group)) await this.relayReply(token, msg);
        return;
      }

      await this.handlePrivateMessage(token, group, msg);
    } catch (e) {
      this.logger.warn(`Обработка обновления не удалась: ${(e as Error).message}`);
    }
  }

  /* Личное сообщение боту. Сначала решает, на каком шаге онбординга чат
     находится (lang → contact → done), и либо продвигает онбординг дальше,
     либо, если он уже пройден, обрабатывает сообщение как раньше. */
  private async handlePrivateMessage(token: string, group: string, msg: TgMessage): Promise<void> {
    const chatId = msg.chat.id;
    const text = (msg.text || msg.caption || '').trim();

    /* Запись создаётся явно со step:'lang' — DEFAULT в колонке ('done')
       нужен только для чатов, заведённых до онбординга миграцией, чтобы их
       не отправило на повторный выбор языка. */
    const contact = await this.prisma.telegramContact.upsert({
      where: { chatId: String(chatId) },
      update: {},
      create: { chatId: String(chatId), step: 'lang' },
    });

    if (contact.step === 'lang') {
      await this.askLanguage(token, chatId);
      return;
    }

    if (contact.step === 'contact') {
      const lang = (contact.lang as Lang) || 'ru';
      const t = T[lang];

      if (msg.contact?.phone_number) {
        await this.prisma.telegramContact.update({
          where: { chatId: String(chatId) },
          data: { phone: msg.contact.phone_number, step: 'done' },
        });
        await this.call(token, 'sendMessage', {
          chat_id: chatId,
          text: t.thanksContact,
          reply_markup: { remove_keyboard: true },
        });
        await this.sendWelcome(token, chatId, lang);
        return;
      }

      if (text.toLowerCase() === t.skip.toLowerCase()) {
        await this.prisma.telegramContact.update({ where: { chatId: String(chatId) }, data: { step: 'done' } });
        await this.call(token, 'sendMessage', {
          chat_id: chatId,
          text: t.skippedContact,
          reply_markup: { remove_keyboard: true },
        });
        await this.sendWelcome(token, chatId, lang);
        return;
      }

      /* Пока номер не дан и кнопка «Пропустить» не нажата — держим на этом
         шаге и переспрашиваем, а не проваливаемся в обычную пересылку:
         контакт для этого и запрашивается как обязательный шаг онбординга. */
      await this.askContact(token, chatId, lang);
      return;
    }

    // step === 'done' — обычный разговор
    const lang = (contact.lang as Lang) || 'ru';
    const t = T[lang];

    if (text === '/start' || text === '/help') {
      await this.sendWelcome(token, chatId, lang);
      return;
    }

    const hasAttachment = Boolean(msg.photo || msg.document || msg.voice);
    if (!text && !hasAttachment && !msg.contact) {
      await this.sendWelcome(token, chatId, lang);
      return;
    }

    /* Сначала подтверждение автору, потом пересылка: если группа настроена
       неверно, человек всё равно получит ответ и не останется в тишине. */
    await this.call(token, 'sendMessage', {
      chat_id: chatId,
      text: `${t.received}\n\n${t.urgent}: ${PHONE}`,
    });

    /* Переписка в amoCRM через API, а не через их Telegram-канал: тот забирает
       себе вебхук бота, и тогда онбординг не срабатывает вовсе. Первое
       сообщение заводит сделку, id сохраняется у контакта — дальше сообщения
       дописываются в неё примечаниями. Не await'им весь блок в общем потоке
       отправки: CRM недоступна — переписка с клиентом всё равно продолжается. */
    this.crm
      .relayTelegramMessage({
        leadId: contact.amoLeadId,
        name: this.who(msg),
        phone: msg.contact?.phone_number || contact.phone,
        lang,
        text: text || '(вложение без текста)',
      })
      .then((leadId) => {
        if (leadId && leadId !== contact.amoLeadId) {
          return this.prisma.telegramContact
            .update({ where: { chatId: String(chatId) }, data: { amoLeadId: leadId } })
            .then(() => undefined);
        }
        return undefined;
      })
      .catch((e: Error) => this.logger.warn(`Связь со сделкой amoCRM не сохранена: ${e.message}`));

    if (!group) {
      this.logger.warn('Сообщение боту получено, но группа для пересылки не задана');
      return;
    }

    const parts = [
      '💬 <b>Сообщение боту</b>',
      '',
      `<b>От:</b> ${this.escape(this.who(msg))}`,
      `<b>ID:</b> <code>${msg.from?.id ?? chatId}</code>`,
      `<b>Язык:</b> ${lang}`,
      (msg.contact?.phone_number || contact.phone) &&
        `<b>Телефон:</b> ${this.escape(msg.contact?.phone_number || contact.phone || '')}`,
      '',
      text ? this.escape(text) : t.attachmentOnly,
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
          update: { userChatId: String(chatId), userName: this.who(msg) },
          create: {
            groupMessageId: sent.message_id,
            userChatId: String(chatId),
            userName: this.who(msg),
          },
        })
        .catch((e: Error) => this.logger.warn(`Связь сообщений не сохранена: ${e.message}`));
    }
  }

  /* Нажатие инлайн-кнопки выбора языка. Единственный сценарий колбэков на
     сегодня — если data не начинается с 'lang:', молча гасим часики на
     кнопке и ничего не делаем. */
  private async handleCallback(token: string, cq: TgCallbackQuery): Promise<void> {
    const data = cq.data || '';
    const chatId = cq.message?.chat.id;
    if (!chatId || !data.startsWith('lang:')) {
      await this.call(token, 'answerCallbackQuery', { callback_query_id: cq.id });
      return;
    }

    const lang = data.slice('lang:'.length) as Lang;
    if (!LANGS.includes(lang)) {
      await this.call(token, 'answerCallbackQuery', { callback_query_id: cq.id });
      return;
    }

    await this.prisma.telegramContact.upsert({
      where: { chatId: String(chatId) },
      update: { lang, step: 'contact' },
      create: { chatId: String(chatId), lang, step: 'contact' },
    });

    await this.call(token, 'answerCallbackQuery', { callback_query_id: cq.id });

    /* Убираем клавиатуру у сообщения с выбором языка — иначе на неё можно
       нажать повторно, и бот переспросит контакт заново без видимой причины. */
    if (cq.message) {
      await this.call(token, 'editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: cq.message.message_id,
        reply_markup: { inline_keyboard: [] },
      });
    }

    await this.askContact(token, chatId, lang);
  }

  /* Первый шаг онбординга: выбор языка. Текст трёхъязычный сразу — до этого
     момента бот ещё не знает, на каком языке говорить. */
  private async askLanguage(token: string, chatId: number): Promise<void> {
    await this.call(token, 'sendMessage', {
      chat_id: chatId,
      text: 'Выберите язык / Tilni tanlang / Choose your language',
      reply_markup: {
        inline_keyboard: [[
          { text: '🇷🇺 Русский', callback_data: 'lang:ru' },
          { text: '🇺🇿 O\'zbek', callback_data: 'lang:uz' },
          { text: '🇬🇧 English', callback_data: 'lang:en' },
        ]],
      },
    });
  }

  /* Второй шаг онбординга: запрос контакта через кнопку клавиатуры
     (request_contact — Telegram сам подставит номер владельца аккаунта) или
     пропуск обычной кнопкой-текстом. */
  private async askContact(token: string, chatId: number, lang: Lang): Promise<void> {
    const t = T[lang];
    await this.call(token, 'sendMessage', {
      chat_id: chatId,
      text: t.askContact,
      reply_markup: {
        keyboard: [[{ text: t.shareContact, request_contact: true }], [{ text: t.skip }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
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

  private async sendWelcome(token: string, chatId: number, lang: Lang): Promise<void> {
    const t = T[lang];
    await this.call(token, 'sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `${t.welcomeIntro}\n\n${t.welcomeQuestion}\n${t.urgent}: ${PHONE}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: t.catalogBtn, url: `${SITE}/catalog` }],
          [{ text: t.leadBtn, url: `${SITE}/contacts` }],
          [{ text: t.contactsBtn, url: `${SITE}/contacts` }],
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
