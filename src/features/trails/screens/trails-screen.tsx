import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { setFavoriteTrailIds } from '@/features/posts/lib/trail-favorites-storage';
import { type TrailSummary } from '@/features/posts/model/post.types';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';
import { socialApi } from '@/shared/lib/api/resources/social-api';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const fallbackTrailImage =
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80';

export function TrailsScreen() {
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
    await setFavoriteTrailIds(userId, nextFavoriteTrailIds);

    try {
      if (isFavorite) {
        await socialApi.unsaveTrail(trail.id, userId);
      } else {
        await socialApi.saveTrail(trail.id, userId);
      }
    } catch {
      // Keep local favorites responsive while the backend is still in-memory.
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

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  title: {
    color: colors.text,
    marginTop: 4,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
    maxWidth: 260,
  },
  favoriteCounter: {
    width: 62,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 2,
  },
  favoriteCounterValue: {
    color: colors.accent,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
  },
  favoriteCounterLabel: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  rangeCard: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3C2B1A',
    backgroundColor: '#17120F',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rangeLabel: {
    color: '#8D7A66',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rangeValue: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  resultBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#231B16',
    borderWidth: 1,
    borderColor: '#3C2B1A',
  },
  resultBadgeLabel: {
    color: colors.accent,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    color: '#6F655F',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  list: {
    gap: 14,
  },
  trailCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2B221C',
    backgroundColor: '#13100D',
  },
  trailImageWrap: {
    minHeight: 228,
    justifyContent: 'space-between',
    padding: 14,
  },
  trailImage: {
    ...StyleSheet.absoluteFillObject,
  },
  trailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 8, 6, 0.42)',
  },
  trailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  distancePill: {
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
  actionColumn: {
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 13, 9, 0.82)',
    borderWidth: 1,
    borderColor: '#4B3A2C',
  },
  actionButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  actionLabel: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '800',
  },
  actionLabelActive: {
    color: '#130A25',
  },
  trailBottom: {
    gap: 4,
    marginTop: 'auto',
  },
  trailTitle: {
    color: '#FFF4E9',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  trailRegion: {
    color: '#D7C3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  trailStats: {
    flexDirection: 'row',
    gap: 1,
    backgroundColor: '#0F0D0B',
  },
  trailStat: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#171310',
  },
  trailStatLabel: {
    color: '#7D6F63',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  trailStatValue: {
    color: '#F7EFE5',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  emptyCard: {
    gap: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3C2B1A',
    backgroundColor: '#1A1511',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
});
