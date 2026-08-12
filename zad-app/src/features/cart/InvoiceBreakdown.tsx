import { View, Text } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { formatPrice } from '../../utils/format';

interface InvoiceBreakdownProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function InvoiceBreakdown({ subtotal, deliveryFee, total }: InvoiceBreakdownProps) {
  return (
    <View style={{ backgroundColor: colors['surface-container-low'], borderRadius: borderRadius.DEFAULT, padding: spacing.lg, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[typography['label-md'], { color: colors['on-surface-variant'] }]}>المجموع الفرعي</Text>
        <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '700' }]}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[typography['label-md'], { color: colors['on-surface-variant'] }]}>رسوم التوصيل</Text>
        <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '700' }]}>{formatPrice(deliveryFee)}</Text>
      </View>
      <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.5)' }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[typography['headline-md'], { color: colors['on-surface'], fontWeight: '700' }]}>إجمالي الطلب</Text>
        <Text style={[typography['headline-md'], { color: colors.secondary, fontWeight: '800' }]}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
}
