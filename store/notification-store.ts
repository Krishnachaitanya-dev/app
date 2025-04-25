import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from '@/services/notification-service';
import { useAuthStore } from './auth-store';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const notifications = await fetchNotifications(user.id);
          
          set({ 
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      markAsRead: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await markNotificationAsRead(user.id, id);
          
          set((state) => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.id === id ? { ...notification, read: true } : notification
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.read).length,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark notification as read', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await markAllNotificationsAsRead(user.id);
          
          set((state) => ({
            notifications: state.notifications.map(notification => ({ ...notification, read: true })),
            unreadCount: 0,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark all notifications as read', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      deleteNotification: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await deleteNotification(user.id, id);
          
          set((state) => {
            const updatedNotifications = state.notifications.filter(
              notification => notification.id !== id
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.read).length,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete notification', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      clearAllNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          await clearAllNotifications(user.id);
          
          set({
            notifications: [],
            unreadCount: 0,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear notifications', 
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'laundry-notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);