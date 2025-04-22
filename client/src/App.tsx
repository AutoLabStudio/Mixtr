import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cocktail from "@/pages/Cocktail";
import Bar from "@/pages/Bar";
import Bars from "@/pages/Bars";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Subscriptions from "@/pages/Subscriptions";
import MixologyClasses from "@/pages/MixologyClasses";
import LoyaltyProgram from "@/pages/LoyaltyProgram";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cocktails/:id" component={Cocktail} />
      <Route path="/bars" component={Bars} />
      <Route path="/bars/:id" component={Bar} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:id" component={OrderConfirmation} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/mixology-classes" component={MixologyClasses} />
      <Route path="/loyalty-program" component={LoyaltyProgram} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <CartSidebar />
            <Toaster />
          </div>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
