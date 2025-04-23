import { Button } from "@/components/ui/button";
import { GlassWater, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3')] bg-cover bg-center opacity-30 z-[-1]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-16 pb-12 md:pt-20 md:pb-20 text-center">
          <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Top Shelf <span className="text-primary">Cocktails</span><br />
            Delivered to Your Door
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Premium cocktails from the best bars in your city, delivered to wherever you are.
          </p>
          <div className="mt-10 md:flex md:justify-center md:space-x-8 space-y-4 md:space-y-0">
            <Button 
              size="lg" 
              className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => window.location.href = "/cocktails"}
            >
              <GlassWater className="mr-2 h-5 w-5" /> Browse Cocktails
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full md:w-auto border-primary text-primary hover:bg-primary/10"
              onClick={() => window.location.href = "/bars"}
            >
              <MapPin className="mr-2 h-5 w-5" /> Find Nearby Bars
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
