import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoadScript } from "@react-google-maps/api";
import { SearchHeader } from "@/components/hospitals/SearchHeader";
import { HospitalCard } from "@/components/hospitals/HospitalCard";
import { HospitalDetail } from "@/components/hospitals/HospitalDetail";
import { useHospitalsSearch } from "@/hooks/useHospitalsSearch";
import type { Hospital } from "@/types/hospital";

const Hospitals = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [facilityTypes, setFacilityTypes] = useState<string[]>(["hospital"]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyC64yN_KKggu93bt3eJtHPQUqYUO_8CPSM",
    libraries: ["places", "geometry"],
  });

  const { hospitals, loading } = useHospitalsSearch(
    userLocation,
    searchRadius,
    facilityTypes
  );

  useEffect(() => {
    const requestLocation = async () => {
      try {
        // First check if geolocation is supported
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported by your browser");
          return;
        }

        // Check for permissions
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          toast.error("Location access denied. Please enable location services to find nearby hospitals.");
          return;
        }

        if (permission.state === 'prompt') {
          toast.info("Please allow location access to find nearby hospitals");
        }

        // Get current position
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained:", position.coords);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            toast.success("Location access granted");
          },
          (error) => {
            console.error("Geolocation error:", error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error("Location access denied");
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error("Location information unavailable");
                break;
              case error.TIMEOUT:
                toast.error("Location request timed out");
                break;
              default:
                toast.error("Error getting location: " + error.message);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } catch (error) {
        console.error("Error requesting location:", error);
        toast.error("Error requesting location access");
      }
    };

    requestLocation();
  }, []);

  if (loadError) {
    return <div className="font-nothing">Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background nothing-dots">
      <SearchHeader
        searchRadius={searchRadius}
        onRadiusChange={setSearchRadius}
        onFilterChange={setFacilityTypes}
      />
      
      <div className="container mx-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.place_id}
              hospital={hospital}
              userLocation={userLocation}
              onClick={() => setSelectedHospital(hospital)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {userLocation ? "No hospitals found nearby" : "Waiting for location access..."}
          </div>
        )}
      </div>

      {selectedHospital && (
        <HospitalDetail
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}
    </div>
  );
};

export default Hospitals;