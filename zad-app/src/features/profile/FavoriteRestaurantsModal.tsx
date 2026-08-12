import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useRouter } from 'expo-router';

interface FavoriteRestaurantsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SAMPLE_FAVORITES = [
  {
    id: '1',
    name: 'مطعم رويال بالاس',
    cuisine: 'مأكولات شرقية وغربية • مشويات • فطور',
    rating: 4.8,
    deliveryTime: '25-35 دقيقة',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: '2',
    name: 'مطعم البيتزا الذهبية',
    cuisine: 'بيتزا • إيطالي • وجبات سريعة',
    rating: 4.7,
    deliveryTime: '20-30 دقيقة',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=90',
  },
  {
    id: '3',
    name: 'شاورما الشام الأصيلة',
    cuisine: 'شاورما • مقبلات شامية • وجبات',
    rating: 4.9,
    deliveryTime: '15-25 دقيقة',
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1600&q=90',
  },
];

export function FavoriteRestaurantsModal({ visible, onClose }: FavoriteRestaurantsModalProps) {
  const router = useRouter();
  const toggleRestaurant = useFavoritesStore((s) => s.toggleRestaurant);

  const handleOpenRestaurant = (id: string) => {
    onClose();
    router.push({ pathname: '/restaurant/[id]', params: { id } });
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
              المطاعم المفضلة
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: spacing.xs }}>
              <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {SAMPLE_FAVORITES.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleOpenRestaurant(item.id)}
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors['surface-container-lowest'],
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.08)',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 72, height: 72, borderRadius: borderRadius.md }}
                  resizeMode="cover"
                />

                <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                  <Text style={[typography['title-md'], { fontWeight: '700', marginBottom: 2 }]}>
                    {item.name}
                  </Text>
                  <Text style={[typography['body-sm'], { color: colors['on-surface-variant'], marginBottom: 4 }]} numberOfLines={1}>
                    {item.cuisine}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={[typography['label-sm'], { fontWeight: '700' }]}>{item.rating}</Text>
                    <Text style={[typography['label-sm'], { color: colors['on-surface-variant'] }]}>
                      • {item.deliveryTime}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleRestaurant(item.id);
                  }}
                  style={{ padding: spacing.xs }}
                >
                  <MaterialIcons name="favorite" size={24} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
