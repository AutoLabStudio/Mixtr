import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import type { Cocktail } from "@shared/schema";

export function FeaturedCocktails() {
  const { addToCart } = useCart();
  
  const { data: cocktails, isLoading, error } = useQuery<Cocktail[]>({
    queryKey: ['/api/cocktails/featured'],
  });

  if (error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Failed to load featured cocktails. Please try again later.</p>
      </div>
    );
  }

  return (
    <section id="featured" className="py-12 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">Featured Cocktails</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Discover handcrafted cocktails from the city's top mixologists, ready to be delivered to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <CocktailCardSkeleton key={i} />)
          ) : (
            cocktails?.map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                cocktail={cocktail}
                onAddToCart={() => {
                  addToCart({
                    id: cocktail.id,
                    name: cocktail.name,
                    price: cocktail.price,
                    barName: "Loading...", // Will be replaced with actual bar name when data is fetched
                    imageUrl: cocktail.imageUrl,
                    quantity: 1
                  });
                }}
              />
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => {
              window.location.href = "/cocktails";
            }}
          >
            View All Cocktails <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function CocktailCard({ cocktail, onAddToCart }: { cocktail: Cocktail, onAddToCart: () => void }) {
  const { data: barData } = useQuery({
    queryKey: [`/api/bars/${cocktail.barId}`],
    enabled: !!cocktail.barId,
  });

  const barName = barData?.name || "Loading...";

  return (
    <Card className="bg-background rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={cocktail.imageUrl} 
          alt={cocktail.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
          {formatCurrency(cocktail.price)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-serif font-semibold text-xl">
              <a 
                href={`/cocktails/${cocktail.id}`} 
                className="hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/cocktails/${cocktail.id}`;
                }}
              >
                {cocktail.name}
              </a>
            </h3>
            <p className="text-sm text-muted-foreground">{barName}</p>
          </div>
          <div className="flex items-center">
            <span className="text-primary text-sm mr-1">{cocktail.rating.toFixed(1)}</span>
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{cocktail.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{barData?.deliveryTime || "25-35 min"}</span>
          </div>
          <Button 
            onClick={onAddToCart}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CocktailCardSkeleton() {
  return (
    <Card className="bg-background rounded-lg overflow-hidden shadow-lg">
      <div className="h-56">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </Card>
  );
}
