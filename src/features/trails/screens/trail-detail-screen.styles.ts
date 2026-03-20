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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  heroCard: {
    minHeight: 280,
    borderRadius: 28,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2B221C',
    backgroundColor: '#13100D',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 8, 6, 0.4)',
  },
  distancePill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(17, 13, 9, 0.82)',
    borderWidth: 1,
    borderColor: '#5C4126',
  },
  distancePillText: {
    color: '#F8EEDF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  heroBottom: {
    gap: 6,
  },
  heroTitle: {
    color: '#FFF4E9',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  heroRegion: {
    color: '#D7C3AF',
  },
  saveButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveButtonActive: {
    backgroundColor: colors.accent,
  },
  saveButtonPending: {
    opacity: 0.7,
  },
  saveButtonLabel: {
    color: colors.accent,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  saveButtonLabelActive: {
    color: '#130A25',
  },
  statsCard: {
    flexDirection: 'row',
    gap: 1,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0F0D0B',
  },
  statItem: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#171310',
  },
  statLabel: {
    color: '#7D6F63',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  statValue: {
    color: '#F7EFE5',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  infoCard: {
    gap: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  infoCopy: {
    color: colors.textMuted,
  },
  stateCard: {
    gap: 8,
    borderRadius: 22,
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
