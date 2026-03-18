import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { type FeedPost } from '@/features/home/model/feed-post.types';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

type FeedIconName = ComponentProps<typeof SymbolView>['name'];

type FeedActionProps = {
  count: number;
  name: FeedIconName;
};

function FeedAction({ count, name }: FeedActionProps) {
  return (
    <View style={styles.action}>
      <SymbolView name={name} tintColor={colors.text} size={18} />
      <AppText style={styles.actionText}>{count}</AppText>
    </View>
  );
}

export function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userMeta}>
          <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
            <AppText style={styles.avatarLabel}>{post.userName.charAt(0)}</AppText>
          </View>
          <View style={styles.userText}>
            <AppText variant="title" style={styles.userName}>
              {post.userName}
            </AppText>
            <AppText style={styles.metaText}>
              {post.postedAt} • {post.handle}
            </AppText>
          </View>
        </View>
        <SymbolView
          name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
          tintColor={colors.textMuted}
          size={18}
        />
      </View>

      <View style={styles.mediaFrame}>
        <Image source={post.imageUrl} style={styles.image} contentFit="cover" transition={150} />
        <View style={styles.overlay}>
          <View style={styles.trailPill}>
            <AppText style={styles.trailPillText}>{post.trailName}</AppText>
          </View>

          <View style={styles.statBar}>
            <View style={styles.stat}>
              <AppText style={styles.statLabel}>DISTANCE</AppText>
              <AppText style={styles.statValue}>{post.distance}</AppText>
            </View>
            <View style={styles.stat}>
              <AppText style={styles.statLabel}>DURATION</AppText>
              <AppText style={styles.statValue}>{post.duration}</AppText>
            </View>
            <View style={styles.stat}>
              <AppText style={styles.statLabel}>ELEV GAIN</AppText>
              <AppText style={styles.statValue}>{post.elevation}</AppText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <FeedAction
            count={post.likes}
            name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
          />
          <FeedAction
            count={post.comments}
            name={{ ios: 'bubble.left', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
          />
          <Pressable style={styles.routeButton}>
            <SymbolView
              name={{ ios: 'paperplane', android: 'near_me', web: 'near_me' }}
              tintColor={colors.accent}
              size={17}
            />
            <AppText style={styles.routeButtonText}>Route</AppText>
          </Pressable>
        </View>

        <View style={styles.captionBlock}>
          <AppText style={styles.captionAuthor}>{post.userName}</AppText>
          <AppText>{post.caption}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    shadowColor: '#2E1065',
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    color: colors.text,
    fontWeight: '800',
  },
  userText: {
    gap: 2,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    lineHeight: 20,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  mediaFrame: {
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#EDE9FE',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    gap: 12,
    backgroundColor: 'rgba(17, 10, 34, 0.28)',
  },
  trailPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#6D28D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trailPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  statBar: {
    flexDirection: 'row',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.93)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    gap: 12,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  statValue: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  footer: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 18,
  },
  routeButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  routeButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
  captionBlock: {
    gap: 4,
  },
  captionAuthor: {
    fontWeight: '800',
  },
});
