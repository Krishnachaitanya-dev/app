import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import theme from '@/constants/theme';
import { useNotificationStore } from '@/store/notification-store';
import NotificationItem from '@/components/NotificationItem';
import { Trash2, CheckCheck } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    clearAllNotifications,
    isLoading,
  } = useNotificationStore();
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const handleNotificationPress = (notification: any) => {
    markAsRead(notification.id);
    
    // If notification is related to an order, navigate to order details
    if (notification.type === 'order' && notification.orderId) {
      router.push(`/order/${notification.orderId}`);
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const handleClearAll = () => {
    clearAllNotifications();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleMarkAllAsRead}
              >
                <CheckCheck size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleClearAll}
              >
                <Trash2 size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyMessage}>
            You don't have any notifications at the moment
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  emptyMessage: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});