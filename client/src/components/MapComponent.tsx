import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, X } from "lucide-react";
import type { Bar } from "@shared/schema";

// This is a placeholder component that shows how a real map would be integrated
// In a real implementation, we would use Google Maps API or a similar service

interface MapComponentProps {
  bars: Bar[];
}

export function MapComponent({ bars }: MapComponentProps) {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Simulate getting the user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setShowMap(true);
      },
      () => {
        setLocationError("Unable to retrieve your location. Please allow location access.");
      }
    );
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={getUserLocation}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Find Bars on Map
      </Button>

      {locationError && (
        <p className="text-sm text-destructive mt-2">{locationError}</p>
      )}

      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bars Near You</DialogTitle>
            <DialogDescription>
              {userLocation 
                ? `Showing bars near latitude ${userLocation.lat.toFixed(6)}, longitude ${userLocation.lng.toFixed(6)}`
                : "Finding your location..."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {/* This would be replaced with an actual Google Maps component */}
            <div className="bg-muted/50 rounded-md p-6 h-96 relative flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-muted-foreground">
                  <p className="mb-2">This is a placeholder for a Google Maps integration.</p>
                  <p>In an actual implementation, this would show an interactive map with:</p>
                  <ul className="list-disc list-inside text-left mt-2">
                    <li>Your current location</li>
                    <li>Nearby partner bars as pins</li>
                    <li>Distance and estimated travel time</li>
                    <li>Directions to your selected bar</li>
                  </ul>
                </div>
                <div className="bg-background rounded-md p-4 max-w-md mx-auto">
                  <h3 className="font-medium mb-2">Implementation Note:</h3>
                  <p className="text-sm text-muted-foreground">
                    For a real implementation, we would need a Google Maps API key and would use the Google Maps JavaScript API or a library like react-google-maps.
                  </p>
                </div>
              </div>
              
              {/* Simulated map markers for the bars */}
              <div className="absolute inset-0 p-8">
                {userLocation && (
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="mt-1 text-xs whitespace-nowrap">Your Location</div>
                  </div>
                )}
                
                {bars.map((bar, index) => {
                  // Calculate a random position for each bar
                  const randomAngle = Math.random() * Math.PI * 2;
                  const randomDistance = Math.random() * 30 + 15; // 15-45% from center
                  const left = 50 + Math.cos(randomAngle) * randomDistance;
                  const top = 50 + Math.sin(randomAngle) * randomDistance;
                  
                  return (
                    <div 
                      key={bar.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      <div className="h-4 w-4 bg-primary rounded-full"></div>
                      <div className="mt-1 text-xs font-medium whitespace-nowrap">{bar.name}</div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => setShowMap(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Bars Near You:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bars.map(bar => (
                  <Card key={bar.id} className="p-4 flex items-start space-x-3">
                    <div>
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{bar.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{bar.location}</p>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-xs text-primary"
                        asChild
                      >
                        <a href={`/bars/${bar.id}`}>View Details</a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}