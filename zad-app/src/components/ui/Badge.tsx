import { View, Text } from 'react-native';
import { colors, borderRadius, typography, spacing } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'gold' | 'error' | 'offer' | 'rating' | 'delivery';
  filled?: boolean;
}

export function Badge({ label, variant = 'primary', filled = true }: BadgeProps) {
  const bgMap = {
    primary: colors['primary-container'],
    gold: colors['secondary-container'],
    error: colors.error,
    offer: colors['secondary-container'],
    rating: 'rgba(255,255,255,0.9)',
    delivery: colors['primary-container'],
  };

  const textMap = {
    primary: colors.white,
    gold: colors['on-secondary-container'],
    error: colors['on-error'],
    offer: colors['on-secondary-container'],
    rating: colors['on-surface'],
    delivery: colors['on-primary-container'],
  };

  return (
    <View
      style={{
        backgroundColor: filled ? bgMap[variant] : 'transparent',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: filled ? borderRadius.DEFAULT : borderRadius.full,
        borderWidth: filled ? 0 : 1,
        borderColor: bgMap[variant],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
      }}
    >
      <Text style={[typography['label-sm'], { color: textMap[variant] }]}>{label}</Text>
    </View>
  );
}
