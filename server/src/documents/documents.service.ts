import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BaseCrudService } from '../common/base-crud.service';
import { MediaService } from '../media/media.service';
import { CreateDocumentDto, QueryDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService extends BaseCrudService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly media: MediaService,
  ) {
    const prisma = prismaService;
    super(prisma, { model: 'document', defaultOrderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  }

  findAll(q: QueryDocumentDto) {
    const where: Prisma.DocumentWhereInput = {};
    if (q.category) where.category = q.category;
    return this.paginate(where, q);
  }

  findOne(id: string) {
    return this.getOneOrFail({ id });
  }

  createDocument(dto: CreateDocumentDto) {
    return this.create(this.toData(dto));
  }

  async updateDocument(id: string, dto: UpdateDocumentDto) {
    const current = await this.prismaService.document.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Документ не найден');
    const updated = await this.update(id, this.toData(dto));
    if (dto.fileUrl && dto.fileUrl !== current.fileUrl) {
      await this.media.removeByUrlIfUnused(current.fileUrl, { documentId: id });
    }
    return updated;
  }

  async remove(id: string) {
    const current = await this.prismaService.document.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Документ не найден');
    await super.remove(id);
    await this.media.removeByUrlIfUnused(current.fileUrl, { documentId: id });
    return { success: true };
  }

  private toData(dto: CreateDocumentDto | UpdateDocumentDto) {
    return {
      title: dto.title as Prisma.InputJsonValue,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType,
      fileSize: dto.fileSize,
      category: dto.category,
      order: dto.order,
    };
  }
}
