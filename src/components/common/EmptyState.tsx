import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { Button } from 'react-native-paper';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ImageSourcePropType;
  buttonText?: string;
  onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      {icon && (
        <Image source={icon} className="w-24 h-24 mb-4" resizeMode="contain" />
      )}
      <Text className="text-xl font-bold text-primary mb-2 text-center">{title}</Text>
      {message && (
        <Text className="text-textLight text-center mb-6">{message}</Text>
      )}
      {buttonText && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          className="bg-primary rounded-md"
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
