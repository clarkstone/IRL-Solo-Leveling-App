export const COLORS = {
  // Primary palette - Solo Leveling dark blue/purple theme
  background: '#06080f',
  backgroundAlt: '#0a0e1a',
  surface: '#0f1320',
  surfaceLight: '#161c2e',
  surfaceLighter: '#1e2740',
  surfaceBright: '#283350',

  // Accent colors
  primary: '#7c3aed',       // Purple (Solo Leveling violet)
  primaryLight: '#a78bfa',
  primaryDark: '#5b21b6',
  primaryMuted: '#4c1d95',
  secondary: '#06b6d4',     // Cyan
  secondaryLight: '#22d3ee',
  accent: '#8b5cf6',

  // Status colors
  success: '#10b981',
  successDark: '#065f46',
  warning: '#f59e0b',
  warningDark: '#78350f',
  danger: '#ef4444',
  dangerDark: '#7f1d1d',
  info: '#3b82f6',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#4b5563',
  textAccent: '#a78bfa',
  textGold: '#fbbf24',

  // Borders
  border: '#1a1f30',
  borderLight: '#2a3348',
  borderAccent: 'rgba(139,92,246,0.25)',
  borderGlow: 'rgba(139,92,246,0.4)',

  // Special
  gold: '#fbbf24',
  goldDark: '#92400e',
  exp: '#a78bfa',
  hp: '#ef4444',
  hpBar: '#dc2626',
  mp: '#6366f1',
  mpBar: '#4f46e5',
  shadow: '#7c3aed',
  shadowGlow: 'rgba(124,58,237,0.3)',

  // Rarity glow
  rarityCommon: '#9e9e9e',
  rarityUncommon: '#4caf50',
  rarityRare: '#2196f3',
  rarityEpic: '#9c27b0',
  rarityLegendary: '#ff9800',
  rarityMythic: '#00e5ff',

  // Stat colors
  strength: '#ef4444',
  agility: '#22c55e',
  vitality: '#f59e0b',
  intelligence: '#6366f1',
  sense: '#a855f7',

  // Rank glow colors
  rankE: '#6b7280',
  rankD: '#22c55e',
  rankC: '#3b82f6',
  rankB: '#a855f7',
  rankA: '#f97316',
  rankS: '#ef4444',
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    title: 32,
    hero: 40,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const STAT_COLOR_MAP: Record<string, string> = {
  strength: COLORS.strength,
  agility: COLORS.agility,
  vitality: COLORS.vitality,
  intelligence: COLORS.intelligence,
  sense: COLORS.sense,
};
