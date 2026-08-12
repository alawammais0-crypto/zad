import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../theme';

export function PromoBanner() {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push('/offers')}
      style={{ height: 176, borderRadius: borderRadius.DEFAULT, overflow: 'hidden' }}
    >
      <LinearGradient
        colors={['#a61e22', '#7c1417']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', position: 'relative' }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 24 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: colors.white }} />
            ))}
          </View>
        </View>
        <View style={{ zIndex: 1, maxWidth: '60%' }}>
          <View style={{ backgroundColor: colors['secondary-container'], paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, alignSelf: 'flex-start', marginBottom: spacing.sm }}>
            <Text style={[typography['label-md'], { color: colors.secondary }]}>عرض خاص</Text>
          </View>
          <Text style={[typography['headline-lg-mobile'], { color: colors.white }]}>خصم حتى 50% على أول طلب</Text>
          <Text style={[typography['body-md'], { color: 'rgba(255,255,255,0.9)', marginTop: spacing.xs }]}>استمتع بأشهى العروض الحصرية 🔥</Text>
        </View>
        <View style={{ position: 'absolute', left: -10, bottom: -20, opacity: 0.25 }}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={160} color={colors.white} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
