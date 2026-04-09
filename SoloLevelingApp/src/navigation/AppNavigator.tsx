import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

import StatusScreen from '../screens/StatusScreen';
import QuestsScreen from '../screens/QuestsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SkillsScreen from '../screens/SkillsScreen';
import DungeonSelectScreen from '../screens/DungeonSelectScreen';
import GameScreen from '../screens/GameScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons: Record<string, string> = {
  Status: '👤',
  Quests: '📋',
  Goals: '🎯',
  Dungeons: '⚔️',
  Inventory: '🎒',
  Skills: '✨',
};

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{tabIcons[name] || '•'}</Text>
    {focused && <View style={styles.tabGlow} />}
  </View>
);

const headerTitles: Record<string, string> = {
  Status: '[ STATUS WINDOW ]',
  Quests: '[ QUEST LOG ]',
  Goals: '[ GOALS ]',
  Dungeons: '[ DUNGEON GATE ]',
  Inventory: '[ INVENTORY ]',
  Skills: '[ SKILL TREE ]',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: COLORS.textPrimary,
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <View style={styles.headerLine} />
            <Text style={styles.headerTitle}>{headerTitles[route.name] || route.name}</Text>
            <View style={styles.headerLine} />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Quests" component={QuestsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Dungeons" component={DungeonSelectScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Skills" component={SkillsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          presentation: 'fullScreenModal' as any,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.borderAccent,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 18,
    paddingTop: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabGlow: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tabLabelFocused: {
    color: COLORS.primaryLight,
  },
  header: {
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderAccent,
  },
  headerTitle: {
    color: COLORS.primaryLight,
    fontWeight: '800',
    fontSize: FONTS.sizes.md,
    letterSpacing: 4,
  },
});
