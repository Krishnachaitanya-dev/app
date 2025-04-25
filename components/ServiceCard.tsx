import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '@/types';
import theme from '@/constants/theme';
import { Shirt, Zap, Droplets, Bed } from 'lucide-react-native';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
  selected?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress, selected = false }) => {
  const getIcon = () => {
    const iconProps = {
      size: 24,
      color: selected ? theme.colors.white : theme.colors.primary,
      strokeWidth: 2,
    };

    switch (service.icon) {
      case 'shirt':
        return <Shirt {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'droplets':
        return <Droplets {...iconProps} />;
      case 'bed':
        return <Bed {...iconProps} />;
      default:
        return <Shirt {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={() => onPress(service)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        {getIcon()}
      </View>
      <Text style={[styles.name, selected && styles.selectedText]}>
        {service.name}
      </Text>
      <Text style={[styles.price, selected && styles.selectedText]}>
        ₹{service.pricePerUnit.toFixed(2)}/{service.unit}
      </Text>
      <Text style={[styles.description, selected && styles.selectedText]} numberOfLines={2}>
        {service.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  selectedIconContainer: {
    backgroundColor: theme.colors.primaryLight,
  },
  name: {
    fontSize: theme.fontSizes.l,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  description: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  selectedText: {
    color: theme.colors.white,
  },
});

export default ServiceCard;