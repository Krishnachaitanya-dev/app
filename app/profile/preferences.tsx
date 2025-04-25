import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import { Save } from 'lucide-react-native';

export default function PreferencesScreen() {
  const { user, updateUser } = useAuthStore();
  const [preferences, setPreferences] = useState(user?.preferences || {
    detergentType: 'regular',
    fabricSoftener: true,
    waterTemperature: 'cold',
    dryingPreference: 'tumble-dry',
    ironingPreference: 'yes',
    foldingPreference: 'standard',
    notifications: true,
  });
  
  const handleSavePreferences = () => {
    updateUser({ preferences });
    Alert.alert('Success', 'Preferences saved successfully');
  };
  
  const handleToggleSwitch = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleSelectOption = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Laundry Preferences' }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Laundry Preferences</Text>
        <Text style={styles.subtitle}>Customize how we handle your laundry</Text>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Washing Preferences</Text>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceTitle}>Detergent Type</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.detergentType === 'regular' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('detergentType', 'regular')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.detergentType === 'regular' && styles.selectedOptionText,
                  ]}
                >
                  Regular
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.detergentType === 'hypoallergenic' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('detergentType', 'hypoallergenic')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.detergentType === 'hypoallergenic' && styles.selectedOptionText,
                  ]}
                >
                  Hypoallergenic
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.detergentType === 'eco-friendly' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('detergentType', 'eco-friendly')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.detergentType === 'eco-friendly' && styles.selectedOptionText,
                  ]}
                >
                  Eco-Friendly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.switchPreferenceContainer}>
            <View style={styles.switchPreferenceInfo}>
              <Text style={styles.preferenceTitle}>Fabric Softener</Text>
              <Text style={styles.preferenceDescription}>
                Use fabric softener for softer clothes
              </Text>
            </View>
            <Switch
              value={preferences.fabricSoftener}
              onValueChange={() => handleToggleSwitch('fabricSoftener')}
              trackColor={{ false: theme.colors.grayDark, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceTitle}>Water Temperature</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.waterTemperature === 'cold' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('waterTemperature', 'cold')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.waterTemperature === 'cold' && styles.selectedOptionText,
                  ]}
                >
                  Cold
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.waterTemperature === 'warm' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('waterTemperature', 'warm')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.waterTemperature === 'warm' && styles.selectedOptionText,
                  ]}
                >
                  Warm
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.waterTemperature === 'hot' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('waterTemperature', 'hot')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.waterTemperature === 'hot' && styles.selectedOptionText,
                  ]}
                >
                  Hot
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Drying & Finishing</Text>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceTitle}>Drying Method</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.dryingPreference === 'tumble-dry' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('dryingPreference', 'tumble-dry')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.dryingPreference === 'tumble-dry' && styles.selectedOptionText,
                  ]}
                >
                  Tumble Dry
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.dryingPreference === 'hang-dry' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('dryingPreference', 'hang-dry')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.dryingPreference === 'hang-dry' && styles.selectedOptionText,
                  ]}
                >
                  Hang Dry
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceTitle}>Ironing</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.ironingPreference === 'yes' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('ironingPreference', 'yes')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.ironingPreference === 'yes' && styles.selectedOptionText,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.ironingPreference === 'no' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('ironingPreference', 'no')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.ironingPreference === 'no' && styles.selectedOptionText,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceTitle}>Folding Style</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.foldingPreference === 'standard' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('foldingPreference', 'standard')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.foldingPreference === 'standard' && styles.selectedOptionText,
                  ]}
                >
                  Standard
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  preferences.foldingPreference === 'special' && styles.selectedOption,
                ]}
                onPress={() => handleSelectOption('foldingPreference', 'special')}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.foldingPreference === 'special' && styles.selectedOptionText,
                  ]}
                >
                  Special
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.switchPreferenceContainer}>
            <View style={styles.switchPreferenceInfo}>
              <Text style={styles.preferenceTitle}>Push Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive updates about your orders
              </Text>
            </View>
            <Switch
              value={preferences.notifications}
              onValueChange={() => handleToggleSwitch('notifications')}
              trackColor={{ false: theme.colors.grayDark, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button
          title="Save Preferences"
          onPress={handleSavePreferences}
          fullWidth
          leftIcon={<Save size={20} color={theme.colors.white} />}
        />
      </View>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.l,
  },
  sectionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  preferenceContainer: {
    marginBottom: theme.spacing.l,
  },
  preferenceTitle: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  preferenceDescription: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  optionButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.backgroundLight,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.text,
  },
  selectedOptionText: {
    color: theme.colors.white,
    fontWeight: '500',
  },
  switchPreferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  switchPreferenceInfo: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.l,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});