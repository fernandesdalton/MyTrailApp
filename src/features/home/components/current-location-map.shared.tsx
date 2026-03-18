import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

export const currentLocationMapStyles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  refreshButton: {
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  refreshLabel: {
    color: colors.accent,
    fontWeight: '700',
  },
  mapCard: {
    height: 420,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#EFE4FF',
  },
  mapOverlay: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    gap: 10,
  },
  mapBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  mapBadgeText: {
    color: colors.accent,
    fontWeight: '700',
  },
  mapHint: {
    borderRadius: 20,
    backgroundColor: 'rgba(46,16,101,0.86)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  mapHintText: {
    color: '#FFFFFF',
  },
  noticeCard: {
    gap: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    padding: 20,
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  retryLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

type MapNoticeCardProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onPress?: () => void;
  footerText?: string;
};

export function MapNoticeCard({
  actionLabel,
  description,
  footerText,
  onPress,
  title,
}: MapNoticeCardProps) {
  return (
    <View style={currentLocationMapStyles.noticeCard}>
      <AppText variant="title">{title}</AppText>
      <AppText>{description}</AppText>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress} style={currentLocationMapStyles.retryButton}>
          <AppText style={currentLocationMapStyles.retryLabel}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
      {footerText ? <AppText>{footerText}</AppText> : null}
    </View>
  );
}
