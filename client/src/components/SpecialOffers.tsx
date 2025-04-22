import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { SpecialOffer } from "@shared/schema";

export function SpecialOffers() {
  const { data: offers, isLoading, error } = useQuery<SpecialOffer[]>({
    queryKey: ['/api/special-offers'],
  });
  
  if (error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Failed to load special offers. Please try again later.</p>
      </div>
    );
  }

  return (
    <section id="specials" className="py-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <CocktailIcon className="text-accent w-[400px] h-[400px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">Special Offers</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Limited-time promotions and exclusive deals for our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => <OfferCardSkeleton key={i} />)
          ) : (
            offers?.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: SpecialOffer }) {
  return (
    <Card className="bg-gradient-to-r from-card to-muted rounded-lg overflow-hidden shadow-lg p-6 border border-primary/30">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
          <Badge variant="outline" className={
            offer.type === "LIMITED_TIME" 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-accent text-accent-foreground border-accent"
          }>
            {offer.type === "LIMITED_TIME" ? "LIMITED TIME" : "NEW CUSTOMERS"}
          </Badge>
          
          <h3 className="font-serif font-bold text-2xl mt-4 mb-2">{offer.title}</h3>
          <p className="text-muted-foreground mb-4">{offer.description}</p>
          
          {offer.originalPrice && offer.discountedPrice ? (
            <div className="flex items-center text-primary mb-4">
              <span className="text-2xl font-bold">{formatCurrency(offer.discountedPrice)}</span>
              <span className="ml-2 line-through text-muted-foreground">{formatCurrency(offer.originalPrice)}</span>
              <Badge className="ml-2 bg-primary/20 text-primary border-none">
                SAVE {offer.discount}%
              </Badge>
            </div>
          ) : offer.promoCode ? (
            <div className="flex items-center mb-4">
              <span className="text-lg font-bold">Use Code:</span>
              <span className="ml-2 bg-background text-primary px-3 py-1 rounded border border-primary/50 font-mono">
                {offer.promoCode}
              </span>
            </div>
          ) : null}
          
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {offer.originalPrice ? "Order Now" : "Apply & Order"}
          </Button>
        </div>
        <div className="md:w-1/3">
          <img 
            src={offer.imageUrl} 
            alt={offer.title} 
            className="w-full h-40 md:h-48 object-cover rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
}

function OfferCardSkeleton() {
  return (
    <Card className="bg-gradient-to-r from-card to-muted rounded-lg overflow-hidden shadow-lg p-6 border border-primary/30">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="md:w-1/3">
          <Skeleton className="w-full h-40 md:h-48 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

function CocktailIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M8 21h8m-4-4v4m-7-13l5.877-5.877A2 2 0 0 1 11.292 2h1.414a2 2 0 0 1 1.415.623L20 8H4" />
      <path d="M19 7l-3 9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L5 7" />
    </svg>
  );
}
