import { useRef } from 'react';
import { Animated } from 'react-native';

export function useAnimatedHeader(threshold = 100) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [0, 4],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return { scrollY, headerOpacity, headerElevation, onScroll };
}
