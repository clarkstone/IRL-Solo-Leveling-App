import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameProvider, useGame } from './src/store/GameContext';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

const COLORS = {
  background: '#0a0e1a',
  primary: '#6366f1',
};

const navigationTheme: any = {
  dark: true,
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: '#111827',
    text: '#f1f5f9',
    border: '#1e293b',
    notification: '#ef4444',
  },
};

function AppContent() {
  const { state, dispatch, isLoading } = useGame();
  const [hasOnboarded, setHasOnboarded] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Show onboarding if player is brand new (level 1, no quests completed)
  const isNewPlayer = state.player.level === 1 && state.player.totalQuestsCompleted === 0 && !hasOnboarded;

  if (isNewPlayer) {
    return (
      <OnboardingScreen
        onComplete={(name) => {
          dispatch({ type: 'SET_PLAYER_NAME', payload: name });
          // Generate initial daily quests
          dispatch({ type: 'GENERATE_DAILY_QUESTS', payload: ['fitness', 'health'] });
          setHasOnboarded(true);
        }}
      />
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameProvider>
          <StatusBar style="light" />
          <AppContent />
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
