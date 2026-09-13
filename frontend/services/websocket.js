/**
 * WebSocket Service
 *
 * Real-time communication for:
 * - Live notifications
 * - Consultation updates
 * - Chat messages
 * - Presence tracking
 */

class WebSocketService {
    constructor(url = null) {
        this.url = url || this.getWebSocketURL();
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 seconds
        this.heartbeatInterval = null;
        this.messageHandlers = new Map();
        this.eventListeners = new Map();
        this.messageQueue = [];
        this.isConnected = false;
        this.userId = null;
    }

    /**
     * Get WebSocket URL from current location
     */
    getWebSocketURL() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}/ws`;
    }

    /**
     * Connect to WebSocket server
     */
    async connect(userId = null, token = null) {
        return new Promise((resolve, reject) => {
            try {
                this.userId = userId || localStorage.getItem('user_id');
                const authToken = token || localStorage.getItem('access_token');

                if (!this.userId || !authToken) {
                    reject(new Error('Missing authentication credentials'));
                    return;
                }

                // Build connection URL with auth
                const url = `${this.url}?user_id=${this.userId}&token=${authToken}`;

                this.ws = new WebSocket(url);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.processMessageQueue();
                    this.emit('connected');
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.isConnected = false;
                    this.stopHeartbeat();
                    this.emit('disconnected');
                    this.attemptReconnect();
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.stopHeartbeat();
        this.isConnected = false;
        this.messageQueue = [];
    }

    /**
     * Send message to server
     */
    send(type, data = {}) {
        const message = {
            type,
            data,
            timestamp: Date.now(),
            user_id: this.userId,
        };

        if (this.isConnected && this.ws) {
            this.ws.send(JSON.stringify(message));
        } else {
            // Queue message for later
            this.messageQueue.push(message);
        }
    }

    /**
     * Handle incoming messages
     */
    handleMessage(rawData) {
        try {
            const message = JSON.parse(rawData);
            const { type, data } = message;

            // Call registered handler for this message type
            if (this.messageHandlers.has(type)) {
                this.messageHandlers.get(type)(data);
            }

            // Emit generic message event
            this.emit('message', message);

        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
        }
    }

    /**
     * Register handler for message type
     */
    on(type, handler) {
        this.messageHandlers.set(type, handler);

        // Return unsubscribe function
        return () => {
            this.messageHandlers.delete(type);
        };
    }

    /**
     * Register event listener
     */
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(handler);

        // Return remove function
        return () => {
            this.eventListeners.get(event).delete(handler);
        };
    }

    /**
     * Emit event to all listeners
     */
    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Process queued messages
     */
    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.ws.send(JSON.stringify(message));
        }
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected) {
                this.send('ping');
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.connect().catch(error => {
                    console.error('Reconnection failed:', error);
                    this.attemptReconnect();
                });
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
            this.emit('reconnect_failed');
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            userId: this.userId,
            reconnectAttempts: this.reconnectAttempts,
            queuedMessages: this.messageQueue.length,
        };
    }
}

// Create singleton instance
let wsService = null;

/**
 * Get WebSocket service instance
 */
function getWebSocketService(url = null) {
    if (!wsService) {
        wsService = new WebSocketService(url);
    }
    return wsService;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebSocketService, getWebSocketService };
}
