import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface GoldMembershipBannerProps {
  onJoinPress?: () => void;
}

export function GoldMembershipBanner({ onJoinPress }: GoldMembershipBannerProps) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(254, 214, 91, 0.3)',
        borderRadius: borderRadius.DEFAULT,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(254, 214, 91, 0.5)',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[typography['headline-md'], { color: colors.secondary, fontWeight: '700' }]}>عضوية التميز الذهبية</Text>
        <Text style={[typography['body-md'], { color: colors['on-surface-variant'] }]}>توصيل مجاني غير محدود لجميع الطلبات</Text>
        <TouchableOpacity
          onPress={onJoinPress}
          style={{
            backgroundColor: colors.secondary,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.DEFAULT,
            marginTop: spacing.sm,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={[typography['label-md'], { color: colors['on-secondary'] }]}>انضم الآن</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <MaterialIcons name="emoji-events" size={36} color={colors.secondary} />
      </View>
    </View>
  );
}
