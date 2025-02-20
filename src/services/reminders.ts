import { ref, set, get, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@/lib/firebase';

export interface Medication {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timings: string[];
  remarks: string;
  frequency: string;
  userId: string;
  createdAt: number;
  taken?: {
    [date: string]: boolean;
  };
}

export const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt'>) => {
  const newMedicationRef = ref(database, `medications/${medication.userId}/${Date.now()}`);
  const newMedication: Medication = {
    ...medication,
    id: newMedicationRef.key || Date.now().toString(),
    createdAt: Date.now(),
    taken: {},
  };
  
  await set(newMedicationRef, newMedication);
  console.log('Added new medication:', newMedication);
  return newMedication;
};

export const getMedications = async (userId: string): Promise<Medication[]> => {
  const medicationsRef = ref(database, `medications/${userId}`);
  const snapshot = await get(medicationsRef);
  
  if (!snapshot.exists()) {
    console.log('No medications found for user:', userId);
    return [];
  }
  
  const medications = Object.values(snapshot.val()) as Medication[];
  console.log('Retrieved medications:', medications);
  return medications;
};

export const updateMedicationStatus = async (
  userId: string,
  medicationId: string,
  date: string,
  taken: boolean
) => {
  const medicationRef = ref(database, `medications/${userId}/${medicationId}/taken/${date}`);
  await set(medicationRef, taken);
  console.log(`Updated medication ${medicationId} status for ${date} to ${taken}`);
};

export const getComplianceData = (medications: Medication[]) => {
  let taken = 0;
  let missed = 0;

  medications.forEach(medication => {
    if (medication.taken) {
      Object.values(medication.taken).forEach(status => {
        if (status) {
          taken++;
        } else {
          missed++;
        }
      });
    }
  });

  return [
    { name: "Taken", value: taken },
    { name: "Missed", value: missed },
  ];
};