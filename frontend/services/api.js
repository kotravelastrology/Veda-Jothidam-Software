/**
 * API Client Service
 *
 * Centralized API communication with:
 * - Automatic token management
 * - Request/response interceptors
 * - Error handling
 * - Token refresh logic
 * - Retry mechanism
 */

class ApiClient {
    constructor() {
        this.baseURL = '/api';
        this.timeout = 30000;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    /**
     * Get stored access token
     */
    getToken() {
        return localStorage.getItem('access_token');
    }

    /**
     * Get stored refresh token
     */
    getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    /**
     * Set tokens in storage
     */
    setTokens(accessToken, refreshToken) {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
    }

    /**
     * Clear tokens (logout)
     */
    clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    /**
     * Process queued requests after token refresh
     */
    processQueue(error, token = null) {
        this.failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken() {
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await this.request('POST', '/auth/refresh', null, {
                skipAuth: true,
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            const { token } = response;
            this.setTokens(token, refreshToken);
            this.processQueue(null, token);
            this.isRefreshing = false;

            return token;

        } catch (error) {
            this.clearTokens();
            this.processQueue(error, null);
            this.isRefreshing = false;
            window.location.href = '/auth/login';
            throw error;
        }
    }

    /**
     * Make HTTP request
     */
    async request(method, url, data = null, options = {}) {
        const {
            skipAuth = false,
            headers = {},
            timeout = this.timeout,
            retry = true,
        } = options;

        const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        const requestHeaders = {
            ...this.defaultHeaders,
            ...headers,
        };

        // Add authorization header
        if (!skipAuth) {
            const token = this.getToken();
            if (token) {
                requestHeaders['Authorization'] = `Bearer ${token}`;
            }
        }

        const fetchOptions = {
            method,
            headers: requestHeaders,
        };

        if (data && method !== 'GET') {
            fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(fullURL, {
                ...fetchOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle 401 (token expired)
            if (response.status === 401 && !skipAuth && retry) {
                try {
                    await this.refreshAccessToken();
                    // Retry original request
                    return this.request(method, url, data, { ...options, retry: false });
                } catch (error) {
                    throw new ApiError('Session expired. Please login again.', 401);
                }
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            // Handle error responses
            if (!response.ok) {
                throw new ApiError(
                    responseData.error || 'API request failed',
                    response.status,
                    responseData
                );
            }

            return responseData;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408);
            }

            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(error.message || 'Network error', 0, error);
        }
    }

    /**
     * GET request
     */
    get(url, options = {}) {
        return this.request('GET', url, null, options);
    }

    /**
     * POST request
     */
    post(url, data, options = {}) {
        return this.request('POST', url, data, options);
    }

    /**
     * PUT request
     */
    put(url, data, options = {}) {
        return this.request('PUT', url, data, options);
    }

    /**
     * PATCH request
     */
    patch(url, data, options = {}) {
        return this.request('PATCH', url, data, options);
    }

    /**
     * DELETE request
     */
    delete(url, options = {}) {
        return this.request('DELETE', url, null, options);
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status = 0, response = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }

    /**
     * Check if error is authentication related
     */
    isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    /**
     * Check if error is validation error
     */
    isValidationError() {
        return this.status === 400;
    }

    /**
     * Check if error is not found
     */
    isNotFound() {
        return this.status === 404;
    }

    /**
     * Check if error is server error
     */
    isServerError() {
        return this.status >= 500;
    }

    /**
     * Get error field (for form validation errors)
     */
    getFieldError(field) {
        if (this.response && typeof this.response === 'object') {
            return this.response[field];
        }
        return null;
    }
}

// Export singleton instance
const apiClient = new ApiClient();

// Export for direct use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiClient, ApiClient, ApiError };
}
