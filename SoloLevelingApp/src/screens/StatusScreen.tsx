import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING, STAT_COLOR_MAP } from '../theme';
import { StatKey, STAT_DESCRIPTIONS, RANK_COLORS } from '../types';
import {
  calculateAttackPower, calculateDefense, calculateSpeed,
  calculateCritRate, calculateDodgeRate,
} from '../store/storage';

const { width } = Dimensions.get('window');

const StatusScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [showStatDetail, setShowStatDetail] = useState<StatKey | null>(null);

  const statKeys: StatKey[] = ['strength', 'agility', 'vitality', 'intelligence', 'sense'];

  const weaponBonus = player.equippedWeapon?.statBonus.attackPower || 0;
  const armorBonus = player.equippedArmor?.statBonus.defense || 0;

  const derivedStats = {
    attackPower: calculateAttackPower(player.stats.strength, weaponBonus),
    defense: calculateDefense(player.stats.vitality, armorBonus),
    speed: calculateSpeed(player.stats.agility),
    critRate: calculateCritRate(player.stats.sense, player.stats.agility),
    dodgeRate: calculateDodgeRate(player.stats.agility),
  };

  const expPercent = player.expToNext > 0 ? (player.exp / player.expToNext) * 100 : 0;
  const hpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;
  const mpPercent = player.maxMp > 0 ? (player.mp / player.maxMp) * 100 : 0;

  const allocateStat = (stat: StatKey) => {
    if (player.availableStatPoints > 0) {
      dispatch({ type: 'ALLOCATE_STAT', payload: stat });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Status Window Header */}
      <View style={styles.statusWindow}>
        <View style={styles.windowHeader}>
          <Text style={styles.windowTitle}>STATUS</Text>
          <View style={[styles.rankBadge, { borderColor: RANK_COLORS[player.rank] }]}>
            <Text style={[styles.rankText, { color: RANK_COLORS[player.rank] }]}>
              {player.rank}
            </Text>
          </View>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>⚔️</Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerTitle}>{player.title}</Text>
            <Text style={styles.levelText}>Lv. {player.level}</Text>
          </View>
        </View>

        {/* EXP Bar */}
        <View style={styles.barSection}>
          <View style={styles.barLabel}>
            <Text style={styles.barLabelText}>EXP</Text>
            <Text style={styles.barValueText}>{player.exp} / {player.expToNext}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, styles.expBar, { width: `${expPercent}%` }]} />
          </View>
        </View>

        {/* HP Bar */}
        <View style={styles.barSection}>
          <View style={styles.barLabel}>
            <Text style={[styles.barLabelText, { color: COLORS.hp }]}>HP</Text>
            <Text style={styles.barValueText}>{player.hp} / {player.maxHp}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, styles.hpBar, { width: `${hpPercent}%` }]} />
          </View>
        </View>

        {/* MP Bar */}
        <View style={styles.barSection}>
          <View style={styles.barLabel}>
            <Text style={[styles.barLabelText, { color: COLORS.mp }]}>MP</Text>
            <Text style={styles.barValueText}>{player.mp} / {player.maxMp}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, styles.mpBar, { width: `${mpPercent}%` }]} />
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>STATS</Text>
          {player.availableStatPoints > 0 && (
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>
                +{player.availableStatPoints} pts
              </Text>
            </View>
          )}
        </View>

        {statKeys.map(stat => (
          <View key={stat} style={styles.statRow}>
            <View style={styles.statInfo}>
              <View style={[styles.statDot, { backgroundColor: STAT_COLOR_MAP[stat] }]} />
              <Text style={styles.statName}>{stat.toUpperCase()}</Text>
              <Text style={[styles.statValue, { color: STAT_COLOR_MAP[stat] }]}>
                {player.stats[stat]}
              </Text>
            </View>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(100, (player.stats[stat] / 100) * 100)}%`, backgroundColor: STAT_COLOR_MAP[stat] },
                ]}
              />
            </View>
            {player.availableStatPoints > 0 && (
              <TouchableOpacity
                style={styles.allocateBtn}
                onPress={() => allocateStat(stat)}
              >
                <Text style={styles.allocateBtnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Derived Stats */}
      <View style={styles.derivedSection}>
        <Text style={styles.sectionTitle}>COMBAT STATS</Text>
        <View style={styles.derivedGrid}>
          <View style={styles.derivedItem}>
            <Text style={styles.derivedLabel}>ATK</Text>
            <Text style={styles.derivedValue}>{derivedStats.attackPower}</Text>
          </View>
          <View style={styles.derivedItem}>
            <Text style={styles.derivedLabel}>DEF</Text>
            <Text style={styles.derivedValue}>{derivedStats.defense}</Text>
          </View>
          <View style={styles.derivedItem}>
            <Text style={styles.derivedLabel}>SPD</Text>
            <Text style={styles.derivedValue}>{derivedStats.speed}</Text>
          </View>
          <View style={styles.derivedItem}>
            <Text style={styles.derivedLabel}>CRIT</Text>
            <Text style={styles.derivedValue}>{(derivedStats.critRate * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.derivedItem}>
            <Text style={styles.derivedLabel}>DODGE</Text>
            <Text style={styles.derivedValue}>{(derivedStats.dodgeRate * 100).toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      {/* Quick Info */}
      <View style={styles.quickInfo}>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoIcon}>💰</Text>
          <Text style={styles.quickInfoValue}>{player.gold}</Text>
          <Text style={styles.quickInfoLabel}>Gold</Text>
        </View>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoIcon}>📋</Text>
          <Text style={styles.quickInfoValue}>{player.totalQuestsCompleted}</Text>
          <Text style={styles.quickInfoLabel}>Quests</Text>
        </View>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoIcon}>🔥</Text>
          <Text style={styles.quickInfoValue}>{player.questStreak}</Text>
          <Text style={styles.quickInfoLabel}>Streak</Text>
        </View>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoIcon}>🏰</Text>
          <Text style={styles.quickInfoValue}>{player.completedDungeonIds.length}</Text>
          <Text style={styles.quickInfoLabel}>Cleared</Text>
        </View>
      </View>

      {/* Equipment Preview */}
      <View style={styles.equipSection}>
        <Text style={styles.sectionTitle}>EQUIPMENT</Text>
        <View style={styles.equipGrid}>
          <TouchableOpacity
            style={styles.equipSlot}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.equipSlotIcon}>
              {player.equippedWeapon?.icon || '⚔️'}
            </Text>
            <Text style={styles.equipSlotLabel}>
              {player.equippedWeapon?.name || 'No Weapon'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.equipSlot}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.equipSlotIcon}>
              {player.equippedArmor?.icon || '🛡️'}
            </Text>
            <Text style={styles.equipSlotLabel}>
              {player.equippedArmor?.name || 'No Armor'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.equipSlot}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.equipSlotIcon}>
              {player.equippedAccessory?.icon || '💍'}
            </Text>
            <Text style={styles.equipSlotLabel}>
              {player.equippedAccessory?.name || 'No Accessory'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  statusWindow: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  windowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
    paddingBottom: SPACING.md,
  },
  windowTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.primaryLight,
    letterSpacing: 6,
  },
  rankBadge: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  rankText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124,58,237,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderGlow,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 30,
  },
  playerDetails: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  playerName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  playerTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textAccent,
    marginTop: 2,
    letterSpacing: 1,
  },
  levelText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gold,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 1,
  },
  barSection: {
    marginBottom: SPACING.sm,
  },
  barLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabelText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.exp,
    letterSpacing: 2,
  },
  barValueText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  barBg: {
    height: 10,
    backgroundColor: 'rgba(30,20,50,0.8)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  expBar: {
    backgroundColor: COLORS.exp,
    shadowColor: COLORS.exp,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  hpBar: {
    backgroundColor: COLORS.hpBar,
    shadowColor: COLORS.hp,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  mpBar: {
    backgroundColor: COLORS.mpBar,
    shadowColor: COLORS.mp,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  statsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 3,
  },
  pointsBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  pointsBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONTS.sizes.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: 4,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  statName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '700',
    width: 80,
    letterSpacing: 2,
  },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(30,20,50,0.6)',
    borderRadius: 4,
    marginLeft: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.08)',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  allocateBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  allocateBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
  },
  derivedSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  derivedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  derivedItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  derivedLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 2,
  },
  derivedValue: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textPrimary,
    fontWeight: '900',
    marginTop: 4,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: 6,
  },
  quickInfoItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  quickInfoIcon: {
    fontSize: 20,
  },
  quickInfoValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  quickInfoLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 1,
  },
  equipSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  equipGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    gap: 8,
  },
  equipSlot: {
    flex: 1,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  equipSlotIcon: {
    fontSize: 28,
  },
  equipSlotLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default StatusScreen;
