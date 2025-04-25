import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useNotificationStore } from '@/store/notification-store';
import { useAddressStore } from '@/store/address-store';
import { usePaymentMethodStore } from '@/store/payment-method-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchServices, fetchTimeSlots } = useOrderStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchAddresses } = useAddressStore();
  const { fetchPaymentMethods } = usePaymentMethodStore();

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initial data when authenticated
      fetchServices();
      fetchTimeSlots();
      fetchNotifications();
      fetchAddresses();
      fetchPaymentMethods();
    }
  }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}