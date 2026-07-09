import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/dto/pagination.dto';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';

// Never expose passwordHash.
const SAFE = {
  id: true, email: true, name: true, role: true,
  isActive: true, lastLoginAt: true, createdAt: true, updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(q: QueryUserDto) {
    const where: Prisma.UserWhereInput = {};
    if (q.role) where.role = q.role;
    if (q.search) {
      where.OR = [
        { email: { contains: q.search, mode: 'insensitive' } },
        { name: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where, select: SAFE, orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.limit, take: q.limit,
      }),
      this.prisma.user.count({ where }),
    ]);
    return paginate(data, total, q.page, q.limit);
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Пользователь с таким e-mail уже существует');
    return this.prisma.user.create({
      data: {
        email: dto.email, name: dto.name, role: dto.role,
        passwordHash: await bcrypt.hash(dto.password, 10),
      },
      select: SAFE,
    });
  }

  async update(id: string, dto: UpdateUserDto, actor: { userId: string; role: string }) {
    const user = await this.ensure(id);
    // Only SUPERADMIN may CHANGE roles (re-sending the same role is allowed).
    if (dto.role !== undefined && dto.role !== user.role && actor.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('Смена ролей доступна только суперадмину');
    }
    // Cannot deactivate your own account.
    if (dto.isActive === false && id === actor.userId) {
      throw new ForbiddenException('Нельзя деактивировать собственную учётную запись');
    }
    // Keep at least one active superadmin.
    const demoting = (dto.role && dto.role !== Role.SUPERADMIN) || dto.isActive === false;
    if (demoting && user.role === Role.SUPERADMIN) {
      const supers = await this.prisma.user.count({ where: { role: Role.SUPERADMIN, isActive: true } });
      if (supers <= 1) throw new ForbiddenException('Должен остаться хотя бы один активный суперадмин');
    }
    return this.prisma.user.update({
      where: { id },
      data: { name: dto.name, role: dto.role, isActive: dto.isActive },
      select: SAFE,
    });
  }

  async setPassword(id: string, password: string) {
    await this.ensure(id);
    await this.prisma.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
    return { success: true };
  }

  async remove(id: string, actor: { userId: string }) {
    const user = await this.ensure(id);
    if (id === actor.userId) throw new ForbiddenException('Нельзя удалить собственную учётную запись');
    if (user.role === Role.SUPERADMIN) {
      const supers = await this.prisma.user.count({ where: { role: Role.SUPERADMIN, isActive: true } });
      if (supers <= 1) throw new ForbiddenException('Должен остаться хотя бы один суперадмин');
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  private async ensure(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) throw new NotFoundException('Пользователь не найден');
    return u;
  }
}
