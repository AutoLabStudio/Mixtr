import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in",
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Remove passwordConfirm before submission 
      const { passwordConfirm, ...userData } = values;
      await registerMutation.mutateAsync(userData);
      toast({
        title: "Registration successful!",
        description: "Your account has been created",
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // If user is already logged in, don't show this page
  if (user) return null;

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-6xl px-4 mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome to Mixtr</CardTitle>
              <CardDescription>
                Sign in to access cocktail delivery, subscriptions, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your username"
                                {...field}
                                autoComplete="username"
                              />
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
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                                autoComplete="current-password"
                              />
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
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Choose a username"
                                {...field}
                                autoComplete="username"
                              />
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
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                {...field}
                                autoComplete="email"
                              />
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
                              <Input
                                type="password"
                                placeholder="Create a password"
                                {...field}
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm your password"
                                {...field}
                                autoComplete="new-password"
                              />
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
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full text-center text-sm text-muted-foreground">
                <a href="/partner/auth" className="underline hover:text-primary">
                  Bar Owners: Click here to access Partner Portal
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Hero Section */}
        <div className="text-center md:text-left md:pr-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Premium Cocktails Delivered to Your Door
          </h1>
          <p className="text-muted-foreground">
            Join Mixtr and enjoy handcrafted cocktails from the best bars in your city, delivered right to your doorstep. Become a member today to unlock exclusive access to premium subscriptions, mixology classes, and loyalty rewards.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-1">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">Enjoy cocktails from award-winning bartenders and mixologists</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-1">Convenient Delivery</h3>
              <p className="text-sm text-muted-foreground">Scheduled or on-demand delivery right to your door</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-1">Subscription Boxes</h3>
              <p className="text-sm text-muted-foreground">Regularly receive new and exciting cocktails to try</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium mb-1">Loyalty Program</h3>
              <p className="text-sm text-muted-foreground">Earn points with every purchase for exclusive rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}