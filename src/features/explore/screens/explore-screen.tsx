import { StyleSheet, View } from 'react-native';

// Expo resolves platform files correctly here, but ESLint's import resolver does not.
// eslint-disable-next-line import/no-unresolved
import { CurrentLocationMap } from '@/features/home/components/current-location-map';
import { colors } from '@/shared/theme/colors';
import { AppScreen } from '@/shared/ui/app-screen';
import { AppText } from '@/shared/ui/app-text';

export function ExploreScreen() {
  return (
    <AppScreen contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <AppText variant="headline">Map</AppText>
        <AppText>
          Open the live map, see where you are, and use this space next for saved routes, nearby
          riders, or trail discovery.
        </AppText>
      </View>

      <CurrentLocationMap />

      <View style={styles.card}>
        <AppText variant="title">Next map features</AppText>
        <AppText>1. Pin saved rides and favorite loops.</AppText>
        <AppText>2. Show nearby trail posts around the current viewport.</AppText>
        <AppText>3. Let riders open route details directly from the map.</AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 32,
  },
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
