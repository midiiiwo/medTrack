import { format, parse, addDays, isToday, parseISO, isBefore, isAfter, isEqual } from 'date-fns';

// Format a date string to a readable format
export const formatDate = (dateString: string, formatStr: string = 'MMM d, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Get current date as ISO string
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

// Check if a date is today
export const isDateToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return isToday(date);
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

// Add days to a date
export const addDaysToDate = (dateString: string, days: number): string => {
  try {
    const date = parseISO(dateString);
    return addDays(date, days).toISOString();
  } catch (error) {
    console.error('Error adding days to date:', error);
    return dateString;
  }
};

// Check if a date is before another date
export const isDateBefore = (dateA: string, dateB: string): boolean => {
  try {
    const a = parseISO(dateA);
    const b = parseISO(dateB);
    return isBefore(a, b);
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};

// Check if a date is after another date
export const isDateAfter = (dateA: string, dateB: string): boolean => {
  try {
    const a = parseISO(dateA);
    const b = parseISO(dateB);
    return isAfter(a, b);
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};

// Check if two dates are equal
export const areDatesEqual = (dateA: string, dateB: string): boolean => {
  try {
    const a = parseISO(dateA);
    const b = parseISO(dateB);
    return isEqual(a, b);
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};
