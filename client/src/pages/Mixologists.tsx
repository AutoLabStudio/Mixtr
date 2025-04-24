import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Mixologist } from "@shared/schema";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageTitle } from "@/components/PageTitle";
import { Star, Clock, DollarSign, UserPlus } from "lucide-react";

export default function Mixologists() {
  const [_, setLocation] = useLocation();
  
  const { data: mixologists, isLoading } = useQuery<Mixologist[]>({
    queryKey: ['/api/mixologists'],
  });

  const goToMixologistDetail = (id: number) => {
    setLocation(`/mixologists/${id}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 pt-32 flex justify-center">
        <div className="animate-pulse w-full max-w-7xl">
          <div className="h-10 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-muted"></div>
                <div className="p-5 space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-12 bg-muted rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="text-center mb-12">
          <PageTitle className="mb-3">Book a Professional Mixologist</PageTitle>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elevate your event with a professional mixologist from one of our partner bars. 
            Create memorable experiences with custom cocktail menus and expert service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mixologists?.map((mixologist) => (
            <Card key={mixologist.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={mixologist.imageUrl} 
                  alt={mixologist.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {mixologist.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="bg-primary hover:bg-primary/90">Featured</Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{mixologist.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{mixologist.rating}</span>
                  </div>
                </div>
                <CardDescription className="text-sm">{mixologist.barName}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{mixologist.yearsOfExperience} years</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>${mixologist.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserPlus className="w-4 h-4" />
                    <span>Up to {mixologist.maxGuests}</span>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {mixologist.bio}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {mixologist.specialties.split(',').map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-accent/50 hover:bg-accent text-accent-foreground">
                      {specialty.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => goToMixologistDetail(mixologist.id)}
                >
                  View Profile & Book
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}