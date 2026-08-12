import React from 'react';
import { View, Text } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface BentoCardProps {
  icon: string | React.ReactNode;
  label: string;
  variant?: 'default' | 'gold' | 'primary';
}

export function BentoCard({ icon, label, variant = 'default' }: BentoCardProps) {
  const iconBgMap = {
    default: 'rgba(254, 214, 91, 0.25)',
    gold: 'rgba(254, 214, 91, 0.25)',
    primary: 'rgba(166, 30, 34, 0.1)',
  };

  const iconColorMap = {
    default: colors.secondary,
    gold: colors.secondary,
    primary: colors.primary,
  };

  return (
    <View
      style={{
        backgroundColor: colors['surface-container-low'],
        padding: spacing.md,
        borderRadius: borderRadius.xl || 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(226, 190, 187, 0.3)',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: iconBgMap[variant],
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}
      >
        {typeof icon === 'string' ? (
          <Text style={{ fontSize: 24, color: iconColorMap[variant] }}>{icon}</Text>
        ) : (
          icon
        )}
      </View>
      <Text
        style={[
          typography['label-md'],
          { color: colors.primary, fontWeight: '700', textAlign: 'center' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

