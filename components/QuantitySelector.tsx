import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@/constants/theme';
import { Minus, Plus } from 'lucide-react-native';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 0,
  maxQuantity = 100,
}) => {
  const isDecrementDisabled = quantity <= minQuantity;
  const isIncrementDisabled = quantity >= maxQuantity;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isDecrementDisabled && styles.disabledButton,
        ]}
        onPress={onDecrease}
        disabled={isDecrementDisabled}
        activeOpacity={0.7}
      >
        <Minus
          size={16}
          color={isDecrementDisabled ? theme.colors.textExtraLight : theme.colors.text}
        />
      </TouchableOpacity>
      
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          isIncrementDisabled && styles.disabledButton,
        ]}
        onPress={onIncrease}
        disabled={isIncrementDisabled}
        activeOpacity={0.7}
      >
        <Plus
          size={16}
          color={isIncrementDisabled ? theme.colors.textExtraLight : theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.grayLight,
  },
  quantityContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

export default QuantitySelector;