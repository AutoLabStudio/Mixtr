import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Clock, MapPin, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Helmet } from "react-helmet";
import type { Bar as BarType, Cocktail } from "@shared/schema";

export default function Bar() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const { data: bar, isLoading: barLoading, error: barError } = useQuery<BarType>({
    queryKey: [`/api/bars/${id}`],
  });
  
  const { data: cocktails, isLoading: cocktailsLoading, error: cocktailsError } = useQuery<Cocktail[]>({
    queryKey: [`/api/bars/${id}/cocktails`],
    enabled: !!id,
  });
  
  const isLoading = barLoading || cocktailsLoading;
  const error = barError || cocktailsError;
  
  const handleAddToCart = (cocktail: Cocktail) => {
    if (bar) {
      addToCart({
        id: cocktail.id,
        name: cocktail.name,
        price: cocktail.price,
        barName: bar.name,
        imageUrl: cocktail.imageUrl,
        quantity: 1
      });
    }
  };
  
  if (error) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Error Loading Bar</h2>
        <p className="text-muted-foreground">Failed to load bar details. Please try again later.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{bar ? `${bar.name} - Mixtr` : 'Bar Details - Mixtr'}</title>
        <meta
          name="description"
          content={bar ? bar.description : "View bar details and menu"}
        />
      </Helmet>
      
      <div className="pt-20 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bars
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <BarDetailSkeleton />
          ) : bar ? (
            <>
              <div className="mb-10">
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={bar.imageUrl} 
                    alt={bar.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="font-serif font-bold text-3xl md:text-4xl">{bar.name}</h1>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-4">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="ml-1 text-sm">{bar.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{bar.deliveryTime} delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="font-serif font-semibold text-xl mb-3">About {bar.name}</h2>
                    <p className="text-muted-foreground mb-4">{bar.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {bar.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="p-6 bg-muted h-fit">
                    <h3 className="font-medium mb-4">Contact & Hours</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          123 Main Street, New York, NY 10001
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm text-muted-foreground">(555) 123-4567</span>
                      </div>
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Hours:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Monday - Thursday</span>
                            <span>4:00 PM - 12:00 AM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Friday - Saturday</span>
                            <span>4:00 PM - 2:00 AM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span>4:00 PM - 10:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div>
                <Tabs defaultValue="all">
                  <div className="border-b mb-6">
                    <h2 className="font-serif font-semibold text-2xl mb-4">Cocktail Menu</h2>
                    <TabsList>
                      <TabsTrigger value="all">All Cocktails</TabsTrigger>
                      <TabsTrigger value="signature">Signature</TabsTrigger>
                      <TabsTrigger value="classics">Classics</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cocktails?.length ? (
                        cocktails.map((cocktail) => (
                          <Card key={cocktail.id} className="overflow-hidden">
                            <div className="relative h-48">
                              <img 
                                src={cocktail.imageUrl} 
                                alt={cocktail.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-sm font-bold px-2 py-0.5 rounded-full">
                                {formatCurrency(cocktail.price)}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium mb-1">
                                <Link 
                                  href={`/cocktails/${cocktail.id}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {cocktail.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {cocktail.description}
                              </p>
                              <Button 
                                size="sm" 
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                onClick={() => handleAddToCart(cocktail)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">No cocktails available from this bar.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signature" className="mt-0">
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Signature cocktails menu coming soon.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="classics" className="mt-0">
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Classic cocktails menu coming soon.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-serif mb-4">Bar Not Found</h2>
              <p className="text-muted-foreground">
                We couldn't find the bar you're looking for.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">Browse Our Partners</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function BarDetailSkeleton() {
  return (
    <>
      <div className="mb-10">
        <Skeleton className="w-full h-64 md:h-96 rounded-lg mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-64 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-5/6 mb-2" />
            <Skeleton className="h-5 w-4/6 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-32" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-64 mb-6" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    </>
  );
}
