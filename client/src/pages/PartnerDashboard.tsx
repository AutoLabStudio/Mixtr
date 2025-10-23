import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Package, Tag, CalendarCheck, ChevronRight, TrendingUp } from "lucide-react";
import { Promotion, Cocktail, Order, CartItem } from "@shared/schema";

type OrderWithItems = Order & { items: CartItem[] };

type Analytics = {
  totalRevenue: number;
  totalOrders: number;
  activePromotions: number;
  totalCocktails: number;
  popularCocktails: Array<{ name: string; sales: number; count: number }>;
};

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/partner/auth");
    } else if (user.role !== "partner") {
      toast({
        title: "Access Denied",
        description: "This area is only accessible to bar partners",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, setLocation, toast]);

  // Fetch partner details
  const { data: partnerData, isLoading: isLoadingPartner } = useQuery({
    queryKey: ["/api/partner/current"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/partner/current");
        if (!res.ok) {
          if (res.status === 403) {
            toast({
              title: "Pending Approval",
              description: "Your partner account is still waiting for approval",
              variant: "destructive",
            });
            return null;
          }
          throw new Error("Failed to fetch partner data");
        }
        return await res.json();
      } catch (error) {
        console.error("Error fetching partner data:", error);
        return null;
      }
    },
    enabled: !!user,
  });

  // Fetch bar's cocktails
  const { data: cocktails = [] } = useQuery<Cocktail[]>({
    queryKey: ["/api/partner/cocktails"],
    queryFn: async () => {
      const res = await fetch("/api/partner/cocktails");
      if (!res.ok) {
        throw new Error("Failed to fetch cocktails");
      }
      return res.json();
    },
    enabled: !!partnerData,
  });

  // Fetch bar's promotions
  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/partner/promotions"],
    queryFn: async () => {
      const res = await fetch("/api/partner/promotions");
      if (!res.ok) {
        throw new Error("Failed to fetch promotions");
      }
      return res.json();
    },
    enabled: !!partnerData,
  });

  // Fetch bar's orders
  const { data: orders = [] } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/partner/orders"],
    queryFn: async () => {
      const res = await fetch("/api/partner/orders");
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      return res.json();
    },
    enabled: !!partnerData,
  });

  // Fetch bar's analytics
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery<Analytics>({
    queryKey: ["/api/partner/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/partner/analytics");
      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return res.json();
    },
    enabled: !!partnerData,
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading state
  if (isLoadingPartner || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading partner dashboard...</div>
      </div>
    );
  }

  // Partner account pending approval
  if (!partnerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Account Pending Approval</CardTitle>
            <CardDescription>
              Your partner account is waiting for administrator approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Thank you for registering as a partner. Our team needs to verify your account before you can access the partner dashboard. This usually takes 1-2 business days.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setLocation("/")}>
                Return Home
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { partner, bar } = partnerData;
  
  // Sort orders by newest first
  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Active promotions
  const activePromotions = promotions.filter(promo => {
    const now = new Date();
    return promo.active && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary/10 border-b">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{bar?.name} Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.username} ({partner.position})</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Main Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${isLoadingAnalytics ? "..." : analytics?.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From cocktail deliveries
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingAnalytics ? "..." : analytics?.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From {orders.length} customers
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingAnalytics ? "..." : analytics?.activePromotions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {promotions.length} total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cocktails</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingAnalytics ? "..." : analytics?.totalCocktails}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available on the platform
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {/* Recent Orders */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders for your cocktails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {sortedOrders.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No orders yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {sortedOrders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={order.status === "delivered" ? "default" : order.status === "pending" ? "outline" : "secondary"}>
                                {order.status}
                              </Badge>
                              <p className="text-sm mt-1">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Popular Cocktails */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Popular Cocktails</CardTitle>
                  <CardDescription>
                    Your best-selling drinks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {!analytics?.popularCocktails || analytics.popularCocktails.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No sales data available yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {analytics.popularCocktails.map((cocktail, index) => (
                          <div key={index} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
                                {index + 1}
                              </div>
                              <p className="font-medium">{cocktail.name}</p>
                            </div>
                            <p className="font-medium">{cocktail.count} orders</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cocktails Tab */}
          <TabsContent value="cocktails">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Cocktails</CardTitle>
                  <CardDescription>
                    Manage your bar's cocktail menu
                  </CardDescription>
                </div>
                <Button>
                  Add New Cocktail
                </Button>
              </CardHeader>
              <CardContent>
                {cocktails.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No cocktails available yet</p>
                    <Button>Add Your First Cocktail</Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cocktails.map((cocktail) => (
                      <Card key={cocktail.id}>
                        <CardHeader className="p-4 pb-2">
                          <div className="aspect-video rounded-md overflow-hidden mb-2">
                            <img 
                              src={cocktail.imageUrl} 
                              alt={cocktail.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardTitle className="text-lg">{cocktail.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {cocktail.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium">${cocktail.price.toFixed(2)}</p>
                            <Button size="sm" variant="outline">
                              Edit <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Promotions</CardTitle>
                  <CardDescription>
                    Create special offers and discounts
                  </CardDescription>
                </div>
                <Button>
                  Create New Promotion
                </Button>
              </CardHeader>
              <CardContent>
                {promotions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No promotions available yet</p>
                    <Button>Create Your First Promotion</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Active Promotions</h3>
                      <Badge>{activePromotions.length} active</Badge>
                    </div>
                    {activePromotions.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No active promotions</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {activePromotions.map((promo) => (
                          <Card key={promo.id} className="border-primary/20">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{promo.title}</CardTitle>
                                <Badge>Active</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-sm mb-2 line-clamp-2">{promo.description}</p>
                              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center">
                                  <CalendarCheck className="mr-1 h-3 w-3" />
                                  <span>
                                    {new Date(promo.startDate).toLocaleDateString()} to {new Date(promo.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {promo.discountPercentage && (
                                  <Badge variant="outline">{promo.discountPercentage}% off</Badge>
                                )}
                                {promo.discountAmount && (
                                  <Badge variant="outline">${promo.discountAmount} off</Badge>
                                )}
                                {promo.promoCode && (
                                  <Badge variant="secondary">Code: {promo.promoCode}</Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-end">
                                <Button size="sm" variant="outline">
                                  Edit <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    <Separator className="my-6" />

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Inactive/Upcoming Promotions</h3>
                    </div>
                    {promotions.length - activePromotions.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No inactive promotions</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {promotions
                          .filter(promo => !activePromotions.includes(promo))
                          .map((promo) => (
                            <Card key={promo.id} className="border-muted/40">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{promo.title}</CardTitle>
                                  <Badge variant="outline">
                                    {new Date(promo.startDate) > new Date() ? "Upcoming" : "Expired"}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                <p className="text-sm mb-2 line-clamp-2">{promo.description}</p>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center">
                                    <CalendarCheck className="mr-1 h-3 w-3" />
                                    <span>
                                      {new Date(promo.startDate).toLocaleDateString()} to {new Date(promo.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {promo.discountPercentage && (
                                    <Badge variant="outline">{promo.discountPercentage}% off</Badge>
                                  )}
                                  {promo.discountAmount && (
                                    <Badge variant="outline">${promo.discountAmount} off</Badge>
                                  )}
                                  {promo.promoCode && (
                                    <Badge variant="secondary">Code: {promo.promoCode}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <Button size="sm" variant="ghost" className="text-destructive">
                                    Delete
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Edit <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
                <CardDescription>
                  Track and update orders from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sortedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders available yet</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 p-4 font-medium bg-muted/40">
                      <div className="col-span-2">Order ID</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-3">Items</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    
                    <ScrollArea className="h-[500px]">
                      {sortedOrders.map((order) => (
                        <div key={order.id} className="grid grid-cols-12 p-4 border-t items-center">
                          <div className="col-span-2 font-medium">#{order.id}</div>
                          <div className="col-span-2 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="col-span-3">
                            <ScrollArea className="h-20">
                              <div className="space-y-1">
                                {order.items.filter((item) => 'barId' in item).map((item, idx) => (
                                  <div key={idx} className="text-sm">
                                    {item.quantity}x {item.name}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                          <div className="col-span-2 font-medium">
                            ${order.total.toFixed(2)}
                          </div>
                          <div className="col-span-2">
                            <Badge variant={order.status === "delivered" ? "default" : order.status === "pending" ? "outline" : "secondary"}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="col-span-1 text-right">
                            <Button size="sm">Update</Button>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}