import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme/colors';

export const feedPostCardStyles = StyleSheet.create({
  card: {
    gap: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    color: '#1A111F',
    fontWeight: '800',
  },
  userText: {
    gap: 2,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    lineHeight: 20,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  mediaFrame: {
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#231A2E',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    gap: 12,
    backgroundColor: 'rgba(8, 6, 11, 0.52)',
  },
  trailPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trailPillText: {
    color: '#130A25',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  statBar: {
    flexDirection: 'row',
    borderRadius: 18,
    backgroundColor: 'rgba(18, 14, 24, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    gap: 12,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  statValue: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  footer: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 18,
  },
  routeButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4A2B17',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  routeButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
  captionBlock: {
    gap: 4,
  },
  captionAuthor: {
    fontWeight: '800',
  },
});
