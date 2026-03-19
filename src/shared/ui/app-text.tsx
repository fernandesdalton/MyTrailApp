import { type PropsWithChildren } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { appTextStyles as styles } from '@/shared/ui/app-text.styles';

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
