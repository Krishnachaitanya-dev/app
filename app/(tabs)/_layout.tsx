import React from "react";
import { Tabs } from "expo-router";
import theme from "@/constants/theme";
import { Home, Package, User, MessageSquare, Bell } from "lucide-react-native";
import { useNotificationStore } from "@/store/notification-store";
import { View, Text, StyleSheet } from "react-native";

export default function TabLayout() {
  const { unreadCount } = useNotificationStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          ...theme.shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: theme.colors.white,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: theme.colors.text,
          fontSize: theme.fontSizes.l,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <View>
              <Bell size={24} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});