import { View } from 'react-native';

import { currentLocationMapStyles as styles } from '@/features/home/components/current-location-map.shared.styles';
import { MapNoticeCard } from '@/features/home/components/current-location-map.shared';

export function CurrentLocationMap() {
  return (
    <View style={styles.wrapper}>
      <MapNoticeCard
        title="Map preview is native-only for now"
        description="This project uses `@rnmapbox/maps`, which is intended for the native app build. The web bundle now falls back cleanly instead of trying to load Mapbox CSS."
        footerText="Use a dev build on Android or iOS to see the live map and your current location."
      />
    </View>
  );
}
