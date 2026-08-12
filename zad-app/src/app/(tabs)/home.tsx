import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { PromoBanner } from '../../features/home/PromoBanner';
import { CategorySection } from '../../features/home/CategorySection';
import { GoldMembershipBanner } from '../../features/home/GoldMembershipBanner';
import { RestaurantCard } from '../../components/cards/RestaurantCard';
import { FadeInView } from '../../components/animations/FadeInView';
import { Restaurant } from '../../types';

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'مطعم رويال بالاس',
    cuisine: 'مأكولات شرقية وغربية • مشويات • فطور',
    rating: 4.8,
    deliveryTime: '25-35 دقيقة',
    distance: '1.2 كم',
    deliveryFee: 'مجاني',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    isFreeDelivery: true,
  },
  {
    id: '2',
    name: 'House Food',
    cuisine: 'برغر • بطاطا • وجبات سريعة',
    rating: 4.5,
    deliveryTime: '30-40 دقيقة',
    distance: '2.5 كم',
    deliveryFee: '3,000 ل.س',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85',
    badge: 'عرض خاص',
  },
  {
    id: '3',
    name: 'مطعم الشام الذهبي',
    cuisine: 'مشاوي • منسف • مقلوبة',
    rating: 4.7,
    deliveryTime: '35-50 دقيقة',
    distance: '1.8 كم',
    deliveryFee: '2,000 ل.س',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    isFreeDelivery: true,
  },
  {
    id: '4',
    name: 'بيتزا مارجريتا',
    cuisine: 'بيتزا • باستا • مقبلات إيطالية',
    rating: 4.3,
    deliveryTime: '20-30 دقيقة',
    distance: '0.8 كم',
    deliveryFee: '1,500 ل.س',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: spacing['container-margin'], paddingVertical: spacing.base }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors['surface-container-highest'], overflow: 'hidden' }}>
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiDdO_indTwEeB4ptepLJVyHR-v69vfkXhRaOfPuv900laDr-p6-yBNDxblhfalUG-uEZOqWKhHIdiMyocBDsLIVA--uXYeUDOvKMGKTMnVNqSRLDbd0jVSOGjgyQapRukkQPXCRhTLkFejK8wEqSNeQzP14D0m0yOEasbH4a4EC57nvYETZX8JtgDshSyf06EwFkhXDy9b7g9K9adNTxQjowpL5j3hJihdvnPxOWb9tds3Lm_eP58m6uDan3a3CRcJXH8fAuhG-0' }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View>
              <Text style={[typography['label-md'], { color: colors['on-surface-variant'] }]}>توصيل إلى</Text>
              <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700' }]}>السويداء - المدينة</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/search')} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <MaterialIcons name="search" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, gap: spacing.xl }}>
        <FadeInView delay={100}>
          <View style={{ paddingHorizontal: spacing['container-margin'] }}>
            <PromoBanner />
          </View>
        </FadeInView>

        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700' }]}>الأصناف</Text>
            <TouchableOpacity onPress={() => router.push('/category/all')} activeOpacity={0.7} style={{ padding: spacing.xs }}>
              <Text style={[typography['label-md'], { color: colors.secondary, fontWeight: '700' }]}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          <CategorySection
            onCategoryPress={(cat) => router.push(`/category/${cat.id}`)}
          />
        </View>

        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700' }]}>المطاعم المميزة</Text>
            <TouchableOpacity activeOpacity={0.7} style={{ padding: spacing.xs }}>
              <MaterialIcons name="tune" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ gap: spacing.lg }}>
          {restaurants.map((restaurant, index) => (
            <FadeInView key={restaurant.id} delay={100 + index * 100}>
              <View style={{ paddingHorizontal: spacing['container-margin'] }}>
                <RestaurantCard
                  restaurant={restaurant}
                  onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                />
              </View>
            </FadeInView>
          ))}
        </View>

        <View style={{ paddingHorizontal: spacing['container-margin'] }}>
          <GoldMembershipBanner />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
