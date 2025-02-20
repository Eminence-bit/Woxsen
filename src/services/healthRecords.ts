
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push, get, remove, set } from "firebase/database";
import { storage, database } from "@/lib/firebase";
import { analyzeDocument } from "./documentAnalysis";

export interface HealthRecord {
  id?: string;
  title: string;
  date: string;
  doctor: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  userId: string;
  extractedText?: string;
}

export const uploadHealthRecord = async (file: File, userId: string): Promise<string> => {
  try {
    console.log('Starting file upload for user:', userId);
    
    if (!userId) {
      throw new Error('User must be authenticated to upload files');
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    const storageReference = ref(storage, `health-records/${userId}/${uniqueFileName}`);
    
    console.log('Uploading file:', uniqueFileName);
    
    await uploadBytes(storageReference, file);
    console.log('File uploaded successfully');
    
    const downloadUrl = await getDownloadURL(storageReference);
    console.log('Download URL generated:', downloadUrl);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error instanceof Error) {
      if (error.message.includes('storage/unauthorized')) {
        throw new Error('Permission denied. Please check if you are properly authenticated.');
      }
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    throw new Error('An unknown error occurred while uploading the file');
  }
};

export const createHealthRecord = async (record: HealthRecord): Promise<string> => {
  try {
    console.log('Creating health record:', record);
    
    // If there's a file URL, analyze it first
    if (record.fileUrl && record.userId) {
      try {
        const analysis = await analyzeDocument(record.fileUrl, record.userId);
        record.extractedText = analysis.extractedText;
      } catch (error) {
        console.error('Error analyzing document:', error);
        // Continue with record creation even if analysis fails
      }
    }

    const recordsRef = dbRef(database, `health-records/${record.userId}`);
    const newRecordRef = push(recordsRef);
    await set(newRecordRef, record);
    console.log('Health record created successfully');
    return newRecordRef.key as string;
  } catch (error) {
    console.error('Error creating health record:', error);
    throw new Error(`Failed to create health record: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getHealthRecords = async (userId: string): Promise<HealthRecord[]> => {
  try {
    console.log('Fetching health records for user:', userId);
    const recordsRef = dbRef(database, `health-records/${userId}`);
    const snapshot = await get(recordsRef);
    
    if (!snapshot.exists()) {
      console.log('No records found for user');
      return [];
    }

    const records: HealthRecord[] = [];
    snapshot.forEach((childSnapshot) => {
      records.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    console.log('Records fetched successfully:', records.length);
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching health records:', error);
    throw new Error(`Failed to fetch health records: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteHealthRecord = async (userId: string, recordId: string): Promise<void> => {
  try {
    console.log('Deleting health record:', recordId);
    const recordRef = dbRef(database, `health-records/${userId}/${recordId}`);
    await remove(recordRef);
    console.log('Health record deleted successfully');
  } catch (error) {
    console.error('Error deleting health record:', error);
    throw new Error(`Failed to delete health record: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
