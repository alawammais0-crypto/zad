import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost';
  icon?: string | React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

export function PrimaryButton({ title, onPress, variant = 'primary', icon, style, disabled }: PrimaryButtonProps) {
  const bgMap = {
    primary: colors['primary-container'],
    gold: colors.gold,
    outline: 'transparent',
    ghost: 'transparent',
  };

  const textMap = {
    primary: colors['on-primary'],
    gold: colors.white,
    outline: colors['primary-container'],
    ghost: colors['primary-container'],
  };

  const borderMap = {
    primary: 'transparent',
    gold: 'transparent',
    outline: colors['primary-container'],
    ghost: 'transparent',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: bgMap[variant],
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.DEFAULT,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: borderMap[variant],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && (
        typeof icon === 'string' ? (
          <Text style={{ fontSize: 20, color: textMap[variant] }}>{icon}</Text>
        ) : (
          icon
        )
      )}
      <Text style={[typography['title-lg'], { color: textMap[variant], textAlign: 'center' }]}>{title}</Text>
    </TouchableOpacity>
  );
}
