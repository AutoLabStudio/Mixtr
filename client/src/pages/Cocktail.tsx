import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Plus, Minus } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Helmet } from "react-helmet";

export default function Cocktail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const { data: cocktail, isLoading, error } = useQuery({
    queryKey: [`/api/cocktails/${id}`],
  });
  
  const handleAddToCart = () => {
    if (cocktail) {
      addToCart({
        id: cocktail.id,
        name: cocktail.name,
        price: cocktail.price,
        barName: cocktail.bar.name,
        imageUrl: cocktail.imageUrl,
        quantity: quantity
      });
    }
  };
  
  if (error) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Error Loading Cocktail</h2>
        <p className="text-muted-foreground">Failed to load cocktail details. Please try again later.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{cocktail ? `${cocktail.name} - Mixtr` : 'Cocktail Details - Mixtr'}</title>
        <meta
          name="description"
          content={cocktail ? cocktail.description : "View cocktail details"}
        />
      </Helmet>
      
      <div className="pt-20 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton fallbackPath="/cocktails" />
          </div>
          
          {isLoading ? (
            <CocktailDetailSkeleton />
          ) : cocktail ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={cocktail.imageUrl} 
                    alt={cocktail.name} 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <img 
                    src={cocktail.imageUrl} 
                    alt={cocktail.name} 
                    className="rounded-md h-24 w-full object-cover cursor-pointer border-2 border-primary"
                  />
                  {/* Placeholder thumbnails */}
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="rounded-md h-24 w-full bg-muted flex items-center justify-center"
                    >
                      <span className="text-muted-foreground text-xs">View {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h1 className="font-serif font-bold text-3xl md:text-4xl">{cocktail.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-4">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="ml-1 text-sm">{cocktail.rating.toFixed(1)}</span>
                  </div>
                  <Link href={`/bars/${cocktail.bar.id}`} className="text-primary hover:underline">
                    {cocktail.bar.name}
                  </Link>
                </div>
                
                <div className="mt-4 text-2xl font-semibold">{formatCurrency(cocktail.price)}</div>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{cocktail.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {cocktail.ingredients.map((ingredient, i) => (
                      <Badge key={i} variant="outline">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6 flex items-center">
                  <h3 className="font-medium mr-3">Delivery Time:</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{cocktail.bar.deliveryTime}</span>
                  </div>
                </div>
                
                <Card className="p-4 bg-muted mb-6">
                  <h3 className="font-medium mb-2">Delivery Info</h3>
                  <p className="text-sm text-muted-foreground">
                    This cocktail is prepared fresh at {cocktail.bar.name} and delivered in our 
                    specialized packaging to maintain optimal temperature and quality.
                  </p>
                </Card>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-serif mb-4">Cocktail Not Found</h2>
              <p className="text-muted-foreground">
                We couldn't find the cocktail you're looking for.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">Browse Our Selection</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CocktailDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Skeleton className="w-full h-96 rounded-lg" />
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-md" />
          ))}
        </div>
      </div>
      
      <div>
        <Skeleton className="h-10 w-3/4 mb-2" />
        <div className="flex items-center mt-2 mb-4">
          <Skeleton className="h-5 w-16 mr-4" />
          <Skeleton className="h-5 w-32" />
        </div>
        
        <Skeleton className="h-8 w-24 mt-4" />
        
        <Skeleton className="h-1 w-full my-6" />
        
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-5 w-full mb-1" />
        <Skeleton className="h-5 w-5/6 mb-6" />
        
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-24" />
          ))}
        </div>
        
        <Skeleton className="h-6 w-full mb-6" />
        
        <Skeleton className="h-32 w-full mb-6 rounded-md" />
        
        <div className="flex space-x-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}
