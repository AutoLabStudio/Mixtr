import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Mixologist } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { PageTitle } from "@/components/PageTitle";
import { Loader2, Star, Users } from "lucide-react";

export default function Mixologists() {
  const { data: mixologists, isLoading, error } = useQuery<Mixologist[]>({
    queryKey: ["/api/mixologists"],
  });

  return (
    <Container className="py-8">
      <BackButton />
      <PageTitle>Book a Mixologist</PageTitle>
      <p className="text-muted-foreground mb-8">
        Elevate your event with one of our professional mixologists. Perfect for corporate events, 
        private parties, birthdays, or any special gathering that deserves exceptional drinks.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500">Failed to load mixologists. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mixologists?.map((mixologist) => (
            <Card key={mixologist.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-64 bg-muted">
                <img 
                  src={mixologist.imageUrl} 
                  alt={mixologist.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {mixologist.featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{mixologist.name}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{mixologist.rating.toFixed(1)}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Bartender at {mixologist.barName}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{mixologist.bio}</p>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Specializes in events up to {mixologist.maxGuests} guests</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/mixologists/${mixologist.id}`}>
                  <Button className="w-full">View Profile & Book</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}