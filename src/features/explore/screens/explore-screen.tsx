import { StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { AppScreen } from '@/shared/ui/app-screen';
import { AppText } from '@/shared/ui/app-text';

const architectureGroups = [
  {
    title: 'src/app',
    description: 'Routing only. Keep loaders, navigation, and redirects here.',
  },
  {
    title: 'src/features',
    description: 'Business-centric modules with screens, api, queries, store, and components.',
  },
  {
    title: 'src/shared',
    description: 'Reusable primitives, theme tokens, and cross-feature libraries.',
  },
  {
    title: 'src/core',
    description: 'Top-level providers, app bootstrapping, and startup concerns.',
  },
];

export function ExploreScreen() {
  return (
    <AppScreen>
      <View style={styles.header}>
        <AppText variant="headline">Project structure that scales</AppText>
        <AppText>
          Start simple, but draw boundaries early. That keeps the app ready for real product work
          instead of turning the first prototype into a long-term bottleneck.
        </AppText>
      </View>

      {architectureGroups.map((group) => (
        <View key={group.title} style={styles.card}>
          <AppText variant="title">{group.title}</AppText>
          <AppText>{group.description}</AppText>
        </View>
      ))}

      <View style={styles.card}>
        <AppText variant="title">Recommended rules of thumb</AppText>
        <AppText>Feature files can depend on `shared` and `core`, but not on other features.</AppText>
        <AppText>API shapes should be validated at the boundary before reaching UI.</AppText>
        <AppText>Keep route components tiny and move most logic into feature screens.</AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: 12,
  },
  card: {
    gap: 8,
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
