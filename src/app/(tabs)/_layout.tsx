import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
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
  const { status } = useAuthSession();

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
    </Tabs>
  );
}
