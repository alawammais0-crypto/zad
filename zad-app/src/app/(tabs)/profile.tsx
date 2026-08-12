import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ProfileHeader } from '../../features/profile/ProfileHeader';
import { useAuthStore } from '../../store/authStore';

// Import Feature Modals
import { EditProfileModal } from '../../features/profile/EditProfileModal';
import { AddressesModal } from '../../features/profile/AddressesModal';
import { PaymentMethodsModal } from '../../features/profile/PaymentMethodsModal';
import { FavoriteRestaurantsModal } from '../../features/profile/FavoriteRestaurantsModal';
import { HelpCenterModal } from '../../features/profile/HelpCenterModal';
import { ContactUsModal } from '../../features/profile/ContactUsModal';
import { RewardsModal } from '../../features/profile/RewardsModal';

interface MenuItemRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  iconBg?: string;
  iconColor?: string;
}

function MenuItemRow({ icon, label, onPress, iconBg, iconColor }: MenuItemRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: borderRadius.DEFAULT,
            backgroundColor: iconBg || 'rgba(166, 30, 34, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={icon} size={22} color={iconColor || colors.primary} />
        </View>
        <Text style={[typography['body-md'], { fontWeight: '500' }]}>{label}</Text>
      </View>
      <MaterialIcons name="chevron-left" size={24} color={colors['outline-variant']} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  // Modal visibility state
  const [activeModal, setActiveModal] = useState<
    'edit' | 'addresses' | 'payment' | 'favorites' | 'help' | 'contact' | 'rewards' | 'logoutConfirm' | null
  >(null);

  const handleLogout = () => {
    logout();
    setActiveModal(null);
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ProfileHeader
          name={profile?.name || 'ميس العوام'}
          email={profile?.email || 'com@gmail.alawammais'}
          avatar={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90'}
          isGold={profile?.isGold ?? true}
        />

        {/* Top Stats Banner */}
        <View style={{ paddingHorizontal: spacing['container-margin'], marginTop: -40, zIndex: 20 }}>
          <View
            style={{
              backgroundColor: colors['surface-container-lowest'],
              borderRadius: borderRadius.DEFAULT,
              padding: spacing.md,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: spacing.md,
              shadowColor: colors['primary-container'],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 20,
              elevation: 4,
              borderWidth: 1,
              borderColor: 'rgba(226, 190, 187, 0.1)',
            }}
          >
            <TouchableOpacity onPress={() => setActiveModal('rewards')} style={{ alignItems: 'center' }}>
              <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>
                {profile?.points?.toLocaleString() || '1,250'}
              </Text>
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>نقطة</Text>
            </TouchableOpacity>

            <View style={{ width: 1, backgroundColor: 'rgba(226, 190, 187, 0.3)' }} />

            <TouchableOpacity onPress={() => router.push('/(tabs)/orders')} style={{ alignItems: 'center' }}>
              <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>
                {profile?.orders || '12'}
              </Text>
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>طلب ناجح</Text>
            </TouchableOpacity>

            <View style={{ width: 1, backgroundColor: 'rgba(226, 190, 187, 0.3)' }} />

            <TouchableOpacity onPress={() => setActiveModal('payment')} style={{ alignItems: 'center' }}>
              <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>
                {profile?.balance?.toLocaleString() || '45,000'} ل.س
              </Text>
              <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>الرصيد</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          {/* Account Settings */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={[typography['headline-md'], { color: colors['on-surface'], marginBottom: spacing.sm, paddingHorizontal: spacing.xs }]}>
              إعدادات الحساب
            </Text>
            <View style={{ backgroundColor: colors['surface-container-lowest'], borderRadius: borderRadius.DEFAULT, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(226, 190, 187, 0.1)' }}>
              <MenuItemRow icon="edit" label="تعديل الملف الشخصي" onPress={() => setActiveModal('edit')} />
              <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.1)', marginHorizontal: spacing.md }} />
              <MenuItemRow icon="location-on" label="عناوين التوصيل" onPress={() => setActiveModal('addresses')} />
              <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.1)', marginHorizontal: spacing.md }} />
              <MenuItemRow icon="payment" label="طرق الدفع والمحفظة" onPress={() => setActiveModal('payment')} />
            </View>
          </View>

          {/* Activity */}
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={[typography['headline-md'], { color: colors['on-surface'], marginBottom: spacing.sm, paddingHorizontal: spacing.xs }]}>
              النشاط
            </Text>
            <View style={{ backgroundColor: colors['surface-container-lowest'], borderRadius: borderRadius.DEFAULT, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(226, 190, 187, 0.1)' }}>
              <MenuItemRow
                icon="history"
                label="طلباتي السابقة"
                onPress={() => router.push('/(tabs)/orders')}
                iconBg="rgba(254, 214, 91, 0.1)"
                iconColor={colors['luxury-gold']}
              />
              <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.1)', marginHorizontal: spacing.md }} />
              <MenuItemRow
                icon="favorite"
                label="المطاعم المفضلة"
                onPress={() => setActiveModal('favorites')}
                iconBg="rgba(254, 214, 91, 0.1)"
                iconColor={colors['luxury-gold']}
              />
            </View>
          </View>

          {/* Support */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={[typography['headline-md'], { color: colors['on-surface'], marginBottom: spacing.sm, paddingHorizontal: spacing.xs }]}>
              الدعم والمساندة
            </Text>
            <View style={{ backgroundColor: colors['surface-container-lowest'], borderRadius: borderRadius.DEFAULT, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(226, 190, 187, 0.1)' }}>
              <MenuItemRow
                icon="help-outline"
                label="مركز المساعدة"
                onPress={() => setActiveModal('help')}
                iconBg="rgba(229, 226, 225, 0.3)"
                iconColor={colors['on-surface-variant']}
              />
              <View style={{ height: 1, backgroundColor: 'rgba(226, 190, 187, 0.1)', marginHorizontal: spacing.md }} />
              <MenuItemRow
                icon="headset-mic"
                label="تواصل معنا"
                onPress={() => setActiveModal('contact')}
                iconBg="rgba(229, 226, 225, 0.3)"
                iconColor={colors['on-surface-variant']}
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={() => setActiveModal('logoutConfirm')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: borderRadius.DEFAULT,
              backgroundColor: colors['surface-container-high'],
              borderWidth: 1,
              borderColor: 'rgba(186, 26, 26, 0.2)',
              marginBottom: spacing.xl * 2,
            }}
          >
            <MaterialIcons name="logout" size={22} color={colors.error} />
            <Text style={[typography['title-lg'], { color: colors.error, fontWeight: '700' }]}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Render Modals */}
      <EditProfileModal visible={activeModal === 'edit'} onClose={() => setActiveModal(null)} />
      <AddressesModal visible={activeModal === 'addresses'} onClose={() => setActiveModal(null)} />
      <PaymentMethodsModal visible={activeModal === 'payment'} onClose={() => setActiveModal(null)} />
      <FavoriteRestaurantsModal visible={activeModal === 'favorites'} onClose={() => setActiveModal(null)} />
      <HelpCenterModal visible={activeModal === 'help'} onClose={() => setActiveModal(null)} />
      <ContactUsModal visible={activeModal === 'contact'} onClose={() => setActiveModal(null)} />
      <RewardsModal visible={activeModal === 'rewards'} onClose={() => setActiveModal(null)} />

      {/* Logout Confirmation Modal */}
      <Modal visible={activeModal === 'logoutConfirm'} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
          <View style={{ backgroundColor: colors.background, borderRadius: borderRadius.lg || 16, padding: spacing.lg, width: '100%', maxWidth: 340 }}>
            <Text style={[typography['title-lg'], { color: colors['on-surface'], fontWeight: '700', marginBottom: spacing.xs, textAlign: 'center' }]}>
              تسجيل الخروج
            </Text>
            <Text style={[typography['body-md'], { color: colors['on-surface-variant'], marginBottom: spacing.lg, textAlign: 'center' }]}>
              هل أنت تأكد من رغبتك في تسجيل الخروج من تطبيق زاد؟
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={{ flex: 1, backgroundColor: colors['surface-container-high'], paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' }}
              >
                <Text style={{ color: colors['on-surface'], fontWeight: '600' }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={{ flex: 1, backgroundColor: colors.error, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>تأكيد الخروج</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
