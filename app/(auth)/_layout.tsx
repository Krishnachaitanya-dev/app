import { Stack } from "expo-router";
import theme from "@/constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Login",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: "Create Account",
          headerShown: false,
        }} 
      />
    </Stack>
  );
}