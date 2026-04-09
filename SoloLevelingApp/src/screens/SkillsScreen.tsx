import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING } from '../theme';
import { Skill, SkillElement } from '../types';
import { SKILLS, getSkillById } from '../data/skills';

const ELEMENT_COLORS: Record<SkillElement, string> = {
  physical: '#ef4444',
  fire: '#f97316',
  ice: '#06b6d4',
  lightning: '#eab308',
  shadow: '#7c3aed',
  holy: '#fbbf24',
};

const ELEMENT_LABELS: Record<SkillElement, string> = {
  physical: 'Physical',
  fire: 'Fire',
  ice: 'Ice',
  lightning: 'Lightning',
  shadow: 'Shadow',
  holy: 'Holy',
};

const SkillsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filterElement, setFilterElement] = useState<SkillElement | 'all'>('all');

  const isUnlocked = (skill: Skill): boolean => {
    if (player.unlockedSkillIds.includes(skill.id)) return true;
    if (skill.unlockQuestId) return false;
    if (skill.unlockLevel <= player.level) {
      if (skill.statRequirement) {
        return Object.entries(skill.statRequirement).every(
          ([key, val]) => player.stats[key as keyof typeof player.stats] >= (val || 0)
        );
      }
      return true;
    }
    return false;
  };

  const isEquipped = (skillId: string): boolean =>
    player.equippedSkills.includes(skillId);

  const handleEquipSkill = (skill: Skill) => {
    if (!isUnlocked(skill)) {
      Alert.alert('Locked', 'You have not unlocked this skill yet.');
      return;
    }

    if (skill.type === 'passive') {
      if (!player.unlockedSkillIds.includes(skill.id)) {
        dispatch({ type: 'UNLOCK_SKILL', payload: skill.id });
      }
      Alert.alert('Passive Skill', 'Passive skills are always active once unlocked.');
      return;
    }

    // Find an empty slot or replace
    const emptySlot = player.equippedSkills.findIndex(s => !s || s === '');
    if (emptySlot !== -1) {
      dispatch({ type: 'EQUIP_SKILL', payload: { skillId: skill.id, slot: emptySlot } });
    } else {
      // Replace last slot
      Alert.alert(
        'Equip Skill',
        'All slots are full. Replace the last equipped skill?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            onPress: () => dispatch({ type: 'EQUIP_SKILL', payload: { skillId: skill.id, slot: 3 } }),
          },
        ]
      );
    }
    setSelectedSkill(null);
  };

  const filteredSkills = SKILLS.filter(s =>
    filterElement === 'all' || s.element === filterElement
  );

  const activeSkills = filteredSkills.filter(s => s.type === 'active');
  const passiveSkills = filteredSkills.filter(s => s.type === 'passive');

  const renderSkillCard = (skill: Skill) => {
    const unlocked = isUnlocked(skill);
    const equipped = isEquipped(skill.id);

    return (
      <TouchableOpacity
        key={skill.id}
        style={[
          styles.skillCard,
          !unlocked && styles.skillLocked,
          equipped && styles.skillEquipped,
        ]}
        onPress={() => setSelectedSkill(skill)}
      >
        <View style={styles.skillHeader}>
          <Text style={styles.skillIcon}>{unlocked ? skill.icon : '🔒'}</Text>
          <View style={[styles.elementBadge, { backgroundColor: ELEMENT_COLORS[skill.element] }]}>
            <Text style={styles.elementBadgeText}>{skill.element.slice(0, 3).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={[styles.skillName, !unlocked && styles.lockedText]}>
          {unlocked ? skill.name : '???'}
        </Text>
        {unlocked && (
          <Text style={styles.skillDamage}>
            {skill.damage > 0 ? `${(skill.damage * 100).toFixed(0)}% DMG` : 'Utility'}
          </Text>
        )}
        {!unlocked && (
          <Text style={styles.lockReq}>Lv.{skill.unlockLevel}</Text>
        )}
        {equipped && (
          <View style={styles.equippedBadge}>
            <Text style={styles.equippedBadgeText}>E</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Equipped Skills Bar */}
      <View style={styles.equippedBar}>
        <Text style={styles.equippedTitle}>EQUIPPED SKILLS</Text>
        <View style={styles.equippedSlots}>
          {[0, 1, 2, 3].map(slot => {
            const skillId = player.equippedSkills[slot];
            const skill = skillId ? getSkillById(skillId) : null;
            return (
              <View key={slot} style={styles.equippedSlot}>
                <Text style={styles.equippedSlotIcon}>
                  {skill ? skill.icon : '➕'}
                </Text>
                <Text style={styles.equippedSlotName}>
                  {skill ? skill.name : 'Empty'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Element Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filterElement === 'all' && styles.filterTabActive]}
          onPress={() => setFilterElement('all')}
        >
          <Text style={[styles.filterText, filterElement === 'all' && styles.filterTextActive]}>ALL</Text>
        </TouchableOpacity>
        {(Object.keys(ELEMENT_COLORS) as SkillElement[]).map(el => (
          <TouchableOpacity
            key={el}
            style={[
              styles.filterTab,
              filterElement === el && { backgroundColor: ELEMENT_COLORS[el] },
            ]}
            onPress={() => setFilterElement(el)}
          >
            <Text style={[styles.filterText, filterElement === el && styles.filterTextActive]}>
              {ELEMENT_LABELS[el].toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>ACTIVE SKILLS</Text>
            <View style={styles.skillGrid}>
              {activeSkills.map(renderSkillCard)}
            </View>
          </>
        )}

        {passiveSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PASSIVE SKILLS</Text>
            <View style={styles.skillGrid}>
              {passiveSkills.map(renderSkillCard)}
            </View>
          </>
        )}
      </ScrollView>

      {/* Skill Detail Modal */}
      <Modal visible={!!selectedSkill} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedSkill && (
            <View style={[styles.modalContent, { borderColor: ELEMENT_COLORS[selectedSkill.element] }]}>
              <Text style={styles.modalIcon}>{selectedSkill.icon}</Text>
              <Text style={styles.modalName}>{selectedSkill.name}</Text>
              <View style={[styles.elementBadgeLg, { backgroundColor: ELEMENT_COLORS[selectedSkill.element] }]}>
                <Text style={styles.elementBadgeTextLg}>
                  {selectedSkill.type.toUpperCase()} • {ELEMENT_LABELS[selectedSkill.element]}
                </Text>
              </View>
              <Text style={styles.modalDesc}>{selectedSkill.description}</Text>

              <View style={styles.modalStats}>
                {selectedSkill.damage > 0 && (
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>Damage</Text>
                    <Text style={styles.modalStatValue}>{(selectedSkill.damage * 100).toFixed(0)}%</Text>
                  </View>
                )}
                {selectedSkill.mpCost > 0 && (
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>MP Cost</Text>
                    <Text style={[styles.modalStatValue, { color: COLORS.mp }]}>{selectedSkill.mpCost}</Text>
                  </View>
                )}
                {selectedSkill.cooldown > 0 && (
                  <View style={styles.modalStatItem}>
                    <Text style={styles.modalStatLabel}>Cooldown</Text>
                    <Text style={styles.modalStatValue}>{selectedSkill.cooldown} turns</Text>
                  </View>
                )}
              </View>

              {selectedSkill.statRequirement && (
                <View style={styles.requirementBox}>
                  <Text style={styles.requirementTitle}>Requirements</Text>
                  {Object.entries(selectedSkill.statRequirement).map(([key, val]) => (
                    <Text key={key} style={styles.requirementText}>
                      {key.toUpperCase()}: {val}
                      {player.stats[key as keyof typeof player.stats] >= (val || 0) ? ' ✅' : ' ❌'}
                    </Text>
                  ))}
                </View>
              )}

              <Text style={styles.unlockLevel}>
                Unlock Level: {selectedSkill.unlockLevel}
                {selectedSkill.unlockLevel <= player.level ? ' ✅' : ` (Current: ${player.level})`}
              </Text>

              <View style={styles.modalActions}>
                {isUnlocked(selectedSkill) && selectedSkill.type === 'active' && (
                  <TouchableOpacity
                    style={styles.equipBtn}
                    onPress={() => handleEquipSkill(selectedSkill)}
                  >
                    <Text style={styles.equipBtnText}>
                      {isEquipped(selectedSkill.id) ? '✅ Equipped' : '⚔️ Equip'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedSkill(null)}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  equippedBar: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
  },
  equippedTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: SPACING.sm,
  },
  equippedSlots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  equippedSlot: {
    flex: 1,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderRadius: 10,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  equippedSlotIcon: {
    fontSize: 22,
  },
  equippedSlotName: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  filterRow: {
    maxHeight: 48,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
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
  filterText: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: FONTS.sizes.xs,
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '800',
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  skillCard: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  skillLocked: {
    opacity: 0.3,
    borderColor: COLORS.border,
  },
  skillEquipped: {
    borderColor: COLORS.borderGlow,
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  skillIcon: {
    fontSize: 24,
  },
  elementBadge: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  elementBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#fff',
  },
  skillName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  lockedText: {
    color: COLORS.textMuted,
  },
  skillDamage: {
    fontSize: 9,
    color: COLORS.danger,
    fontWeight: '600',
    marginTop: 2,
  },
  lockReq: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  equippedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equippedBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
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
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  modalName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  elementBadgeLg: {
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.sm,
  },
  elementBadgeTextLg: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  modalDesc: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  modalStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  modalStatValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  requirementBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    padding: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md,
  },
  requirementTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  requirementText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
  },
  unlockLevel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  equipBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  equipBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  closeBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceLighter,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default SkillsScreen;
