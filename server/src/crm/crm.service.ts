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
        custom_fields_values: [
          dto.phone && { field_code: 'PHONE', values: [{ value: dto.phone, enum_code: 'WORK' }] },
          dto.email && { field_code: 'EMAIL', values: [{ value: dto.email, enum_code: 'WORK' }] },
        ].filter(Boolean),
        _embedded: {
          contacts: [{
            name: dto.name,
            first_name: dto.name.split(' ')[0] || dto.name,
            last_name: dto.name.split(' ').slice(1).join(' ') || '',
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
          const res = await fetch(`https://${cfg.subdomain}/api/v4/leads/complex`, {
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
