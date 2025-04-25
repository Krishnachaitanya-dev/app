import { supabase, handleSupabaseError } from './supabase';

export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, notifications: data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const clearAllNotifications = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};