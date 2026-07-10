import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NormalizedEtenderLot } from './etender.types';

// Systematic medical-relevance filter applied BEFORE persisting/showing lots, so
// only medical procurement reaches etender_lots and the #/tenders showcase.
//
// Approach: keyword/stem matching (RU + UZ latin/cyrillic + EN) over a lot's name
// and category. Stems are matched at a word boundary (Unicode-aware) so "медицин"
// hits "медицинский" but not "медиана". Sources that are medical by definition
// (UzMedImpex = the state medical-import authority) bypass the filter entirely.
//
// The list is intentionally easy to tune — add/remove stems here.
export const MEDICAL_STEMS: string[] = [
  // ── RU: domain / institutions ──
  'медицин', 'медиздел', 'медтехн', 'медоборуд', 'медучрежд', 'меддиагност',
  'здравоохран', 'больниц', 'клиник', 'госпитал', 'поликлиник', 'медцентр',
  'диспансер', 'амбулатор', 'роддом', 'фельдшер', 'санитар', 'аптек', 'аптечн',
  // ── RU: specialties ──
  'хирург', 'стоматолог', 'дентал', 'офтальмолог', 'кардиолог', 'кардио',
  'невролог', 'ортопед', 'травматолог', 'гинеколог', 'акушер', 'педиатр',
  'онколог', 'уролог', 'нефролог', 'дерматолог', 'эндокринолог', 'анестезиолог',
  'реанимац', 'реаниматолог', 'терапевт', 'рентгенолог', 'патологоанатом',
  // ── RU: pharma / reagents ──
  'фармац', 'фармсубстан', 'лекарствен', 'медикамент', 'вакцин', 'сыворотк',
  'антибиотик', 'инсулин', 'анальгетик', 'антисептик', 'дезинфиц', 'дезинфек',
  'стерилиз', 'стерильн', 'реагент', 'реактив', 'тест-полоск', 'тест-систем',
  'диагностическ', 'иммунолог', 'биохимическ анализ', 'наркотическ средств',
  // ── RU: equipment ──
  'рентген', 'томограф', 'флюорограф', 'маммограф', 'ангиограф', 'ультразвук',
  'узи-аппарат', 'эхокардио', 'электрокардио', ' экг', ' ээг', ' эмг', ' мрт',
  ' кт-', 'дефибриллятор', 'кардиомонитор', 'монитор пациент', 'пульсоксиметр',
  'тонометр', 'глюкометр', 'спирометр', 'аудиометр', 'электроэнцефал', 'наркозн',
  ' ивл', 'аппарат искусственной вентиляц', 'инкубатор для новорожд', 'кувез',
  'лапароскоп', 'эндоскоп', 'гастроскоп', 'колоноскоп', 'бронхоскоп', 'цистоскоп',
  'артроскоп', 'автоклав', 'стерилизатор', 'коагулятор', 'электрохирург',
  'физиотерап', 'магнитотерап', 'ингалятор', 'небулайзер', 'кислородн концентр',
  'бактерицид', 'облучатель', 'дозиметр', 'биксы', 'операционн',
  // ── RU: consumables / devices ──
  'шприц', 'катетер', 'канюл', 'стент', 'имплант', 'эндопротез', 'протез',
  'ортез', 'бандаж', 'бинт', 'марл', 'лейкопластыр', 'шовный материал', 'скальпел',
  'зажим хирург', 'игла инъекц', 'инфузион', 'перевязочн', 'дренаж', 'мочеприемник',
  'калоприемник', 'пробирк', 'вакутейнер', 'чашк петри', 'питательн сред',
  'перчатки медицин', 'маска медицин', 'халат медицин', 'вата медицин',
  // ── UZ (latin + cyrillic) ──
  'tibbiy', 'tibbiyot', 'shifoxona', 'shifokor', 'poliklinika', 'kasalxona',
  'dori-darmon', 'dorivor', 'jarrohlik', 'jarroh', 'statsionar', 'vaksina',
  'sterilizatsiya', 'dezinfeksiya', 'farmatsevt', 'apteka', 'reaktiv',
  'тиббий', 'дори', 'шифохона', 'касалхона',
  // UZ latin medical specialties / terms (list names are often latinized Russian)
  'endokrin', 'kardiolog', 'nefrolog', 'onkolog', 'oftalmolog', 'urolog',
  'ginekolog', 'pediatr', 'nevrolog', 'ortoped', 'travmatolog', 'anesteziolog',
  'reanimatsiya', 'stomatolog', 'otolaringolog', 'ftiziatr', 'radioterap',
  'glyukoza', 'tibbiy jihoz', 'tibbiy buyum', 'tibbiy asbob', 'meditsina',
  // ── EN ──
  'medical', 'medicine', 'medicament', 'pharmaceut', 'pharma', 'hospital', 'clinic',
  'surgical', 'surgery', 'dental', 'diagnostic', 'radiolog', 'x-ray', 'ultrasound',
  'tomograph', 'ventilator', 'defibrillator', 'catheter', 'syringe', 'implant',
  'prosthes', 'vaccine', 'antibiotic', 'reagent', 'sterili', 'disinfect', 'endoscop',
  'stethoscop', 'orthopedic', 'healthcare',
];

// Sources whose every item is medical by definition (skip keyword filter).
const ALWAYS_MEDICAL_PREFIXES = ['UZMEDIMPEX'];

function normalize(s: string): string {
  return (s || '').toLowerCase().replace(/ё/g, 'е').replace(/[ʼ`']/g, "'");
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class MedicalFilter {
  readonly enabled: boolean;
  private readonly regex: RegExp;

  constructor(config: ConfigService) {
    this.enabled = String(config.get('ETENDER_MEDICAL_ONLY') ?? 'true') !== 'false';
    // A stem matches at a word start: preceded by start-of-string or a non-letter.
    const alt = MEDICAL_STEMS.map((s) => escapeRe(normalize(s))).join('|');
    this.regex = new RegExp('(?:^|[^\\p{L}])(?:' + alt + ')', 'iu');
  }

  private static isAlwaysMedical(source: string): boolean {
    return ALWAYS_MEDICAL_PREFIXES.some((p) => source.startsWith(p));
  }

  isMedical(lot: Pick<NormalizedEtenderLot, 'name' | 'categoryName'>): boolean {
    const text = normalize(`${lot.name || ''} ${lot.categoryName || ''}`);
    return this.regex.test(text);
  }

  // Keep only medical lots for a source (unless disabled or source is always-medical).
  apply(lots: NormalizedEtenderLot[], source: string): NormalizedEtenderLot[] {
    if (!this.enabled || MedicalFilter.isAlwaysMedical(source)) return lots;
    return lots.filter((l) => this.isMedical(l));
  }
}
