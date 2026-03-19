import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { trackingMapWebStyles as styles } from '@/features/explore/components/tracking-map.web.styles';
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
