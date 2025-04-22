import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      const response = await fetch('/api/mixology-classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          classId: selectedClass.id,
          status: "confirmed",
          deliveryAddress: address
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in class');
      }

      toast({
        title: "Enrollment Successful!",
        description: `You have been enrolled in ${selectedClass.title}. Your ingredients kit will be delivered to your address before the class.`,
      });
      
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
      <h1 className="text-3xl font-bold mb-2">Virtual Mixology Classes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn the art of mixology from expert bartenders with live, interactive virtual classes.
        We deliver all ingredients to your door before the class so you can follow along.
      </p>

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
                        Complete your enrollment to receive the ingredients kit and access to the virtual class.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
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
            <h3 className="text-lg font-medium mb-2">Live Interactive Classes</h3>
            <p className="text-muted-foreground">Join live sessions where you can ask questions and get real-time feedback.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path><path d="M8 9h8"></path><path d="M8 15h8"></path><path d="M12 9v6"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Expert Instructors</h3>
            <p className="text-muted-foreground">Learn directly from award-winning bartenders and mixologists from top bars.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
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
            <p className="text-muted-foreground">You can reschedule up to 48 hours before the class starts. Please contact customer service for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}