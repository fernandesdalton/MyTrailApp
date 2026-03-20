import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { memo, type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';

import { type FeedPost } from '@/features/home/model/feed-post.types';
import { feedPostCardStyles as styles } from '@/features/home/components/feed-post-card.styles';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

type FeedIconName = ComponentProps<typeof SymbolView>['name'];

type FeedActionProps = {
  count: number;
  name: FeedIconName;
};

const FeedAction = memo(function FeedAction({ count, name }: FeedActionProps) {
  return (
    <View style={styles.action}>
      <SymbolView name={name} tintColor={colors.text} size={18} />
      <AppText style={styles.actionText}>{count}</AppText>
    </View>
  );
});

export const FeedPostCard = memo(function FeedPostCard({ post }: { post: FeedPost }) {
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
        {post.hasTrail ? (
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
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <FeedAction
            count={post.likes}
            name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
          />
          <FeedAction
            count={post.comments}
            name={{
              ios: 'bubble.left',
              android: 'chat_bubble_outline',
              web: 'chat_bubble_outline',
            }}
          />
          {post.hasTrail ? (
            <Pressable style={styles.routeButton}>
              <SymbolView
                name={{ ios: 'paperplane', android: 'near_me', web: 'near_me' }}
                tintColor={colors.accent}
                size={17}
              />
              <AppText style={styles.routeButtonText}>Route</AppText>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.captionBlock}>
          <AppText style={styles.captionAuthor}>{post.userName}</AppText>
          <AppText>{post.caption}</AppText>
        </View>
      </View>
    </View>
  );
});
