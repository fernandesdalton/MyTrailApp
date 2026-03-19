import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { useProfileDataQuery } from '@/features/profile/queries/use-profile-data-query';
import { getProfileAvatarImageStyle, styles } from '@/features/profile/screens/profile-screen.styles';
import { socialApi } from '@/shared/lib/api/resources/social-api';
import { AppText } from '@/shared/ui/app-text';

type ProfileScreenProps = {
  userId?: string;
};

const fallbackTileImage =
  'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80';
const fallbackTrailImage =
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80';

export function ProfileScreen({ userId }: ProfileScreenProps) {
  const { session } = useAuthSession();
  const { data } = useProfileDataQuery(userId);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'posts' | 'favorites'>('posts');

  const profileUser = data?.profileUser ?? {
    id: session?.user.id ?? 'viewer',
    username: session?.user.username ?? 'trailblazer',
    displayName: session?.user.displayName ?? 'Rider',
    avatarUrl: session?.user.avatarUrl ?? null,
    bio: 'Enduro and trail riding enthusiast.',
    locationLabel: null,
  };
  const isOwnProfile = data?.isCurrentUser ?? (!userId || userId === session?.user.id);
  const viewedUserIsConnected = connectedUserIds.includes(profileUser.id);
  const profileMode: 'self' | 'visitor' = isOwnProfile ? 'self' : 'visitor';

  async function handleToggleConnect(targetUserId: string) {
    const viewerId = session?.user.id;
    if (!viewerId || targetUserId === viewerId) {
      return;
    }

    const isConnected = connectedUserIds.includes(targetUserId);
    setConnectedUserIds((current) =>
      isConnected ? current.filter((id) => id !== targetUserId) : [...current, targetUserId]
    );

    try {
      if (isConnected) {
        await socialApi.unfollowUser(targetUserId, viewerId);
      } else {
        await socialApi.followUser(targetUserId, viewerId);
      }
    } catch {
      // Keep the UI responsive while follow persistence evolves.
    }
  }

  function renderAvatar(size: number, ringStyle?: StyleProp<ViewStyle>) {
    return (
      <View style={ringStyle}>
        {profileUser.avatarUrl ? (
          <Image
            source={profileUser.avatarUrl}
            style={getProfileAvatarImageStyle(size)}
          />
        ) : (
          <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
            <AppText style={styles.avatarLabel}>
              {profileUser.displayName.charAt(0).toUpperCase()}
            </AppText>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if ('canGoBack' in router && typeof router.canGoBack === 'function' && router.canGoBack()) {
                  router.back();
                }
              }}
              style={styles.headerIcon}>
              <AppText style={styles.headerIconLabel}>{'<'}</AppText>
            </Pressable>

            <View style={styles.handleRow}>
              <AppText style={styles.handle}>{profileUser.username}</AppText>
            </View>

            <View style={styles.headerActions}>
              <Pressable style={styles.headerIcon}>
                <AppText style={styles.headerIconLabel}>o</AppText>
              </Pressable>
              <Pressable style={styles.headerIcon}>
                <AppText style={styles.headerIconLabel}>=</AppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarRing}>{renderAvatar(78)}</View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statValue}>{data?.postCount ?? 0}</AppText>
                <AppText style={styles.statLabel}>POSTS</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statValue}>{data?.favoriteTrailCount ?? 0}</AppText>
                <AppText style={styles.statLabel}>TRAILS</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statValue}>
                  {Math.max(data?.connectionCount ?? 0, 0) + (viewedUserIsConnected ? 1 : 0)}
                </AppText>
                <AppText style={styles.statLabel}>CONNECTIONS</AppText>
              </View>
            </View>
          </View>

          <View style={styles.bioBlock}>
            <AppText style={styles.name}>{profileUser.displayName}</AppText>
            <AppText style={styles.bio}>
              {profileUser.bio ?? 'Ripping every ridge and desert line available this season.'}
            </AppText>
            {profileUser.locationLabel ? (
              <AppText style={styles.location}>{profileUser.locationLabel}</AppText>
            ) : null}
          </View>

          {profileMode === 'visitor' ? (
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => void handleToggleConnect(profileUser.id)}
                style={[styles.primaryAction, viewedUserIsConnected && styles.secondaryAction]}>
                <AppText
                  style={[
                    styles.primaryActionLabel,
                    viewedUserIsConnected && styles.secondaryActionLabel,
                  ]}>
                  {viewedUserIsConnected ? 'Connected' : 'Connect'}
                </AppText>
              </Pressable>
              <Pressable style={styles.secondaryAction}>
                <AppText style={styles.secondaryActionLabel}>Message</AppText>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.segmentedRow}>
            <Pressable
              onPress={() => setActiveSection('posts')}
              style={[styles.segment, activeSection === 'posts' && styles.segmentActive]}>
              <AppText style={[styles.segmentLabel, activeSection === 'posts' && styles.segmentLabelActive]}>
                Posts
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setActiveSection('favorites')}
              style={[styles.segment, activeSection === 'favorites' && styles.segmentActive]}>
              <AppText
                style={[styles.segmentLabel, activeSection === 'favorites' && styles.segmentLabelActive]}>
                Favorite Trails
              </AppText>
            </Pressable>
          </View>

          {activeSection === 'posts' ? (
            <View style={styles.grid}>
              {(data?.posts ?? []).map((post) => (
                <View key={post.id} style={styles.gridTile}>
                  <Image
                    source={post.imageUrl || fallbackTileImage}
                    style={styles.gridImage}
                    contentFit="cover"
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.favoriteList}>
              {(data?.favoriteTrails ?? []).map((trail) => (
                <View key={trail.id} style={styles.favoriteCard}>
                  <Image
                    source={trail.coverImageUrl ?? fallbackTrailImage}
                    style={styles.favoriteImage}
                    contentFit="cover"
                  />
                  <View style={styles.favoriteCopy}>
                    <AppText style={styles.favoriteTitle}>{trail.title}</AppText>
                    <AppText style={styles.favoriteMeta}>
                      {`${(trail.distanceMeters / 1000).toFixed(1)} km | ${Math.round(
                        trail.elevationGainMeters
                      )} m | ${Math.max(Math.round(trail.durationSeconds / 60), 1)} min`}
                    </AppText>
                    {trail.regionLabel ? (
                      <AppText style={styles.favoriteRegion}>{trail.regionLabel}</AppText>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}

          {profileMode === 'self' ? (
            <View style={styles.connectSection}>
              <View style={styles.connectHeader}>
                <AppText style={styles.connectTitle}>Suggested riders</AppText>
                <AppText style={styles.connectSubtitle}>Tap a rider to open their profile.</AppText>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.connectRow}>
                {(data?.suggestedUsers ?? []).map((suggestedUser) => {
                  const isConnected = connectedUserIds.includes(suggestedUser.id);

                  return (
                    <View key={suggestedUser.id} style={styles.connectCard}>
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/profile/[userId]',
                            params: { userId: suggestedUser.id },
                          })
                        }
                        style={styles.connectProfileLink}>
                        <View style={styles.connectAvatar}>
                          {suggestedUser.avatarUrl ? (
                            <Image source={suggestedUser.avatarUrl} style={styles.connectAvatarImage} />
                          ) : (
                            <AppText style={styles.connectAvatarLabel}>
                              {suggestedUser.displayName.charAt(0).toUpperCase()}
                            </AppText>
                          )}
                        </View>
                        <AppText numberOfLines={1} style={styles.connectName}>
                          {suggestedUser.displayName}
                        </AppText>
                        <AppText numberOfLines={1} style={styles.connectHandle}>
                          @{suggestedUser.username}
                        </AppText>
                      </Pressable>
                      <Pressable
                        onPress={() => void handleToggleConnect(suggestedUser.id)}
                        style={[styles.connectButton, isConnected && styles.connectButtonActive]}>
                        <AppText
                          style={[styles.connectButtonLabel, isConnected && styles.connectButtonLabelActive]}>
                          {isConnected ? 'Connected' : 'Connect'}
                        </AppText>
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
