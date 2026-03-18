import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps } from 'react';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={{ ios: 'mountain.2.fill', android: 'explore', web: 'explore' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Architecture',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name={{ ios: 'square.stack.3d.up.fill', android: 'layers', web: 'layers' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
