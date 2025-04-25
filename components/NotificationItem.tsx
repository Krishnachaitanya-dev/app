import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '@/constants/theme';
import { Bell, Package, Tag, Info } from 'lucide-react-native';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const getIcon = () => {
    const iconProps = {
      size: 24,
      color: theme.colors.white,
      strokeWidth: 2,
    };

    switch (notification.type) {
      case 'order':
        return <Package {...iconProps} />;
      case 'promotion':
        return <Tag {...iconProps} />;
      case 'system':
        return <Info {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getIconBackgroundColor = () => {
    switch (notification.type) {
      case 'order':
        return theme.colors.primary;
      case 'promotion':
        return theme.colors.secondary;
      case 'system':
        return theme.colors.warning;
      default:
        return theme.colors.textLight;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.unreadContainer,
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatDate(notification.createdAt)}</Text>
      </View>
      
      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  unreadContainer: {
    backgroundColor: theme.colors.backgroundLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.s,
    lineHeight: 20,
  },
  time: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textExtraLight,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.s,
    alignSelf: 'center',
  },
});

export default NotificationItem;