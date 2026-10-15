/**
 * ម៉ែ — by FlowErs
 * Baby Size as Fruit Comparison (Weeks 4 – 40)
 *
 * NOTE FOR HEALTH ADVISOR:
 * - All length measurements (sizeCm) and Cambodian fruit comparisons are approximate
 *   and intended for visual engagement and reassurance for first-time mothers.
 * - These numbers are NOT strict clinical diagnostics or medical facts.
 * - Every row is marked // TO VERIFY so the medical advisor can review and adjust anytime.
 */

import { BabySize } from '../types';

/**
 * ============================================================================
 * EDITABLE CLINICAL REVIEW TABLE: BABY SIZES BY WEEK (4 to 40)
 * ============================================================================
 * Advisors can update `sizeCm`, `fruitKh`, `fruitEn`, or `emoji` directly below.
 */
export const BABY_SIZES_TABLE: BabySize[] = [
  // Week 4: Tiny embryo ~0.1 - 0.2 cm (Sesame seed / គ្រាប់ល្ង)
  { week: 4, fruitKh: 'គ្រាប់ល្ង', fruitEn: 'Sesame Seed', sizeCm: 0.2, emoji: '🌱' }, // TO VERIFY

  // Week 5: ~0.3 cm (Peppercorn / គ្រាប់ម្រេច)
  { week: 5, fruitKh: 'គ្រាប់ម្រេច', fruitEn: 'Peppercorn', sizeCm: 0.3, emoji: '🟢' }, // TO VERIFY

  // Week 6: ~0.6 cm (Pomegranate seed / គ្រាប់ទទឹម)
  { week: 6, fruitKh: 'គ្រាប់ទទឹម', fruitEn: 'Pomegranate Seed', sizeCm: 0.6, emoji: '🔴' }, // TO VERIFY

  // Week 7: ~1.0 cm (Blueberry / ប៊្លូបឺរី)
  { week: 7, fruitKh: 'ផ្លែប៊្លូបឺរី', fruitEn: 'Blueberry', sizeCm: 1.0, emoji: '🫐' }, // TO VERIFY

  // Week 8: ~1.6 cm (Raspberry / ផ្លែរ៉ាសបឺរី)
  { week: 8, fruitKh: 'ផ្លែរ៉ាសបឺរី', fruitEn: 'Raspberry', sizeCm: 1.6, emoji: '🍓' }, // TO VERIFY

  // Week 9: ~2.3 cm (Green grape / ផ្លែទំពាំងបាយជូរ)
  { week: 9, fruitKh: 'ផ្លែទំពាំងបាយជូរ', fruitEn: 'Grape', sizeCm: 2.3, emoji: '🍇' }, // TO VERIFY

  // Week 10: ~3.1 cm (Longan / ផ្លែមៀន)
  { week: 10, fruitKh: 'ផ្លែមៀន', fruitEn: 'Longan', sizeCm: 3.1, emoji: '🟤' }, // TO VERIFY

  // Week 11: ~4.1 cm (Lime / ផ្លែក្រូចឆ្មារ)
  { week: 11, fruitKh: 'ផ្លែក្រូចឆ្មារ', fruitEn: 'Lime', sizeCm: 4.1, emoji: '🍋' }, // TO VERIFY

  // Week 12: ~5.4 cm (Plum / ផ្លែព្រូន)
  { week: 12, fruitKh: 'ផ្លែព្រូន', fruitEn: 'Plum', sizeCm: 5.4, emoji: '🍑' }, // TO VERIFY

  // Week 13: ~7.4 cm (Lemon / ផ្លែក្រូចឆ្មារលឿង)
  { week: 13, fruitKh: 'ផ្លែក្រូចឆ្មារធំ', fruitEn: 'Lemon', sizeCm: 7.4, emoji: '🍋' }, // TO VERIFY

  // Week 14: ~8.7 cm (Kiwi / ផ្លែគីវី)
  { week: 14, fruitKh: 'ផ្លែគីវី', fruitEn: 'Kiwi', sizeCm: 8.7, emoji: '🥝' }, // TO VERIFY

  // Week 15: ~10.1 cm (Apple / ផ្លែប៉ោម)
  { week: 15, fruitKh: 'ផ្លែប៉ោម', fruitEn: 'Apple', sizeCm: 10.1, emoji: '🍎' }, // TO VERIFY

  // Week 16: ~11.6 cm (Avocado / ផ្លែប៊័រ)
  { week: 16, fruitKh: 'ផ្លែប៊័រ', fruitEn: 'Avocado', sizeCm: 11.6, emoji: '🥑' }, // TO VERIFY

  // Week 17: ~13.0 cm (Pear / ផ្លែសារី)
  { week: 17, fruitKh: 'ផ្លែសារី', fruitEn: 'Pear', sizeCm: 13.0, emoji: '🍐' }, // TO VERIFY

  // Week 18: ~14.2 cm (Sweet bell pepper / ម្ទេសប្លោក)
  { week: 18, fruitKh: 'ផ្លែម្ទេសប្លោក', fruitEn: 'Bell Pepper', sizeCm: 14.2, emoji: '🫑' }, // TO VERIFY

  // Week 19: ~15.3 cm (Mango / ផ្លែស្វាយ)
  { week: 19, fruitKh: 'ផ្លែស្វាយទុំ', fruitEn: 'Mango', sizeCm: 15.3, emoji: '🥭' }, // TO VERIFY

  // Week 20: ~16.4 cm (Banana / ផ្លែចេក)
  { week: 20, fruitKh: 'ផ្លែចេក', fruitEn: 'Banana', sizeCm: 16.4, emoji: '🍌' }, // TO VERIFY

  // Week 21: ~26.7 cm (Carrot / ការ៉ុត)
  { week: 21, fruitKh: 'មើមការ៉ុត', fruitEn: 'Carrot', sizeCm: 26.7, emoji: '🥕' }, // TO VERIFY

  // Week 22: ~27.8 cm (Corn cob / ផ្លែពោត)
  { week: 22, fruitKh: 'ផ្លែពោត', fruitEn: 'Corn', sizeCm: 27.8, emoji: '🌽' }, // TO VERIFY

  // Week 23: ~28.9 cm (Grapefruit / ផ្លែក្រូចត្លុងតូច)
  { week: 23, fruitKh: 'ផ្លែក្រូចពោធិ៍សាត់ធំ', fruitEn: 'Large Orange', sizeCm: 28.9, emoji: '🍊' }, // TO VERIFY

  // Week 24: ~30.0 cm (Dragon fruit / ផ្លែស្រកានាគ)
  { week: 24, fruitKh: 'ផ្លែស្រកានាគ', fruitEn: 'Dragon Fruit', sizeCm: 30.0, emoji: '🪷' }, // TO VERIFY

  // Week 25: ~34.6 cm (Cucumber / ផ្លែត្រសក់ស្រូវ)
  { week: 25, fruitKh: 'ផ្លែត្រសក់ផ្អែម', fruitEn: 'Sweet Melon', sizeCm: 34.6, emoji: '🥒' }, // TO VERIFY

  // Week 26: ~35.6 cm (Zucchini / ផ្លែត្រឡាច)
  { week: 26, fruitKh: 'ផ្លែត្រឡាចខ្ចី', fruitEn: 'Winter Melon', sizeCm: 35.6, emoji: '🍈' }, // TO VERIFY

  // Week 27: ~36.6 cm (Cauliflower / ផ្កាខាត់ណា)
  { week: 27, fruitKh: 'ផ្កាខាត់ណា', fruitEn: 'Cauliflower', sizeCm: 36.6, emoji: '🥦' }, // TO VERIFY

  // Week 28: ~37.6 cm (Eggplant / ផ្លែត្រប់វែង)
  { week: 28, fruitKh: 'ផ្លែត្រប់វែង', fruitEn: 'Eggplant', sizeCm: 37.6, emoji: '🍆' }, // TO VERIFY

  // Week 29: ~38.6 cm (Butternut squash / ផ្លែល្ពៅវែង)
  { week: 29, fruitKh: 'ផ្លែល្ពៅវែង', fruitEn: 'Butternut Squash', sizeCm: 38.6, emoji: '🎃' }, // TO VERIFY

  // Week 30: ~39.9 cm (Cabbage / ស្ពៃក្តោប)
  { week: 30, fruitKh: 'ស្ពៃក្តោប', fruitEn: 'Cabbage', sizeCm: 39.9, emoji: '🥬' }, // TO VERIFY

  // Week 31: ~41.1 cm (Coconut / ផ្លែដូង)
  { week: 31, fruitKh: 'ផ្លែដូងខ្ចី', fruitEn: 'Coconut', sizeCm: 41.1, emoji: '🥥' }, // TO VERIFY

  // Week 32: ~42.4 cm (Papaya / ផ្លែល្ហុងទុំ)
  { week: 32, fruitKh: 'ផ្លែល្ហុងទុំ', fruitEn: 'Papaya', sizeCm: 42.4, emoji: '🍈' }, // TO VERIFY

  // Week 33: ~43.7 cm (Pineapple / ផ្លែម្នាស់)
  { week: 33, fruitKh: 'ផ្លែម្នាស់', fruitEn: 'Pineapple', sizeCm: 43.7, emoji: '🍍' }, // TO VERIFY

  // Week 34: ~45.0 cm (Cantaloupe / ផ្លែត្រសក់ផ្អែមមូល)
  { week: 34, fruitKh: 'ត្រសក់ផ្អែមមូល', fruitEn: 'Cantaloupe', sizeCm: 45.0, emoji: '🍈' }, // TO VERIFY

  // Week 35: ~46.2 cm (Honeydew melon / ផ្លែត្រសក់ស្រូវទុំ)
  { week: 35, fruitKh: 'ផ្លែត្រសក់ស្រូវទុំ', fruitEn: 'Honeydew Melon', sizeCm: 46.2, emoji: '🍈' }, // TO VERIFY

  // Week 36: ~47.4 cm (Romaine lettuce / ដើមស្ពៃបូកគោ)
  { week: 36, fruitKh: 'ស្ពៃបូកគោ', fruitEn: 'Napa Cabbage', sizeCm: 47.4, emoji: '🥬' }, // TO VERIFY

  // Week 37: ~48.6 cm (Winter melon / ផ្លែត្រឡាចធំ)
  { week: 37, fruitKh: 'ផ្លែត្រឡាចចាស់', fruitEn: 'Winter Melon', sizeCm: 48.6, emoji: '🍈' }, // TO VERIFY

  // Week 38: ~49.8 cm (Pumpkin / ផ្លែល្ពៅទុំ)
  { week: 38, fruitKh: 'ផ្លែល្ពៅទុំ', fruitEn: 'Pumpkin', sizeCm: 49.8, emoji: '🎃' }, // TO VERIFY

  // Week 39: ~50.7 cm (Watermelon / ផ្លែឪឡឹក)
  { week: 39, fruitKh: 'ផ្លែឪឡឹក', fruitEn: 'Watermelon', sizeCm: 50.7, emoji: '🍉' }, // TO VERIFY

  // Week 40: ~51.2 cm (Jackfruit / ផ្លែខ្នុរ)
  { week: 40, fruitKh: 'ផ្លែខ្នុរទុំ', fruitEn: 'Jackfruit', sizeCm: 51.2, emoji: '🍈' }, // TO VERIFY
];

/**
 * Returns the baby-size comparison for a given week.
 * Clamps safely between week 4 and 40.
 */
export const getBabySizeForWeek = (week: number): BabySize => {
  const safeWeek = Math.max(4, Math.min(40, Math.round(week)));
  const found = BABY_SIZES_TABLE.find((item) => item.week === safeWeek);
  if (found) return found;

  // Fallback if not directly matched
  return {
    week: safeWeek,
    fruitKh: 'ផ្លែទំពាំងបាយជូរ',
    fruitEn: 'Grape',
    sizeCm: 2.3,
    emoji: '🍇',
  };
};
