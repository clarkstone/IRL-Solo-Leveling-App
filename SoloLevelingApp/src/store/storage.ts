import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Player, Quest, Goal, PlayerRank, RANK_THRESHOLDS } from '../types';
import { generateId } from '../utils/id';

const STORAGE_KEY = '@solo_leveling_app_state';

export const createDefaultPlayer = (name: string = 'Hunter'): Player => ({
  id: generateId(),
  name,
  title: 'E-Rank Hunter',
  rank: 'E',
  level: 1,
  exp: 0,
  expToNext: 100,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  stats: {
    strength: 5,
    agility: 5,
    vitality: 5,
    intelligence: 5,
    sense: 5,
  },
  availableStatPoints: 0,
  gold: 0,
  equippedWeapon: null,
  equippedArmor: null,
  equippedAccessory: null,
  equippedSkills: ['skill_slash'],
  unlockedSkillIds: ['skill_slash'],
  inventory: [],
  completedDungeonIds: [],
  currentDungeonProgress: 0,
  questStreak: 0,
  totalQuestsCompleted: 0,
  createdAt: new Date().toISOString(),
});

export const createDefaultState = (playerName: string = 'Hunter'): AppState => ({
  player: createDefaultPlayer(playerName),
  quests: [],
  goals: [],
  dungeons: [],
  lastDailyReset: new Date().toISOString(),
  settings: {
    notifications: true,
    hapticFeedback: true,
    theme: 'dark',
  },
});

export const saveState = async (state: AppState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const loadState = async (): Promise<AppState | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as AppState;
    }
    return null;
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
};

export const clearState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state:', e);
  }
};

// --- Leveling calculations ---
export const getExpToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

export const getRankForLevel = (level: number): PlayerRank => {
  const ranks: PlayerRank[] = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E'];
  for (const rank of ranks) {
    if (level >= RANK_THRESHOLDS[rank]) {
      return rank;
    }
  }
  return 'E';
};

export const getTitleForRank = (rank: PlayerRank): string => {
  const titles: Record<PlayerRank, string> = {
    'E': 'E-Rank Hunter',
    'D': 'D-Rank Hunter',
    'C': 'C-Rank Hunter',
    'B': 'B-Rank Hunter',
    'A': 'A-Rank Hunter',
    'S': 'S-Rank Hunter',
    'SS': 'National Level Hunter',
    'SSS': 'Shadow Monarch',
  };
  return titles[rank];
};

export const calculateMaxHp = (vitality: number, level: number): number => {
  return 100 + (vitality * 5) + (level * 10);
};

export const calculateMaxMp = (intelligence: number, level: number): number => {
  return 50 + (intelligence * 3) + (level * 5);
};

export const calculateAttackPower = (strength: number, weaponBonus: number = 0): number => {
  return 10 + (strength * 2) + weaponBonus;
};

export const calculateDefense = (vitality: number, armorBonus: number = 0): number => {
  return 5 + vitality + armorBonus;
};

export const calculateSpeed = (agility: number): number => {
  return 5 + Math.floor(agility * 0.8);
};

export const calculateCritRate = (sense: number, agility: number): number => {
  return Math.min(0.5, 0.05 + (sense * 0.005) + (agility * 0.003));
};

export const calculateDodgeRate = (agility: number): number => {
  return Math.min(0.4, 0.02 + (agility * 0.004));
};
