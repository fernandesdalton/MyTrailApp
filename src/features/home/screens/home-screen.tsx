import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { useFeedPostsQuery } from '@/features/home/queries/use-feed-posts-query';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

type FeedIconName = ComponentProps<typeof SymbolView>['name'];

const highlightChips = ['Dual Sport', 'Forest Trails', 'River Crossings', 'Sunset Loops'];
const storyUsers = [
  { id: 'you', label: 'You', color: '#6D28D9' },
  { id: 'jake', label: 'Jake', color: '#A78BFA' },
  { id: 'sarah', label: 'Sarah', color: '#C4B5FD' },
  { id: 'rafa', label: 'Rafa', color: '#DDD6FE' },
];

function TopAction({ name }: { name: FeedIconName }) {
  return (
    <Pressable style={styles.topAction}>
      <SymbolView name={name} tintColor={colors.text} size={18} />
    </Pressable>
  );
}

export function HomeScreen() {
  const { data } = useFeedPostsQuery();

  return (
    <SafeAreaView style={styles.safeArea}>
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
              <TopAction
                name={{ ios: 'bell', android: 'notifications_none', web: 'notifications_none' }}
              />
              <TopAction
                name={{ ios: 'paperplane', android: 'near_me', web: 'near_me' }}
              />
            </View>
          </View>

          <View style={styles.composerCard}>
            <View style={styles.composerHeader}>
              <View style={styles.composerAvatar}>
                <AppText style={styles.composerAvatarText}>D</AppText>
              </View>
              <View style={styles.composerCopy}>
                <AppText variant="title" style={styles.composerTitle}>
                  Share today&apos;s trail
                </AppText>
                <AppText>Post the best photo, route stats, and what the ride felt like.</AppText>
              </View>
            </View>
            <View style={styles.composerFooter}>
              <View style={styles.chipsRow}>
                {highlightChips.map((chip) => (
                  <View key={chip} style={styles.chip}>
                    <AppText style={styles.chipText}>{chip}</AppText>
                  </View>
                ))}
              </View>
              <Pressable style={styles.postButton}>
                <SymbolView
                  name={{ ios: 'plus', android: 'add', web: 'add' }}
                  tintColor="#FFFFFF"
                  size={18}
                />
                <AppText style={styles.postButtonText}>New post</AppText>
              </Pressable>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContent}>
            {storyUsers.map((story) => (
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
    backgroundColor: '#FBF7FF',
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
    borderColor: '#E9D5FF',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#2E1065',
    gap: 16,
  },
  composerHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  composerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  composerCopy: {
    flex: 1,
    gap: 4,
  },
  composerTitle: {
    color: '#FFFFFF',
  },
  composerFooter: {
    gap: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: '#F5EEFF',
    fontSize: 13,
    lineHeight: 16,
  },
  postButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
