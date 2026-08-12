import { View, Text } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { CartItem } from '../../types';
import { CartItemCard } from '../../components/cards/CartItemCard';

interface CartSummaryProps {
  items: CartItem[];
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
}

export function CartSummary({ items, onIncrease, onDecrease }: CartSummaryProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <Text style={[typography['title-lg'], { color: colors['on-surface-variant'] }]}>الطلبات</Text>
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
        />
      ))}
    </View>
  );
}
