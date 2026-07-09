import {
  PrismaClient,
  Role,
  ReviewType,
  PublishStatus,
  ProductStatus,
  RegDocStatus,
  RiskClass,
  RegDocType,
  Prisma,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const M = (ru: string, uz = ru, en = ru) => ({ ru, uz, en });

async function main() {
  // ── First superadmin ──
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@soi.uz';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: 'Super Admin', role: Role.SUPERADMIN },
  });
  console.log(`✓ superadmin: ${email}`);

  // ── Sample reviews (only if empty) ──
  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({
      data: [
        {
          type: ReviewType.BUYER,
          status: PublishStatus.PUBLISHED,
          color: '#c0392b',
          company: M('Наманганская областная больница', 'Namangan viloyat shifoxonasi', 'Namangan Regional Hospital'),
          region: M('Наманган · госучреждение', 'Namangan · davlat', 'Namangan · public'),
          quote: M('Благодарим за оперативную поставку и качественный монтаж оборудования.'),
        },
        {
          type: ReviewType.SUPPLIER,
          status: PublishStatus.PUBLISHED,
          color: '#e0492f',
          company: M('Mindray'),
          quote: M('Mindray благодарит за надёжное партнёрство и профессиональное продвижение продукции.'),
        },
      ],
    });
    console.log('✓ sample reviews created');
  }

  // ── Catalog A3: 3-уровневое дерево типов (category → subcategory → group) ──
  // Уровень 1: 4 корневые категории с общими атрибутами
  if ((await prisma.typeCategory.count()) === 0) {
    const roots: [string, string, string[], Record<string, unknown>][] = [
      [
        'equipment',
        'Медицинское оборудование',
        [
          'Диагностическое оборудование',
          'Терапевтическое оборудование',
          'Лабораторное оборудование',
        ],
        {
          fields: [
            { key: 'manufacturer_country', label: M('Страна производителя'), type: 'text' },
            { key: 'warranty_months', label: M('Гарантия (месяцы)'), type: 'number', unit: 'мес' },
            { key: 'dimensions', label: M('Габариты'), type: 'text' },
            { key: 'weight', label: M('Вес'), type: 'number', unit: 'кг' },
          ],
        },
      ],
      [
        'furniture',
        'Медицинская мебель',
        ['Кровати и кушетки', 'Столы и тумбы'],
        {
          fields: [
            { key: 'material', label: M('Материал'), type: 'text' },
            { key: 'color', label: M('Цвет'), type: 'text' },
          ],
        },
      ],
      [
        'instruments',
        'Медицинские инструменты',
        ['Хирургические инструменты', 'Диагностические инструменты'],
        {
          fields: [
            { key: 'material', label: M('Материал'), type: 'text' },
            { key: 'sterile', label: M('Стерильные'), type: 'boolean' },
          ],
        },
      ],
      [
        'consumables',
        'Расходные материалы',
        ['Перевязочные материалы', 'СИЗ персонала'],
        {
          fields: [
            { key: 'pack_qty', label: M('Кол-во в упаковке'), type: 'number' },
            { key: 'expiry_months', label: M('Срок годности'), type: 'number', unit: 'мес' },
          ],
        },
      ],
    ];

    for (let i = 0; i < roots.length; i++) {
      const [slug, name, subs, attrSchema] = roots[i];
      const cat = await prisma.typeCategory.create({
        data: { slug, name: M(name), order: i, attrSchema: attrSchema as Prisma.InputJsonValue },
      });

      // Уровень 2: подкатегории с дополнительными атрибутами
      for (let j = 0; j < subs.length; j++) {
        await prisma.typeSubcategory.create({
          data: {
            categoryId: cat.id,
            slug: `${slug}-${j + 1}`,
            name: M(subs[j]),
            order: j,
            attrSchema: j === 0 ? { fields: [{ key: 'model', label: M('Модель'), type: 'text' }] } : undefined,
          },
        });
      }
    }
    console.log('✓ type_categories + type_subcategories (4 корня, 8 подкатегорий)');
  }

  // ── Уровень 3: товарные группы (листовой уровень) ──
  if ((await prisma.productGroup.count()) === 0) {
    const diagSubcat = await prisma.typeSubcategory.findFirst({ where: { slug: 'equipment-1' } });
    if (diagSubcat) {
      // ЭКГ-аппараты (группа)
      await prisma.productGroup.create({
        data: {
          subcatId: diagSubcat.id,
          slug: 'ecg-devices',
          name: M('ЭКГ-аппараты'),
          order: 0,
          active: true,
          attrSchema: {
            fields: [
              { key: 'channels', label: M('Каналов'), type: 'number', unit: 'шт' },
              { key: 'display', label: M('Экран'), type: 'text' },
              { key: 'battery_hours', label: M('Время работы батареи'), type: 'number', unit: 'ч' },
              { key: 'memory_records', label: M('Запись в памяти'), type: 'number', unit: 'запис' },
              {
                key: 'connectivity',
                label: M('Подключение'),
                type: 'multiselect',
                options: ['USB', 'Wi-Fi', 'Bluetooth', 'Ethernet'],
              },
            ],
          } as Prisma.InputJsonValue,
        },
      });

      // УЗИ-сканеры (группа)
      await prisma.productGroup.create({
        data: {
          subcatId: diagSubcat.id,
          slug: 'ultrasound-scanners',
          name: M('УЗИ-сканеры'),
          order: 1,
          active: true,
          attrSchema: {
            fields: [
              { key: 'probe_types', label: M('Типы датчиков'), type: 'multiselect', options: ['Линейный', 'Конвексный', 'Фазированный'] },
              { key: 'frequency_mhz', label: M('Частота'), type: 'number', unit: 'МГц' },
              { key: 'display_inches', label: M('Размер экрана'), type: 'number', unit: 'дюйм' },
            ],
          } as Prisma.InputJsonValue,
        },
      });
    }
    console.log('✓ product_groups (2 группы с attrSchema)');
  }

  // ── Catalog A3: 15 направлений медицины ──
  if ((await prisma.specCategory.count()) === 0) {
    const specs = [
      'Кардиология',
      'Хирургия',
      'Реанимация и анестезиология',
      'Стоматология',
      'Гинекология и акушерство',
      'Пульмонология',
      'Онкология',
      'Лабораторная диагностика',
      'Реабилитация и ортопедия',
      'Педиатрия',
      'Дерматология и косметология',
      'Оториноларингология (ЛОР)',
      'Офтальмология',
      'Эндокринология',
      'Инфектология',
    ];
    await prisma.specCategory.createMany({
      data: specs.map((name, i) => ({ slug: `spec-${i + 1}`, name: M(name), order: i })),
    });
    console.log('✓ spec_categories (15 направлений)');
  }

  // ── Пример товара: ЭКГ-аппарат «КардиоМакс-12» ──
  if ((await prisma.product.count()) === 0) {
    const manufacturer = await prisma.manufacturer.upsert({
      where: { id: 'seed-manufacturer-neurosoft' },
      update: {},
      create: { id: 'seed-manufacturer-neurosoft', name: 'Нейрософт', country: 'RU', legalName: 'ООО «Нейрософт»' },
    });
    const ecgGroup = await prisma.productGroup.findFirst({ where: { slug: 'ecg-devices' } });
    const cardio = await prisma.specCategory.findFirst({ where: { slug: 'spec-1' } });

    const product = await prisma.product.create({
      data: {
        sku: 'ECG-12-KM',
        gtin: '4607123456789',
        name: M('ЭКГ-аппарат 12-канальный «КардиоМакс-12»'),
        manufacturerId: manufacturer.id,
        status: ProductStatus.ACTIVE,
        attrs: {
          channels: 12,
          display: 'цветной TFT 5.7″',
          battery_hours: 4,
          memory_records: 1000,
          connectivity: ['USB', 'Wi-Fi', 'Bluetooth'],
          manufacturer_country: 'RU',
          warranty_months: 24,
          dimensions: '250×150×80 мм',
          weight: 1.8,
        },
        isNew: true,
        popularity: 80,
      },
    });

    // Привязка к товарной группе
    if (ecgGroup) {
      await prisma.productGroupItem.create({ data: { productId: product.id, groupId: ecgGroup.id } });
      // Пересчитаем видимость группы (товар = 1, порог = 3, не видна; но обновим счётчик)
      await prisma.productGroup.update({
        where: { id: ecgGroup.id },
        data: { productCount: 1, visible: false },
      });
    }

    // Привязка к направлению медицины
    if (cardio) {
      await prisma.productSpec.create({ data: { productId: product.id, specId: cardio.id } });
    }

    const seller = await prisma.seller.upsert({
      where: { id: 'seed-seller-soi' },
      update: {},
      create: { id: 'seed-seller-soi', name: 'ИНДУСТРИЯ ЗДОРОВЬЯ', isInternal: true },
    });
    const warehouse = await prisma.warehouse.upsert({
      where: { id: 'seed-warehouse-main' },
      update: {},
      create: { id: 'seed-warehouse-main', name: 'Основной склад' },
    });

    await prisma.productPrice.create({
      data: { productId: product.id, sellerId: seller.id, price: 42_000_000, currency: 'UZS', active: true },
    });
    await prisma.productStock.create({
      data: { productId: product.id, sellerId: seller.id, warehouseId: warehouse.id, qty: 5 },
    });
    await prisma.regDocument.create({
      data: {
        productId: product.id,
        type: RegDocType.RU,
        number: 'РЗН 2021/14823',
        classRisk: RiskClass.CLASS_2A,
        issuedAt: new Date('2021-06-15'),
        validUntil: new Date('2026-06-15'),
        issuer: 'Агентство по развитию рынка медизделий РУз',
        status: RegDocStatus.PRESENT,
      },
    });
    console.log('✓ пример товара: ЭКГ-аппарат (группа + направление + цена + остаток + регдок)');

    // Дополнительные товары, чтобы группы перешли порог видимости (≥3) и появились на витрине.
    const uziGroup = await prisma.productGroup.findFirst({ where: { slug: 'ultrasound-scanners' } });
    const extra: Array<{ sku: string; name: string; groupId?: string; price: number; attrs: Record<string, unknown>; badge?: string; isNew?: boolean }> = [
      { sku: 'ECG-03-KP', name: 'ЭКГ-аппарат 3-канальный «КардиоПро-3»', groupId: ecgGroup?.id, price: 18_500_000,
        attrs: { channels: 3, display: 'ЖК 3.5″', battery_hours: 6, memory_records: 300, connectivity: ['USB'], manufacturer_country: 'RU', warranty_months: 24, weight: 1.1 } },
      { sku: 'ECG-06-KM', name: 'ЭКГ-аппарат 6-канальный «КардиоМакс-6»', groupId: ecgGroup?.id, price: 27_900_000, badge: 'hit',
        attrs: { channels: 6, display: 'цветной TFT 5″', battery_hours: 5, memory_records: 500, connectivity: ['USB', 'Bluetooth'], manufacturer_country: 'RU', warranty_months: 24, weight: 1.4 } },
      { sku: 'USG-15-VP', name: 'УЗИ-сканер портативный «ВижнПро-15»', groupId: uziGroup?.id, price: 95_000_000, isNew: true,
        attrs: { probe_types: ['Линейный', 'Конвексный'], frequency_mhz: 15, display_inches: 15, manufacturer_country: 'CN', warranty_months: 12, weight: 6.5 } },
      { sku: 'USG-21-VE', name: 'УЗИ-сканер экспертный «ВижнЭксперт-21»', groupId: uziGroup?.id, price: 210_000_000, badge: 'hit',
        attrs: { probe_types: ['Линейный', 'Конвексный', 'Фазированный'], frequency_mhz: 18, display_inches: 21, manufacturer_country: 'DE', warranty_months: 24, weight: 62 } },
      { sku: 'USG-10-VM', name: 'УЗИ-сканер мобильный «ВижнМини-10»', groupId: uziGroup?.id, price: 68_000_000,
        attrs: { probe_types: ['Конвексный'], frequency_mhz: 10, display_inches: 10, manufacturer_country: 'CN', warranty_months: 12, weight: 4.2 } },
    ];
    for (const e of extra) {
      if (!e.groupId) continue;
      const pr = await prisma.product.create({
        data: {
          sku: e.sku,
          name: M(e.name),
          manufacturerId: manufacturer.id,
          status: ProductStatus.ACTIVE,
          attrs: e.attrs as Prisma.InputJsonValue,
          badge: e.badge,
          isNew: !!e.isNew,
          popularity: 60,
          groups: { create: { groupId: e.groupId } },
          specs: cardio ? { create: { specId: cardio.id } } : undefined,
        },
      });
      await prisma.productPrice.create({
        data: { productId: pr.id, sellerId: seller.id, price: e.price, currency: 'UZS', active: true },
      });
      await prisma.productStock.create({
        data: { productId: pr.id, sellerId: seller.id, warehouseId: warehouse.id, qty: 3 },
      });
    }
    // Пересчёт видимости групп по фактическому количеству товаров.
    for (const slug of ['ecg-devices', 'ultrasound-scanners']) {
      const g = await prisma.productGroup.findFirst({ where: { slug } });
      if (!g) continue;
      const count = await prisma.productGroupItem.count({ where: { groupId: g.id } });
      await prisma.productGroup.update({ where: { id: g.id }, data: { productCount: count, visible: count >= 3 } });
    }
    console.log('✓ +5 товаров (ЭКГ ×2, УЗИ ×3) — группы видимы (≥3)');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
