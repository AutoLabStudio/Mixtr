import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Bar } from "@shared/schema";

export function FeaturedBars() {
  const { data: bars, isLoading, error } = useQuery<Bar[]>({
    queryKey: ['/api/bars'],
  });
  
  if (error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Failed to load partner bars. Please try again later.</p>
      </div>
    );
  }

  return (
    <section id="bars" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">Our Partner Bars</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We've partnered with the best cocktail bars in the city to bring their signature drinks to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <BarCardSkeleton key={i} />)
          ) : (
            bars?.map((bar) => (
              <BarCard key={bar.id} bar={bar} />
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
            View All Partner Bars <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function BarCard({ bar }: { bar: Bar }) {
  return (
    <Card className="bg-card rounded-lg overflow-hidden shadow-lg flex flex-col sm:flex-row">
      <div className="sm:w-1/3 h-48 sm:h-auto">
        <img 
          src={bar.imageUrl} 
          alt={bar.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="sm:w-2/3 p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-serif font-semibold text-xl">
            <Link href={`/bars/${bar.id}`} className="hover:text-primary transition-colors">
              {bar.name}
            </Link>
          </h3>
          <div className="flex items-center">
            <span className="text-primary text-sm mr-1">{bar.rating.toFixed(1)}</span>
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{bar.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {bar.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-muted text-muted-foreground text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{bar.deliveryTime} delivery</span>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto" asChild>
            <Link href={`/bars/${bar.id}`}>
              View Menu <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function BarCardSkeleton() {
  return (
    <Card className="bg-card rounded-lg overflow-hidden shadow-lg flex flex-col sm:flex-row">
      <div className="sm:w-1/3 h-48 sm:h-auto">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="sm:w-2/3 p-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </Card>
  );
}
