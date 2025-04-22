import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  barId: z.string({ required_error: "Please select a bar" }),
  position: z.string().min(2, { message: "Please enter your position" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

export default function PartnerAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/partner/dashboard");
    return null;
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      barId: "",
      position: "",
      phone: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await loginMutation.mutateAsync(values);
      toast({
        title: "Login successful",
        description: "Welcome back to the Partner Dashboard",
      });
      setLocation("/partner/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const registrationData = {
        ...values,
        role: "partner",
        barId: parseInt(values.barId),
      };
      
      await registerMutation.mutateAsync(registrationData);
      toast({
        title: "Registration successful",
        description: "Your partner account is pending approval by our team. You'll be notified once approved.",
      });
      setLocation("/partner/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center w-full max-w-md p-8 bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Partner Portal</h1>
          <p className="text-muted-foreground">
            Access your bar's dashboard to manage cocktails, promotions, and orders.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Partner Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your partner dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Partner Registration</CardTitle>
                <CardDescription>
                  Register your bar to start managing cocktails and promotions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="barId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Your Bar</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your bar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">The Nightcap Lounge</SelectItem>
                              <SelectItem value="2">Copper & Brew</SelectItem>
                              <SelectItem value="3">Aperitivo Social</SelectItem>
                              <SelectItem value="4">The Botanist's Garden</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bar Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 555-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registering..." : "Register"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <p>
                  Note: New partner accounts require approval before full access is granted.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-col justify-center items-center w-full p-12 bg-gradient-to-br from-primary/5 to-primary/20">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold mb-6">Partner Dashboard</h1>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Manage Cocktails</h3>
              <p>Add, update, and showcase your bar's signature cocktails to attract new customers.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Run Promotions</h3>
              <p>Create special offers and promotions to increase sales and customer engagement.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Track Orders</h3>
              <p>Manage and fulfill orders in real-time with detailed tracking and analytics.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
              <p>Get insights on your best-selling cocktails and revenue performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}