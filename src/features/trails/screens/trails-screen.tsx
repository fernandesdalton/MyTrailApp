import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useScrollToTop } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrailCard } from '@/features/trails/components/trail-card';
import { useToggleTrailSaveMutation } from '@/features/trails/mutations/use-toggle-trail-save-mutation';
import { useSavedTrailIdsQuery, useTrailsBrowseQuery } from '@/features/trails/queries/use-trails-browse-query';
import { trailsScreenStyles as styles } from '@/features/trails/screens/trails-screen.styles';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

export function TrailsScreen() {
  const trailsListRef = useRef<FlatList>(null);
  useScrollToTop(trailsListRef);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTrailsBrowseQuery();
  const {
    data: savedTrailIds,
    isLoading: isSavedIdsLoading,
    isError: isSavedIdsError,
    refetch: refetchSavedIds,
  } = useSavedTrailIdsQuery();
  const toggleTrailSaveMutation = useToggleTrailSaveMutation();
  const [distanceRangeKm, setDistanceRangeKm] = useState(10);

  const allTrails = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const visibleTrails = useMemo(
    () =>
      allTrails.filter((trail) => {
        const distanceFromUser = trail.userDistanceKm ?? trail.distanceMeters / 1000;
        return distanceFromUser <= distanceRangeKm;
      }),
    [allTrails, distanceRangeKm]
  );

  const hasError = isError || isSavedIdsError;
  const isInitialLoading = (isLoading || isSavedIdsLoading) && allTrails.length === 0;

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || hasError) {
      return;
    }

    await fetchNextPage();
  }, [fetchNextPage, hasError, hasNextPage, isFetchingNextPage]);

  const handleRetry = useCallback(async () => {
    await Promise.all([refetch(), refetchSavedIds()]);
  }, [refetch, refetchSavedIds]);

  const listHeader = (
    <View style={styles.listHeader}>
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
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/saved-trails')} style={styles.savedButton}>
            <AppText style={styles.savedButtonLabel}>Saved Trails</AppText>
          </Pressable>
          <View style={styles.favoriteCounter}>
            <AppText style={styles.favoriteCounterValue}>{savedTrailIds?.length ?? 0}</AppText>
            <AppText style={styles.favoriteCounterLabel}>SAVED</AppText>
          </View>
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
              {isInitialLoading ? 'LOADING' : `${visibleTrails.length} RESULTS`}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={trailsListRef}
        data={visibleTrails}
        keyExtractor={(trail) => trail.id}
        renderItem={({ item }) => {
          const isSaved = savedTrailIds?.includes(item.id) ?? false;

          return (
            <TrailCard
              trail={item}
              isSaved={isSaved}
              isSavePending={
                toggleTrailSaveMutation.isPending &&
                toggleTrailSaveMutation.variables?.trail.id === item.id
              }
              onPress={() =>
                router.push({
                  pathname: '/trail/[trailId]',
                  params: { trailId: item.id },
                })
              }
              onToggleSave={() => toggleTrailSaveMutation.mutate({ trail: item, isSaved })}
            />
          );
        }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={styles.listSpacer} />}
        ListEmptyComponent={
          isInitialLoading ? (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyTitle}>Loading trails</AppText>
              <AppText style={styles.emptyCopy}>We are pulling the first page of nearby routes.</AppText>
            </View>
          ) : hasError ? (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyTitle}>Could not load trails</AppText>
              <AppText style={styles.emptyCopy}>Try again to refresh nearby routes from the backend.</AppText>
              <Pressable onPress={() => void handleRetry()} style={styles.retryButton}>
                <AppText style={styles.retryButtonLabel}>Try again</AppText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyTitle}>No trails in this range</AppText>
              <AppText style={styles.emptyCopy}>
                Increase the distance filter to discover more routes nearby.
              </AppText>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyTitle}>Loading more trails</AppText>
              <AppText style={styles.emptyCopy}>Fetching the next page from the backend.</AppText>
            </View>
          ) : null
        }
        onEndReachedThreshold={0.35}
        onEndReached={() => {
          void handleLoadMore();
        }}
      />
    </SafeAreaView>
  );
}
