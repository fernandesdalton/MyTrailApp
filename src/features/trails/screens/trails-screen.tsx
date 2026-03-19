import { useQueryClient } from '@tanstack/react-query';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { type TrailSummary } from '@/features/posts/model/post.types';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';
import { trailsScreenStyles as styles } from '@/features/trails/screens/trails-screen.styles';
import { socialApi } from '@/shared/lib/api/resources/social-api';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const fallbackTrailImage =
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80';

export function TrailsScreen() {
  const queryClient = useQueryClient();
  const { session } = useAuthSession();
  const { data, isLoading } = usePostComposerDataQuery();
  const [distanceRangeKm, setDistanceRangeKm] = useState(10);
  const [favoriteTrailIds, setLocalFavoriteTrailIds] = useState<string[]>([]);
  const [likedTrailIds, setLikedTrailIds] = useState<string[]>([]);

  useEffect(() => {
    setLocalFavoriteTrailIds(data?.favoriteTrailIds ?? []);
    setLikedTrailIds(data?.trails.filter((trail) => trail.isLiked).map((trail) => trail.id) ?? []);
  }, [data?.favoriteTrailIds, data?.trails]);

  const visibleTrails = useMemo(
    () =>
      (data?.trails ?? []).filter((trail) => {
        const distanceFromUser = trail.userDistanceKm ?? trail.distanceMeters / 1000;
        return distanceFromUser <= distanceRangeKm;
      }),
    [data?.trails, distanceRangeKm]
  );

  async function handleToggleFavorite(trail: TrailSummary) {
    const userId = session?.user.id;
    if (!userId) {
      return;
    }

    const isFavorite = favoriteTrailIds.includes(trail.id);
    const nextFavoriteTrailIds = isFavorite
      ? favoriteTrailIds.filter((trailId) => trailId !== trail.id)
      : [...favoriteTrailIds, trail.id];

    setLocalFavoriteTrailIds(nextFavoriteTrailIds);

    try {
      if (isFavorite) {
        await socialApi.unsaveTrail(trail.id, userId);
      } else {
        await socialApi.saveTrail(trail.id, userId);
      }
    } catch {
      // Keep local favorites responsive while syncing with the API.
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts', 'composer-data'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
      ]);
    }
  }

  function handleToggleLike(trailId: string) {
    setLikedTrailIds((current) =>
      current.includes(trailId)
        ? current.filter((id) => id !== trailId)
        : [...current, trailId]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <AppText style={styles.eyebrow}>TRAILBLAZER</AppText>
            <AppText variant="headline" style={styles.title}>
              Trails nearby
            </AppText>
            <AppText style={styles.subtitle}>
              Explore every trail in range, then save your favorites for quick posting later.
            </AppText>
          </View>
          <View style={styles.favoriteCounter}>
            <AppText style={styles.favoriteCounterValue}>{favoriteTrailIds.length}</AppText>
            <AppText style={styles.favoriteCounterLabel}>FAVS</AppText>
          </View>
        </View>

        <View style={styles.rangeCard}>
          <View style={styles.rangeHeader}>
            <View>
              <AppText style={styles.rangeLabel}>RANGE FILTER</AppText>
              <AppText style={styles.rangeValue}>{`${distanceRangeKm}KM`}</AppText>
            </View>
            <View style={styles.resultBadge}>
              <AppText style={styles.resultBadgeLabel}>
                {isLoading ? 'LOADING' : `${visibleTrails.length} RESULTS`}
              </AppText>
            </View>
          </View>

          <Slider
            minimumValue={1}
            maximumValue={25}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.border}
            onValueChange={(value) => setDistanceRangeKm(Math.round(value))}
            step={1}
            thumbTintColor={colors.accent}
            value={distanceRangeKm}
          />

          <View style={styles.scaleRow}>
            <AppText style={styles.scaleLabel}>NEAR</AppText>
            <AppText style={styles.scaleLabel}>10KM</AppText>
            <AppText style={styles.scaleLabel}>25KM</AppText>
          </View>
        </View>

        <View style={styles.list}>
          {visibleTrails.map((trail) => {
            const isFavorite = favoriteTrailIds.includes(trail.id);
            const isLiked = likedTrailIds.includes(trail.id);

            return (
              <View key={trail.id} style={styles.trailCard}>
                <View style={styles.trailImageWrap}>
                  <Image
                    source={trail.coverImageUrl ?? fallbackTrailImage}
                    style={styles.trailImage}
                    contentFit="cover"
                  />
                  <View style={styles.trailOverlay} />

                  <View style={styles.trailTopRow}>
                    <View style={styles.distancePill}>
                      <AppText style={styles.distancePillText}>
                        {`${(trail.userDistanceKm ?? trail.distanceMeters / 1000).toFixed(1)} KM AWAY`}
                      </AppText>
                    </View>

                    <View style={styles.actionColumn}>
                      <Pressable
                        onPress={() => handleToggleLike(trail.id)}
                        style={[styles.actionButton, isLiked && styles.actionButtonActive]}>
                        <AppText style={[styles.actionLabel, isLiked && styles.actionLabelActive]}>
                          {isLiked ? '♥' : '♡'}
                        </AppText>
                      </Pressable>
                      <Pressable
                        onPress={() => void handleToggleFavorite(trail)}
                        style={[styles.actionButton, isFavorite && styles.actionButtonActive]}>
                        <AppText style={[styles.actionLabel, isFavorite && styles.actionLabelActive]}>
                          {isFavorite ? '■' : '□'}
                        </AppText>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.trailBottom}>
                    <AppText style={styles.trailTitle}>{trail.title.toUpperCase()}</AppText>
                    {trail.regionLabel ? (
                      <AppText style={styles.trailRegion}>{trail.regionLabel}</AppText>
                    ) : null}
                  </View>
                </View>

                <View style={styles.trailStats}>
                  <View style={styles.trailStat}>
                    <AppText style={styles.trailStatLabel}>LENGTH</AppText>
                    <AppText style={styles.trailStatValue}>
                      {`${(trail.distanceMeters / 1000).toFixed(1)} km`}
                    </AppText>
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
          })}

          {!isLoading && visibleTrails.length === 0 ? (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyTitle}>No trails in this range</AppText>
              <AppText style={styles.emptyCopy}>
                Increase the distance filter to discover more routes nearby.
              </AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
