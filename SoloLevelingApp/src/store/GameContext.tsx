import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  AppState, Player, Quest, Goal, QuestStatus, QuestRewards,
  PlayerStats, StatKey, Item, Milestone, GoalCategory,
} from '../types';
import {
  createDefaultState, saveState, loadState, getExpToNextLevel,
  getRankForLevel, getTitleForRank, calculateMaxHp, calculateMaxMp,
} from './storage';
import { createItemFromTemplate } from '../data/items';
import { generateDailyQuests, STORY_QUEST_TEMPLATES } from '../data/questTemplates';
import { generateId } from '../utils/id';

// --- Actions ---
type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'GAIN_EXP'; payload: number }
  | { type: 'GAIN_GOLD'; payload: number }
  | { type: 'ALLOCATE_STAT'; payload: StatKey }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'FAIL_QUEST'; payload: string }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { questId: string; reqIndex: number; value: number } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'COMPLETE_MILESTONE'; payload: { goalId: string; milestoneId: string } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: Item }
  | { type: 'UNEQUIP_ITEM'; payload: 'weapon' | 'armor' | 'accessory' }
  | { type: 'EQUIP_SKILL'; payload: { skillId: string; slot: number } }
  | { type: 'UNLOCK_SKILL'; payload: string }
  | { type: 'COMPLETE_DUNGEON'; payload: { dungeonId: string; rewards: QuestRewards; drops: Item[] } }
  | { type: 'TAKE_DAMAGE'; payload: number }
  | { type: 'HEAL'; payload: number }
  | { type: 'RESTORE_MP'; payload: number }
  | { type: 'GENERATE_DAILY_QUESTS'; payload: GoalCategory[] }
  | { type: 'RESET_STATE'; payload: string };

// --- Reducer ---
const gameReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'SET_PLAYER_NAME':
      return {
        ...state,
        player: { ...state.player, name: action.payload },
      };

    case 'GAIN_EXP': {
      let player = { ...state.player };
      player.exp += action.payload;
      
      while (player.exp >= player.expToNext) {
        player.exp -= player.expToNext;
        player.level += 1;
        player.availableStatPoints += 5;
        player.expToNext = getExpToNextLevel(player.level);
        
        const newRank = getRankForLevel(player.level);
        if (newRank !== player.rank) {
          player.rank = newRank;
          player.title = getTitleForRank(newRank);
        }
      }
      
      player.maxHp = calculateMaxHp(player.stats.vitality, player.level);
      player.maxMp = calculateMaxMp(player.stats.intelligence, player.level);
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      
      return { ...state, player };
    }

    case 'GAIN_GOLD':
      return {
        ...state,
        player: { ...state.player, gold: state.player.gold + action.payload },
      };

    case 'ALLOCATE_STAT': {
      if (state.player.availableStatPoints <= 0) return state;
      const player = { ...state.player };
      player.stats = { ...player.stats };
      player.stats[action.payload] += 1;
      player.availableStatPoints -= 1;
      player.maxHp = calculateMaxHp(player.stats.vitality, player.level);
      player.maxMp = calculateMaxMp(player.stats.intelligence, player.level);
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      return { ...state, player };
    }

    case 'COMPLETE_QUEST': {
      const questIndex = state.quests.findIndex(q => q.id === action.payload);
      if (questIndex === -1) return state;
      
      const quest = state.quests[questIndex];
      const updatedQuests = [...state.quests];
      updatedQuests[questIndex] = {
        ...quest,
        status: 'completed' as QuestStatus,
        completedAt: new Date().toISOString(),
      };

      let player = { ...state.player };
      player.exp += quest.rewards.exp;
      player.gold += quest.rewards.gold;
      player.availableStatPoints += quest.rewards.statPoints;
      player.totalQuestsCompleted += 1;

      // Level up check
      while (player.exp >= player.expToNext) {
        player.exp -= player.expToNext;
        player.level += 1;
        player.availableStatPoints += 5;
        player.expToNext = getExpToNextLevel(player.level);
        const newRank = getRankForLevel(player.level);
        if (newRank !== player.rank) {
          player.rank = newRank;
          player.title = getTitleForRank(newRank);
        }
      }

      // Unlock skill from quest reward
      if (quest.rewards.skillUnlockId && !player.unlockedSkillIds.includes(quest.rewards.skillUnlockId)) {
        player.unlockedSkillIds = [...player.unlockedSkillIds, quest.rewards.skillUnlockId];
      }

      // Add item rewards
      if (quest.rewards.items) {
        const newItems = quest.rewards.items
          .map(templateId => createItemFromTemplate(templateId))
          .filter(Boolean) as Item[];
        player.inventory = [...player.inventory, ...newItems];
      }

      player.maxHp = calculateMaxHp(player.stats.vitality, player.level);
      player.maxMp = calculateMaxMp(player.stats.intelligence, player.level);
      player.hp = player.maxHp;
      player.mp = player.maxMp;

      return { ...state, quests: updatedQuests, player };
    }

    case 'FAIL_QUEST': {
      const qi = state.quests.findIndex(q => q.id === action.payload);
      if (qi === -1) return state;
      const quest = state.quests[qi];
      const uq = [...state.quests];
      uq[qi] = { ...quest, status: 'failed' as QuestStatus };

      let player = { ...state.player };
      if (quest.penalty?.statLoss) {
        player.stats = { ...player.stats };
        for (const [key, val] of Object.entries(quest.penalty.statLoss)) {
          const sk = key as StatKey;
          player.stats[sk] = Math.max(1, player.stats[sk] - (val || 0));
        }
      }

      return { ...state, quests: uq, player };
    }

    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, action.payload] };

    case 'UPDATE_QUEST_PROGRESS': {
      const { questId, reqIndex, value } = action.payload;
      const idx = state.quests.findIndex(q => q.id === questId);
      if (idx === -1) return state;
      
      const updatedQuests = [...state.quests];
      const quest = { ...updatedQuests[idx] };
      quest.requirements = [...quest.requirements];
      quest.requirements[reqIndex] = {
        ...quest.requirements[reqIndex],
        currentValue: Math.min(value, quest.requirements[reqIndex].targetValue),
      };

      // Check if quest is auto-completable
      const allComplete = quest.requirements.every(r => r.currentValue >= r.targetValue);
      if (allComplete) {
        quest.status = 'completed';
        quest.completedAt = new Date().toISOString();
      }

      updatedQuests[idx] = quest;
      return { ...state, quests: updatedQuests };
    }

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };

    case 'COMPLETE_MILESTONE': {
      const { goalId, milestoneId } = action.payload;
      const gi = state.goals.findIndex(g => g.id === goalId);
      if (gi === -1) return state;
      
      const updatedGoals = [...state.goals];
      const goal = { ...updatedGoals[gi] };
      goal.milestones = goal.milestones.map(m =>
        m.id === milestoneId ? { ...m, isCompleted: true, completedAt: new Date().toISOString() } : m
      );

      const completedMilestone = goal.milestones.find(m => m.id === milestoneId);
      let player = { ...state.player };
      if (completedMilestone) {
        player.exp += completedMilestone.rewardExp;
        player.availableStatPoints += completedMilestone.rewardStatPoints;
        while (player.exp >= player.expToNext) {
          player.exp -= player.expToNext;
          player.level += 1;
          player.availableStatPoints += 5;
          player.expToNext = getExpToNextLevel(player.level);
          const newRank = getRankForLevel(player.level);
          if (newRank !== player.rank) {
            player.rank = newRank;
            player.title = getTitleForRank(newRank);
          }
        }
        player.maxHp = calculateMaxHp(player.stats.vitality, player.level);
        player.maxMp = calculateMaxMp(player.stats.intelligence, player.level);
        player.hp = player.maxHp;
        player.mp = player.maxMp;
      }

      if (goal.milestones.every(m => m.isCompleted)) {
        goal.completedAt = new Date().toISOString();
        goal.isActive = false;
      }

      updatedGoals[gi] = goal;
      return { ...state, goals: updatedGoals, player };
    }

    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };

    case 'ADD_ITEM':
      return {
        ...state,
        player: { ...state.player, inventory: [...state.player.inventory, action.payload] },
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(i => i.id !== action.payload),
        },
      };

    case 'EQUIP_ITEM': {
      const item = action.payload;
      const player = { ...state.player };
      
      // Unequip current item of same type and put it back in inventory
      if (item.type === 'weapon' && player.equippedWeapon) {
        player.inventory = [...player.inventory, player.equippedWeapon];
      } else if (item.type === 'armor' && player.equippedArmor) {
        player.inventory = [...player.inventory, player.equippedArmor];
      } else if (item.type === 'accessory' && player.equippedAccessory) {
        player.inventory = [...player.inventory, player.equippedAccessory];
      }

      // Equip new item and remove from inventory
      if (item.type === 'weapon') player.equippedWeapon = item;
      else if (item.type === 'armor') player.equippedArmor = item;
      else if (item.type === 'accessory') player.equippedAccessory = item;
      
      player.inventory = player.inventory.filter(i => i.id !== item.id);
      return { ...state, player };
    }

    case 'UNEQUIP_ITEM': {
      const player = { ...state.player };
      const slot = action.payload;
      if (slot === 'weapon' && player.equippedWeapon) {
        player.inventory = [...player.inventory, player.equippedWeapon];
        player.equippedWeapon = null;
      } else if (slot === 'armor' && player.equippedArmor) {
        player.inventory = [...player.inventory, player.equippedArmor];
        player.equippedArmor = null;
      } else if (slot === 'accessory' && player.equippedAccessory) {
        player.inventory = [...player.inventory, player.equippedAccessory];
        player.equippedAccessory = null;
      }
      return { ...state, player };
    }

    case 'EQUIP_SKILL': {
      const { skillId, slot } = action.payload;
      const player = { ...state.player };
      player.equippedSkills = [...player.equippedSkills];
      if (slot < 4) {
        player.equippedSkills[slot] = skillId;
      }
      return { ...state, player };
    }

    case 'UNLOCK_SKILL': {
      const player = { ...state.player };
      if (!player.unlockedSkillIds.includes(action.payload)) {
        player.unlockedSkillIds = [...player.unlockedSkillIds, action.payload];
      }
      return { ...state, player };
    }

    case 'COMPLETE_DUNGEON': {
      const { dungeonId, rewards, drops } = action.payload;
      let player = { ...state.player };
      
      player.exp += rewards.exp;
      player.gold += rewards.gold;
      player.availableStatPoints += rewards.statPoints;
      
      if (!player.completedDungeonIds.includes(dungeonId)) {
        player.completedDungeonIds = [...player.completedDungeonIds, dungeonId];
        player.currentDungeonProgress = Math.max(
          player.currentDungeonProgress,
          player.completedDungeonIds.length
        );
      }

      if (rewards.skillUnlockId && !player.unlockedSkillIds.includes(rewards.skillUnlockId)) {
        player.unlockedSkillIds = [...player.unlockedSkillIds, rewards.skillUnlockId];
      }

      player.inventory = [...player.inventory, ...drops];

      while (player.exp >= player.expToNext) {
        player.exp -= player.expToNext;
        player.level += 1;
        player.availableStatPoints += 5;
        player.expToNext = getExpToNextLevel(player.level);
        const newRank = getRankForLevel(player.level);
        if (newRank !== player.rank) {
          player.rank = newRank;
          player.title = getTitleForRank(newRank);
        }
      }

      player.maxHp = calculateMaxHp(player.stats.vitality, player.level);
      player.maxMp = calculateMaxMp(player.stats.intelligence, player.level);
      player.hp = player.maxHp;
      player.mp = player.maxMp;

      return { ...state, player };
    }

    case 'TAKE_DAMAGE': {
      const player = { ...state.player };
      player.hp = Math.max(0, player.hp - action.payload);
      return { ...state, player };
    }

    case 'HEAL': {
      const player = { ...state.player };
      player.hp = Math.min(player.maxHp, player.hp + action.payload);
      return { ...state, player };
    }

    case 'RESTORE_MP': {
      const player = { ...state.player };
      player.mp = Math.min(player.maxMp, player.mp + action.payload);
      return { ...state, player };
    }

    case 'GENERATE_DAILY_QUESTS': {
      const categories = action.payload;
      const templates = generateDailyQuests(categories, 4);
      const today = new Date().toISOString().split('T')[0];
      
      // Remove old daily quests
      const nonDailyQuests = state.quests.filter(q => q.type !== 'daily' || q.status === 'completed');
      
      const newQuests: Quest[] = templates.map(t => ({
        id: generateId(),
        templateId: t.id,
        title: t.title,
        description: t.description,
        type: t.type,
        status: 'active' as QuestStatus,
        verificationType: t.verificationType,
        requirements: t.requirements.map(r => ({ ...r, currentValue: 0 })),
        rewards: t.rewards,
        deadline: today + 'T23:59:59.000Z',
        createdAt: new Date().toISOString(),
        penalty: t.penalty,
      }));

      return {
        ...state,
        quests: [...nonDailyQuests, ...newQuests],
        lastDailyReset: new Date().toISOString(),
      };
    }

    case 'RESET_STATE':
      return createDefaultState(action.payload);

    default:
      return state;
  }
};

// --- Context ---
interface GameContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, createDefaultState());
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const load = async () => {
      const saved = await loadState();
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: saved });
      }
      setIsLoading(false);
    };
    load();
  }, []);

  // Auto-save on state changes
  useEffect(() => {
    if (!isLoading) {
      saveState(state);
    }
  }, [state, isLoading]);

  // Check for daily reset
  useEffect(() => {
    if (!isLoading) {
      const lastReset = new Date(state.lastDailyReset).toDateString();
      const today = new Date().toDateString();
      if (lastReset !== today) {
        const activeCategories = state.goals
          .filter(g => g.isActive)
          .map(g => g.category);
        dispatch({ type: 'GENERATE_DAILY_QUESTS', payload: activeCategories });
      }
    }
  }, [isLoading]);

  return (
    <GameContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
