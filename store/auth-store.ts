import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import * as AuthService from '@/services/auth-service';

interface AuthState {
  user: User | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
  uploadAvatar: (uri: string) => Promise<{ success: boolean; avatarUrl?: string }>;
  clearError: () => void;
  setUser: (user: User | null, profile: any | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      signUp: async (email, password, userData) => {
        set({ isLoading: true, error: null });
        try {
          const result = await AuthService.signUp(email, password, userData);
          if (result.success) {
            // Note: User will need to verify email before being fully authenticated
            set({ 
              isLoading: false,
              error: null
            });
          } else {
            set({ isLoading: false, error: result.error });
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred during sign up' });
        }
      },
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await AuthService.signIn(email, password);
          if (result.success && result.user) {
            // Get user profile
            const profileResult = await AuthService.getCurrentUser();
            if (profileResult.success && profileResult.user) {
              set({ 
                user: result.user,
                profile: profileResult.user.profile,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
            } else {
              set({ 
                user: result.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
              });
            }
          } else {
            set({ isLoading: false, error: result.error });
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred during sign in' });
        }
      },
      
      signOut: async () => {
        set({ isLoading: true });
        try {
          const result = await AuthService.signOut();
          if (result.success) {
            set({ 
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          } else {
            set({ isLoading: false, error: result.error });
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred during sign out' });
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await AuthService.resetPassword(email);
          set({ isLoading: false });
          if (!result.success) {
            set({ error: result.error });
            return false;
          }
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred during password reset' });
          return false;
        }
      },
      
      updateProfile: async (profileData) => {
        const { user } = get();
        if (!user) return false;
        
        set({ isLoading: true, error: null });
        try {
          const result = await AuthService.updateProfile(user.id, profileData);
          if (result.success) {
            // Update local profile data
            set(state => ({ 
              profile: { ...state.profile, ...profileData },
              isLoading: false
            }));
            return true;
          } else {
            set({ isLoading: false, error: result.error });
            return false;
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred updating profile' });
          return false;
        }
      },
      
      uploadAvatar: async (uri) => {
        const { user } = get();
        if (!user) return { success: false };
        
        set({ isLoading: true, error: null });
        try {
          const result = await AuthService.uploadAvatar(user.id, uri);
          if (result.success) {
            // Update local profile data with new avatar URL
            set(state => ({ 
              profile: { ...state.profile, avatar_url: result.avatarUrl },
              isLoading: false
            }));
          } else {
            set({ isLoading: false, error: result.error });
          }
          return result;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An error occurred uploading avatar' });
          return { success: false };
        }
      },
      
      clearError: () => set({ error: null }),
      
      setUser: (user, profile) => set({ 
        user, 
        profile,
        isAuthenticated: !!user,
        error: null
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);