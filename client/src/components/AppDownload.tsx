import { Button } from "@/components/ui/button";

export function AppDownload() {
  return (
    <section className="py-16 bg-background relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616187347619-9392ea59bbae?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-card/90 to-muted/90 backdrop-blur-sm rounded-xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">Get the Mixtr App</h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>
              <p className="text-muted-foreground mb-8">
                Download our app for the best cocktail delivery experience. Track your order in real-time, 
                discover new cocktails, and reorder your favorites with just a tap.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-3 h-auto"
                >
                  <AppleIcon className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <span className="text-xs block">Download on the</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                </Button>
                
                <Button 
                  className="bg-black hover:bg-gray-900 text-white font-medium px-6 py-3 h-auto"
                >
                  <GooglePlayIcon className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <span className="text-xs block">Get it on</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-4.0.3" 
                  alt="Mixtr App" 
                  className="rounded-xl shadow-2xl border-4 border-background h-80 object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
                  <MobileIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppleIcon({ className }: { className?: string }) {
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
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

function GooglePlayIcon({ className }: { className?: string }) {
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
      <polygon points="3 3 21 12 3 21" />
      <line x1="13" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function MobileIcon({ className }: { className?: string }) {
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
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
