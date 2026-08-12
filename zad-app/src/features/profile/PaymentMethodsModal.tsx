import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store/authStore';

interface PaymentMethodsModalProps {
  visible: boolean;
  onClose: () => void;
}

const PAYMENT_OPTIONS = [
  {
    id: 'cod',
    title: 'الدفع نقداً عند الاستلام',
    desc: 'ادفع مباشرة للسائق عند استلام طلبك',
    icon: 'payments',
  },
  {
    id: 'wallet',
    title: 'رصيد محفظة زاد',
    desc: 'دفع سريع ومباشر من رصيد حسابك',
    icon: 'account-balance-wallet',
  },
  {
    id: 'syriatel',
    title: 'سيريتل كاش / شام بنك',
    desc: 'دفع إلكتروني فوري عبر التطبيقات المحلية',
    icon: 'qr-code-scanner',
  },
  {
    id: 'card',
    title: 'بطاقة إلكترونية / ماستركارد',
    desc: 'بطاقات السداد المصرفي',
    icon: 'credit-card',
  },
];

export function PaymentMethodsModal({ visible, onClose }: PaymentMethodsModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const selectedPaymentMethod = useAuthStore((s) => s.selectedPaymentMethod);
  const setSelectedPaymentMethod = useAuthStore((s) => s.setSelectedPaymentMethod);
  const addBalance = useAuthStore((s) => s.addBalance);

  const [showRechargeSuccess, setShowRechargeSuccess] = useState(false);

  const handleRecharge = (amount: number) => {
    addBalance(amount);
    setShowRechargeSuccess(true);
    setTimeout(() => {
      setShowRechargeSuccess(false);
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: borderRadius.xl || 24,
            borderTopRightRadius: borderRadius.xl || 24,
            maxHeight: '90%',
            padding: spacing.lg,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <Text style={[typography['title-lg'], { color: colors['on-surface'], fontWeight: '700' }]}>
              طرق الدفع والمحفظة
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Wallet Balance Card */}
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md || 12,
                padding: spacing.lg,
                marginBottom: spacing.lg,
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 }}>
                رصيد المحفظة الحالي
              </Text>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: spacing.md }}>
                {profile.balance.toLocaleString()} ل.س
              </Text>

              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', marginBottom: spacing.xs }}>
                شحن سريع للمحفظة:
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                {[10000, 25000, 50000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    onPress={() => handleRecharge(amt)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: borderRadius.sm || 8,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
                      +{amt.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {showRechargeSuccess && (
              <View
                style={{
                  backgroundColor: '#4CAF50',
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.md,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>تم شحن المحفظة بنجاح! 💳</Text>
              </View>
            )}

            {/* Payment Options */}
            <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: spacing.sm }]}>
              طريقة الدفع المحددة
            </Text>

            {PAYMENT_OPTIONS.map((opt) => {
              const isSelected = selectedPaymentMethod === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedPaymentMethod(opt.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors['surface-container-lowest'],
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
                    <MaterialIcons name={opt.icon as any} size={24} color={isSelected ? colors.primary : colors['on-surface-variant']} />
                    <View style={{ flex: 1 }}>
                      <Text style={[typography['title-md'], { fontWeight: '700', color: colors['on-surface'] }]}>
                        {opt.title}
                      </Text>
                      <Text style={[typography['body-sm'], { color: colors['on-surface-variant'] }]}>
                        {opt.desc}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={22}
                    color={isSelected ? colors.primary : colors['on-surface-variant']}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
