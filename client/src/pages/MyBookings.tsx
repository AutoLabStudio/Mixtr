import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ChevronRight, Calendar, MapPin, Clock, Users, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { EventBooking, Mixologist } from "@shared/schema";

export default function MyBookings() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Get user's event bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery<EventBooking[]>({
    queryKey: ['/api/event-bookings/user'],
    enabled: !!user,
  });
  
  // Get mixologists to display with bookings
  const { data: mixologists, isLoading: mixologistsLoading } = useQuery<Mixologist[]>({
    queryKey: ['/api/mixologists'],
  });
  
  const isLoading = bookingsLoading || mixologistsLoading;
  
  // Helper function to find mixologist by ID
  const findMixologist = (id: number) => {
    return mixologists?.find(m => m.id === id);
  };
  
  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };
  
  // Function to render badge status
  const renderStatusBadge = (status: string) => {
    const variant = getStatusBadgeVariant(status);
    
    const classes = {
      success: "bg-green-100 text-green-800 hover:bg-green-200",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      destructive: "bg-red-100 text-red-800 hover:bg-red-200",
      default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      outline: "border border-border"
    };
    
    return (
      <Badge variant="outline" className={classes[variant as keyof typeof classes]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  if (!user) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">
            Please log in to view your bookings.
          </p>
          <Button onClick={() => setLocation("/auth")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-10 bg-muted rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded w-32 ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-28 pb-16">
      <Container className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">My Event Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your mixologist bookings for events
          </p>
        </div>
        
        {(!bookings || bookings.length === 0) ? (
          <div className="text-center py-12 border rounded-lg">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No Bookings Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't made any mixologist bookings yet.
            </p>
            <Button onClick={() => setLocation("/mixologists")}>
              Find a Mixologist
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const mixologist = findMixologist(booking.mixologistId);
              const eventDate = booking.eventDate instanceof Date 
                ? booking.eventDate 
                : new Date(booking.eventDate);
              
              return (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{booking.eventType} Event</CardTitle>
                        <CardDescription className="mt-1">
                          {format(eventDate, "PPP")} ({format(eventDate, "p")})
                        </CardDescription>
                      </div>
                      {renderStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      {mixologist && (
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={mixologist.imageUrl} 
                            alt={mixologist.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">
                          {mixologist ? mixologist.name : `Mixologist #${booking.mixologistId}`}
                        </h3>
                        
                        {mixologist && (
                          <p className="text-muted-foreground text-sm">
                            {mixologist.barName}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{booking.eventDuration} hours</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{booking.guestCount} guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-4">
                        <Separator className="mb-4" />
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm mb-1">Special Requests</h4>
                            <p className="text-sm text-muted-foreground">
                              {booking.specialRequests}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="font-medium">
                      Total: ${booking.totalPrice}
                    </div>
                    
                    {booking.status === 'approved' && (
                      <Button variant="outline" onClick={() => setLocation(`/mixologists/${booking.mixologistId}`)}>
                        View Mixologist Profile
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                    
                    {booking.status === 'pending' && new Date() < eventDate && (
                      <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        Cancel Request
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}