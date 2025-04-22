import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SocialFeed } from '@/components/SocialFeed';
import { SocialShare } from '@/components/SocialShare';
import { 
  Hash, 
  TrendingUp, 
  Layout, 
  Image, 
  Users, 
  Star,
  Sparkles
} from 'lucide-react';

export default function Social() {
  const [activeTab, setActiveTab] = useState('feed');
  const [location, navigate] = useLocation();

  // Simulated trending hashtags
  const trendingHashtags = [
    { tag: 'OldFashioned', count: 234 },
    { tag: 'NegroniWeek', count: 187 },
    { tag: 'MixologyMasters', count: 156 },
    { tag: 'CocktailsAtHome', count: 123 },
    { tag: 'WeekendVibes', count: 112 },
    { tag: 'MixtrExperience', count: 98 },
    { tag: 'HandcraftedCocktails', count: 87 },
  ];

  // Simulated trending bars
  const trendingBars = [
    { id: 1, name: 'The Nightcap Lounge', posts: 76, imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80' },
    { id: 2, name: 'Copper & Brew', posts: 62, imageUrl: 'https://images.unsplash.com/photo-1621873495867-3b907621eeef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80' },
    { id: 4, name: 'The Botanist\'s Garden', posts: 45, imageUrl: 'https://images.unsplash.com/photo-1607446045710-d5a8fd0f12fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80' },
  ];

  // Simulated trending cocktails
  const trendingCocktails = [
    { id: 1, name: 'Old Fashioned', barName: 'The Nightcap Lounge', posts: 89, imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80' },
    { id: 4, name: 'Espresso Martini', barName: 'Copper & Brew', posts: 72, imageUrl: 'https://images.unsplash.com/photo-1595968822901-4d91826729cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80' },
    { id: 8, name: 'Garden Gimlet', barName: 'The Botanist\'s Garden', posts: 63, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80' },
  ];

  // Simulated top contributors
  const topContributors = [
    { id: 1, username: 'Sophie Anderson', posts: 42, imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, username: 'Marcus Wells', posts: 36, imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, username: 'Olivia Chen', posts: 29, imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: 4, username: 'James Wilson', posts: 23, imageUrl: 'https://randomuser.me/api/portraits/men/62.jpg' },
    { id: 5, username: 'Elena Rodriguez', posts: 18, imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg' },
  ];

  return (
    <>
      <Helmet>
        <title>Mixtr Social - Share Your Cocktail Experiences</title>
        <meta name="description" content="Join the Mixtr community and share your cocktail experiences with others." />
      </Helmet>

      <div className="container mx-auto pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Mixtr Social</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community of cocktail enthusiasts. Share your experiences, discover new drinks, and connect with fellow mixology lovers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <Tabs 
              defaultValue="feed" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full mb-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" /> Feed
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center gap-2">
                  <Image className="h-4 w-4" /> Photos
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Trending
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <TabsContent value="feed" className="mt-0">
              <SocialFeed />
            </TabsContent>

            <TabsContent value="photos" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Photo Grid */}
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden relative group">
                    <img 
                      src={`https://source.unsplash.com/collection/3648995/${800 + index}`} 
                      alt={`Cocktail photo ${index}`} 
                      className="object-cover w-full h-full" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <SocialShare 
                        title="Check out this amazing cocktail" 
                        imageUrl={`https://source.unsplash.com/collection/3648995/${800 + index}`}
                        variant="contained"
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trending Cocktails */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                      Trending Cocktails
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="divide-y">
                    {trendingCocktails.map((cocktail) => (
                      <div key={cocktail.id} className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={cocktail.imageUrl} 
                            alt={cocktail.name}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{cocktail.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{cocktail.barName}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cocktail.posts} posts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Bars */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2 text-amber-500" />
                      Popular Bars
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="divide-y">
                    {trendingBars.map((bar) => (
                      <div key={bar.id} className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={bar.imageUrl} 
                            alt={bar.name}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{bar.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">Trending venue</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {bar.posts} posts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Hashtags */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-blue-500" />
                      Trending Hashtags
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {trendingHashtags.map((item) => (
                        <div 
                          key={item.tag} 
                          className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                        >
                          #{item.tag}
                          <span className="ml-1 text-xs text-muted-foreground">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Contributors */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 border-b flex items-center justify-between">
                    <h3 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      Top Contributors
                    </h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="divide-y">
                    {topContributors.map((user) => (
                      <div key={user.id} className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={user.imageUrl} 
                            alt={user.username}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{user.username}</h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.posts} posts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <h3 className="font-serif font-semibold text-lg mb-3">Download Our App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the full social experience on your phone. Share directly from your camera!
              </p>
              <div className="flex flex-col gap-2">
                <Button className="w-full">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6,13.8l0,0-0.2-0.2c-0.6-0.5-1.4-0.9-2.2-1.3c-0.3-0.1-0.5-0.3-0.7-0.4c-0.5-0.2-1.1-0.3-1.6-0.3 c-0.6,0-1.1,0.1-1.6,0.3c-0.3,0.1-0.5,0.2-0.7,0.4c-0.8,0.4-1.6,0.8-2.2,1.3l-0.2,0.2c-0.6,0.6-1,1.3-1.2,2.1 c-0.2,0.8-0.2,1.6,0,2.4c0.2,0.8,0.6,1.6,1.2,2.1l0.2,0.2c0.6,0.5,1.4,0.9,2.2,1.3c0.3,0.1,0.5,0.3,0.7,0.4c0.5,0.2,1.1,0.3,1.6,0.3 c0.6,0,1.1-0.1,1.6-0.3c0.3-0.1,0.5-0.2,0.7-0.4c0.8-0.4,1.6-0.8,2.2-1.3l0.2-0.2c0.6-0.6,1-1.3,1.2-2.1c0.2-0.8,0.2-1.6,0-2.4 C18.6,15.1,18.2,14.4,17.6,13.8z M8.9,16c0-0.5,0.2-0.9,0.5-1.2C9.8,14.4,10.2,14.2,10.7,14.2c0.5,0,0.9,0.2,1.2,0.5 c0.3,0.3,0.5,0.8,0.5,1.2c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.8,0.5-1.2,0.5c-0.5,0-0.9-0.2-1.2-0.5C9.1,16.9,8.9,16.4,8.9,16z M14.5,18.9c-0.4,0.4-1,0.7-1.6,0.7s-1.2-0.2-1.6-0.7c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3c0.1-0.1,0.2-0.1,0.3-0.1 c0.1,0,0.2,0,0.3,0.1c0.3,0.3,0.6,0.4,1,0.4s0.7-0.1,1-0.4c0.1-0.1,0.2-0.1,0.3-0.1c0.1,0,0.2,0,0.3,0.1c0.1,0.1,0.1,0.2,0.1,0.3 C14.6,18.7,14.6,18.8,14.5,18.9z M15.6,16c0,0.5-0.2,0.9-0.5,1.2c-0.3,0.3-0.8,0.5-1.2,0.5c-0.5,0-0.9-0.2-1.2-0.5 c-0.3-0.3-0.5-0.8-0.5-1.2c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.2-0.5c0.5,0,0.9,0.2,1.2,0.5C15.4,15.1,15.6,15.6,15.6,16z M16.7,8.5l-4.1-7.1c-0.2-0.3-0.6-0.5-1-0.5H12c-0.4,0-0.8,0.2-1,0.5L7,8.5C6.8,8.8,6.9,9.3,7.2,9.5c0.1,0.1,0.2,0.1,0.3,0.1 c0.2,0,0.4-0.1,0.6-0.3l3.5-6h0.9l3.5,6c0.1,0.2,0.3,0.3,0.6,0.3c0.1,0,0.2,0,0.3-0.1C16.9,9.3,17,8.8,16.7,8.5z"/>
                  </svg>
                  App Store
                </Button>
                <Button>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9,24c0.1-0.2,0.2-0.4,0.3-0.6c1.5-2.9,3-5.9,4.5-8.8c0.2-0.4,0.4-0.8,0.7-1.2c0.2-0.3,0.5-0.6,0.9-0.8 c0.3-0.2,0.6-0.3,0.9-0.3c0.3,0,0.6,0.1,0.9,0.3c0.3,0.2,0.6,0.4,0.9,0.8c0.2,0.3,0.5,0.8,0.7,1.2c1.5,2.9,3,5.9,4.5,8.8 c0.1,0.2,0.2,0.4,0.3,0.6H3.9z M12,0C13.6,0,15.1,0.4,16.5,1.2c1.4,0.8,2.5,1.9,3.3,3.3C20.7,5.8,21,7.3,21,9C21,9.9,20.8,10.8,20.5,11.7 c-0.3,0.9-0.7,1.7-1.3,2.4c-0.5,0.7-1.1,1.4-1.8,2c-0.7,0.6-1.4,1.1-2.2,1.4c-0.8,0.4-1.6,0.6-2.4,0.6c-0.8,0-1.6-0.2-2.4-0.6 C9.7,17.2,9,16.7,8.3,16.1c-0.7-0.6-1.3-1.3-1.8-2c-0.5-0.7-0.9-1.5-1.3-2.4C4.9,10.8,4.8,9.9,4.8,9c0-1.7,0.4-3.2,1.1-4.5 c0.8-1.4,1.9-2.5,3.3-3.3C10.6,0.4,12.2,0,13.8,0H12z"/>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 border-b">
                <h3 className="font-medium">Join Events</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="border rounded-md p-3">
                  <div className="text-xs text-primary font-medium mb-1">APR 28</div>
                  <h4 className="font-medium mb-1">Mixology Masterclass</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Learn how to craft the perfect Old Fashioned with our expert mixologists.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Register
                  </Button>
                </div>
                
                <div className="border rounded-md p-3">
                  <div className="text-xs text-primary font-medium mb-1">MAY 12</div>
                  <h4 className="font-medium mb-1">Cocktail Tasting Night</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sample our premium cocktail menu with discounted prices all night.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Register
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full">
                  View All Events
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 border-b">
                <h3 className="font-medium">Mixtr Community Guidelines</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be respectful to other community members</li>
                  <li>• Share authentic experiences</li>
                  <li>• Give credit to bars and mixologists</li>
                  <li>• Don't promote excessive drinking</li>
                  <li>• Tag relevant content appropriately</li>
                </ul>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Read Full Guidelines
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}