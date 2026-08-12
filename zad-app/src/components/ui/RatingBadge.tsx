import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md';
}

export function RatingBadge({ rating, size = 'sm' }: RatingBadgeProps) {
  const isSmall = size === 'sm';
  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
      }}
    >
      <MaterialIcons name="star" size={isSmall ? 14 : 16} color={colors.secondary} />
      <Text style={[isSmall ? typography['label-sm'] : typography['label-md'], { color: colors['on-surface'], fontWeight: '700' }]}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}
