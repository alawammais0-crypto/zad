import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/format';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: () => void;
}

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors['surface-container-lowest'],
        borderRadius: borderRadius.DEFAULT,
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors['outline-variant'],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <View style={{ flex: 1, padding: spacing.md, justifyContent: 'space-between' }}>
        <View>
          <Text style={[typography['title-lg'], { color: colors['on-surface'], marginBottom: spacing.xs }]}>{item.name}</Text>
          <Text style={[typography['body-md'], { color: colors['on-surface-variant'] }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }}>
          <Text style={[typography['title-lg'], { color: colors.primary }]}>{formatPrice(item.price)}</Text>
          <TouchableOpacity
            onPress={onAdd}
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.DEFAULT,
              backgroundColor: colors['primary-container'],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="add" size={24} color={colors['on-primary-container']} />
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 120, height: 120 }}
        resizeMode="cover"
      />
    </View>
  );
}
