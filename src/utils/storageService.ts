import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, MedicationLog } from '../types/medication';

// Keys for AsyncStorage
const MEDICATIONS_KEY = '@medications';
const MEDICATION_LOGS_KEY = '@medication_logs';

// Helper function to generate a unique ID
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Medication storage functions
export const getMedications = async (userId: string): Promise<Medication[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEDICATIONS_KEY);
    if (!jsonValue) return [];

    const allMedications: Medication[] = JSON.parse(jsonValue);
    return allMedications.filter(med => med.userId === userId);
  } catch (error) {
    console.error('Error getting medications:', error);
    return [];
  }
};

export const getMedicationById = async (medicationId: string): Promise<Medication | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEDICATIONS_KEY);
    if (!jsonValue) return null;

    const medications: Medication[] = JSON.parse(jsonValue);
    return medications.find(med => med.id === medicationId) || null;
  } catch (error) {
    console.error('Error getting medication by ID:', error);
    return null;
  }
};

export const saveMedication = async (medication: Medication): Promise<void> => {
  try {
    // Get existing medications
    const jsonValue = await AsyncStorage.getItem(MEDICATIONS_KEY);
    let medications: Medication[] = jsonValue ? JSON.parse(jsonValue) : [];

    // Check if medication exists to update or add
    const index = medications.findIndex(med => med.id === medication.id);

    if (index !== -1) {
      // Update existing medication
      medications[index] = medication;
    } else {
      // Add new medication
      medications.push(medication);
    }

    // Save back to storage
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error('Error saving medication:', error);
    throw error;
  }
};

export const deleteMedication = async (medicationId: string): Promise<void> => {
  try {
    // Get existing medications
    const jsonValue = await AsyncStorage.getItem(MEDICATIONS_KEY);
    if (!jsonValue) return;

    let medications: Medication[] = JSON.parse(jsonValue);

    // Filter out the medication to delete
    medications = medications.filter(med => med.id !== medicationId);

    // Save back to storage
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));

    // Also delete related logs
    await deleteMedicationLogs(medicationId);
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};

// Medication log functions
export const getMedicationLogs = async (userId: string, medicationId?: string): Promise<MedicationLog[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEDICATION_LOGS_KEY);
    if (!jsonValue) return [];

    const allLogs: MedicationLog[] = JSON.parse(jsonValue);
    let userLogs = allLogs.filter(log => log.userId === userId);

    // Filter by medication ID if provided
    if (medicationId) {
      userLogs = userLogs.filter(log => log.medicationId === medicationId);
    }

    return userLogs;
  } catch (error) {
    console.error('Error getting medication logs:', error);
    return [];
  }
};

export const saveMedicationLog = async (log: MedicationLog): Promise<void> => {
  try {
    // Get existing logs
    const jsonValue = await AsyncStorage.getItem(MEDICATION_LOGS_KEY);
    let logs: MedicationLog[] = jsonValue ? JSON.parse(jsonValue) : [];

    // Check if log exists to update or add
    const index = logs.findIndex(l => l.id === log.id);

    if (index !== -1) {
      // Update existing log
      logs[index] = log;
    } else {
      // Add new log
      logs.push(log);
    }

    // Save back to storage
    await AsyncStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving medication log:', error);
    throw error;
  }
};

export const deleteMedicationLogs = async (medicationId: string): Promise<void> => {
  try {
    // Get existing logs
    const jsonValue = await AsyncStorage.getItem(MEDICATION_LOGS_KEY);
    if (!jsonValue) return;

    let logs: MedicationLog[] = JSON.parse(jsonValue);

    // Filter out logs for the specified medication
    logs = logs.filter(log => log.medicationId !== medicationId);

    // Save back to storage
    await AsyncStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error deleting medication logs:', error);
    throw error;
  }
};
