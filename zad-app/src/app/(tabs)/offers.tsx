import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { exclusiveOffers, ExclusiveOffer } from '../../data/offersData';
import { ExclusiveOfferCard } from '../../components/cards/ExclusiveOfferCard';
import { FloatingCartButton } from '../../components/buttons/FloatingCartButton';
import { FadeInView } from '../../components/animations/FadeInView';
import { useCartStore } from '../../store/cartStore';

export default function OffersScreen() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const addItem = useCartStore((s) => s.addItem);

  const categories = [
    { id: 'all', name: 'جميع العروض', icon: 'local-offer' },
    { id: 'shawarma', name: 'شاورما', icon: 'local-fire-department' },
    { id: 'pizza', name: 'بيتزا', icon: 'local-pizza' },
    { id: 'burger', name: 'برجر', icon: 'lunch-dining' },
    { id: 'broasted', name: 'بروستد', icon: 'set-meal' },
    { id: 'dessert', name: 'حلويات', icon: 'icecream' },
  ];

  const filteredOffers = useMemo(() => {
    if (activeCategory === 'all') return exclusiveOffers;
    return exclusiveOffers.filter((o) => o.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = (offer: ExclusiveOffer) => {
    const menuItem = {
      id: offer.id,
      name: offer.title,
      description: offer.description,
      price: offer.offerPrice,
      imageUrl: offer.imageUrl,
      category: offer.category,
      restaurantId: offer.restaurantId,
    };
    addItem(menuItem, offer.restaurantId, offer.restaurantName);
    Alert.alert('تمت الإضافة للسلة 🛒', `تمت إضافة ${offer.title} من ${offer.restaurantName} بسعر ${offer.offerPrice.toLocaleString()} ل.س`);
  };

  const handleCopyCoupon = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Top Header */}
      <View
        style={{
          paddingHorizontal: spacing['container-margin'],
          paddingVertical: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors['surface-variant'],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <MaterialIcons name="local-fire-department" size={28} color={colors.primary} />
          <View>
            <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '800' }]}>
              العروض الحصرية
            </Text>
            <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
              أقوى التخفيضات والصفقات اليومية في السويداء 🔥
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/cart')}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors['surface-container-lowest'],
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors['outline-variant'],
          }}
        >
          <MaterialIcons name="shopping-bag" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Promotional Banner Box */}
        <View style={{ paddingHorizontal: spacing['container-margin'], marginTop: spacing.md }}>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.DEFAULT,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialCommunityIcons name="ticket-percent" size={20} color={colors.gold} />
                <Text style={[typography['title-lg'], { color: colors['on-primary'], fontWeight: '800' }]}>
                  كود الخصم الحصري: ZAD2026
                </Text>
              </View>
              <Text style={[typography['label-sm'], { color: 'rgba(255, 255, 255, 0.85)' }]}>
                توصيل مجاني على الطلب الأول لأي وجبة من العروض
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCopyCoupon}
              activeOpacity={0.8}
              style={{
                backgroundColor: copiedCode ? colors.gold : colors['on-primary'],
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: borderRadius.DEFAULT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '800' }]}>
                {copiedCode ? 'تم النسخ ✓' : 'نسخ الكود'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Filter Tabs */}
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing['container-margin'],
              gap: spacing.sm,
            }}
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 24,
                    backgroundColor: isSelected ? colors.primary : colors['surface-container-lowest'],
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.primary : colors['outline-variant'],
                  }}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={18}
                    color={isSelected ? colors['on-primary'] : colors.primary}
                  />
                  <Text
                    style={[
                      typography['label-md'],
                      {
                        color: isSelected ? colors['on-primary'] : colors['on-surface'],
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Offers Count Subtitle */}
        <View style={{ paddingHorizontal: spacing['container-margin'], marginBottom: spacing.md }}>
          <Text style={[typography['label-md'], { color: colors['on-surface-variant'], fontWeight: '700' }]}>
            متوفر حالياً ({filteredOffers.length}) عروض مميزة
          </Text>
        </View>

        {/* Offers Cards List */}
        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          {filteredOffers.map((offer, index) => (
            <FadeInView key={offer.id} delay={index * 80}>
              <ExclusiveOfferCard
                offer={offer}
                onAddToCart={() => handleAddToCart(offer)}
                onRestaurantPress={() => router.push(`/restaurant/${offer.restaurantId}`)}
              />
            </FadeInView>
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <FloatingCartButton onPress={() => router.push('/cart')} />
    </SafeAreaView>
  );
}
