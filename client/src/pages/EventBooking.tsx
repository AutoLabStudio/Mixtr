import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Mixologist, insertEventBookingSchema } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Clock, Users, MapPin, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const eventTypes = [
  { value: "Corporate", label: "Corporate Event" },
  { value: "Wedding", label: "Wedding" },
  { value: "Birthday", label: "Birthday Party" },
  { value: "Anniversary", label: "Anniversary" },
  { value: "Graduation", label: "Graduation Party" },
  { value: "Cocktail Class", label: "Private Cocktail Class" },
  { value: "Tasting", label: "Tasting Event" },
  { value: "Other", label: "Other Private Event" },
];

const durationOptions = [
  { value: "2", label: "2 hours" },
  { value: "3", label: "3 hours" },
  { value: "4", label: "4 hours" },
  { value: "5", label: "5 hours" },
  { value: "6", label: "6 hours" },
  { value: "8", label: "8 hours (Full day)" },
];

export default function EventBooking() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const mixologistId = parseInt(id);
  
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  // Get the mixologist details
  const { data: mixologist, isLoading: mixologistLoading } = useQuery<Mixologist>({
    queryKey: ['/api/mixologists', mixologistId],
    enabled: !isNaN(mixologistId),
  });
  
  // Create booking form schema
  const formSchema = insertEventBookingSchema.extend({
    eventDate: z.date(),
    eventDuration: z.string(),
    guestCount: z.number().min(1, "Must have at least 1 guest").max(
      mixologist?.maxGuests || 200, 
      `This mixologist can accommodate up to ${mixologist?.maxGuests || 200} guests`
    ),
    eventType: z.string().min(1, "Please select event type"),
    location: z.string().min(10, "Please provide complete address for the event"),
    specialRequests: z.string().optional(),
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user?.id.toString() || "",
      mixologistId,
      eventType: "",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week from now
      eventDuration: "3",
      guestCount: 20,
      location: "",
      specialRequests: "",
      status: "pending",
      totalPrice: 0,
    },
  });
  
  // Calculate price when relevant form values change
  const watchDuration = form.watch("eventDuration");
  const watchGuests = form.watch("guestCount");
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!mixologist) return 0;
    
    const hourlyRate = mixologist.hourlyRate;
    const duration = parseInt(watchDuration);
    const guests = watchGuests;
    
    // Base price is hourly rate times duration
    let basePrice = hourlyRate * duration;
    
    // Add service fee based on guest count
    const serviceFee = guests <= 20 ? 50 : 
                      guests <= 50 ? 100 : 
                      guests <= 100 ? 200 : 300;
    
    // Calculate total
    return basePrice + serviceFee;
  };
  
  // Recalculate price when needed form values change
  useState(() => {
    const price = calculateTotalPrice();
    setCalculatedPrice(price);
    form.setValue("totalPrice", price);
  });
  
  // Mutation for creating a booking
  const createBookingMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest('POST', '/api/event-bookings', data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to create booking');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking request submitted!",
        description: "We'll notify you once the mixologist confirms your booking.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/event-bookings'] });
      setLocation("/my-bookings");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Convert to number where needed
    const bookingData = {
      ...data,
      eventDuration: parseInt(data.eventDuration),
      totalPrice: calculateTotalPrice(),
    };
    
    createBookingMutation.mutate(bookingData as any);
  };
  
  if (mixologistLoading) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="animate-pulse w-full max-w-2xl">
          <div className="h-10 bg-muted rounded w-1/3 mb-8"></div>
          <div className="h-24 bg-muted rounded mb-8"></div>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!mixologist) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mixologist Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't find the mixologist you're looking for.
          </p>
          <Button onClick={() => setLocation("/mixologists")}>
            View All Mixologists
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-28 pb-16">
      <Container className="max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:pl-0 hover:bg-transparent"
          onClick={() => setLocation(`/mixologists/${mixologistId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mixologist
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Book {mixologist.name}</h1>
          <p className="text-muted-foreground mt-2">
            Complete the form below to request a booking for your event
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-accent/20 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-accent-foreground">Event Booking Information</p>
            <p className="text-muted-foreground text-sm">
              Your booking request will be sent to the mixologist for confirmation. 
              You will not be charged until the booking is confirmed. The total price 
              includes the mixologist's hourly rate and a service fee based on guest count.
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eventDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        const price = calculateTotalPrice();
                        setCalculatedPrice(price);
                        form.setValue("totalPrice", price);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      ${mixologist.hourlyRate}/hour
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={mixologist.maxGuests}
                        placeholder="Enter guest count"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                          const price = calculateTotalPrice();
                          setCalculatedPrice(price);
                          form.setValue("totalPrice", price);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      Maximum {mixologist.maxGuests} guests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter complete address" {...field} />
                  </FormControl>
                  <FormDescription className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    Full address where the event will take place
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special cocktail requests, equipment needs, or other details"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Let the mixologist know about any specific requirements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Base Rate</span>
                <span>${mixologist.hourlyRate} × {watchDuration} hours = ${mixologist.hourlyRate * parseInt(watchDuration)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Service Fee</span>
                <span>
                  ${
                    watchGuests <= 20 ? 50 : 
                    watchGuests <= 50 ? 100 : 
                    watchGuests <= 100 ? 200 : 300
                  }
                </span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Price</span>
                <span>${calculatedPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You will not be charged until the mixologist confirms your booking.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </form>
        </Form>
      </Container>
    </div>
  );
}