import { View, Text, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, actionLabel, onAction }: SectionTitleProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
      <Text style={[typography['headline-md'], { color: colors.primary, fontWeight: '700' }]}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[typography['label-md'], { color: colors.secondary }]}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
