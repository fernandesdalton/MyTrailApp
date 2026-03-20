import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useScrollToTop } from '@react-navigation/native';
import { memo, type ComponentProps, useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { type FeedPost } from '@/features/home/model/feed-post.types';
import { type HomeStory } from '@/features/home/model/story.types';
import { homeScreenStyles as styles } from '@/features/home/screens/home-screen.styles';
import { useHomeStoriesQuery } from '@/features/home/queries/use-home-stories-query';
import { useFeedPostsQuery } from '@/features/home/queries/use-feed-posts-query';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

type FeedIconName = ComponentProps<typeof SymbolView>['name'];

const TopAction = memo(function TopAction({
  name,
  onPress,
  plus,
  testID,
}: {
  name?: FeedIconName;
  onPress?: () => void;
  plus?: boolean;
  testID?: string;
}) {
  return (
    <Pressable style={styles.topAction} onPress={onPress} testID={testID}>
      {plus ? (
        <AppText style={styles.topActionPlus}>+</AppText>
      ) : (
        <SymbolView name={name!} tintColor={colors.text} size={18} />
      )}
    </Pressable>
  );
});

const FeedSpacer = memo(function FeedSpacer() {
  return <View style={styles.feedItemSpacer} />;
});

const FeedFooter = memo(function FeedFooter({ isFetchingNextPage }: { isFetchingNextPage: boolean }) {
  if (isFetchingNextPage) {
    return (
      <View style={styles.feedFooter}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <View style={styles.bottomSpacer} />;
});

const StoryBubble = memo(function StoryBubble({ story }: { story: HomeStory }) {
  return (
    <View style={styles.storyItem}>
      <View style={[styles.storyRing, { borderColor: story.color }]}>
        <View style={[styles.storyCore, { backgroundColor: story.color }]}>
          <AppText style={styles.storyInitial}>{story.label.charAt(0)}</AppText>
        </View>
      </View>
      <AppText style={styles.storyLabel}>{story.label}</AppText>
    </View>
  );
});

export function HomeScreen() {
  const feedListRef = useRef<FlatList<FeedPost>>(null);
  useScrollToTop(feedListRef);
  const { session, signOut } = useAuthSession();
  const viewerId = session?.user.id;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching: isFeedRefetching,
    refetch: refetchFeed,
  } = useFeedPostsQuery(viewerId);
  const {
    data: stories,
    isRefetching: isStoriesRefetching,
    refetch: refetchStories,
  } = useHomeStoriesQuery(viewerId);
  const [isComposerVisible, setIsComposerVisible] = useState(true);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const feedPosts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const isRefreshing = isFeedRefetching || isStoriesRefetching;

  const openNewPostScreen = useCallback(() => {
    setIsCreateMenuOpen(false);
    router.push('/new-post');
  }, []);

  const openProfileTab = useCallback(() => {
    setIsMenuOpen(false);
    router.push('/(tabs)/profile');
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    await fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchFeed(), refetchStories()]);
  }, [refetchFeed, refetchStories]);

  const handleOpenCreateMenu = useCallback(() => {
    setIsCreateMenuOpen(true);
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const handleCloseComposer = useCallback(() => {
    setIsComposerVisible(false);
  }, []);

  const handleRefreshList = useCallback(() => {
    void handleRefresh();
  }, [handleRefresh]);

  const handleEndReached = useCallback(() => {
    void handleLoadMore();
  }, [handleLoadMore]);

  const keyExtractor = useCallback((post: FeedPost) => post.id, []);

  const renderFeedItem = useCallback(({ item }: { item: FeedPost }) => <FeedPostCard post={item} />, []);

  const listFooter = useMemo(
    () => <FeedFooter isFetchingNextPage={isFetchingNextPage} />,
    [isFetchingNextPage]
  );

  const header = (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarSide}>
          <TopAction plus onPress={handleOpenCreateMenu} testID="open-create-menu" />
        </View>

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
              Trailgram
            </AppText>
            <AppText style={styles.brandSubtitle}>Ride it. Post it. Save the route.</AppText>
          </View>
        </View>

        <View style={styles.topBarSide}>
          <TopAction
            name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
            onPress={handleOpenMenu}
            testID="open-main-menu"
          />
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
              onPress={handleCloseComposer}
              style={styles.composerCloseButton}
              testID="close-home-composer">
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
          <StoryBubble key={story.id} story={story} />
        ))}
      </ScrollView>

      <View style={styles.feedHeader}>
        <View>
          <AppText variant="headline" style={styles.feedTitle}>
            Trail feed
          </AppText>
          <AppText>Photos, captions, and route stats from people you follow.</AppText>
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
    </View>
  );

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
              Choose what you want to publish in Trailgram.
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

      <Modal
        animationType="fade"
        transparent
        visible={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setIsMenuOpen(false)}>
          <Pressable style={styles.menuCard} onPress={() => undefined}>
            <View style={styles.menuHeader}>
              <View style={styles.menuProfileRow}>
                <View style={styles.menuAvatar}>
                  <AppText style={styles.menuAvatarLabel}>
                    {session?.user.displayName?.charAt(0).toUpperCase() ?? 'R'}
                  </AppText>
                </View>
                <View style={styles.menuProfileCopy}>
                  <AppText style={styles.menuName}>{session?.user.displayName ?? 'Rider'}</AppText>
                  <AppText style={styles.menuHandle}>{`@${session?.user.username ?? 'trailblazer'}`}</AppText>
                </View>
              </View>
              <Pressable onPress={() => setIsMenuOpen(false)} style={styles.modalCloseButton}>
                <AppText style={styles.modalCloseLabel}>x</AppText>
              </Pressable>
            </View>

            <View style={styles.menuActions}>
              <Pressable onPress={openProfileTab} style={styles.menuAction}>
                <AppText style={styles.menuActionTitle}>Profile</AppText>
                <AppText style={styles.menuActionHint}>See your rider card and account details.</AppText>
              </Pressable>
              <Pressable style={styles.menuAction}>
                <AppText style={styles.menuActionTitle}>Informations</AppText>
                <AppText style={styles.menuActionHint}>App info, support, and upcoming features.</AppText>
              </Pressable>
              <Pressable style={styles.menuAction}>
                <AppText style={styles.menuActionTitle}>Preferences</AppText>
                <AppText style={styles.menuActionHint}>Tune feed, tracking, and trail discovery settings.</AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsMenuOpen(false);
                  void signOut();
                }}
                style={[styles.menuAction, styles.menuActionDanger]}>
                <AppText style={styles.menuActionDangerTitle}>Disconnect</AppText>
                <AppText style={styles.menuActionHint}>Sign out from this device.</AppText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <FlatList
        ref={feedListRef}
        data={feedPosts}
        keyExtractor={keyExtractor}
        renderItem={renderFeedItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListFooterComponent={listFooter}
        ItemSeparatorComponent={FeedSpacer}
        refreshing={isRefreshing}
        onRefresh={handleRefreshList}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        onEndReachedThreshold={0.4}
        onEndReached={handleEndReached}
      />
    </SafeAreaView>
  );
}
