import { Link } from "wouter";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <span className="font-serif font-bold text-2xl cursor-pointer">
                Mixtr<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-4">
              Top shelf cocktails from the best bars in the city delivered to your door.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a 
                  href="/#featured" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Featured Cocktails
                </a>
              </li>
              <li>
                <a 
                  href="/#bars" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Partner Bars
                </a>
              </li>
              <li>
                <a 
                  href="/#specials" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Special Offers
                </a>
              </li>
              <li>
                <a 
                  href="/#about" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Delivery Areas
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="text-primary mr-2 mt-1 h-4 w-4" />
                <span className="text-muted-foreground">hello@mixtrdelivery.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-primary mr-2 mt-1 h-4 w-4" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="text-primary mr-2 mt-1 h-4 w-4" />
                <span className="text-muted-foreground">
                  123 Cocktail Ave, Downtown<br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {year} Mixtr. All rights reserved. Must be 21+ to order. Please drink responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
