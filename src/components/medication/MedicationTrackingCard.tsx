import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, IconButton, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { Medication, MedicationLog } from '../../types/medication';
import { formatDate, getCurrentDate, isDateToday } from '../../utils/dateUtils';
import { generateId, saveMedicationLog } from '../../utils/storageService';

interface MedicationTrackingCardProps {
  medication: Medication;
  logs: MedicationLog[];
  onLogUpdated: () => void;
}

const MedicationTrackingCard: React.FC<MedicationTrackingCardProps> = ({
  medication,
  logs,
  onLogUpdated
}) => {
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipReason, setSkipReason] = useState('');

  // Check if medication was taken today for each time of day
  const getTodayLogs = () => {
    return logs.filter(log => isDateToday(log.timestamp));
  };

  const todayLogs = getTodayLogs();

  const getStatusForTimeOfDay = (timeOfDay: string) => {
    if (!medication.timeOfDay.includes(timeOfDay as any)) {
      return 'not-applicable';
    }

    const logForTimeOfDay = todayLogs.find(log => {
      const timestamp = new Date(log.timestamp);
      const hours = timestamp.getHours();

      // Basic mapping of hours to time of day
      const timeMap: Record<string, [number, number]> = {
        'morning': [5, 11], // 5:00 AM - 11:59 AM
        'afternoon': [12, 16], // 12:00 PM - 4:59 PM
        'evening': [17, 20], // 5:00 PM - 8:59 PM
        'night': [21, 4], // 9:00 PM - 4:59 AM
      };

      const [start, end] = timeMap[timeOfDay];

      if (timeOfDay === 'night') {
        // Special case for night which spans across days
        return hours >= start || hours <= end;
      }

      return hours >= start && hours <= end;
    });

    if (logForTimeOfDay) {
      return logForTimeOfDay.taken ? 'taken' : 'skipped';
    }

    return 'pending';
  };

  const handleMarkAsTaken = async (timeOfDay: string) => {
    try {
      // Check if there is already a log for this time of day
      if (getStatusForTimeOfDay(timeOfDay) !== 'pending') {
        Alert.alert('Already logged', 'You have already logged this medication for this time of day.');
        return;
      }

      const newLog: MedicationLog = {
        id: generateId(),
        medicationId: medication.id,
        userId: medication.userId,
        timestamp: getCurrentDate(),
        taken: true,
        skipped: false,
      };

      await saveMedicationLog(newLog);
      onLogUpdated();
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      Alert.alert('Error', 'Failed to record medication as taken. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      setShowSkipDialog(true);
    } catch (error) {
      console.error('Error marking medication as skipped:', error);
      Alert.alert('Error', 'Failed to record medication as skipped. Please try again.');
    }
  };

  const confirmSkip = async (timeOfDay: string) => {
    try {
      const newLog: MedicationLog = {
        id: generateId(),
        medicationId: medication.id,
        userId: medication.userId,
        timestamp: getCurrentDate(),
        taken: false,
        skipped: true,
        notes: skipReason || 'Skipped',
      };

      await saveMedicationLog(newLog);
      setShowSkipDialog(false);
      setSkipReason('');
      onLogUpdated();
    } catch (error) {
      console.error('Error confirming skip:', error);
      Alert.alert('Error', 'Failed to record medication as skipped. Please try again.');
    }
  };

  const renderTimeOfDaySection = (timeOfDay: string, label: string) => {
    if (!medication.timeOfDay.includes(timeOfDay as any)) {
      return null;
    }

    const status = getStatusForTimeOfDay(timeOfDay);

    let statusLabel = '';
    let statusColor = '';

    if (status === 'taken') {
      statusLabel = 'Taken';
      statusColor = 'bg-success';
    } else if (status === 'skipped') {
      statusLabel = 'Skipped';
      statusColor = 'bg-danger';
    } else {
      statusLabel = 'Pending';
      statusColor = 'bg-gray-300';
    }

    return (
      <View className="mb-4 p-3 border border-gray-200 rounded-lg">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-primary">{label}</Text>
          <View className={`px-2 py-1 rounded-full ${statusColor}`}>
            <Text className="text-white text-xs font-semibold">{statusLabel}</Text>
          </View>
        </View>

        {status === 'pending' && (
          <View className="flex-row mt-2">
            <Button
              mode="contained"
              onPress={() => handleMarkAsTaken(timeOfDay)}
              className="flex-1 mr-2 bg-success"
            >
              Mark as Taken
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleSkip()}
              className="flex-1 border-danger"
              textColor="#E63946"
            >
              Skip
            </Button>
          </View>
        )}

        {(status === 'taken' || status === 'skipped') && (
          <Text className="text-textLight mt-1">
            {status === 'taken' ? 'Great job taking your medication!' : 'You skipped this dose.'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Card className="mb-4 bg-white rounded-xl overflow-hidden">
      <View className="p-4">
        <Text className="text-xl font-bold text-primary mb-4">Today's Tracking</Text>

        {renderTimeOfDaySection('morning', 'Morning')}
        {renderTimeOfDaySection('afternoon', 'Afternoon')}
        {renderTimeOfDaySection('evening', 'Evening')}
        {renderTimeOfDaySection('night', 'Night')}

        <Portal>
          <Dialog visible={showSkipDialog} onDismiss={() => setShowSkipDialog(false)}>
            <Dialog.Title>Skip Medication</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Reason (optional)"
                value={skipReason}
                onChangeText={setSkipReason}
                mode="outlined"
                className="mb-2"
                multiline
                numberOfLines={3}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowSkipDialog(false)}>Cancel</Button>
              <Button onPress={() => confirmSkip('pending')}>Confirm Skip</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Card>
  );
};

export default MedicationTrackingCard;
