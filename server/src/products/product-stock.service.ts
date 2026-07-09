import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureInternalSeller, ensureDefaultWarehouse } from './seller-warehouse.util';
import { UpsertProductStockDto } from './dto/product-stock.dto';

@Injectable()
export class ProductStockService {
  constructor(private readonly prisma: PrismaService) {}

  async find(productId: string) {
    const seller = await ensureInternalSeller(this.prisma);
    return this.prisma.productStock.findFirst({ where: { productId, sellerId: seller.id } });
  }

  async upsert(productId: string, dto: UpsertProductStockDto) {
    const [seller, warehouse] = await Promise.all([
      ensureInternalSeller(this.prisma),
      ensureDefaultWarehouse(this.prisma),
    ]);
    const existing = await this.prisma.productStock.findFirst({ where: { productId, sellerId: seller.id } });
    const data = { qty: dto.qty, reservedQty: dto.reservedQty };
    if (existing) {
      return this.prisma.productStock.update({ where: { id: existing.id }, data });
    }
    return this.prisma.productStock.create({
      data: { productId, sellerId: seller.id, warehouseId: warehouse.id, ...data },
    });
  }
}
