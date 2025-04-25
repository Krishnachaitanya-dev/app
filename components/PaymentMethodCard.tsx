import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PaymentMethod } from '@/types';
import theme from '@/constants/theme';
import { CreditCard, Wallet, Smartphone, Check } from 'lucide-react-native';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onPress: (paymentMethod: PaymentMethod) => void;
  selected?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  paymentMethod, 
  onPress, 
  selected = false 
}) => {
  const getIcon = () => {
    const iconProps = {
      size: 24,
      color: selected ? theme.colors.white : theme.colors.primary,
    };

    switch (paymentMethod.type) {
      case 'credit_card':
        return <CreditCard {...iconProps} />;
      case 'paypal':
        return <Wallet {...iconProps} />;
      case 'apple_pay':
      case 'google_pay':
        return <Smartphone {...iconProps} />;
      default:
        return <CreditCard {...iconProps} />;
    }
  };

  const getMethodName = () => {
    switch (paymentMethod.type) {
      case 'credit_card':
        return `Card ending in ${paymentMethod.last4}`;
      case 'paypal':
        return 'PayPal';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return 'Payment Method';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={() => onPress(paymentMethod)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.methodContainer}>
            {getIcon()}
            <Text style={[styles.methodName, selected && styles.selectedText]}>
              {getMethodName()}
            </Text>
          </View>
          {paymentMethod.isDefault && (
            <View style={[styles.defaultBadge, selected && styles.selectedDefaultBadge]}>
              <Text style={[styles.defaultText, selected && styles.selectedDefaultText]}>
                Default
              </Text>
            </View>
          )}
        </View>
        
        {paymentMethod.expiryDate && (
          <Text style={[styles.expiryDate, selected && styles.selectedText]}>
            Expires: {paymentMethod.expiryDate}
          </Text>
        )}
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
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  methodName: {
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
  expiryDate: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
  },
  selectedText: {
    color: theme.colors.white,
  },
  checkContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.s,
  },
});

export default PaymentMethodCard;