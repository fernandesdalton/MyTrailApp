import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { type TrailSummary } from '@/features/posts/model/post.types';
import { trailsScreenStyles as styles } from '@/features/trails/screens/trails-screen.styles';
import { AppText } from '@/shared/ui/app-text';

const fallbackTrailImage =
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80';

type TrailCardProps = {
  trail: TrailSummary;
  isSaved: boolean;
  isSavePending?: boolean;
  onPress?: () => void;
  onToggleSave: () => void;
};

export function TrailCard({ trail, isSaved, isSavePending = false, onPress, onToggleSave }: TrailCardProps) {
  return (
    <View style={styles.trailCard}>
      <Pressable onPress={onPress} style={styles.trailImageWrap}>
        <Image source={trail.coverImageUrl ?? fallbackTrailImage} style={styles.trailImage} contentFit="cover" />
        <View style={styles.trailOverlay} />

        <View style={styles.trailTopRow}>
          <View style={styles.distancePill}>
            <AppText style={styles.distancePillText}>
              {`${(trail.userDistanceKm ?? trail.distanceMeters / 1000).toFixed(1)} KM AWAY`}
            </AppText>
          </View>
        </View>

        <View style={styles.trailBottom}>
          <AppText style={styles.trailTitle}>{trail.title.toUpperCase()}</AppText>
          {trail.regionLabel ? <AppText style={styles.trailRegion}>{trail.regionLabel}</AppText> : null}
        </View>
      </Pressable>

      <View style={styles.trailActionBar}>
        <Pressable
          onPress={onToggleSave}
          disabled={isSavePending}
          style={[styles.saveButton, isSaved && styles.saveButtonActive, isSavePending && styles.saveButtonPending]}>
          <AppText style={[styles.saveButtonLabel, isSaved && styles.saveButtonLabelActive]}>
            {isSavePending ? '...' : isSaved ? 'SAVED' : 'SAVE'}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.trailStats}>
        <View style={styles.trailStat}>
          <AppText style={styles.trailStatLabel}>LENGTH</AppText>
          <AppText style={styles.trailStatValue}>{`${(trail.distanceMeters / 1000).toFixed(1)} km`}</AppText>
        </View>
        <View style={styles.trailStat}>
          <AppText style={styles.trailStatLabel}>GRADE</AppText>
          <AppText style={styles.trailStatValue}>{trail.gradeLabel ?? 'MIXED'}</AppText>
        </View>
        <View style={styles.trailStat}>
          <AppText style={styles.trailStatLabel}>EST TIME</AppText>
          <AppText style={styles.trailStatValue}>
            {trail.estimatedTimeLabel ?? `${Math.max(Math.round(trail.durationSeconds / 3600), 1)} HR`}
          </AppText>
        </View>
      </View>
    </View>
  );
}
