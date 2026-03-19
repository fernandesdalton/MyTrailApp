import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

export function ProfileScreen() {
  const { session } = useAuthSession();
  const user = session?.user;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarLabel}>
              {user?.displayName?.charAt(0).toUpperCase() ?? 'R'}
            </AppText>
          </View>
          <AppText style={styles.name}>{user?.displayName ?? 'Rider'}</AppText>
          <AppText style={styles.handle}>{`@${user?.username ?? 'trailblazer'}`}</AppText>
          <AppText style={styles.email}>{user?.email ?? 'rider@trailblazer.app'}</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Profile</AppText>
          <AppText style={styles.cardCopy}>
            This tab is ready for your ride stats, saved trails, posts, and account settings.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 18,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  avatarLabel: {
    color: '#130A25',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
  },
  handle: {
    color: colors.accent,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  email: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    gap: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  cardCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
