import { Pressable, View } from 'react-native';

import { currentLocationMapStyles } from '@/features/home/components/current-location-map.shared.styles';
import { AppText } from '@/shared/ui/app-text';

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
