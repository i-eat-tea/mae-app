/**
 * FlowErs Weekly Guidance Data
 *
 * Each record represents the core FlowErs experience:
 * A gentle, friendly companion voice speaking directly to the user,
 * paired with 3-4 focused topics connected directly to trusted resources.
 *
 * Voice: "ម៉ែ" (Mom) is the app's NAME only. The app is a companion, not the
 * user's mother. Speak to the user as "you"; never call her "child",
 * "daughter" or "dear".
 */

import { WeeklyGuidance, FlowerStage } from '../types';

export const FLOWER_STAGES: Record<string, FlowerStage> = {
  early_seed: {
    phaseName: 'Tender Seedling',
    description: 'A tiny seed resting gently in rich soil, quietly taking root with infinite potential.',
    percent: 15,
    bloomIcon: 'seed',
  },
  early_sprout: {
    phaseName: 'Gentle Sprout',
    description: 'A soft green shoot reaching upward, drawing strength from your daily love and warmth.',
    percent: 25,
    bloomIcon: 'sprout',
  },
  budding: {
    phaseName: 'Budding Blossom',
    description: 'Delicate petals tightly curled, preparing for miraculous growth in the quiet protection of your womb.',
    percent: 45,
    bloomIcon: 'bud',
  },
  unfolding: {
    phaseName: 'Unfolding Petals',
    description: 'Slowly welcoming the sunlight; tiny flutters and movements beginning to be felt.',
    percent: 65,
    bloomIcon: 'unfolding',
  },
  blooming: {
    phaseName: 'Radiant Bloom',
    description: 'Full of vitality and grace, nourished every single hour by your loving body.',
    percent: 85,
    bloomIcon: 'bloom',
  },
  full_flower: {
    phaseName: 'Full Blossom',
    description: 'Ready to greet the world and rest safely in your arms, Mama.',
    percent: 100,
    bloomIcon: 'full_blossom',
  },
};

export function getFlowerStageForWeek(week: number): FlowerStage {
  if (week <= 7) return FLOWER_STAGES.early_seed;
  if (week <= 11) return FLOWER_STAGES.early_sprout;
  if (week <= 18) return FLOWER_STAGES.budding;
  if (week <= 27) return FLOWER_STAGES.unfolding;
  if (week <= 36) return FLOWER_STAGES.blooming;
  return FLOWER_STAGES.full_flower;
}

export const CURATED_WEEKLY_GUIDANCE: Record<number, WeeklyGuidance> = {
  9: {
    id: 'week-9-guidance',
    pregnancyWeek: 9,
    trimester: 'First Trimester',
    flowerStage: FLOWER_STAGES.early_sprout,
    title: 'Week 9: Embracing the Gentle Rhythm',
    greeting: 'Good morning, Mama 🌸',
    introduction:
      'Hi Mama, you\'re around week 9 now. There may be many new things on your mind, but you don\'t have to figure everything out at once. This week, let\'s focus on a few things that can help you prepare.',
    audioDuration: '2:15',
    audioUrl: '', // Will play gentle synthesized speech / web audio preview
    audioScript:
      'Hi Mama, take a slow breath. You are in Week 9 now. Inside you, your little one is about the size of a green olive, with tiny hands and feet beginning to shape. If you have been feeling tired lately or if simple smells suddenly bother you, please know this is completely natural. Your body is doing profound work behind the scenes. This week, let\'s not worry about the whole nine months. Let us just focus on your first checkup, nourishing your body with small bites of comfort, and giving yourself permission to rest. You are doing wonderfully.',
    topics: [
      {
        id: 'w9-topic-checkup',
        title: 'Checkup Preparation',
        category: 'Checkups',
        iconType: 'checkup',
        summary:
          'Confirm your first antenatal visit date with your clinic or midwife. Gather your health card and write down a couple of questions about your daily routine.',
        resourceIds: ['res-nmchc-safe-motherhood-protocols', 'res-who-anc-positive-experience'],
        suggestedQuestions: [
          'What prenatal vitamins are recommended for my diet?',
          'Whom can I call if I have sudden nausea or cramping during work?',
        ],
      },
      {
        id: 'w9-topic-nutrition',
        title: 'Nutrition & Gentle Energy',
        category: 'Nutrition',
        iconType: 'nutrition',
        summary:
          'Focus on folic acid, clean water, and simple wholesome bites. If heavy meals feel uncomfortable, eat small, frequent portions throughout the day.',
        resourceIds: ['res-nmchc-nutrition-programme', 'res-who-healthy-eating'],
      },
      {
        id: 'w9-topic-daily',
        title: 'Daily Life & Rest',
        category: 'Daily Life & Wellbeing',
        iconType: 'daily',
        summary:
          'Your blood volume is expanding and hormones are rising. Give yourself permission to take a 15-minute rest after work and keep comfortable shoes on hand.',
        resourceIds: ['res-rhac-maintain-health-pregnancy', 'res-who-staying-well'],
      },
      {
        id: 'w9-topic-questions',
        title: 'Questions to Consider',
        category: 'Preparation & Questions',
        iconType: 'preparation',
        summary:
          'Have you shared how you are feeling with your partner or family? Think about what simple support would help you feel most cared for this week.',
        resourceIds: ['res-nmchc-warning-danger-signs', 'res-rhac-prenatal-care-awareness'],
        suggestedQuestions: [
          'Can my partner help prepare a light snack before morning wake-up?',
          'What are my rights for clinic leave at my workplace?',
        ],
      },
    ],
    reminderNote:
      'Every pregnancy is different. If something worries you or feels uncomfortable, consider discussing it with your healthcare provider.',
    createdAt: '2026-03-01T00:00:00Z',
  },
  8: {
    id: 'week-8-guidance',
    pregnancyWeek: 8,
    trimester: 'First Trimester',
    flowerStage: FLOWER_STAGES.early_sprout,
    title: 'Week 8: Listening to Your Body\'s Signals',
    greeting: 'Hello, Mama 🌸',
    introduction:
      'Around Week 8, your baby\'s tiny heartbeat is beating twice as fast as yours. Take things slowly and let your body guide your daily pace.',
    audioDuration: '2:05',
    audioUrl: '',
    audioScript:
      'Welcome to Week 8, Mama. If morning coffee or certain scents make you turn away, trust your instincts. Your body is naturally protecting the little sprout inside. Keep plain water and fresh fruits nearby, and remember that asking for a quiet evening is an act of care for both of you.',
    topics: [
      {
        id: 'w8-topic-nutrition',
        title: 'Simple Foods for Sensitive Days',
        category: 'Nutrition',
        iconType: 'nutrition',
        summary:
          'Bland carbohydrate-rich foods like rice porridge, dry toast, and steamed sweet potato are often easiest on a sensitive morning stomach.',
        resourceIds: ['res-nmchc-nutrition-programme', 'res-who-healthy-eating'],
      },
      {
        id: 'w8-topic-checkup',
        title: 'Scheduling Your ANC Appointment',
        category: 'Checkups',
        iconType: 'checkup',
        summary:
          'If you have not booked your first prenatal visit, reach out to your local health center or clinic this week.',
        resourceIds: ['res-nmchc-safe-motherhood-protocols', 'res-unicef-community-education'],
      },
      {
        id: 'w8-topic-daily',
        title: 'Resting Without Guilt',
        category: 'Daily Life & Wellbeing',
        iconType: 'daily',
        summary:
          'First trimester fatigue is profound because your body is constructing the placenta. A short afternoon rest can transform your day.',
        resourceIds: ['res-rhac-maintain-health-pregnancy', 'res-who-staying-well'],
      },
    ],
    reminderNote:
      'Trust your intuition. If a symptom feels unusual, your doctor or midwife is always there to guide you.',
    createdAt: '2026-03-01T00:00:00Z',
  },
  10: {
    id: 'week-10-guidance',
    pregnancyWeek: 10,
    trimester: 'First Trimester',
    flowerStage: FLOWER_STAGES.early_sprout,
    title: 'Week 10: Milestones and Moving Forward',
    greeting: 'Good morning, Mama 🌸',
    introduction:
      'At Week 10, your baby is transitioning from an embryo to a fetus. Tiny joints are bending, and your uterus is expanding comfortably.',
    audioDuration: '2:20',
    audioUrl: '',
    audioScript:
      'Hi Mama, congratulations on reaching double digits in your weeks. You are at Week 10. Your baby’s tiny fingers and toes have separated now, and vital organs are all in place. If your waistline feels a little snug, wear clothes with soft, stretchy waistbands. Be gentle with your body today.',
    topics: [
      {
        id: 'w10-topic-checkup',
        title: 'Preparing for Ultrasound & Routine Labs',
        category: 'Checkups',
        iconType: 'checkup',
        summary:
          'Between weeks 10 and 13, many healthcare centers offer dating scans and routine blood screenings. Learn what to expect.',
        resourceIds: ['res-nmchc-referral-hospital-protocols', 'res-who-anc-positive-experience'],
      },
      {
        id: 'w10-topic-nutrition',
        title: 'Hydration and Fiber',
        category: 'Nutrition',
        iconType: 'nutrition',
        summary:
          'Progesterone relaxes digestive muscles, which can cause slow digestion. Fiber from vegetables, fully ripe papaya, and adequate water keeps you comfortable. Avoid unripe (green) papaya during pregnancy.',
        resourceIds: ['res-nmchc-nutrition-programme', 'res-who-healthy-eating'],
      },
      {
        id: 'w10-topic-daily',
        title: 'Comfortable Daily Wear',
        category: 'Daily Life & Wellbeing',
        iconType: 'daily',
        summary:
          'Avoid tight waistbands or restrictive undergarments. Soft cotton clothing lets your breathing remain natural and deep.',
        resourceIds: ['res-rhac-maintain-health-pregnancy', 'res-nmchc-maternal-child-handbook'],
      },
    ],
    reminderNote:
      'Every pregnancy shows at a different time. There is no right or wrong size for your belly at week 10.',
    createdAt: '2026-03-01T00:00:00Z',
  },
  12: {
    id: 'week-12-guidance',
    pregnancyWeek: 12,
    trimester: 'First Trimester',
    flowerStage: FLOWER_STAGES.early_sprout,
    title: 'Week 12: Completing Your First Trimester Milestone',
    greeting: 'Wonderful to see you, Mama 🌸',
    introduction:
      'Week 12 marks the threshold of your second trimester. Many women begin to feel a return of daily energy and calmer stomachs.',
    audioDuration: '2:30',
    audioUrl: '',
    audioScript:
      'Mama, take a deep breath and give your belly a warm stroke. You have nearly completed your first trimester. You have navigated the steepest hormonal shifts, and soon a gentler, more energetic phase will greet you. You should be proud of your resilience.',
    topics: [
      {
        id: 'w12-topic-checkup',
        title: 'First Trimester Review',
        category: 'Checkups',
        iconType: 'checkup',
        summary:
          'Review your laboratory findings and discuss your next checkup schedule for the second trimester with your midwife.',
        resourceIds: ['res-nmchc-safe-motherhood-protocols', 'res-nmchc-referral-hospital-protocols'],
      },
      {
        id: 'w12-topic-daily',
        title: 'Emotional Relief and Sharing News',
        category: 'Daily Life & Wellbeing',
        iconType: 'daily',
        summary:
          'If you were waiting to share your news with extended family or colleagues, decide when and how feels most comfortable for you.',
        resourceIds: ['res-who-staying-well', 'res-nmchc-maternal-child-handbook'],
      },
      {
        id: 'w12-topic-nutrition',
        title: 'Expanding Your Meal Variety',
        category: 'Nutrition',
        iconType: 'nutrition',
        summary:
          'As nausea subsides, begin welcoming colorful vegetables, mild proteins, and calcium-rich foods back to your plate.',
        resourceIds: ['res-nmchc-nutrition-programme', 'res-unicef-health-nutrition-cambodia'],
      },
    ],
    reminderNote:
      'If morning sickness lingers past 12 weeks, do not fret—it tapers off at its own pace for each person.',
    createdAt: '2026-03-01T00:00:00Z',
  }
};

/**
 * Returns weekly guidance for any week (4 to 40).
 * If week has dedicated curated record, returns that;
 * otherwise builds a warm, stage-appropriate guidance package.
 */
export function getWeeklyGuidance(week: number): WeeklyGuidance {
  if (CURATED_WEEKLY_GUIDANCE[week]) {
    return CURATED_WEEKLY_GUIDANCE[week];
  }

  const flowerStage = getFlowerStageForWeek(week);
  const trimester =
    week <= 12 ? 'First Trimester' : week <= 27 ? 'Second Trimester' : 'Third Trimester';

  return {
    id: `week-${week}-guidance`,
    pregnancyWeek: week,
    trimester,
    flowerStage,
    title: `Week ${week}: Nurturing Your ${flowerStage.phaseName}`,
    greeting: `Good morning, Mama 🌸`,
    introduction: `Hi Mama, you are around Week ${week} in your ${trimester.toLowerCase()}. Let's take things one quiet step at a time. Here is what is gentle and worthwhile to focus on right now.`,
    audioDuration: '2:10',
    audioUrl: '',
    audioScript: `Hi Mama, welcome to Week ${week}. Whether this week brings steady calm or new sensations, know that your body knows exactly how to shelter and grow your baby. You don't have to figure everything out today. Take a gentle breath, drink a cup of clean water, and let FlowErs guide you through this week's small priorities.`,
    topics: [
      {
        id: `w${week}-nutrition`,
        title: 'Nutritious Fuel for Week ' + week,
        category: 'Nutrition',
        iconType: 'nutrition',
        summary:
          'Support your expanding blood volume and baby’s growth with wholesome, balanced meals and steady hydration.',
        resourceIds: ['res-nmchc-nutrition-programme', 'res-who-healthy-eating'],
      },
      {
        id: `w${week}-checkup`,
        title: 'Upcoming Prenatal Care',
        category: 'Checkups',
        iconType: 'checkup',
        summary:
          'Review your upcoming checkup dates and write down any questions you have noted in your phone.',
        resourceIds: ['res-nmchc-safe-motherhood-protocols', 'res-who-anc-positive-experience'],
      },
      {
        id: `w${week}-daily`,
        title: 'Gentle Daily Wellbeing',
        category: 'Daily Life & Wellbeing',
        iconType: 'daily',
        summary:
          'Prioritize resting your feet, getting adequate sleep, and sharing sweet moments with your growing belly.',
        resourceIds: ['res-rhac-maintain-health-pregnancy', 'res-who-staying-well'],
      },
    ],
    reminderNote:
      'Every pregnancy is different. If something worries you, consider discussing it with your healthcare provider.',
    createdAt: new Date().toISOString(),
  };
}