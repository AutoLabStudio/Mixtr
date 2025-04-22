import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MapPin, ArrowRight, Home, BarChart, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, calculateETA, getOrderStatusSteps } from "@/lib/utils";
import { OrderTracker } from "@/components/OrderTracker";
import type { Order } from "@shared/schema";

export default function OrderConfirmation() {
  const { id } = useParams();
  const parsedId = id ? parseInt(id) : undefined;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("standard");
  
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: [`/api/orders/${parsedId}`],
    enabled: !!parsedId,
  });
  
  if (error) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Error Loading Order</h2>
        <p className="text-muted-foreground mb-8">Failed to load order details. Please try again later.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return <OrderConfirmationSkeleton />;
  }
  
  if (!order) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  const statusInfo = getOrderStatusSteps(order.status);
  const eta = calculateETA(order.items[0]?.deliveryTime || "30-40 min");
  
  return (
    <>
      <Helmet>
        <title>Order Confirmation - Mixtr</title>
        <meta name="description" content="Your order has been confirmed" />
      </Helmet>
      
      <div className="pt-24 pb-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Order #{order.id} has been placed and is being prepared.
            </p>
          </div>
          
          <div className="mb-8">
            <Tabs 
              defaultValue="standard" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="standard" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" /> Standard View
                </TabsTrigger>
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Live Tracking
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <Card className="overflow-hidden">
                  <div className="bg-muted p-6">
                    <h2 className="font-serif font-semibold text-xl mb-4">Order Status</h2>
                    
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                      {["pending", "confirmed", "preparing", "in_transit", "delivered"].map((status, index) => {
                        const isActive = statusInfo.step >= index;
                        return (
                          <div key={status} className="relative mb-6 last:mb-0">
                            <div className="flex items-center">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center z-10 ${
                                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                              }`}>
                                {index === 0 && <Clock className="h-5 w-5" />}
                                {index === 1 && <Check className="h-5 w-5" />}
                                {index === 2 && <div className="h-5 w-5 flex items-center justify-center">
                                  <span className="text-xs font-medium">MIX</span>
                                </div>}
                                {index === 3 && <div className="h-5 w-5 rotate-45">
                                  <ArrowRight className="h-5 w-5" />
                                </div>}
                                {index === 4 && <Home className="h-5 w-5" />}
                              </div>
                              <div className="ml-4 flex-1">
                                <p className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {index === 0 && "Order Placed"}
                                  {index === 1 && "Order Confirmed"}
                                  {index === 2 && "Preparing Cocktails"}
                                  {index === 3 && "Out for Delivery"}
                                  {index === 4 && "Delivered"}
                                </p>
                                {index === statusInfo.step && (
                                  <p className="text-sm text-muted-foreground">
                                    {status === "pending" && "We've received your order and are processing it"}
                                    {status === "confirmed" && "Your order has been confirmed and payment processed"}
                                    {status === "preparing" && "Our mixologists are preparing your cocktails"}
                                    {status === "in_transit" && "Your cocktails are on the way"}
                                    {status === "delivered" && "Enjoy your cocktails!"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Estimated Delivery</h3>
                        <div className="flex items-center text-lg font-semibold">
                          <Clock className="mr-2 h-5 w-5 text-primary" />
                          <span>{eta}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Delivery Address</h3>
                        <div className="flex items-start">
                          <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{order.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="live">
                {user ? (
                  <OrderTracker userId={user.id.toString()} orderId={order.id} />
                ) : (
                  <Card className="p-6 text-center">
                    <h3 className="font-medium mb-2">Login Required</h3>
                    <p className="text-muted-foreground mb-4">
                      You need to be logged in to use the real-time order tracking feature.
                    </p>
                    <Button asChild>
                      <Link href="/auth">Login or Register</Link>
                    </Button>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="font-serif font-semibold text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded bg-muted overflow-hidden mr-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.barName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>{formatCurrency(item.price)}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <Button variant="outline">
              <a href={`mailto:support@mixtrdelivery.com?subject=Order%20${order.id}%20Support`}>
                Need Help?
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function OrderConfirmationSkeleton() {
  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-10 w-60 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>
        
        <Card className="overflow-hidden mb-8">
          <div className="bg-muted p-6">
            <Skeleton className="h-8 w-40 mb-4" />
            
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
              
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="mb-8">
          <div className="p-6">
            <Skeleton className="h-8 w-40 mb-4" />
            
            <div className="space-y-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded mr-3" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
            
            <Skeleton className="h-px w-full mb-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
