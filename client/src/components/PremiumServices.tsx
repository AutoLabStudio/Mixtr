import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function PremiumServices() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Premium Mixtr Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience more than just cocktail delivery with our premium services designed to enhance your mixology journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Subscriptions Card */}
          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.pexels.com/photos/5947061/pexels-photo-5947061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Cocktail Subscription Box"
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="font-medium">Monthly Boxes</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Cocktail Subscriptions</CardTitle>
              <CardDescription>
                Receive curated cocktail boxes delivered to your door on a regular schedule.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Choose your favorite styles
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Skip or cancel anytime
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Premium ingredients included
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/subscriptions">
                <Button className="w-full">
                  Explore Subscriptions
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Mixology Classes Card */}
          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.pexels.com/photos/4427616/pexels-photo-4427616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Mixology Classes"
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="font-medium">Virtual & In-Person</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Mixology Classes</CardTitle>
              <CardDescription>
                Learn from expert mixologists through engaging and interactive sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Virtual classes with ingredient kits
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  In-person sessions at partner bars
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  All skill levels welcome
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/mixology-classes">
                <Button className="w-full">
                  Browse Classes
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Loyalty Program Card */}
          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.pexels.com/photos/5946721/pexels-photo-5946721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Loyalty Program"
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 right-3">
                <Badge className="font-medium bg-amber-600 hover:bg-amber-700">Free to Join</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Mixtr Rewards</CardTitle>
              <CardDescription>
                Earn points, unlock tiers, and redeem exclusive rewards with every order.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Start with 100 welcome points
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Four tiers with increasing benefits
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Exclusive member-only offers
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/loyalty-program">
                <Button className="w-full">
                  Join Mixtr Rewards
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}