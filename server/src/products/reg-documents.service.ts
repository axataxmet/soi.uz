import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { CreateRegDocumentDto, UpdateRegDocumentDto } from './dto/reg-document.dto';

@Injectable()
export class RegDocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  findAll(productId: string) {
    return this.prisma.regDocument.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  create(productId: string, dto: CreateRegDocumentDto) {
    return this.prisma.regDocument.create({
      data: {
        productId,
        type: dto.type,
        number: dto.number,
        classRisk: dto.classRisk,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        issuer: dto.issuer,
        fileUrl: dto.fileUrl,
        status: dto.status,
      },
    });
  }

  async update(id: string, dto: UpdateRegDocumentDto) {
    const current = await this.ensure(id);
    const updated = await this.prisma.regDocument.update({
      where: { id },
      data: {
        type: dto.type,
        number: dto.number,
        classRisk: dto.classRisk,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        issuer: dto.issuer,
        fileUrl: dto.fileUrl,
        status: dto.status,
      },
    });
    if (dto.fileUrl !== undefined && dto.fileUrl !== current.fileUrl) {
      await this.media.removeByUrlIfUnused(current.fileUrl);
    }
    return updated;
  }

  async remove(id: string) {
    const current = await this.ensure(id);
    await this.prisma.regDocument.delete({ where: { id } });
    await this.media.removeByUrlIfUnused(current.fileUrl);
    return { success: true };
  }

  private async ensure(id: string) {
    const d = await this.prisma.regDocument.findUnique({ where: { id } });
    if (!d) throw new NotFoundException('Регудостоверение не найдено');
    return d;
  }
}
