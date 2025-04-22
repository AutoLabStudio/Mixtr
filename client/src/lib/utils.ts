import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Generate a random user ID (for demo purposes)
export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 10);
}

// Calculate order ETA based on delivery time string
export function calculateETA(deliveryTime: string): string {
  // Extract min and max minutes from strings like "25-35 min"
  const times = deliveryTime.match(/(\d+)-(\d+)/);
  if (!times) return '';
  
  const minMinutes = parseInt(times[1]);
  const maxMinutes = parseInt(times[2]);
  
  const now = new Date();
  const minETA = new Date(now.getTime() + minMinutes * 60000);
  const maxETA = new Date(now.getTime() + maxMinutes * 60000);
  
  return `${formatTime(minETA)} - ${formatTime(maxETA)}`;
}

// Format time to HH:MM AM/PM
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Get order status steps
export function getOrderStatusSteps(status: string): { step: number, statusText: string } {
  const statuses = {
    'pending': { step: 0, statusText: 'Order Placed' },
    'confirmed': { step: 1, statusText: 'Order Confirmed' },
    'preparing': { step: 2, statusText: 'Preparing Cocktails' },
    'out_for_delivery': { step: 3, statusText: 'Out for Delivery' },
    'delivered': { step: 4, statusText: 'Delivered' }
  };
  
  return statuses[status as keyof typeof statuses] || { step: 0, statusText: 'Processing' };
}
