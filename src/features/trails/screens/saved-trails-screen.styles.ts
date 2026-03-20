import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 16,
  },
  listHeader: {
    gap: 16,
  },
  listSpacer: {
    height: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
  },
  iconButtonLabel: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
  },
  topBarSpacer: {
    width: 38,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
  },
  subtitleCard: {
    gap: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  subtitle: {
    color: colors.textMuted,
  },
  list: {
    gap: 14,
  },
  stateCard: {
    gap: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  stateCopy: {
    color: colors.textMuted,
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonLabel: {
    color: '#130A25',
    fontWeight: '800',
  },
});
