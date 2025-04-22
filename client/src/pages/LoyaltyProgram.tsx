import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import { generateUserId } from "@/lib/utils";

// Define types for our data
interface LoyaltyProgram {
  userId: string;
  tier: string;
  points: number;
  enrollmentDate: string;
  lastActivity: string;
  id?: number;
}

interface LoyaltyReward {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  pointsCost: number;
  tier: string;
  type: string;
  active: boolean;
}

export default function LoyaltyProgramPage() {
  const { toast } = useToast();
  // Create a consistent user ID for this session
  const [userId] = useState(() => generateUserId());
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);

  // Fetch user's loyalty program
  const { 
    data: program,
    isLoading: programLoading,
    error: programError,
    refetch: refetchProgram
  } = useQuery({
    queryKey: [`/api/user/${userId}/loyalty`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Fetch rewards once we have the program
  const {
    data: rewards,
    isLoading: rewardsLoading,
  } = useQuery({
    queryKey: [`/api/loyalty/rewards/tier/${program?.tier || 'bronze'}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!program,
  });

  // Mutation for enrolling in loyalty program
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/loyalty/enroll', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          tier: 'bronze',
          points: 100,
          enrollmentDate: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        })
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Mixtr Rewards!",
        description: "You've been enrolled in our loyalty program with 100 welcome points!",
      });
      setIsEnrolling(false);
      refetchProgram();
    },
    onError: (error) => {
      console.error("Enrollment failed:", error);
      toast({
        title: "Enrollment Failed",
        description: "We couldn't enroll you in the loyalty program. Please try again.",
        variant: "destructive",
      });
      setIsEnrolling(false);
    }
  });

  // Mutation for redeeming rewards
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const response = await apiRequest(`/api/user/${userId}/loyalty/redeem`, {
        method: 'POST',
        body: JSON.stringify({ rewardId })
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${selectedReward?.name}. Your points have been updated.`,
      });
      // Update the local cache with the new points balance
      if (data && data.program) {
        queryClient.setQueryData([`/api/user/${userId}/loyalty`], data.program);
      } else {
        refetchProgram();
      }
      setRedeemDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Redemption Failed",
        description: "We couldn't redeem your reward. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Auto-enroll on page load if user doesn't have a loyalty program
  useEffect(() => {
    // If program data is loaded and no program found (error), and not already enrolling
    if (programError && !program && !isEnrolling) {
      console.log("Auto-enrolling user in loyalty program");
      setIsEnrolling(true);
      enrollMutation.mutate();
    }
  }, [program, programError, isEnrolling]);

  // Handle manual enrollment
  const handleEnroll = () => {
    setIsEnrolling(true);
    enrollMutation.mutate();
  };

  // Handle reward redemption
  const handleRedeem = () => {
    if (selectedReward) {
      redeemMutation.mutate(selectedReward.id);
    }
  };

  // Calculate next tier progress
  const getNextTierInfo = (currentTier: string, points: number) => {
    if (currentTier === 'bronze') {
      return {
        nextTier: 'silver',
        pointsNeeded: 300,
        progress: Math.min((points / 300) * 100, 100)
      };
    } else if (currentTier === 'silver') {
      return {
        nextTier: 'gold',
        pointsNeeded: 750,
        progress: Math.min((points / 750) * 100, 100)
      };
    } else if (currentTier === 'gold') {
      return {
        nextTier: 'platinum',
        pointsNeeded: 1500,
        progress: Math.min((points / 1500) * 100, 100)
      };
    }
    return { nextTier: null, pointsNeeded: 0, progress: 100 };
  };

  // Get badge variant based on tier
  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'outline';
      case 'silver': return 'secondary';
      case 'gold': return 'default';
      case 'platinum': return 'destructive';
      default: return 'outline';
    }
  };

  // Loading state
  if (programLoading || enrollMutation.isPending) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Mixtr Rewards</h1>
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        {enrollMutation.isPending && (
          <div className="mt-4 text-center">
            <p>Enrolling you in Mixtr Rewards...</p>
          </div>
        )}
      </div>
    );
  }

  // Determine if user is enrolled based on program presence
  const userIsEnrolled = !!program;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Mixtr Rewards</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Earn points with every order and unlock exclusive benefits and rewards.
      </p>

      {/* If user is not enrolled, show enrollment card */}
      {!userIsEnrolled && (
        <div className="bg-primary/5 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our Loyalty Program</h2>
          <p className="mb-6">
            Sign up for Mixtr Rewards to earn points with every purchase, unlock exclusive benefits, 
            and redeem exciting rewards. It's free to join!
          </p>
          <Button 
            size="lg" 
            onClick={handleEnroll}
            disabled={isEnrolling}
          >
            {isEnrolling ? "Enrolling..." : "Join Now"}
          </Button>
        </div>
      )}

      {/* If user is enrolled, show loyalty program details */}
      {userIsEnrolled && program && (
        <div className="space-y-10">
          {/* User's loyalty status */}
          <div className="bg-primary/5 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Your Rewards Status</h2>
                  <Badge variant={getTierBadgeVariant(program.tier)} className="capitalize">
                    {program.tier} Tier
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Member since {new Date(program.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold">{program.points}</div>
                <div className="text-sm text-muted-foreground">Available Points</div>
              </div>
            </div>

            {program.tier !== 'platinum' && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Current: {program.tier}</span>
                  <span>
                    Next: {getNextTierInfo(program.tier, program.points).nextTier}
                  </span>
                </div>
                <Progress 
                  value={getNextTierInfo(program.tier, program.points).progress} 
                  className="h-2"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {getNextTierInfo(program.tier, program.points).pointsNeeded - program.points} more 
                  points needed to reach {getNextTierInfo(program.tier, program.points).nextTier}
                </div>
              </div>
            )}
          </div>

          {/* Available rewards */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Rewards</h2>
            {rewardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="opacity-60 animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards && rewards.map((reward: LoyaltyReward) => (
                  <Card key={reward.id} className="overflow-hidden flex flex-col h-full">
                    <div className="h-40 relative">
                      <img 
                        src={reward.imageUrl} 
                        alt={reward.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={getTierBadgeVariant(reward.tier)} className="capitalize">
                          {reward.tier}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <span className="text-white font-bold text-xl">
                          {reward.pointsCost} Points
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-sm">
                        <div>
                          <span className="font-medium">Type:</span> {reward.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog open={redeemDialogOpen && selectedReward?.id === reward.id} onOpenChange={setRedeemDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            disabled={program.points < reward.pointsCost}
                            onClick={() => setSelectedReward(reward)}
                          >
                            {program.points < reward.pointsCost 
                              ? `Need ${reward.pointsCost - program.points} More Points` 
                              : "Redeem"
                            }
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
                            <DialogDescription>
                              You are about to redeem this reward for {selectedReward?.pointsCost} points. 
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm">
                              After redemption, you will receive an email with details on how to claim your reward.
                              Please allow up to 24 hours for processing.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleRedeem} disabled={redeemMutation.isPending}>
                              {redeemMutation.isPending ? "Processing..." : "Confirm Redemption"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}

                {rewards && rewards.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No rewards available for your tier yet</h3>
                    <p className="text-muted-foreground">
                      Keep earning points to unlock rewards or reach the next tier level.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tier benefits */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tier Benefits</h2>
            <Tabs defaultValue={program.tier}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="bronze">Bronze</TabsTrigger>
                <TabsTrigger value="silver">Silver</TabsTrigger>
                <TabsTrigger value="gold">Gold</TabsTrigger>
                <TabsTrigger value="platinum">Platinum</TabsTrigger>
              </TabsList>
              <TabsContent value="bronze" className="p-6 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-3">Bronze Benefits (0+ Points)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Earn 10 points for every $1 spent</li>
                  <li>Access to basic reward redemptions</li>
                  <li>Birthday reward (free cocktail)</li>
                </ul>
              </TabsContent>
              <TabsContent value="silver" className="p-6 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-3">Silver Benefits (300+ Points)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>All Bronze benefits</li>
                  <li>Earn 12 points for every $1 spent</li>
                  <li>Free delivery on orders over $50</li>
                  <li>Early access to new cocktail releases</li>
                </ul>
              </TabsContent>
              <TabsContent value="gold" className="p-6 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-3">Gold Benefits (750+ Points)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>All Silver benefits</li>
                  <li>Earn 15 points for every $1 spent</li>
                  <li>Free delivery on all orders</li>
                  <li>Priority booking for mixology classes</li>
                  <li>Exclusive access to limited edition cocktails</li>
                </ul>
              </TabsContent>
              <TabsContent value="platinum" className="p-6 border rounded-md mt-2">
                <h3 className="text-lg font-medium mb-3">Platinum Benefits (1500+ Points)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>All Gold benefits</li>
                  <li>Earn 20 points for every $1 spent</li>
                  <li>Personal mixology consultation</li>
                  <li>VIP early access to all new features and products</li>
                  <li>Complimentary quarterly tasting box</li>
                  <li>Dedicated customer support line</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          {/* How to earn points */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Earn Points</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Make Purchases</h3>
                <p className="text-muted-foreground">Earn 10-20 points for every $1 spent, depending on your tier level.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Refer Friends</h3>
                <p className="text-muted-foreground">Earn 200 points for each friend who signs up and makes their first purchase.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path><path d="M8 9h8"></path><path d="M8 15h8"></path><path d="M12 9v6"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Complete Activities</h3>
                <p className="text-muted-foreground">Earn bonus points by attending mixology classes, subscribing to monthly boxes, and more.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}