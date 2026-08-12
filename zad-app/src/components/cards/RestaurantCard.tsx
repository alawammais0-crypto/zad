import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Restaurant } from '../../types';
import { RatingBadge } from '../ui/RatingBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{
        backgroundColor: colors['surface-container-lowest'],
        borderRadius: borderRadius.DEFAULT,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors['surface-container-high'],
        shadowColor: colors['primary-container'],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View style={{ height: 180, position: 'relative' }}>
        <Image source={{ uri: restaurant.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={{ position: 'absolute', top: spacing.md, right: spacing.md }}>
          <RatingBadge rating={restaurant.rating} />
        </View>
        {restaurant.isFreeDelivery && (
          <View style={{ position: 'absolute', bottom: spacing.md, left: spacing.md }}>
            <View style={{ backgroundColor: colors['primary-container'], paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm }}>
              <Text style={[typography['label-md'], { color: colors['on-primary-container'] }]}>توصيل مجاني</Text>
            </View>
          </View>
        )}
        {restaurant.badge && (
          <View style={{ position: 'absolute', bottom: spacing.md, left: spacing.md }}>
            <View style={{ backgroundColor: colors.error, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm }}>
              <Text style={[typography['label-md'], { color: colors['on-error'] }]}>{restaurant.badge}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ padding: spacing.md }}>
        <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>{restaurant.name}</Text>
        <Text style={[typography['body-md'], { color: colors['on-surface-variant'], marginTop: spacing.xs }]}>{restaurant.cuisine}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <MaterialIcons name="access-time" size={14} color={colors['on-surface-variant']} />
            <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurant.deliveryTime}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <MaterialIcons name="location-on" size={14} color={colors['on-surface-variant']} />
            <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurant.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
