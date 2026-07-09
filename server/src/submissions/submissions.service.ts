import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { Prisma, SubmissionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateSubmissionDto, QuerySubmissionDto } from './dto/submission.dto';
import { CrmService } from '../crm/crm.service';
import { S3Service } from '../media/s3.service';

// Public form attachments — wider whitelist than the admin media library (adds office docs).
const ATTACH_MAX_SIZE = 15 * 1024 * 1024;
const ATTACH_MAX_FILES = 10;
const ATTACH_RULES: { exts: string[]; mimes: string[]; magic: (b: Buffer) => boolean }[] = [
  { exts: ['.pdf'], mimes: ['application/pdf'], magic: (b) => b.subarray(0, 5).toString('ascii') === '%PDF-' },
  { exts: ['.jpg', '.jpeg'], mimes: ['image/jpeg'], magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { exts: ['.png'], mimes: ['image/png'], magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  // DOCX / XLSX are ZIP containers (PK\x03\x04); DOC / XLS are OLE2 (D0 CF 11 E0 A1 B1 1A E1)
  { exts: ['.docx', '.xlsx'], mimes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], magic: (b) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07) },
  { exts: ['.doc', '.xls'], mimes: ['application/msword', 'application/vnd.ms-excel'], magic: (b) => b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) },
];

@Injectable()
export class SubmissionsService extends BaseCrudService {
  constructor(prisma: PrismaService, private readonly crm: CrmService, private readonly s3: S3Service) {
    super(prisma, { model: 'submission', defaultOrderBy: [{ createdAt: 'desc' }] });
  }

  // Public: accept form attachments, validate, push to MinIO, return URLs to embed in submission meta.
  async uploadAttachments(files: Express.Multer.File[]) {
    if (!files || !files.length) throw new BadRequestException('Файлы не переданы');
    if (files.length > ATTACH_MAX_FILES) throw new BadRequestException(`Слишком много файлов (максимум ${ATTACH_MAX_FILES})`);
    const out: { url: string; name: string; size: number; type: string }[] = [];
    for (const f of files) {
      if (!f.buffer) throw new BadRequestException('Файл не передан');
      if (f.size > ATTACH_MAX_SIZE) throw new BadRequestException(`Файл «${f.originalname}» слишком большой (максимум 15 МБ)`);
      const ext = extname(f.originalname || '').toLowerCase();
      const rule = ATTACH_RULES.find((r) => r.exts.includes(ext));
      if (!rule || !rule.magic(f.buffer)) {
        throw new BadRequestException(`Недопустимый файл «${f.originalname}». Разрешены PDF, DOC, DOCX, XLSX, JPG, PNG`);
      }
      const { url } = await this.s3.upload(f.buffer, f.originalname, rule.mimes[0]);
      out.push({ url, name: f.originalname, size: f.size, type: rule.mimes[0] });
    }
    return { files: out };
  }

  async createSubmission(dto: CreateSubmissionDto) {
    const saved = await this.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      message: dto.message,
      source: dto.source,
      meta: dto.meta as Prisma.InputJsonValue,
    });
    // Fire-and-forget: a lead must never be lost or delayed by a slow/broken CRM relay.
    void this.crm.relayLead(dto);
    return saved;
  }

  findAll(q: QuerySubmissionDto) {
    const where: Prisma.SubmissionWhereInput = {};
    if (q.status) where.status = q.status;
    return this.paginate(where, q);
  }

  findOne(id: string) {
    return this.getOneOrFail({ id });
  }

  setStatus(id: string, status: SubmissionStatus) {
    return this.update(id, { status });
  }
}
