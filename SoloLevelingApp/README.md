# IRL Solo Leveling App ⚔️

A personal development RPG app inspired by Solo Leveling. Complete real-world quests, level up your character, allocate stat points, and battle through dungeons in a 2D side-scroller game mode.

## Features

### 🎯 Goal-Aligned Quest System
- **Set personal goals** (fitness, learning, career, health, creative, financial, social)
- **Auto-generated daily quests** aligned to your active goals
- **Custom quests** — create your own with custom targets and rewards
- **Emergency quests** with penalties for skipping (Solo Leveling style)
- **Multiple verification types**: self-report, timer, counter

### 👤 Character & Stats
- **5 Core Stats**: Strength, Agility, Vitality, Intelligence, Sense
- **Rank System**: E → D → C → B → A → S → SS → SSS
- **Derived Combat Stats**: Attack, Defense, Speed, Crit Rate, Dodge Rate
- **Stat point allocation** from leveling and quest completion

### ⚔️ 2D Side-Scroller Dungeons
- **9 unique dungeons** from E-Rank to S-Rank
- **Boss fights** with unique mechanics
- **Wave-based combat** with real-time controls
- **Skill-based gameplay** — equip up to 4 active skills
- **Loot drops** with rarity system (Common → Mythic)

### 🎒 Equipment & Inventory
- **Weapons, Armor, Accessories** with stat bonuses
- **Consumables** (HP/MP potions, stat elixirs)
- **6 rarity tiers** with color-coded items

### ✨ Skill Tree
- **20+ skills** across 6 elements (Physical, Fire, Ice, Lightning, Shadow, Holy)
- **Active & Passive skills**
- **Unlock via level, stat requirements, or quest completion**
- **Equip 4 active skills** for dungeon combat

### 📊 Progression
- **EXP & Gold** from quests and dungeons
- **Quest streaks** reward consistency
- **Milestone rewards** for goals
- **Story quests** that unlock at key levels

## Tech Stack

- **Expo / React Native** (TypeScript)
- **React Navigation v7** (tabs + native stack)
- **AsyncStorage** for local persistence
- **HTML5 Canvas** (via WebView) for the 2D game engine

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- For iPhone: Expo Go app from App Store

### Install & Run

```bash
cd SoloLevelingApp
npm install

# Start dev server
npx expo start

# Scan QR code with Expo Go on your iPhone
# Or press 'i' for iOS simulator (macOS only)
```

### Build for iPhone

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

## Project Structure

```
src/
├── types/index.ts          # TypeScript interfaces
├── data/
│   ├── skills.ts           # 20+ skill definitions
│   ├── items.ts            # Item/artifact templates
│   ├── enemies.ts          # Enemy & boss templates
│   ├── dungeons.ts         # 9 dungeon stages
│   └── questTemplates.ts   # Daily/story/emergency quests
├── store/
│   ├── storage.ts          # AsyncStorage persistence
│   └── GameContext.tsx      # Global state management
├── game/
│   └── gameHTML.ts          # HTML5 Canvas game engine
├── screens/
│   ├── OnboardingScreen.tsx # "Arise" intro sequence
│   ├── StatusScreen.tsx     # Character status window
│   ├── QuestsScreen.tsx     # Quest log & custom quests
│   ├── GoalsScreen.tsx      # Goal setting & milestones
│   ├── InventoryScreen.tsx  # Equipment & items
│   ├── SkillsScreen.tsx     # Skill tree
│   ├── DungeonSelectScreen.tsx # Dungeon gate
│   └── GameScreen.tsx       # 2D side-scroller
├── navigation/
│   └── AppNavigator.tsx     # Tab + Stack navigation
├── utils/
│   └── id.ts               # ID generator
└── theme.ts                 # Colors, fonts, spacing
```

## How It Works

1. **Set Goals** → Define what you're working towards in real life
2. **Complete Quests** → Daily quests generated based on your goals
3. **Earn Rewards** → Gain EXP, Gold, and Stat Points
4. **Level Up** → Allocate stat points to your character
5. **Enter Dungeons** → Test your character in 2D combat
6. **Collect Loot** → Equip weapons, armor, and accessories
7. **Unlock Skills** → Learn new abilities through progression
8. **Push Forward** → Clear harder dungeons as you get stronger

## Solo Leveling Mechanics

- **Rank System** mirrors the hunter ranking
- **Emergency Quests** with penalties for failure
- **Shadow-themed skills** (Shadow Step, Shadow Extraction, Ruler's Authority, Domain of the Monarch)
- **"Arise" onboarding** sequence
- **Dark blue/purple UI** theme matching the manhwa aesthetic
