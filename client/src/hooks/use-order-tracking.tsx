import { useState, useEffect, useCallback, useRef } from 'react';
import { Order } from '@shared/schema';

interface OrderTrackingOptions {
  userId: string;
  orderId: number;
  onStatusChange?: (order: Order) => void;
}

export function useOrderTracking({ userId, orderId, onStatusChange }: OrderTrackingOptions) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize the WebSocket connection
  useEffect(() => {
    if (!userId || !orderId) {
      setError('User ID and Order ID are required for order tracking');
      return;
    }

    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Connection opened
    socket.addEventListener('open', () => {
      setIsConnected(true);
      setError(null);
      console.log('WebSocket connection established');

      // Register for updates
      socket.send(JSON.stringify({
        type: 'register',
        userId,
        orderId
      }));
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'orderUpdate' && data.order) {
          setOrder(data.order);
          
          // Call the optional callback with the updated order
          if (onStatusChange) {
            onStatusChange(data.order);
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    });

    // Connection closed
    socket.addEventListener('close', () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    });

    // Connection error
    socket.addEventListener('error', (event) => {
      setError('WebSocket connection error');
      setIsConnected(false);
      console.error('WebSocket error:', event);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userId, orderId, onStatusChange]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Create a new WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Setup event listeners again
    socket.addEventListener('open', () => {
      setIsConnected(true);
      setError(null);
      console.log('WebSocket connection re-established');

      // Register for updates
      socket.send(JSON.stringify({
        type: 'register',
        userId,
        orderId
      }));
    });

    // ... other event listeners
  }, [userId, orderId]);

  return { 
    order, 
    isConnected,
    error,
    reconnect 
  };
}