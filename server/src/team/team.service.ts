import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { CreateTeamMemberDto, QueryTeamDto, UpdateTeamMemberDto } from './dto/team.dto';

@Injectable()
export class TeamService extends BaseCrudService {
  constructor(prisma: PrismaService) {
    super(prisma, { model: 'teamMember', defaultOrderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  }

  findAll(q: QueryTeamDto) {
    return this.paginate({}, q);
  }

  findOne(id: string) {
    return this.getOneOrFail({ id });
  }

  createMember(dto: CreateTeamMemberDto) {
    return this.create(this.toData(dto));
  }

  updateMember(id: string, dto: UpdateTeamMemberDto) {
    return this.update(id, this.toData(dto));
  }

  private toData(dto: CreateTeamMemberDto | UpdateTeamMemberDto) {
    return {
      name: dto.name,
      role: dto.role as Prisma.InputJsonValue,
      photoUrl: dto.photoUrl,
      order: dto.order,
      service: dto.service,
    };
  }
}
