import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING } from '../theme';
import { Quest, QuestType, QuestStatus } from '../types';

const QUEST_TYPE_COLORS: Record<QuestType, string> = {
  daily: COLORS.info,
  weekly: COLORS.secondary,
  story: COLORS.gold,
  goal: COLORS.success,
  emergency: COLORS.danger,
};

const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  daily: '📋 DAILY',
  weekly: '📅 WEEKLY',
  story: '⭐ STORY',
  goal: '🎯 GOAL',
  emergency: '⚠️ EMERGENCY',
};

const QuestsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [filter, setFilter] = useState<QuestType | 'all'>('all');
  const [showCustomQuest, setShowCustomQuest] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customTarget, setCustomTarget] = useState('1');
  const [customUnit, setCustomUnit] = useState('times');
  const [customRewardExp, setCustomRewardExp] = useState('20');

  const filteredQuests = state.quests.filter(q => {
    if (filter === 'all') return q.status !== 'completed' && q.status !== 'failed';
    return q.type === filter && q.status !== 'completed' && q.status !== 'failed';
  });

  const completedQuests = state.quests.filter(q => q.status === 'completed');

  const handleCompleteQuest = (quest: Quest) => {
    Alert.alert(
      'Complete Quest?',
      `Mark "${quest.title}" as completed?\n\nRewards:\n⭐ ${quest.rewards.exp} EXP\n💰 ${quest.rewards.gold} Gold\n📊 ${quest.rewards.statPoints} Stat Points`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => dispatch({ type: 'COMPLETE_QUEST', payload: quest.id }),
        },
      ]
    );
  };

  const handleUpdateProgress = (questId: string, reqIndex: number, currentVal: number, targetVal: number) => {
    const newVal = Math.min(currentVal + 1, targetVal);
    dispatch({
      type: 'UPDATE_QUEST_PROGRESS',
      payload: { questId, reqIndex, value: newVal },
    });
  };

  const handleAddCustomQuest = () => {
    if (!customTitle.trim()) return;
    const quest: Quest = {
      id: Date.now().toString(),
      title: customTitle,
      description: customDesc || 'Custom quest',
      type: 'daily',
      status: 'active',
      verificationType: 'self_report',
      requirements: [{
        description: customTitle,
        targetValue: parseInt(customTarget) || 1,
        currentValue: 0,
        unit: customUnit,
      }],
      rewards: {
        exp: parseInt(customRewardExp) || 20,
        gold: Math.floor((parseInt(customRewardExp) || 20) / 2),
        statPoints: Math.ceil((parseInt(customRewardExp) || 20) / 30),
      },
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_QUEST', payload: quest });
    setShowCustomQuest(false);
    setCustomTitle('');
    setCustomDesc('');
    setCustomTarget('1');
    setCustomUnit('times');
    setCustomRewardExp('20');
  };

  const generateDailies = () => {
    const categories = state.goals.filter(g => g.isActive).map(g => g.category);
    dispatch({ type: 'GENERATE_DAILY_QUESTS', payload: categories });
  };

  const renderQuestCard = (quest: Quest) => {
    const typeColor = QUEST_TYPE_COLORS[quest.type];
    const allComplete = quest.requirements.every(r => r.currentValue >= r.targetValue);

    return (
      <View key={quest.id} style={[styles.questCard, { borderLeftColor: typeColor }]}>
        <View style={styles.questHeader}>
          <Text style={[styles.questType, { color: typeColor }]}>
            {QUEST_TYPE_LABELS[quest.type]}
          </Text>
          {quest.penalty && (
            <Text style={styles.penaltyBadge}>⚠️ PENALTY</Text>
          )}
        </View>
        
        <Text style={styles.questTitle}>{quest.title}</Text>
        <Text style={styles.questDesc}>{quest.description}</Text>

        {/* Requirements / Progress */}
        {quest.requirements.map((req, i) => (
          <View key={i} style={styles.reqRow}>
            <View style={styles.reqInfo}>
              <Text style={styles.reqText}>{req.description}</Text>
              <Text style={styles.reqProgress}>
                {req.currentValue} / {req.targetValue} {req.unit}
              </Text>
            </View>
            <View style={styles.reqBarBg}>
              <View
                style={[
                  styles.reqBarFill,
                  {
                    width: `${(req.currentValue / req.targetValue) * 100}%`,
                    backgroundColor: req.currentValue >= req.targetValue ? COLORS.success : typeColor,
                  },
                ]}
              />
            </View>
            {quest.verificationType === 'counter' && req.currentValue < req.targetValue && (
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => handleUpdateProgress(quest.id, i, req.currentValue, req.targetValue)}
              >
                <Text style={styles.counterBtnText}>+1</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Rewards */}
        <View style={styles.rewardsRow}>
          <Text style={styles.rewardItem}>⭐ {quest.rewards.exp}</Text>
          <Text style={styles.rewardItem}>💰 {quest.rewards.gold}</Text>
          {quest.rewards.statPoints > 0 && (
            <Text style={styles.rewardItem}>📊 +{quest.rewards.statPoints}</Text>
          )}
          {quest.rewards.skillUnlockId && (
            <Text style={styles.rewardItem}>🌟 Skill</Text>
          )}
        </View>

        {/* Complete Button */}
        {quest.status === 'active' && (
          <TouchableOpacity
            style={[
              styles.completeBtn,
              allComplete ? styles.completeBtnReady : styles.completeBtnNotReady,
            ]}
            onPress={() => handleCompleteQuest(quest)}
          >
            <Text style={styles.completeBtnText}>
              {allComplete ? '✅ COMPLETE QUEST' : '📝 MARK AS DONE'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {(['all', 'daily', 'story', 'goal', 'emergency'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'all' ? 'ALL' : f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={generateDailies}>
          <Text style={styles.actionBtnText}>🔄 New Dailies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCustomQuest(true)}>
          <Text style={styles.actionBtnText}>➕ Custom Quest</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredQuests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No active quests</Text>
            <Text style={styles.emptySubtext}>Generate daily quests or add custom ones!</Text>
          </View>
        ) : (
          filteredQuests.map(renderQuestCard)
        )}

        {completedQuests.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedHeader}>
              ✅ Completed ({completedQuests.length})
            </Text>
            {completedQuests.slice(0, 5).map(q => (
              <View key={q.id} style={styles.completedCard}>
                <Text style={styles.completedTitle}>{q.title}</Text>
                <Text style={styles.completedReward}>+{q.rewards.exp} EXP</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Custom Quest Modal */}
      <Modal visible={showCustomQuest} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Custom Quest</Text>
            
            <Text style={styles.inputLabel}>Quest Title</Text>
            <TextInput
              style={styles.input}
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="e.g., Read 20 pages"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              value={customDesc}
              onChangeText={setCustomDesc}
              placeholder="Optional description"
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Target</Text>
                <TextInput
                  style={styles.input}
                  value={customTarget}
                  onChangeText={setCustomTarget}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={customUnit}
                  onChangeText={setCustomUnit}
                  placeholder="reps, min, etc"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>EXP Reward</Text>
            <TextInput
              style={styles.input}
              value={customRewardExp}
              onChangeText={setCustomRewardExp}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowCustomQuest(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleAddCustomQuest}
              >
                <Text style={styles.modalConfirmText}>Create Quest</Text>
              </TouchableOpacity>
            </View>
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
  filterRow: {
    maxHeight: 48,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  filterTabText: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1,
  },
  filterTabTextActive: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  actionBtnText: {
    color: COLORS.primaryLight,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  questCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  questType: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },
  penaltyBadge: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    fontWeight: '700',
  },
  questTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  questDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  reqRow: {
    marginBottom: SPACING.sm,
  },
  reqInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reqText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  reqProgress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  reqBarBg: {
    height: 6,
    backgroundColor: 'rgba(30,20,50,0.6)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.08)',
  },
  reqBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  counterBtn: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  counterBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  rewardItem: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gold,
    fontWeight: '600',
  },
  completeBtn: {
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  completeBtnReady: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  completeBtnNotReady: {
    backgroundColor: COLORS.surfaceLighter,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  completedSection: {
    marginTop: SPACING.xl,
  },
  completedHeader: {
    fontSize: FONTS.sizes.md,
    color: COLORS.success,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  completedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    opacity: 0.6,
  },
  completedTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  completedReward: {
    color: COLORS.success,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2,0,16,0.92)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primaryLight,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    letterSpacing: 3,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputHalf: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLighter,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default QuestsScreen;
