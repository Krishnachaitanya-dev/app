import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Address } from '@/types';
import theme from '@/constants/theme';
import { MapPin, Check } from 'lucide-react-native';

interface AddressCardProps {
  address: Address;
  onPress: (address: Address) => void;
  selected?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onPress, selected = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={() => onPress(address)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <MapPin size={16} color={selected ? theme.colors.white : theme.colors.primary} />
            <Text style={[styles.label, selected && styles.selectedText]}>
              {address.label}
            </Text>
          </View>
          {address.isDefault && (
            <View style={[styles.defaultBadge, selected && styles.selectedDefaultBadge]}>
              <Text style={[styles.defaultText, selected && styles.selectedDefaultText]}>
                Default
              </Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.address, selected && styles.selectedText]}>
          {address.street}
        </Text>
        <Text style={[styles.address, selected && styles.selectedText]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
      </View>
      
      {selected && (
        <View style={styles.checkContainer}>
          <Check size={20} color={theme.colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedContainer: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
  defaultBadge: {
    backgroundColor: theme.colors.backgroundDark,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
  },
  selectedDefaultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  defaultText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  selectedDefaultText: {
    color: theme.colors.white,
  },
  address: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  selectedText: {
    color: theme.colors.white,
  },
  checkContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.s,
  },
});

export default AddressCard;