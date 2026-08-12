import { View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar: string;
  isGold: boolean;
}

const { width } = Dimensions.get('window');

export function ProfileHeader({ name, email, avatar, isGold }: ProfileHeaderProps) {
  return (
    <View style={{ height: 240, position: 'relative' }}>
      <LinearGradient
        colors={['#a61e22', '#83000f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.white, fontSize: 100 }}>╳</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xl }}>
          <View style={{ position: 'relative', marginBottom: spacing.md }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 4,
                borderColor: 'rgba(255,255,255,0.2)',
                padding: spacing.xs,
              }}
            >
              <Image
                source={{ uri: avatar }}
                style={{ width: '100%', height: '100%', borderRadius: 44 }}
                resizeMode="cover"
              />
            </View>
            {isGold && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  backgroundColor: colors['secondary-container'],
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.full,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <MaterialIcons name="stars" size={16} color={colors['on-secondary-container']} />
                <Text style={[typography['label-sm'], { color: colors['on-secondary-container'], fontWeight: '700' }]}>عضو ذهبي</Text>
              </View>
            )}
          </View>
          <Text style={[typography['headline-md'], { color: colors.white }]}>{name}</Text>
          <Text style={[typography['body-md'], { color: 'rgba(255,255,255,0.8)' }]}>{email}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
