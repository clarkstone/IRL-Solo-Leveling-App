import { Item, ItemRarity, ItemType, ItemStatBonus } from '../types';
import { generateId } from '../utils/id';

export interface ItemTemplate {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  statBonus: ItemStatBonus;
  value: number;
}

export const ITEM_TEMPLATES: ItemTemplate[] = [
  // --- Weapons ---
  {
    id: 'wpn_rusty_sword',
    name: 'Rusty Sword',
    description: 'A worn blade, but still sharp enough to cut.',
    type: 'weapon',
    rarity: 'Common',
    icon: '🗡️',
    statBonus: { attackPower: 5, strength: 2 },
    value: 10,
  },
  {
    id: 'wpn_iron_blade',
    name: 'Iron Blade',
    description: 'A sturdy iron sword forged by a novice blacksmith.',
    type: 'weapon',
    rarity: 'Uncommon',
    icon: '⚔️',
    statBonus: { attackPower: 12, strength: 5 },
    value: 50,
  },
  {
    id: 'wpn_shadow_dagger',
    name: 'Shadow Dagger',
    description: 'A dagger infused with shadow energy. Strikes from darkness.',
    type: 'weapon',
    rarity: 'Rare',
    icon: '🔪',
    statBonus: { attackPower: 20, agility: 10, strength: 5 },
    value: 200,
  },
  {
    id: 'wpn_knights_longsword',
    name: "Knight's Longsword",
    description: 'A finely crafted longsword used by elite knights.',
    type: 'weapon',
    rarity: 'Rare',
    icon: '⚔️',
    statBonus: { attackPower: 25, strength: 8, vitality: 5 },
    value: 300,
  },
  {
    id: 'wpn_demon_slayer',
    name: 'Demon Slayer',
    description: 'A legendary blade forged to slay demons. Burns with holy fire.',
    type: 'weapon',
    rarity: 'Epic',
    icon: '🔥',
    statBonus: { attackPower: 40, strength: 15, intelligence: 10 },
    value: 800,
  },
  {
    id: 'wpn_baruka_dagger',
    name: "Baruka's Dagger",
    description: 'The cursed dagger of the assassin Baruka.',
    type: 'weapon',
    rarity: 'Epic',
    icon: '🗡️',
    statBonus: { attackPower: 35, agility: 20, sense: 10 },
    value: 750,
  },
  {
    id: 'wpn_sword_of_shadows',
    name: 'Sword of Shadows',
    description: 'A blade that absorbs light. The signature weapon of the Shadow Monarch.',
    type: 'weapon',
    rarity: 'Legendary',
    icon: '⚫',
    statBonus: { attackPower: 65, strength: 25, agility: 15, intelligence: 10 },
    value: 2000,
  },
  {
    id: 'wpn_kamish_wrath',
    name: "Kamish's Wrath",
    description: 'Forged from the fang of the dragon Kamish. Unmatched power.',
    type: 'weapon',
    rarity: 'Mythic',
    icon: '🐉',
    statBonus: { attackPower: 100, strength: 40, agility: 20, intelligence: 20, sense: 10 },
    value: 5000,
  },

  // --- Armor ---
  {
    id: 'arm_leather_vest',
    name: 'Leather Vest',
    description: 'Basic leather protection.',
    type: 'armor',
    rarity: 'Common',
    icon: '🦺',
    statBonus: { defense: 5, vitality: 2 },
    value: 10,
  },
  {
    id: 'arm_chainmail',
    name: 'Chainmail',
    description: 'Interlocking metal rings provide decent protection.',
    type: 'armor',
    rarity: 'Uncommon',
    icon: '🛡️',
    statBonus: { defense: 12, vitality: 5, hp: 20 },
    value: 60,
  },
  {
    id: 'arm_shadow_robe',
    name: 'Shadow Robe',
    description: 'A robe woven from shadows. Enhances magical abilities.',
    type: 'armor',
    rarity: 'Rare',
    icon: '🧥',
    statBonus: { defense: 15, intelligence: 12, mp: 30 },
    value: 250,
  },
  {
    id: 'arm_knights_plate',
    name: "Knight's Plate Armor",
    description: 'Heavy plate armor offering excellent protection.',
    type: 'armor',
    rarity: 'Rare',
    icon: '🛡️',
    statBonus: { defense: 25, vitality: 10, hp: 50 },
    value: 350,
  },
  {
    id: 'arm_demon_king_armor',
    name: "Demon King's Armor",
    description: 'Armor infused with demonic energy. Nearly indestructible.',
    type: 'armor',
    rarity: 'Epic',
    icon: '👹',
    statBonus: { defense: 40, vitality: 20, hp: 100, strength: 10 },
    value: 900,
  },
  {
    id: 'arm_shadow_monarch_armor',
    name: "Shadow Monarch's Armor",
    description: 'The legendary armor of the Shadow Monarch himself.',
    type: 'armor',
    rarity: 'Legendary',
    icon: '🖤',
    statBonus: { defense: 60, vitality: 25, hp: 200, agility: 10, intelligence: 10 },
    value: 2500,
  },

  // --- Accessories ---
  {
    id: 'acc_wooden_ring',
    name: 'Wooden Ring',
    description: 'A simple carved wooden ring.',
    type: 'accessory',
    rarity: 'Common',
    icon: '💍',
    statBonus: { sense: 2, intelligence: 1 },
    value: 5,
  },
  {
    id: 'acc_hunters_necklace',
    name: "Hunter's Necklace",
    description: 'A necklace that sharpens the senses.',
    type: 'accessory',
    rarity: 'Uncommon',
    icon: '📿',
    statBonus: { sense: 8, agility: 3 },
    value: 40,
  },
  {
    id: 'acc_ring_of_vitality',
    name: 'Ring of Vitality',
    description: 'Restores HP gradually during combat.',
    type: 'accessory',
    rarity: 'Rare',
    icon: '💍',
    statBonus: { hp: 50, vitality: 10 },
    value: 200,
  },
  {
    id: 'acc_orb_of_avarice',
    name: 'Orb of Avarice',
    description: 'A mysterious orb that increases gold and exp gained.',
    type: 'accessory',
    rarity: 'Epic',
    icon: '🔮',
    statBonus: { intelligence: 15, sense: 15 },
    value: 600,
  },
  {
    id: 'acc_black_heart',
    name: 'Black Heart',
    description: "The crystallized heart of a shadow beast. Grants immense power.",
    type: 'accessory',
    rarity: 'Legendary',
    icon: '🖤',
    statBonus: { strength: 20, agility: 15, vitality: 15, intelligence: 15, sense: 15 },
    value: 3000,
  },

  // --- Consumables ---
  {
    id: 'con_hp_potion_small',
    name: 'Small HP Potion',
    description: 'Restores 30 HP.',
    type: 'consumable',
    rarity: 'Common',
    icon: '🧪',
    statBonus: { hp: 30 },
    value: 5,
  },
  {
    id: 'con_hp_potion_medium',
    name: 'Medium HP Potion',
    description: 'Restores 80 HP.',
    type: 'consumable',
    rarity: 'Uncommon',
    icon: '🧪',
    statBonus: { hp: 80 },
    value: 20,
  },
  {
    id: 'con_mp_potion_small',
    name: 'Small MP Potion',
    description: 'Restores 20 MP.',
    type: 'consumable',
    rarity: 'Common',
    icon: '💧',
    statBonus: { mp: 20 },
    value: 5,
  },
  {
    id: 'con_elixir',
    name: 'Elixir of Power',
    description: 'Permanently increases a random stat by 1.',
    type: 'consumable',
    rarity: 'Epic',
    icon: '⭐',
    statBonus: {},
    value: 500,
  },
];

export const getItemTemplate = (id: string): ItemTemplate | undefined =>
  ITEM_TEMPLATES.find(t => t.id === id);

export const createItemFromTemplate = (templateId: string): Item | null => {
  const template = getItemTemplate(templateId);
  if (!template) return null;
  
  return {
    id: generateId(),
    templateId: template.id,
    name: template.name,
    description: template.description,
    type: template.type,
    rarity: template.rarity,
    icon: template.icon,
    statBonus: { ...template.statBonus },
    value: template.value,
    quantity: 1,
  };
};
