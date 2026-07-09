import { PrismaService } from '../prisma/prisma.service';

// ИНДУСТРИЯ ЗДОРОВЬЯ работает с одним внутренним продавцом и одним складом (см. решение по A3).
// Обе записи создаются лениво при первом обращении — seed их тоже может создать заранее.
export async function ensureInternalSeller(prisma: PrismaService) {
  const existing = await prisma.seller.findFirst({ where: { isInternal: true } });
  if (existing) return existing;
  return prisma.seller.create({ data: { name: 'ИНДУСТРИЯ ЗДОРОВЬЯ', isInternal: true } });
}

export async function ensureDefaultWarehouse(prisma: PrismaService) {
  const existing = await prisma.warehouse.findFirst();
  if (existing) return existing;
  return prisma.warehouse.create({ data: { name: 'Основной склад' } });
}
