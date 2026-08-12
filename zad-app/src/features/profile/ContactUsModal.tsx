import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ContactUsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ContactUsModal({ visible, onClose }: ContactUsModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCall = () => {
    Linking.openURL('tel:+963999000111');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/963988111222');
  };

  const handleSubmit = () => {
    if (!message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
      onClose();
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
              تواصل معنا
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Quick Contact Buttons */}
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
              <TouchableOpacity
                onPress={handleCall}
                style={{
                  flex: 1,
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <MaterialIcons name="phone" size={28} color={colors.primary} />
                <Text style={[typography['title-md'], { fontWeight: '700', marginTop: 4 }]}>اتصال مباشر</Text>
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>+963 999 000 111</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleWhatsApp}
                style={{
                  flex: 1,
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <MaterialIcons name="chat" size={28} color="#25D366" />
                <Text style={[typography['title-md'], { fontWeight: '700', marginTop: 4 }]}>واتساب الدعم</Text>
                <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>محادثة فورية</Text>
              </TouchableOpacity>
            </View>

            {/* Message Form */}
            <View
              style={{
                backgroundColor: colors['surface-container-lowest'],
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.xl,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: spacing.md }]}>
                إرسال ملاحظة أو استفسار
              </Text>

              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="موضوع الرسالة (مثلاً: استفسار عن طلب)"
                style={{
                  borderWidth: 1,
                  borderColor: colors['outline-variant'],
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                  textAlign: 'right',
                }}
              />

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="اكتب تفاصيل الرسالة هنا..."
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: 1,
                  borderColor: colors['outline-variant'],
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  height: 100,
                  marginBottom: spacing.md,
                  textAlignVertical: 'top',
                  textAlign: 'right',
                }}
              />

              {submitted ? (
                <View
                  style={{
                    backgroundColor: '#4CAF50',
                    padding: spacing.md,
                    borderRadius: borderRadius.md,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>تم إرسال رسالتك بنجاح! سنرد عليك قريباً.</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: spacing.md,
                    borderRadius: borderRadius.md,
                    alignItems: 'center',
                  }}
                >
                  <Text style={[typography['title-md'], { color: '#fff', fontWeight: '700' }]}>إرسال الرسالة</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
