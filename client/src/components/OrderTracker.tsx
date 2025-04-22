import { useState, useEffect } from 'react';
import { useOrderTracking } from '@/hooks/use-order-tracking';
import { Order } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Clock, ChevronRight, CheckCircle2, Truck, Package, Store, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderTrackerProps {
  userId: string;
  orderId: number;
}

interface OrderStatusStep {
  status: string;
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

export function OrderTracker({ userId, orderId }: OrderTrackerProps) {
  const { order, isConnected, error, reconnect } = useOrderTracking({
    userId,
    orderId,
  });
  
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  
  // Update estimated delivery time based on order status
  useEffect(() => {
    if (order) {
      const created = new Date(order.createdAt);
      
      // Add time based on status
      if (order.status === 'preparing') {
        // Add 30 minutes from created time
        const delivery = new Date(created.getTime() + 30 * 60000);
        setEstimatedDelivery(formatTime(delivery));
      } else if (order.status === 'in_transit') {
        // Add 15 minutes from now
        const delivery = new Date(Date.now() + 15 * 60000);
        setEstimatedDelivery(formatTime(delivery));
      } else if (order.status === 'delivered') {
        setEstimatedDelivery('Delivered');
      } else {
        // Default - 45 minutes from creation
        const delivery = new Date(created.getTime() + 45 * 60000);
        setEstimatedDelivery(formatTime(delivery));
      }
    }
  }, [order]);
  
  // Format time as HH:MM AM/PM
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Calculate progress based on order status
  const getProgress = (): number => {
    if (!order) return 0;
    
    switch (order.status) {
      case 'pending':
        return 10;
      case 'confirmed':
        return 25;
      case 'preparing':
        return 50;
      case 'in_transit':
        return 75;
      case 'delivered':
        return 100;
      case 'canceled':
        return 0;
      default:
        return 0;
    }
  };
  
  // Define order status steps
  const orderSteps: OrderStatusStep[] = [
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: 'Your order has been received by the bar',
      color: 'bg-blue-500'
    },
    {
      status: 'preparing',
      label: 'Preparing',
      icon: <Store className="h-5 w-5" />,
      description: 'The bar is preparing your cocktails',
      color: 'bg-amber-500'
    },
    {
      status: 'in_transit',
      label: 'On the Way',
      icon: <Truck className="h-5 w-5" />,
      description: 'Your order is on the way to you',
      color: 'bg-purple-500'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      icon: <Package className="h-5 w-5" />,
      description: 'Your order has been delivered',
      color: 'bg-green-500'
    }
  ];
  
  // Get current step index
  const getCurrentStepIndex = (): number => {
    if (!order) return -1;
    
    const index = orderSteps.findIndex(step => step.status === order.status);
    return index !== -1 ? index : 
      order.status === 'pending' ? -1 : 
      order.status === 'canceled' ? -2 : -1;
  };
  
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order #{orderId}</CardTitle>
          <CardDescription>
            {error ? (
              <span className="text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> 
                Error loading order details
              </span>
            ) : (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> 
                Loading order details...
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Button onClick={reconnect} variant="outline" size="sm">
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  const currentStepIndex = getCurrentStepIndex();
  const progress = getProgress();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardDescription>
              {isConnected ? (
                <span className="flex items-center text-green-500">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                  Live tracking
                </span>
              ) : (
                <span className="flex items-center text-amber-500">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Connecting...
                </span>
              )}
            </CardDescription>
          </div>
          
          <div className="text-right">
            {order.status === 'canceled' ? (
              <Badge variant="destructive">Canceled</Badge>
            ) : (
              <>
                <div className="flex items-center text-sm font-medium">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  ETA: {estimatedDelivery}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.status === 'delivered' ? 'Delivered' : 'Estimated delivery'}
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress bar */}
        {order.status !== 'canceled' && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Order placed</span>
              <span>Delivered</span>
            </div>
          </div>
        )}
        
        {/* Status message */}
        {order.status === 'canceled' ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-medium text-red-800">Order Canceled</h3>
            <p className="text-sm text-red-700 mt-1">
              This order has been canceled. Please contact customer support if you have any questions.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-800">
              {currentStepIndex >= 0 
                ? orderSteps[currentStepIndex].label 
                : 'Processing Order'}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              {currentStepIndex >= 0 
                ? orderSteps[currentStepIndex].description 
                : 'We are processing your order. Updates will appear here soon.'}
            </p>
          </div>
        )}
        
        {/* Order timeline */}
        <div className="space-y-3">
          {orderSteps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div 
                key={step.status} 
                className={`flex items-start p-3 rounded-md transition-colors ${
                  isCurrent ? 'bg-primary/10 border border-primary/20' : 
                  isActive ? 'bg-primary/5' : 'bg-muted/30'
                }`}
              >
                <div className={`
                  flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3
                  ${isActive ? step.color : 'bg-muted'}
                `}>
                  {step.icon}
                </div>
                
                <div className="flex-grow">
                  <h4 className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </h4>
                  <p className={`text-xs ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {isActive && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order details summary */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Order Total:</span>
            <span className="font-medium">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items:</span>
            <span>{(order.items as any[]).length} items</span>
          </div>
          
          <Button variant="ghost" size="sm" className="w-full mt-3 text-primary">
            View Order Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}