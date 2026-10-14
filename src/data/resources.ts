/**
 * ============================================================================
 * ម៉ែ — by FlowErs: Curated Trusted Pregnancy Resources Catalog
 * ============================================================================
 *
 * HOW THE FLOWERS TEAM ADDS RESOURCES ONE BY ONE:
 *
 * Each resource object represents a trusted article or clinical guideline
 * from health authorities (e.g. Cambodia Ministry of Health / NMCHC, WHO,
 * UNICEF, RHAC).
 *
 * VOICE: "ម៉ែ" (Mom) is the app's NAME only. Write as a friendly companion
 * speaking to the reader as "you" (អ្នក). Use "ទារក" for the baby
 *
 * TO ADD A NEW RESOURCE:
 * 1. Copy the RESOURCE TEMPLATE below.
 * 2. Fill in each field.
 * 3. Add it to the INITIAL_PREGNANCY_RESOURCES array.
 *
 * ----------------------------------------------------------------------------
 * RESOURCE TEMPLATE:
 * ----------------------------------------------------------------------------
 * {
 *   id: 'res-unique-slug',
 *   titleKh: 'ចំណងជើងជាភាសាខ្មែរ',
 *   titleEn: 'Title in English',
 *   sourceName: 'ក្រសួងសុខាភិបាល / NMCHC / WHO / UNICEF / RHAC',
 *   sourceUrl: 'https://...',
 *   category: 'អាហារូបត្ថម្ភ (Nutrition)' | 'ការពិនិត្យសុខភាព (Checkups)' | 'ការថែទាំកាយនិងចិត្ត (Wellbeing)' | 'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)' | 'ការត្រៀមខ្លួនសម្រាលនិងសំណួរ (Preparation & Questions)',
 *   pregnancyStage: 'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)' | 'ត្រីមាសទី ២ (សប្ដាហ៍ ១៣-២៧)' | 'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)' | 'គ្រប់ដំណាក់កាលនៃការពពោះ',
 *   pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
 *   summaryKh: 'សេចក្តីសង្ខេបជាភាសាខ្មែរ សរសេរដោយភាពទន់ភ្លន់ និងនិយាយត្រង់ទៅកាន់អ្នកអាន...',
 *   summaryEn: 'Short gentle summary in English...',
 *   summaryPurpose: 'ការពន្យល់ខ្លីអំពីរបៀបដែលព័ត៌មាននេះជួយដល់ម្តាយដំបូង...',
 *   weeklyFocus: 'ចំណុចសំខាន់ដែលម្តាយត្រូវផ្តោតយកចិត្តទុកដាក់...',
 *   status: 'Published', // or 'Draft'
 * }
 * ============================================================================
 */

import { PregnancyResource } from '../types';

export const INITIAL_PREGNANCY_RESOURCES: PregnancyResource[] = [
  // 1. Antenatal Care Basics (NMCHC / Ministry of Health)
  {
    id: 'res-nmchc-safe-motherhood-protocols',
    titleKh: 'ការពិនិត្យផ្ទៃពោះតាមកាលកំណត់ និងពិធីសារសុវត្ថិភាពមាតុភាព',
    titleEn: 'Routine Antenatal Care Protocols & Safe Motherhood',
    sourceName: 'ក្រសួងសុខាភិបាលកម្ពុជា / មជ្ឈមណ្ឌលជាតិគាំពារមាតានិងទារក (NMCHC)',
    sourceUrl: 'https://nmchc.moh.gov.kh/wp-content/uploads/2021/07/Safe-Motherhood-Clinical-Management-National-Protocols-for-Health-Centers-2016-EN.pdf',
    category: 'ការពិនិត្យសុខភាព (Checkups)',
    pregnancyStage: 'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)',
    pregnancyWeeks: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    summaryKh: 'ការទៅពិនិត្យផ្ទៃពោះយ៉ាងតិច ៤ ដងនៅមណ្ឌលសុខភាព (ពិសេសលើកទីមួយមុន ១២ សប្ដាហ៍) ជួយឱ្យគ្រូពេទ្យពិនិត្យសុខភាពទារក វាស់សម្ពាធឈាម និងផ្តល់ថ្នាំជាតិដែក-ហ្វូលិកការពារភាពស្លេកស្លាំង។',
    summaryEn: 'Routine antenatal visits (at least 4 visits, especially before week 12) allow midwives to monitor blood pressure, detect risks early, and provide iron and folic acid supplements.',
    summaryPurpose: 'ជួយឱ្យម្តាយដឹងច្បាស់ពីសារៈសំខាន់នៃការពិនិត្យផ្ទៃពោះដំបូង និងកាត់បន្ថយការភ័យខ្លាច។',
    weeklyFocus: 'កក់ការណាត់ជួបគ្រូពេទ្យលើកដំបូង និងរៀបចំសៀវភៅតាមដានសុខភាពមាតា។',
    status: 'Published',
    planSuggestions: [
      { id: 'anc_visit', text_kh: 'អ្នកអាចពិចារណាណាត់ជួបគ្រូពេទ្យ ឬឆ្មបដើម្បីពិនិត្យផ្ទៃពោះ', text_en: 'You may want to consider scheduling an antenatal checkup with a midwife or doctor' },
      { id: 'yellow_book', text_kh: 'អ្នកអាចពិចារណាដាក់សៀវភៅតាមដានសុខភាពពណ៌លឿងក្នុងកាបូប', text_en: 'You may want to consider keeping your yellow maternal health book in your bag' },
    ],
    title: 'ការពិនិត្យផ្ទៃពោះតាមកាលកំណត់ និងពិធីសារសុវត្ថិភាពមាតុភាព',
    summary: 'ការទៅពិនិត្យផ្ទៃពោះយ៉ាងតិច ៤ ដងនៅមណ្ឌលសុខភាព (ពិសេសលើកទីមួយមុន ១២ សប្ដាហ៍) ជួយឱ្យគ្រូពេទ្យពិនិត្យសុខភាពទារក វាស់សម្ពាធឈាម និងផ្តល់ថ្នាំជាតិដែក-ហ្វូលិកការពារភាពស្លេកស្លាំង។',
  },

  // 2. Nutrition during Pregnancy (NMCHC National Nutrition Programme)
  {
    id: 'res-nmchc-nutrition-programme',
    titleKh: 'អាហារូបត្ថម្ភ និងការហូបចុកត្រឹមត្រូវអំឡុងពេលពពោះ',
    titleEn: 'Maternal Nutrition & Balanced Eating During Pregnancy',
    sourceName: 'កម្មវិធីអាហារូបត្ថម្ភជាតិ / NMCHC កម្ពុជា',
    sourceUrl: 'https://nmchc.moh.gov.kh/en/training/national-nutrition-programme/',
    category: 'អាហារូបត្ថម្ភ (Nutrition)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'អំឡុងពេលពពោះ ម្តាយត្រូវញ៉ាំអាហារចម្រុះមុខ អាហារក្តៅៗ បន្លែបៃតង ផ្លែឈើស្រស់ ត្រី សាច់ ស៊ុត និងពិសាទឹកស្អាតឱ្យបានច្រើន ដើម្បីផ្តល់ជីវជាតិគ្រប់គ្រាន់ដល់ការលូតលាស់របស់ទារក។',
    summaryEn: 'A diverse, nutrient-rich diet with leafy vegetables, fish, eggs, and plenty of safe water supports healthy fetal brain and organ development without unneeded dietary restrictions.',
    summaryPurpose: 'ជួយឱ្យម្តាយជ្រើសរើសអាហារធម្មជាតិងាយរកក្នុងស្រុក ដោយមិនបាច់តមអាហារតាមជំនឿខុសឆ្គង។',
    weeklyFocus: 'បញ្ចូលបន្លែបៃតង ស៊ុត និងត្រីក្នុងអាហារប្រចាំថ្ងៃ និងញ៉ាំទឹកឱ្យបានគ្រប់គ្រាន់។',
    status: 'Published',
    planSuggestions: [
      { id: 'nutri_veg', text_kh: 'អ្នកអាចពិចារណាបន្ថែមបន្លែបៃតង និងផ្លែឈើស្រស់ក្នុងរបបអាហារ', text_en: 'You may want to consider adding green vegetables and fresh fruit to your meals' },
      { id: 'nutri_water', text_kh: 'អ្នកអាចពិចារណាទទួលទានទឹកស្អាតឱ្យបានគ្រប់គ្រាន់ពេញមួយថ្ងៃ', text_en: 'You may want to consider staying well hydrated with clean water throughout the day' },
      { id: 'nutri_iron', text_kh: 'អ្នកអាចពិចារណាលេបថ្នាំគ្រាប់ជាតិដែកក្រោយអាហារពេលល្ងាច', text_en: 'You may want to consider taking your iron supplement after dinner' },
    ],
    title: 'អាហារូបត្ថម្ភ និងការហូបចុកត្រឹមត្រូវអំឡុងពេលពពោះ',
    summary: 'អំឡុងពេលពពោះ ម្តាយត្រូវញ៉ាំអាហារចម្រុះមុខ អាហារក្តៅៗ បន្លែបៃតង ផ្លែឈើស្រស់ ត្រី សាច់ ស៊ុត និងពិសាទឹកស្អាតឱ្យបានច្រើន ដើម្បីផ្តល់ជីវជាតិគ្រប់គ្រាន់ដល់ការលូតលាស់របស់ទារក។',
  },

  // 3. Maternal and Child Health Handbook (NMCHC)
  {
    id: 'res-nmchc-mch-handbook',
    titleKh: 'សៀវភៅតាមដានសុខភាពមាតានិងទារក (សៀវភៅលឿង)',
    titleEn: 'Maternal and Child Health Educational Handbook (Yellow Book)',
    sourceName: 'ក្រសួងសុខាភិបាល / NMCHC',
    sourceUrl: 'https://nmchc.moh.gov.kh/wp-content/uploads/2021/10/materials_03.pdf',
    category: 'ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'សៀវភៅតាមដានសុខភាពមាតានិងទារកពណ៌លឿង គឺជាកាតាបសុខភាពដ៏សំខាន់សម្រាប់កត់ត្រាទម្ងន់ ការចាក់វ៉ាក់សាំងតេតាណុស កាលបរិច្ឆេទពិនិត្យ និងការណែនាំពីរបៀបថែទាំខ្លួន។',
    summaryEn: 'The yellow Maternal and Child Health Handbook is a lifelong passport containing checkup schedules, tetanus vaccination records, weight tracking, and key self-care guidance.',
    summaryPurpose: 'ជួយឱ្យម្តាយចងចាំយកសៀវភៅពណ៌លឿងនេះទៅតាមខ្លួនរាល់ពេលទៅមណ្ឌលសុខភាព។',
    weeklyFocus: 'រក្សាទុកសៀវភៅតាមដានឱ្យបានត្រឹមត្រូវ និងអានការណែនាំប្រចាំត្រីមាស។',
    status: 'Published',
    title: 'សៀវភៅតាមដានសុខភាពមាតានិងទារក (សៀវភៅលឿង)',
    summary: 'សៀវភៅតាមដានសុខភាពមាតានិងទារកពណ៌លឿង គឺជាកាតាបសុខភាពដ៏សំខាន់សម្រាប់កត់ត្រាទម្ងន់ ការចាក់វ៉ាក់សាំងតេតាណុស កាលបរិច្ឆេទពិនិត្យ និងការណែនាំពីរបៀបថែទាំខ្លួន។',
  },

  // 4. Pregnancy Warning & Danger Signs (NMCHC Protocols)
  {
    id: 'res-nmchc-warning-signs',
    titleKh: 'សញ្ញាគ្រោះថ្នាក់អំឡុងពេលមានផ្ទៃពោះដែលត្រូវទៅពេទ្យជាបន្ទាន់',
    titleEn: 'Key Pregnancy Warning & Danger Signs Requiring Immediate Care',
    sourceName: 'ក្រសួងសុខាភិបាល / NMCHC Protocols for Referral Hospitals',
    sourceUrl: 'https://nmchc.moh.gov.kh/wp-content/uploads/2021/10/materials_14.pdf',
    category: 'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'ប្រសិនបើអ្នកមានអាការៈដូចជា៖ ធ្លាក់ឈាមតាមទ្វារមាស ឈឺក្បាលខ្លាំងស្រវាំងភ្នែក ហើមមុខហើមដៃ គ្រុនក្តៅខ្លាំង ឬទារកមិនសូវកម្រើក ត្រូវប្រញាប់ទៅមន្ទីរពេទ្យជាបន្ទាន់។',
    summaryEn: 'Recognizing critical danger signs—such as vaginal bleeding, severe headache with blurred vision, sudden facial swelling, fever, or decreased fetal movement—ensures timely lifesaving care.',
    summaryPurpose: 'ជួយឱ្យម្តាយនិងក្រុមគ្រួសារដឹងពីសញ្ញាអាសន្ន និងមិនបង្អង់យឺតយ៉ាវនៅផ្ទះ។',
    weeklyFocus: 'ចងចាំលេខទូរស័ព្ទគ្រូពេទ្យ ឬមណ្ឌលសុខភាពដែលនៅជិតបំផុត។',
    status: 'Published',
    is_safety_critical: true,
    title: 'សញ្ញាគ្រោះថ្នាក់អំឡុងពេលមានផ្ទៃពោះដែលត្រូវទៅពេទ្យជាបន្ទាន់',
    summary: 'ប្រសិនបើអ្នកមានអាការៈដូចជា៖ ធ្លាក់ឈាមតាមទ្វារមាស ឈឺក្បាលខ្លាំងស្រវាំងភ្នែក ហើមមុខហើមដៃ គ្រុនក្តៅខ្លាំង ឬទារកមិនសូវកម្រើក ត្រូវប្រញាប់ទៅមន្ទីរពេទ្យជាបន្ទាន់។',
  },

  // 5. WHO Positive Pregnancy Experience
  {
    id: 'res-who-anc-positive-experience',
    titleKh: 'ការណែនាំរបស់អង្គការសុខភាពពិភពលោក (WHO) សម្រាប់ការថែទាំផ្ទៃពោះប្រកបដោយភាពកក់ក្តៅ',
    titleEn: 'WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience',
    sourceName: 'អង្គការសុខភាពពិភពលោក (WHO)',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241549912',
    category: 'ការពិនិត្យសុខភាព (Checkups)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'WHO លើកកម្ពស់ការថែទាំសុខភាពមាតាដែលផ្តល់តម្លៃលើភាពថ្លៃថ្នូរ ការគាំទ្រផ្លូវចិត្ត និងការទំនាក់ទំនងដោយក្តីមេត្តារវាងបុគ្គលិកសុខាភិបាលនិងស្ត្រីមានផ្ទៃពោះ។',
    summaryEn: 'WHO highlights that every pregnant woman deserves evidence-based clinical care combined with dignity, emotional support, and clear compassionate communication from caregivers.',
    summaryPurpose: 'ជួយឱ្យម្តាយមានអារម្មណ៍ថាខ្លួនមានសិទ្ធិទទួលបានការថែទាំដ៏កក់ក្តៅនិងគួរឱ្យទុកចិត្ត។',
    weeklyFocus: 'រៀបចំសំណួរទុកជាមុនដើម្បីសួរគ្រូពេទ្យដោយមិនបាច់មានការភ័យខ្លាច។',
    status: 'Published',
    title: 'ការណែនាំរបស់អង្គការសុខភាពពិភពលោក (WHO) សម្រាប់ការថែទាំផ្ទៃពោះប្រកបដោយភាពកក់ក្តៅ',
    summary: 'WHO លើកកម្ពស់ការថែទាំសុខភាពមាតាដែលផ្តល់តម្លៃលើភាពថ្លៃថ្នូរ ការគាំទ្រផ្លូវចិត្ត និងការទំនាក់ទំនងដោយក្តីមេត្តារវាងបុគ្គលិកសុខាភិបាលនិងស្ត្រីមានផ្ទៃពោះ។',
  },

  // 6. UNICEF Cambodia Maternal Nutrition
  {
    id: 'res-unicef-cambodia-maternal-nutrition',
    titleKh: 'ការថែទាំអាហារូបត្ថម្ភមាតា និងការការពារភាពស្លេកស្លាំងនៅកម្ពុជា',
    titleEn: 'UNICEF Cambodia: Maternal Nutrition & Anemia Prevention',
    sourceName: 'យូនីសេហ្វ កម្ពុជា (UNICEF Cambodia)',
    sourceUrl: 'https://www.unicef.org/cambodia/nutrition',
    category: 'អាហារូបត្ថម្ភ (Nutrition)',
    pregnancyStage: 'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    summaryKh: 'ការលេបថ្នាំជាតិដែក និងអាស៊ីតហ្វូលិកឱ្យបានទៀងទាត់ជារៀងរាល់ថ្ងៃ ជួយទប់ស្កាត់ភាពស្លេកស្លាំងរបស់ម្តាយ និងជួយដល់ការបង្កើតខួរក្បាលនិងប្រព័ន្ធប្រសាទរបស់ទារក។',
    summaryEn: 'Daily iron-folic acid supplementation and diverse nutrient consumption protect Cambodian mothers from maternal anemia and support healthy fetal neural tube formation.',
    summaryPurpose: 'លើកទឹកចិត្តម្តាយកុំឱ្យភ្លេចលេបថ្នាំគ្រាប់ជាតិដែកជារៀងរាល់ថ្ងៃ។',
    weeklyFocus: 'លេបថ្នាំគ្រាប់ជាតិដែក-ហ្វូលិកមួយគ្រាប់ក្នុងមួយថ្ងៃជាមួយទឹកក្តៅឧណ្ហៗ។',
    status: 'Published',
    title: 'ការថែទាំអាហារូបត្ថម្ភមាតា និងការការពារភាពស្លេកស្លាំងនៅកម្ពុជា',
    summary: 'ការលេបថ្នាំជាតិដែក និងអាស៊ីតហ្វូលិកឱ្យបានទៀងទាត់ជារៀងរាល់ថ្ងៃ ជួយទប់ស្កាត់ភាពស្លេកស្លាំងរបស់ម្តាយ និងជួយដល់ការបង្កើតខួរក្បាលនិងប្រព័ន្ធប្រសាទរបស់ទារក។',
  },

  // 7. RHAC Antenatal Care Services
  {
    id: 'res-rhac-antenatal-care',
    titleKh: 'សេវាពិនិត្យផ្ទៃពោះ និងការប្រឹក្សាសុខភាពបន្តពូជ',
    titleEn: 'RHAC Cambodia: Comprehensive Antenatal Care & Counselling',
    sourceName: 'សមាគមថែទាំសុខភាពគ្រួសារកម្ពុជា (RHAC)',
    sourceUrl: 'https://www.rhac.org.kh/en/service/antenatal-care/',
    category: 'ការពិនិត្យសុខភាព (Checkups)',
    pregnancyStage: 'ត្រីមាសទី ១ (សប្ដាហ៍ ១-១២)',
    pregnancyWeeks: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    summaryKh: 'ការពិនិត្យអេកូសាស្ត្រដំបូង និងការធ្វើតេស្តឈាមទូទៅ ជួយបញ្ជាក់ពីអាយុកាលពិតប្រាកដនៃគភ៌ ចំនួនទារកក្នុងផ្ទៃ និងសុខភាពទូទៅរបស់ម្តាយ។',
    summaryEn: 'Early ultrasound dating and blood screenings confirm gestational age, singleton or multiple pregnancy, and general maternal vitality in a supportive setting.',
    summaryPurpose: 'ជួយឱ្យម្តាយយល់ពីគោលបំណងនៃការពិនិត្យអេកូ និងការពិនិត្យឈាមដំបូង។',
    weeklyFocus: 'រៀបចំទៅពិនិត្យអេកូសាស្ត្រតាមកាលកំណត់ដើម្បីដឹងពីការវិវត្តរបស់ទារក។',
    status: 'Published',
    title: 'សេវាពិនិត្យផ្ទៃពោះ និងការប្រឹក្សាសុខភាពបន្តពូជ',
    summary: 'ការពិនិត្យអេកូសាស្ត្រដំបូង និងការធ្វើតេស្តឈាមទូទៅ ជួយបញ្ជាក់ពីអាយុកាលពិតប្រាកដនៃគភ៌ ចំនួនទារកក្នុងផ្ទៃ និងសុខភាពទូទៅរបស់ម្តាយ។',
  },

  // 8. Preparing for Delivery & Birth Plan (NMCHC Protocols)
  {
    id: 'res-nmchc-delivery-preparation',
    titleKh: 'ការត្រៀមខ្លួនសម្រាលកូន និងផែនការសម្រាលសុវត្ថិភាព',
    titleEn: 'Preparing for Delivery & Creating a Safe Birth Plan',
    sourceName: 'ក្រសួងសុខាភិបាល / NMCHC Protocols for Health Centers',
    sourceUrl: 'https://nmchc.moh.gov.kh/wp-content/uploads/2021/07/Safe-Motherhood-Clinical-Management-National-Protocols-for-Health-Centers-2016-EN.pdf',
    category: 'ការត្រៀមខ្លួនសម្រាលនិងសំណួរ (Preparation & Questions)',
    pregnancyStage: 'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)',
    pregnancyWeeks: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'ការរៀបចំផែនការសម្រាលរួមមាន៖ ការជ្រើសរើសមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យ ការត្រៀមមធ្យោបាយធ្វើដំណើរ ការសន្សំប្រាក់សម្រាប់បន្ទាន់ និងការរៀបចំកាតាបសម្រាលទុកជាមុន។',
    summaryEn: 'Creating a birth preparedness plan involves selecting a certified health facility, securing reliable transport, preparing emergency funds, and packing newborn essentials.',
    summaryPurpose: 'ជួយឱ្យម្តាយនិងស្វាមីមានភាពស្ងប់ចិត្ត មិនស្លន់ស្លោនៅពេលដល់ថ្ងៃសម្រាល។',
    weeklyFocus: 'រៀបចំកាតាបសម្រាល និងពិភាក្សាជាមួយគ្រួសារអំពីមធ្យោបាយធ្វើដំណើរទៅពេទ្យ។',
    status: 'Published',
    title: 'ការត្រៀមខ្លួនសម្រាលកូន និងផែនការសម្រាលសុវត្ថិភាព',
    summary: 'ការរៀបចំផែនការសម្រាលរួមមាន៖ ការជ្រើសរើសមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យ ការត្រៀមមធ្យោបាយធ្វើដំណើរ ការសន្សំប្រាក់សម្រាប់បន្ទាន់ និងការរៀបចំកាតាបសម្រាលទុកជាមុន។',
  },

  // 9. WHO Healthy Eating and Physical Activity
  {
    id: 'res-who-healthy-eating',
    titleKh: 'ការបរិភោគអាហារផ្តល់សុខភាព និងការធ្វើចលនាស្រាលៗ',
    titleEn: 'WHO: Healthy Eating & Gentle Physical Activity in Pregnancy',
    sourceName: 'អង្គការសុខភាពពិភពលោក (WHO)',
    sourceUrl: 'https://www.who.int/tools/your-life-your-health/life-phase/pregnancy--birth-and-after-childbirth',
    category: 'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'ការដើរហាត់ប្រាណតិចៗ ការដកដង្ហើមវែងៗ និងការទទួលទានអាហារស្រស់ៗជួយកាត់បន្ថយការទល់លាមក បន្ធូរបន្ថយអារម្មណ៍តានតឹង និងជួយឱ្យគេងលក់ស្រួល។',
    summaryEn: 'Gentle physical movement like daily walking, hydration, and fiber-rich meals relieve common discomforts such as constipation and promote peaceful emotional wellbeing.',
    summaryPurpose: 'ជួយឱ្យម្តាយដឹងពីចលនាសុវត្ថិភាពដែលអាចធ្វើបានដោយមិនប៉ះពាល់ដល់ទារក។',
    weeklyFocus: 'ដើរលំហែកាយពេលព្រឹកព្រលឹម ឬពេលល្ងាចប្រហែល ១៥ ទៅ ២០ នាទី។',
    status: 'Published',
    title: 'ការបរិភោគអាហារផ្តល់សុខភាព និងការធ្វើចលនាស្រាលៗ',
    summary: 'ការដើរហាត់ប្រាណតិចៗ ការដកដង្ហើមវែងៗ និងការទទួលទានអាហារស្រស់ៗជួយកាត់បន្ថយការទល់លាមក បន្ធូរបន្ថយអារម្មណ៍តានតឹង និងជួយឱ្យគេងលក់ស្រួល។',
  },

  // 10. Questions to Ask Healthcare Provider (NMCHC & WHO)
  {
    id: 'res-questions-for-doctor',
    titleKh: 'សំណួរសំខាន់ៗដែលគួរត្រៀមសួរគ្រូពេទ្យអំឡុងពេលពិនិត្យផ្ទៃពោះ',
    titleEn: 'Thoughtful Questions to Ask Your Midwife or Doctor',
    sourceName: 'ក្រសួងសុខាភិបាល / NMCHC & WHO Guidance',
    sourceUrl: 'https://nmchc.moh.gov.kh/wp-content/uploads/2021/07/Safe-Motherhood-Clinical-Management-National-Protocols-for-Health-Centers-2016-EN.pdf',
    category: 'ការត្រៀមខ្លួនសម្រាលនិងសំណួរ (Preparation & Questions)',
    pregnancyStage: 'គ្រប់ដំណាក់កាលនៃការពពោះ',
    pregnancyWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'កុំខ្លាចក្នុងការសួរគ្រូពេទ្យ! កត់ចំណាំចម្ងល់ដូចជា៖ អាហារដែលគួរញ៉ាំ ការឡើងទម្ងន់ត្រឹមត្រូវ សញ្ញាឈឺពោះ និងការប្រើប្រាស់ថ្នាំណាមួយ ដើម្បីសុវត្ថិភាពទារកក្នុងផ្ទៃ។',
    summaryEn: 'Writing down questions ahead of visits builds confidence, ensuring questions about medication safety, healthy weight gain, and physical changes are addressed clearly.',
    summaryPurpose: 'ជួយឱ្យម្តាយដំបូងមានភាពក្លាហានក្នុងការពិភាក្សាជាមួយគ្រូពេទ្យ ឬឆ្មប។',
    weeklyFocus: 'កត់ចំណាំសំណួរយ៉ាងតិច ២ ឬ ៣ ក្នុងទូរស័ព្ទមុនពេលទៅជួបគ្រូពេទ្យ។',
    status: 'Published',
    title: 'សំណួរសំខាន់ៗដែលគួរត្រៀមសួរគ្រូពេទ្យអំឡុងពេលពិនិត្យផ្ទៃពោះ',
    summary: 'កុំខ្លាចក្នុងការសួរគ្រូពេទ្យ! កត់ចំណាំចម្ងល់ដូចជា៖ អាហារដែលគួរញ៉ាំ ការឡើងទម្ងន់ត្រឹមត្រូវ សញ្ញាឈឺពោះ និងការប្រើប្រាស់ថ្នាំណាមួយ ដើម្បីសុវត្ថិភាពទារកក្នុងផ្ទៃ។',
  },

  // 11. Breastfeeding Preparation Audio Message (PSI / គ្រួសារប្រពៃ កូនវៃឆ្លាត)
  {
    id: 'res-psi-breastfeeding-prep',
    titleKh: 'ការត្រៀមខ្លួនសម្រាប់ការបំបៅដោះកូន',
    titleEn: 'Preparing for Breastfeeding',
    sourceName: 'កម្មវិធីគ្រួសារប្រពៃ កូនវៃឆ្លាត / អង្គការ PSI',
    sourceUrl: 'https://psi.org.kh',
    category: 'ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)',
    pregnancyStage: 'ត្រីមាសទី ៣ (សប្ដាហ៍ ២៨-៤០)',
    pregnancyWeeks: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    summaryKh: 'ការសន្ទនាប្រកបដោយភាពកក់ក្តៅរវាងឆ្មប និងស្ត្រីមានផ្ទៃពោះ អំពីការប្រែប្រួលសុដន់ ការផលិតទឹកដោះដំបូង (Colostrum) និងការបំបៅដោះកូនភ្លាមៗក្នុងម៉ោងដំបូងក្រោយសម្រាល។',
    summaryEn: 'A supportive conversation between a midwife and an expectant mother discussing breast changes during pregnancy, colostrum production, and early breastfeeding within the first hour after delivery.',
    summaryPurpose: 'ជួយឱ្យម្តាយយល់ដឹងពីការប្រែប្រួលរាងកាយធម្មជាតិ ទឹកដោះដំបូង និងត្រៀមចិត្តបំបៅដោះកូនដោយក្តីស្ងប់ចិត្ត។',
    weeklyFocus: 'ស្តាប់ការណែនាំពីឆ្មបអំពីការបំបៅដោះកូន និងទឹកដោះដំបូង។',
    status: 'Published',
    audioUrl: 'Psi_audio/1.mp3',
    audioDuration: '2:15',
    audioTranscriptKh: `ឆ្មប៖ ជម្រាបសួរ! ខ្ញុំជាឆ្មបណារី ទូរស័ព្ទមកពីកម្មវិធីគ្រួសារប្រពៃ កូនវៃឆ្លាត។

ម្តាយ៖ ជម្រាបសួរអ្នកគ្រូណារី!

ឆ្មប៖ ថ្ងៃសម្រាលរបស់ប្អូនកាន់តែជិតមកដល់ហើយ។ ខ្ញុំជឿថាប្អូនបានត្រៀមខ្លះហើយសម្រាប់ថ្ងៃសម្រាល។

ម្តាយ៖ ចាស ខ្ញុំនិងប្តី ព្រមទាំងសាច់ញាតិត្រៀមរួចរាល់ហើយ។

ឆ្មប៖ ល្អណាស់។ នៅពេលដែលគ្រួសារប្អូនត្រៀមស្វាគមន៍ទារក រាងកាយរបស់ប្អូនក៏ត្រៀមក្លាយជាម្តាយដែរ។ ប្អូនអាចសង្កេតឃើញសុដន់ប្អូនរីកធំ និងលេចសរសៃខៀវ ជាសញ្ញាដែលសុដន់ត្រៀមជាស្រេចដើម្បីបំបៅដោះកូន។

ម្តាយ៖ អ៊ីចឹងបានចុងដោះខ្ញុំប្រែពណ៌ក្រម៉ៅ និងរីកធំជាងមុន ត្រូវអត់អ្នកគ្រូ?

ឆ្មប៖ ត្រឹមត្រូវហើយ។ អំឡុងពេលនេះ ក្បាលដោះចាប់ផ្តើមផលិតទឹកដោះដំបូងរបស់ប្អូន។ វាជារឿងធម្មតាទេ កុំបារម្ភអីណា!

ម្តាយ៖ អរគុណ បានស្តាប់អ្នកគ្រូ ខ្ញុំលែងបារម្ភហើយ!

ឆ្មប៖ សារធាតុនៅក្នុងទឹកដោះដំបូងពិសេសខ្លាំងណាស់។ ដូច្នេះប្អូនត្រូវប្រាកដថាបំបៅដោះកូនក្នុងម៉ោងដំបូងបន្ទាប់ពីសម្រាលរួច។ មិនត្រូវឱ្យកូនបៅអ្វីក្រៅពីទឹកដោះដំបូងរបស់ប្អូនឡើយ។ ត្រូវផ្តល់តែទឹកដោះតែមួយមុខគត់។ ទឹកដោះដំបូងអាចជួយការពារទារកពីជំងឺជាច្រើន។

ម្តាយ៖ ចាស ខ្ញុំចាំហើយ អ្នកគ្រូ។

ឆ្មប៖ សូមឱ្យការត្រៀមសម្រាលកូនរបស់ប្អូនដំណើរការល្អណា!`,
    planSuggestions: [
      { id: 'bf_first_hour', text_kh: 'អ្នកអាចពិចារណាត្រៀមបំបៅដោះកូនក្នុងម៉ោងដំបូងក្រោយសម្រាល', text_en: 'You may want to consider planning to breastfeed within the first hour after birth' },
      { id: 'bf_colostrum', text_kh: 'អ្នកអាចពិចារណាផ្តល់តែទឹកដោះដំបូងដល់ទារក ដោយមិនផ្តល់អ្វីផ្សេងឡើយ', text_en: 'You may want to consider feeding colostrum exclusively to your newborn' },
    ],
    title: 'ការត្រៀមខ្លួនសម្រាប់ការបំបៅដោះកូន',
    summary: 'ការសន្ទនាប្រកបដោយភាពកក់ក្តៅរវាងឆ្មប និងស្ត្រីមានផ្ទៃពោះ អំពីការប្រែប្រួលសុដន់ ការផលិតទឹកដោះដំបូង (Colostrum) និងការបំបៅដោះកូនភ្លាមៗក្នុងម៉ោងដំបូងក្រោយសម្រាល។',
  },
];