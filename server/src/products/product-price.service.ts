import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureInternalSeller } from './seller-warehouse.util';
import { UpsertProductPriceDto } from './dto/product-price.dto';

@Injectable()
export class ProductPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async find(productId: string) {
    const seller = await ensureInternalSeller(this.prisma);
    return this.prisma.productPrice.findFirst({ where: { productId, sellerId: seller.id } });
  }

  async upsert(productId: string, dto: UpsertProductPriceDto) {
    const seller = await ensureInternalSeller(this.prisma);
    const existing = await this.prisma.productPrice.findFirst({ where: { productId, sellerId: seller.id } });
    const data = {
      price: dto.price,
      oldPrice: dto.oldPrice,
      wholesalePrice: dto.wholesalePrice,
      priceOnRequest: dto.priceOnRequest,
      priceWithVat: dto.priceWithVat,
      priceWithoutVat: dto.priceWithoutVat,
      currency: dto.currency,
      active: dto.active,
    };
    if (existing) {
      return this.prisma.productPrice.update({ where: { id: existing.id }, data });
    }
    return this.prisma.productPrice.create({ data: { productId, sellerId: seller.id, ...data } });
  }
}
