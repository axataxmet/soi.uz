import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { CreateProductMediaDto, UpdateProductMediaDto } from './dto/product-media.dto';

@Injectable()
export class ProductMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  findAll(productId: string) {
    return this.prisma.productMedia.findMany({ where: { productId }, orderBy: { order: 'asc' } });
  }

  async create(productId: string, dto: CreateProductMediaDto) {
    await this.ensureProduct(productId);
    if (dto.isMain) {
      await this.prisma.productMedia.updateMany({ where: { productId }, data: { isMain: false } });
    }
    return this.prisma.productMedia.create({
      data: {
        productId,
        url: dto.url,
        type: dto.type,
        altText: dto.altText,
        order: dto.order ?? 0,
        isMain: !!dto.isMain,
      },
    });
  }

  async update(id: string, dto: UpdateProductMediaDto) {
    const media = await this.ensure(id);
    const oldUrl = media.url;
    if (dto.isMain) {
      await this.prisma.productMedia.updateMany({
        where: { productId: media.productId, id: { not: id } },
        data: { isMain: false },
      });
    }
    const updated = await this.prisma.productMedia.update({
      where: { id },
      data: { url: dto.url, type: dto.type, altText: dto.altText, order: dto.order, isMain: dto.isMain },
    });
    if (dto.url && dto.url !== oldUrl) {
      await this.media.removeByUrlIfUnused(oldUrl, { productMediaId: id });
    }
    return updated;
  }

  async remove(id: string) {
    const media = await this.ensure(id);
    await this.prisma.productMedia.delete({ where: { id } });
    await this.media.removeByUrlIfUnused(media.url, { productMediaId: id });
    return { success: true };
  }

  private async ensureProduct(productId: string) {
    const p = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!p) throw new NotFoundException('Товар не найден');
  }

  private async ensure(id: string) {
    const m = await this.prisma.productMedia.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Медиафайл не найден');
    return m;
  }
}
