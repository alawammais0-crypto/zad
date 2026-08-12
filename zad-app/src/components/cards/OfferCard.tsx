import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface OfferCardProps {
  badge?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  backgroundImage?: string;
  gradientColors?: string[];
}

export function OfferCard({ badge, title, description, actionLabel, onAction, backgroundImage }: OfferCardProps) {
  return (
    <ImageBackground
      source={backgroundImage ? { uri: backgroundImage } : undefined}
      style={{
        height: 176,
        borderRadius: borderRadius.DEFAULT,
        overflow: 'hidden',
      }}
      imageStyle={{ borderRadius: borderRadius.DEFAULT }}
    >
      <View
        style={{
          flex: 1,
          padding: spacing.lg,
          justifyContent: 'center',
          backgroundColor: !backgroundImage ? colors['inverse-surface'] : undefined,
        }}
      >
        {badge && (
          <View style={{ backgroundColor: colors.gold, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, alignSelf: 'flex-start', marginBottom: spacing.sm }}>
            <Text style={[typography['label-sm'], { color: colors.white }]}>{badge}</Text>
          </View>
        )}
        <Text style={[typography['headline-lg-mobile'], { color: colors.white }]}>{title}</Text>
        <Text style={[typography['body-md'], { color: colors['surface-variant'], marginTop: spacing.xs }]}>{description}</Text>
        {actionLabel && (
          <TouchableOpacity onPress={onAction} style={{ backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.DEFAULT, alignSelf: 'flex-start', marginTop: spacing.md }}>
            <Text style={[typography['label-md'], { color: colors['on-background'], fontWeight: '700' }]}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}
