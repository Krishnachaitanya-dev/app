import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
      ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textExtraLight}
          {...rest}
        />
        
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: theme.fontSizes.s,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: theme.spacing.m,
    fontSize: theme.fontSizes.m,
    color: theme.colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIconContainer: {
    paddingLeft: theme.spacing.m,
  },
  rightIconContainer: {
    paddingRight: theme.spacing.m,
  },
  errorText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;