import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { localMockUser } from '@/features/posts/constants/mock-user';
import { useCreatePostMutation } from '@/features/posts/mutations/use-create-post-mutation';
import { type MediaAsset, type PostVisibility } from '@/features/posts/model/post.types';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const sampleMedia: MediaAsset = {
  id: '66666666-6666-4666-8666-666666666666',
  type: 'image',
  url: 'https://example.com/post.jpg',
  width: 1080,
  height: 1350,
  blurhash: null,
};

const visibilityOptions: {
  id: PostVisibility;
  label: string;
}[] = [
  { id: 'public', label: 'PUBLIC' },
  { id: 'followers', label: 'FOLLOWERS' },
  { id: 'private', label: 'PRIVATE' },
];

export function NewPostScreen() {
  const { session } = useAuthSession();
  const { data, isLoading } = usePostComposerDataQuery();
  const createPostMutation = useCreatePostMutation();
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset>(sampleMedia);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<PostVisibility>('public');

  useEffect(() => {
    if (!selectedAuthorId) {
      setSelectedAuthorId(session?.user.id ?? data?.users[0]?.id ?? localMockUser.id);
    }
  }, [data?.users, selectedAuthorId, session?.user.id]);

  useEffect(() => {
    if (!data?.trails.length || selectedTrailId) {
      return;
    }
    const firstFavoriteTrailId = data.favoriteTrailIds?.[0] ?? null;
    setSelectedTrailId(firstFavoriteTrailId);
  }, [data?.favoriteTrailIds, data?.trails, selectedTrailId]);

  const selectedAuthor =
    data?.users.find((user) => user.id === selectedAuthorId) ??
    (selectedAuthorId === session?.user.id
      ? {
          id: session.user.id,
          username: session.user.username,
          displayName: session.user.displayName,
          avatarUrl: session.user.avatarUrl ?? null,
        }
      : selectedAuthorId === localMockUser.id
        ? localMockUser
        : null);
  const selectedTrail = data?.trails.find((trail) => trail.id === selectedTrailId) ?? null;
  const favoriteTrails = useMemo(
    () => (data?.trails ?? []).filter((trail) => data?.favoriteTrailIds?.includes(trail.id)),
    [data?.favoriteTrailIds, data?.trails]
  );
  const trailCount = favoriteTrails.length;

  const isSubmitDisabled =
    !selectedAuthor || !selectedMedia.url.trim() || createPostMutation.isPending || createPostMutation.isSuccess;

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Gallery permission needed',
        'Allow photo library access so you can attach a ride photo from your phone.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    if (!asset?.uri) {
      return;
    }

    setSelectedMedia({
      id: '66666666-6666-4666-8666-666666666666',
      type: 'image',
      url: asset.uri,
      width: asset.width ?? 1080,
      height: asset.height ?? 1350,
      blurhash: null,
    });
  }

  async function handleSubmit() {
    if (!selectedAuthor) {
      Alert.alert('Author missing', 'The demo rider is still loading. Try again in a moment.');
      return;
    }

    try {
      const payloadMedia: MediaAsset = {
        id: '66666666-6666-4666-8666-666666666666',
        type: 'image',
        url: 'https://example.com/post.jpg',
        width: 1080,
        height: 1350,
        blurhash: null,
      };

      await createPostMutation.mutateAsync({
        payload: {
          authorId: selectedAuthor.id,
          trailId: selectedTrail?.id ?? null,
          caption: caption.trim() || 'Cloud inversion this morning.',
          visibility,
          media: [payloadMedia],
        },
        author: selectedAuthor,
        trail: selectedTrail,
      });

      startTransition(() => {
        router.replace('/(tabs)');
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to publish the post right now.';
      Alert.alert('Post failed', message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <AppText style={styles.closeLabel}>x</AppText>
          </Pressable>

          <View style={styles.headerCopy}>
            <AppText style={styles.headerEyebrow}>NEW POST</AppText>
            <AppText style={styles.headerSubcopy}>
              Pick a ride photo, link the trail, and publish it straight into the feed.
            </AppText>
          </View>

          <Pressable
            disabled={isSubmitDisabled}
            onPress={() => void handleSubmit()}
            style={[styles.postButton, isSubmitDisabled && styles.postButtonDisabled]}>
            {createPostMutation.isPending ? (
              <ActivityIndicator color="#130A25" />
            ) : (
              <AppText style={styles.postButtonLabel}>POST</AppText>
            )}
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image source={selectedMedia.url} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroActions}>
              <Pressable onPress={() => void handlePickFromGallery()} style={styles.heroActionPrimary}>
                <AppText style={styles.heroActionPrimaryLabel}>Gallery</AppText>
              </Pressable>
              <Pressable onPress={() => setSelectedMedia(sampleMedia)} style={styles.heroActionSecondary}>
                <AppText style={styles.heroActionSecondaryLabel}>Sample</AppText>
              </Pressable>
            </View>
            <AppText style={styles.heroTitle}>CAPTURE OR UPLOAD</AppText>
            <AppText style={styles.heroSubtitle}>Pull a photo from your phone gallery or keep the sample image for now.</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>SELECTED MEDIA</AppText>
          <View style={styles.mediaInfoCard}>
            <AppText style={styles.mediaInfoTitle}>
              {selectedMedia.url.startsWith('file:') ? 'Picked from your gallery' : 'Using the sample ride photo'}
            </AppText>
            <AppText style={styles.mediaInfoMeta}>
              {`${selectedMedia.width} x ${selectedMedia.height}`}
            </AppText>
            <AppText style={styles.mediaInfoDescription}>
              {selectedMedia.url.startsWith('file:')
                ? 'Your photo is attached and ready for this post.'
                : 'A temporary sample image is attached until you pick one from your gallery.'}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>CAPTION</AppText>
          <TextInput
            multiline
            onChangeText={setCaption}
            placeholder="Tell the story of the trail..."
            placeholderTextColor="#7A6D86"
            style={styles.textArea}
            textAlignVertical="top"
            value={caption}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionLabel}>LINK TRAIL</AppText>
            <AppText style={styles.sectionAction}>
              {trailCount > 0 ? `${trailCount} FAVORITES` : 'NO FAVORITES'}
            </AppText>
          </View>

          {isLoading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : selectedTrail ? (
            <View style={styles.trailCard}>
              <View style={styles.trailThumbnail}>
                <AppText style={styles.trailThumbnailLabel}>/</AppText>
              </View>

              <View style={styles.trailCopy}>
                <AppText style={styles.trailTitle}>{selectedTrail.title.toUpperCase()}</AppText>
                <AppText style={styles.trailMeta}>
                  {`${(selectedTrail.distanceMeters / 1000).toFixed(1)} km • ${Math.round(
                    selectedTrail.elevationGainMeters
                  )} m • ${Math.max(Math.round(selectedTrail.durationSeconds / 60), 1)} min`}
                </AppText>
                {selectedTrail.regionLabel ? (
                  <AppText style={styles.trailRegion}>{selectedTrail.regionLabel}</AppText>
                ) : null}
              </View>

              <Pressable onPress={() => setSelectedTrailId(null)} style={styles.clearTrailButton}>
                <AppText style={styles.clearTrailButtonLabel}>x</AppText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <AppText style={styles.emptyCardText}>Post without a linked trail for now.</AppText>
            </View>
          )}

          <View style={styles.favoritePanel}>
            <View style={styles.favoritePanelHeader}>
              <View>
                <AppText style={styles.favoritePanelTitle}>Saved trails</AppText>
                <AppText style={styles.favoritePanelCopy}>
                  Only your favorited trails show up here when attaching a route to a post.
                </AppText>
              </View>
              <Pressable
                onPress={() => router.push('/(tabs)/trails')}
                style={styles.browseTrailsButton}>
                <AppText style={styles.browseTrailsButtonLabel}>Browse all</AppText>
              </Pressable>
            </View>

            <View style={styles.favoriteTrailList}>
              {favoriteTrails.length > 0 ? (
                favoriteTrails.map((trail) => {
                  const isSelected = trail.id === selectedTrailId;

                  return (
                    <Pressable
                      key={trail.id}
                      onPress={() => setSelectedTrailId(trail.id)}
                      style={[styles.favoriteTrailCard, isSelected && styles.favoriteTrailCardActive]}>
                      <View style={styles.favoriteTrailImageWrap}>
                        <Image
                          source={trail.coverImageUrl ?? sampleMedia.url}
                          style={styles.favoriteTrailImage}
                          contentFit="cover"
                        />
                        <View style={styles.favoriteTrailOverlay} />
                        <View style={styles.favoriteTrailTopRow}>
                          <View style={styles.favoriteTrailDistancePill}>
                            <AppText style={styles.favoriteTrailDistancePillText}>
                              {`${(trail.userDistanceKm ?? trail.distanceMeters / 1000).toFixed(1)} KM AWAY`}
                            </AppText>
                          </View>
                        </View>
                        <View style={styles.favoriteTrailBottom}>
                          <AppText style={styles.favoriteTrailTitle}>{trail.title.toUpperCase()}</AppText>
                          {trail.regionLabel ? (
                            <AppText style={styles.favoriteTrailRegion}>{trail.regionLabel}</AppText>
                          ) : null}
                        </View>
                      </View>

                      <View style={styles.favoriteTrailStats}>
                        <View style={styles.favoriteTrailStat}>
                          <AppText style={styles.favoriteTrailStatLabel}>LENGTH</AppText>
                          <AppText style={styles.favoriteTrailStatValue}>
                            {`${(trail.distanceMeters / 1000).toFixed(1)} km`}
                          </AppText>
                        </View>
                        <View style={styles.favoriteTrailStat}>
                          <AppText style={styles.favoriteTrailStatLabel}>GRADE</AppText>
                          <AppText style={styles.favoriteTrailStatValue}>
                            {trail.gradeLabel ?? 'MIXED'}
                          </AppText>
                        </View>
                        <View style={styles.favoriteTrailStat}>
                          <AppText style={styles.favoriteTrailStatLabel}>EST TIME</AppText>
                          <AppText style={styles.favoriteTrailStatValue}>
                            {trail.estimatedTimeLabel ?? `${Math.max(Math.round(trail.durationSeconds / 3600), 1)} HR`}
                          </AppText>
                        </View>
                      </View>
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.emptyFavoritesCard}>
                  <AppText style={styles.emptyFavoritesTitle}>No saved favorites yet</AppText>
                  <AppText style={styles.emptyFavoritesCopy}>
                    Open the Trails screen, save the routes you like, and they will appear here for post linking.
                  </AppText>
                  <Pressable
                    onPress={() => router.push('/(tabs)/trails')}
                    style={styles.emptyFavoritesButton}>
                    <AppText style={styles.emptyFavoritesButtonLabel}>Open trails</AppText>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <AppText style={styles.statLabel}>POSTING AS</AppText>
            <AppText style={styles.statValue}>{selectedAuthor?.displayName ?? localMockUser.displayName}</AppText>
          </View>
          <View style={styles.statCard}>
            <AppText style={styles.statLabel}>TRAIL</AppText>
            <AppText style={styles.statValue}>{selectedTrail ? 'LINKED' : 'OPTIONAL'}</AppText>
          </View>
          <View style={styles.statCard}>
            <AppText style={styles.statLabel}>MEDIA</AppText>
            <AppText style={styles.statValue}>{selectedMedia.url.startsWith('file:') ? 'GALLERY' : 'SAMPLE'}</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>WHO CAN SEE THIS</AppText>
          <View style={styles.visibilityRow}>
            {visibilityOptions.map((option) => {
              const isSelected = option.id === visibility;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => setVisibility(option.id)}
                  style={[styles.visibilityChip, isSelected && styles.visibilityChipActive]}>
                  <AppText
                    style={[styles.visibilityChipLabel, isSelected && styles.visibilityChipLabelActive]}>
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
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
    paddingHorizontal: 14,
    paddingBottom: 28,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeLabel: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  headerEyebrow: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
  headerSubcopy: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  postButton: {
    minWidth: 72,
    borderRadius: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    opacity: 0.55,
  },
  postButtonLabel: {
    color: '#130A25',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 246,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 7, 15, 0.64)',
  },
  heroContent: {
    minHeight: 246,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  heroActionPrimary: {
    borderRadius: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF7A12',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heroActionSecondary: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5A361E',
    backgroundColor: 'rgba(23, 19, 28, 0.88)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionPrimaryLabel: {
    color: '#130A25',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '800',
  },
  heroActionSecondaryLabel: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#C8BFCE',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: '#7D728B',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionAction: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
  mediaInfoCard: {
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  mediaInfoTitle: {
    fontWeight: '700',
  },
  mediaInfoMeta: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  mediaInfoDescription: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  textArea: {
    minHeight: 118,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loadingCard: {
    minHeight: 88,
    borderRadius: 18,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    padding: 12,
  },
  trailThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFE7D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailThumbnailLabel: {
    color: '#5C5242',
    fontWeight: '800',
  },
  trailCopy: {
    flex: 1,
    gap: 4,
  },
  trailTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  trailMeta: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  trailRegion: {
    color: colors.accent,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  clearTrailButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearTrailButtonLabel: {
    color: colors.accent,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  emptyCardText: {
    color: colors.textMuted,
  },
  favoritePanel: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3C2B1A',
    backgroundColor: '#17120F',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  favoritePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  favoritePanelTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  favoritePanelCopy: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    maxWidth: 220,
  },
  browseTrailsButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#5A361E',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  browseTrailsButtonLabel: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  favoriteTrailList: {
    gap: 12,
  },
  favoriteTrailCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2B221C',
    backgroundColor: '#13100D',
  },
  favoriteTrailCardActive: {
    borderColor: colors.accent,
    shadowColor: '#FF7A12',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  favoriteTrailImageWrap: {
    minHeight: 212,
    justifyContent: 'space-between',
    padding: 14,
  },
  favoriteTrailImage: {
    ...StyleSheet.absoluteFillObject,
  },
  favoriteTrailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 8, 6, 0.42)',
  },
  favoriteTrailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  favoriteTrailDistancePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(17, 13, 9, 0.82)',
    borderWidth: 1,
    borderColor: '#5C4126',
  },
  favoriteTrailDistancePillText: {
    color: '#F8EEDF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  favoriteTrailActions: {
    gap: 8,
  },
  favoriteActionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 13, 9, 0.82)',
    borderWidth: 1,
    borderColor: '#4B3A2C',
  },
  favoriteActionButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  favoriteActionLabel: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '800',
  },
  favoriteActionLabelActive: {
    color: '#130A25',
  },
  favoriteTrailBottom: {
    gap: 4,
    marginTop: 'auto',
  },
  favoriteTrailTitle: {
    color: '#FFF4E9',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
  },
  favoriteTrailRegion: {
    color: '#D7C3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  favoriteTrailStats: {
    flexDirection: 'row',
    gap: 1,
    backgroundColor: '#0F0D0B',
  },
  favoriteTrailStat: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#171310',
  },
  favoriteTrailStatLabel: {
    color: '#7D6F63',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  favoriteTrailStatValue: {
    color: '#F7EFE5',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  emptyFavoritesCard: {
    gap: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3C2B1A',
    backgroundColor: '#1A1511',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  emptyFavoritesTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  emptyFavoritesCopy: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyFavoritesButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emptyFavoritesButtonLabel: {
    color: '#130A25',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 4,
  },
  statLabel: {
    color: '#7D728B',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  visibilityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    paddingVertical: 14,
  },
  visibilityChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  visibilityChipLabel: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  visibilityChipLabelActive: {
    color: '#130A25',
  },
});
