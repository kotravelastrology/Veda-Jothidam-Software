# Task 4.5 - Integration Guide
## Advanced Features Implementation

**Last Updated:** September 23, 2026  
**Version:** 1.0  
**Status:** Complete

---

## Quick Start

### 1. Enable Service Worker (5 minutes)

Add to your main HTML file:

```html
<!-- Service Worker Registration -->
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Every minute
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
</script>
```

### 2. Initialize WebSocket (5 minutes)

```javascript
// In your main app initialization
import { getWebSocketService } from './services/websocket.js';

async function initializeApp() {
    const ws = getWebSocketService();
    
    try {
        await ws.connect(userId, authToken);
        
        // Listen for consultation updates
        ws.on('consultation_update', (data) => {
            console.log('Consultation updated:', data);
            // Update store
            appStore.setState('consultations.current', data);
        });
        
        // Listen for chat messages
        ws.on('chat_message', (data) => {
            notificationService.success(`New message: ${data.message}`);
            appStore.setState('messages.list', [data, ...appStore.getState('messages.list')]);
        });
        
    } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        notificationService.error('Real-time connection unavailable');
    }
}
```

### 3. Use Notifications (3 minutes)

```javascript
import notificationService from './services/notifications.js';

// Toast notifications
notificationService.success('Consultation booked!');
notificationService.error('Failed to create chart');
notificationService.warning('Your session expires soon');
notificationService.info('New feature available');

// Push notifications
await notificationService.pushNotification('New Consultation', {
    body: 'Astrologer responded to your consultation',
    tag: 'consultation-123',
    data: { url: '/consultations/123' }
});

// Subscribe to notification changes
const unsubscribe = notificationService.subscribe((state) => {
    console.log('Notifications:', state.notifications);
});
```

### 4. Track Performance (2 minutes)

```javascript
import performanceService from './services/performance.js';

// Performance is tracked automatically
// Get summary whenever you need
const summary = performanceService.getSummary();
console.log('LCP:', summary.webVitals.LCP);
console.log('Page load time:', summary.timings.PageLoad);

// Subscribe to performance changes
performanceService.subscribe((summary) => {
    updateDashboardMetrics(summary);
});

// Measure custom operations
const stopTimer = performanceService.startTimer('chart_calculation');
// ... do work ...
const duration = stopTimer(); // Returns duration in ms
```

### 5. Handle Offline State (3 minutes)

```javascript
import offlineManager from './services/offline.js';

// Check offline status
const status = offlineManager.getStatus();
console.log('Online:', status.isOnline);

// Subscribe to online/offline events
offlineManager.subscribe((event) => {
    if (event.event === 'online') {
        console.log('Back online! Syncing...');
        // Automatically synced
    } else if (event.event === 'offline') {
        console.log('Offline - changes will sync later');
    }
});

// Manually handle offline data
if (!status.isOnline) {
    // Queue for later sync
    await offlineManager.queueRequest(
        'POST',
        '/api/consultations',
        consultationData
    );
}
```

---

## Detailed Integration

### WebSocket Integration

#### Server-Side Setup (Backend)

```python
# In your Flask app
from flask_socketio import SocketIO, emit, join_room

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('consultation_update')
def handle_consultation_update(data):
    consultation_id = data['consultation_id']
    
    # Broadcast to all connected clients
    emit('consultation_update', data, broadcast=True)
    
    # Or send to specific user
    emit('consultation_update', data, 
         to=get_user_room(data['user_id']))
```

#### Client-Side Usage

```javascript
// Receive updates
ws.on('consultation_update', (data) => {
    // Update UI
    const consultation = appStore.getState('consultations.current');
    Object.assign(consultation, data);
    appStore.setState('consultations.current', consultation);
    
    // Notify user
    notificationService.success('Consultation updated');
});

// Send updates
ws.send('consultation_status_change', {
    consultation_id: 123,
    status: 'completed',
});
```

### Service Worker Integration

#### Cache Strategy Configuration

Edit `service-worker.js` to customize cache strategies:

```javascript
// Modify cache names for versioning
const CACHE_VERSION = 'v2'; // Increment for new version
const CACHE_NAME = `veda-jothidam-${CACHE_VERSION}`;

// Add more static assets
const STATIC_ASSETS = [
    '/',
    '/index.html',
    // Add your pages here
];

// Add more cacheable API endpoints
const CACHEABLE_ENDPOINTS = [
    '/api/auth/health',
    '/api/astrologers/available',
    '/api/charts/stats',
    '/api/consultations/stats',
    // Add more endpoints
];
```

#### Offline Page

Create `offline.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Offline</title>
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: sans-serif;
            background: #f5f5f5;
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 You're Offline</h1>
        <p>Your connection appears to be offline.</p>
        <p>You can still view cached data while offline.</p>
        <button onclick="location.reload()">Try Again</button>
    </div>
</body>
</html>
```

Update `service-worker.js` to serve this page:

```javascript
// In handlePageRequest
catch (error) {
    return caches.match('/offline.html') || 
           new Response('Offline', { status: 503 });
}
```

### Notification Integration

#### Request Permission

```javascript
// When user lands on page
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await notificationService.requestPermission();
        if (permission) {
            notificationService.info('Notifications enabled');
        }
    }
}

// Call on app init
document.addEventListener('DOMContentLoaded', requestNotificationPermission);
```

#### Handle Notification Clicks

```javascript
// In service-worker.js
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const data = event.notification.data;
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Bring existing window to front
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    // Send message to update app state
                    client.postMessage({
                        type: 'notification_clicked',
                        data: data,
                    });
                    return;
                }
            }
            
            // Open new window
            if (data.url) {
                return clients.openWindow(data.url);
            }
        })
    );
});
```

### Performance Integration

#### Display Metrics on Dashboard

```javascript
// Create a metrics widget
class PerformanceWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        performanceService.subscribe(this.onMetricsUpdate.bind(this));
    }
    
    onMetricsUpdate(summary) {
        const html = `
            <div class="metrics">
                <div>LCP: ${summary.webVitals.LCP?.toFixed(0)}ms</div>
                <div>CLS: ${summary.webVitals.CLS?.toFixed(3)}</div>
                <div>FID: ${summary.webVitals.FID?.toFixed(0)}ms</div>
            </div>
        `;
        this.container.innerHTML = html;
    }
}

// Initialize
new PerformanceWidget('metrics-container');
```

#### Monitor API Performance

```javascript
// Wrap API calls with timing
async function fetchWithTiming(url, options) {
    const timer = performanceService.startTimer(`api_${url}`);
    try {
        const response = await fetch(url, options);
        return response;
    } finally {
        const duration = timer();
        console.log(`${url}: ${duration.toFixed(0)}ms`);
    }
}
```

---

## Advanced Patterns

### Real-Time Data Sync

```javascript
// Keep local state in sync with server
class RealtimeSyncedData {
    constructor(key, endpoint) {
        this.key = key;
        this.endpoint = endpoint;
        this.data = null;
        
        // Load from server
        this.load();
        
        // Listen for updates
        ws.on(`${key}_update`, (data) => {
            this.data = data;
            this.notifySubscribers();
        });
    }
    
    async load() {
        const response = await fetch(this.endpoint);
        this.data = await response.json();
        this.notifySubscribers();
    }
    
    async update(changes) {
        // Optimistic update
        this.data = { ...this.data, ...changes };
        this.notifySubscribers();
        
        // Send to server
        try {
            const response = await fetch(this.endpoint, {
                method: 'PATCH',
                body: JSON.stringify(changes),
            });
            if (!response.ok) {
                // Revert on error
                this.load();
            }
        } catch (error) {
            notificationService.error('Failed to sync changes');
            this.load();
        }
    }
    
    subscribers = new Set();
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    notifySubscribers() {
        this.subscribers.forEach(cb => cb(this.data));
    }
}

// Usage
const consultations = new RealtimeSyncedData(
    'consultations',
    '/api/consultations'
);

consultations.subscribe((data) => {
    updateUI(data);
});
```

### Optimistic Updates

```javascript
// Update UI immediately, sync to server after
async function optimisticUpdate(resource, id, changes) {
    // 1. Update local state immediately
    const original = appStore.getState(`${resource}.${id}`);
    appStore.setState(`${resource}.${id}`, { ...original, ...changes });
    
    // 2. Show success notification
    notificationService.success('Update saved');
    
    // 3. Sync to server in background
    try {
        const response = await fetch(`/api/${resource}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(changes),
        });
        
        if (!response.ok) {
            // Rollback on error
            appStore.setState(`${resource}.${id}`, original);
            notificationService.error('Failed to save changes');
        }
    } catch (error) {
        // Rollback on error
        appStore.setState(`${resource}.${id}`, original);
        notificationService.error('Network error');
    }
}
```

### Offline-First Forms

```javascript
// Forms that work offline
class OfflineForm {
    constructor(formElement, endpoint) {
        this.form = formElement;
        this.endpoint = endpoint;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });
    }
    
    async submit() {
        const data = new FormData(this.form);
        const json = Object.fromEntries(data);
        
        if (offlineManager.getStatus().isOnline) {
            // Submit immediately
            await this.submitToServer(json);
        } else {
            // Queue for later
            await offlineManager.queueRequest(
                'POST',
                this.endpoint,
                json
            );
            notificationService.info('Saved offline - will sync when online');
        }
    }
    
    async submitToServer(json) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify(json),
            });
            
            if (response.ok) {
                notificationService.success('Saved successfully');
                this.form.reset();
            } else {
                notificationService.error('Failed to save');
            }
        } catch (error) {
            notificationService.error('Network error');
        }
    }
}
```

---

## Troubleshooting

### WebSocket Connection Issues

```javascript
// Check connection status
const status = ws.getStatus();
console.log('Connected:', status.isConnected);
console.log('Reconnect attempts:', status.reconnectAttempts);
console.log('Queued messages:', status.queuedMessages);

// Listen for connection events
ws.addEventListener('connected', () => console.log('Connected'));
ws.addEventListener('disconnected', () => console.log('Disconnected'));
ws.addEventListener('error', (error) => console.error('Error:', error));
ws.addEventListener('reconnect_failed', () => console.error('Reconnect failed'));
```

### Service Worker Issues

```javascript
// Check registration
navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => {
        console.log('Service Worker:', reg);
        
        // Check for updates
        reg.update();
    });
});

// Clear cache
caches.keys().then((names) => {
    names.forEach((name) => {
        caches.delete(name);
    });
});

// Check cached data
caches.open('veda-jothidam-v1').then((cache) => {
    cache.keys().then((requests) => {
        console.log('Cached requests:', requests);
    });
});
```

### Performance Issues

```javascript
// Check slow operations
performanceService.getMetrics().forEach((metric) => {
    if (metric.value > 1000) { // More than 1 second
        console.warn('Slow operation:', metric.name, metric.value);
    }
});

// Check long tasks
const timings = performanceService.getTimings('LongTask');
if (timings.length > 0) {
    console.warn('Long tasks detected:', timings.length);
}

// Report to monitoring service
performanceService.reportMetrics('/api/metrics');
```

### Offline Issues

```javascript
// Check offline queue
offlineManager.getQueuedRequests().then((requests) => {
    console.log('Queued requests:', requests);
});

// Manually trigger sync
offlineManager.syncQueue().then((result) => {
    console.log('Sync result:', result);
});

// Clear offline cache
await offlineManager.cacheData('key', null); // Delete
```

---

## Performance Tuning

### Optimize Service Worker Cache

```javascript
// Selective caching of large assets
if (request.method === 'GET' && url.pathname.includes('/images/')) {
    // Only cache images smaller than 2MB
    const response = await fetch(request);
    if (response.ok && response.headers.get('content-length') < 2000000) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
    }
    return response;
}
```

### Optimize WebSocket Messages

```javascript
// Batch updates to reduce message count
class BatchedUpdates {
    constructor(batchSize = 10, batchDelayMs = 100) {
        this.queue = [];
        this.batchSize = batchSize;
        this.batchDelayMs = batchDelayMs;
        this.timeout = null;
    }
    
    add(update) {
        this.queue.push(update);
        
        if (this.queue.length >= this.batchSize) {
            this.flush();
        } else if (!this.timeout) {
            this.timeout = setTimeout(() => this.flush(), this.batchDelayMs);
        }
    }
    
    flush() {
        if (this.queue.length === 0) return;
        
        ws.send('batch_update', { updates: this.queue });
        this.queue = [];
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}
```

---

## Testing Advanced Features

### Test WebSocket

```javascript
// Mock WebSocket for testing
class MockWebSocket {
    constructor(url) {
        this.url = url;
        this.messages = [];
        this.onopen = null;
        this.onmessage = null;
        
        setTimeout(() => this.onopen?.(), 10);
    }
    
    send(data) {
        this.messages.push(JSON.parse(data));
    }
    
    receiveMessage(data) {
        this.onmessage?.({ data: JSON.stringify(data) });
    }
}

// Test in isolation
async function testWebSocket() {
    global.WebSocket = MockWebSocket;
    
    const ws = new WebSocketService();
    await ws.connect('user123', 'token');
    
    assert(ws.isConnected === true);
    
    ws.send('test_message', { data: 'test' });
    assert(ws.messageQueue.length === 0); // Message sent
}
```

### Test Service Worker

```javascript
// Test cache behavior
async function testServiceWorkerCache() {
    const cache = await caches.open('test-cache');
    
    // Add request to cache
    const request = new Request('/api/data');
    const response = new Response('{"data": "test"}');
    await cache.put(request, response);
    
    // Verify cached
    const cached = await cache.match(request);
    assert(cached !== undefined);
    assert(await cached.text() === '{"data": "test"}');
}
```

---

## Best Practices

✅ **Do:**
- Always check `navigator.onLine` before critical operations
- Use exponential backoff for retries
- Cache only safe data offline (no sensitive info)
- Test on slow networks (DevTools throttling)
- Monitor performance in production
- Handle WebSocket disconnections gracefully
- Use optimistic updates for better UX
- Batch updates to reduce network traffic

❌ **Don't:**
- Store sensitive data in Service Worker cache
- Rely on offline for critical operations
- Send large payloads over WebSocket
- Block UI on WebSocket operations
- Forget to test offline scenarios
- Cache HTML with user-specific data
- Send notifications without permission
- Ignore performance metrics

---

## API Reference

### WebSocketService
```javascript
connect(userId, token)              // Promise<void>
disconnect()                        // void
send(type, data)                    // void
on(type, handler)                   // () => void (unsubscribe)
addEventListener(event, handler)    // () => void (unsubscribe)
emit(event, data)                   // void
getStatus()                         // { isConnected, userId, reconnectAttempts, queuedMessages }
```

### NotificationService
```javascript
toast(message, type, duration)      // string (notification id)
success(message, duration)          // string
error(message, duration)            // string
warning(message, duration)          // string
info(message, duration)             // string
pushNotification(title, options)    // Promise<void>
requestPermission()                 // Promise<boolean>
subscribe(listener)                 // () => void (unsubscribe)
remove(id)                          // void
clear()                             // void
getAll()                            // Notification[]
```

### PerformanceService
```javascript
init()                              // void
startTimer(label)                   // () => number (duration)
recordMetric(name, value)           // void
recordTiming(label, duration)       // void
getAverageTiming(label)             // number
getMetric(name)                     // Metric | undefined
getMetrics()                        // Metric[]
getTimings(label)                   // Timing[] | Object
getSummary()                        // { metrics, webVitals, timings, resources }
reportMetrics(endpoint)             // Promise<void>
subscribe(listener)                 // () => void (unsubscribe)
```

### OfflineManager
```javascript
init()                              // Promise<void>
queueRequest(method, url, data)     // Promise<string> (request id)
syncQueue()                         // Promise<{ synced, failed }>
cacheData(key, data, ttl)          // Promise<void>
getCachedData(key)                  // Promise<any>
getQueuedRequests()                 // Promise<Request[]>
getStatus()                         // { isOnline, queueSize, dbReady }
subscribe(listener)                 // () => void (unsubscribe)
```

---

## Conclusion

These advanced features make Veda Jothidam a modern, resilient platform that works seamlessly online and offline with real-time updates and optimized performance.

For questions or issues, refer to the main Task 4.5 documentation or deployment guide.

---

**Version:** 1.0  
**Last Updated:** September 23, 2026  
**Maintainer:** Claude Haiku 4.5
