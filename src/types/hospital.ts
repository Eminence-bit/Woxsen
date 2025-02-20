export interface Hospital {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: google.maps.LatLng;
  };
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  formatted_phone_number?: string;
}

export type FacilityType = 'hospital' | 'pharmacy' | 'doctor' | 'health' | 'clinic';