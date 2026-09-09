// WebSocket Manager for Real-time Notifications
// Handles connection lifecycle, reconnection, and message routing

export interface WebSocketConfig {
  url: string;
  autoReconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  messageQueueLimit: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id?: string;
}

export interface ConnectionState {
  connected: boolean;
  connecting: boolean;
  lastConnectedAt?: number;
  reconnectAttempts: number;
  messageQueue: WebSocketMessage[];
}

/**
 * WebSocket Manager for real-time communication
 */
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private state: ConnectionState;
  private messageHandlers: Map<string, (payload: any) => void> = new Map();
  private connectionCallbacks: Array<(connected: boolean) => void> = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      autoReconnect: config.autoReconnect ?? true,
      reconnectInterval: config.reconnectInterval ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
      messageQueueLimit: config.messageQueueLimit ?? 100,
      url: config.url,
    };

    this.state = {
      connected: false,
      connecting: false,
      reconnectAttempts: 0,
      messageQueue: [],
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.state.connected) {
        resolve();
        return;
      }

      if (this.state.connecting) {
        reject(new Error('Connection in progress'));
        return;
      }

      this.state.connecting = true;

      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.state.connected = true;
          this.state.connecting = false;
          this.state.reconnectAttempts = 0;
          this.state.lastConnectedAt = Date.now();

          this.startHeartbeat();
          this.flushMessageQueue();
          this.notifyConnectionCallbacks(true);

          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error: Event) => {
          console.error('WebSocket error:', error);
          this.state.connected = false;
          this.state.connecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.state.connected = false;
          this.state.connecting = false;
          this.stopHeartbeat();
          this.notifyConnectionCallbacks(false);

          if (this.config.autoReconnect && this.state.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        this.state.connecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.state.connected = false;
    this.state.connecting = false;
  }

  /**
   * Send message to server
   */
  send(message: WebSocketMessage): void {
    if (!message.id) {
      message.id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    if (this.state.connected && this.ws) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Send error:', error);
        this.queueMessage(message);
      }
    } else {
      this.queueMessage(message);
    }
  }

  /**
   * Register message handler
   */
  on(type: string, handler: (payload: any) => void): () => void {
    this.messageHandlers.set(type, handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(type);
    };
  }

  /**
   * Unregister message handler
   */
  off(type: string): void {
    this.messageHandlers.delete(type);
  }

  /**
   * Listen to connection state changes
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Get connection state
   */
  getState(): ConnectionState {
    return { ...this.state };
  }

  // ==================== PRIVATE METHODS ====================

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      const handler = this.messageHandlers.get(message.type);

      if (handler) {
        handler(message.payload);
      } else {
        console.warn(`No handler for message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  }

  private queueMessage(message: WebSocketMessage): void {
    if (this.state.messageQueue.length < this.config.messageQueueLimit) {
      this.state.messageQueue.push(message);
    } else {
      console.warn('Message queue limit reached');
    }
  }

  private flushMessageQueue(): void {
    while (this.state.messageQueue.length > 0) {
      const message = this.state.messageQueue.shift();
      if (message && this.state.connected && this.ws) {
        try {
          this.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Flush error:', error);
          this.state.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.state.reconnectAttempts++;
    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(1.5, this.state.reconnectAttempts - 1),
      30000
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.state.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatTimeout = setInterval(() => {
      if (this.state.connected) {
        this.send({
          type: 'heartbeat',
          payload: { timestamp: Date.now() },
          timestamp: Date.now(),
        });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearInterval(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private notifyConnectionCallbacks(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Callback error:', error);
      }
    });
  }
}
