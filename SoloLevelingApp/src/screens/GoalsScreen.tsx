import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING } from '../theme';
import { Goal, GoalCategory, Milestone, GOAL_CATEGORY_ICONS } from '../types';
import { generateId } from '../utils/id';

const CATEGORIES: GoalCategory[] = ['fitness', 'learning', 'career', 'health', 'creative', 'financial', 'social', 'other'];

const GoalsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('fitness');
  const [milestones, setMilestones] = useState<string[]>(['']);

  const activeGoals = state.goals.filter(g => g.isActive);
  const completedGoals = state.goals.filter(g => !g.isActive && g.completedAt);

  const handleCreateGoal = () => {
    if (!goalTitle.trim()) return;

    const goalMilestones: Milestone[] = milestones
      .filter(m => m.trim())
      .map((m, i) => ({
        id: generateId(),
        title: m.trim(),
        isCompleted: false,
        rewardExp: 50 + (i * 25),
        rewardStatPoints: 2 + i,
      }));

    if (goalMilestones.length === 0) {
      goalMilestones.push({
        id: generateId(),
        title: goalTitle,
        isCompleted: false,
        rewardExp: 100,
        rewardStatPoints: 3,
      });
    }

    const goal: Goal = {
      id: generateId(),
      title: goalTitle.trim(),
      description: goalDesc.trim() || `Working towards: ${goalTitle}`,
      category: goalCategory,
      milestones: goalMilestones,
      isActive: true,
      createdAt: new Date().toISOString(),
      dailyQuestTemplates: [],
    };

    dispatch({ type: 'ADD_GOAL', payload: goal });
    
    // Regenerate daily quests with new goal categories
    const categories = [...state.goals.filter(g => g.isActive).map(g => g.category), goalCategory];
    dispatch({ type: 'GENERATE_DAILY_QUESTS', payload: categories });

    setShowCreateGoal(false);
    setGoalTitle('');
    setGoalDesc('');
    setMilestones(['']);
  };

  const handleCompleteMilestone = (goalId: string, milestone: Milestone) => {
    Alert.alert(
      'Complete Milestone?',
      `Mark "${milestone.title}" as done?\n\nRewards:\n⭐ ${milestone.rewardExp} EXP\n📊 +${milestone.rewardStatPoints} Stat Points`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => dispatch({
            type: 'COMPLETE_MILESTONE',
            payload: { goalId, milestoneId: milestone.id },
          }),
        },
      ]
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal?',
      'This will permanently remove this goal.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_GOAL', payload: goalId }),
        },
      ]
    );
  };

  const addMilestoneField = () => {
    setMilestones([...milestones, '']);
  };

  const updateMilestone = (index: number, text: string) => {
    const updated = [...milestones];
    updated[index] = text;
    setMilestones(updated);
  };

  const renderGoalCard = (goal: Goal) => {
    const completedCount = goal.milestones.filter(m => m.isCompleted).length;
    const totalCount = goal.milestones.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
      <View key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalHeaderLeft}>
            <Text style={styles.goalIcon}>{GOAL_CATEGORY_ICONS[goal.category]}</Text>
            <View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalCategory}>{goal.category.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
            <Text style={styles.deleteBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.goalDesc}>{goal.description}</Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressPercent}>{completedCount}/{totalCount}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.milestonesSection}>
          {goal.milestones.map(milestone => (
            <TouchableOpacity
              key={milestone.id}
              style={[
                styles.milestoneRow,
                milestone.isCompleted && styles.milestoneComplete,
              ]}
              onPress={() => !milestone.isCompleted && handleCompleteMilestone(goal.id, milestone)}
              disabled={milestone.isCompleted}
            >
              <Text style={styles.milestoneCheck}>
                {milestone.isCompleted ? '✅' : '⬜'}
              </Text>
              <View style={styles.milestoneInfo}>
                <Text style={[
                  styles.milestoneTitle,
                  milestone.isCompleted && styles.milestoneTitleDone,
                ]}>
                  {milestone.title}
                </Text>
                <Text style={styles.milestoneReward}>
                  ⭐ {milestone.rewardExp} EXP  📊 +{milestone.rewardStatPoints}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Create Goal Button */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setShowCreateGoal(true)}
        >
          <Text style={styles.createBtnText}>🎯 Set New Goal</Text>
        </TouchableOpacity>

        {activeGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>No Active Goals</Text>
            <Text style={styles.emptySubtext}>
              Set goals to generate personalized daily quests!
            </Text>
          </View>
        ) : (
          activeGoals.map(renderGoalCard)
        )}

        {completedGoals.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.sectionTitle}>✅ Completed Goals</Text>
            {completedGoals.map(goal => (
              <View key={goal.id} style={[styles.goalCard, { opacity: 0.5 }]}>
                <Text style={styles.goalTitle}>
                  {GOAL_CATEGORY_ICONS[goal.category]} {goal.title}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={showCreateGoal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set New Goal</Text>

              <Text style={styles.inputLabel}>Goal Title</Text>
              <TextInput
                style={styles.input}
                value={goalTitle}
                onChangeText={setGoalTitle}
                placeholder="e.g., Lose 20 pounds"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={goalDesc}
                onChangeText={setGoalDesc}
                placeholder="Describe your goal..."
                placeholderTextColor={COLORS.textMuted}
                multiline
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryBtn,
                      goalCategory === cat && styles.categoryBtnActive,
                    ]}
                    onPress={() => setGoalCategory(cat)}
                  >
                    <Text style={styles.categoryIcon}>{GOAL_CATEGORY_ICONS[cat]}</Text>
                    <Text style={[
                      styles.categoryText,
                      goalCategory === cat && styles.categoryTextActive,
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Milestones</Text>
              {milestones.map((m, i) => (
                <TextInput
                  key={i}
                  style={styles.input}
                  value={m}
                  onChangeText={(text) => updateMilestone(i, text)}
                  placeholder={`Milestone ${i + 1}`}
                  placeholderTextColor={COLORS.textMuted}
                />
              ))}
              <TouchableOpacity style={styles.addMilestoneBtn} onPress={addMilestoneField}>
                <Text style={styles.addMilestoneBtnText}>+ Add Milestone</Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowCreateGoal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleCreateGoal}
                >
                  <Text style={styles.modalConfirmText}>Create Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FONTS.sizes.lg,
    letterSpacing: 1,
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  goalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  goalCategory: {
    fontSize: 9,
    color: COLORS.primaryLight,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
  },
  deleteBtn: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.lg,
    padding: SPACING.sm,
  },
  goalDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  progressPercent: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(30,20,50,0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.08)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  milestonesSection: {
    marginTop: SPACING.sm,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  milestoneComplete: {
    opacity: 0.5,
  },
  milestoneCheck: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  milestoneTitleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  milestoneReward: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gold,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  completedSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '800',
    color: COLORS.success,
    marginBottom: SPACING.md,
    letterSpacing: 2,
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
    marginTop: 60,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  addMilestoneBtn: {
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addMilestoneBtnText: {
    color: COLORS.textAccent,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
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

export default GoalsScreen;
