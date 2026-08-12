import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export function QuantityControl({ quantity, onIncrease, onDecrease, size = 'md' }: QuantityControlProps) {
  const btnSize = size === 'sm' ? 28 : 32;
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors['surface-container-low'],
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xs,
      }}
    >
      <TouchableOpacity
        onPress={onDecrease}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: colors['primary-container'],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="remove" size={iconSize} color={colors.white} />
      </TouchableOpacity>
      <Text style={[typography['label-md'], { color: colors['on-surface'], fontWeight: '700', paddingHorizontal: spacing.xs, minWidth: 24, textAlign: 'center' }]}>
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={onIncrease}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: colors['primary-container'],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="add" size={iconSize} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}
