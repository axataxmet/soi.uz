import { Injectable } from '@nestjs/common';
import { NormalizedEtenderLot } from './etender.types';

// Classifies a medical lot into one of these buckets from its name+category.
// Independent taxonomy for the tenders showcase (not the catalog's slugs).
export type MedCategoryId = 'equipment' | 'furniture' | 'instruments' | 'consumables' | 'drugs' | 'other';

export const MED_CATEGORIES: { id: MedCategoryId; label: { ru: string; uz: string; en: string } }[] = [
  { id: 'equipment', label: { ru: 'Медицинское оборудование', uz: 'Tibbiy uskunalar', en: 'Medical equipment' } },
  { id: 'furniture', label: { ru: 'Медицинская мебель', uz: 'Tibbiy mebel', en: 'Medical furniture' } },
  { id: 'instruments', label: { ru: 'Медицинские инструменты', uz: 'Tibbiy asboblar', en: 'Medical instruments' } },
  { id: 'consumables', label: { ru: 'Расходные материалы', uz: 'Sarf materiallari', en: 'Consumables' } },
  { id: 'drugs', label: { ru: 'Лекарственные средства', uz: 'Dori vositalari', en: 'Medicines' } },
  { id: 'other', label: { ru: 'Прочее', uz: 'Boshqa', en: 'Other' } },
];

// Ordered rules — first match wins. Order matters: specific phrases (infusion
// system → consumable) must come before generic device words (system → equipment).
// Stems are matched at a Unicode word boundary. Tunable — edit the arrays.
const RULES: { id: MedCategoryId; stems: string[] }[] = [
  {
    id: 'drugs',
    stems: [
      'лекарствен', 'дори восита', 'дори-дармон', 'dori vosita', 'dori-darmon', 'дори воситас', 'медикамент',
      'препарат', 'вакцин', 'vaksina', 'сыворотк', 'анатоксин', 'иммуноглобулин', 'антибиотик', 'инсулин',
      'гепарин', 'альбумин', 'плазмозамен', 'инфузионный раствор', 'раствор для инфуз', 'раствор для инъекц',
      'таблетк', 'капсул', 'ампул', 'суспензи', 'орфан', 'фармацевт', 'farmatsevt', 'лекарств', 'дори', ' мг ', ' мг,', ' мг.',
    ],
  },
  {
    id: 'consumables',
    stems: [
      'расходн', 'расходный материал', 'sarf', 'bir martali', 'одноразов', 'шприц', 'shprits', 'игла инъекц',
      'катетер', 'kateter', 'канюл', 'бинт', ' вата', 'марл', 'салфетк', 'перчатк', "qo'lqop", 'маск', 'бахил',
      'халат одноразов', 'шовный материал', 'хирургическ нит', 'пластыр', 'лейкопластыр', 'дренаж', 'мочеприемник',
      'калоприемник', 'система для инфуз', 'инфузионн систем', 'инфузионн', 'гемоконтейнер', 'gemokonteyner',
      'контейнер для крови', 'пробирк', 'вакутейнер', 'тест-полоск', 'тест-систем', 'реагент', 'reaktiv', 'реактив',
      'пакет для', 'зонд одноразов', 'электрод одноразов', 'дезинфиц', 'антисептик', 'спирт медицин',
      'tibbiy buyum', 'тиббий буюм', 'медицинск изделия', 'мед изделия', 'медизделия',
    ],
  },
  {
    id: 'instruments',
    stems: [
      'инструмент', 'asbob', 'скальпел', 'пинцет', 'зажим', 'иглодержател', 'ранорасширител', 'ретрактор', 'троакар',
      'кюретк', 'распатор', 'долот', 'остеотом', 'корнцанг', 'ножницы хирург', 'зонд хирург', 'набор для операц',
      'жарроҳлик асбоб', 'jarrohlik asbob',
    ],
  },
  {
    id: 'furniture',
    stems: [
      'мебель', 'mebel', 'кроват', 'karavot', 'койк', 'каталк', 'тележк медицин', 'операционный стол', 'смотровой стол',
      'стол операц', 'кушетк', 'кресло', 'банкетк', 'пеленальн', 'тумб', 'шкаф медицин', 'шкаф для', 'стеллаж',
      'штатив', 'носилк',
    ],
  },
  {
    id: 'equipment',
    stems: [
      'оборудован', 'uskuna', 'jihoz', 'жиҳоз', 'ускуна', 'аппарат', 'apparat', 'комплекс', 'kompleks', 'установк',
      'монитор пациент', 'кардиомонитор', 'дефибриллятор', 'ивл', 'искусственной вентиляц', 'наркозн', 'рентген',
      'томограф', 'мскт', 'кт-', 'мрт', 'флюорограф', 'маммограф', 'ангиограф', 'узи', 'ультразвук', 'эхокардио',
      'электрокардиограф', 'экг', 'ээг', 'анализатор', 'центрифуг', 'стерилизатор', 'автоклав', 'инкубатор', 'кувез',
      'лазер', 'коагулятор', 'электрохирург', 'физиотерап', 'облучател', 'дистиллятор', 'микроскоп', 'эндоскоп',
      'лапароскоп', 'дозиметр', 'спирометр', 'аудиометр', 'тонометр', 'концентратор кислород', 'небулайзер',
      'ингалятор', 'помп', 'инфузомат', 'дозатор', 'система визуализ', 'станция', 'машин', 'прибор', 'device',
      'equipment', 'apparatus', 'scanner', 'analyzer',
      'роботизирован', 'хирургическая систем', 'система хирург', 'jarrohlik tizim', 'глюкоза мониторинг',
      'glyukoza monitoring', 'uzluksiz glyukoza', 'мониторинг тизим',
    ],
  },
];

function normalize(s: string): string {
  return (s || '').toLowerCase().replace(/ё/g, 'е').replace(/[ʼ`']/g, "'");
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function buildRe(stems: string[]): RegExp {
  return new RegExp('(?:^|[^\\p{L}])(?:' + stems.map((s) => escapeRe(normalize(s))).join('|') + ')', 'iu');
}

@Injectable()
export class MedCategoryClassifier {
  private readonly compiled = RULES.map((r) => ({ id: r.id, re: buildRe(r.stems) }));

  classify(lot: Pick<NormalizedEtenderLot, 'name' | 'categoryName'>): MedCategoryId {
    const text = normalize(`${lot.name || ''} ${lot.categoryName || ''}`);
    for (const { id, re } of this.compiled) {
      if (re.test(text)) return id;
    }
    return 'other';
  }
}
