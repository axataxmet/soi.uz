import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
const ALLOWED_UPLOADS: Record<string, { exts: string[]; magic: (buffer: Buffer) => boolean }> = {
  'image/png': {
    exts: ['.png'],
    magic: (b) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  'image/jpeg': {
    exts: ['.jpg', '.jpeg'],
    magic: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  'image/webp': {
    exts: ['.webp'],
    magic: (b) => b.length >= 12 && b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  'application/pdf': {
    exts: ['.pdf'],
    magic: (b) => b.length >= 5 && b.subarray(0, 5).toString('ascii') === '%PDF-',
  },
};

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async upload(file: Express.Multer.File, userId?: string) {
    this.assertSafeUpload(file);
    const { key, url } = await this.s3.upload(file.buffer, file.originalname, file.mimetype);
    return this.prisma.mediaFile.create({
      data: {
        key,
        url,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedById: userId,
      },
    });
  }

  findAll() {
    return this.prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  }

  async remove(id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Файл не найден');
    await this.removeMediaFile(file.id, file.key);
    return { success: true };
  }

  async removeByUrlIfUnused(url?: string | null, excluding?: { productMediaId?: string; documentId?: string }) {
    if (!url) return false;
    const file = await this.prisma.mediaFile.findFirst({ where: { url } });
    if (!file) return false;
    if (await this.isUrlReferenced(url, excluding)) return false;
    await this.removeMediaFile(file.id, file.key);
    return true;
  }

  private async removeMediaFile(id: string, key: string) {
    try {
      await this.s3.remove(key);
    } catch {
      // object may already be gone — still remove the DB record
    }
    await this.prisma.mediaFile.delete({ where: { id } });
  }

  private assertSafeUpload(file: Express.Multer.File) {
    if (!file || !file.buffer) throw new BadRequestException('Файл не передан');
    if (file.size > MAX_UPLOAD_SIZE) throw new BadRequestException('Файл слишком большой (максимум 15 МБ)');

    const mime = (file.mimetype || '').toLowerCase();
    const rule = ALLOWED_UPLOADS[mime];
    if (!rule) {
      throw new BadRequestException('Недопустимый тип файла. Разрешены PNG, JPG, WebP и PDF');
    }

    const ext = extname(file.originalname || '').toLowerCase();
    if (!rule.exts.includes(ext)) {
      throw new BadRequestException('Расширение файла не соответствует его типу');
    }

    if (!rule.magic(file.buffer)) {
      throw new BadRequestException('Содержимое файла не соответствует заявленному типу');
    }
  }

  private async isUrlReferenced(url: string, excluding?: { productMediaId?: string; documentId?: string }) {
    const [
      productMedia,
      documents,
      regDocuments,
      team,
      brands,
      news,
      cases,
      reviewsLogo,
      reviewsLetter,
    ] = await Promise.all([
      this.prisma.productMedia.count({
        where: { url, ...(excluding?.productMediaId ? { id: { not: excluding.productMediaId } } : {}) },
      }),
      this.prisma.document.count({
        where: { fileUrl: url, ...(excluding?.documentId ? { id: { not: excluding.documentId } } : {}) },
      }),
      this.prisma.regDocument.count({ where: { fileUrl: url } }),
      this.prisma.teamMember.count({ where: { photoUrl: url } }),
      this.prisma.manufacturer.count({ where: { logoUrl: url } }),
      this.prisma.news.count({ where: { coverUrl: url } }),
      this.prisma.case.count({ where: { imageUrl: url } }),
      this.prisma.review.count({ where: { logoUrl: url } }),
      this.prisma.review.count({ where: { letterUrl: url } }),
    ]);
    return (
      productMedia +
        documents +
        regDocuments +
        team +
        brands +
        news +
        cases +
        reviewsLogo +
        reviewsLetter >
      0
    );
  }
}
