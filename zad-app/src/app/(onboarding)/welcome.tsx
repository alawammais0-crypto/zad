import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { BentoCard } from '../../components/cards/BentoCard';
import { FadeInView } from '../../components/animations/FadeInView';
import { useAuthStore } from '../../store/authStore';

const MASCOT_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCKpYHA97tyArhx7PmsgvzICT9H1WQKpOR8Mm6UichMG9j2PJRvmjIswd1IFtLVxhOcGqEjkJA10PmJBHJV4nhUDi6qED-5mZeuZ6ZAoCmSL54CvqrZdNsXKJenZgLuSlnGEGAXa16Obdt_wiBv0OmoYI8oAlJ6_jDEB2JGS0iuLkgZk9GC77S3Fr19-ofIk-KKdTNptq8nnC1UuI0nfPE4pRiD-ZvqvNCjE8JI2T-fhlQPdO1XkOUlQC5Y5swFI2yT9fNYPik7HhI';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAiDdO_indTwEeB4ptepLJVyHR-v69vfkXhRaOfPuv900laDr-p6-yBNDxblhfalUG-uEZOqWKhHIdiMyocBDsLIVA--uXYeUDOvKMGKTMnVNqSRLDbd0jVSOGjgyQapRukkQPXCRhTLkFejK8wEqSNeQzP14D0m0yOEasbH4a4EC57nvYETZX8JtgDshSyf06EwFkhXDy9b7g9K9adNTxQjowpL5j3hJihdvnPxOWb9tds3Lm_eP58m6uDan3a3CRcJXH8fAuhG-0';

export default function WelcomeScreen() {
  // طيران المسكوت ثلاثية الأبعاد
  const imgY = useSharedValue(0);
  const imgTilt = useSharedValue(0);

  // نبضة الهالة الخلفية
  const haloScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.4);

  // ظل الأرض تحت الشخصية
  const shadowScaleX = useSharedValue(1);

  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    // حركة طيران ناعمة للشخصية
    imgY.value = withRepeat(
      withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // ميلان لطيف جداً
    imgTilt.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(2, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // الهالة خلف الشخصية
    haloScale.value = withRepeat(
      withTiming(1.15, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    haloOpacity.value = withRepeat(
      withTiming(0.2, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // انكماش/تمدد ظل الأرض
    shadowScaleX.value = withRepeat(
      withTiming(0.7, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const imgAnim = useAnimatedStyle(() => ({
    transform: [
      { translateY: imgY.value },
      { rotate: `${imgTilt.value}deg` },
    ],
  }));

  const haloAnim = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  const shadowAnim = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScaleX.value }],
    opacity: shadowScaleX.value * 0.35 + 0.1,
  }));

  const handleStart = () => {
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ===== الهيدر العلوي ===== */}
      <View style={s.header}>
        <TouchableOpacity style={s.searchBtn}>
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={s.headerTitleGroup}>
          <Text style={[typography['headline-md'], s.headerTitle]}>
            السويداء - المدينة
          </Text>
          <View style={s.logoWrapper}>
            <Image source={{ uri: LOGO_URI }} style={s.logoImg} resizeMode="cover" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: spacing.md, paddingHorizontal: spacing['container-margin'] }}>
          {/* ===== قسم المسكوت ثلاثي الأبعاد ===== */}
          <FadeInView delay={0}>
            <View style={s.mascotSection}>
              {/* توهج خلفي لطيف */}
              <Animated.View style={[s.haloBg, haloAnim]} />

              {/* الصورة بدون قناع دائري (المسكوت بكامل أناقتها) */}
              <Animated.View style={[s.imgWrapper, imgAnim]}>
                <Image
                  source={{ uri: MASCOT_URI }}
                  style={s.mascotImg}
                  resizeMode="contain"
                />
              </Animated.View>

              {/* ظل الأرض تحت الشخصية */}
              <Animated.View style={[s.groundShadow, shadowAnim]} />
            </View>
          </FadeInView>

          {/* ===== النصوص الرئيسية ===== */}
          <FadeInView delay={200}>
            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <Text
                style={[
                  typography['headline-lg-mobile'],
                  { color: colors.primary, marginBottom: spacing.xs, fontWeight: '700' },
                ]}
              >
                أهلا و سهلاً
              </Text>
              <Text
                style={[
                  typography['headline-md'],
                  { color: colors['on-surface-variant'], fontWeight: '600' },
                ]}
              >
                شو عبالك تاكل اليوم؟
              </Text>
            </View>
          </FadeInView>

          {/* ===== الأزرار الرئيسية ===== */}
          <FadeInView delay={400}>
            <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
              <TouchableOpacity
                onPress={handleStart}
                activeOpacity={0.9}
                style={s.btnPrimary}
              >
                <Text style={[typography['title-lg'], { color: colors['on-primary'], fontWeight: '700' }]}>
                  ابدأ الآن
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStart}
                activeOpacity={0.9}
                style={s.btnSecondary}
              >
                <Text style={[typography['title-lg'], { color: colors.primary, fontWeight: '700' }]}>
                  تصفح المطاعم
                </Text>
              </TouchableOpacity>
            </View>
          </FadeInView>

          {/* ===== شبكة الميزات (Bento Cards) ===== */}
          <FadeInView delay={600}>
            <View style={s.bentoGrid}>
              <View style={s.bentoCol}>
                <BentoCard
                  icon={<MaterialCommunityIcons name="moped" size={28} color={colors.secondary} />}
                  label="توصيل سريع"
                  variant="gold"
                />
              </View>

              <View style={s.bentoCol}>
                <BentoCard
                  icon={<MaterialIcons name="verified" size={28} color={colors.secondary} />}
                  label="جودة مضمونة"
                  variant="gold"
                />
              </View>

              <View style={s.bentoCol}>
                <BentoCard
                  icon={<MaterialIcons name="payments" size={28} color={colors.secondary} />}
                  label="عروض حصرية"
                  variant="gold"
                />
              </View>

              <View style={s.bentoCol}>
                <BentoCard
                  icon={<MaterialIcons name="headset-mic" size={28} color={colors.secondary} />}
                  label="دعم متواصل"
                  variant="gold"
                />
              </View>
            </View>
          </FadeInView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['container-margin'],
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(252, 249, 248, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 237, 237, 0.8)',
    zIndex: 10,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors['surface-container-low'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 20,
  },
  logoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(115, 92, 0, 0.3)',
    backgroundColor: colors['primary-container'],
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  mascotSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
    marginBottom: spacing.md,
    position: 'relative',
  },
  haloBg: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(254, 214, 91, 0.25)',
  },
  imgWrapper: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  mascotImg: {
    width: '100%',
    height: '100%',
  },
  groundShadow: {
    width: 170,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(131,0,15,0.15)',
    position: 'absolute',
    bottom: 5,
  },
  btnPrimary: {
    backgroundColor: colors['primary-container'],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl || 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors['primary-container'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors['primary-container'],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl || 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
    justifyContent: 'space-between',
  },
  bentoCol: {
    width: '47%',
  },
});

