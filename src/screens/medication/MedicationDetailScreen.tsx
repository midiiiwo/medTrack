import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton, Button } from 'react-native-paper';
import { RootStackParamList } from '../../../App';
import { getMedicationById, getMedicationLogs, deleteMedication } from '../../utils/storageService';
import { Medication, MedicationLog } from '../../types/medication';
import { useAuth } from '../../hooks/useAuth';
import MedicationCard from '../../components/medication/MedicationCard';
import MedicationTrackingCard from '../../components/medication/MedicationTrackingCard';
import MedicationHistoryCard from '../../components/medication/MedicationHistoryCard';
import LoadingIndicator from '../../components/common/LoadingIndicator';

type MedicationDetailRouteProp = RouteProp<RootStackParamList, 'MedicationDetail'>;
type MedicationDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MedicationDetail'>;

const MedicationDetailScreen = () => {
  const route = useRoute<MedicationDetailRouteProp>();
  const navigation = useNavigation<MedicationDetailNavigationProp>();
  const { user } = useAuth();
  const { medicationId } = route.params;

  const [medication, setMedication] = useState<Medication | null>(null);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedicationData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const med = await getMedicationById(medicationId);
      if (med) {
        setMedication(med);
        const medicationLogs = await getMedicationLogs(user.id, medicationId);
        setLogs(medicationLogs);
      }
    } catch (error) {
      console.error('Failed to fetch medication details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicationData();
    }, [medicationId, user])
  );

  const handleLogUpdated = () => {
    fetchMedicationData();
  };

  const handleDeleteMedication = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (medication) {
                await deleteMedication(medication.id);
                navigation.goBack();
              }
            } catch (error) {
              console.error('Failed to delete medication:', error);
              Alert.alert('Error', 'Failed to delete medication. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Add delete button to header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="delete"
          iconColor="#fff"
          size={24}
          onPress={handleDeleteMedication}
        />
      ),
    });
  }, [navigation, medication]);

  if (isLoading) {
    return <LoadingIndicator message="Loading medication details..." />;
  }

  if (!medication) {
    return (
      <View className="flex-1 bg-background p-4">
        <View className="items-center justify-center flex-1">
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            className="bg-primary"
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <MedicationCard medication={medication} onPress={() => {}} />
        <MedicationTrackingCard
          medication={medication}
          logs={logs}
          onLogUpdated={handleLogUpdated}
        />
        <MedicationHistoryCard logs={logs} />
      </View>
    </ScrollView>
  );
};

export default MedicationDetailScreen;
