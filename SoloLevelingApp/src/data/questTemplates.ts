import { GoalCategory, QuestType, VerificationType, QuestRewards, QuestRequirement, QuestPenalty } from '../types';

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  verificationType: VerificationType;
  requirements: Omit<QuestRequirement, 'currentValue'>[];
  rewards: QuestRewards;
  category?: GoalCategory;
  penalty?: QuestPenalty;
}

// --- Daily Quest Templates (rotated/randomized) ---
export const DAILY_QUEST_TEMPLATES: QuestTemplate[] = [
  // Fitness
  {
    id: 'daily_pushups',
    title: '100 Push-ups',
    description: 'Complete 100 push-ups. Break them up however you need.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Push-ups completed', targetValue: 100, unit: 'reps' }],
    rewards: { exp: 30, gold: 15, statPoints: 1 },
    category: 'fitness',
    penalty: { description: 'Skipping training weakens the body.', statLoss: { vitality: 1 } },
  },
  {
    id: 'daily_situps',
    title: '100 Sit-ups',
    description: 'Complete 100 sit-ups to strengthen your core.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Sit-ups completed', targetValue: 100, unit: 'reps' }],
    rewards: { exp: 30, gold: 15, statPoints: 1 },
    category: 'fitness',
    penalty: { description: 'Core weakens without training.' },
  },
  {
    id: 'daily_squats',
    title: '100 Squats',
    description: 'Complete 100 squats. Feel the burn.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Squats completed', targetValue: 100, unit: 'reps' }],
    rewards: { exp: 30, gold: 15, statPoints: 1 },
    category: 'fitness',
    penalty: { description: 'Legs grow weak.' },
  },
  {
    id: 'daily_run',
    title: '10km Run',
    description: 'Run 10 kilometers. Walking portions are acceptable.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Distance run', targetValue: 10, unit: 'km' }],
    rewards: { exp: 50, gold: 25, statPoints: 2 },
    category: 'fitness',
    penalty: { description: 'Stamina decreases.', statLoss: { agility: 1 } },
  },
  {
    id: 'daily_workout',
    title: 'Complete a Workout',
    description: 'Hit the gym or do a home workout session (minimum 30 minutes).',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Workout duration', targetValue: 30, unit: 'minutes' }],
    rewards: { exp: 40, gold: 20, statPoints: 1 },
    category: 'fitness',
  },

  // Health
  {
    id: 'daily_water',
    title: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated. Track your water intake throughout the day.',
    type: 'daily',
    verificationType: 'counter',
    requirements: [{ description: 'Glasses of water', targetValue: 8, unit: 'glasses' }],
    rewards: { exp: 15, gold: 10, statPoints: 0 },
    category: 'health',
  },
  {
    id: 'daily_sleep',
    title: 'Get 7+ Hours of Sleep',
    description: 'Rest is essential for recovery. Get adequate sleep.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Hours of sleep', targetValue: 7, unit: 'hours' }],
    rewards: { exp: 20, gold: 10, statPoints: 0 },
    category: 'health',
  },
  {
    id: 'daily_meditation',
    title: 'Meditate for 10 Minutes',
    description: 'Clear your mind. Focus on your breathing.',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Meditation time', targetValue: 10, unit: 'minutes' }],
    rewards: { exp: 20, gold: 10, statPoints: 1 },
    category: 'health',
  },
  {
    id: 'daily_no_junk',
    title: 'No Junk Food',
    description: 'Avoid processed foods and sugary snacks for the entire day.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Clean eating', targetValue: 1, unit: 'day' }],
    rewards: { exp: 25, gold: 15, statPoints: 0 },
    category: 'health',
  },

  // Learning
  {
    id: 'daily_read',
    title: 'Read for 30 Minutes',
    description: 'Read a book, article, or educational material.',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Reading time', targetValue: 30, unit: 'minutes' }],
    rewards: { exp: 25, gold: 15, statPoints: 1 },
    category: 'learning',
  },
  {
    id: 'daily_study',
    title: 'Study Session',
    description: 'Dedicated study time on a skill or subject.',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Study time', targetValue: 45, unit: 'minutes' }],
    rewards: { exp: 35, gold: 20, statPoints: 1 },
    category: 'learning',
  },
  {
    id: 'daily_practice',
    title: 'Practice a Skill',
    description: 'Practice a skill you are developing (coding, music, art, etc).',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Practice time', targetValue: 30, unit: 'minutes' }],
    rewards: { exp: 30, gold: 15, statPoints: 1 },
    category: 'learning',
  },

  // Productivity
  {
    id: 'daily_wake_early',
    title: 'Wake Up Before 7 AM',
    description: 'Start the day early. Discipline is power.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Woke up before 7AM', targetValue: 1, unit: 'times' }],
    rewards: { exp: 20, gold: 10, statPoints: 1 },
    category: 'other',
  },
  {
    id: 'daily_clean',
    title: 'Clean Your Space',
    description: 'Tidy up your living/work space for at least 15 minutes.',
    type: 'daily',
    verificationType: 'timer',
    requirements: [{ description: 'Cleaning time', targetValue: 15, unit: 'minutes' }],
    rewards: { exp: 15, gold: 10, statPoints: 0 },
    category: 'other',
  },
  {
    id: 'daily_journal',
    title: 'Write in Journal',
    description: 'Reflect on your day. Write down thoughts and progress.',
    type: 'daily',
    verificationType: 'self_report',
    requirements: [{ description: 'Journal entry', targetValue: 1, unit: 'entry' }],
    rewards: { exp: 20, gold: 10, statPoints: 0 },
    category: 'other',
  },
];

// --- Emergency / Penalty Quest Templates ---
export const EMERGENCY_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: 'emergency_survival',
    title: '[EMERGENCY] Survival Training',
    description: 'WARNING: Failure to complete will result in stat penalties. Complete the basic training regimen.',
    type: 'emergency',
    verificationType: 'self_report',
    requirements: [
      { description: 'Push-ups', targetValue: 50, unit: 'reps' },
      { description: 'Squats', targetValue: 50, unit: 'reps' },
      { description: 'Run', targetValue: 5, unit: 'km' },
    ],
    rewards: { exp: 100, gold: 50, statPoints: 3 },
    penalty: { description: 'All stats reduced by 2.', statLoss: { strength: 2, agility: 2, vitality: 2, intelligence: 2, sense: 2 } },
  },
];

// --- Story Quest Templates (unlock at milestones) ---
export const STORY_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: 'quest_awakening',
    title: 'The Awakening',
    description: 'You have been chosen by the System. Complete your first daily quest to begin your journey.',
    type: 'story',
    verificationType: 'self_report',
    requirements: [{ description: 'Complete a daily quest', targetValue: 1, unit: 'quests' }],
    rewards: { exp: 50, gold: 30, statPoints: 3, skillUnlockId: 'skill_slash' },
  },
  {
    id: 'quest_first_dungeon',
    title: 'Into the Depths',
    description: 'Clear your first dungeon to prove your worth.',
    type: 'story',
    verificationType: 'self_report',
    requirements: [{ description: 'Clear a dungeon', targetValue: 1, unit: 'dungeons' }],
    rewards: { exp: 100, gold: 50, statPoints: 5 },
  },
  {
    id: 'quest_iron_body',
    title: 'Forging an Iron Body',
    description: 'Complete 7 consecutive days of daily fitness quests.',
    type: 'story',
    verificationType: 'self_report',
    requirements: [{ description: 'Consecutive days of fitness quests', targetValue: 7, unit: 'days' }],
    rewards: { exp: 200, gold: 100, statPoints: 5, skillUnlockId: 'skill_passive_iron_body' },
  },
  {
    id: 'quest_shadow_monarch',
    title: 'Shadow Extraction Rite',
    description: 'Reach level 20 and clear 5 dungeons to learn Shadow Extraction.',
    type: 'story',
    verificationType: 'self_report',
    requirements: [
      { description: 'Reach level', targetValue: 20, unit: 'level' },
      { description: 'Dungeons cleared', targetValue: 5, unit: 'dungeons' },
    ],
    rewards: { exp: 500, gold: 250, statPoints: 10, skillUnlockId: 'skill_shadow_extraction' },
  },
  {
    id: 'quest_monarch_domain',
    title: "The Monarch's Domain",
    description: 'Reach level 75 and achieve S-rank to unlock the ultimate power.',
    type: 'story',
    verificationType: 'self_report',
    requirements: [
      { description: 'Reach level', targetValue: 75, unit: 'level' },
      { description: 'Achieve rank', targetValue: 1, unit: 'S-rank' },
    ],
    rewards: { exp: 2000, gold: 1000, statPoints: 20, skillUnlockId: 'skill_domain_of_monarch' },
  },
];

export const getQuestTemplateById = (id: string): QuestTemplate | undefined =>
  [...DAILY_QUEST_TEMPLATES, ...EMERGENCY_QUEST_TEMPLATES, ...STORY_QUEST_TEMPLATES].find(q => q.id === id);

export const getDailyQuestsForCategories = (categories: GoalCategory[]): QuestTemplate[] => {
  if (categories.length === 0) return DAILY_QUEST_TEMPLATES;
  return DAILY_QUEST_TEMPLATES.filter(q => q.category && categories.includes(q.category));
};

export const generateDailyQuests = (categories: GoalCategory[], count: number = 4): QuestTemplate[] => {
  const pool = getDailyQuestsForCategories(categories);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  // Always include at least one fitness quest if fitness is a category
  const result: QuestTemplate[] = [];
  
  if (categories.includes('fitness')) {
    const fitnessQuest = shuffled.find(q => q.category === 'fitness');
    if (fitnessQuest) {
      result.push(fitnessQuest);
      shuffled.splice(shuffled.indexOf(fitnessQuest), 1);
    }
  }
  
  while (result.length < count && shuffled.length > 0) {
    result.push(shuffled.shift()!);
  }
  
  return result;
};
