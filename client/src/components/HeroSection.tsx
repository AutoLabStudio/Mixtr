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
            <a 
              href="/cocktails"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8 w-full md:w-auto"
            >
              <GlassWater className="mr-2 h-5 w-5" /> Browse Cocktails
            </a>
            <a 
              href="/bars"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary bg-background text-primary hover:bg-primary/10 h-11 px-8 w-full md:w-auto"
            >
              <MapPin className="mr-2 h-5 w-5" /> Find Nearby Bars
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
