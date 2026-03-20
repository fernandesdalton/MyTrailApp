import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  cardWrap: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  centeredState: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonLabel: {
    color: '#130A25',
    fontWeight: '800',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 86,
  },
  menuCard: {
    alignSelf: 'flex-end',
    width: 188,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 10,
    gap: 8,
  },
  menuAction: {
    borderRadius: 14,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuActionDanger: {
    borderWidth: 1,
    borderColor: '#8A2F2F',
    backgroundColor: '#341313',
  },
  menuActionLabel: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  menuActionDangerLabel: {
    color: '#FFB4B4',
  },
});
