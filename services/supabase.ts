import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import { Database } from '@/types/database.types';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://wxfunpkohhtgqjrslmqv.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZnVucGtvaGh0Z3FqcnNsbXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDAyMDksImV4cCI6MjA2MDQ3NjIwOX0.ELZPKt0ZcP08_t2gOxadet54UJ6FQnB3ac-ovm1WypQ';

// Create a single supabase client for the entire app
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  if (error.message) {
    return error.message;
  }
  
  if (error.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
};