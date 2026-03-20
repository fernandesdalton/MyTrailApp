import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToggleTrailSaveMutation } from '@/features/trails/mutations/use-toggle-trail-save-mutation';
import { useTrailDetailQuery } from '@/features/trails/queries/use-trail-detail-query';
import { styles } from '@/features/trails/screens/trail-detail-screen.styles';
import { AppText } from '@/shared/ui/app-text';

const fallbackTrailImage =
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80';

type TrailDetailScreenProps = {
  trailId: string;
};

export function TrailDetailScreen({ trailId }: TrailDetailScreenProps) {
  const { data, isLoading, isError, refetch } = useTrailDetailQuery(trailId);
  const toggleTrailSaveMutation = useToggleTrailSaveMutation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
          <AppText style={styles.title}>Trail</AppText>
          <View style={styles.topBarSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.stateCard}>
            <AppText style={styles.stateTitle}>Loading trail</AppText>
            <AppText style={styles.stateCopy}>We are pulling the latest route details.</AppText>
          </View>
        ) : null}

        {isError ? (
          <View style={styles.stateCard}>
            <AppText style={styles.stateTitle}>Could not load trail</AppText>
            <AppText style={styles.stateCopy}>Try again to fetch this route from the backend.</AppText>
            <Pressable onPress={() => void refetch()} style={styles.retryButton}>
              <AppText style={styles.retryButtonLabel}>Try again</AppText>
            </Pressable>
          </View>
        ) : null}

        {data ? (
          <>
            <View style={styles.heroCard}>
              <Image source={data.trail.coverImageUrl ?? fallbackTrailImage} style={styles.heroImage} contentFit="cover" />
              <View style={styles.heroOverlay} />

              <View style={styles.distancePill}>
                <AppText style={styles.distancePillText}>
                  {`${(data.trail.userDistanceKm ?? data.trail.distanceMeters / 1000).toFixed(1)} KM AWAY`}
                </AppText>
              </View>

              <View style={styles.heroBottom}>
                <AppText style={styles.heroTitle}>{data.trail.title.toUpperCase()}</AppText>
                {data.trail.regionLabel ? <AppText style={styles.heroRegion}>{data.trail.regionLabel}</AppText> : null}
              </View>
            </View>

            <Pressable
              onPress={() => toggleTrailSaveMutation.mutate({ trail: data.trail, isSaved: data.isSaved })}
              disabled={toggleTrailSaveMutation.isPending}
              style={[
                styles.saveButton,
                data.isSaved && styles.saveButtonActive,
                toggleTrailSaveMutation.isPending && styles.saveButtonPending,
              ]}>
              <AppText style={[styles.saveButtonLabel, data.isSaved && styles.saveButtonLabelActive]}>
                {toggleTrailSaveMutation.isPending ? 'Updating...' : data.isSaved ? 'Saved to your list' : 'Save trail'}
              </AppText>
            </Pressable>

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>LENGTH</AppText>
                <AppText style={styles.statValue}>{`${(data.trail.distanceMeters / 1000).toFixed(1)} km`}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>GAIN</AppText>
                <AppText style={styles.statValue}>{`${Math.round(data.trail.elevationGainMeters)} m`}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>EST TIME</AppText>
                <AppText style={styles.statValue}>
                  {data.trail.estimatedTimeLabel ?? `${Math.max(Math.round(data.trail.durationSeconds / 3600), 1)} HR`}
                </AppText>
              </View>
            </View>

            <View style={styles.infoCard}>
              <AppText style={styles.infoTitle}>Trail notes</AppText>
              <AppText style={styles.infoCopy}>
                This route is available for saving from the backend and can be attached to new posts from your saved list.
              </AppText>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
