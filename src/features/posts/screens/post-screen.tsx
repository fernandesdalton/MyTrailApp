import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, ActivityIndicator, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { FeedPostCard } from '@/features/home/components/feed-post-card';
import { getPostDetail } from '@/features/posts/api/get-post-detail';
import { postsApi } from '@/shared/lib/api/resources/posts-api';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';
import { styles } from '@/features/posts/screens/post-screen.styles';

type PostScreenProps = {
  postId: string;
};

export function PostScreen({ postId }: PostScreenProps) {
  const { session } = useAuthSession();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['posts', 'detail', postId],
    enabled: Boolean(postId),
    queryFn: () => getPostDetail(postId),
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => postsApi.remove(postId),
    onSuccess: async () => {
      const viewerId = session?.user.id;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['profile'] }),
        queryClient.invalidateQueries({ queryKey: ['home'] }),
        ...(viewerId ? [queryClient.invalidateQueries({ queryKey: ['posts', 'composer-data', viewerId] })] : []),
      ]);

      queryClient.removeQueries({ queryKey: ['posts', 'detail', postId] });

      if ('canGoBack' in router && typeof router.canGoBack === 'function' && router.canGoBack()) {
        router.back();
        return;
      }

      router.replace('/(tabs)/profile');
    },
  });

  const canDelete = data?.authorId === session?.user.id;

  function handleDelete() {
    setIsMenuOpen(false);

    Alert.alert('Delete post?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePostMutation.mutate(),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="fade"
        transparent
        visible={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setIsMenuOpen(false)}>
          <Pressable style={styles.menuCard} onPress={() => undefined}>
            <Pressable
              onPress={handleDelete}
              disabled={deletePostMutation.isPending}
              style={[styles.menuAction, styles.menuActionDanger]}>
              <AppText style={[styles.menuActionLabel, styles.menuActionDangerLabel]}>
                {deletePostMutation.isPending ? 'Deleting...' : 'Delete post'}
              </AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.topBarSide}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if ('canGoBack' in router && typeof router.canGoBack === 'function' && router.canGoBack()) {
                  router.back();
                  return;
                }

                router.replace('/(tabs)/profile');
              }}
              style={styles.iconButton}>
              <AppText style={styles.iconButtonLabel}>{'<'}</AppText>
            </Pressable>
          </View>

          <AppText style={styles.title}>Post</AppText>

          <View style={styles.topBarSide}>
            {canDelete ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsMenuOpen(true)}
                style={styles.iconButton}>
                <SymbolView
                  name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
                  tintColor={colors.text}
                  size={18}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator color={colors.accent} />
            <AppText style={styles.stateText}>Loading post...</AppText>
          </View>
        ) : null}

        {isError ? (
          <View style={styles.centeredState}>
            <AppText style={styles.stateText}>The post could not be loaded right now.</AppText>
            <Pressable onPress={() => void refetch()} style={styles.primaryButton}>
              <AppText style={styles.primaryButtonLabel}>Try again</AppText>
            </Pressable>
          </View>
        ) : null}

        {data ? (
          <View style={styles.cardWrap}>
            <FeedPostCard post={data.post} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
