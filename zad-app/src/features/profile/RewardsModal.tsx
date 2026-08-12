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

interface RewardsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function RewardsModal({ visible, onClose }: RewardsModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const addBalance = useAuthStore((s) => s.addBalance);

  const [redeemed, setRedeemed] = useState(false);

  const handleRedeemPoints = () => {
    if (profile.points < 1000) return;
    // Redeem 1000 points for 10,000 L.S balance!
    updateProfile({ points: profile.points - 1000 });
    addBalance(10000);
    setRedeemed(true);
    setTimeout(() => {
      setRedeemed(false);
    }, 2000);
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
              برنامج مكافآت زاد الذهبي
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Points Balance Card */}
            <View
              style={{
                backgroundColor: colors['secondary-container'],
                borderRadius: borderRadius.md,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                alignItems: 'center',
              }}
            >
              <MaterialIcons name="stars" size={48} color={colors['on-secondary-container']} />
              <Text style={{ color: colors['on-secondary-container'], fontSize: 14, fontWeight: '600', marginTop: 4 }}>
                رصيد النقاط الحالي
              </Text>
              <Text style={{ color: colors['on-secondary-container'], fontSize: 36, fontWeight: '800' }}>
                {profile.points.toLocaleString()}
              </Text>
              <Text style={{ color: colors['on-secondary-container'], fontSize: 13, opacity: 0.9 }}>
                عضو ذهبي مميز 🌟
              </Text>
            </View>

            {redeemed && (
              <View
                style={{
                  backgroundColor: '#4CAF50',
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.md,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>
                  تم استبدال 1,000 نقطة وإضافة 10,000 ل.س إلى محفظتك! 🎉
                </Text>
              </View>
            )}

            {/* Redeem Points Card */}
            <View
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: 4 }]}>
                استبدال النقاط
              </Text>
              <Text style={[typography['body-sm'], { color: colors['on-surface-variant'], marginBottom: spacing.md }]}>
                استبدل 1,000 نقطة بحسيمة رصيد بقيمة 10,000 ل.س تضاف مباشرة لمحفظتك.
              </Text>

              <TouchableOpacity
                onPress={handleRedeemPoints}
                disabled={profile.points < 1000}
                style={{
                  backgroundColor: profile.points >= 1000 ? colors.primary : colors['surface-container-high'],
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    typography['title-md'],
                    { color: profile.points >= 1000 ? '#fff' : colors['on-surface-variant'], fontWeight: '700' },
                  ]}
                >
                  {profile.points >= 1000 ? 'استبدل 1,000 نقطة الآن' : 'تحتاج إلى 1,000 نقطة للاستبدال'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Perks */}
            <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: spacing.sm }]}>
              مميزات العضوية الذهبية
            </Text>

            <View
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.xl,
                gap: spacing.sm,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                <Text style={[typography['body-md'], { color: colors['on-surface'] }]}>توصيل مجاني على الطلبات المؤهلة</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                <Text style={[typography['body-md'], { color: colors['on-surface'] }]}>خصومات حصرية تصل إلى 30%</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                <Text style={[typography['body-md'], { color: colors['on-surface'] }]}>أولوية في تجهيز وتوصيل الطلبات</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
