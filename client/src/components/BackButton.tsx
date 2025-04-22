import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "wouter";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export function BackButton({ fallbackPath = "/", className = "" }: BackButtonProps) {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    // Try to go back in history first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If there's no history, go to the fallback path
      setLocation(fallbackPath);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 mb-4 ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}