import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_PHONE = width < 375;
export const IS_LARGE_PHONE = width >= 428;
export const IS_TABLET = width >= 768;
