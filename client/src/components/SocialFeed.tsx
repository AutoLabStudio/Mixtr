import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { SocialShare } from '@/components/SocialShare';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreVertical, 
  Flag, 
  Trash2, 
  Camera, 
  Smile,
  Search,
  User,
  ImageIcon,
  Filter,
  Tag
} from 'lucide-react';

interface Post {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  cocktailId?: number;
  cocktailName?: string;
  barId?: number;
  barName?: string;
  rating?: number;
  likes: number;
  comments: number;
  createdAt: string;
  liked: boolean;
  tags: string[];
}

interface SocialFeedProps {
  filter?: 'all' | 'following' | 'trending' | 'bar' | 'cocktail';
  barId?: number;
  cocktailId?: number;
  limit?: number;
}

export function SocialFeed({ 
  filter = 'all', 
  barId, 
  cocktailId, 
  limit = 10 
}: SocialFeedProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(filter);
  const [newPostContent, setNewPostContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // In a real app, we would fetch posts from API, but mock data for now
  const mockPosts: Post[] = [
    {
      id: 1,
      userId: 1,
      username: "Sophie Anderson",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Just tried the Old Fashioned from The Nightcap Lounge - absolute perfection! The balance of whiskey, bitters, and sugar is spot on. #Mixtr #CocktailLover",
      imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      cocktailId: 1,
      cocktailName: "Old Fashioned",
      barId: 1,
      barName: "The Nightcap Lounge",
      rating: 5,
      likes: 42,
      comments: 7,
      createdAt: "2023-05-15T14:48:00.000Z",
      liked: false,
      tags: ["OldFashioned", "Whiskey", "CocktailLover"]
    },
    {
      id: 2,
      userId: 2,
      username: "Marcus Wells",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Copper & Brew never disappoints! Their Espresso Martini is making my Friday night! #Mixtr #EspressoMartini",
      imageUrl: "https://images.unsplash.com/photo-1595968822901-4d91826729cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80",
      cocktailId: 4,
      cocktailName: "Espresso Martini",
      barId: 2,
      barName: "Copper & Brew",
      rating: 4,
      likes: 28,
      comments: 3,
      createdAt: "2023-05-14T20:35:00.000Z",
      liked: true,
      tags: ["EspressoMartini", "FridayVibes", "NightOut"]
    },
    {
      id: 3,
      userId: 3,
      username: "Olivia Chen",
      userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      content: "The Botanist's Garden has the most refreshing gin cocktails in town! The herb infusions are amazing. #Mixtr #GinCocktails #Botanicals",
      imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80",
      cocktailId: 8,
      cocktailName: "Garden Gimlet",
      barId: 4,
      barName: "The Botanist's Garden",
      rating: 5,
      likes: 57,
      comments: 12,
      createdAt: "2023-05-13T16:22:00.000Z",
      liked: false,
      tags: ["GinCocktails", "Botanicals", "RefreshingDrinks"]
    }
  ];

  // In a real app, use real queries
  const { data: posts = mockPosts, isLoading } = useQuery({
    queryKey: ['/api/social/posts', activeTab, barId, cocktailId, limit],
    queryFn: () => mockPosts,
  });

  // Mock like mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, action }: { postId: number; action: 'like' | 'unlike' }) => {
      // In real implementation, call API
      return { postId, success: true };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/posts'] });
    },
  });

  // Mock create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      // In real implementation, call API
      return { id: Date.now(), ...postData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/posts'] });
      setNewPostContent('');
      setImageFile(null);
      setImagePreview(null);
      setPostTags([]);
      toast({
        title: 'Success',
        description: 'Your post has been shared!',
      });
    },
  });

  const handleLikeToggle = (postId: number, liked: boolean) => {
    likeMutation.mutate({
      postId,
      action: liked ? 'unlike' : 'like',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to post.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newPostContent.trim()) {
      toast({
        title: 'Empty Post',
        description: 'Please write something to share.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, we would upload the image and then create the post
    createPostMutation.mutate({
      userId: user.id,
      username: user.username,
      content: newPostContent,
      imageUrl: imagePreview,
      tags: postTags,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      liked: false,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !postTags.includes(newTag.trim())) {
      setPostTags([...postTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setPostTags(postTags.filter(t => t !== tag));
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      post.username.toLowerCase().includes(query) ||
      (post.cocktailName && post.cocktailName.toLowerCase().includes(query)) ||
      (post.barName && post.barName.toLowerCase().includes(query)) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Post creation */}
      {user && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your cocktail experience..."
                  className="resize-none mb-2"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                
                {imagePreview && (
                  <div className="mt-2 relative rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[200px] object-cover" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {postTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postTags.map(tag => (
                      <div 
                        key={tag} 
                        className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs flex items-center"
                      >
                        #{tag}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <label>
                        <Camera className="h-4 w-4 mr-1" />
                        Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Tag className="h-4 w-4 mr-1" />
                          Tags
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="p-2 w-60">
                        <div className="flex items-center gap-2 mb-2">
                          <Input 
                            placeholder="Add a tag..." 
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={addTag}>Add</Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Popular: #Mixtr #CocktailLover #NightOut
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitPost}
                    disabled={createPostMutation.isPending || !newPostContent.trim()}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Feed tabs and search */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs 
            defaultValue={filter} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              {barId && <TabsTrigger value="bar">{posts[0]?.barName || 'Bar'}</TabsTrigger>}
              {cocktailId && <TabsTrigger value="cocktail">{posts[0]?.cocktailName || 'Cocktail'}</TabsTrigger>}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Posts list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-10 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">No posts found</p>
            <p className="text-sm text-muted-foreground/70">
              {searchQuery ? 'Try a different search term' : 'Be the first to share your experience!'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.userAvatar} alt={post.username} />
                      <AvatarFallback>
                        {post.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-medium">
                        {post.username}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {post.cocktailName && post.barName && (
                          <> · Enjoyed <span className="font-medium">{post.cocktailName}</span> at <span className="font-medium">{post.barName}</span></>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                      {user && post.userId === user.id && (
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <p className="whitespace-pre-wrap mb-3">{post.content}</p>
                
                {post.imageUrl && (
                  <div className="-mx-6 mb-3">
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      className="w-full h-auto object-cover max-h-80" 
                    />
                  </div>
                )}
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                      <div 
                        key={tag} 
                        className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs cursor-pointer"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </div>
                    ))}
                  </div>
                )}
                
                {post.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < post.rating! ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934l-6.18 3.246 1.18-6.851-5-4.861 6.905-1.004L10 0l3.095 6.465 6.905 1.004-5 4.861 1.18 6.851z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      Rated {post.rating} stars
                    </span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-3">
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs ${post.liked ? 'text-primary' : ''}`}
                    onClick={() => handleLikeToggle(post.id, post.liked)}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1 ${post.liked ? 'fill-primary' : ''}`} />
                    {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments} {post.comments === 1 ? 'Comment' : 'Comments'}
                  </Button>
                  
                  <SocialShare
                    title={post.cocktailName || 'A great cocktail'}
                    description={post.content}
                    url={`https://mixtr.com/social/post/${post.id}`}
                    imageUrl={post.imageUrl}
                    hashtags={['Mixtr', ...(post.tags || [])]}
                    variant="icon"
                    size="sm"
                  />
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}