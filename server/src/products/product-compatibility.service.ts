import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompatibilityDto } from './dto/product-compatibility.dto';

@Injectable()
export class ProductCompatibilityService {
  constructor(private readonly prisma: PrismaService) {}

  // Бидирекционально: "чем оснащён" (я — оборудование) и "куда подходит" (я — расходник).
  async findAll(productId: string) {
    const [asEquipment, asConsumable] = await this.prisma.$transaction([
      this.prisma.productCompatibility.findMany({ where: { equipmentId: productId }, include: { consumable: true } }),
      this.prisma.productCompatibility.findMany({ where: { consumableId: productId }, include: { equipment: true } }),
    ]);
    return { asEquipment, asConsumable };
  }

  create(equipmentId: string, dto: CreateCompatibilityDto) {
    return this.prisma.productCompatibility.create({
      data: { equipmentId, consumableId: dto.consumableId, notes: dto.notes },
    });
  }

  async remove(id: string) {
    const found = await this.prisma.productCompatibility.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Связь совместимости не найдена');
    await this.prisma.productCompatibility.delete({ where: { id } });
    return { success: true };
  }
}
