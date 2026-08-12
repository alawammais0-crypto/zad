import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store/authStore';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=90',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=90',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=90',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=90',
];

export function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatar, setAvatar] = useState(profile?.avatar || AVATAR_PRESETS[0]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSave = () => {
    updateProfile({
      name,
      email,
      phone,
      avatar,
    });
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        }}
      >
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
              تعديل الملف الشخصي
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar Picker */}
            <Text style={[typography['label-md'], { color: colors['on-surface-variant'], marginBottom: spacing.xs }]}>
              الصورة الشخصية
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs }}>
                {AVATAR_PRESETS.map((url, idx) => {
                  const isSelected = avatar === url;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setAvatar(url)}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderWidth: isSelected ? 3 : 1,
                        borderColor: isSelected ? colors.primary : 'rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                      }}
                    >
                      <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Name Input */}
            <Text style={[typography['label-md'], { color: colors['on-surface-variant'], marginBottom: spacing.xs }]}>
              الاسم الكامل
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="أدخل الاسم الكامل"
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderWidth: 1,
                borderColor: colors['outline-variant'],
                borderRadius: borderRadius.md || 12,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                fontSize: 16,
                marginBottom: spacing.md,
                textAlign: 'right',
              }}
            />

            {/* Email Input */}
            <Text style={[typography['label-md'], { color: colors['on-surface-variant'], marginBottom: spacing.xs }]}>
              البريد الإلكتروني
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@domain.com"
              keyboardType="email-address"
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderWidth: 1,
                borderColor: colors['outline-variant'],
                borderRadius: borderRadius.md || 12,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                fontSize: 16,
                marginBottom: spacing.md,
                textAlign: 'right',
              }}
            />

            {/* Phone Input */}
            <Text style={[typography['label-md'], { color: colors['on-surface-variant'], marginBottom: spacing.xs }]}>
              رقم الهاتف
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+963 9xx xxx xxx"
              keyboardType="phone-pad"
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderWidth: 1,
                borderColor: colors['outline-variant'],
                borderRadius: borderRadius.md || 12,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                fontSize: 16,
                marginBottom: spacing.xl,
                textAlign: 'right',
              }}
            />

            {showSuccessToast && (
              <View
                style={{
                  backgroundColor: '#4CAF50',
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.md,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>تم حفظ التغييرات بنجاح! ✨</Text>
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md || 12,
                paddingVertical: spacing.md,
                alignItems: 'center',
                marginBottom: spacing.xl,
              }}
            >
              <Text style={[typography['title-md'], { color: colors.white, fontWeight: '700' }]}>حفظ التغييرات</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
