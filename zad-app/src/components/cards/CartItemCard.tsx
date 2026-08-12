import { View, Text, Image } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { CartItem } from '../../types';
import { QuantityControl } from '../buttons/QuantityControl';
import { formatPrice } from '../../utils/format';

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function CartItemCard({ item, onIncrease, onDecrease }: CartItemCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors['surface-container-lowest'],
        borderRadius: borderRadius.DEFAULT,
        padding: spacing.md,
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors['outline-variant'],
        shadowColor: colors['primary-container'],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View style={{ width: 72, height: 72, borderRadius: borderRadius.DEFAULT, overflow: 'hidden', backgroundColor: colors['surface-container'] }}>
        <Image source={{ uri: item.menuItem.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '700' }]}>{item.menuItem.name}</Text>
        <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{item.menuItem.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
          <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>{formatPrice(item.menuItem.price)}</Text>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
}
