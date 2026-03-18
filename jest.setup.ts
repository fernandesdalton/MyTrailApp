/* eslint-disable @typescript-eslint/no-require-imports */
import { jest } from '@jest/globals';

jest.mock('expo-image', () => ({
  Image: ({ children, ...props }: Record<string, unknown>) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
}));

jest.mock('expo-symbols', () => ({
  SymbolView: ({ name, ...props }: Record<string, unknown>) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, props, typeof name === 'string' ? name : 'symbol');
  },
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [
      {
        uri: 'file:///mock-gallery-image.jpg',
        width: 1080,
        height: 1350,
      },
    ],
  })),
}));

jest.mock('expo-secure-store', () => {
  const storage = new Map<string, string>();

  return {
    getItemAsync: jest.fn(async (key: string) => storage.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      storage.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      storage.delete(key);
    }),
  };
});

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children, ...props }: Record<string, unknown>) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, null, children);
  },
  SafeAreaView: ({ children, ...props }: Record<string, unknown>) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  };
  const Screen = () => null;
  const Stack = ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children);
  const Tabs = ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children);
  Object.assign(Stack, { Screen });
  Object.assign(Tabs, { Screen });

  return {
    Redirect: ({ href }: { href: string }) => React.createElement(Text, null, href),
    Stack,
    Tabs,
    router: mockRouter,
    useRouter: () => mockRouter,
    __mockRouter: mockRouter,
  };
});

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    appOwnership: 'standalone',
  },
}));

jest.mock('expo-location', () => ({
  PermissionStatus: {
    GRANTED: 'granted',
  },
  Accuracy: {
    Balanced: 'balanced',
  },
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: {
      latitude: 40.7608,
      longitude: -111.891,
    },
  })),
}));

jest.mock('@rnmapbox/maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const component = (displayName: string) => {
    const MockComponent = ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(View, { ...props, accessibilityLabel: displayName }, children);
    MockComponent.displayName = displayName;
    return MockComponent;
  };

  const module = {
    setAccessToken: jest.fn(async () => null),
    Camera: component('Camera'),
    CircleLayer: component('CircleLayer'),
    LineLayer: component('LineLayer'),
    LocationPuck: component('LocationPuck'),
    MapView: component('MapView'),
    ShapeSource: component('ShapeSource'),
    StyleURL: {
      Light: 'light',
      Outdoors: 'outdoors',
    },
    UserTrackingMode: {
      Follow: 'follow',
    },
  };

  return {
    __esModule: true,
    default: module,
    ...module,
  };
});

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
