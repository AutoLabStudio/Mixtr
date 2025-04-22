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
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  
  // Initialize with default positions for bars (New York City area)
  useEffect(() => {
    // Default to New York location if geolocation isn't available immediately
    setTimeout(() => {
      if (!userLocation) {
        setUserLocation({
          lat: 40.7128,
          lng: -74.0060
        });
      }
    }, 1000);
  }, [userLocation]);
  
  // Set default positions for bars to ensure they're always visible
  const barPositions = bars.map((bar, index) => {
    // Use seeded random positions based on bar ID to ensure consistency
    const seed = bar.id * 100;
    const angle = (seed % 360) * (Math.PI / 180);
    const distance = 20 + (seed % 20); // 20-40% from center
    return {
      left: 50 + Math.cos(angle) * distance,
      top: 50 + Math.sin(angle) * distance
    };
  });

  // Simulate getting the user's current location
  const getUserLocation = () => {
    // Show map immediately regardless of geolocation
    setShowMap(true);
    
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
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Just show a notification but still show the map
        setLocationError("Unable to retrieve your location. Using default location instead.");
        // Set a default location (New York City)
        setUserLocation({
          lat: 40.7128,
          lng: -74.0060
        });
      },
      { timeout: 10000 } // 10-second timeout
    );
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center hidden"
        onClick={getUserLocation}
        id="findBarsMapButton"
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
            {/* Visual Map Component */}
            <div className="bg-muted rounded-md overflow-hidden h-96 relative">
              {/* Map Background */}
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x600&scale=2&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e')] opacity-30 dark:opacity-20" />
              
              {/* Overlay for dark mode */}
              <div className="absolute inset-0 bg-background/10 dark:bg-background/50" />
              
              {/* Interactive Elements */}
              <div className="absolute inset-0 p-8 overflow-hidden">
                {/* Map Controls */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                  <div className="bg-background/80 backdrop-blur shadow-md rounded-md p-2">
                    <div className="flex flex-col gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <span className="text-lg">+</span>
                      </Button>
                      <div className="h-px w-full bg-border"></div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <span className="text-lg">−</span>
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="bg-background/80 backdrop-blur shadow-md text-xs"
                    onClick={() => setShowMap(false)}
                  >
                    Close Map
                  </Button>
                </div>
                
                {/* User Location */}
                {userLocation && (
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-1 px-2 py-1 bg-background/90 backdrop-blur-sm rounded text-xs font-medium text-center shadow-md">
                      Your Location
                    </div>
                  </div>
                )}
                
                {/* Bar Locations */}
                {bars.map((bar, index) => {
                  const position = barPositions[index];
                  
                  return (
                    <div 
                      key={bar.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                      style={{ left: `${position.left}%`, top: `${position.top}%` }}
                    >
                      <div className="h-8 w-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-background/90 backdrop-blur-sm rounded text-xs font-medium text-center shadow-md whitespace-nowrap">
                        {bar.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Map Legend */}
              <div className="absolute left-4 bottom-4 bg-background/80 backdrop-blur-sm rounded-md shadow-md p-3 text-xs z-10">
                <div className="font-medium mb-2">Map Legend</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-500 border border-white"></div>
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary border border-white"></div>
                    <span>Partner Bars</span>
                  </div>
                </div>
              </div>
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