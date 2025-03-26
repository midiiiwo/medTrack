export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: TimeOfDay[];
  startDate: string;
  endDate?: string; // Optional end date
  instructions?: string; // Optional instructions
  createdAt: string;
  userId: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface MedicationLog {
  id: string;
  medicationId: string;
  userId: string;
  timestamp: string;
  taken: boolean;
  skipped: boolean;
  notes?: string;
}
