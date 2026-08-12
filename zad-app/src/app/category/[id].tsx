import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { fastFoodCategories, fastFoodProducts, FastFoodProduct, FastFoodCategory } from '../../data/fastfoodData';
import { FastFoodItemCard } from '../../components/cards/FastFoodItemCard';
import { FloatingCartButton } from '../../components/buttons/FloatingCartButton';
import { FadeInView } from '../../components/animations/FadeInView';
import { useCartStore } from '../../store/cartStore';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  
  // Default active category ID (if 'all' or undefined, show all)
  const initialCategory = id || 'all';
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const addItem = useCartStore((s) => s.addItem);

  // Active Category Object
  const currentCategory = useMemo(() => {
    return fastFoodCategories.find((c) => c.id === activeCategoryId);
  }, [activeCategoryId]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return fastFoodProducts.filter((product) => {
      const matchesCategory =
        activeCategoryId === 'all' || product.categoryId === activeCategoryId;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryId, searchQuery]);

  const handleAddToCart = (product: FastFoodProduct) => {
    const menuItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.categoryName,
      restaurantId: product.restaurantId,
    };
    addItem(menuItem, product.restaurantId, product.restaurantName);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header Bar */}
      <View
        style={{
          paddingHorizontal: spacing['container-margin'],
          paddingVertical: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors['surface-variant'],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
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
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '800' }]}>
              {activeCategoryId === 'all' ? 'جميع الوجبات' : currentCategory?.name || 'الأصناف'}
            </Text>
            <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
              {filteredProducts.length} وجبة متوفرة من عدة مطاعم
            </Text>
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

        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors['surface-container-lowest'],
            borderRadius: borderRadius.DEFAULT,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            marginTop: spacing.md,
            borderWidth: 1,
            borderColor: colors['outline-variant'],
          }}
        >
          <MaterialIcons name="search" size={22} color={colors.primary} style={{ marginLeft: spacing.xs }} />
          <TextInput
            placeholder="ابحث عن وجبة، بيتزا، أو اسم مطعم..."
            placeholderTextColor={colors['on-surface-variant']}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              typography['body-md'],
              {
                flex: 1,
                color: colors['on-surface'],
                paddingVertical: spacing.xs,
                textAlign: 'right',
              },
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Horizontal Category Selector */}
        <View style={{ marginVertical: spacing.md }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing['container-margin'],
              gap: spacing.sm,
            }}
          >
            {/* 'All' pill */}
            <TouchableOpacity
              onPress={() => setActiveCategoryId('all')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 24,
                backgroundColor:
                  activeCategoryId === 'all' ? colors.primary : colors['surface-container-lowest'],
                borderWidth: 1.5,
                borderColor:
                  activeCategoryId === 'all' ? colors.primary : colors['outline-variant'],
              }}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={18}
                color={activeCategoryId === 'all' ? colors['on-primary'] : colors.primary}
              />
              <Text
                style={[
                  typography['label-md'],
                  {
                    color: activeCategoryId === 'all' ? colors['on-primary'] : colors['on-surface'],
                    fontWeight: activeCategoryId === 'all' ? '800' : '600',
                  },
                ]}
              >
                الكل
              </Text>
            </TouchableOpacity>

            {/* Category pills */}
            {fastFoodCategories.map((cat) => {
              const isSelected = activeCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategoryId(cat.id)}
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
                  <MaterialCommunityIcons
                    name={cat.iconName}
                    size={18}
                    color={isSelected ? colors['on-primary'] : cat.color === 'gold' ? colors.secondary : colors.primary}
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

        {/* Banner Info for Selected Category */}
        {currentCategory && (
          <View
            style={{
              marginHorizontal: spacing['container-margin'],
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: colors['surface-container-low'],
              borderRadius: borderRadius.DEFAULT,
              borderRightWidth: 4,
              borderRightColor: currentCategory.color === 'gold' ? colors.secondary : colors.primary,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <MaterialCommunityIcons
                name={currentCategory.iconName}
                size={24}
                color={currentCategory.color === 'gold' ? colors.secondary : colors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>
                  قسم {currentCategory.name}
                </Text>
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
                  {currentCategory.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Product Items List */}
        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          {filteredProducts.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: spacing.md }}>
              <MaterialCommunityIcons name="food-off" size={48} color={colors['on-surface-variant']} />
              <Text style={[typography['title-lg'], { color: colors['on-surface-variant'], textAlign: 'center' }]}>
                لا توجد وجبات تطابق البحث في هذا الصنف حالياً
              </Text>
            </View>
          ) : (
            filteredProducts.map((product, index) => (
              <FadeInView key={product.id} delay={index * 60}>
                <FastFoodItemCard
                  item={product}
                  onAdd={() => handleAddToCart(product)}
                  onRestaurantPress={() => router.push(`/restaurant/${product.restaurantId}`)}
                />
              </FadeInView>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <FloatingCartButton onPress={() => router.push('/cart')} />
    </SafeAreaView>
  );
}
