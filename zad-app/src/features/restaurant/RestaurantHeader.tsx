import { View, Text, ImageBackground } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Restaurant } from '../../types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <View>
      <ImageBackground
        source={{ uri: restaurant.imageUrl }}
        style={{ height: 288 }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        />
      </ImageBackground>
      <View style={{ marginTop: -32, paddingHorizontal: spacing['container-margin'] }}>
        <View
          style={{
            backgroundColor: colors['surface-container-lowest'],
            borderRadius: borderRadius.DEFAULT,
            padding: spacing.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 4,
            borderWidth: 1,
            borderColor: 'rgba(226, 190, 187, 0.2)',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.base }}>
            <View>
              <Text style={[typography['headline-md'], { color: colors.primary, marginBottom: spacing.xs }]}>{restaurant.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={16} color={colors['on-surface-variant']} />
                <Text style={[typography['label-md'], { color: colors['on-surface-variant'] }]}>{restaurant.cuisine}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: colors['secondary-container'], paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.DEFAULT, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <MaterialIcons name="star" size={16} color={colors.secondary} />
              <Text style={[typography['label-md'], { color: colors['on-secondary-container'], fontWeight: '700' }]}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors['surface-variant'], paddingTop: spacing.md, marginTop: spacing.md }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <MaterialIcons name="access-time" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <MaterialCommunityIcons name="moped" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurant.deliveryFee}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <MaterialIcons name="location-on" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurant.distance}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
