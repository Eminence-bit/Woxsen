import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, X } from "lucide-react";
import { getDatabase, ref, get } from 'firebase/database';

interface HospitalDetailProps {
  hospital: Hospital;
  onClose: () => void;
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

export const HospitalDetail = ({ hospital, onClose }: HospitalDetailProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const db = getDatabase();
        const mapboxTokenRef = ref(db, 'config/mapboxToken');
        const snapshot = await get(mapboxTokenRef);
        const mapboxToken = snapshot.val();

        if (!mapboxToken) {
          console.error('Mapbox token not found in Firebase');
          return;
        }

        if (!mapContainer.current) return;

        mapboxgl.accessToken = mapboxToken;
        
        const lng = hospital.geometry.location.lng();
        const lat = hospital.geometry.location.lat();

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 15
        });

        // Add marker
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl());
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [hospital]);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container max-w-lg mx-auto h-full p-4 flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle>{hospital.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[200px] relative">
              <div ref={mapContainer} className="w-full h-full" />
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2 text-sm">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};