import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useHomeHighlightsQuery } from '@/features/home/queries/home-highlights-query';
import { useHomeStore } from '@/features/home/store/use-home-store';
import { colors } from '@/shared/theme/colors';
import { AppScreen } from '@/shared/ui/app-screen';
import { AppText } from '@/shared/ui/app-text';

export function HomeScreen() {
  const { data } = useHomeHighlightsQuery();
  const onboardingDone = useHomeStore((state) => state.onboardingDone);
  const markOnboardingDone = useHomeStore((state) => state.markOnboardingDone);

  return (
    <AppScreen>
      <View style={styles.hero}>
        <AppText variant="headline">Build the trail app on a modern RN foundation.</AppText>
        <AppText>
          This starter keeps the routing layer thin, separates feature logic, and leaves room for
          auth, maps, offline sync, and native integrations without a rewrite.
        </AppText>
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerText}>
          <AppText variant="title">Current baseline</AppText>
          <AppText>Expo SDK 55, React Native 0.83.2, React 19.2, strict TypeScript.</AppText>
        </View>
        <Pressable onPress={markOnboardingDone} style={styles.button}>
          <AppText style={styles.buttonText}>
            {onboardingDone ? 'Checklist done' : 'Mark checklist done'}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <AppText variant="title">Architecture choices</AppText>
        {data?.map((item) => (
          <View key={item.id} style={styles.card}>
            <AppText variant="title">{item.title}</AppText>
            <AppText>{item.description}</AppText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <AppText variant="title">Good next steps</AppText>
        <View style={styles.card}>
          <AppText>1. Create `features/auth` and route group `src/app/(auth)`.</AppText>
          <AppText>2. Add an API client and schema-validated DTOs.</AppText>
          <AppText>3. Introduce tests around your first real feature, not generic examples.</AppText>
        </View>
        <Link href="/(tabs)/explore" asChild>
          <Pressable style={styles.secondaryButtonLink}>
            <AppText style={styles.secondaryButtonText}>See project structure</AppText>
          </Pressable>
        </Link>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
    paddingTop: 12,
  },
  banner: {
    gap: 16,
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerText: {
    gap: 8,
  },
  section: {
    gap: 12,
  },
  card: {
    gap: 8,
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.accentSoft,
  },
  secondaryButtonLink: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.accentSoft,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
});
