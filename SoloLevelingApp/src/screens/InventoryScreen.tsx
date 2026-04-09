import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS, FONTS, SPACING } from '../theme';
import { Item, ItemType, RARITY_COLORS } from '../types';

const TYPE_FILTERS: { label: string; value: ItemType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '⚔️ Weapons', value: 'weapon' },
  { label: '🛡️ Armor', value: 'armor' },
  { label: '💍 Accessories', value: 'accessory' },
  { label: '🧪 Consumables', value: 'consumable' },
];

const InventoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [filter, setFilter] = useState<ItemType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const filteredItems = filter === 'all'
    ? player.inventory
    : player.inventory.filter(i => i.type === filter);

  const handleEquip = (item: Item) => {
    dispatch({ type: 'EQUIP_ITEM', payload: item });
    setSelectedItem(null);
  };

  const handleUnequip = (slot: 'weapon' | 'armor' | 'accessory') => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: slot });
  };

  const handleUseConsumable = (item: Item) => {
    if (item.type !== 'consumable') return;
    
    if (item.statBonus.hp) {
      dispatch({ type: 'HEAL', payload: item.statBonus.hp });
    }
    if (item.statBonus.mp) {
      dispatch({ type: 'RESTORE_MP', payload: item.statBonus.mp });
    }
    
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    setSelectedItem(null);
    Alert.alert('Item Used', `Used ${item.name}!`);
  };

  const renderStatBonuses = (item: Item) => {
    const bonuses = Object.entries(item.statBonus).filter(([_, v]) => v && v > 0);
    if (bonuses.length === 0) return null;
    
    return (
      <View style={styles.statBonuses}>
        {bonuses.map(([key, val]) => (
          <Text key={key} style={styles.statBonusText}>
            +{val} {key.toUpperCase()}
          </Text>
        ))}
      </View>
    );
  };

  const renderItemCard = (item: Item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.itemCard, { borderColor: RARITY_COLORS[item.rarity] }]}
      onPress={() => setSelectedItem(item)}
    >
      <Text style={styles.itemIcon}>{item.icon}</Text>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: RARITY_COLORS[item.rarity] }]}>
          {item.name}
        </Text>
        <Text style={styles.itemRarity}>{item.rarity}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEquipSlot = (
    label: string,
    item: Item | null,
    slot: 'weapon' | 'armor' | 'accessory'
  ) => (
    <View style={styles.equipSlot}>
      <Text style={styles.equipSlotLabel}>{label}</Text>
      {item ? (
        <TouchableOpacity
          style={[styles.equipSlotCard, { borderColor: RARITY_COLORS[item.rarity] }]}
          onPress={() => handleUnequip(slot)}
        >
          <Text style={styles.equipSlotIcon}>{item.icon}</Text>
          <Text style={[styles.equipSlotName, { color: RARITY_COLORS[item.rarity] }]}>
            {item.name}
          </Text>
          <Text style={styles.unequipText}>Tap to unequip</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.equipSlotEmpty}>
          <Text style={styles.equipSlotEmptyText}>Empty</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Equipped Items */}
        <Text style={styles.sectionTitle}>EQUIPPED</Text>
        <View style={styles.equipGrid}>
          {renderEquipSlot('Weapon', player.equippedWeapon, 'weapon')}
          {renderEquipSlot('Armor', player.equippedArmor, 'armor')}
          {renderEquipSlot('Accessory', player.equippedAccessory, 'accessory')}
        </View>

        {/* Inventory */}
        <View style={styles.inventoryHeader}>
          <Text style={styles.sectionTitle}>INVENTORY</Text>
          <Text style={styles.itemCount}>{player.inventory.length} items</Text>
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {TYPE_FILTERS.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No items</Text>
            <Text style={styles.emptySubtext}>Clear dungeons to find loot!</Text>
          </View>
        ) : (
          <View style={styles.itemGrid}>
            {filteredItems.map(renderItemCard)}
          </View>
        )}

        {/* Gold */}
        <View style={styles.goldBar}>
          <Text style={styles.goldIcon}>💰</Text>
          <Text style={styles.goldText}>{player.gold} Gold</Text>
        </View>
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedItem && (
            <View style={[styles.modalContent, { borderColor: RARITY_COLORS[selectedItem.rarity] }]}>
              <Text style={styles.modalIcon}>{selectedItem.icon}</Text>
              <Text style={[styles.modalName, { color: RARITY_COLORS[selectedItem.rarity] }]}>
                {selectedItem.name}
              </Text>
              <Text style={[styles.modalRarity, { color: RARITY_COLORS[selectedItem.rarity] }]}>
                {selectedItem.rarity} {selectedItem.type}
              </Text>
              <Text style={styles.modalDesc}>{selectedItem.description}</Text>
              
              {renderStatBonuses(selectedItem)}

              <Text style={styles.modalValue}>💰 Value: {selectedItem.value}</Text>

              <View style={styles.modalActions}>
                {(selectedItem.type === 'weapon' || selectedItem.type === 'armor' || selectedItem.type === 'accessory') && (
                  <TouchableOpacity
                    style={styles.equipBtn}
                    onPress={() => handleEquip(selectedItem)}
                  >
                    <Text style={styles.equipBtnText}>⚔️ Equip</Text>
                  </TouchableOpacity>
                )}
                {selectedItem.type === 'consumable' && (
                  <TouchableOpacity
                    style={[styles.equipBtn, { backgroundColor: COLORS.success }]}
                    onPress={() => handleUseConsumable(selectedItem)}
                  >
                    <Text style={styles.equipBtnText}>🧪 Use</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedItem(null)}
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
  },
  equipGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  equipSlot: {
    flex: 1,
  },
  equipSlotLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    textAlign: 'center',
    letterSpacing: 1,
  },
  equipSlotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: 90,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  equipSlotIcon: {
    fontSize: 24,
  },
  equipSlotName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  unequipText: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  equipSlotEmpty: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    borderStyle: 'dashed',
    minHeight: 90,
    justifyContent: 'center',
  },
  equipSlotEmptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemCount: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  filterRow: {
    maxHeight: 44,
    marginBottom: SPACING.md,
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
  filterTabText: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: FONTS.sizes.xs,
  },
  filterTabTextActive: {
    color: '#fff',
  },
  itemGrid: {
    gap: SPACING.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  itemIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  itemRarity: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  goldBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  goldIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  goldText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.gold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
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
    marginBottom: SPACING.md,
  },
  modalName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  modalRarity: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalDesc: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  statBonuses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBonusText: {
    color: COLORS.success,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  modalValue: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.sm,
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
    fontSize: FONTS.sizes.md,
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

export default InventoryScreen;
