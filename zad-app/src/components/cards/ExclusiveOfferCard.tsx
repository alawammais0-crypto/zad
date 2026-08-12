import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ExclusiveOffer } from '../../data/offersData';
import { formatPrice } from '../../utils/format';

interface ExclusiveOfferCardProps {
  offer: ExclusiveOffer;
  onAddToCart: () => void;
  onRestaurantPress?: () => void;
}

export function ExclusiveOfferCard({ offer, onAddToCart, onRestaurantPress }: ExclusiveOfferCardProps) {
  return (
    <View
      style={{
        borderRadius: borderRadius.DEFAULT,
        overflow: 'hidden',
        backgroundColor: colors['surface-container-lowest'],
        borderWidth: 1,
        borderColor: offer.isPopular ? 'rgba(120, 23, 27, 0.3)' : colors['outline-variant'],
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: offer.isPopular ? 0.12 : 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: spacing.lg,
      }}
    >
      {/* Top Banner Image with Badges */}
      <ImageBackground
        source={{ uri: offer.imageUrl }}
        style={{ height: 180, width: '100%', justifyContent: 'space-between', padding: spacing.md }}
        resizeMode="cover"
      >
        {/* Dark Gradient Overlay simulation using background color */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.38)',
          }}
        />

        {/* Top Badges */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          {/* Discount Percentage Badge */}
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <MaterialIcons name="local-fire-department" size={16} color={colors['on-primary']} />
            <Text style={[typography['label-md'], { color: colors['on-primary'], fontWeight: '800' }]}>
              خصم %{offer.discountPercentage}
            </Text>
          </View>

          {/* Restaurant Badge */}
          <TouchableOpacity
            onPress={onRestaurantPress}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <MaterialCommunityIcons name="storefront-outline" size={14} color={colors.primary} />
            <Text style={[typography['label-sm'], { color: colors.primary, fontWeight: '800' }]}>
              {offer.restaurantName}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Left Badge at bottom of image */}
        <View style={{ alignSelf: 'flex-start', zIndex: 2 }}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              paddingHorizontal: spacing.sm,
              paddingVertical: 3,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <MaterialIcons name="access-time" size={14} color={colors.gold} />
            <Text style={[typography['label-sm'], { color: colors.white, fontWeight: '600' }]}>
              {offer.timeLeft}
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Card Content Area */}
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        {/* Special Offer Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[typography['title-lg'], { color: colors['on-surface'], fontWeight: '800' }]}>
            {offer.title}
          </Text>
          <View style={{ backgroundColor: colors['secondary-container'], paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: borderRadius.DEFAULT }}>
            <Text style={[typography['label-sm'], { color: colors['on-secondary-container'], fontWeight: '700' }]}>
              {offer.badge}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[typography['label-sm'], { color: colors['on-surface-variant'], lineHeight: 20 }]}>
          {offer.description}
        </Text>

        {/* Price & Action Row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: spacing.md,
            paddingTop: spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors['surface-variant'],
          }}
        >
          {/* Prices */}
          <View>
            <Text style={{ textDecorationLine: 'line-through', color: colors['on-surface-variant'], fontSize: 13 }}>
              {formatPrice(offer.originalPrice)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '900' }]}>
                {formatPrice(offer.offerPrice)}
              </Text>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={onAddToCart}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.DEFAULT,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <MaterialIcons name="add-shopping-cart" size={20} color={colors['on-primary']} />
            <Text style={[typography['label-md'], { color: colors['on-primary'], fontWeight: '800' }]}>
              اطلب العرض الآن
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';
