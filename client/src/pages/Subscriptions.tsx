import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";
import { Subscription } from "@shared/schema";
import { formatCurrency, generateUserId } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type SubscriptionWithPreferences = Subscription & {
  preferences: {
    spirits: string[];
    flavors: string[];
  };
};

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const userId = generateUserId();
  const { data: subscriptions, isLoading } = useQuery<SubscriptionWithPreferences[]>({
    queryKey: ['/api/subscriptions'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: userSubscriptions } = useQuery<SubscriptionWithPreferences[]>({
    queryKey: [`/api/user/${userId}/subscriptions`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const [frequency, setFrequency] = useState<string>("monthly");
  const [selectedSpirits, setSelectedSpirits] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const handleSpiritChange = (spirit: string) => {
    setSelectedSpirits(prev => 
      prev.includes(spirit) 
        ? prev.filter(s => s !== spirit) 
        : [...prev, spirit]
    );
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev => 
      prev.includes(flavor) 
        ? prev.filter(f => f !== flavor) 
        : [...prev, flavor]
    );
  };

  const handleSubscribe = async (subscription: SubscriptionWithPreferences) => {
    try {
      // Create custom subscription based on user preferences
      const customSubscription = {
        ...subscription,
        userId,
        preferences: {
          spirits: selectedSpirits.length > 0 ? selectedSpirits : subscription.preferences.spirits,
          flavors: selectedFlavors.length > 0 ? selectedFlavors : subscription.preferences.flavors
        },
        frequency: frequency || subscription.frequency,
        nextDeliveryDate: new Date(Date.now() + (frequency === "weekly" ? 7 : frequency === "biweekly" ? 14 : 30) * 24 * 60 * 60 * 1000)
      };

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customSubscription)
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      toast({
        title: "Subscription Created!",
        description: `Your ${subscription.name} subscription will be delivered ${frequency}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Cocktail Subscriptions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden flex flex-col h-full opacity-60 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
            <CardHeader>
              <CardTitle className="h-7 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></CardTitle>
              <CardDescription className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md mt-2"></CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Cocktail Subscriptions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Get premium cocktails delivered right to your door on a regular schedule.
        Customize your preferences and enjoy crafted drinks at home.
      </p>

      {userSubscriptions && userSubscriptions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Active Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSubscriptions.map((sub) => (
              <Card key={sub.id} className="overflow-hidden flex flex-col h-full border-primary/20">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                  <img 
                    src={sub.imageUrl} 
                    alt={sub.name} 
                    className="w-full h-full object-cover" 
                  />
                  {sub.active ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                      Active
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 text-xs rounded-full">
                      Inactive
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{sub.name}</CardTitle>
                  <CardDescription>{sub.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Price:</span> {formatCurrency(sub.price)}/{sub.frequency}</div>
                    <div><span className="font-medium">Next Delivery:</span> {new Date(sub.nextDeliveryDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Preferred Spirits:</span> {sub.preferences.spirits.join(', ')}</div>
                    <div><span className="font-medium">Preferred Flavors:</span> {sub.preferences.flavors.join(', ')}</div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      fetch(`/api/subscriptions/${sub.id}/cancel`, { method: 'POST' })
                        .then(() => {
                          toast({
                            title: "Subscription Cancelled",
                            description: "Your subscription has been cancelled.",
                          });
                        });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => {
                      // Navigate to update page or open modal
                    }}
                  >
                    Update
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Customize Your Experience</h2>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Delivery Frequency</h3>
            <RadioGroup value={frequency} onValueChange={setFrequency} className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly">Biweekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Spirit Preferences</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Whiskey", "Vodka", "Gin", "Tequila", "Rum", "Bourbon"].map(spirit => (
                  <div key={spirit} className="flex items-center space-x-2">
                    <Checkbox 
                      id={spirit.toLowerCase()} 
                      checked={selectedSpirits.includes(spirit.toLowerCase())}
                      onCheckedChange={() => handleSpiritChange(spirit.toLowerCase())}
                    />
                    <Label htmlFor={spirit.toLowerCase()}>{spirit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Flavor Preferences</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Sweet", "Bitter", "Sour", "Spicy", "Herbal", "Fruity"].map(flavor => (
                  <div key={flavor} className="flex items-center space-x-2">
                    <Checkbox 
                      id={flavor.toLowerCase()} 
                      checked={selectedFlavors.includes(flavor.toLowerCase())}
                      onCheckedChange={() => handleFlavorChange(flavor.toLowerCase())}
                    />
                    <Label htmlFor={flavor.toLowerCase()}>{flavor}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Available Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions && subscriptions.map((subscription) => (
          <Card key={subscription.id} className="overflow-hidden flex flex-col h-full">
            <div className="h-48 relative">
              <img 
                src={subscription.imageUrl} 
                alt={subscription.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-white font-bold text-2xl">
                  {formatCurrency(subscription.price)}/{subscription.frequency}
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{subscription.name}</CardTitle>
              <CardDescription>{subscription.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm">
                <div className="mb-2">
                  <span className="font-medium">Includes:</span>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Premium Cocktails</li>
                    <li>Recipe Cards</li>
                    <li>Free Delivery</li>
                    <li>Custom Preferences</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Default Spirits:</span> {subscription.preferences.spirits.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Default Flavors:</span> {subscription.preferences.flavors.join(', ')}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(subscription)}
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-primary/5 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Why Subscribe?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M8 18v-1"></path><path d="M16 18v-3"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Curated Selection</h3>
            <p className="text-muted-foreground">Our mixologists handpick premium cocktails based on your preferences.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Flexible Delivery</h3>
            <p className="text-muted-foreground">Choose from weekly, biweekly, or monthly deliveries. Cancel anytime.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">Expertly crafted cocktails from top-tier bars, delivered fresh to your door.</p>
          </div>
        </div>
      </div>
    </div>
  );
}