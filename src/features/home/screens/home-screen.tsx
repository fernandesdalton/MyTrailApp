import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { useHomeStoriesQuery } from '@/features/home/queries/use-home-stories-query';
import { useFeedPostsQuery } from '@/features/home/queries/use-feed-posts-query';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

type FeedIconName = ComponentProps<typeof SymbolView>['name'];

function TopAction({
  name,
  onPress,
  plus,
}: {
  name?: FeedIconName;
  onPress?: () => void;
  plus?: boolean;
}) {
  return (
    <Pressable style={styles.topAction} onPress={onPress}>
      {plus ? (
        <AppText style={styles.topActionPlus}>+</AppText>
      ) : (
        <SymbolView name={name!} tintColor={colors.text} size={18} />
      )}
    </Pressable>
  );
}

export function HomeScreen() {
  const { session, signOut } = useAuthSession();
  const { data } = useFeedPostsQuery();
  const { data: stories } = useHomeStoriesQuery();
  const [isComposerVisible, setIsComposerVisible] = useState(true);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  function openNewPostScreen() {
    setIsCreateMenuOpen(false);
    router.push('/new-post');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="fade"
        transparent
        visible={isCreateMenuOpen}
        onRequestClose={() => setIsCreateMenuOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setIsCreateMenuOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => undefined}>
            <View style={styles.modalHeader}>
              <AppText variant="title">Create</AppText>
              <Pressable
                onPress={() => setIsCreateMenuOpen(false)}
                style={styles.modalCloseButton}>
                <AppText style={styles.modalCloseLabel}>x</AppText>
              </Pressable>
            </View>
            <AppText style={styles.modalSubtitle}>
              Choose what you want to publish in TrailBlazer.
            </AppText>

            <View style={styles.modalActions}>
              <Pressable onPress={openNewPostScreen} style={styles.modalPrimaryAction}>
                <AppText style={styles.modalPrimaryIcon}>+</AppText>
                <View style={styles.modalActionCopy}>
                  <AppText style={styles.modalPrimaryLabel}>New post</AppText>
                  <AppText style={styles.modalPrimaryHint}>
                    Share photos, stats, and how the trail felt.
                  </AppText>
                </View>
              </Pressable>

              <Pressable style={styles.modalSecondaryAction}>
                <AppText style={styles.modalSecondaryIcon}>+</AppText>
                <View style={styles.modalActionCopy}>
                  <AppText style={styles.modalSecondaryLabel}>New Trail</AppText>
                  <AppText style={styles.modalSecondaryHint}>
                    Add a new route with distance, elevation, and ride notes.
                  </AppText>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Image
                  source="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80"
                  style={styles.brandImage}
                  contentFit="cover"
                />
              </View>
              <View>
                <AppText variant="title" style={styles.brandTitle}>
                  TrailBlazer
                </AppText>
                <AppText style={styles.brandSubtitle}>Ride it. Post it. Save the route.</AppText>
              </View>
            </View>

            <View style={styles.topActions}>
              <TopAction plus onPress={() => setIsCreateMenuOpen(true)} />
              <TopAction
                name={{ ios: 'bell', android: 'notifications_none', web: 'notifications_none' }}
              />
              <TopAction
                name={{ ios: 'paperplane', android: 'near_me', web: 'near_me' }}
              />
              <Pressable onPress={() => void signOut()} style={styles.topAction}>
                <AppText style={styles.topActionLogout}>x</AppText>
              </Pressable>
            </View>
          </View>

          {isComposerVisible ? (
            <View style={styles.composerCard}>
              <View style={styles.composerTopRow}>
                <View style={styles.composerHeader}>
                  <View style={styles.composerAvatar}>
                    <AppText style={styles.composerAvatarText}>
                      {session?.user.displayName?.charAt(0).toUpperCase() ?? 'R'}
                    </AppText>
                  </View>
                  <View style={styles.composerCopy}>
                    <AppText variant="title" style={styles.composerTitle}>
                      Share today&apos;s trail
                    </AppText>
                    <AppText style={styles.composerSubtitle}>
                      Post the best photo, route stats, and what the ride felt like.
                    </AppText>
                  </View>
                </View>
                <Pressable
                  onPress={() => setIsComposerVisible(false)}
                  style={styles.composerCloseButton}>
                  <AppText style={styles.composerCloseLabel}>x</AppText>
                </Pressable>
              </View>

              <View style={styles.composerFooter}>
                <AppText style={styles.composerHint}>
                  Tap the `+` button in the top bar to create a new post or add a new trail.
                </AppText>
              </View>
            </View>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContent}>
            {stories?.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View style={[styles.storyRing, { borderColor: story.color }]}>
                  <View style={[styles.storyCore, { backgroundColor: story.color }]}>
                    <AppText style={styles.storyInitial}>{story.label.charAt(0)}</AppText>
                  </View>
                </View>
                <AppText style={styles.storyLabel}>{story.label}</AppText>
              </View>
            ))}
          </ScrollView>

          <View style={styles.feedHeader}>
            <View>
              <AppText variant="headline" style={styles.feedTitle}>
                Trail feed
              </AppText>
              <AppText>Photos, captions, and route stats from the community.</AppText>
            </View>
            <Pressable style={styles.filterButton}>
              <SymbolView
                name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
                tintColor={colors.accent}
                size={18}
              />
              <AppText style={styles.filterText}>Following</AppText>
            </Pressable>
          </View>

          <View style={styles.feedList}>
            {data?.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </View>

          <View style={styles.bottomSpacer} />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  container: {
    gap: 18,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  brandSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  topAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActionPlus: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  topActionLogout: {
    color: colors.accent,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 8, 38, 0.55)',
    paddingHorizontal: 20,
  },
  modalCard: {
    gap: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseLabel: {
    color: colors.accent,
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: colors.textMuted,
  },
  modalActions: {
    gap: 10,
  },
  modalPrimaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 22,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalSecondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 22,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalPrimaryIcon: {
    color: '#130A25',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
  },
  modalSecondaryIcon: {
    color: colors.accent,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
  },
  modalActionCopy: {
    flex: 1,
    gap: 2,
  },
  modalPrimaryLabel: {
    color: '#130A25',
    fontWeight: '700',
  },
  modalPrimaryHint: {
    color: '#4A3729',
    fontSize: 13,
    lineHeight: 18,
  },
  modalSecondaryLabel: {
    color: colors.accent,
    fontWeight: '700',
  },
  modalSecondaryHint: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  composerCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  composerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  composerHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  composerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerAvatarText: {
    color: '#130A25',
    fontWeight: '700',
  },
  composerCopy: {
    flex: 1,
    gap: 4,
  },
  composerTitle: {
    color: colors.text,
  },
  composerSubtitle: {
    color: colors.textMuted,
  },
  composerCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerCloseLabel: {
    color: colors.accent,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  composerFooter: {
    gap: 14,
  },
  composerHint: {
    color: colors.textMuted,
  },
  storiesContent: {
    gap: 14,
    paddingRight: 8,
  },
  storyItem: {
    alignItems: 'center',
    gap: 8,
  },
  storyRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
  },
  storyCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInitial: {
    color: colors.text,
    fontWeight: '800',
  },
  storyLabel: {
    fontSize: 13,
    lineHeight: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  feedTitle: {
    fontSize: 30,
    lineHeight: 34,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterText: {
    color: colors.accent,
    fontWeight: '700',
  },
  feedList: {
    gap: 18,
  },
  bottomSpacer: {
    height: 8,
  },
});
