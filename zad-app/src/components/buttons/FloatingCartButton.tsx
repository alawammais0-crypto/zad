import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/format';

interface FloatingCartButtonProps {
  onPress: () => void;
}

export function FloatingCartButton({ onPress }: FloatingCartButtonProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotal());
  const count = useCartStore((s) => s.getItemCount());

  if (items.length === 0) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 85,
        left: spacing['container-margin'],
        zIndex: 99,
        pointerEvents: 'box-none',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          backgroundColor: colors.primary,
          height: 52,
          paddingHorizontal: spacing.md,
          borderRadius: 26,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
          borderWidth: 2,
          borderColor: colors.gold,
        }}
      >
        {/* Cart Icon with badge count */}
        <View style={{ position: 'relative' }}>
          <MaterialIcons name="shopping-bag" size={24} color={colors['on-primary']} />
          <View
            style={{
              position: 'absolute',
              top: -6,
              right: -8,
              backgroundColor: colors.secondary,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
              borderWidth: 1.5,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 10, fontWeight: '900' }}>
              {count}
            </Text>
          </View>
        </View>

        {/* Total Price & Label */}
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text style={[typography['label-sm'], { color: 'rgba(255, 255, 255, 0.8)', fontSize: 10, lineHeight: 12 }]}>
            السلة
          </Text>
          <Text style={[typography['label-md'], { color: colors['on-primary'], fontWeight: '800', fontSize: 13, lineHeight: 16 }]}>
            {formatPrice(total)}
          </Text>
        </View>

        <MaterialIcons name="chevron-left" size={18} color={colors['on-primary']} />
      </TouchableOpacity>
    </View>
  );
}
