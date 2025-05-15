---
author: David Küng
pubDatetime: 2025-05-15T11:30:00Z
title: Implementing WebSockets in React TypeScript Applications
slug: implement-websockets-react-ts
featured: true
draft: false
tags:
  - WebSockets
  - React
  - TypeScript
description: How to implement a Websocket in React
---

## 1. Create a WebSocket Service
First, create a reusable WebSocket service:
```typescript
// src/services/websocketService.ts
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
        resolve();
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, payload } = message;

          if (this.listeners.has(type)) {
            this.listeners.get(type)?.forEach(callback => callback(payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  send(type: string, payload: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  subscribe(type: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService('wss://your-websocket-server.com');
```

## 2. Create a React Hook
Next, create a custom hook to use WebSockets in your components:
```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketService';

export function useWebSocket<T = any>(messageType: string) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Connect to WebSocket if not already connected
    if (!isConnected) {
      websocketService
        .connect()
        .then(() => setIsConnected(true))
        .catch((err) => setError(err));
    }

    // Subscribe to specific message type
    const unsubscribe = websocketService.subscribe(messageType, (newData) => {
      setData(newData);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [messageType]);

  // Function to send messages
  const sendMessage = useCallback(
    (payload: any) => {
      websocketService.send(messageType, payload);
    },
    [messageType]
  );

  return { data, isConnected, error, sendMessage };
}
```

## 3. Use the Hook in Components
Now you can use the hook in your React components:
```tsx
// src/components/ChatComponent.tsx
import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = useState('');
  const { data: newMessage, isConnected, sendMessage } =
    useWebSocket<ChatMessage>('chat_message');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Add new messages when they arrive
  React.useEffect(() => {
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [newMessage]);

  const handleSend = () => {
    if (message.trim() && isConnected) {
      sendMessage({
        text: message,
        sender: 'me',
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="connection-status">
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
```

## 4. WebSocket Context (Optional)
For more complex applications, you might want to create a WebSocket context:
```tsx
// src/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { websocketService } from '../services/websocketService';

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: <T>(type: string, callback: (data: T) => void) => () => void;
  send: (type: string, payload: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      await websocketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const disconnect = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connect,
        disconnect,
        subscribe: websocketService.subscribe.bind(websocketService),
        send: websocketService.send.bind(websocketService),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
```

## Best Practices
1. Error handling: Always handle connection errors and implement reconnection logic
2. Message typing: Use TypeScript interfaces for your message types
3. Connection management: Close connections when components unmount
4. State management: Consider using context for app-wide WebSocket state
5. Security: Implement authentication if needed (e.g., via tokens in connection URL or headers)
6. Testing: Mock WebSocket connections in your tests

This approach gives you a robust, reusable WebSocket implementation that handles reconnection, message typing, and component lifecycle integration.