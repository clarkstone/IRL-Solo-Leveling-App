import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onComplete: (name: string) => void;
}

const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const messages = [
    'You have been chosen.',
    'The System has detected your potential.',
    'From this moment, your life becomes a quest.',
    'Every rep, every page, every step\nwill forge your power.',
    'What is your name, Hunter?',
  ];

  const handleNext = () => {
    if (step < messages.length - 1) {
      setStep(step + 1);
    }
  };

  const handleStart = () => {
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  const isNameStep = step === messages.length - 1;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Glowing border effect */}
      <View style={styles.glowBorder} />

      <View style={styles.content}>
        {/* System notification style */}
        <View style={styles.systemBadge}>
          <Text style={styles.systemBadgeText}>SYSTEM</Text>
        </View>

        <Text style={styles.messageText}>{messages[step]}</Text>

        {isNameStep ? (
          <View style={styles.nameSection}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              maxLength={20}
            />
            <TouchableOpacity
              style={[styles.startBtn, !name.trim() && styles.startBtnDisabled]}
              onPress={handleStart}
              disabled={!name.trim()}
            >
              <Text style={styles.startBtnText}>ARISE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {step === 0 ? 'Continue' : '▶'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Progress dots */}
        <View style={styles.dots}>
          {messages.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
            />
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  content: {
    width: width * 0.85,
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  systemBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xxl,
  },
  systemBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: FONTS.sizes.sm,
    letterSpacing: 4,
  },
  messageText: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '600',
    marginBottom: SPACING.xxxl,
  },
  nameSection: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xl,
    textAlign: 'center',
    fontWeight: '700',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  startBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  startBtnDisabled: {
    opacity: 0.3,
  },
  startBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.xl,
    fontWeight: '900',
    letterSpacing: 6,
  },
  nextBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  nextBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.xxxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLighter,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  dotDone: {
    backgroundColor: COLORS.primaryDark,
  },
});

export default OnboardingScreen;
