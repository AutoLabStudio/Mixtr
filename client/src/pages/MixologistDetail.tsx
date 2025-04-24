import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Mixologist } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/BackButton";
import { Loader2, Calendar, Clock, Star, Award, MapPin, GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MixologistWithBar extends Mixologist {
  bar: {
    id: number;
    name: string;
    location: string;
    imageUrl: string;
  };
}

export default function MixologistDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  const { data: mixologist, isLoading, error } = useQuery<MixologistWithBar>({
    queryKey: [`/api/mixologists/${id}`],
  });

  const handleBookNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/event-booking/${id}`);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden h-[400px] mb-6">
            <img 
              src={mixologist.imageUrl} 
              alt={mixologist.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {mixologist.featured && (
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Featured Mixologist</Badge>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={mixologist.imageUrl} alt={mixologist.name} />
                <AvatarFallback>{mixologist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{mixologist.name}</h1>
                <p className="text-muted-foreground">Mixologist at {mixologist.barName}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{mixologist.rating.toFixed(1)}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">{mixologist.bar.location}</span>
                </div>
              </div>
            </div>
            <div>
              <Button size="lg" onClick={handleBookNow}>Book for Event</Button>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="text-muted-foreground">
              <p className="mb-4">{mixologist.bio}</p>
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2" />
                <span>Can serve events with up to {mixologist.maxGuests} guests</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <span>{mixologist.yearsOfExperience} years of professional experience</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                <span>{mixologist.certifications}</span>
              </div>
            </TabsContent>
            
            <TabsContent value="specialties">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mixologist.specialties.split(",").map((specialty, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-primary mr-2" />
                        <span>{specialty.trim()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="experience" className="text-muted-foreground">
              <p className="mb-4">{mixologist.experience}</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book {mixologist.name}</CardTitle>
              <CardDescription>
                Perfect for corporate events, weddings, birthdays, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg mb-2">
                Starting at ${mixologist.hourlyRate}/hour
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Final price depends on event size, duration, and complexity
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">Check calendar during booking</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-sm text-muted-foreground">Up to {mixologist.maxGuests} guests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">Minimum 3 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">From {mixologist.bar.name}</CardTitle>
            </CardHeader>
            <div className="h-48 relative">
              <img 
                src={mixologist.bar.imageUrl} 
                alt={mixologist.bar.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to={`/bars/${mixologist.bar.id}`}>Visit Bar Page</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Container>
  );
}