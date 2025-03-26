import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Loading...' }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#4F6D7A" />
      <Text className="text-primary mt-4">{message}</Text>
    </View>
  );
};

export default LoadingIndicator;
