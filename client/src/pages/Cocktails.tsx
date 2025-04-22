import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ChevronRight, Search, Wine as CocktailIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import type { Cocktail } from "@shared/schema";

export default function Cocktails() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("popular");
  const { addToCart } = useCart();
  
  const { data: cocktails, isLoading, error } = useQuery<Cocktail[]>({
    queryKey: ['/api/cocktails'],
  });

  // Filter and sort cocktails
  const filteredCocktails = cocktails ? 
    cocktails
      .filter(cocktail => 
        cocktail.name.toLowerCase().includes(filter.toLowerCase()) ||
        cocktail.description.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "popular") return b.rating - a.rating;
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return 0;
      }) 
    : [];

  return (
    <>
      <Helmet>
        <title>Browse Cocktails - Mixtr</title>
        <meta
          name="description"
          content="Browse our selection of premium cocktails from the best bars in your city."
        />
      </Helmet>
      
      <div className="pt-20 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">Browse Our Cocktails</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our premium selection of handcrafted cocktails from the city's top mixologists
            </p>
          </div>
          
          {/* Filters and sorting */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search cocktails..."
                  className="pl-10"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select defaultValue={sort} onValueChange={setSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {error ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Failed to load cocktails. Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {!isLoading && `Showing ${filteredCocktails.length} cocktails`}
                </p>
                
                {/* For future: Add filters for categories, ingredients, etc. */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background">
                    <CocktailIcon className="mr-1 h-3 w-3" /> All Cocktails
                  </Badge>
                </div>
              </div>
              
              {/* Cocktail grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <CocktailCardSkeleton key={i} />
                  ))
                ) : (
                  filteredCocktails.map((cocktail) => (
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
              
              {/* Empty state */}
              {!isLoading && filteredCocktails.length === 0 && (
                <div className="text-center py-20">
                  <CocktailIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No cocktails found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any cocktails matching your search criteria.
                  </p>
                  <Button onClick={() => setFilter("")}>Clear Search</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CocktailCard({ cocktail, onAddToCart }: { cocktail: Cocktail, onAddToCart: () => void }) {
  const { data: barData } = useQuery({
    queryKey: [`/api/bars/${cocktail.barId}`],
    enabled: !!cocktail.barId,
  });

  const barName = barData?.name || "Loading...";

  return (
    <Card className="bg-background rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] flex flex-col">
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
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-serif font-semibold text-xl">
              <Link href={`/cocktails/${cocktail.id}`} className="hover:text-primary transition-colors">
                {cocktail.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{barName}</p>
          </div>
          <div className="flex items-center">
            <span className="text-primary text-sm mr-1">{cocktail.rating.toFixed(1)}</span>
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{cocktail.description}</p>
        <div className="flex items-center justify-between mt-auto">
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