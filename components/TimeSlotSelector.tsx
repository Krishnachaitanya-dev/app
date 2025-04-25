import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import theme from '@/constants/theme';
import { TimeSlot, generateTimeSlots } from '@/mocks/timeSlots';

interface TimeSlotSelectorProps {
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectTimeSlot,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      const selectedDateObj = new Date(selectedDate);
      const diffInDays = Math.floor(
        (selectedDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      setTimeSlots(generateTimeSlots(selectedDate, diffInDays));
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate]);

  const formatTimeSlot = (slot: TimeSlot) => {
    return `${slot.startTime} - ${slot.endTime}`;
  };

  if (!selectedDate) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Time Slot</Text>
        <Text style={styles.noDateText}>Please select a date first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time Slot</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeSlotsContainer}
      >
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.timeSlotItem,
              !slot.available && styles.unavailableTimeSlot,
              selectedTimeSlot === formatTimeSlot(slot) && styles.selectedTimeSlot,
            ]}
            onPress={() => slot.available && onSelectTimeSlot(formatTimeSlot(slot))}
            disabled={!slot.available}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.timeSlotText,
                !slot.available && styles.unavailableTimeSlotText,
                selectedTimeSlot === formatTimeSlot(slot) && styles.selectedTimeSlotText,
              ]}
            >
              {formatTimeSlot(slot)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedTimeSlot && (
        <Text style={styles.selectedTimeSlotLabel}>
          Selected: {selectedTimeSlot}
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
  noDateText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  timeSlotsContainer: {
    paddingVertical: theme.spacing.s,
  },
  timeSlotItem: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  unavailableTimeSlot: {
    backgroundColor: theme.colors.grayLight,
    borderColor: theme.colors.grayDark,
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeSlotText: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.text,
  },
  unavailableTimeSlotText: {
    color: theme.colors.textExtraLight,
  },
  selectedTimeSlotText: {
    color: theme.colors.white,
    fontWeight: '500',
  },
  selectedTimeSlotLabel: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.textLight,
    marginTop: theme.spacing.s,
  },
});

export default TimeSlotSelector;