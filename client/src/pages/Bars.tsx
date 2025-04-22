import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star, Clock, ChevronRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { MapComponent } from "@/components/MapComponent";
import type { Bar } from "@shared/schema";

export default function Bars() {
  const { data: bars, isLoading, error } = useQuery<Bar[]>({
    queryKey: ['/api/bars'],
  });
  
  return (
    <>
      <Helmet>
        <title>Mixtr - Partner Bars</title>
        <meta
          name="description"
          content="Discover the best cocktail bars in your city partnered with Mixtr."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">Our Partner Bars</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've partnered with the best cocktail bars in the city to bring their signature drinks to your doorstep.
            Browse our partners below or find a bar near you.
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-medium mb-4">Find Bars Near You</h2>
          <div className="flex flex-col md:flex-row gap-4 md:items-start">
            <div className="flex items-center gap-4 flex-wrap flex-grow">
              <div className="relative flex-grow max-w-md">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Enter your location or zip code" 
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground bg-background"
                  id="locationSearch"
                />
              </div>
              <Button 
                className="shrink-0"
                onClick={() => {
                  // Find the "Find Bars on Map" button in the same container and trigger its click
                  const mapBtn = document.querySelector('button[class*="w-full flex items-center justify-center"]');
                  if (mapBtn instanceof HTMLButtonElement) {
                    mapBtn.click();
                  }
                }}
              >
                Search
              </Button>
            </div>
            
            <div className="mt-2 md:mt-0 md:w-1/3">
              {!isLoading && bars && (
                <MapComponent bars={bars} />
              )}
            </div>
          </div>
          
          <div className="mt-4 flex gap-2 items-center text-sm text-muted-foreground">
            <div className="flex-shrink-0 h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Your location</span>
            <div className="ml-4 flex-shrink-0 h-3 w-3 rounded-full bg-primary"></div>
            <span>Partner bars</span>
          </div>
        </div>
        
        {error ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Failed to load partner bars. Please try again later.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <BarCardSkeleton key={i} />
              ))
            ) : (
              bars?.map((bar) => (
                <BarCard key={bar.id} bar={bar} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

function BarCard({ bar }: { bar: Bar }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 relative">
        <img 
          src={bar.imageUrl} 
          alt={bar.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-card text-card-foreground">
            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
            {bar.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-grow flex flex-col p-5">
        <h3 className="font-serif font-semibold text-xl mb-2">
          <Link href={`/bars/${bar.id}`} className="hover:text-primary transition-colors">
            {bar.name}
          </Link>
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{bar.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {bar.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-muted text-muted-foreground text-xs">
              {tag}
            </Badge>
          ))}
          {bar.tags.length > 3 && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
              +{bar.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
          <span className="truncate">{bar.location || "Location information not available"}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{bar.deliveryTime} delivery</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-primary px-2" asChild>
            <Link href={`/bars/${bar.id}`}>
              View Menu <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BarCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48">
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardContent className="flex-grow flex flex-col p-5">
        <Skeleton className="h-7 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        
        <Skeleton className="h-4 w-full mb-4" />
        
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}