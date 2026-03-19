import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const tabsLayoutStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceStrong,
    borderTopColor: colors.border,
    height: 68,
    paddingTop: 8,
    paddingBottom: 10,
  },
  profileIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInitial: {
    fontSize: 11,
    lineHeight: 12,
    fontWeight: '800',
  },
});
