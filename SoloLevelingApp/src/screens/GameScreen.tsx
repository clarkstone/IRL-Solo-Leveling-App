import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, StatusBar, Platform } from 'react-native';
import { useGame } from '../store/GameContext';
import { COLORS } from '../theme';
import { getDungeonById } from '../data/dungeons';
import { getEnemyTemplate, createEnemy } from '../data/enemies';
import { getSkillById } from '../data/skills';
import { createItemFromTemplate } from '../data/items';
import { generateGameHTML, GameConfig } from '../game/gameHTML_v2';
import {
  calculateAttackPower, calculateDefense, calculateSpeed,
  calculateCritRate, calculateDodgeRate,
} from '../store/storage';
import { Item, DungeonStage } from '../types';

// Conditionally import WebView only on native
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    // WebView not available
  }
}

function useGameConfig(player: any, dungeon: DungeonStage) {
  const weaponBonus = player.equippedWeapon?.statBonus.attackPower || 0;
  const armorBonus = player.equippedArmor?.statBonus.defense || 0;

  const skills = player.equippedSkills
    .map((id: string) => getSkillById(id))
    .filter(Boolean)
    .filter((s: any) => s.type === 'active')
    .map((s: any) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      damage: s.damage,
      mpCost: s.mpCost,
      cooldown: s.cooldown,
      element: s.element,
    }));

  const waves: GameConfig['waves'] = [];
  for (let w = 0; w < dungeon.waves; w++) {
    const isLastWave = w === dungeon.waves - 1;
    const waveEnemies: GameConfig['waves'][0]['enemies'] = [];

    if (isLastWave) {
      const bossTemplate = getEnemyTemplate(dungeon.bossId);
      if (bossTemplate) {
        waveEnemies.push({
          id: bossTemplate.id, name: bossTemplate.name, icon: bossTemplate.icon,
          hp: bossTemplate.maxHp, maxHp: bossTemplate.maxHp,
          attack: bossTemplate.attack, defense: bossTemplate.defense,
          speed: bossTemplate.speed, isBoss: true,
        });
      }
      for (let i = 0; i < 2; i++) {
        const eid = dungeon.enemyIds[i % dungeon.enemyIds.length];
        const et = getEnemyTemplate(eid);
        if (et) {
          waveEnemies.push({
            id: et.id, name: et.name, icon: et.icon,
            hp: et.maxHp, maxHp: et.maxHp,
            attack: et.attack, defense: et.defense, speed: et.speed, isBoss: false,
          });
        }
      }
    } else {
      const enemyCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < enemyCount; i++) {
        const eid = dungeon.enemyIds[Math.floor(Math.random() * dungeon.enemyIds.length)];
        const et = getEnemyTemplate(eid);
        if (et) {
          const scale = 1 + (w * 0.1);
          waveEnemies.push({
            id: et.id, name: et.name, icon: et.icon,
            hp: Math.floor(et.maxHp * scale), maxHp: Math.floor(et.maxHp * scale),
            attack: Math.floor(et.attack * scale), defense: Math.floor(et.defense * scale),
            speed: et.speed, isBoss: false,
          });
        }
      }
    }
    waves.push({ enemies: waveEnemies });
  }

  return {
    playerHp: player.hp,
    playerMaxHp: player.maxHp,
    playerMp: player.mp,
    playerMaxMp: player.maxMp,
    playerAttack: calculateAttackPower(player.stats.strength, weaponBonus),
    playerDefense: calculateDefense(player.stats.vitality, armorBonus),
    playerSpeed: calculateSpeed(player.stats.agility),
    playerCritRate: calculateCritRate(player.stats.sense, player.stats.agility),
    playerDodgeRate: calculateDodgeRate(player.stats.agility),
    skills,
    waves,
    dungeonName: dungeon.name,
    backgroundTheme: dungeon.backgroundTheme,
  } as GameConfig;
}

// Web iframe component
const WebGameView: React.FC<{ html: string; onGameMessage: (data: any) => void }> = ({ html, onGameMessage }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'victory' || data.type === 'defeat') {
          onGameMessage(data);
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onGameMessage]);

  // Modify the HTML to use window.parent.postMessage instead of ReactNativeWebView
  const webHtml = html.replace(
    'window.ReactNativeWebView.postMessage(msg)',
    'window.parent.postMessage(msg, "*")'
  );

  return (
    <iframe
      ref={iframeRef}
      srcDoc={webHtml}
      style={{ flex: 1, border: 'none', width: '100%', height: '100%' } as any}
      allow="autoplay"
    />
  );
};

// Native WebView component
const NativeGameView: React.FC<{ html: string; onMessage: (event: any) => void }> = ({ html, onMessage }) => {
  if (!WebView) return null;
  return (
    <WebView
      source={{ html }}
      style={styles.webview}
      scrollEnabled={false}
      bounces={false}
      onMessage={onMessage}
      javaScriptEnabled
      domStorageEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      overScrollMode="never"
    />
  );
};

const GameScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { state, dispatch } = useGame();
  const { player } = state;
  const { dungeonId } = route.params;

  const dungeon = getDungeonById(dungeonId);
  if (!dungeon) {
    Alert.alert('Error', 'Dungeon not found');
    navigation.goBack();
    return null;
  }

  const gameConfig = useGameConfig(player, dungeon);
  const html = generateGameHTML(gameConfig);

  const processGameResult = useCallback((data: any) => {
    if (data.type === 'victory') {
      const drops: Item[] = [];

      dungeon.rewards.guaranteedDrops.forEach(templateId => {
        const item = createItemFromTemplate(templateId);
        if (item) drops.push(item);
      });

      dungeon.rewards.possibleDrops.forEach(drop => {
        if (Math.random() < drop.chance) {
          const item = createItemFromTemplate(drop.itemTemplateId);
          if (item) drops.push(item);
        }
      });

      dispatch({
        type: 'COMPLETE_DUNGEON',
        payload: {
          dungeonId: dungeon.id,
          rewards: {
            exp: dungeon.rewards.exp + (data.exp || 0),
            gold: dungeon.rewards.gold + (data.gold || 0),
            statPoints: 2,
            skillUnlockId: dungeon.rewards.skillUnlockId,
          },
          drops,
        },
      });

      const dropNames = drops.map(d => `${d.icon} ${d.name}`).join('\n');
      Alert.alert(
        'Dungeon Cleared!',
        `${dungeon.name} conquered!\n\n+${dungeon.rewards.exp + (data.exp || 0)} EXP\n+${dungeon.rewards.gold + (data.gold || 0)} Gold\n+2 Stat Points\n${dungeon.rewards.skillUnlockId ? 'New Skill Unlocked!\n' : ''}\nLoot:\n${dropNames || 'No drops'}`,
        [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
      );
    } else if (data.type === 'defeat') {
      Alert.alert(
        'Defeated',
        'You have been slain. Train harder, upgrade your stats, and try again!',
        [{ text: 'Retreat', onPress: () => navigation.goBack() }]
      );
    }
  }, [dungeon, dispatch, navigation]);

  const handleNativeMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      processGameResult(data);
    } catch (e) {
      console.error('Game message error:', e);
    }
  }, [processGameResult]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {Platform.OS === 'web' ? (
        <WebGameView html={html} onGameMessage={processGameResult} />
      ) : (
        <NativeGameView html={html} onMessage={handleNativeMessage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default GameScreen;
