// ============================================================
// IRL Solo Leveling App - Type Definitions
// ============================================================

// --- Player / Character ---
export interface PlayerStats {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  sense: number;
}

export interface Player {
  id: string;
  name: string;
  title: string;
  rank: PlayerRank;
  level: number;
  exp: number;
  expToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: PlayerStats;
  availableStatPoints: number;
  gold: number;
  equippedWeapon: Item | null;
  equippedArmor: Item | null;
  equippedAccessory: Item | null;
  equippedSkills: string[]; // skill IDs, max 4 for combat
  unlockedSkillIds: string[];
  inventory: Item[];
  completedDungeonIds: string[];
  currentDungeonProgress: number; // highest dungeon unlocked
  questStreak: number; // consecutive days completing daily quests
  totalQuestsCompleted: number;
  createdAt: string;
}

export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export const RANK_THRESHOLDS: Record<PlayerRank, number> = {
  'E': 1,
  'D': 10,
  'C': 25,
  'B': 50,
  'A': 75,
  'S': 100,
  'SS': 150,
  'SSS': 200,
};

export const RANK_COLORS: Record<PlayerRank, string> = {
  'E': '#6b7280',
  'D': '#22c55e',
  'C': '#3b82f6',
  'B': '#a855f7',
  'A': '#f97316',
  'S': '#ef4444',
  'SS': '#eab308',
  'SSS': '#06b6d4',
};

// --- Stats ---
export type StatKey = keyof PlayerStats;

export const STAT_DESCRIPTIONS: Record<StatKey, string> = {
  strength: 'Physical attack power & carry capacity',
  agility: 'Speed, dodge chance & critical rate',
  vitality: 'Max HP & defense',
  intelligence: 'Magic power & MP pool',
  sense: 'Perception, detect hidden & accuracy',
};

// --- Items / Artifacts ---
export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';

export interface ItemStatBonus {
  strength?: number;
  agility?: number;
  vitality?: number;
  intelligence?: number;
  sense?: number;
  attackPower?: number;
  defense?: number;
  hp?: number;
  mp?: number;
}

export interface Item {
  id: string;
  templateId: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string; // emoji
  statBonus: ItemStatBonus;
  value: number; // gold value
  quantity: number;
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  'Common': '#9e9e9e',
  'Uncommon': '#4caf50',
  'Rare': '#2196f3',
  'Epic': '#9c27b0',
  'Legendary': '#ff9800',
  'Mythic': '#00e5ff',
};

// --- Skills ---
export type SkillType = 'active' | 'passive';
export type SkillElement = 'physical' | 'fire' | 'ice' | 'lightning' | 'shadow' | 'holy';

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  element: SkillElement;
  icon: string;
  damage: number; // base damage multiplier (1.0 = 100%)
  mpCost: number;
  cooldown: number; // turns
  unlockLevel: number;
  unlockQuestId?: string; // specific quest to unlock
  statRequirement?: Partial<PlayerStats>;
  passiveBonus?: ItemStatBonus;
}

// --- Enemies ---
export interface Enemy {
  id: string;
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  exp: number;
  gold: number;
  skills: EnemySkill[];
  dropTable: DropEntry[];
}

export interface EnemySkill {
  name: string;
  damage: number;
  chance: number; // 0-1
}

export interface DropEntry {
  itemTemplateId: string;
  chance: number; // 0-1
}

// --- Dungeons ---
export type DungeonRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface DungeonStage {
  id: string;
  name: string;
  description: string;
  rank: DungeonRank;
  icon: string;
  enemyIds: string[];
  bossId: string;
  waves: number; // number of enemy waves before boss
  recommendedLevel: number;
  rewards: DungeonRewards;
  backgroundTheme: string; // for game visuals
}

export interface DungeonRewards {
  exp: number;
  gold: number;
  guaranteedDrops: string[]; // item template IDs
  possibleDrops: DropEntry[];
  skillUnlockId?: string;
}

// --- Quests ---
export type QuestType = 'daily' | 'weekly' | 'story' | 'goal' | 'emergency';
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed' | 'expired';
export type VerificationType = 'self_report' | 'timer' | 'counter' | 'photo';

export interface Quest {
  id: string;
  templateId?: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  verificationType: VerificationType;
  requirements: QuestRequirement[];
  rewards: QuestRewards;
  deadline?: string; // ISO date string
  createdAt: string;
  completedAt?: string;
  goalId?: string; // linked goal
  penalty?: QuestPenalty;
}

export interface QuestRequirement {
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; // 'reps', 'minutes', 'times', etc.
}

export interface QuestRewards {
  exp: number;
  gold: number;
  statPoints: number;
  items?: string[]; // item template IDs
  skillUnlockId?: string;
}

export interface QuestPenalty {
  description: string;
  statLoss?: Partial<PlayerStats>;
  hpLoss?: number;
}

// --- Goals ---
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate?: string;
  milestones: Milestone[];
  isActive: boolean;
  createdAt: string;
  completedAt?: string;
  dailyQuestTemplates: string[]; // quest descriptions to rotate
}

export type GoalCategory = 'fitness' | 'learning' | 'career' | 'health' | 'creative' | 'financial' | 'social' | 'other';

export const GOAL_CATEGORY_ICONS: Record<GoalCategory, string> = {
  fitness: '💪',
  learning: '📚',
  career: '💼',
  health: '❤️',
  creative: '🎨',
  financial: '💰',
  social: '🤝',
  other: '⭐',
};

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  rewardExp: number;
  rewardStatPoints: number;
}

// --- Game State (for 2D side-scroller) ---
export interface GameState {
  isActive: boolean;
  dungeonId: string;
  currentWave: number;
  playerHp: number;
  playerMp: number;
  playerX: number;
  playerY: number;
  enemies: GameEnemy[];
  projectiles: Projectile[];
  score: number;
  isPaused: boolean;
  isVictory: boolean;
  isDefeat: boolean;
}

export interface GameEnemy {
  id: string;
  templateId: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  isBoss: boolean;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  damage: number;
  isPlayerOwned: boolean;
  element: SkillElement;
}

// --- App State ---
export interface AppState {
  player: Player;
  quests: Quest[];
  goals: Goal[];
  dungeons: DungeonStage[];
  lastDailyReset: string; // ISO date
  settings: AppSettings;
}

export interface AppSettings {
  notifications: boolean;
  hapticFeedback: boolean;
  theme: 'dark' | 'midnight';
}
