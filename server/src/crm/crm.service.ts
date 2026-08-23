import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCrmConfigDto } from './dto/crm-config.dto';
import { CreateSubmissionDto } from '../submissions/dto/submission.dto';

const SINGLETON_ID = 1;
const DEFAULTS: UpdateCrmConfigDto = {
  enabled: false,
  mode: 'proxy',
  proxyUrl: '',
  subdomain: '',
  token: '',
  pipelineId: '',
  statusId: '',
  responsibleUserId: '',
  telegramToken: '',
  telegramChatId: '',
};

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  /* Отдаём только поля настроек, без служебных колонок строки.
     Раньше здесь был `{ ...DEFAULTS, ...row }`, и наружу утекали id и
     updatedAt. Админка присылает полученный объект обратно без изменений, а
     ValidationPipe поднят с forbidNonWhitelisted — сохранение падало с
     «property id should not exist, property updatedAt should not exist».
     Чинится здесь, а не в админке: лишние поля незачем отдавать в принципе,
     и любой другой клиент наступил бы на те же грабли.

     null из необязательных колонок заменяется значением по умолчанию (пустой
     строкой): в форме это поле ввода, и null в нём превратился бы в строку
     «null» при первом же сохранении. */
  async getConfig() {
    const row = await this.prisma.crmConfig.findUnique({ where: { id: SINGLETON_ID } });
    const out: Record<string, unknown> = { ...DEFAULTS };
    if (row) {
      const src = row as unknown as Record<string, unknown>;
      for (const key of Object.keys(DEFAULTS)) {
        if (src[key] !== undefined && src[key] !== null) out[key] = src[key];
      }
    }
    return out as unknown as UpdateCrmConfigDto;
  }

  async setConfig(dto: UpdateCrmConfigDto) {
    await this.prisma.crmConfig.upsert({
      where: { id: SINGLETON_ID },
      update: dto,
      create: { id: SINGLETON_ID, ...dto },
    });
    return this.getConfig();
  }

  /* Отправка с проверкой ответа.
     fetch не бросает исключение на 4xx/5xx: при неверном chat_id, отозванном
     токене или заблокированном боте Telegram отвечает 400, а прежний код
     считал заявку отправленной и молчал — сбой обнаруживался только вручную.
     Ошибки не пробрасываются наружу: заявка уже сохранена, и падение доставки
     не должно её задевать. Возвращаемое значение позволяет вызывающему
     отличить успех от отказа. */
  private async postJson(label: string, url: string, body: unknown): Promise<boolean> {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text().catch(() => '');
      let ok = res.ok;
      /* Telegram отвечает кодом 4xx на большинство ошибок, но поле ok в теле —
         более надёжный признак: на часть ответов приходит 200 с ok:false. */
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.ok === 'boolean') ok = ok && parsed.ok;
      } catch {
        /* не JSON — судим по коду ответа */
      }
      if (!ok) {
        this.logger.warn(`${label}: HTTP ${res.status} — ${text.slice(0, 300)}`);
        return false;
      }
      return true;
    } catch (e) {
      this.logger.warn(`${label}: запрос не ушёл — ${(e as Error).message}`);
      return false;
    }
  }

  /* Адрес аккаунта amoCRM из настроек — только хост, без схемы и хвостового
     слэша. В поле админки естественно вставить его прямо из адресной строки
     («https://medinfocom.amocrm.ru»), и тогда наивная подстановка давала бы
     «https://https://medinfocom.amocrm.ru/api/v4» — запрос никуда не уходил.
     Чиним здесь, а не требованием «вводите правильно»: поле заполняет человек,
     и вставить полный адрес — самое очевидное, что он сделает. */
  private amoHost(subdomain?: string): string {
    return String(subdomain || '')
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '');
  }

  /* Запрос к amoCRM с Bearer-токеном. Отдаёт разобранное тело, а не признак
     успеха: при создании сделки нужен её id, чтобы потом дописывать в неё
     примечания. Наружу не бросает — переписка в Telegram не должна страдать
     от недоступности CRM. */
  private async amoRequest(
    cfg: UpdateCrmConfigDto,
    path: string,
    body: unknown,
  ): Promise<any | null> {
    try {
      const res = await fetch(`https://${this.amoHost(cfg.subdomain)}/api/v4${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.token}` },
        body: JSON.stringify(body),
      });
      const text = await res.text().catch(() => '');
      if (!res.ok) {
        this.logger.warn(`amoCRM ${path}: HTTP ${res.status} — ${text.slice(0, 300)}`);
        return null;
      }
      try {
        return JSON.parse(text);
      } catch {
        /* 204 и пустое тело — для примечаний это нормальный успех */
        return {};
      }
    } catch (e) {
      this.logger.warn(`amoCRM ${path}: запрос не ушёл — ${(e as Error).message}`);
      return null;
    }
  }

  /* Переписка из Telegram-бота в amoCRM.

     Встроенный Telegram-канал amoCRM здесь намеренно не используется: он
     забирает себе вебхук бота, и тогда до нашего сервера не доходит ничего —
     онбординг (выбор языка, запрос контакта) молчит. Поэтому вебхук остаётся
     у нас, а в amoCRM переписка попадает через API.

     Первое сообщение из чата заводит сделку, последующие дописываются в неё
     примечаниями: иначе каждая реплика клиента плодила бы отдельную сделку.
     Возвращает id сделки — вызывающий сохраняет его у контакта.

     Работает только в режиме direct: proxy-режим рассчитан на сторонний
     приёмник со своим форматом, и слать туда переписку вслепую незачем. */
  async relayTelegramMessage(input: {
    leadId?: number | null;
    name: string;
    phone?: string | null;
    lang?: string | null;
    username?: string | null;
    text: string;
  }): Promise<number | null> {
    try {
      const cfg = await this.getConfig();
      if (!cfg.enabled || cfg.mode !== 'direct' || !cfg.subdomain || !cfg.token) return null;

      const noteText = input.text;

      /* Сделка уже есть — только примечание. */
      if (input.leadId) {
        const ok = await this.amoRequest(cfg, `/leads/${input.leadId}/notes`, [
          { note_type: 'common', params: { text: noteText } },
        ]);
        return ok ? input.leadId : null;
      }

      /* Телефон висит на контакте, а не на сделке: field_code PHONE
         существует только у контакта, и на сделке amoCRM отвечает
         400 NotSupportedChoice — сделка не создавалась вовсе. */
      const lead: Record<string, unknown> = {
        name: `Telegram: ${input.name}`,
        pipeline_id: cfg.pipelineId ? parseInt(cfg.pipelineId) : undefined,
        status_id: cfg.statusId && /^\d+$/.test(cfg.statusId) ? parseInt(cfg.statusId) : undefined,
        responsible_user_id: cfg.responsibleUserId ? parseInt(cfg.responsibleUserId) : undefined,
        _embedded: {
          contacts: [{
            name: input.name,
            first_name: input.name.split(' ')[0] || input.name,
            last_name: input.name.split(' ').slice(1).join(' ') || '',
            custom_fields_values: [
              input.phone && { field_code: 'PHONE', values: [{ value: input.phone, enum_code: 'WORK' }] },
            ].filter(Boolean),
          }],
        },
        tags_values: [
          { name: 'ИНДУСТРИЯ ЗДОРОВЬЯ' },
          { name: 'Telegram-бот' },
          input.lang && { name: `Язык: ${input.lang}` },
        ].filter(Boolean),
      };

      const created = await this.amoRequest(cfg, '/leads/complex', [lead]);
      /* /leads/complex отвечает массивом вида [{ id, contact_id, ... }]. */
      const leadId = Array.isArray(created) && created[0] && Number(created[0].id);
      if (!leadId) return null;

      this.logger.log(`amoCRM: заведена сделка ${leadId} по чату Telegram (${input.name})`);
      await this.amoRequest(cfg, `/leads/${leadId}/notes`, [
        { note_type: 'common', params: { text: noteText } },
      ]);
      return leadId;
    } catch (e) {
      this.logger.warn(`amoCRM (telegram): ${(e as Error).message}`);
      return null;
    }
  }

  // Fired after a submission is persisted. Never throws — a CRM relay failure
  // must never affect the (already-saved) lead or the caller's response.
  async relayLead(dto: CreateSubmissionDto) {
    try {
      const cfg = await this.getConfig();
      if (!cfg.enabled) return;

      const meta = (dto.meta || {}) as Record<string, any>;
      const leadName = `Заявка: ${meta.org || dto.name}${meta.productName ? ' — ' + meta.productName : ''}`;
      const noteText = [
        meta.org && `Организация: ${meta.org}`,
        `Контакт: ${dto.name}`,
        dto.phone && `Телефон: ${dto.phone}`,
        dto.email && `Email: ${dto.email}`,
        meta.productName && `Товар: ${meta.productName}`,
        Array.isArray(meta.services) && meta.services.length && `Услуги: ${meta.services.join(', ')}`,
        dto.message && `Комментарий: ${dto.message}`,
        `Источник: ${dto.source || 'Форма на сайте'}`,
      ].filter(Boolean).join('\n');

      const lead = {
        name: leadName,
        pipeline_id: cfg.pipelineId ? parseInt(cfg.pipelineId) : undefined,
        status_id: cfg.statusId ? parseInt(cfg.statusId) : undefined,
        responsible_user_id: cfg.responsibleUserId ? parseInt(cfg.responsibleUserId) : undefined,
        /* Телефон и почта — поля контакта, не сделки: field_code PHONE/EMAIL
           у сделки не существует, и amoCRM отвечал 400 NotSupportedChoice,
           отклоняя заявку целиком. */
        _embedded: {
          contacts: [{
            name: dto.name,
            first_name: dto.name.split(' ')[0] || dto.name,
            last_name: dto.name.split(' ').slice(1).join(' ') || '',
            custom_fields_values: [
              dto.phone && { field_code: 'PHONE', values: [{ value: dto.phone, enum_code: 'WORK' }] },
              dto.email && { field_code: 'EMAIL', values: [{ value: dto.email, enum_code: 'WORK' }] },
            ].filter(Boolean),
          }],
          companies: meta.org ? [{ name: meta.org }] : [],
        },
        tags_values: [{ name: 'ИНДУСТРИЯ ЗДОРОВЬЯ' }, { name: 'Заявка-сайт' }],
      };

      /* Каналы независимы: отказ amoCRM не должен отменять отправку в Telegram.
         Раньше оба вызова стояли голым await внутри общего try, и сбой первого
         уводил выполнение в catch — уведомление не уходило вовсе, хотя с самим
         Telegram всё было в порядке. postJson гасит ошибку внутри себя. */
      if (cfg.mode === 'proxy' && cfg.proxyUrl) {
        await this.postJson('amoCRM (proxy)', cfg.proxyUrl, {
          _type: 'soi_lead',
          lead,
          noteText,
          subdomain: cfg.subdomain,
          token: cfg.token,
          pipelineId: cfg.pipelineId,
          statusId: cfg.statusId,
        });
      } else if (cfg.mode === 'direct' && cfg.subdomain && cfg.token) {
        /* Заголовок Authorization — единственное отличие от общего помощника,
           поэтому запрос остаётся здесь, но с той же проверкой ответа. */
        try {
          const res = await fetch(`https://${this.amoHost(cfg.subdomain)}/api/v4/leads/complex`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.token}` },
            body: JSON.stringify([lead]),
          });
          if (!res.ok) {
            const detail = await res.text().catch(() => '');
            this.logger.warn(`amoCRM (direct): HTTP ${res.status} — ${detail.slice(0, 300)}`);
          }
        } catch (e) {
          this.logger.warn(`amoCRM (direct): запрос не ушёл — ${(e as Error).message}`);
        }
      }

      if (cfg.telegramToken && cfg.telegramChatId) {
        const text = [
          '🏥 <b>Новая заявка</b>',
          '',
          meta.org && `<b>Организация:</b> ${meta.org}`,
          `<b>Контакт:</b> ${dto.name}`,
          dto.phone && `<b>Телефон:</b> ${dto.phone}`,
          dto.email && `<b>Email:</b> ${dto.email}`,
          meta.productName && `<b>Товар:</b> ${meta.productName}`,
          dto.message && `<b>Комментарий:</b> ${dto.message}`,
          '',
          `<i>Источник: ${dto.source || 'Форма на сайте'}</i>`,
        ].filter(Boolean).join('\n');
        /* Токен в адресе — поэтому в метку он не попадает: она уходит в лог,
           а лог читают и пересылают. */
        const sent = await this.postJson(
          `Telegram (chat ${cfg.telegramChatId})`,
          `https://api.telegram.org/bot${cfg.telegramToken}/sendMessage`,
          { chat_id: cfg.telegramChatId, text, parse_mode: 'HTML' },
        );
        if (sent) this.logger.log(`Заявка отправлена в Telegram (chat ${cfg.telegramChatId})`);
      } else {
        /* Молчание тут раньше было неотличимо от успешной отправки. */
        this.logger.warn('Telegram не настроен: не заполнены telegramToken или telegramChatId');
      }
    } catch (e) {
      this.logger.warn(`CRM relay failed: ${(e as Error).message}`);
    }
  }
}
