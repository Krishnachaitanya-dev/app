import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import theme from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const getContainerStyles = () => {
    const baseStyles: StyleProp<ViewStyle>[] = [styles.container];
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryContainer);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryContainer);
        break;
      case 'outline':
        baseStyles.push(styles.outlineContainer);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostContainer);
        break;
    }
    
    // Add size styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallContainer);
        break;
      case 'medium':
        baseStyles.push(styles.mediumContainer);
        break;
      case 'large':
        baseStyles.push(styles.largeContainer);
        break;
    }
    
    // Add full width style
    if (fullWidth) {
      baseStyles.push(styles.fullWidth);
    }
    
    // Add disabled style
    if (disabled) {
      baseStyles.push(styles.disabledContainer);
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    const baseStyles: StyleProp<TextStyle>[] = [styles.text];
    
    // Add variant text styles
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyles.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostText);
        break;
    }
    
    // Add size text styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallText);
        break;
      case 'medium':
        baseStyles.push(styles.mediumText);
        break;
      case 'large':
        baseStyles.push(styles.largeText);
        break;
    }
    
    // Add disabled text style
    if (disabled) {
      baseStyles.push(styles.disabledText);
    }
    
    return baseStyles;
  };
  
  return (
    <TouchableOpacity
      style={[getContainerStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : theme.colors.white
          } 
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary,
  },
  secondaryContainer: {
    backgroundColor: theme.colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  smallContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
  },
  mediumContainer: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  largeContainer: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  smallText: {
    fontSize: theme.fontSizes.s,
  },
  mediumText: {
    fontSize: theme.fontSizes.m,
  },
  largeText: {
    fontSize: theme.fontSizes.l,
  },
  disabledText: {
    opacity: 0.8,
  },
  iconContainer: {
    marginHorizontal: theme.spacing.xs,
  },
});

export default Button;