import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { signup, isLoading, error, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);
  
  const validateName = () => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePhone = () => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };
  
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  
  const handleSignUp = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        await signup(name, email, phone, password);
      } catch (err) {
        Alert.alert('Signup Failed', error || 'Something went wrong. Please try again.');
      }
    }
  };
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              onBlur={validateName}
              error={nameError}
              leftIcon={<User size={20} color={theme.colors.textLight} />}
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              error={emailError}
              leftIcon={<Mail size={20} color={theme.colors.textLight} />}
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onBlur={validatePhone}
              error={phoneError}
              leftIcon={<Phone size={20} color={theme.colors.textLight} />}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              error={passwordError}
              leftIcon={<Lock size={20} color={theme.colors.textLight} />}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword}
              error={confirmPasswordError}
              leftIcon={<Lock size={20} color={theme.colors.textLight} />}
            />
            
            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              fullWidth
              rightIcon={<ArrowRight size={20} color={theme.colors.white} />}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.l,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.l,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.s,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  loginText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSizes.s,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});