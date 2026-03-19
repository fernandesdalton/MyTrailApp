import { Redirect, Tabs } from 'expo-router';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';
import { View } from 'react-native';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { tabsLayoutStyles as styles } from '@/features/navigation/styles/tabs-layout.styles';
import { AppText } from '@/shared/ui/app-text';
import { colors } from '@/shared/theme/colors';

type TabBarIconProps = {
  color: string;
  focused: boolean;
  name: ComponentProps<typeof SymbolView>['name'];
};

type ProfileTabIconProps = {
  avatarUrl?: string | null;
  displayName?: string;
  focused: boolean;
};

function TabBarIcon({ color, focused, name }: TabBarIconProps) {
  return <SymbolView name={name} tintColor={color} size={focused ? 22 : 20} />;
}

function ProfileTabIcon({ avatarUrl, displayName, focused }: ProfileTabIconProps) {
  const size = focused ? 26 : 24;

  return (
    <View
      style={[
        styles.profileIcon,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: focused ? colors.accent : colors.surface,
          borderColor: focused ? colors.accent : colors.border,
        },
      ]}>
      {avatarUrl ? (
        <Image source={avatarUrl} style={styles.profileAvatarImage} contentFit="cover" />
      ) : (
        <AppText style={[styles.profileInitial, { color: focused ? '#130A25' : colors.text }]}>
          {displayName?.charAt(0).toUpperCase() ?? 'R'}
        </AppText>
      )}
    </View>
  );
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
        tabBarStyle: styles.tabBar,
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
            <ProfileTabIcon
              focused={focused}
              avatarUrl={session?.user.avatarUrl}
              displayName={session?.user.displayName}
            />
          ),
        }}
      />
    </Tabs>
  );
}
