import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type MapboxModuleType from '@rnmapbox/maps';

import {
  trackingFinishCircleStyle,
  trackingMapNativeStyles as styles,
  trackingRouteLineStyle,
} from '@/features/explore/components/tracking-map.native.styles';
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
          style={styles.mapFill}
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
              style={trackingRouteLineStyle}
            />
          </ShapeSource>
          <ShapeSource id="tracking-finish" shape={finishFeature}>
            <CircleLayer
              id="tracking-finish-circle"
              style={trackingFinishCircleStyle}
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
