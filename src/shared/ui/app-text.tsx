import { type PropsWithChildren } from 'react';
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { colors } from '@/shared/theme/colors';

type AppTextProps = PropsWithChildren<{
  style?: StyleProp<TextStyle>;
  variant?: 'body' | 'caption' | 'headline' | 'title';
}> &
  TextProps;

export function AppText({ children, style, variant = 'body', ...textProps }: AppTextProps) {
  return (
    <Text {...textProps} style={[styles.base, styles[variant], style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
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
