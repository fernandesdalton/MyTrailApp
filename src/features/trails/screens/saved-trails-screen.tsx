import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrailCard } from '@/features/trails/components/trail-card';
import { useToggleTrailSaveMutation } from '@/features/trails/mutations/use-toggle-trail-save-mutation';
import { useSavedTrailsQuery } from '@/features/trails/queries/use-saved-trails-query';
import { styles } from '@/features/trails/screens/saved-trails-screen.styles';
import { AppText } from '@/shared/ui/app-text';

export function SavedTrailsScreen() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSavedTrailsQuery();
  const toggleTrailSaveMutation = useToggleTrailSaveMutation();

  const trails = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const isInitialLoading = isLoading && trails.length === 0;

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || isError) {
      return;
    }

    await fetchNextPage();
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage]);

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if ('canGoBack' in router && typeof router.canGoBack === 'function' && router.canGoBack()) {
              router.back();
              return;
            }

            router.replace('/(tabs)/trails');
          }}
          style={styles.iconButton}>
          <AppText style={styles.iconButtonLabel}>{'<'}</AppText>
        </Pressable>
        <AppText style={styles.title}>Saved Trails</AppText>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={styles.subtitleCard}>
        <AppText style={styles.eyebrow}>READY TO RIDE</AppText>
        <AppText style={styles.subtitle}>
          These are the trails you saved for quick access in posting and route browsing.
        </AppText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={trails}
        keyExtractor={(trail) => trail.id}
        renderItem={({ item }) => (
          <TrailCard
            trail={item}
            isSaved
            isSavePending={toggleTrailSaveMutation.isPending && toggleTrailSaveMutation.variables?.trail.id === item.id}
            onPress={() =>
              router.push({
                pathname: '/trail/[trailId]',
                params: { trailId: item.id },
              })
            }
            onToggleSave={() => toggleTrailSaveMutation.mutate({ trail: item, isSaved: true })}
          />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={styles.listSpacer} />}
        ListEmptyComponent={
          isInitialLoading ? (
            <View style={styles.stateCard}>
              <AppText style={styles.stateTitle}>Loading saved trails</AppText>
              <AppText style={styles.stateCopy}>We are pulling your first saved page from the backend.</AppText>
            </View>
          ) : isError ? (
            <View style={styles.stateCard}>
              <AppText style={styles.stateTitle}>Could not load saved trails</AppText>
              <AppText style={styles.stateCopy}>Try again to refresh your saved routes.</AppText>
              <Pressable onPress={() => void refetch()} style={styles.retryButton}>
                <AppText style={styles.retryButtonLabel}>Try again</AppText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stateCard}>
              <AppText style={styles.stateTitle}>No saved trails yet</AppText>
              <AppText style={styles.stateCopy}>
                Save a trail from the Trails tab and it will appear here instantly.
              </AppText>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.stateCard}>
              <AppText style={styles.stateTitle}>Loading more saved trails</AppText>
              <AppText style={styles.stateCopy}>Fetching the next saved page from the backend.</AppText>
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
