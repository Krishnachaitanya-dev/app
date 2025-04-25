import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Heart,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleAddressesPress = () => {
    router.push('/profile/addresses');
  };
  
  const handlePaymentMethodsPress = () => {
    router.push('/profile/payment-methods');
  };
  
  const handlePreferencesPress = () => {
    router.push('/profile/preferences');
  };
  
  const handleNotificationsPress = () => {
    router.push('/notifications');
  };
  
  const handleSupportPress = () => {
    router.push('/support/chat');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Text style={styles.editImageText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profilePhone}>{user?.phone}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleAddressesPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <MapPin size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuItemText}>My Addresses</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePaymentMethodsPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <CreditCard size={20} color={theme.colors.secondary} />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePreferencesPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <Heart size={20} color={theme.colors.success} />
              </View>
              <Text style={styles.menuItemText}>Laundry Preferences</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <Settings size={20} color={theme.colors.warning} />
              </View>
              <Text style={styles.menuItemText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleNotificationsPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.error + '20' }]}>
                <Bell size={20} color={theme.colors.error} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleSupportPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <HelpCircle size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.error + '20' }]}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    padding: theme.spacing.l,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: theme.spacing.l,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.s,
  },
  editImageText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xs,
    fontWeight: '500',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  profilePhone: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  sectionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  menuItemText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  versionText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textExtraLight,
  },
});