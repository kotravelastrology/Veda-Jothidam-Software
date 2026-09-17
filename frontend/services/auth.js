/**
 * Authentication Service
 *
 * Handles:
 * - User registration
 * - User login
 * - Token refresh
 * - Logout
 * - Profile management
 * - Password reset
 */

class AuthService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Register new user
     *
     * @param {Object} data - Registration data
     * @param {string} data.email - User email
     * @param {string} data.username - Username
     * @param {string} data.password - Password
     * @param {string} data.full_name - Full name
     * @param {string} data.language - Language preference (en/ta)
     * @returns {Promise<Object>} User data with tokens
     */
    async register(data) {
        const response = await this.api.post('/auth/register', {
            email: data.email,
            username: data.username,
            password: data.password,
            full_name: data.full_name,
            language: data.language || 'en',
        }, { skipAuth: true });

        // Store tokens
        if (response.token && response.refresh_token) {
            this.api.setTokens(response.token, response.refresh_token);
            this.setUser(response.user || { id: response.user_id, email: data.email });
        }

        return response;
    }

    /**
     * Login user
     *
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data with tokens
     */
    async login(email, password) {
        const response = await this.api.post('/auth/login', {
            email,
            password,
        }, { skipAuth: true });

        // Store tokens
        if (response.token && response.refresh_token) {
            this.api.setTokens(response.token, response.refresh_token);
            this.setUser(response.user || { id: response.user_id, email });
        }

        return response;
    }

    /**
     * Refresh access token
     *
     * @returns {Promise<string>} New access token
     */
    async refreshToken() {
        return this.api.refreshAccessToken();
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            // Call logout endpoint for activity logging
            await this.api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Clear local data regardless
            this.api.clearTokens();
            this.clearUser();
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.api.getToken();
    }

    /**
     * Get current user from storage
     */
    getUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Set user in storage
     */
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Clear user from storage
     */
    clearUser() {
        localStorage.removeItem('user');
    }

    /**
     * Update user profile
     *
     * @param {Object} data - Profile data to update
     * @returns {Promise<Object>} Updated user data
     */
    async updateProfile(data) {
        const response = await this.api.put('/users/profile', data);

        if (response.user) {
            this.setUser(response.user);
        }

        return response;
    }

    /**
     * Get user profile
     *
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        return this.api.get('/users/profile');
    }

    /**
     * Change password
     *
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Success response
     */
    async changePassword(currentPassword, newPassword) {
        return this.api.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
    }

    /**
     * Request password reset
     *
     * @param {string} email - User email
     * @returns {Promise<Object>} Success response
     */
    async requestPasswordReset(email) {
        return this.api.post('/auth/request-reset', {
            email,
        }, { skipAuth: true });
    }

    /**
     * Reset password with token
     *
     * @param {string} token - Reset token from email
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Success response
     */
    async resetPassword(token, newPassword) {
        return this.api.post('/auth/reset-password', {
            token,
            new_password: newPassword,
        }, { skipAuth: true });
    }

    /**
     * Get user settings
     *
     * @returns {Promise<Object>} User settings
     */
    async getSettings() {
        return this.api.get('/users/settings');
    }

    /**
     * Update user settings
     *
     * @param {Object} settings - Settings to update
     * @returns {Promise<Object>} Updated settings
     */
    async updateSettings(settings) {
        return this.api.put('/users/settings', settings);
    }

    /**
     * Get subscription info
     *
     * @returns {Promise<Object>} Subscription data
     */
    async getSubscription() {
        return this.api.get('/users/subscription');
    }

    /**
     * Check password strength
     *
     * @param {string} password - Password to check
     * @returns {Object} Strength info
     */
    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
        };

        const strength = Object.values(checks).filter(Boolean).length;
        const levels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

        return {
            checks,
            strength,
            level: levels[strength],
            isValid: checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special,
        };
    }

    /**
     * Validate email format
     *
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate username format
     *
     * @param {string} username - Username to validate
     * @returns {Object} Validation result
     */
    validateUsername(username) {
        return {
            isValid: /^[a-zA-Z0-9_-]{3,100}$/.test(username),
            minLength: username.length >= 3,
            maxLength: username.length <= 100,
            validChars: /^[a-zA-Z0-9_-]*$/.test(username),
        };
    }
}

// Create singleton instance
let authService = null;

/**
 * Get or create auth service instance
 */
function getAuthService(apiClient) {
    if (!authService && apiClient) {
        authService = new AuthService(apiClient);
    }
    return authService;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService, getAuthService };
}
