import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const appTextStyles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
});
