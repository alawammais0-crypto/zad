import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { CategoryTabs } from '../../features/restaurant/CategoryTabs';
import { MenuItemCard } from '../../components/cards/MenuItemCard';
import { FloatingCartButton } from '../../components/buttons/FloatingCartButton';
import { FadeInView } from '../../components/animations/FadeInView';
import { useCartStore } from '../../store/cartStore';
import { MenuItem } from '../../types';

const menuItemsData: MenuItem[] = [
  {
    id: 'm1',
    restaurantId: '1',
    name: 'وجبة بيتزا سوبر سوبريم عائلية',
    description: 'صلصة طماطم فاخرة، جبنة موزاريلا إيطالية، ببروني، بصل، فلفل أخضر، وزيتون أسود',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85',
    category: 'بيتزا',
  },
  {
    id: 'm2',
    restaurantId: '1',
    name: 'بيتزا مارجريتا كلاسيك',
    description: 'صلصة طماطم طازجة، جبنة موزاريلا، أوراق ريحان وساق زيتون بكر ممتاز',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=85',
    category: 'بيتزا',
  },
  {
    id: 'm3',
    restaurantId: '1',
    name: 'بيتزا دجاج باربيكيو',
    description: 'قطع دجاج مشوي، صلصة باربيكيو مدخنة، بصل أحمر، وجبنة موزاريلا',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85',
    category: 'بيتزا',
  },
  {
    id: 'm4',
    restaurantId: '1',
    name: 'طبق شاورما عربي دبل',
    description: 'شاورما دجاج متبلة بالخلطة الشامية، مخلل، ثومية، بطاطا مقرمشة وخبر صاج محمص',
    price: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1000&q=85',
    category: 'وجبات',
  },
  {
    id: 'm5',
    restaurantId: '1',
    name: 'سندويش شاورما سوبر',
    description: 'خبز صاج، ثومية، مخلل ودجاج محمص على الفحم',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1000&q=85',
    category: 'سندويشات',
  },
  {
    id: 'm6',
    restaurantId: '1',
    name: 'عصير برتقال طازج 1L',
    description: 'عصير برتقال طبيعي 100% معصور طازجاً بدون إضافة سكر',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1000&q=85',
    category: 'مشروبات',
  },
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [activeCategory, setActiveCategory] = useState('بيتزا');
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const categories = ['بيتزا', 'وجبات', 'سندويشات', 'مشروبات'];

  const filteredItems = menuItemsData.filter((item) => item.category === activeCategory);

  const handleAddItem = (item: MenuItem) => {
    addItem(item, item.restaurantId, restaurantData.name);
  };

  const restaurantData = {
    name: 'مطعم البيتزا الذهبية',
    cuisine: 'بيتزا • إيطالي • وجبات سريعة',
    rating: 4.8,
    deliveryTime: '25-35 دقيقة',
    deliveryFee: 'مجاني',
    distance: '1.2 كم',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingHorizontal: spacing['container-margin'], paddingTop: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.85)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.85)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <MaterialIcons name="share" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={{ height: 288 }}>
          <Image
            source={{ uri: restaurantData.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
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
                <Text style={[typography['headline-md'], { color: colors.primary, marginBottom: spacing.xs }]}>{restaurantData.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={16} color={colors['on-surface-variant']} />
                  <Text style={[typography['label-md'], { color: colors['on-surface-variant'] }]}>{restaurantData.cuisine}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: colors['secondary-container'], paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.DEFAULT, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <MaterialIcons name="star" size={16} color={colors.secondary} />
                <Text style={[typography['label-md'], { color: colors['on-secondary-container'], fontWeight: '700' }]}>{restaurantData.rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors['surface-variant'], paddingTop: spacing.md, marginTop: spacing.md }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <MaterialIcons name="access-time" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurantData.deliveryTime}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <MaterialCommunityIcons name="moped" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurantData.deliveryFee}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <MaterialIcons name="location-on" size={20} color={colors.primary} style={{ marginBottom: spacing.xs }} />
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>{restaurantData.distance}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </View>

        <View style={{ paddingHorizontal: spacing['container-margin'], marginTop: spacing.lg, gap: spacing.lg }}>
          <Text style={[typography['headline-md'], { color: colors.primary }]}>{activeCategory}</Text>
          <View style={{ gap: spacing.gutter }}>
            {filteredItems.map((item, index) => (
              <FadeInView key={item.id} delay={index * 80}>
                <MenuItemCard item={item} onAdd={() => handleAddItem(item)} />
              </FadeInView>
            ))}
          </View>
        </View>
      </ScrollView>

      <FloatingCartButton onPress={() => router.push('/cart')} />
    </SafeAreaView>
  );
}
