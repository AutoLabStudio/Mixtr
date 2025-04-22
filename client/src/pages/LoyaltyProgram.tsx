import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { LoyaltyProgram, LoyaltyReward } from "@shared/schema";
import { generateUserId } from "@/lib/utils";

export default function LoyaltyProgramPage() {
  const { toast } = useToast();
  const userId = generateUserId();
  const [enrolling, setEnrolling] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);

  // Get user's loyalty program if any
  const { 
    data: program, 
    isLoading: programLoading,
    error: programError,
    refetch: refetchProgram
  } = useQuery({
    queryKey: [`/api/user/${userId}/loyalty`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false, // Don't retry on 404 responses
    refetchOnWindowFocus: false,
  });

  // Get rewards based on user's tier
  const { 
    data: rewards,
    isLoading: rewardsLoading 
  } = useQuery({
    queryKey: [`/api/loyalty/rewards/tier/${program?.tier || 'bronze'}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!program
  });

  // Enroll in loyalty program
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/loyalty/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          tier: 'bronze'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in loyalty program');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Mixtr Rewards!",
        description: "You have successfully enrolled in our loyalty program.",
      });
      refetchProgram();
      setEnrolling(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to enroll in loyalty program. Please try again.",
        variant: "destructive",
      });
      setEnrolling(false);
    }
  });

  // Redeem a reward
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const response = await fetch(`/api/user/${userId}/loyalty/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });

      if (!response.ok) {
        throw new Error('Failed to redeem reward');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Redeemed!",
        description: `You have successfully redeemed ${selectedReward?.name}. Your points have been updated.`,
      });
      queryClient.setQueryData([`/api/user/${userId}/loyalty`], data.program);
      setRedeemDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle enrollment
  const handleEnroll = () => {
    setEnrolling(true);
    enrollMutation.mutate();
  };

  // Handle reward redemption
  const handleRedeem = () => {
    if (selectedReward) {
      redeemMutation.mutate(selectedReward.id);
    }
  };

  // Get next tier info
  const getNextTierInfo = (currentTier: string, points: number) => {
    if (currentTier === 'bronze') {
      return { 
        nextTier: 'silver', 
        pointsNeeded: 300, 
        progress: Math.min(points / 300 * 100, 100)
      };
    } else if (currentTier === 'silver') {
      return { 
        nextTier: 'gold', 
        pointsNeeded: 750, 
        progress: Math.min(points / 750 * 100, 100)
      };
    } else if (currentTier === 'gold') {
      return { 
        nextTier: 'platinum', 
        pointsNeeded: 1500, 
        progress: Math.min(points / 1500 * 100, 100)
      };
    }
    return { nextTier: null, pointsNeeded: 0, progress: 100 };
  };

  // Helper function to get tier badge color
  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'outline';
      case 'silver': return 'secondary';
      case 'gold': return 'default';
      case 'platinum': return 'destructive';
      default: return 'outline';
    }
  };

  // Handle loading state
  if (programLoading) {
    return <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mixtr Rewards</h1>
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    </div>;
  }
  
  // If program data failed to load due to 404, treat it as if the user is not enrolled
  // This handles the case where the API returns 404 "No loyalty program found"
  const userIsEnrolled = !!program;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Mixtr Rewards</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Earn points with every order and unlock exclusive benefits and rewards.
      </p>

      {userIsEnrolled && program ? (
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
                  <span>Next: {getNextTierInfo(program.tier, program.points).nextTier}</span>
                </div>
                <Progress value={getNextTierInfo(program.tier, program.points).progress} className="h-2" />
                <div className="mt-2 text-sm text-muted-foreground">
                  {getNextTierInfo(program.tier, program.points).pointsNeeded - program.points} more points needed to reach {getNextTierInfo(program.tier, program.points).nextTier}
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
                        <div><span className="font-medium">Type:</span> {reward.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
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
                            {program.points < reward.pointsCost ? `Need ${reward.pointsCost - program.points} More Points` : "Redeem"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
                            <DialogDescription>
                              You are about to redeem this reward for {selectedReward?.pointsCost} points. This action cannot be undone.
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
            <Tabs defaultValue="bronze">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17.5 21h-12c-1.7 0-3-1.3-3-3v-8.3c0-1.1.6-2.1 1.5-2.6l6-3.3c1.2-.7 2.7-.7 3.9 0l6 3.3c.9.5 1.5 1.5 1.5 2.6V18c.1 1.7-1.2 3-2.9 3z"></path><path d="M12 21v-2"></path><path d="M12 13v2"></path><path d="M12 3v2"></path><path d="M3 13h18"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Subscribe</h3>
                <p className="text-muted-foreground">Get 100 bonus points when you sign up for a cocktail subscription.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-1">Referrals</h3>
                <p className="text-muted-foreground">Earn 250 points for each friend who signs up and makes their first purchase.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Mixtr Rewards</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            Become a member to start earning points with every purchase. Redeem your points for exclusive rewards, free cocktails, and unique experiences.
          </p>
          <Button 
            size="lg" 
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <h3 className="text-lg font-medium mb-1">Earn Points</h3>
              <p className="text-muted-foreground">Collect points on every purchase you make.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
              </div>
              <h3 className="text-lg font-medium mb-1">Unlock Tiers</h3>
              <p className="text-muted-foreground">Rise through the ranks from Bronze to Platinum.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19.8 4a2.2 2.2 0 0 0-2.2 2.2v11.1a3 3 0 0 1-.9 2.15"></path><path d="M17.6 19.55a3 3 0 0 1-2.15.9H6a2 2 0 0 1-2-2v-15a.9.9 0 0 1 .9-.9H9"></path><path d="M7 16h8"></path><path d="M7 12h10"></path><path d="M9 8h6"></path></svg>
              </div>
              <h3 className="text-lg font-medium mb-1">Redeem Rewards</h3>
              <p className="text-muted-foreground">Exchange points for exclusive benefits and experiences.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}