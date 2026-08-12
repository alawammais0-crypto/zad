import { View, TextInput, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface SearchBarProps extends TextInputProps {
  containerStyle?: object;
}

export function SearchBar({ containerStyle, placeholder = "ابحث عن مطعم أو وجبة...", ...props }: SearchBarProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors['surface-container-low'],
          borderRadius: borderRadius.DEFAULT,
          paddingHorizontal: spacing.md,
          height: 48,
          borderWidth: 1,
          borderColor: colors['surface-container-high'],
          gap: spacing.sm,
        },
        containerStyle,
      ]}
    >
      <MaterialIcons name="search" size={22} color={colors['on-surface-variant']} />
      <TextInput
        placeholderTextColor={colors['on-surface-variant']}
        style={[typography['body-md'], { flex: 1, color: colors['on-surface'], height: '100%', textAlign: 'right' }]}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
}
