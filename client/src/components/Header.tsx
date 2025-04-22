import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { cart, toggleCart } = useCart();
  const { user, logoutMutation } = useAuth();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const navLinks = [
    { name: "Featured", href: "/#featured" },
    { name: "Top Bars", href: "/#bars" },
    { name: "Subscriptions", href: "/subscriptions", highlight: true },
    { name: "Mixology Classes", href: "/mixology-classes", highlight: true },
    { name: "Loyalty Program", href: "/loyalty-program", highlight: true }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="font-serif font-bold text-2xl text-foreground cursor-pointer">
                Mixtr<span className="text-primary">.</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors px-3 py-2 text-sm font-medium ${
                  link.highlight 
                    ? "text-primary hover:text-primary/80 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary/30 after:rounded-full" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
                {link.highlight && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                )}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative mr-2 text-muted-foreground hover:text-primary"
              onClick={toggleCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 text-base font-medium transition-colors relative ${
                  link.highlight 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                {link.highlight && (
                  <span className="inline-block ml-2 h-2 w-2 bg-primary rounded-full"></span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
