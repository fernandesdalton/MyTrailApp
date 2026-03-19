import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { useCreatePostMutation } from '@/features/posts/mutations/use-create-post-mutation';
import { type MediaAsset, type PostVisibility } from '@/features/posts/model/post.types';
import { usePostComposerDataQuery } from '@/features/posts/queries/use-post-composer-data-query';
import { newPostScreenStyles as styles } from '@/features/posts/screens/new-post-screen.styles';
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
      setSelectedAuthorId(session?.user.id ?? data?.users[0]?.id ?? null);
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
            <AppText style={styles.statValue}>{selectedAuthor?.displayName ?? 'Unknown rider'}</AppText>
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
