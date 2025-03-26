import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { MedicationLog } from '../../types/medication';
import { formatDate } from '../../utils/dateUtils';

interface MedicationHistoryCardProps {
  logs: MedicationLog[];
}

const MedicationHistoryCard: React.FC<MedicationHistoryCardProps> = ({ logs }) => {
  // Sort logs by timestamp in descending order (newest first)
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (logs.length === 0) {
    return (
      <Card className="mb-4 bg-white rounded-xl overflow-hidden">
        <View className="p-4">
          <Text className="text-xl font-bold text-primary mb-4">Medication History</Text>
          <Text className="text-textLight text-center py-6">No history available yet</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card className="mb-4 bg-white rounded-xl overflow-hidden">
      <View className="p-4">
        <Text className="text-xl font-bold text-primary mb-4">Medication History</Text>

        <ScrollView className="max-h-64">
          {sortedLogs.map(log => {
            const timestamp = new Date(log.timestamp);
            const formattedDate = formatDate(log.timestamp, 'MMM d, yyyy');
            const formattedTime = timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            const statusBg = log.taken ? 'bg-success' : 'bg-danger';
            const statusText = log.taken ? 'Taken' : 'Skipped';

            return (
              <View
                key={log.id}
                className="mb-3 p-3 border border-gray-200 rounded-lg"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="font-semibold text-text">{formattedDate}</Text>
                    <Text className="text-textLight">{formattedTime}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${statusBg}`}>
                    <Text className="text-white text-xs font-semibold">{statusText}</Text>
                  </View>
                </View>

                {log.notes && (
                  <View className="mt-2 pt-2 border-t border-gray-100">
                    <Text className="text-textLight text-sm">Note: {log.notes}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Card>
  );
};

export default MedicationHistoryCard;
