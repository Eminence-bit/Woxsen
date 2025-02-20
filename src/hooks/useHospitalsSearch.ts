import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Hospital, FacilityType } from "@/types/hospital";
import { getDatabase, ref, get } from 'firebase/database';

export const useHospitalsSearch = (
  userLocation: { lat: number; lng: number } | null,
  searchRadius: number,
  facilityTypes: string[]
) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  const searchNearbyHospitals = useCallback(async () => {
    if (!userLocation) {
      console.log("No user location available yet");
      return;
    }

    console.log("Searching for hospitals with:", {
      userLocation,
      searchRadius,
      facilityTypes
    });

    setLoading(true);
    try {
      const db = getDatabase();
      const mapboxTokenRef = ref(db, 'config/mapboxToken');
      const snapshot = await get(mapboxTokenRef);
      const mapboxToken = snapshot.val() || 'pk.eyJ1IjoibWVkdHJhY2siLCJhIjoiY202aHozOHNwMDJ1eDJtcGZ0Mm01cThrcyJ9.hO8g9h2EwBU4hEfRbKXlKg';

      // Convert radius from meters to kilometers
      const radiusKm = searchRadius / 1000;

      // Use Mapbox Geocoding API to search for hospitals
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${facilityTypes.join(',')}.json?` +
        `proximity=${userLocation.lng},${userLocation.lat}&` +
        `radius=${radiusKm}&` +
        `types=poi&` +
        `limit=10&` +
        `access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const data = await response.json();
      console.log("Received hospital data:", data);
      
      if (!data.features || data.features.length === 0) {
        console.log("No hospitals found in the area");
        setHospitals([]);
        return;
      }

      const processedHospitals: Hospital[] = data.features.map((feature: any) => ({
        place_id: feature.id,
        name: feature.text,
        vicinity: feature.place_name,
        geometry: {
          location: {
            lat: () => feature.center[1],
            lng: () => feature.center[0]
          }
        },
        opening_hours: {
          open_now: true // Default value since Mapbox doesn't provide this
        },
        rating: undefined,
        formatted_phone_number: undefined
      }));

      console.log("Processed hospitals:", processedHospitals);
      setHospitals(processedHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error("Error finding nearby hospitals");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation, searchRadius, facilityTypes]);

  useEffect(() => {
    if (userLocation) {
      console.log("Location available, triggering hospital search");
      searchNearbyHospitals();
    }
  }, [userLocation, searchNearbyHospitals]);

  return { hospitals, loading };
};