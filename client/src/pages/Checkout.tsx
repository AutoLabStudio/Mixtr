import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, generateUserId } from "@/lib/utils";
import { Helmet } from "react-helmet";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["credit", "paypal"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 4.99 : 0;
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const total = subtotal + deliveryFee + tax;
  
  // Get the current date/time plus 1 hour for delivery time
  const deliveryTime = new Date();
  deliveryTime.setHours(deliveryTime.getHours() + 1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      deliveryInstructions: "",
      paymentMethod: "credit",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add some cocktails to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a simplified address string
      const deliveryAddress = `${data.address}, ${data.city}, ${data.zipCode}`;
      
      // Generate a random user ID for demo purposes
      const userId = generateUserId();
      
      // Create order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        userId,
        items: cart,
        subtotal,
        deliveryFee,
        total,
        status: "pending",
        deliveryAddress,
        deliveryTime: deliveryTime.toISOString(),
      });
      
      const order = await orderResponse.json();
      
      // Clear the cart
      clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${order.id}`);
      
      toast({
        title: "Order Placed Successfully",
        description: "Your cocktails are on the way!",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Checkout - Mixtr</title>
        <meta name="description" content="Complete your order and get premium cocktails delivered to your door" />
      </Helmet>
      
      <div className="pt-24 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-8">Checkout</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-serif mb-4">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some cocktails to your cart before proceeding to checkout.
              </p>
              <Button asChild>
                <a href="/#featured">Browse Cocktails</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="p-6">
                      <h2 className="font-serif font-semibold text-xl mb-4">Delivery Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your@email.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, Apt 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="deliveryInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Ring bell, leave at door, etc."
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                    
                    <Card className="p-6">
                      <h2 className="font-serif font-semibold text-xl mb-4">Payment Method</h2>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-3"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="credit" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Credit/Debit Card
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="paypal" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    PayPal
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("paymentMethod") === "credit" && (
                        <div className="mt-4 p-4 border rounded-md bg-muted/50">
                          <p className="text-sm text-muted-foreground">
                            This is a demo app. No actual payment will be processed.
                          </p>
                        </div>
                      )}
                    </Card>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </form>
                </Form>
              </div>
              
              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="font-serif font-semibold text-xl mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  <div className="mt-6 p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium text-sm mb-2">Estimated Delivery</h3>
                    <p className="text-muted-foreground text-sm">
                      {deliveryTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })} - {new Date(deliveryTime.getTime() + 30 * 60000).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
