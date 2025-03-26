import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { Medication } from '../../types/medication';
import { formatDate } from '../../utils/dateUtils';

interface MedicationCardProps {
  medication: Medication;
  onPress: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onPress }) => {
  // Determine time of day badges
  const getTimeOfDayColor = (time: string) => {
    const isActive = medication.timeOfDay.includes(time as any);
    return isActive ? 'bg-secondary' : 'bg-gray-200';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card className="mb-4 bg-white rounded-xl overflow-hidden">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-primary">{medication.name}</Text>
          <IconButton
            icon="chevron-right"
            size={24}
            iconColor="#4F6D7A"
          />
        </View>

        <View className="p-4">
          <View className="flex-row justify-between mb-3">
            <Text className="text-textLight">Dosage:</Text>
            <Text className="font-medium text-text">{medication.dosage}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-textLight">Frequency:</Text>
            <Text className="font-medium text-text">{medication.frequency}</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-textLight">Started:</Text>
            <Text className="font-medium text-text">{formatDate(medication.startDate)}</Text>
          </View>

          <View className="flex-row justify-between pt-2 border-t border-gray-100">
            <Text className="text-textLight self-center">Time of day:</Text>
            <View className="flex-row gap-2">
              <View className={`rounded-full h-6 w-6 items-center justify-center ${getTimeOfDayColor('morning')}`}>
                <Text className="text-xs text-white font-bold">M</Text>
              </View>
              <View className={`rounded-full h-6 w-6 items-center justify-center ${getTimeOfDayColor('afternoon')}`}>
                <Text className="text-xs text-white font-bold">A</Text>
              </View>
              <View className={`rounded-full h-6 w-6 items-center justify-center ${getTimeOfDayColor('evening')}`}>
                <Text className="text-xs text-white font-bold">E</Text>
              </View>
              <View className={`rounded-full h-6 w-6 items-center justify-center ${getTimeOfDayColor('night')}`}>
                <Text className="text-xs text-white font-bold">N</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MedicationCard;
