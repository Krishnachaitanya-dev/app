import { TimeSlot } from '@/types';

export const generateTimeSlots = (date: string, daysFromNow: number): TimeSlot[] => {
  // If the date is today, only show available slots from current time + 2 hours
  const now = new Date();
  const selectedDate = new Date(date);
  const isToday = selectedDate.toDateString() === now.toDateString();
  
  const startHour = isToday ? Math.max(9, now.getHours() + 2) : 9;
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour < 20; hour += 2) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
    
    // Randomly make some slots unavailable
    const available = Math.random() > 0.3;
    
    slots.push({
      id: `slot-${date}-${startTime}`,
      startTime,
      endTime,
      available,
    });
  }
  
  return slots;
};

export const getAvailableDates = (daysAhead: number = 14): string[] => {
  const dates: string[] = [];
  const now = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};