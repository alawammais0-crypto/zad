import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { useAuthStore } from '../store/authStore';
import { CartItemCard } from '../components/cards/CartItemCard';
import { InvoiceBreakdown } from '../features/cart/InvoiceBreakdown';

const DELIVERY_FEE = 3000;

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getTotal());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const restaurantName = useCartStore((s) => s.restaurantName) || 'مطعم رويال بالاس';
  
  const addOrder = useOrdersStore((s) => s.addOrder);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const profile = useAuthStore((s) => s.profile);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const handleCheckout = () => {
    if (items.length === 0) return;

    addOrder({
      restaurantName,
      restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90',
      items: items.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price,
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      status: 'preparing',
      statusText: 'جاري تحضير طلبك في المطعم 👨‍🍳',
      estimatedTime: '25-35 دقيقة',
      deliveryAddress: 'السويداء - العجيلات (بجانب مدرسة المتفوقين)',
    });

    const earnedPoints = Math.floor(total / 100);
    updateProfile({
      orders: (profile?.orders || 0) + 1,
      points: (profile?.points || 0) + earnedPoints,
    });

    clearCart();
    router.push('/(tabs)/orders');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing['container-margin'],
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors['surface-container-high'],
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700' }]}>سلة التسوق</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <MaterialIcons name="search" size={22} color={colors['on-surface-variant']} />
          <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.primary, overflow: 'hidden' }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing['container-margin'], paddingTop: spacing.lg, paddingBottom: 200, gap: spacing.lg }}
      >
        {items.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <MaterialIcons name="shopping-cart" size={64} color={colors['outline-variant']} style={{ marginBottom: spacing.md }} />
            <Text style={[typography['headline-md'], { color: colors['on-surface'], textAlign: 'center' }]}>سلتك فارغة</Text>
            <Text style={[typography['body-md'], { color: colors['on-surface-variant'], textAlign: 'center', marginTop: spacing.sm }]}>
              أضف بعض الأطباق اللذيذة من المطاعم
            </Text>
          </View>
        ) : (
          <>
            <View style={{ gap: spacing.md }}>
              <Text style={[typography['title-lg'], { color: colors['on-surface-variant'] }]}>الطلبات</Text>
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                />
              ))}
            </View>

            <View style={{ gap: spacing.md }}>
              <Text style={[typography['title-lg'], { color: colors['on-surface-variant'] }]}>تفاصيل التوصيل</Text>
              <View
                style={{
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.DEFAULT,
                  padding: spacing.md,
                  gap: spacing.md,
                  borderWidth: 1,
                  borderColor: 'rgba(226, 190, 187, 0.1)',
                  shadowColor: colors['primary-container'],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <MaterialIcons name="location-on" size={22} color={colors.primary} style={{ marginTop: spacing.xs }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[typography['label-md'], { color: colors['on-surface'], fontWeight: '700' }]}>السويداء - العجيلات</Text>
                    <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>بجانب مدرسة المتفوقين، بناء الياسمين ط3</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '700' }]}>تعديل</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.3)' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <MaterialIcons name="access-time" size={22} color={colors.primary} />
                  <Text style={[typography['body-md'], { color: colors['on-surface'] }]}>
                    وقت التوصيل المقدر: <Text style={{ fontWeight: '700' }}>35 - 45 دقيقة</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ gap: spacing.md }}>
              <Text style={[typography['title-lg'], { color: colors['on-surface-variant'] }]}>طريقة الدفع</Text>
              <View
                style={{
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.DEFAULT,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: 'rgba(226, 190, 187, 0.1)',
                  shadowColor: colors['primary-container'],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <MaterialIcons name="payments" size={22} color={colors.primary} />
                    <Text style={[typography['label-md'], { color: colors['on-surface'], fontWeight: '700' }]}>الدفع نقداً عند الاستلام</Text>
                  </View>
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors['primary-container'] }} />
                  </View>
                </View>
              </View>
            </View>

            <InvoiceBreakdown subtotal={subtotal} deliveryFee={DELIVERY_FEE} total={total} />
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing['container-margin'],
            paddingBottom: spacing['container-margin'],
            paddingTop: spacing.md,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleCheckout}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: spacing.md,
              borderRadius: borderRadius.DEFAULT,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
            }}
          >
            <Text style={[typography['headline-md'], { color: colors['on-primary'], fontWeight: '700' }]}>تأكيد الطلب والدفع</Text>
            <MaterialIcons name="arrow-forward" size={24} color={colors['on-primary']} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.md, marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(226, 190, 187, 0.1)' }}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={{ alignItems: 'center' }}>
              <Ionicons name="home-outline" size={22} color={colors['on-surface-variant']} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>الرئيسية</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/orders')} style={{ alignItems: 'center' }}>
              <Ionicons name="receipt-outline" size={22} color={colors['on-surface-variant']} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>الطلبات</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/offers')} style={{ alignItems: 'center' }}>
              <Ionicons name="pricetag" size={22} color={colors.primary} />
              <Text style={[typography['label-sm'], { color: colors.primary, fontWeight: '700' }]}>العروض</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.secondary, marginTop: spacing.xs }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={{ alignItems: 'center' }}>
              <Ionicons name="person-outline" size={22} color={colors['on-surface-variant']} />
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>حسابي</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
