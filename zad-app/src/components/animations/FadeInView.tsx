import { ReactNode, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function FadeInView({ children, delay = 0, duration = 500, style }: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.quad) });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
