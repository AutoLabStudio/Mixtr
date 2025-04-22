import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";
import { MixologyClass } from "@shared/schema";
import { formatCurrency, generateUserId } from "@/lib/utils";

export default function MixologyClassesPage() {
  const { toast } = useToast();
  const userId = generateUserId();
  const [selectedClass, setSelectedClass] = useState<MixologyClass | null>(null);
  const [address, setAddress] = useState("");
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [classType, setClassType] = useState<"virtual" | "in-person">("virtual");

  const { data: classes, isLoading } = useQuery({
    queryKey: ['/api/mixology-classes/upcoming'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: userEnrollments, refetch: refetchEnrollments } = useQuery({
    queryKey: [`/api/user/${userId}/class-enrollments`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const handleEnroll = async () => {
    if (!selectedClass || !address) return;

    try {
      const enrollmentData = {
        userId,
        classId: selectedClass.id,
        status: "confirmed",
        // For virtual classes, this is the delivery address
        // For in-person classes, this is contact information
        deliveryAddress: address,
        // Include the class type to differentiate between virtual and in-person
        classType
      };

      const response = await fetch('/api/mixology-classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in class');
      }

      if (classType === "virtual") {
        toast({
          title: "Enrollment Successful!",
          description: `You have been enrolled in ${selectedClass.title}. Your ingredients kit will be delivered to your address before the class.`,
        });
      } else {
        toast({
          title: "Reservation Confirmed!",
          description: `Your spot has been reserved for ${selectedClass.title} at ${selectedClass.bar?.name}. Please arrive 15 minutes early.`,
        });
      }
      
      setEnrollmentDialogOpen(false);
      refetchEnrollments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in class. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Mixology Classes</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
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

  // Format date for display
  const formatClassDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Mixology Classes</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Learn the art of mixology from expert bartenders. Choose between virtual classes with 
        home-delivered ingredient kits or in-person sessions at our partner bars.
      </p>
      
      <Tabs defaultValue="virtual" className="mb-8" onValueChange={(value) => setClassType(value as "virtual" | "in-person")}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="virtual">Virtual Classes</TabsTrigger>
          <TabsTrigger value="in-person">In-Person Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="virtual" className="mt-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Virtual Classes</h3>
            <p>Interactive online classes with ingredient kits delivered to your home. Perfect for learning at your own pace.</p>
          </div>
        </TabsContent>
        <TabsContent value="in-person" className="mt-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">In-Person Classes</h3>
            <p>Hands-on classes at our partner bars with professional mixologists. Experience the atmosphere of a real cocktail bar.</p>
          </div>
        </TabsContent>
      </Tabs>

      {userEnrollments && userEnrollments.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Upcoming Classes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userEnrollments.map((enrollment: any) => (
              <Card key={enrollment.id} className="overflow-hidden flex flex-col h-full border-primary/20">
                <div className="h-48 relative">
                  <img 
                    src={enrollment.class.imageUrl} 
                    alt={enrollment.class.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{enrollment.class.level}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{enrollment.class.title}</CardTitle>
                  <CardDescription>{enrollment.class.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Date & Time:</span> {formatClassDate(enrollment.class.date)}</div>
                    <div><span className="font-medium">Duration:</span> {enrollment.class.duration} minutes</div>
                    <div><span className="font-medium">Instructor:</span> {enrollment.class.instructorName}</div>
                    <div><span className="font-medium">Status:</span> {enrollment.status}</div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-1">Ingredients Kit:</h4>
                      <ul className="list-disc pl-5">
                        {enrollment.class.ingredients.map((ingredient: any, index: number) => (
                          <li key={index}>{ingredient.name} ({ingredient.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => {
                      if (enrollment.class.videoUrl) {
                        window.open(enrollment.class.videoUrl, '_blank');
                      } else {
                        toast({
                          title: "Class Not Started",
                          description: "The video link will be available when the class starts.",
                        });
                      }
                    }}
                  >
                    Join Class
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Upcoming Classes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes && classes.map((mixologyClass: MixologyClass) => {
          const isEnrolled = userEnrollments && userEnrollments.some((e: any) => e.classId === mixologyClass.id);
          const isFull = mixologyClass.enrolled >= mixologyClass.capacity;
          
          return (
            <Card key={mixologyClass.id} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 relative">
                <img 
                  src={mixologyClass.imageUrl} 
                  alt={mixologyClass.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant="secondary">{mixologyClass.level}</Badge>
                  {isFull && <Badge variant="destructive">Full</Badge>}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-white font-bold text-2xl">
                    {formatCurrency(mixologyClass.price)}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{mixologyClass.title}</CardTitle>
                <CardDescription>{mixologyClass.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm space-y-2">
                  <div><span className="font-medium">Date & Time:</span> {formatClassDate(mixologyClass.date)}</div>
                  <div><span className="font-medium">Instructor:</span> {mixologyClass.instructorName}</div>
                  <div><span className="font-medium">Duration:</span> {mixologyClass.duration} minutes</div>
                  <div><span className="font-medium">Bar:</span> {mixologyClass.bar?.name}</div>
                  <div><span className="font-medium">Spots Left:</span> {mixologyClass.capacity - (mixologyClass.enrolled || 0)} of {mixologyClass.capacity}</div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Ingredients Kit Includes:</h4>
                    <ul className="list-disc pl-5">
                      {mixologyClass.ingredients.map((ingredient: any, index: number) => (
                        <li key={index}>{ingredient.name} ({ingredient.quantity})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={enrollmentDialogOpen && selectedClass?.id === mixologyClass.id} onOpenChange={setEnrollmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      disabled={isEnrolled || isFull}
                      onClick={() => setSelectedClass(mixologyClass)}
                    >
                      {isEnrolled ? "Already Enrolled" : isFull ? "Class Full" : "Enroll Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enroll in {selectedClass?.title}</DialogTitle>
                      <DialogDescription>
                        {classType === "virtual"
                          ? "Complete your enrollment to receive the ingredients kit and access to the virtual class."
                          : "Complete your enrollment to reserve your spot at the bar for this in-person class."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Tabs defaultValue={classType} onValueChange={(value) => setClassType(value as "virtual" | "in-person")}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="virtual">Virtual Class</TabsTrigger>
                            <TabsTrigger value="in-person">In-Person Class</TabsTrigger>
                          </TabsList>
                          <TabsContent value="virtual" className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="deliveryAddress">Delivery Address</Label>
                              <Textarea 
                                id="deliveryAddress" 
                                placeholder="Enter your full address for ingredients delivery" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Your ingredients kit will be delivered 1-2 days before the class date.
                                You will receive an email with the class access link before the start time.
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="in-person" className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="contactInfo">Contact Information</Label>
                              <Textarea 
                                id="contactInfo" 
                                placeholder="Enter your phone number and any special requests" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Please arrive 15 minutes before the class starts. The bartender will have
                                all ingredients and equipment prepared for your session.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEnrollmentDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleEnroll}>Confirm Enrollment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 bg-primary/5 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">The Mixology Class Experience</h2>
        
        <Tabs defaultValue={classType} onValueChange={(value) => setClassType(value as "virtual" | "in-person")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="virtual">Virtual</TabsTrigger>
            <TabsTrigger value="in-person">In-Person</TabsTrigger>
          </TabsList>
          
          <TabsContent value="virtual">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"></path><path d="M6 9.01V9"></path><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Ingredient Kits Delivered</h3>
                <p className="text-muted-foreground">We deliver all the premium ingredients you need straight to your door.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Live Interactive Sessions</h3>
                <p className="text-muted-foreground">Join live online sessions where you can ask questions and get real-time feedback.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path><path d="M8 9h8"></path><path d="M8 15h8"></path><path d="M12 9v6"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Learn at Your Pace</h3>
                <p className="text-muted-foreground">Access recordings for 30 days after the live class to practice at your convenience.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="in-person">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Premium Bar Experience</h3>
                <p className="text-muted-foreground">Enjoy the atmosphere of our exclusive partner bars with professional setups.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Hands-On Training</h3>
                <p className="text-muted-foreground">Get personalized guidance and feedback directly from professional mixologists.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" x2="6" y1="2" y2="4"></line><line x1="10" x2="10" y1="2" y2="4"></line><line x1="14" x2="14" y1="2" y2="4"></line></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Taste as You Learn</h3>
                <p className="text-muted-foreground">Sample premium spirits and ingredients as you learn to craft perfect cocktails.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <Tabs defaultValue={classType}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="virtual">Virtual Classes</TabsTrigger>
            <TabsTrigger value="in-person">In-Person Classes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="virtual" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">What equipment do I need?</h3>
              <p className="text-muted-foreground">Basic bar tools like a shaker, strainer, and jigger are recommended but not required. We'll suggest alternatives if you don't have specific equipment.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">When will I receive my ingredients?</h3>
              <p className="text-muted-foreground">Ingredient kits are delivered 1-2 days before your scheduled class to ensure freshness.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Can I access the class recording afterward?</h3>
              <p className="text-muted-foreground">Yes, all class recordings are available for 30 days after the live session for enrolled students.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">What if I need to reschedule?</h3>
              <p className="text-muted-foreground">You can reschedule a virtual class up to 48 hours before it starts. Please contact customer service for assistance.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="in-person" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">What's included in the class fee?</h3>
              <p className="text-muted-foreground">All ingredients, equipment usage, professional instruction, and tasting of several cocktails are included in the price. Food is available for purchase separately.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">How early should I arrive?</h3>
              <p className="text-muted-foreground">We recommend arriving 15 minutes before your scheduled class to check in and get settled at your station.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Are there age restrictions?</h3>
              <p className="text-muted-foreground">In-person classes are restricted to participants 21 years and older. Valid ID will be required upon check-in.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">What is the cancellation policy?</h3>
              <p className="text-muted-foreground">In-person classes can be rescheduled or canceled with a full refund up to 72 hours before the class. Within 72 hours, we offer class credit for future booking.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}