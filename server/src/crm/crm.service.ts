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

  async getConfig() {
    const row = await this.prisma.crmConfig.findUnique({ where: { id: SINGLETON_ID } });
    return row ? { ...DEFAULTS, ...row } : { ...DEFAULTS };
  }

  async setConfig(dto: UpdateCrmConfigDto) {
    await this.prisma.crmConfig.upsert({
      where: { id: SINGLETON_ID },
      update: dto,
      create: { id: SINGLETON_ID, ...dto },
    });
    return this.getConfig();
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

      if (cfg.mode === 'proxy' && cfg.proxyUrl) {
        await fetch(cfg.proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _type: 'soi_lead',
            lead,
            noteText,
            subdomain: cfg.subdomain,
            token: cfg.token,
            pipelineId: cfg.pipelineId,
            statusId: cfg.statusId,
          }),
        });
      } else if (cfg.mode === 'direct' && cfg.subdomain && cfg.token) {
        await fetch(`https://${cfg.subdomain}/api/v4/leads/complex`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.token}` },
          body: JSON.stringify([lead]),
        });
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
        await fetch(`https://api.telegram.org/bot${cfg.telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: cfg.telegramChatId, text, parse_mode: 'HTML' }),
        });
      }
    } catch (e) {
      this.logger.warn(`CRM relay failed: ${(e as Error).message}`);
    }
  }
}
