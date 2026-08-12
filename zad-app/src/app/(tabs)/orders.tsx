import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useOrdersStore, Order } from '../../store/ordersStore';
import { useCartStore } from '../../store/cartStore';

export default function OrdersScreen() {
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);
  const cancelOrder = useOrdersStore((s) => s.cancelOrder);
  const addItem = useCartStore((s) => s.addItem);

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter(
    (o) => o.status === 'preparing' || o.status === 'on_the_way'
  );
  const historyOrders = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  const handleReorder = (order: Order) => {
    order.items.forEach((item, idx) => {
      addItem({
        id: `reorder-${order.id}-${idx}`,
        name: item.name,
        description: 'إعادة طلب سابق',
        price: item.price,
        imageUrl: order.restaurantImage,
        category: 'عام',
        restaurantId: '1',
      });
    });
    Alert.alert('إعادة الطلب', 'تمت إضافة عناصر الطلب إلى سلة التسوق! 🛒');
    router.push('/cart');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return colors.secondary;
      case 'on_the_way':
        return colors.primary;
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Header */}
      <View
        style={{
          paddingHorizontal: spacing['container-margin'],
          paddingVertical: spacing.md,
          backgroundColor: colors['surface-container-lowest'],
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700', marginBottom: spacing.md }]}>
          طلباتي
        </Text>

        {/* Tabs Switcher */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors['surface-container-high'],
            borderRadius: borderRadius.md,
            padding: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={{
              flex: 1,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === 'active' ? colors.primary : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                typography['title-md'],
                {
                  color: activeTab === 'active' ? '#fff' : colors['on-surface-variant'],
                  fontWeight: '700',
                  fontSize: 15,
                },
              ]}
            >
              الطلبات الحالية ({activeOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={{
              flex: 1,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === 'history' ? colors.primary : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                typography['title-md'],
                {
                  color: activeTab === 'history' ? '#fff' : colors['on-surface-variant'],
                  fontWeight: '700',
                  fontSize: 15,
                },
              ]}
            >
              سجل الطلبات السابقة ({historyOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders Content List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing['container-margin'],
          paddingTop: spacing.md,
          paddingBottom: 120,
        }}
      >
        {displayedOrders.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <MaterialIcons name="receipt-long" size={64} color={colors['outline-variant']} style={{ marginBottom: spacing.md }} />
            <Text style={[typography['headline-md'], { color: colors['on-surface'], textAlign: 'center' }]}>
              {activeTab === 'active' ? 'لا توجد طلبات نشطة حالياً' : 'لا يوجد سجل طلبات سابقة'}
            </Text>
            <Text style={[typography['body-md'], { color: colors['on-surface-variant'], textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg }]}>
              تصفح أشهى الوجبات والمطاعم واطلب الآن
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/home')}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                borderRadius: borderRadius.md,
              }}
            >
              <Text style={[typography['title-md'], { color: '#fff', fontWeight: '700' }]}>تصفح المطاعم</Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayedOrders.map((order) => (
            <View
              key={order.id}
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.md,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.08)',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              {/* Order Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Image
                    source={{ uri: order.restaurantImage }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                  <View>
                    <Text style={[typography['title-md'], { fontWeight: '700' }]}>{order.restaurantName}</Text>
                    <Text style={[typography['body-sm'], { color: colors['on-surface-variant'] }]}>
                      {order.orderNumber} • {order.createdAt}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={{
                    backgroundColor: `${getStatusColor(order.status)}15`,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                  }}
                >
                  <Text style={[typography['label-sm'], { color: getStatusColor(order.status), fontWeight: '700' }]}>
                    {order.statusText}
                  </Text>
                </View>
              </View>

              {/* Progress Steps (for active orders) */}
              {(order.status === 'preparing' || order.status === 'on_the_way') && (
                <View
                  style={{
                    backgroundColor: colors['surface-container-low'],
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginVertical: spacing.sm,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                    <Text style={[typography['label-sm'], { color: colors.primary, fontWeight: '700' }]}>
                      وقت الوصول المتوقع: {order.estimatedTime}
                    </Text>
                    <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
                      {order.status === 'preparing' ? 'خطوة 2 من 3' : 'خطوة 3 من 3'}
                    </Text>
                  </View>

                  <View style={{ height: 6, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: order.status === 'preparing' ? '60%' : '90%',
                        backgroundColor: colors.primary,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Items List */}
              <View style={{ marginVertical: spacing.xs, gap: 4 }}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[typography['body-sm'], { color: colors['on-surface'] }]}>
                      {item.quantity}× {item.name}
                    </Text>
                    <Text style={[typography['body-sm'], { color: colors['on-surface-variant'], fontWeight: '600' }]}>
                      {(item.price * item.quantity).toLocaleString()} ل.س
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: spacing.sm }} />

              {/* Order Footer Total & Address */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <MaterialIcons name="location-on" size={16} color={colors['on-surface-variant']} />
                  <Text style={[typography['body-sm'], { color: colors['on-surface-variant'] }]} numberOfLines={1}>
                    {order.deliveryAddress}
                  </Text>
                </View>
                <Text style={[typography['title-md'], { color: colors.primary, fontWeight: '800' }]}>
                  {order.total.toLocaleString()} ل.س
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                {activeTab === 'active' ? (
                  <>
                    <TouchableOpacity
                      onPress={() => Alert.alert('اتصال بالسائق', 'جاري الاتصال بالسائق: +963 991 222 333')}
                      style={{
                        flex: 1,
                        backgroundColor: colors.primary,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      <Ionicons name="call-outline" size={18} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '700' }}>الاتصال بالسائق</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => cancelOrder(order.id)}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: borderRadius.md,
                        backgroundColor: colors['surface-container-high'],
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: colors.error, fontWeight: '600' }}>إلغاء</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleReorder(order)}
                    style={{
                      flex: 1,
                      backgroundColor: colors['surface-container-high'],
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <Ionicons name="reload-outline" size={18} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: '700' }}>إعادة الطلب بنفس العناصر</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
