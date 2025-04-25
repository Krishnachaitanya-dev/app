import { supabase, handleSupabaseError } from './supabase';
import { UserCredentials } from '@/types/database.types';

export const signUp = async (email: string, password: string, userData: any) => {
  try {
    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: handleSupabaseError(authError) };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Create a profile record in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        name: `${userData.firstName} ${userData.lastName}`,
        email: email,
        phone: userData.phone || '',
      });

    if (profileError) {
      return { success: false, error: handleSupabaseError(profileError) };
    }

    return { success: true, user: authData.user };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    if (!data.user) {
      return { success: false, error: 'No user logged in' };
    }
    
    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (profileError) {
      return { success: false, error: handleSupabaseError(profileError) };
    }
    
    return { 
      success: true, 
      user: {
        ...data.user,
        profile: profileData
      } 
    };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'laundryservice://reset-password',
    });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const updateProfile = async (userId: string, profileData: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};

export const uploadAvatar = async (userId: string, uri: string) => {
  try {
    // Convert URI to Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const fileExt = uri.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, blob);
    
    if (uploadError) {
      return { success: false, error: handleSupabaseError(uploadError) };
    }
    
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    // Update profile with avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('user_id', userId);
    
    if (updateError) {
      return { success: false, error: handleSupabaseError(updateError) };
    }
    
    return { success: true, avatarUrl: urlData.publicUrl };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
};