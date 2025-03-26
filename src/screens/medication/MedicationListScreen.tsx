import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FAB, Button } from 'react-native-paper';
import { RootStackParamList } from '../../../App';
import { useAuth } from '../../hooks/useAuth';
import { getMedications } from '../../utils/storageService';
import { Medication } from '../../types/medication';
import MedicationCard from '../../components/medication/MedicationCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingIndicator from '../../components/common/LoadingIndicator';

type MedicationListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MedicationList'>;

const MedicationListScreen = () => {
  const navigation = useNavigation<MedicationListScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userMedications = await getMedications(user.id);
      setMedications(userMedications);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedications();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedications();
    }, [user])
  );

  const handleMedicationPress = (medication: Medication) => {
    navigation.navigate('MedicationDetail', { medicationId: medication.id });
  };

  const handleAddMedication = () => {
    navigation.navigate('AddMedication');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Add logout button to header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleLogout}
          mode="text"
          textColor="#fff"
          className="mr-2"
        >
          Logout
        </Button>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return <LoadingIndicator message="Loading your medications..." />;
  }

  if (medications.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          title="No Medications Yet"
          message="You haven't added any medications to track. Tap the button below to add your first medication."
          buttonText="Add Medication"
          onButtonPress={handleAddMedication}
        />
        <FAB
          icon="plus"
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#F26419' }}
          onPress={handleAddMedication}
          color="#fff"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={medications}
        renderItem={({ item }) => (
          <View className="px-4 pt-4">
            <MedicationCard
              medication={item}
              onPress={() => handleMedicationPress(item)}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FAB
        icon="plus"
        style={{ position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#F26419' }}
        onPress={handleAddMedication}
        color="#fff"
      />
    </View>
  );
};

export default MedicationListScreen;
