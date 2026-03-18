import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type MapboxModuleType from '@rnmapbox/maps';

import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
const defaultCoordinate: [number, number] = [-111.891, 40.7608];
const mapbox = safeRequireMapbox();

type LocationState = {
  latitude: number;
  longitude: number;
};

type PermissionState = 'checking' | 'denied' | 'granted';

function safeRequireMapbox(): typeof MapboxModuleType | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@rnmapbox/maps').default as typeof MapboxModuleType;
  } catch {
    return null;
  }
}

function createRoute([longitude, latitude]: [number, number]) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: [
        [longitude - 0.028, latitude - 0.02],
        [longitude - 0.022, latitude - 0.008],
        [longitude - 0.012, latitude - 0.004],
        [longitude - 0.008, latitude + 0.006],
        [longitude - 0.014, latitude + 0.02],
        [longitude - 0.004, latitude + 0.034],
        [longitude + 0.006, latitude + 0.042],
        [longitude + 0.004, latitude + 0.06]
      ]
    }
  };
}

function NoticeCard({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <SafeAreaView style={styles.fallbackScreen}>
      <View style={styles.fallbackCard}>
        <AppText variant="title">{title}</AppText>
        <AppText>{description}</AppText>
      </View>
    </SafeAreaView>
  );
}

export function TrackingMapScreen() {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const [location, setLocation] = useState<LocationState | null>(null);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    if (mapboxAccessToken && mapbox) {
      void mapbox.setAccessToken(mapboxAccessToken);
    }
  }, []);

  useEffect(() => {
    void loadLocation();
  }, []);

  async function loadLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== Location.PermissionStatus.GRANTED) {
      setPermission('denied');
      return;
    }

    setPermission('granted');

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });

    setLocation({
      latitude: current.coords.latitude,
      longitude: current.coords.longitude
    });
  }

  if (!mapboxAccessToken) {
    return (
      <NoticeCard
        title="Add your Mapbox token"
        description="Create a .env file from .env.example and set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to render the tracking map."
      />
    );
  }

  if (isExpoGo) {
    return (
      <NoticeCard
        title="Use a development build"
        description="@rnmapbox/maps needs native code, so this live tracking screen cannot run inside Expo Go."
      />
    );
  }

  if (!mapbox) {
    return (
      <NoticeCard
        title="Rebuild the native app"
        description="The installed app binary does not include the native Mapbox module yet. Build a fresh dev client and open the app from that build."
      />
    );
  }

  if (permission === 'denied') {
    return (
      <NoticeCard
        title="Location permission is off"
        description="Allow location access so the tracking map can center the route around your current position."
      />
    );
  }

  const { Camera, CircleLayer, LineLayer, LocationPuck, MapView, ShapeSource, StyleURL } = mapbox;
  const centerCoordinate: [number, number] = location
    ? [location.longitude, location.latitude]
    : defaultCoordinate;

  const routeFeature = createRoute(centerCoordinate);
  const finishPoint = routeFeature.geometry.coordinates[routeFeature.geometry.coordinates.length - 1];
  const finishFeature = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: finishPoint
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.mapShell}>
        <MapView
          style={StyleSheet.absoluteFill}
          styleURL={StyleURL.Outdoors}
          logoEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}>
          <Camera
            defaultSettings={{
              centerCoordinate,
              zoomLevel: 12.4,
              pitch: 12
            }}
            centerCoordinate={centerCoordinate}
            zoomLevel={12.4}
            pitch={12}
            animationMode="flyTo"
            animationDuration={900}
          />
          <ShapeSource id="tracking-route" shape={routeFeature}>
            <LineLayer
              id="tracking-line"
              style={{
                lineColor: '#FF6A00',
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </ShapeSource>
          <ShapeSource id="tracking-finish" shape={finishFeature}>
            <CircleLayer
              id="tracking-finish-circle"
              style={{
                circleColor: '#FF6A00',
                circleRadius: 6,
                circleStrokeWidth: 3,
                circleStrokeColor: '#FFF7ED'
              }}
            />
          </ShapeSource>
          <LocationPuck
            visible
            puckBearing="heading"
            puckBearingEnabled
            pulsing={{ isEnabled: true, color: '#FFD8BF', radius: 44 }}
          />
        </MapView>

        <View style={styles.overlay}>
          <View style={styles.topRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <AppText style={styles.liveBadgeText}>LIVE TRACKING</AppText>
            </View>
            <Pressable style={styles.iconButton}>
              <AppText style={styles.iconButtonText}>o</AppText>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <AppText style={styles.statLabel}>SPEED</AppText>
              <View style={styles.statValueRow}>
                <AppText style={styles.statValue}>42</AppText>
                <AppText style={styles.statUnit}>KM/H</AppText>
              </View>
            </View>
            <View style={styles.statCard}>
              <AppText style={styles.statLabel}>DISTANCE</AppText>
              <View style={styles.statValueRow}>
                <AppText style={styles.statValue}>12.8</AppText>
                <AppText style={styles.statUnit}>KM</AppText>
              </View>
            </View>
            <View style={styles.statCard}>
              <AppText style={styles.statLabel}>TIME</AppText>
              <AppText style={styles.statValueCompact}>00:45:12</AppText>
            </View>
            <View style={styles.statCard}>
              <AppText style={styles.statLabel}>ALTITUDE</AppText>
              <View style={styles.statValueRow}>
                <AppText style={styles.statValueCompact}>842</AppText>
                <AppText style={styles.statUnit}>M</AppText>
              </View>
            </View>
          </View>

          <View style={styles.sideControls}>
            <Pressable style={styles.controlButton}>
              <AppText style={styles.controlButtonText}>+</AppText>
            </Pressable>
            <Pressable style={styles.controlButton}>
              <AppText style={styles.controlButtonText}>-</AppText>
            </Pressable>
            <Pressable style={styles.locationButton} onPress={() => void loadLocation()}>
              <AppText style={styles.locationButtonText}>o</AppText>
            </Pressable>
          </View>

          <View style={styles.bottomActions}>
            <Pressable style={styles.pauseButton}>
              <AppText style={styles.pauseButtonText}>PAUSE</AppText>
            </Pressable>
            <Pressable style={styles.finishButton}>
              <AppText style={styles.finishButtonText}>FINISH</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#DDEEDF'
  },
  mapShell: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'space-between'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(35, 44, 38, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6A00'
  },
  liveBadgeText: {
    color: '#FFF7ED',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700'
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(35, 44, 38, 0.92)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '700'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    backgroundColor: 'rgba(58, 70, 61, 0.94)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6
  },
  statLabel: {
    color: '#C5D6C5',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700'
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '800'
  },
  statValueCompact: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800'
  },
  statUnit: {
    color: '#FF8A33',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700'
  },
  sideControls: {
    position: 'absolute',
    right: 12,
    bottom: 112,
    gap: 10
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(48, 59, 52, 0.92)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700'
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700'
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  pauseButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(26, 31, 29, 0.94)',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700'
  },
  finishButton: {
    flex: 1.15,
    borderRadius: 14,
    backgroundColor: '#FF6A00',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700'
  },
  fallbackScreen: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    padding: 16
  },
  fallbackCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    padding: 20,
    gap: 12
  }
});
