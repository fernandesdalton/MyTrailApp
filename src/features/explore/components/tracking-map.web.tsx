import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

export function TrackingMapScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <AppText variant="headline">Tracking map is native-only for now</AppText>
        <AppText>
          The live tracking layout is built for the native Mapbox experience. Open the Android or
          iOS dev build to see the route overlay, stat cards, and ride controls.
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    padding: 16
  },
  card: {
    gap: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    padding: 20
  }
});
