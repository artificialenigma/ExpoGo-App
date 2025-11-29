import { Link, Redirect, Tabs } from 'expo-router';
import React from 'react';

import { Pressable, Text } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
  Home as ProfileIcon,
  Website as GyroIcon,
} from '@/components/ui/icons';
import { useAuth } from '@/app/providers/auth/auth-provider';

export default function TabLayout() {
  const { status, isFirstTime } = useAuth();

  if (isFirstTime) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (status === 'signOut') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          title: 'Project Overview',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="mygyro" // 👈 This MUST match the filename 'mygyro.tsx'
        options={{
          title: 'My Gyro',
          tabBarIcon: ({ color }) => <GyroIcon color={color} />,
          tabBarButtonTestID: 'mygyro-tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          tabBarButtonTestID: 'profile-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href={'/feed/add-post' as any} asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};
