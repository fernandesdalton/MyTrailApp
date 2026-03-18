import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type MapboxModuleType from '@rnmapbox/maps';

import {
  currentLocationMapStyles as styles,
  MapNoticeCard,
} from '@/features/home/components/current-location-map.shared';
import { colors } from '@/shared/theme/colors';
import { AppText } from '@/shared/ui/app-text';

const defaultCoordinate: [number, number] = [-46.6333, -23.5505];
const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
const mapbox = safeRequireMapbox();

type LocationState = {
  latitude: number;
  longitude: number;
};

type PermissionState = 'checking' | 'denied' | 'granted';

function formatCoordinate(value: number) {
  return value.toFixed(5);
}

function safeRequireMapbox(): typeof MapboxModuleType | null {
  try {
    return require('@rnmapbox/maps').default as typeof MapboxModuleType;
  } catch {
    return null;
  }
}

export function CurrentLocationMap() {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    if (mapboxAccessToken && mapbox) {
      void mapbox.setAccessToken(mapboxAccessToken);
    }
  }, []);

  useEffect(() => {
    void requestAndLoadLocation();
  }, []);

  async function requestAndLoadLocation() {
    setIsRefreshing(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setPermission('denied');
        setLocation(null);
        return;
      }

      setPermission('granted');

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  if (!mapboxAccessToken) {
    return (
      <MapNoticeCard
        title="Add your Mapbox token"
        description="Create a `.env` file from `.env.example` and set `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` to show the live map."
      />
    );
  }

  if (isExpoGo) {
    return (
      <MapNoticeCard
        title="Use a development build"
        description="`@rnmapbox/maps` needs native code, so this screen must run in a dev build or production build, not Expo Go."
      />
    );
  }

  if (!mapbox) {
    return (
      <MapNoticeCard
        title="Rebuild the native app"
        description="Mapbox was added to the project, but the Android/iOS app binary you launched does not include the native Mapbox module yet."
        footerText="Create a fresh development build after installing the package, then open the app from that new build."
      />
    );
  }

  if (permission === 'denied') {
    return (
      <MapNoticeCard
        title="Location permission is off"
        description="Allow location access to center the map on where you are."
        actionLabel="Try again"
        onPress={requestAndLoadLocation}
      />
    );
  }

  const { Camera, LocationPuck, MapView, StyleURL, UserTrackingMode } = mapbox;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Live position</AppText>
          <AppText>
            {location
              ? `${formatCoordinate(location.latitude)}, ${formatCoordinate(location.longitude)}`
              : 'Requesting permission and loading your current location.'}
          </AppText>
        </View>
        <Pressable onPress={requestAndLoadLocation} style={styles.refreshButton}>
          <AppText style={styles.refreshLabel}>Refresh</AppText>
        </Pressable>
      </View>

      <View style={styles.mapCard}>
        <MapView
          style={StyleSheet.absoluteFill}
          styleURL={StyleURL.Light}
          logoEnabled={false}
          scaleBarEnabled={false}
          compassEnabled
          attributionEnabled={false}>
          <Camera
            defaultSettings={{
              centerCoordinate: defaultCoordinate,
              zoomLevel: 11,
            }}
            centerCoordinate={
              location ? [location.longitude, location.latitude] : defaultCoordinate
            }
            zoomLevel={location ? 14 : 11}
            animationMode="flyTo"
            animationDuration={900}
            followUserLocation={permission === 'granted' && Boolean(location)}
            followUserMode={UserTrackingMode.Follow}
          />
          <LocationPuck
            visible
            puckBearing="heading"
            puckBearingEnabled
            pulsing={{ isEnabled: true, color: colors.accentSoft, radius: 'accuracy' }}
          />
        </MapView>

        <View style={styles.mapOverlay}>
          <View style={styles.mapBadge}>
            {isRefreshing ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <AppText style={styles.mapBadgeText}>
                {location ? 'You are here' : 'Waiting for GPS'}
              </AppText>
            )}
          </View>
          <View style={styles.mapHint}>
            <AppText style={styles.mapHintText}>
              Pan and zoom the map, or tap refresh to load your current position again.
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}
