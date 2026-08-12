export const typography = {
  'display-lg': {
    fontFamily: undefined,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    letterSpacing: -0.02,
  },
  'headline-lg': {
    fontFamily: undefined,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  'headline-lg-mobile': {
    fontFamily: undefined,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  'headline-md': {
    fontFamily: undefined,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  'title-lg': {
    fontFamily: undefined,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  'title-md': {
    fontFamily: undefined,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  'body-lg': {
    fontFamily: undefined,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  'body-md': {
    fontFamily: undefined,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  'body-sm': {
    fontFamily: undefined,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  'label-md': {
    fontFamily: undefined,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.01,
  },
  'label-sm': {
    fontFamily: undefined,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
} as const;

export type TypographyKey = keyof typeof typography;
