import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import theme from '@/constants/theme';
import { useNotificationStore } from '@/store/notification-store';
import NotificationItem from '@/components/NotificationItem';
import { Bell, BellOff } from 'lucide-react-native';
import { Notification } from '@/types';

export default function NotificationsScreen() {
  const { notifications, fetchNotifications, markAllAsRead, isLoading } = useNotificationStore();
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const handleRefresh = () => {
    fetchNotifications();
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const handleNotificationPress = (notification: Notification) => {
    if (notification.type === 'order' && notification.data?.orderId) {
      router.push(`/order/${notification.data.orderId}`);
    }
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BellOff size={60} color={theme.colors.textLight} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any notifications at the moment
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleMarkAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              <Text style={[
                styles.markAllText,
                notifications.every(n => n.read) && styles.markAllDisabled
              ]}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.m,
  },
  markAllText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  markAllDisabled: {
    color: theme.colors.textExtraLight,
  },
  listContent: {
    flexGrow: 1,
    padding: theme.spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  emptySubtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});