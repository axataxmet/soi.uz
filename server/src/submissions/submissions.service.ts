import { Injectable } from '@nestjs/common';
import { Prisma, SubmissionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateSubmissionDto, QuerySubmissionDto } from './dto/submission.dto';
import { CrmService } from '../crm/crm.service';

@Injectable()
export class SubmissionsService extends BaseCrudService {
  constructor(prisma: PrismaService, private readonly crm: CrmService) {
    super(prisma, { model: 'submission', defaultOrderBy: [{ createdAt: 'desc' }] });
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
