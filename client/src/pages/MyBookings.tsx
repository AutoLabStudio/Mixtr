import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { Loader2, Calendar, Clock, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface BookingWithMixologist {
  id: number;
  createdAt: string;
  status: string;
  location: string;
  mixologistId: number;
  userId: string;
  eventType: string;
  eventDate: string;
  eventDuration: number;
  guestCount: number;
  totalPrice: number;
  specialRequests: string | null;
  mixologist: {
    id: number;
    name: string;
    imageUrl: string;
    barId: number;
    barName: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "completed":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case "corporate":
      return "Corporate Event";
    case "birthday":
      return "Birthday Party";
    case "wedding":
      return "Wedding";
    case "cocktail":
      return "Cocktail Party";
    default:
      return "Event";
  }
};

export default function MyBookings() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: bookings, isLoading, error } = useQuery<BookingWithMixologist[]>({
    queryKey: [`/api/user/${user?.id}/event-bookings`],
    enabled: !!user,
  });

  if (isAuthLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-8">
        <BackButton />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">Please log in to view your mixologist bookings.</p>
          <Button asChild>
            <Link to="/auth">Go to Login</Link>
          </Button>
        </div>
      </Container>
    );
  }

  const upcomingBookings = bookings?.filter(b => b.status !== "completed" && b.status !== "cancelled") || [];
  const pastBookings = bookings?.filter(b => b.status === "completed" || b.status === "cancelled") || [];

  return (
    <Container className="py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-2">My Mixologist Bookings</h1>
      <p className="text-muted-foreground mb-8">
        View and manage your mixologist event bookings
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load your bookings. Please try again later.</p>
        </div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
          <p className="text-muted-foreground mb-6">You haven't made any mixologist bookings yet.</p>
          <Button asChild>
            <Link to="/mixologists">Browse Mixologists</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

function BookingCard({ booking }: { booking: BookingWithMixologist }) {
  const eventDate = new Date(booking.eventDate);
  const statusColor = getStatusColor(booking.status);
  const eventTypeLabel = getEventTypeLabel(booking.eventType);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{eventTypeLabel}</CardTitle>
          <Badge className={statusColor}>{booking.status}</Badge>
        </div>
        <CardDescription>
          Booking #{booking.id} • {format(new Date(booking.createdAt), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center mb-4">
          <img 
            src={booking.mixologist.imageUrl}
            alt={booking.mixologist.name}
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-medium">{booking.mixologist.name}</h3>
            <p className="text-sm text-muted-foreground">
              From {booking.mixologist.barName}
            </p>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{booking.eventDuration} hours</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{booking.guestCount} guests</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
            <span>{booking.location}</span>
          </div>
        </div>
        
        {booking.specialRequests && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Special Requests:</p>
            <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="font-bold">${booking.totalPrice}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/mixologists/${booking.mixologistId}`}>View Mixologist</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}