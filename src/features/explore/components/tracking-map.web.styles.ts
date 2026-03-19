import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const trackingMapWebStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    padding: 16,
  },
  card: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
});
