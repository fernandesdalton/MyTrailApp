import { StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme/global-styles';

export const appScreenStyles = StyleSheet.create({
  safeArea: globalStyles.screen,
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    ...globalStyles.contentMaxWidth,
    gap: 16,
  },
});
