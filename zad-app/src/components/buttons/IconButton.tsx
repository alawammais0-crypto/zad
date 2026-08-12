import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../theme';

interface IconButtonProps {
  icon: string | React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'glass' | 'primary';
  size?: number;
  style?: ViewStyle;
}

export function IconButton({ icon, onPress, variant = 'default', size = 40, style }: IconButtonProps) {
  const bgMap = {
    default: 'transparent',
    glass: 'rgba(255,255,255,0.8)',
    primary: colors['primary-container'],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          width: size,
          height: size,
          borderRadius: borderRadius.full,
          backgroundColor: bgMap[variant],
          alignItems: 'center',
          justifyContent: 'center',
        },
        variant === 'glass' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        },
        style,
      ]}
    >
      {typeof icon === 'string' ? (
        <Text style={{ fontSize: size * 0.5, color: variant === 'primary' ? colors['on-primary'] : colors.primary }}>{icon}</Text>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}
