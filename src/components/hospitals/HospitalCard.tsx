import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HospitalCardProps {
  hospital: Hospital;
  userLocation: { lat: number; lng: number } | null;
  onClick: () => void;
}

interface Hospital {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  formatted_phone_number?: string;
}

export const HospitalCard = ({ hospital, userLocation, onClick }: HospitalCardProps) => {
  const calculateDistance = () => {
    if (!userLocation || !window.google?.maps?.geometry?.spherical) return null;
    
    const hospitalLocation = new google.maps.LatLng(
      hospital.geometry.location.lat(),
      hospital.geometry.location.lng()
    );
    
    const userLatLng = new google.maps.LatLng(
      userLocation.lat,
      userLocation.lng
    );

    try {
      return google.maps.geometry.spherical.computeDistanceBetween(
        userLatLng,
        hospitalLocation
      ).toFixed(0);
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  };

  const distance = calculateDistance();

  return (
    <Card className="animate-fade-in cursor-pointer nothing-glow bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{hospital.name}</h3>
          {distance && (
            <Button variant="outline" size="sm" className="gap-1 nothing-glow">
              <Navigation className="h-4 w-4" />
              {distance}m
            </Button>
          )}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {hospital.vicinity}
          </p>
          {hospital.formatted_phone_number && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {hospital.formatted_phone_number}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {hospital.opening_hours?.open_now ? "Open now" : "Closed"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};