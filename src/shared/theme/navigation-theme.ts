import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { colors } from '@/shared/theme/colors';

export const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surfaceStrong,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

export const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.darkBackground,
    card: colors.darkSurface,
    text: colors.darkText,
    border: colors.darkBorder,
    notification: colors.accent,
  },
};
