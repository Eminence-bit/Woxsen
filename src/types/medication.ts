export interface Medication {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timings: string[];
  remarks?: string;
  frequency: string;
  userId: string;
  createdAt: number;
  taken?: {
    [date: string]: boolean;
  };
}