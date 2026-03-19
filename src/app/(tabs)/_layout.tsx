import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { View } from 'react-native';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { AppText } from '@/shared/ui/app-text';
import { colors } from '@/shared/theme/colors';

type TabBarIconProps = {
  color: string;
  focused: boolean;
  name: ComponentProps<typeof SymbolView>['name'];
};

function TabBarIcon({ color, focused, name }: TabBarIconProps) {
  return <SymbolView name={name} tintColor={color} size={focused ? 22 : 20} />;
}

export default function TabsLayout() {
  const { status, session } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceStrong,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: 'Trails',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={{ ios: 'mountain.2.fill', android: 'terrain', web: 'terrain' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={{ ios: 'map.fill', android: 'map', web: 'map' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: focused ? 26 : 24,
                height: focused ? 26 : 24,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? colors.accent : colors.surface,
                borderWidth: 1,
                borderColor: focused ? colors.accent : colors.border,
              }}>
              <AppText
                style={{
                  color: focused ? '#130A25' : colors.text,
                  fontSize: 11,
                  lineHeight: 12,
                  fontWeight: '800',
                }}>
                {session?.user.displayName?.charAt(0).toUpperCase() ?? 'R'}
              </AppText>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
