import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store/authStore';

interface AddressesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddressesModal({ visible, onClose }: AddressesModalProps) {
  const addresses = useAuthStore((s) => s.addresses);
  const addAddress = useAuthStore((s) => s.addAddress);
  const deleteAddress = useAuthStore((s) => s.deleteAddress);
  const setDefaultAddress = useAuthStore((s) => s.setDefaultAddress);

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('');
  const [addressText, setAddressText] = useState('');
  const [details, setDetails] = useState('');

  const handleAddAddress = () => {
    if (!label || !addressText) return;
    addAddress({
      label,
      address: addressText,
      details,
    });
    setLabel('');
    setAddressText('');
    setDetails('');
    setShowAddForm(false);
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
              عناوين التوصيل
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {addresses.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.md || 12,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: item.isDefault ? colors.primary : 'rgba(0,0,0,0.08)',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.xs,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    <MaterialIcons
                      name={item.label === 'البيت' ? 'home' : item.label === 'العمل' ? 'work' : 'location-on'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[typography['title-md'], { fontWeight: '700' }]}>{item.label}</Text>
                    {item.isDefault && (
                      <View
                        style={{
                          backgroundColor: 'rgba(131, 0, 15, 0.1)',
                          paddingHorizontal: spacing.xs,
                          paddingVertical: 2,
                          borderRadius: borderRadius.full,
                        }}
                      >
                        <Text style={[typography['label-sm'], { color: colors.primary, fontWeight: '700' }]}>
                          افتراضي
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                    <MaterialIcons name="delete-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <Text style={[typography['body-md'], { color: colors['on-surface'], marginBottom: 4 }]}>
                  {item.address}
                </Text>
                {!!item.details && (
                  <Text style={[typography['body-sm'], { color: colors['on-surface-variant'] }]}>
                    {item.details}
                  </Text>
                )}

                {!item.isDefault && (
                  <TouchableOpacity
                    onPress={() => setDefaultAddress(item.id)}
                    style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}
                  >
                    <Text style={[typography['label-md'], { color: colors.primary, fontWeight: '600' }]}>
                      تعيين كعنوان افتراضي
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {showAddForm ? (
              <View
                style={{
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors['outline-variant'],
                }}
              >
                <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: spacing.sm }]}>
                  عنوان جديد
                </Text>
                <TextInput
                  value={label}
                  onChangeText={setLabel}
                  placeholder="اسم العنوان (مثلاً: البيت، المكتب)"
                  style={{
                    borderWidth: 1,
                    borderColor: colors['outline-variant'],
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.sm,
                    textAlign: 'right',
                  }}
                />
                <TextInput
                  value={addressText}
                  onChangeText={setAddressText}
                  placeholder="المنطقة والشارع (مثلاً: السويداء - العجيلات)"
                  style={{
                    borderWidth: 1,
                    borderColor: colors['outline-variant'],
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.sm,
                    textAlign: 'right',
                  }}
                />
                <TextInput
                  value={details}
                  onChangeText={setDetails}
                  placeholder="تفاصيل إضافية (رقم البناء، الطابق، الملاحظات)"
                  style={{
                    borderWidth: 1,
                    borderColor: colors['outline-variant'],
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.md,
                    textAlign: 'right',
                  }}
                />

                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <TouchableOpacity
                    onPress={handleAddAddress}
                    style={{
                      flex: 1,
                      backgroundColor: colors.primary,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>إضافة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowAddForm(false)}
                    style={{
                      flex: 1,
                      backgroundColor: colors['surface-container-high'],
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.md,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors['on-surface'] }}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAddForm(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.xs,
                  backgroundColor: colors['surface-container-high'],
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.xl,
                }}
              >
                <MaterialIcons name="add-location-alt" size={20} color={colors.primary} />
                <Text style={[typography['title-md'], { color: colors.primary, fontWeight: '700' }]}>
                  إضافة عنوان جديد
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
