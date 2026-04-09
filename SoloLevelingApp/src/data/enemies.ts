import { Enemy } from '../types';

export const ENEMY_TEMPLATES: Omit<Enemy, 'hp'>[] = [
  // --- E-Rank Enemies ---
  {
    id: 'enemy_goblin',
    name: 'Goblin',
    icon: '👺',
    maxHp: 30,
    attack: 5,
    defense: 2,
    speed: 3,
    exp: 10,
    gold: 5,
    skills: [{ name: 'Scratch', damage: 5, chance: 1.0 }],
    dropTable: [
      { itemTemplateId: 'con_hp_potion_small', chance: 0.3 },
      { itemTemplateId: 'wpn_rusty_sword', chance: 0.05 },
    ],
  },
  {
    id: 'enemy_slime',
    name: 'Blue Slime',
    icon: '🫧',
    maxHp: 20,
    attack: 3,
    defense: 1,
    speed: 1,
    exp: 5,
    gold: 3,
    skills: [{ name: 'Bounce', damage: 3, chance: 1.0 }],
    dropTable: [
      { itemTemplateId: 'con_hp_potion_small', chance: 0.4 },
    ],
  },
  {
    id: 'enemy_wolf',
    name: 'Shadow Wolf',
    icon: '🐺',
    maxHp: 40,
    attack: 8,
    defense: 3,
    speed: 5,
    exp: 15,
    gold: 8,
    skills: [
      { name: 'Bite', damage: 8, chance: 0.7 },
      { name: 'Lunge', damage: 12, chance: 0.3 },
    ],
    dropTable: [
      { itemTemplateId: 'con_hp_potion_small', chance: 0.2 },
      { itemTemplateId: 'acc_wooden_ring', chance: 0.05 },
    ],
  },

  // --- D-Rank Enemies ---
  {
    id: 'enemy_skeleton',
    name: 'Skeleton Soldier',
    icon: '💀',
    maxHp: 60,
    attack: 12,
    defense: 8,
    speed: 3,
    exp: 25,
    gold: 15,
    skills: [
      { name: 'Slash', damage: 12, chance: 0.7 },
      { name: 'Shield Bash', damage: 8, chance: 0.3 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_iron_blade', chance: 0.08 },
      { itemTemplateId: 'arm_leather_vest', chance: 0.1 },
      { itemTemplateId: 'con_hp_potion_small', chance: 0.3 },
    ],
  },
  {
    id: 'enemy_spider',
    name: 'Giant Spider',
    icon: '🕷️',
    maxHp: 50,
    attack: 15,
    defense: 5,
    speed: 6,
    exp: 30,
    gold: 12,
    skills: [
      { name: 'Poison Bite', damage: 15, chance: 0.6 },
      { name: 'Web Shot', damage: 8, chance: 0.4 },
    ],
    dropTable: [
      { itemTemplateId: 'con_mp_potion_small', chance: 0.25 },
      { itemTemplateId: 'acc_hunters_necklace', chance: 0.05 },
    ],
  },

  // --- C-Rank Enemies ---
  {
    id: 'enemy_orc',
    name: 'Orc Warrior',
    icon: '👹',
    maxHp: 120,
    attack: 22,
    defense: 15,
    speed: 3,
    exp: 50,
    gold: 30,
    skills: [
      { name: 'Cleave', damage: 22, chance: 0.6 },
      { name: 'War Cry', damage: 15, chance: 0.2 },
      { name: 'Smash', damage: 30, chance: 0.2 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_iron_blade', chance: 0.15 },
      { itemTemplateId: 'arm_chainmail', chance: 0.1 },
      { itemTemplateId: 'con_hp_potion_medium', chance: 0.2 },
    ],
  },
  {
    id: 'enemy_mage',
    name: 'Dark Mage',
    icon: '🧙',
    maxHp: 80,
    attack: 30,
    defense: 8,
    speed: 4,
    exp: 55,
    gold: 35,
    skills: [
      { name: 'Dark Bolt', damage: 30, chance: 0.5 },
      { name: 'Curse', damage: 20, chance: 0.3 },
      { name: 'Dark Explosion', damage: 40, chance: 0.2 },
    ],
    dropTable: [
      { itemTemplateId: 'arm_shadow_robe', chance: 0.08 },
      { itemTemplateId: 'con_mp_potion_small', chance: 0.3 },
    ],
  },

  // --- B-Rank Enemies ---
  {
    id: 'enemy_ice_bear',
    name: 'Ice Bear',
    icon: '🐻‍❄️',
    maxHp: 200,
    attack: 35,
    defense: 25,
    speed: 4,
    exp: 80,
    gold: 50,
    skills: [
      { name: 'Frost Claw', damage: 35, chance: 0.5 },
      { name: 'Ice Breath', damage: 45, chance: 0.3 },
      { name: 'Blizzard Rage', damage: 55, chance: 0.2 },
    ],
    dropTable: [
      { itemTemplateId: 'arm_knights_plate', chance: 0.1 },
      { itemTemplateId: 'acc_ring_of_vitality', chance: 0.08 },
      { itemTemplateId: 'con_hp_potion_medium', chance: 0.3 },
    ],
  },
  {
    id: 'enemy_naga',
    name: 'Naga Siren',
    icon: '🐍',
    maxHp: 160,
    attack: 40,
    defense: 18,
    speed: 7,
    exp: 85,
    gold: 55,
    skills: [
      { name: 'Venom Strike', damage: 40, chance: 0.5 },
      { name: 'Tail Sweep', damage: 30, chance: 0.3 },
      { name: 'Petrify Gaze', damage: 50, chance: 0.2 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_shadow_dagger', chance: 0.1 },
      { itemTemplateId: 'acc_orb_of_avarice', chance: 0.05 },
    ],
  },

  // --- A-Rank Enemies ---
  {
    id: 'enemy_demon',
    name: 'Arch Demon',
    icon: '😈',
    maxHp: 350,
    attack: 55,
    defense: 35,
    speed: 6,
    exp: 150,
    gold: 100,
    skills: [
      { name: 'Hell Fire', damage: 55, chance: 0.4 },
      { name: 'Dark Slash', damage: 45, chance: 0.3 },
      { name: 'Soul Drain', damage: 70, chance: 0.2 },
      { name: 'Demonic Explosion', damage: 90, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_demon_slayer', chance: 0.08 },
      { itemTemplateId: 'arm_demon_king_armor', chance: 0.05 },
      { itemTemplateId: 'con_elixir', chance: 0.03 },
    ],
  },

  // --- S-Rank Enemies ---
  {
    id: 'enemy_dragon',
    name: 'Shadow Dragon',
    icon: '🐉',
    maxHp: 600,
    attack: 80,
    defense: 50,
    speed: 8,
    exp: 300,
    gold: 200,
    skills: [
      { name: 'Dragon Breath', damage: 80, chance: 0.3 },
      { name: 'Tail Slam', damage: 60, chance: 0.3 },
      { name: 'Shadow Flame', damage: 100, chance: 0.2 },
      { name: 'Apocalypse', damage: 150, chance: 0.1 },
      { name: 'Wing Gust', damage: 50, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_kamish_wrath', chance: 0.03 },
      { itemTemplateId: 'arm_shadow_monarch_armor', chance: 0.03 },
      { itemTemplateId: 'acc_black_heart', chance: 0.05 },
      { itemTemplateId: 'con_elixir', chance: 0.1 },
    ],
  },

  // --- BOSSES ---
  {
    id: 'boss_goblin_king',
    name: 'Goblin King',
    icon: '👑',
    maxHp: 100,
    attack: 15,
    defense: 8,
    speed: 4,
    exp: 50,
    gold: 30,
    skills: [
      { name: 'Royal Slash', damage: 15, chance: 0.5 },
      { name: 'Summon Goblins', damage: 8, chance: 0.3 },
      { name: 'Kings Fury', damage: 25, chance: 0.2 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_iron_blade', chance: 0.5 },
      { itemTemplateId: 'arm_leather_vest', chance: 0.3 },
    ],
  },
  {
    id: 'boss_spider_queen',
    name: 'Spider Queen',
    icon: '🕸️',
    maxHp: 180,
    attack: 25,
    defense: 12,
    speed: 5,
    exp: 100,
    gold: 60,
    skills: [
      { name: 'Venom Spray', damage: 25, chance: 0.4 },
      { name: 'Web Trap', damage: 15, chance: 0.3 },
      { name: 'Spawn Spiderlings', damage: 10, chance: 0.2 },
      { name: 'Lethal Bite', damage: 40, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_shadow_dagger', chance: 0.3 },
      { itemTemplateId: 'acc_hunters_necklace', chance: 0.4 },
    ],
  },
  {
    id: 'boss_orc_chieftain',
    name: 'Orc Chieftain',
    icon: '⚔️',
    maxHp: 300,
    attack: 40,
    defense: 25,
    speed: 4,
    exp: 180,
    gold: 100,
    skills: [
      { name: 'Brutal Smash', damage: 40, chance: 0.4 },
      { name: 'Battle Roar', damage: 20, chance: 0.3 },
      { name: 'Earthquake', damage: 50, chance: 0.2 },
      { name: 'Berserker Strike', damage: 70, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_knights_longsword', chance: 0.3 },
      { itemTemplateId: 'arm_chainmail', chance: 0.4 },
    ],
  },
  {
    id: 'boss_ice_monarch',
    name: 'Ice Monarch',
    icon: '❄️',
    maxHp: 500,
    attack: 55,
    defense: 40,
    speed: 5,
    exp: 300,
    gold: 180,
    skills: [
      { name: 'Absolute Zero', damage: 55, chance: 0.3 },
      { name: 'Ice Prison', damage: 35, chance: 0.3 },
      { name: 'Glacial Storm', damage: 70, chance: 0.2 },
      { name: 'Frozen Throne', damage: 90, chance: 0.1 },
      { name: 'Frost Nova', damage: 45, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'arm_knights_plate', chance: 0.4 },
      { itemTemplateId: 'acc_ring_of_vitality', chance: 0.3 },
    ],
  },
  {
    id: 'boss_demon_lord',
    name: 'Demon Lord Baran',
    icon: '👿',
    maxHp: 800,
    attack: 75,
    defense: 50,
    speed: 7,
    exp: 500,
    gold: 300,
    skills: [
      { name: 'Hellfire Slash', damage: 75, chance: 0.3 },
      { name: 'Dark Reign', damage: 50, chance: 0.25 },
      { name: 'Soul Harvest', damage: 90, chance: 0.2 },
      { name: 'Inferno', damage: 120, chance: 0.15 },
      { name: 'Demon King Awakening', damage: 150, chance: 0.1 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_demon_slayer', chance: 0.4 },
      { itemTemplateId: 'arm_demon_king_armor', chance: 0.3 },
      { itemTemplateId: 'acc_orb_of_avarice', chance: 0.3 },
    ],
  },
  {
    id: 'boss_shadow_monarch',
    name: 'Shadow Monarch (Echo)',
    icon: '👤',
    maxHp: 1500,
    attack: 100,
    defense: 70,
    speed: 10,
    exp: 1000,
    gold: 500,
    skills: [
      { name: "Ruler's Authority", damage: 100, chance: 0.25 },
      { name: 'Shadow Exchange', damage: 80, chance: 0.25 },
      { name: 'Domain Expansion', damage: 130, chance: 0.2 },
      { name: 'Arise', damage: 60, chance: 0.15 },
      { name: 'Monarch Obliteration', damage: 200, chance: 0.15 },
    ],
    dropTable: [
      { itemTemplateId: 'wpn_sword_of_shadows', chance: 0.3 },
      { itemTemplateId: 'arm_shadow_monarch_armor', chance: 0.3 },
      { itemTemplateId: 'acc_black_heart', chance: 0.3 },
      { itemTemplateId: 'wpn_kamish_wrath', chance: 0.1 },
    ],
  },
];

export const getEnemyTemplate = (id: string) =>
  ENEMY_TEMPLATES.find(e => e.id === id);

export const createEnemy = (templateId: string): Enemy | null => {
  const template = getEnemyTemplate(templateId);
  if (!template) return null;
  return { ...template, hp: template.maxHp };
};
