import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Copy, 
  CheckCircle2, 
  MessageCircle, 
  Mail 
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  variant?: 'icon' | 'text' | 'outline' | 'contained';
  size?: 'sm' | 'md' | 'lg';
}

export function SocialShare({
  title,
  description = '',
  url = window.location.href,
  imageUrl,
  hashtags = ['Mixtr', 'Cocktails'],
  variant = 'contained',
  size = 'md',
}: SocialShareProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(tag => tag.startsWith('#') ? tag.substring(1) : tag).join(',');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedDesc}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%20${encodedUrl}`,
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setShowDialog(false);
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 text-xs';
      case 'lg': return 'h-12 text-lg';
      case 'md':
      default: return 'h-10 text-sm';
    }
  };

  const getButtonContent = () => {
    switch (variant) {
      case 'icon':
        return <Share2 className="h-4 w-4" />;
      case 'text':
        return "Share";
      case 'outline':
      case 'contained':
      default:
        return (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'outline': return 'outline';
      case 'icon': return 'ghost';
      case 'text': return 'ghost';
      case 'contained':
      default: return 'default';
    }
  };

  // Generate a tweet text for the "Share your experience" feature
  const generateExperienceText = () => {
    return `I just enjoyed ${title} via @MixtrDelivery! ${hashtags.map(tag => `#${tag}`).join(' ')}`;
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            variant={getButtonVariant()} 
            className={getButtonSize()}
            aria-label="Share"
          >
            {getButtonContent()}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {title}</DialogTitle>
            <DialogDescription>
              Share this {description ? 'cocktail' : 'order'} with your friends or on social media.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openShareWindow(shareLinks.facebook)}
                      variant="outline"
                      className="w-full flex flex-col items-center py-6 h-auto"
                    >
                      <Facebook className="h-8 w-8 mb-2 text-blue-600" />
                      <span className="text-xs">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openShareWindow(shareLinks.twitter)}
                      variant="outline"
                      className="w-full flex flex-col items-center py-6 h-auto"
                    >
                      <Twitter className="h-8 w-8 mb-2 text-sky-500" />
                      <span className="text-xs">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openShareWindow(shareLinks.whatsapp)}
                      variant="outline"
                      className="w-full flex flex-col items-center py-6 h-auto"
                    >
                      <MessageCircle className="h-8 w-8 mb-2 text-green-500" />
                      <span className="text-xs">WhatsApp</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share via WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => openShareWindow(shareLinks.email)}
                      variant="outline"
                      className="w-full flex flex-col items-center py-6 h-auto"
                    >
                      <Mail className="h-8 w-8 mb-2 text-gray-500" />
                      <span className="text-xs">Email</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share via Email</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {imageUrl && (
              <div className="mt-2">
                <Label htmlFor="share-image">Preview</Label>
                <div className="mt-1 rounded-md overflow-hidden border">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-auto object-cover max-h-[200px]" 
                  />
                </div>
              </div>
            )}
            
            <div className="mt-2">
              <Label htmlFor="share-link">Share link</Label>
              <div className="flex mt-1">
                <Input
                  id="share-link"
                  defaultValue={url}
                  readOnly
                  className="flex-1 rounded-r-none"
                />
                <Button
                  type="submit"
                  variant={copied ? "default" : "secondary"}
                  className="rounded-l-none"
                  onClick={handleCopyLink}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {description && (
              <div className="mt-2">
                <Label htmlFor="share-experience">Share your experience</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm">{generateExperienceText()}</p>
                </div>
                <Button 
                  className="mt-2 w-full"
                  onClick={() => {
                    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateExperienceText())}`;
                    openShareWindow(tweetUrl);
                  }}
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Tweet this
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}