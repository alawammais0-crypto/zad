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

interface HelpCenterModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    id: '1',
    question: 'كيف يمكنني تتبع طلبات الطعام الخاصة بي؟',
    answer: 'يمكنك التوجه إلى تبويب "طلباتي" في الشريط السفلي وتتبع السائق والخريطة مباشرة منذ لحظة قبول الطلب وحتى وصوله إلى باب بيتك.',
  },
  {
    id: '2',
    question: 'ما هي وسائل الدفع المدعومة في السويداء؟',
    answer: 'ندعم الدفع نقداً عند الاستلام، رصيد محفظة زاد، وسيريتل كاش وشام بنك، والبطاقات الإلكترونية.',
  },
  {
    id: '3',
    question: 'كيف أحصل على نقاط زاد وكيف أستبدلها؟',
    answer: 'تحصل على نقاط مع كل طلب ناجح (10 نقاط لكل 1000 ل.س). عند وصولك إلى 1,000 نقطة يمكنك استبدالها بخصم 10,000 ل.س مباشر على أي طلب!',
  },
  {
    id: '4',
    question: 'ماذا أفعل في حال وجود تأخير في التوصيل أو خطأ بالطلب؟',
    answer: 'يمكنك التواصل مباشرة مع فريق الدعم الفني عبر قسم "تواصل معنا" أو زر المحادثة المباشرة وسيقوم فريقنا بحل المشكلة فوراً تعويضك.',
  },
  {
    id: '5',
    question: 'هل يمكنني إلغاء الطلب بعد إرساله؟',
    answer: 'يمكنك إلغاء الطلب مجاناً طالما لم يقم المطعم ببدء تحضيره. بعد بدء التحضير يمكنك التواصل مع الدعم لمساعدتك.',
  },
];

export function HelpCenterModal({ visible, onClose }: HelpCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.includes(searchQuery) ||
      f.answer.includes(searchQuery)
  );

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
              marginBottom: spacing.md,
            }}
          >
            <Text style={[typography['title-lg'], { color: colors['on-surface'], fontWeight: '700' }]}>
              مركز المساعدة والأسئلة الشائعة
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors['surface-container-lowest'],
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors['outline-variant'],
            }}
          >
            <MaterialIcons name="search" size={22} color={colors['on-surface-variant']} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ابحث عن سؤال أو استفسار..."
              style={{
                flex: 1,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                fontSize: 15,
                textAlign: 'right',
              }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: colors['surface-container-lowest'],
                    borderRadius: borderRadius.md,
                    marginBottom: spacing.md,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: spacing.md,
                    }}
                  >
                    <Text style={[typography['title-md'], { flex: 1, fontWeight: '700', color: colors.primary }]}>
                      {item.question}
                    </Text>
                    <MaterialIcons
                      name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
                      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: spacing.sm }} />
                      <Text style={[typography['body-md'], { color: colors['on-surface-variant'], lineHeight: 22 }]}>
                        {item.answer}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
