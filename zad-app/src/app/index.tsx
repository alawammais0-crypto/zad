import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBvDdfWB7a8lUxjBdrynEVJqjxO_kWhu3BNIw4gKDVZ7DwC78Iw0XhuF3vYcDqX82IV-FIJ1y77Z2HmecjkXYiKNw9KyIzDxRm3VECF5nHKZm9klKe49Z1IgqdzszHPKYt_TVaG36EQW2gvRQ-YxkKbEOrC0WJBucZUpo_K28X5CYHK8vCAGyXGTxxzGBCn7DAOxQsIpU-1tukzfIohSe0FokmEGtD4N7xTp2MTpaXhJ52dz7h1KfwWKCTtJSjfV7VCLhOK81UC2l8';

export default function SplashScreen() {
  const imgY        = useSharedValue(0);
  const imgScale    = useSharedValue(1);
  const haloRotate  = useSharedValue(0);
  const haloScale   = useSharedValue(1);
  const taglineOpacity = useSharedValue(0);
  const btnOpacity     = useSharedValue(0);
  const loadingX    = useSharedValue(-200);

  useEffect(() => {
    // الانتقال التلقائي لشاشة الأونبوردينغ (Welcome Screen) بعد ثانية ونصف
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 1500);

    // الصورة تتحرك داخل الدائرة
    imgY.value = withRepeat(
      withTiming(-14, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
      -1, true
    );
    imgScale.value = withRepeat(
      withTiming(1.08, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
      -1, true
    );

    // الهالة الخارجية
    haloRotate.value = withRepeat(
      withTiming(5, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
      -1, true
    );
    haloScale.value = withRepeat(
      withTiming(1.05, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
      -1, true
    );

    // النص والزر يظهران تدريجياً
    taglineOpacity.value = withDelay(300, withTiming(1, { duration: 1000 }));
    btnOpacity.value     = withDelay(800, withTiming(1, { duration: 800 }));

    // شريط التحميل
    loadingX.value = withRepeat(
      withTiming(200, { duration: 2200 }),
      -1, true
    );

    return () => clearTimeout(timer);
  }, []);

  const imgAnim     = useAnimatedStyle(() => ({
    transform: [{ translateY: imgY.value }, { scale: imgScale.value }],
  }));
  const haloAnim    = useAnimatedStyle(() => ({
    transform: [{ rotate: `${haloRotate.value}deg` }, { scale: haloScale.value }],
  }));
  const taglineAnim = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));
  const btnAnim     = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));
  const loadingAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: loadingX.value }],
  }));

  return (
    <View style={s.container}>
      <View style={s.noiseOverlay} />
      <View style={s.haloGlow} />
      <Animated.View style={[s.halo, haloAnim]} />

      <View style={s.hero}>

        {/* الدائرة — overflow:hidden يحبس الحركة جوّاها */}
        <View style={s.circle}>
          <Animated.View style={[s.imgWrapper, imgAnim]}>
            <Image source={{ uri: LOGO_URI }} style={s.img} resizeMode="cover" />
          </Animated.View>
        </View>

        {/* ZAD */}
        <Text style={s.logoText}>ZAD</Text>

        {/* وصف */}
        <Animated.Text style={[s.tagline, taglineAnim]}>
          دليلك لمطاعم السويداء
        </Animated.Text>

        {/* زر المتابعة */}
        <Animated.View style={[s.btnWrap, btnAnim]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={s.btn}
            onPress={() => router.replace('/(onboarding)/welcome')}
          >
            <Text style={s.btnText}>متابعة</Text>
            <MaterialIcons name="arrow-back" size={20} color="#83000f" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* شريط تحميل سفلي */}
      <View style={s.loadingBar}>
        <Animated.View style={[s.loadingFill, loadingAnim]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#83000f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noiseOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.03,
    backgroundColor: '#000',
  },
  haloGlow: {
    position: 'absolute',
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(212,175,55,0.12)',
  },
  halo: {
    position: 'absolute',
    width: 420, height: 420, borderRadius: 210,
    borderWidth: 2, borderColor: '#D4AF37', opacity: 0.8,
  },
  hero: {
    zIndex: 10,
    alignItems: 'center',
  },
  // الدائرة ثابتة — overflow:hidden يمنع الصورة من الخروج
  circle: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 3, borderColor: '#D4AF37',
    overflow: 'hidden',
    backgroundColor: '#6a000c',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  // الغلاف المتحرك داخل الدائرة — أكبر من الدائرة بقليل عشان الـ scale ما يظهر حواف بيضاء
  imgWrapper: {
    width: '100%',
    height: '100%',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 48, color: '#D4AF37', fontWeight: '800',
    textAlign: 'center', marginTop: 18, letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16, letterSpacing: 1, marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  btnWrap: { marginTop: 44 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#D4AF37',
    paddingVertical: 14, paddingHorizontal: 52,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  btnText: {
    color: '#83000f', fontSize: 18, fontWeight: '700', letterSpacing: 1,
  },
  btnArrow: {
    color: '#83000f', fontSize: 20, fontWeight: '700',
  },
  loadingBar: {
    position: 'absolute', bottom: 40,
    width: 200, height: 1,
    backgroundColor: 'rgba(212,175,55,0.2)',
    overflow: 'hidden',
  },
  loadingFill: {
    width: '100%', height: '100%',
    backgroundColor: '#D4AF37',
  },
});
