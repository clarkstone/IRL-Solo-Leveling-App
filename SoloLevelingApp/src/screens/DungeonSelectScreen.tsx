import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING } from '../theme';
import { DUNGEONS } from '../data/dungeons';
import { DungeonStage, RANK_COLORS, DungeonRank } from '../types';

const DungeonSelectScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state } = useGame();
  const { player } = state;
  const [selectedDungeon, setSelectedDungeon] = useState<DungeonStage | null>(null);

  const isUnlocked = (index: number): boolean => {
    return index <= player.currentDungeonProgress;
  };

  const isCleared = (dungeonId: string): boolean => {
    return player.completedDungeonIds.includes(dungeonId);
  };

  const handleSelectDungeon = (dungeon: DungeonStage, index: number) => {
    if (!isUnlocked(index)) return;
    setSelectedDungeon(dungeon);
  };

  const handleEnterDungeon = () => {
    if (!selectedDungeon) return;
    const id = selectedDungeon.id;
    setSelectedDungeon(null);
    navigation.navigate('Game', { dungeonId: id });
  };

  const renderDungeonCard = (dungeon: DungeonStage, index: number) => {
    const unlocked = isUnlocked(index);
    const cleared = isCleared(dungeon.id);
    const rankColor = RANK_COLORS[dungeon.rank as DungeonRank] || COLORS.textMuted;

    return (
      <TouchableOpacity
        key={dungeon.id}
        style={[
          styles.dungeonCard,
          !unlocked && styles.dungeonLocked,
          cleared && styles.dungeonCleared,
        ]}
        onPress={() => handleSelectDungeon(dungeon, index)}
        activeOpacity={unlocked ? 0.7 : 1}
      >
        {/* Rank Badge */}
        <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
          <Text style={styles.rankText}>{dungeon.rank}</Text>
        </View>

        {/* Dungeon Info */}
        <View style={styles.dungeonInfo}>
          <Text style={styles.dungeonIcon}>
            {unlocked ? dungeon.icon : '🔒'}
          </Text>
          <View style={styles.dungeonDetails}>
            <Text style={[styles.dungeonName, !unlocked && styles.lockedText]}>
              {unlocked ? dungeon.name : '???'}
            </Text>
            {unlocked && (
              <Text style={styles.dungeonDesc} numberOfLines={1}>
                {dungeon.description}
              </Text>
            )}
            <View style={styles.dungeonMeta}>
              <Text style={styles.metaText}>Lv. {dungeon.recommendedLevel}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{dungeon.waves} Waves</Text>
              {cleared && (
                <>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.clearedText}>✅ CLEARED</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Rewards Preview */}
        {unlocked && (
          <View style={styles.rewardsRow}>
            <Text style={styles.rewardItem}>⭐ {dungeon.rewards.exp}</Text>
            <Text style={styles.rewardItem}>💰 {dungeon.rewards.gold}</Text>
            {dungeon.rewards.skillUnlockId && (
              <Text style={styles.rewardItem}>🌟 Skill</Text>
            )}
          </View>
        )}

        {/* Connection Line */}
        {index < DUNGEONS.length - 1 && (
          <View style={styles.connectionLine} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DUNGEON GATE</Text>
        <Text style={styles.headerSubtitle}>
          Cleared: {player.completedDungeonIds.length} / {DUNGEONS.length}
        </Text>
      </View>

      {/* Player Quick Stats */}
      <View style={styles.playerBar}>
        <View style={styles.playerStatItem}>
          <Text style={styles.playerStatLabel}>Level</Text>
          <Text style={styles.playerStatValue}>{player.level}</Text>
        </View>
        <View style={styles.playerStatItem}>
          <Text style={styles.playerStatLabel}>HP</Text>
          <Text style={[styles.playerStatValue, { color: COLORS.hp }]}>{player.hp}</Text>
        </View>
        <View style={styles.playerStatItem}>
          <Text style={styles.playerStatLabel}>MP</Text>
          <Text style={[styles.playerStatValue, { color: COLORS.mp }]}>{player.mp}</Text>
        </View>
        <View style={styles.playerStatItem}>
          <Text style={styles.playerStatLabel}>ATK</Text>
          <Text style={styles.playerStatValue}>
            {10 + (player.stats.strength * 2) + (player.equippedWeapon?.statBonus.attackPower || 0)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {DUNGEONS.map((dungeon, index) => renderDungeonCard(dungeon, index))}
      </ScrollView>

      {/* Dungeon Confirm Modal */}
      <Modal
        visible={!!selectedDungeon}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDungeon(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedDungeon && (
              <>
                <View style={[styles.modalRankBadge, { backgroundColor: RANK_COLORS[selectedDungeon.rank as DungeonRank] || COLORS.textMuted }]}>
                  <Text style={styles.modalRankText}>{selectedDungeon.rank}-RANK</Text>
                </View>
                <Text style={styles.modalTitle}>{selectedDungeon.name}</Text>
                <Text style={styles.modalDesc}>{selectedDungeon.description}</Text>

                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Level</Text>
                    <Text style={styles.modalInfoValue}>{selectedDungeon.recommendedLevel}</Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Waves</Text>
                    <Text style={styles.modalInfoValue}>{selectedDungeon.waves}</Text>
                  </View>
                </View>

                <View style={styles.modalRewards}>
                  <Text style={styles.modalRewardTitle}>REWARDS</Text>
                  <Text style={styles.modalRewardText}>⭐ {selectedDungeon.rewards.exp} EXP</Text>
                  <Text style={styles.modalRewardText}>💰 {selectedDungeon.rewards.gold} Gold</Text>
                  {selectedDungeon.rewards.skillUnlockId && (
                    <Text style={styles.modalRewardText}>🌟 New Skill Unlock!</Text>
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setSelectedDungeon(null)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalEnterBtn}
                    onPress={handleEnterDungeon}
                  >
                    <Text style={styles.modalEnterText}>⚔️ Enter Dungeon</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    color: COLORS.primaryLight,
    letterSpacing: 6,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    letterSpacing: 2,
  },
  playerBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
  },
  playerStatItem: {
    alignItems: 'center',
  },
  playerStatLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 2,
  },
  playerStatValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  dungeonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dungeonLocked: {
    opacity: 0.3,
    borderColor: COLORS.border,
  },
  dungeonCleared: {
    borderColor: 'rgba(16,185,129,0.3)',
    shadowColor: COLORS.success,
    shadowOpacity: 0.12,
  },
  rankBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  rankText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1,
  },
  dungeonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dungeonIcon: {
    fontSize: 36,
    marginRight: SPACING.lg,
  },
  dungeonDetails: {
    flex: 1,
  },
  dungeonName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  lockedText: {
    color: COLORS.textMuted,
  },
  dungeonDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dungeonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  metaDot: {
    color: COLORS.textMuted,
    marginHorizontal: 6,
    fontSize: FONTS.sizes.xs,
  },
  clearedText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: '700',
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderAccent,
  },
  rewardItem: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gold,
    fontWeight: '700',
  },
  connectionLine: {
    position: 'absolute',
    bottom: -SPACING.md,
    left: '50%',
    width: 2,
    height: SPACING.md,
    backgroundColor: COLORS.borderAccent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,0,16,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalRankBadge: {
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  modalRankText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: FONTS.sizes.sm,
    letterSpacing: 2,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalInfoRow: {
    flexDirection: 'row',
    gap: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  modalInfoItem: {
    alignItems: 'center',
  },
  modalInfoLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  modalInfoValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  modalRewards: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  modalRewardTitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  modalRewardText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gold,
    fontWeight: '600',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLighter,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
  },
  modalEnterBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  modalEnterText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONTS.sizes.md,
    letterSpacing: 1,
  },
});

export default DungeonSelectScreen;
