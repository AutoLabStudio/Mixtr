import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Mixologist } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/BackButton";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define our booking form schema with zod
const formSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  eventDuration: z.coerce.number().min(3, "Minimum duration is 3 hours"),
  location: z.string().min(3, "Location is required"),
  guestCount: z.coerce.number().min(5, "Minimum guest count is 5").max(300, "Maximum guest count is 300"),
  specialRequests: z.string().optional(),
});

export default function EventBooking() {
  const { mixologistId } = useParams<{ mixologistId: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch mixologist details
  const { data: mixologist, isLoading, error } = useQuery<Mixologist>({
    queryKey: [`/api/mixologists/${mixologistId}`],
  });

  // Calculate the minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
      eventDate: undefined,
      eventDuration: 3,
      location: "",
      guestCount: 20,
      specialRequests: "",
    },
  });

  // Create a booking mutation
  const createBooking = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Calculate estimated price based on hourly rate, guest count, and duration
      const hourlyRate = mixologist?.hourlyRate || 75;
      const basePrice = hourlyRate * data.eventDuration;
      const guestFactor = Math.ceil(data.guestCount / 25); // Every 25 guests increases price
      const totalPrice = basePrice * guestFactor;
      
      const bookingData = {
        ...data,
        mixologistId: parseInt(mixologistId),
        userId: user?.id.toString() || "",
        totalPrice,
      };
      
      const response = await apiRequest("POST", "/api/event-bookings", bookingData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${user?.id}/event-bookings`] });
      toast({
        title: "Booking submitted!",
        description: "Your event booking request has been submitted successfully.",
      });
      navigate("/my-bookings");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a mixologist",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    createBooking.mutate(values);
  };

  // Calculate estimated price
  const calculateEstimatedPrice = () => {
    const values = form.getValues();
    const hourlyRate = mixologist?.hourlyRate || 75;
    const duration = values.eventDuration || 3;
    const guestCount = values.guestCount || 20;
    const basePrice = hourlyRate * duration;
    const guestFactor = Math.ceil(guestCount / 25); // Every 25 guests increases price
    return basePrice * guestFactor;
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  if (error || !mixologist) {
    return (
      <Container className="py-8">
        <BackButton />
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load mixologist details. Please try again later.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book {mixologist.name} for Your Event</h1>
        <p className="text-muted-foreground">
          Complete the form below to request this mixologist for your special event
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="cocktail">Cocktail Party</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of event you're hosting
                      </FormDescription>
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
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
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
                            disabled={(date) => date < tomorrow}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date of your event
                      </FormDescription>
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
                      <FormLabel>Event Duration (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min={3} max={12} {...field} onChange={e => {
                          field.onChange(e);
                          form.trigger("eventDuration");
                        }} />
                      </FormControl>
                      <FormDescription>
                        Minimum 3 hours, maximum 12 hours
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
                        <Input type="number" min={5} max={300} {...field} onChange={e => {
                          field.onChange(e);
                          form.trigger("guestCount");
                        }} />
                      </FormControl>
                      <FormDescription>
                        How many guests will attend (5-300)
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
                      <Input placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormDescription>
                      Full address where the mixologist will work
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
                        placeholder="Any special requirements, signature drinks, or other important details" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Specific cocktails, equipment needs, or other details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <img 
                  src={mixologist.imageUrl}
                  alt={mixologist.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-lg">{mixologist.name}</h3>
                  <p className="text-sm text-muted-foreground">Professional Mixologist</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <h4 className="font-medium mb-2">Estimated Price</h4>
                <p className="text-2xl font-bold">${calculateEstimatedPrice()}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on ${mixologist.hourlyRate}/hour, {form.watch("eventDuration") || 3} hours, and {form.watch("guestCount") || 20} guests
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Final price may vary based on specific requirements</p>
                <p>• Payment will be processed after booking confirmation</p>
                <p>• Booking requests are subject to mixologist availability</p>
                <p>• Cancellation policy: 48 hours notice required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}