/**
 * ម៉ែ — by FlowErs
 * Monthly Voice Messages
 *
 * Warm, gentle monthly voice messages from a friendly companion to a woman
 * who is becoming a mother for the first time.
 *
 * Voice: "ម៉ែ" (Mom) is the app's NAME only. The app is a companion, not the
 * user's mother. Speak to her as "you" (អ្នក), refer to the baby as "ទារក"
 * (The constant name MONTHLY_MOM_MESSAGES is kept so existing imports keep working.)
 */

import { MonthlyMessage, FocusTopic, StageGuidance } from '../types';

export const MONTHLY_MOM_MESSAGES: MonthlyMessage[] = [
  {
    id: 'month-1',
    month: 1,
    stageWeeks: 'សប្ដាហ៍ ១ - ៤ (ខែទី ១)',
    titleKh: 'សារសំឡេងខែទី ១ 🌸',
    titleEn: 'Voice Message, Month 1',
    audioDuration: '1:45',
    audioUrl: '/audio/month-1.mp3',
    flowerStage: {
      phaseNameKh: 'គ្រាប់ពូជដ៏ទន់ភ្លន់',
      phaseNameEn: 'Tender Seedling',
      descriptionKh: 'ជីវិតតូចមួយទើបចាប់ផ្ដើម ដូចគ្រាប់ពូជដ៏ស្ងប់ស្ងាត់ក្នុងដីមានជីជាតិ។',
      descriptionEn: 'A tiny new life begins quietly, like a seed nestled in rich soil.',
      percent: 10,
      bloomIcon: 'seed',
    },
    audioScriptKh: `សួស្តី... ដកដង្ហើមវែងៗមួយសិនណា។ ពេលដឹងថាមានផ្ទៃពោះ អ្នកប្រហែលជាមានអារម្មណ៍ចម្រុះ ទាំងរីករាយ ទាំងបារម្ភ ហើយមិនដឹងត្រូវចាប់ផ្តើមពីណាមុនទេ។ នោះជារឿងធម្មតាទាំងស្រុង ហើយអ្នកមិនឯកាទេ «ម៉ែ» នៅក្បែរអ្នកក្នុងដំណើរនេះ។ ក្នុងដំណាក់កាលដំបូងនេះ ខ្លួនប្រាណរបស់អ្នកកំពុងប្រែប្រួលបន្តិចម្តងៗ។ អ្វីដែលសំខាន់បំផុតពេលនេះ គឺសម្រាកឱ្យបានច្រើន ផឹកទឹកឱ្យគ្រប់គ្រាន់ និងជៀសវាងការលើករបស់ធ្ងន់ៗ។ ធ្វើចិត្តឱ្យស្ងប់ ហើយញញឹមឱ្យបានច្រើន។ អ្នកកំពុងធ្វើបានល្អហើយ។`,
    audioScriptEn: `Hi... take a slow breath first. Finding out you are expecting can bring a mix of joy and worry, and you may not know where to begin. That is completely normal, and you are not alone: ម៉ែ is right here beside you. In these first weeks, your body is gently beginning to change. The most important things now are to rest well, drink plenty of water, and avoid heavy lifting. Keep a peaceful heart and smile often. You are doing well.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ១]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nដកដង្ហើមវែងៗមួយសិនណា។ ពេលដឹងថាមានផ្ទៃពោះលើកដំបូង ចិត្តរបស់កូនច្បាស់ជាមានអារម្មណ៍ចម្រុះ—ទាំងរំភើប រីករាយ តែក្នុងពេលតែមួយក៏មានការបារម្ភ និងភ័យអរ។ នោះជារឿងធម្មតាទេកូន ម៉ែនៅទីនេះចាំកំដរកូនជានិច្ច។\n\nពេលនេះ ខ្លួនប្រាណរបស់កូនកំពុងចាប់ផ្តើមផ្លាស់ប្តូរដើម្បីទទួលយកជីវិតថ្មី។ សូមកូនកុំទាន់ភ័យស្លន់ស្លោរឿងរៀបចំអ្វីៗច្រើនពេក។ អ្វីដែលសំខាន់បំផុតពេលនេះ គឺសម្រាកឱ្យបានច្រើន ផឹកទឹកស្អាតឱ្យបានគ្រប់គ្រាន់ និងជៀសវាងលើករបស់ធ្ងន់ៗ។ ញ៉ាំអាហារក្តៅៗដែលងាយរំលាយ និងធ្វើចិត្តឱ្យស្រស់ស្រាយណា៎កូន។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 1]\n\nMy dear daughter...\n\nTake a slow, gentle breath first. Finding out that you are expecting brings such a mix of feelings—joy, wonder, and naturally some worry. That is completely normal, and you are never alone on this path; I am right here beside you.\n\nYour body is already gently making space for a tiny new life. Do not rush to figure out everything today. The kindest thing you can do right now is rest well, drink plenty of clean water, and avoid heavy lifting. Eat warm, nourishing foods and keep a peaceful heart.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'អ្នកកុំទាន់ភ័យស្លន់ស្លោរឿងរៀបចំអ្វីច្រើនពេក។ សម្រាកឱ្យបានគ្រប់គ្រាន់ និងពិសាអាហារក្តៅៗដែលងាយរំលាយ។',
    reminderEn: 'Do not rush to figure everything out. Rest well, stay hydrated, and take gentle care of your body.',
  },
  {
    id: 'month-2',
    month: 2,
    stageWeeks: 'សប្ដាហ៍ ៥ - ៨ (ខែទី ២)',
    titleKh: 'សារសំឡេងខែទី ២ 🌸',
    titleEn: 'Voice Message, Month 2',
    audioDuration: '2:05',
    audioUrl: '/audio/month-2.mp3',
    flowerStage: {
      phaseNameKh: 'ពន្លកបៃតងតូច',
      phaseNameEn: 'Gentle Sprout',
      descriptionKh: 'ពន្លកបៃតងខ្ចីចាប់ផ្ដើមលូតលាស់ឡើង ទទួលពន្លឺព្រះអាទិត្យ។',
      descriptionEn: 'A soft green shoot begins reaching upward, finding strength.',
      percent: 20,
      bloomIcon: 'sprout',
    },
    audioScriptKh: `សួស្តី... ខែទីពីរនេះ អ្នកប្រហែលជាចាប់ផ្តើមចាញ់កូនហើយ ធុំក្លិនអ្វីក៏ពិបាក ពេលព្រឹកឡើងចង់ក្អួត ហើយអស់កម្លាំង។ សូមកុំគិតថាខ្លួនទន់ខ្សោយ នេះជារឿងធម្មតារបស់ស្ត្រីមានផ្ទៃពោះ ដែលរាងកាយកំពុងខិតខំថែទាំជីវិតថ្មី។ បើញ៉ាំបាយមិនសូវចូល កុំបង្ខំខ្លួនឱ្យញ៉ាំច្រើនក្នុងពេលតែមួយ។ ញ៉ាំតិចៗតែញឹកញាប់ ដូចជាផ្លែឈើស្រស់ ឬសម្លក្តៅៗដែលស្រួលលេប។ បើហត់ សូមសម្រាកបន្តិច ដោយមិនបាច់មានអារម្មណ៍ខុស។ «ម៉ែ» នៅទីនេះជាមួយអ្នក។`,
    audioScriptEn: `Hi... in this second month, morning sickness and food aversions may be starting. You might feel exhausted and sensitive to smells. Please do not think of it as weakness. This is your body working hard to nurture a new life. If you cannot eat a full meal, try small, nourishing bites through the day, like fresh fruit or warm broth. When you are tired, lie down and rest without guilt. ម៉ែ is here with you.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ២]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nខែទីពីរនេះ កូនប្រហែលជាចាប់ផ្តើមចាញ់កូនហើយ ធុំក្លិនអ្វីក៏ពិបាក ពេលព្រឹកឡើងចង់ក្អួត ហើយអស់កម្លាំងល្ហិតល្ហៃ។ ម៉ែចង់ប្រាប់កូនថា សូមកុំគិតថាខ្លួនទន់ខ្សោយ នេះជាសញ្ញាដែលរាងកាយកូនកំពុងខិតខំប្រឹងប្រែងដើម្បីការពារនិងចិញ្ចឹមជីវិតតូចមួយក្នុងពោះ។\n\nបើយ៉ាងណាញ៉ាំបាយមិនសូវចូល កុំបង្ខំខ្លួនញ៉ាំច្រើនក្នងពេលតែមួយណា៎។ ចែកជាអាហារតូចៗញឹកញាប់ ដូចជាផ្លែឈើស្រស់ នំស្រួយ ឬសម្លក្តៅៗដែលស្រួលលេប។ ពេលហត់ ឆ្លៀតគេងសម្រាកបន្តិចណា៎កូន។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 2]\n\nMy dear daughter...\n\nIn this second month, morning sickness and nausea may have arrived. You might feel sensitive to scents and exhausted through the day. Please do not think of yourself as weak; this is simply your body working overtime to protect your tiny baby.\n\nIf big meals feel impossible, take small, gentle bites through the day—a slice of fruit, crackers, or warm clear soup. When exhaustion catches up with you, rest without hesitation.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'ពេលចាញ់កូន ញ៉ាំអាហារតិចៗតែច្រើនដងក្នុងមួយថ្ងៃ។ ជៀសវាងអាហារខ្លាញ់ច្រើន ឬក្លិនដែលធ្វើឱ្យអ្នកវិលមុខ។',
    reminderEn: 'Eat small, frequent light meals. Stay away from oily foods or heavy scents that trigger nausea.',
  },
  {
    id: 'month-3',
    month: 3,
    stageWeeks: 'សប្ដាហ៍ ៩ - ១២ (ខែទី ៣)',
    titleKh: 'សារសំឡេងខែទី ៣ 🌸',
    titleEn: 'Voice Message, Month 3',
    audioDuration: '2:15',
    audioUrl: '/audio/month-3.mp3',
    flowerStage: {
      phaseNameKh: 'ត្រួយផ្កាស្មោះស្ម័គ្រ',
      phaseNameEn: 'Tender Sprout',
      descriptionKh: 'ដើមផ្កាកាន់តែរឹងមាំ មែកធាងចាប់ផ្ដើមលាតសន្ធឹង។',
      descriptionEn: 'The stem grows firmer, establishing deep root nourishment.',
      percent: 30,
      bloomIcon: 'sprout',
    },
    audioScriptKh: `សួស្តី... អ្នកជិតបញ្ចប់ត្រីមាសទីមួយហើយ។ ពេលនេះបេះដូងតូចរបស់ទារកកំពុងលោតយ៉ាងមានកម្លាំងក្នុងផ្ទៃរបស់អ្នក។ តើអ្នកបានទៅពិនិត្យផ្ទៃពោះលើកដំបូងហើយឬនៅ? សូមទៅតាមការណាត់ជួប ដើម្បីឱ្យគ្រូពេទ្យ ឬឆ្មបអាចថែទាំអ្នកទាំងពីរនាក់។ បើមានចម្ងល់ សូមកត់ទុកជាមុន ដើម្បីកុំភ្លេចសួរ។ ហើយកុំភ្លេចលេបថ្នាំគ្រាប់ជាតិដែក និងអាស៊ីតហ្វូលិកតាមការណែនាំរបស់គ្រូពេទ្យ។ អ្នកកំពុងធ្វើបានល្អណាស់។`,
    audioScriptEn: `Hi... you are approaching the end of your first trimester. Your baby's tiny heart is beating strongly inside you. Have you had your first antenatal checkup yet? Please keep your appointments so your midwife or doctor can care for both of you. Write down any questions beforehand so you remember to ask them, and remember to take your iron and folic acid as advised. You are doing really well.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៣]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nកូនជិតបញ្ចប់ត្រីមាសទីមួយហើយណា៎! ពេលនេះបេះដូងតូចរបស់ទារកកំពុងលោតយ៉ាងរឹងមាំក្នុងពោះកូន។ តើកូនបានទៅពិនិត្យផ្ទៃពោះលើកដំបូងនៅមណ្ឌលសុខភាព ឬគ្លីនិករួចហើយឬនៅ? សូមទៅតាមការណាត់ជួប ដើម្បីឱ្យឆ្មប ឬគ្រូពេទ្យពិនិត្យសុខភាពទាំងម្តាយទាំងកូនឱ្យបានដិតដល់។\n\nបើមានចម្ងល់អី កត់ក្នុងក្រដាសទុកមុនទៅកូន ក្រែងភ្លេចសួរពេលជួបគ្រូពេទ្យ។ ហើយកុំភ្លេចលេបថ្នាំគ្រាប់ជាតិដែក និងអាស៊ីតហ្វូលិកឱ្យបានទៀងទាត់ណា៎។ កូនកំពុងធ្វើបានល្អណាស់។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 3]\n\nMy dear daughter...\n\nYou are almost through your first trimester! Right now, your baby's tiny heart is beating strongly inside you. Have you visited the health center or clinic for your first antenatal visit yet? Please keep every appointment so the midwife or doctor can look after both of you.\n\nJot down any questions on a piece of paper beforehand so you don't forget to ask. And remember to take your daily iron and folic acid tablets as guided. You are doing so well.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'កត់ចំណាំសំណួរដែលអ្នកចង់សួរគ្រូពេទ្យទុកជាមុន។ ការពិនិត្យផ្ទៃពោះទៀងទាត់ជួយឱ្យអ្នកមានទំនុកចិត្តខ្ពស់។',
    reminderEn: 'Write down questions for your doctor or midwife ahead of your antenatal care visit.',
  },
  {
    id: 'month-4',
    month: 4,
    stageWeeks: 'សប្ដាហ៍ ១៣ - ១៦ (ខែទី ៤)',
    titleKh: 'សារសំឡេងខែទី ៤ 🌸',
    titleEn: 'Voice Message, Month 4',
    audioDuration: '1:55',
    audioUrl: '/audio/month-4.mp3',
    flowerStage: {
      phaseNameKh: 'ក្តឹបផ្កាកំពុងកកើត',
      phaseNameEn: 'Budding Blossom',
      descriptionKh: 'ក្តឹបផ្កាតូចៗចាប់ផ្ដើមកកើតឡើងដោយភាពទន់ភ្លន់។',
      descriptionEn: 'Gentle flower buds begin forming, full of promise.',
      percent: 42,
      bloomIcon: 'bud',
    },
    audioScriptKh: `សួស្តី... ចូលដល់ត្រីមាសទីពីរហើយ! ជាធម្មតា អាការៈចាញ់កូនចាប់ផ្ដើមស្រាលជាងមុន ហើយអ្នកនឹងមានកម្លាំងឡើងវិញ។ ពោះរបស់អ្នកក៏ចាប់ផ្ដើមប៉ោងមូលបន្តិចម្តងៗដែរ។ សូមស្លៀកសម្លៀកបំពាក់រលុងៗ កុំឱ្យតឹងពេកដែលធ្វើឱ្យពិបាកដកដង្ហើម។ អ្នកអាចចាប់ផ្តើមនិយាយលេងជាមួយទារកក្នុងផ្ទៃបាន ព្រោះមិនយូរទៀតទេ ទារកនឹងចាប់ផ្តើមស្តាប់សំឡេងរបស់អ្នក។ ពេលនេះជាឱកាសល្អដើម្បីរីករាយជាមួយថ្ងៃដែលស្រួលខ្លួនជាងមុន។`,
    audioScriptEn: `Hi... welcome to the second trimester! Usually the nausea begins to ease and your energy and appetite return. Your belly is starting to round gently. Wear comfortable, loose clothes. You can start talking softly to your baby, because before long they will begin to hear your voice. This is a lovely time to enjoy feeling a little more like yourself again.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៤]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nចូលដល់ត្រីមាសទីពីរហើយ! ជាធម្មតា អាការៈចាញ់កូននិងចង់ក្អួតចាប់ផ្ដើមស្រាលស្រឡះជាងមុន ហើយកូននឹងមានកម្លាំង និងចំណង់អាហារឡើងវិញ។ ពោះរបស់កូនក៏ចាប់ផ្ដើមប៉ោងមូលគួរឱ្យស្រឡាញ់ដែរ។\n\nស្លៀកសម្លៀកបំពាក់ណាដែលរលុងៗ ស្រួលខ្លួន កុំស្លៀកតឹងពេកណា៎។ កូនអាចចាប់ផ្តើមនិយាយលេង ឬច្រៀងបំពេរទារកក្នុងពោះបាន ព្រោះមិនយូរទៀតទេ គេនឹងចាប់ផ្តើមស្គាល់សំឡេងកូន។ រីករាយជាមួយថ្ងៃដែលស្រួលខ្លួននេះណា៎កូន។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 4]\n\nMy dear daughter...\n\nWelcome to your second trimester! Usually, the nausea begins to lift, and your natural energy and appetite start returning. Your belly is taking on a sweet, rounded shape now.\n\nDress in soft, loose clothes that give you plenty of breathing room. You can also start talking softly or singing to your baby, as they will soon begin hearing your voice. Enjoy these days of feeling brighter.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'ស្លៀកសម្លៀកបំពាក់រលុងស្រួលខ្លួន។ ដើរហាត់ប្រាណតិចៗ និងញ៉ាំអាហារបំប៉នចម្រុះមុខ។',
    reminderEn: 'Wear comfortable, loose clothing and enjoy gentle daily walks.',
  },
  {
    id: 'month-5',
    month: 5,
    stageWeeks: 'សប្ដាហ៍ ១៧ - ២០ (ខែទី ៥)',
    titleKh: 'សារសំឡេងខែទី ៥ 🌸',
    titleEn: 'Voice Message, Month 5',
    audioDuration: '2:10',
    audioUrl: '/audio/month-5.mp3',
    flowerStage: {
      phaseNameKh: 'ផ្កាចាប់ផ្ដើមរីកស្រទាប់',
      phaseNameEn: 'Unfolding Petals',
      descriptionKh: 'ស្រទាប់ផ្កាចាប់ផ្ដើមរីកបន្តិចម្តងៗ បង្ហាញភាពស្រស់បំព្រង។',
      descriptionEn: 'Petals begin unfolding, revealing beauty and resilience.',
      percent: 55,
      bloomIcon: 'unfolding',
    },
    audioScriptKh: `សួស្តី... តើអ្នកបានចាប់អារម្មណ៍ឃើញទារកកម្រើកក្នុងពោះហើយឬនៅ? ពេលដំបូង វាអាចដូចមេអំបៅហើរ ឬដូចពពុះទឹកតូចៗក្នុងពោះ។ អារម្មណ៍នោះអស្ចារ្យណាស់ ព្រោះវាធ្វើឱ្យអ្នកដឹងច្បាស់ថាមានជីវិតមួយកំពុងនៅជាមួយអ្នក។ ពេលទារកកម្រើក សូមដាក់ដៃលើពោះ ហើយនិយាយស្រាលៗជាមួយគេ។ ពេលគេង សូមព្យាយាមគេងផ្អៀង ជាពិសេសខាងឆ្វេង ដើម្បីឱ្យឈាមរត់ស្រួលទៅកាន់ទារក។ សូមថែរក្សាសុខភាពឱ្យបានល្អ។`,
    audioScriptEn: `Hi... have you felt your baby fluttering yet? At first it can feel like gentle butterfly wings or tiny water bubbles. It is such a special feeling, knowing a new life is moving along with you. When you feel movement, place your hand on your belly and speak softly. When you sleep, try lying on your side, especially the left, to help blood flow smoothly to your baby. Take good care of yourself.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៥]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nតើកូនបានចាប់អារម្មណ៍ឃើញទារកកម្រើកក្នុងពោះហើយឬនៅ? លើកដំបូង វាអាចដូចស្លាបមេអំបៅបក់តិចៗ ឬដូចពពុះទឹកតូចៗក្នុងពោះ។ អារម្មណ៍នោះរំភើបអស្ចារ្យណាស់កូន ព្រោះវាជាការសន្ទនាដំបូងរវាងម្តាយនិងកូន។\n\nពេលទារកកម្រើក ដាក់ដៃលើពោះថ្នមៗ ហើយនិយាយជាមួយគេណា៎។ ពេលគេង ព្យាយាមគេងផ្អៀង ជាពិសេសខាងឆ្វេង ដើម្បីឱ្យឈាមនិងសារធាតុចិញ្ចឹមរត់ស្រួលទៅកាន់ទារក។ ម៉ែជូនពរកូននិងទារកសុខសប្បាយជានិច្ច។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 5]\n\nMy dear daughter...\n\nHave you felt your baby fluttering yet? At first, it feels like tiny butterfly wings or gentle ripples. It is such a breathtaking moment—the very first conversation between mother and child.\n\nWhenever you feel that flutter, place your hand gently on your belly and speak to them. When sleeping, try resting on your side, especially the left side, which helps oxygen and nourishment flow easily to your baby.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'គេងផ្អៀងជួយឱ្យឈាមរត់ស្រួលទៅកាន់ទារកក្នុងផ្ទៃ។ ចាប់អារម្មណ៍លើការកម្រើករបស់ទារក។',
    reminderEn: 'Sleeping on your side supports healthy blood flow to your baby.',
  },
  {
    id: 'month-6',
    month: 6,
    stageWeeks: 'សប្ដាហ៍ ២១ - ២៤ (ខែទី ៦)',
    titleKh: 'សារសំឡេងខែទី ៦ 🌸',
    titleEn: 'Voice Message, Month 6',
    audioDuration: '2:00',
    audioUrl: '/audio/month-6.mp3',
    flowerStage: {
      phaseNameKh: 'ផ្ការីកកន្លះ',
      phaseNameEn: 'Half Bloom',
      descriptionKh: 'ផ្ការីកបានពាក់កណ្តាល បញ្ចេញក្លិនក្រអូបស្រទន់។',
      descriptionEn: 'Halfway in bloom, carrying gentle maternal strength.',
      percent: 68,
      bloomIcon: 'bloom',
    },
    audioScriptKh: `សួស្តី... អ្នកធ្វើដំណើរបានពាក់កណ្តាលផ្លូវហើយ! ពេលនេះទារកលូតលាស់លឿន អ្នកអាចនឹងឈឺចង្កេះ ឬចុករោយជើងបន្តិចបន្តួច។ សូមកុំឈរយូរពេក ហើយពេលអង្គុយ យកខ្នើយកល់ខ្នងឱ្យត្រង់។ បើមានស្វាមី ឬសមាជិកគ្រួសារនៅក្បែរ អ្នកអាចសុំឱ្យគាត់ជួយច្របាច់ជើង។ ការមានផ្ទៃពោះមិនមែនជាដំណើររបស់អ្នកតែម្នាក់ឯងទេ ការជួយគ្នាមានសារៈសំខាន់ណាស់។ អ្នកកំពុងតស៊ូបានល្អគួរឱ្យសរសើរ។`,
    audioScriptEn: `Hi... you are more than halfway through this journey! Your baby is growing quickly, and you might feel aches in your lower back or feet. Avoid standing for long stretches, and use a cushion behind your back when sitting. If your partner or a family member is nearby, feel free to ask them for a foot massage. Pregnancy is not something you have to do alone, and support matters. You are doing admirably.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៦]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nកូនធ្វើដំណើរបានជាងពាក់កណ្តាលផ្លូវហើយ! ពេលនេះទារកលូតលាស់លឿនណាស់ កូនអាចនឹងមានអារម្មណ៍ឈឺចង្កេះ ឬចុករោយជើងបន្តិចបន្តួច។ កុំឈរយូរពេកណា៎កូន ហើយពេលអង្គុយ យកខ្នើយទន់កល់ខ្នងឱ្យត្រង់។\n\nបើមានស្វាមី ឬក្រុមគ្រួសារនៅក្បែរ សុំឱ្យពួកគាត់ជួយច្របាច់ជើង ឬជួយការងារផ្ទះខ្លះៗទៅកូន។ ការមានផ្ទៃពោះមិនមែនកូនត្រូវរែកពន់តែម្នាក់ឯងទេ ការចេះជួយគ្នាក្នុងគ្រួសារគឺសំខាន់បំផុត។ កូនជាម្តាយដ៏រឹងមាំម្នាក់។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 6]\n\nMy dear daughter...\n\nYou have passed the halfway mark! Your baby is growing rapidly now, so you may notice aches in your back and tired feet. Avoid standing in one spot for too long, and tuck a small cushion behind your back when sitting.\n\nLet your partner or family lend a helping hand—whether that means massaging your feet or handling heavier chores. Pregnancy is a family journey, not something you have to carry alone. You are doing wonderfully.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'ពេលអង្គុយ ប្រើខ្នើយកល់ខ្នងដើម្បីកាត់បន្ថយការឈឺចង្កេះ។ កុំឈរឬអង្គុយយូរពេកដោយមិនប្តូរឥរិយាបថ។',
    reminderEn: 'Support your back with a pillow and take breaks from long standing.',
  },
  {
    id: 'month-7',
    month: 7,
    stageWeeks: 'សប្ដាហ៍ ២៥ - ២៨ (ខែទី ៧)',
    titleKh: 'សារសំឡេងខែទី ៧ 🌸',
    titleEn: 'Voice Message, Month 7',
    audioDuration: '2:20',
    audioUrl: '/audio/month-7.mp3',
    flowerStage: {
      phaseNameKh: 'ផ្កាកំពុងរីកសាយ',
      phaseNameEn: 'Radiant Blossom',
      descriptionKh: 'ផ្ការីកកាន់តែធំ បង្ហាញភាពរឹងមាំនិងសេចក្តីសង្ឃឹម។',
      descriptionEn: 'The blossom expands radiantly with strength and anticipation.',
      percent: 78,
      bloomIcon: 'bloom',
    },
    audioScriptKh: `សួស្តី... អ្នកកំពុងចូលត្រីមាសទីបីហើយ! ពេលវេលាដើរលឿនណាស់ មិនយូរទៀតទេ អ្នកនឹងបានជួបទារក។ ពេលនេះជាពេលល្អដើម្បីស្គាល់សញ្ញាគ្រោះថ្នាក់មួយចំនួន ដូចជាធ្លាក់ឈាម ឈឺក្បាលខ្លាំង ហើមមុខហើមដៃ ឬទារកមិនសូវកម្រើក។ បើឃើញសញ្ញាទាំងនេះ កុំរង់ចាំ សូមទៅមន្ទីរពេទ្យភ្លាម។ ការដឹងពីសញ្ញាទាំងនេះមិនមែនដើម្បីធ្វើឱ្យអ្នកភ័យទេ តែដើម្បីឱ្យអ្នកអាចការពារខ្លួន និងទារកបាន។ «ម៉ែ» នៅក្បែរអ្នកជានិច្ច។`,
    audioScriptEn: `Hi... you are entering the third trimester! Time moves quickly, and soon you will meet your baby. It is wise to learn some important warning signs now, such as bleeding, a severe headache, swelling of the face and hands, or your baby moving less than usual. If you notice any of these, do not wait; go straight to a clinic or hospital. Knowing the signs is not meant to worry you, but to help you keep yourself and your baby safe. ម៉ែ is by your side.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៧]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nកូនឈានចូលត្រីមាសទីបីហើយ! ពេលវេលាដើរលឿនណាស់ មិនយូរទៀតទេ កូននឹងបានជួបមុខទារកហើយ។ ពេលនេះជាពេលដែលកូនត្រូវស្គាល់សញ្ញាគ្រោះថ្នាក់សំខាន់ៗ ដូចជា៖ ធ្លាក់ឈាមតាមទ្វារមាស ឈឺក្បាលខ្លាំងស្រវាំងភ្នែក ហើមមុខហើមដៃ ឬទារកកម្រើកតិចជាងធម្មតា។\n\nបើមានសញ្ញាទាំងនេះ កុំបង្អង់យូរណា៎កូន ប្រញាប់ទៅមន្ទីរពេទ្យ ឬមណ្ឌលសុខភាពភ្លាម។ ម៉ែប្រាប់នេះមិនមែនឱ្យកូនភ័យទេ គឺដើម្បីឱ្យកូនចេះការពារខ្លួន និងកូនក្នុងពោះ។ ម៉ែនៅក្បែរកូនជានិច្ច។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 7]\n\nMy dear daughter...\n\nYou have entered your third and final trimester! Soon, you will be holding your little one. This is the right time to keep key danger signs in mind: any vaginal bleeding, severe headache or blurred vision, swelling in the face and hands, or noticeably reduced baby movement.\n\nIf you ever notice any of these signs, do not wait—go straight to the hospital or health center. Knowing these signs is not meant to frighten you; it is your shield to protect both you and your baby.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'ស្គាល់សញ្ញាគ្រោះថ្នាក់ (ដូចជាធ្លាក់ឈាម ឈឺក្បាលខ្លាំង ហើមខុសធម្មតា)។ បើមាន ចូរទៅជួបគ្រូពេទ្យជាបន្ទាន់។',
    reminderEn: 'Know important warning signs and seek medical care promptly if anything concerns you.',
  },
  {
    id: 'month-8',
    month: 8,
    stageWeeks: 'សប្ដាហ៍ ២៩ - ៣៤ (ខែទី ៨)',
    titleKh: 'សារសំឡេងខែទី ៨ 🌸',
    titleEn: 'Voice Message, Month 8',
    audioDuration: '2:15',
    audioUrl: '/audio/month-8.mp3',
    flowerStage: {
      phaseNameKh: 'ផ្ការីកពេញទំហឹង',
      phaseNameEn: 'Full Blossom',
      descriptionKh: 'ផ្ការីកស្គុះស្គាយ បញ្ជាក់ពីភាពពេញលេញនៃមាតុភាព។',
      descriptionEn: 'A full blossom, embodying the richness of entering motherhood.',
      percent: 88,
      bloomIcon: 'full_blossom',
    },
    audioScriptKh: `សួស្តី... ពោះរបស់អ្នកធំច្បាស់ណាស់ហើយ។ ពេលនេះអ្នកអាចនឹងពិបាកដកដង្ហើមបន្តិច ឬពិបាកគេងពេលយប់ ព្រោះទារកធំពេញពោះ។ សូមឆ្លៀតសម្រាកពេលថ្ងៃឱ្យបានច្រើន។ ហើយចាប់ផ្តើមរៀបចំកាតាបសម្រាលទុក រួមមានសម្លៀកបំពាក់សម្រាប់អ្នក និងទារកទើបនឹងកើត កន្ទប សៀវភៅតាមដានសុខភាពមាតានិងទារកពណ៌លឿង និងលុយសម្រាប់ពេលបន្ទាន់។ សូមសម្រេចចិត្តឱ្យច្បាស់ថាចង់សម្រាលនៅមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យណា។ ជំហានតូចៗទាំងនេះនឹងជួយឱ្យអ្នកស្ងប់ចិត្តជាងមុន។`,
    audioScriptEn: `Hi... your belly is round and full now. Breathing may feel heavier and sleeping through the night may be harder, since your baby fills so much space. Rest during the day whenever you can. Start packing your delivery bag: clothes for you and the newborn, cloths or diapers, your yellow Maternal and Child Health Handbook, and some emergency money. Decide which health center or hospital you plan to deliver at. These small steps will help you feel calmer.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៨]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nពោះរបស់កូនធំច្បាស់ណាស់ហើយពេលនេះ។ កូនអាចនឹងមានអារម្មណ៍ពិបាកដកដង្ហើម ឬគេងមិនសូវលក់នៅពេលយប់ ព្រោះទារកធំពេញពោះ។ ឆ្លៀតសម្រាកពេលថ្ងៃឱ្យបានញឹកញាប់ណា៎កូន។\n\nពេលនេះចាប់ផ្តើមរៀបចំកាតាបសម្រាលឱ្យហើយទៅកូន៖ សម្លៀកបំពាក់កូននិងទារក កន្ទប សៀវភៅពណ៌លឿងតាមដានសុខភាពមាតា និងប្រាក់កាសបម្រុងទុក។ ហើយត្រូវដឹងឱ្យច្បាស់ពីមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យដែលកូនគ្រោងទៅសម្រាល រួមទាំងរៀបចំអ្នកកំដរ និងមធ្យោបាយធ្វើដំណើរទុកជាមុន។ ការត្រៀមខ្លួនរួចរាល់ នឹងធ្វើឱ្យចិត្តកូនស្ងប់។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 8]\n\nMy dear daughter...\n\nYour belly is beautifully full now! It may feel harder to breathe deeply or get a comfortable night's rest. Take quiet naps during the day whenever you can.\n\nNow is the time to pack your hospital bag: clothes for you and your newborn, clean baby cloths, your yellow Maternal Health Handbook, and emergency savings. Finalize where you will give birth, and plan who will accompany you and how you will travel there. Preparedness brings calm.\n\nWith all my love, Mom 🌸`,
    reminderKh: 'រៀបចំកាតាបសម្រាល (សៀវភៅតាមដានពណ៌លឿង ខោអាវ សម្ភារៈទារក) និងត្រៀមមធ្យោបាយធ្វើដំណើរ។',
    reminderEn: 'Prepare your delivery bag with the Maternal Health Record, newborn essentials, and transport plan.',
  },
  {
    id: 'month-9',
    month: 9,
    stageWeeks: 'សប្ដាហ៍ ៣៥ - ៤០ (ខែទី ៩)',
    titleKh: 'សារសំឡេងខែទី ៩ 🌸',
    titleEn: 'Voice Message, Month 9',
    audioDuration: '2:30',
    audioUrl: '/audio/month-9.mp3',
    flowerStage: {
      phaseNameKh: 'ផ្កាផ្សាយក្លិនទូទាំងសួន',
      phaseNameEn: 'Full Bloom & Radiant Motherhood',
      descriptionKh: 'ផ្ការីកស្គុះស្គាយត្រៀមទទួលពន្លឺជីវិតថ្មីដែលរង់ចាំ។',
      descriptionEn: 'The flower blooms in full splendor, ready to welcome new life.',
      percent: 100,
      bloomIcon: 'full_blossom',
    },
    audioScriptKh: `សួស្តី... ពេលវេលាដែលអ្នករង់ចាំជិតមកដល់ហើយ។ ក្នុងរយៈពេល ៩ ខែនេះ អ្នកបានឆ្លងកាត់ការលំបាកជាច្រើនដោយភាពអត់ធ្មត់។ ពេលចាប់ផ្តើមឈឺពោះសម្រាល សូមកុំភ័យ ស្ត្រីគ្រប់រូបមានកម្លាំងខ្លាំងក្លាក្នុងខ្លួន។ ដកដង្ហើមវែងៗ ហើយធ្វើតាមការណែនាំរបស់ឆ្មប ឬគ្រូពេទ្យ។ មិនយូរទៀតទេ អ្នកនឹងបានបីទារកក្នុងដៃ។ សូមជូនពរឱ្យអ្នកសម្រាលដោយសុវត្ថិភាព និងសុខសប្បាយទាំងពីរនាក់។`,
    audioScriptEn: `Hi... the moment you have been waiting for is almost here. Across these nine months, you have walked this path with real patience and courage. When labor begins, do not be afraid; every woman has deep strength within her. Breathe deeply and trust your midwife or doctor. Soon you will hold your baby in your arms. Wishing you a safe delivery and good health for you both.`,
    letterKh: `[សំបុត្រដែលត្រូវបានអនុម័តពីអង្គការ PSI សម្រាប់ខែទី ៩]\n\nកូនស្រីជាទីស្រឡាញ់...\n\nពេលវេលាដែលកូនរង់ចាំជិតមកដល់ហើយ! រយៈពេល ៩ ខែកន្លងមកនេះ កូនបានឆ្លងកាត់ការលំបាក និងការផ្លាស់ប្តូរជាច្រើនដោយភាពអត់ធ្មត់ និងក្តីស្រឡាញ់ដ៏ធំធេង។ ម៉ែមានមោទនភាពចំពោះកូនខ្លាំងណាស់។\n\nពេលចាប់ផ្តើមឈឺពោះសម្រាល កុំភ័យស្លន់ស្លោណា៎កូន ស្ត្រីខ្មែរគ្រប់រូបមានកម្លាំងចិត្ត និងភាពអត់ធន់អស្ចារ្យនៅក្នុងខ្លួន។ ដកដង្ហើមវែងៗ សម្រួលអារម្មណ៍ និងធ្វើតាមការណែនាំរបស់ឆ្មប ឬគ្រូពេទ្យ។ មិនយូរប៉ុន្មានទេ កូននឹងបានបីកូនតូចក្នុងដៃ។ ម៉ែសូមបួងសួងជូនពរឱ្យកូនសម្រាលដោយរលូន សុវត្ថិភាព និងសុខសប្បាយទាំងម្តាយទាំងកូនណា៎។\n\nពីម៉ែ ដោយក្តីស្រឡាញ់ដ៏ជ្រាលជ្រៅ 🌸`,
    letterEn: `[Approved Letter from PSI for Month 9]\n\nMy dear daughter...\n\nThe moment you have waited for is almost here! Across these nine months, you have walked through every change and discomfort with so much grace, patience, and love. I could not be prouder of you.\n\nWhen labor contractions start, do not be afraid; deep within you is immense strength. Breathe slowly and trust your care team. Very soon, you will hold your baby against your chest. Wishing you a safe, smooth delivery and abundant health for both of you.\n\nWith all my love and blessings, Mom 🌸`,
    reminderKh: 'ពេលមានសញ្ញាឈឺពោះទៀងទាត់ ធ្លាក់ទឹករម្អិល ឬបែកទឹកភ្លោះ ចូរប្រញាប់ទៅមន្ទីរពេទ្យសម្រាលភ្លាម។',
    reminderEn: 'When contractions become regular or your water breaks, proceed calmly to your chosen health facility.',
  },
];

/**
 * Returns the relevant monthly message for any pregnancy week (1-40)
 */
export function getMonthlyMessageForWeek(week: number): MonthlyMessage {
  if (week <= 4) return MONTHLY_MOM_MESSAGES[0];
  if (week <= 8) return MONTHLY_MOM_MESSAGES[1];
  if (week <= 12) return MONTHLY_MOM_MESSAGES[2];
  if (week <= 16) return MONTHLY_MOM_MESSAGES[3];
  if (week <= 20) return MONTHLY_MOM_MESSAGES[4];
  if (week <= 24) return MONTHLY_MOM_MESSAGES[5];
  if (week <= 28) return MONTHLY_MOM_MESSAGES[6];
  if (week <= 34) return MONTHLY_MOM_MESSAGES[7];
  return MONTHLY_MOM_MESSAGES[8];
}

/**
 * Stage Focus Guidance for Week 9 (MVP default) and across trimesters.
 * Keeps only 3 small, calm focus cards per Section 11 of user instructions:
 * "What can I focus on right now? Show only a few small focus cards. Do not put every possible feature on the Home page."
 */
export const STAGE_FOCUS_TOPICS: Record<number, FocusTopic[]> = {
  // Month 3 / Week 9 (MVP Focus)
  3: [
    {
      id: 'focus-nutrition-m3',
      titleKh: 'អាហារូបត្ថម្ភ និងជាតិដែក',
      titleEn: 'Nutrition & Iron Support',
      category: 'អាហារូបត្ថម្ភ (Nutrition)',
      iconType: 'nutrition',
      summaryKh: 'ញ៉ាំបន្លែបៃតង ត្រី ស៊ុត និងលេបថ្នាំគ្រាប់ជាតិដែក-ហ្វូលិកតាមគ្រូពេទ្យណែនាំ ដើម្បីការពារភាពស្លេកស្លាំង។',
      summaryEn: 'Eat dark leafy greens, fish, eggs, and take iron-folic acid supplements as advised by health workers.',
      resourceIds: ['res-nmchc-nutrition-programme', 'res-who-anc-positive-experience'],
      suggestedQuestionsKh: [
        'តើខ្ញុំគួរលេបថ្នាំជាតិដែកពេលណាល្អបំផុត ដើម្បីកុំឱ្យវិលមុខ?',
        'តើមានអាហារណាដែលខ្ញុំគួរជៀសវាងក្នុងត្រីមាសនេះទេ?',
      ],
      suggestedQuestionsEn: [
        'What is the best time of day to take my iron supplement to avoid nausea?',
        'Are there any local foods I should avoid during this trimester?',
      ],
    },
    {
      id: 'focus-checkup-m3',
      titleKh: 'ការពិនិត្យផ្ទៃពោះលើកដំបូង',
      titleEn: 'First Antenatal Care Visit',
      category: 'ការពិនិត្យសុខភាព (Checkups)',
      iconType: 'checkup',
      summaryKh: 'ទៅពិនិត្យផ្ទៃពោះឱ្យបានមុនសប្ដាហ៍ទី ១២ ដើម្បីវាស់សម្ពាធឈាម ពិនិត្យឈាម និងទទួលសៀវភៅតាមដានសុខភាពមាតា។',
      summaryEn: 'Schedule your first antenatal visit before week 12 to check blood pressure, blood health, and receive your Yellow Record Book.',
      resourceIds: ['res-nmchc-safe-motherhood-protocols', 'res-rhac-antenatal-care'],
      suggestedQuestionsKh: [
        'តើខ្ញុំត្រូវមកពិនិត្យផ្ទៃពោះប៉ុន្មានដងក្នុងអំឡុងពេលពពោះទាំងមូល?',
        'តើថ្ងៃសម្រាលរបស់ខ្ញុំត្រូវបានប៉ាន់ស្មាននៅថ្ងៃណា?',
      ],
      suggestedQuestionsEn: [
        'How many antenatal care visits should I plan for throughout my pregnancy?',
        'What is my estimated due date based on my checkup?',
      ],
    },
    {
      id: 'focus-daily-m3',
      titleKh: 'ការថែទាំកាយ និងសម្រាក',
      titleEn: 'Rest & Gentle Body Care',
      category: 'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
      iconType: 'daily',
      summaryKh: 'ពេលចាញ់កូនឬអស់កម្លាំង ចូរគេងសម្រាកឱ្យបានច្រើន កុំបង្ខំធ្វើការធ្ងន់ និងពិសាទឹកក្តៅឧណ្ហៗ។',
      summaryEn: 'Listen to your body when feeling fatigued. Rest without guilt, stay hydrated with warm water, and avoid heavy lifting.',
      resourceIds: ['res-nmchc-mch-handbook', 'res-who-healthy-eating'],
      suggestedQuestionsKh: [
        'តើខ្ញុំអាចធ្វើការងារផ្ទះធម្មតាបានកម្រិតណា?',
        'តើពេលចាញ់កូនខ្លាំង គួរញ៉ាំអ្វីដើម្បីស្រួលខ្លួន?',
      ],
      suggestedQuestionsEn: [
        'What level of daily activities or light chores is safe for me right now?',
        'What are gentle ways to soothe morning nausea?',
      ],
    },
  ],
};

/**
 * Fallback generator for focus topics if current week falls outside custom mappings
 */
export function getFocusTopicsForMonth(month: number): FocusTopic[] {
  if (STAGE_FOCUS_TOPICS[month]) {
    return STAGE_FOCUS_TOPICS[month];
  }
  // Generates 3 gentle, contextual topics for any other month
  return [
    {
      id: `focus-nutrition-m${month}`,
      titleKh: 'អាហារូបត្ថម្ភប្រចាំខែ',
      titleEn: 'Monthly Nourishment',
      category: 'អាហារូបត្ថម្ភ (Nutrition)',
      iconType: 'nutrition',
      summaryKh: 'ញ៉ាំអាហារចម្រុះមុខ អាហារក្តៅៗ ត្រី សាច់ និងបន្លែស្រស់ដើម្បីចិញ្ចឹមទាំងម្តាយនិងទារក។',
      summaryEn: 'Nourish yourself and your growing baby with wholesome, varied meals and warm broths.',
      resourceIds: ['res-nmchc-nutrition-programme'],
      suggestedQuestionsKh: ['តើរបបអាហាររបស់ខ្ញុំមានតុល្យភាពល្អហើយឬនៅ?'],
      suggestedQuestionsEn: ['Is my current diet providing adequate nutrients for baby growth?'],
    },
    {
      id: `focus-checkup-m${month}`,
      titleKh: 'ការតាមដានសុខភាព',
      titleEn: 'Routine Health Check',
      category: 'ការពិនិត្យសុខភាព (Checkups)',
      iconType: 'checkup',
      summaryKh: 'ទៅពិនិត្យសុខភាពទៀងទាត់តាមការណាត់របស់ឆ្មប ឬគ្រូពេទ្យនៅមណ្ឌលសុខភាព។',
      summaryEn: 'Maintain your scheduled antenatal appointments with your midwife or healthcare provider.',
      resourceIds: ['res-nmchc-safe-motherhood-protocols'],
      suggestedQuestionsKh: ['តើការលូតលាស់របស់ទារកក្នុងផ្ទៃវិវត្តល្អទេ?'],
      suggestedQuestionsEn: ['How is my baby measuring and developing at this stage?'],
    },
    {
      id: `focus-daily-m${month}`,
      titleKh: 'ការថែទាំចិត្តនិងអារម្មណ៍',
      titleEn: 'Calm & Gentle Wellbeing',
      category: 'ការថែទាំកាយនិងចិត្ត (Wellbeing)',
      iconType: 'daily',
      summaryKh: 'រក្សាអារម្មណ៍ឱ្យស្រស់ស្រាយ និយាយលេងជាមួយទារកក្នុងផ្ទៃ និងគេងសម្រាកឱ្យបានគ្រប់គ្រាន់។',
      summaryEn: 'Keep a calm heart, speak softly to your little one, and rest whenever your body asks.',
      resourceIds: ['res-nmchc-mch-handbook'],
      suggestedQuestionsKh: ['តើខ្ញុំគួររៀបចំខ្លួនបែបណាដើម្បីគេងលក់ស្រួល?'],
      suggestedQuestionsEn: ['What sleeping positions are most comfortable at this stage?'],
    },
  ];
}