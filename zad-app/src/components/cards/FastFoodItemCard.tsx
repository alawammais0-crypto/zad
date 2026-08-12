import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { FastFoodProduct } from '../../data/fastfoodData';
import { formatPrice } from '../../utils/format';

interface FastFoodItemCardProps {
  item: FastFoodProduct;
  onAdd: () => void;
  onRestaurantPress?: () => void;
}

export function FastFoodItemCard({ item, onAdd, onRestaurantPress }: FastFoodItemCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors['surface-container-lowest'],
        borderRadius: borderRadius.DEFAULT,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors['outline-variant'],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {/* Left Side: Details */}
        <View style={{ flex: 1, padding: spacing.md, justifyContent: 'space-between' }}>
          <View>
            {/* Restaurant Badge - "من أي مطعم" */}
            <TouchableOpacity
              onPress={onRestaurantPress}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
                marginBottom: spacing.xs,
                backgroundColor: colors['surface-container-low'],
                alignSelf: 'flex-start',
                paddingHorizontal: spacing.sm,
                paddingVertical: 3,
                borderRadius: borderRadius.DEFAULT,
                borderWidth: 1,
                borderColor: 'rgba(120, 23, 27, 0.15)',
              }}
            >
              <MaterialCommunityIcons name="storefront-outline" size={14} color={colors.primary} />
              <Text
                style={[
                  typography['label-sm'],
                  { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {item.restaurantName}
              </Text>
            </TouchableOpacity>

            {/* Product Title */}
            <Text
              style={[
                typography['title-lg'],
                { color: colors['on-surface'], fontWeight: '700', marginBottom: spacing.xs },
              ]}
            >
              {item.name}
            </Text>

            {/* Description */}
            <Text
              style={[
                typography['label-sm'],
                { color: colors['on-surface-variant'], lineHeight: 18 },
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          {/* Bottom Bar: Price & Add Button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: spacing.md,
              paddingTop: spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors['surface-variant'],
            }}
          >
            <View style={{ gap: 2 }}>
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
                السعر
              </Text>
              <Text
                style={[
                  typography['title-lg'],
                  { color: colors.primary, fontWeight: '800' },
                ]}
              >
                {formatPrice(item.price)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onAdd}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.DEFAULT,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <MaterialIcons name="add-shopping-cart" size={18} color={colors['on-primary']} />
              <Text style={[typography['label-md'], { color: colors['on-primary'], fontWeight: '700' }]}>
                إضافة
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Image with Rating & Delivery Info */}
        <View style={{ width: 125, height: '100%', position: 'relative' }}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: '100%', height: '100%', minHeight: 140 }}
            resizeMode="cover"
          />
          {/* Rating Badge */}
          <View
            style={{
              position: 'absolute',
              top: spacing.xs,
              right: spacing.xs,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
              borderRadius: borderRadius.DEFAULT,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <MaterialIcons name="star" size={12} color={colors.secondary} />
            <Text style={[typography['label-sm'], { color: colors['on-surface'], fontWeight: '800' }]}>
              {item.restaurantRating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
