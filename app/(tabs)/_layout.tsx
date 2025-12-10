import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#FFB3E6',
        tabBarStyle: {
          backgroundColor: '#FFE6F5',
          borderTopColor: '#FFB3E6',
        },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarLabel: 'Menú',
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarLabel: 'Emergencia',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarLabel: 'Mapa',
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarLabel: 'Chats',
        }}
      />
      <Tabs.Screen
        name="panic"
        options={{
          title: 'Panic',
          tabBarLabel: 'Pánico',
        }}
      />
    </Tabs>
  );
}
