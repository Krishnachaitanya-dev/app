import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import theme from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});