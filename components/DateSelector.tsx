import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import theme from '@/constants/theme';
import { getAvailableDates } from '@/mocks/timeSlots';

interface DateSelectorProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelectDate }) => {
  const [dates, setDates] = useState<string[]>([]);
  
  useEffect(() => {
    setDates(getAvailableDates(14));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate().toString();
  };

  const formatDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
      >
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateItem,
              selectedDate === date && styles.selectedDateItem,
            ]}
            onPress={() => onSelectDate(date)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayName,
                selectedDate === date && styles.selectedDateText,
              ]}
            >
              {formatDayName(date)}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                selectedDate === date && styles.selectedDateText,
              ]}
            >
              {formatDayNumber(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedDate && (
        <Text style={styles.selectedDateLabel}>
          Selected: {formatDate(selectedDate)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.l,
  },
  title: {
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  datesContainer: {
    paddingVertical: theme.spacing.s,
  },
  dateItem: {
    width: 60,
    height: 70,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedDateItem: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayName: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  dayNumber: {
    fontSize: theme.fontSizes.l,
    fontWeight: '600',
    color: theme.colors.text,
  },
  selectedDateText: {
    color: theme.colors.white,
  },
  selectedDateLabel: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginTop: theme.spacing.s,
  },
});

export default DateSelector;