import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Mixologist } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, DollarSign, UserPlus, Award, ShieldCheck, BookCheck, Calendar, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function MixologistDetail() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const mixologistId = parseInt(id);
  
  const { data: mixologist, isLoading, error } = useQuery<Mixologist>({
    queryKey: ['/api/mixologists', mixologistId],
    enabled: !isNaN(mixologistId),
  });
  
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a mixologist for your event.",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    setLocation(`/event-booking/${mixologistId}`);
  };
  
  if (isLoading) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="animate-pulse w-full max-w-7xl">
          <div className="flex gap-8">
            <div className="w-1/3 h-96 bg-muted rounded-lg"></div>
            <div className="w-2/3 space-y-4">
              <div className="h-10 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-40 bg-muted rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !mixologist) {
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
  
  const specialties = mixologist.specialties.split(',').map(s => s.trim());
  
  return (
    <div className="pt-28 pb-16">
      <Container>
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:pl-0 hover:bg-transparent"
          onClick={() => setLocation("/mixologists")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mixologists
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile image and booking card */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-border relative">
              <img 
                src={mixologist.imageUrl} 
                alt={mixologist.name}
                className="w-full aspect-[3/4] object-cover"
              />
              {mixologist.featured && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="bg-primary hover:bg-primary/90">Featured</Badge>
                </div>
              )}
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">${mixologist.hourlyRate}/hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Max Guests</span>
                    <span className="font-semibold">{mixologist.maxGuests} people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Availability</span>
                    <span className={`font-semibold ${mixologist.availability ? 'text-green-500' : 'text-red-500'}`}>
                      {mixologist.availability ? 'Available for booking' : 'Currently unavailable'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleBookNow}
                  disabled={!mixologist.availability}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book for Your Event
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Profile information */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                <h1 className="text-3xl font-bold">{mixologist.name}</h1>
                <div className="flex items-center bg-card rounded-full px-3 py-1 border border-border">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{mixologist.rating} Rating</span>
                </div>
              </div>
              
              <div className="flex items-center text-muted-foreground mb-6">
                <span>{mixologist.barName}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{mixologist.yearsOfExperience} years experience</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {mixologist.bio}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-accent/50 hover:bg-accent text-accent-foreground">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Certifications</h2>
              <div className="flex items-start gap-2 mb-4">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <p>{mixologist.certifications}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Professional Experience</h2>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                <p className="leading-relaxed">{mixologist.experience}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">What to Expect</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <BookCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Customized cocktail menu tailored to your event theme and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Professional bartending equipment and service ware</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Creative signature drinks made with premium ingredients</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Interactive mixology demonstrations and guest engagement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}