/**
 * Utility Functions
 *
 * Provides:
 * - Data formatting
 * - Date/time utilities
 * - Form validation
 * - Common helpers
 */

// ============ DATE UTILITIES ============

/**
 * Format date to display format
 */
function formatDate(date, format = 'MMM DD, YYYY') {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d)) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return format
        .replace('YYYY', year)
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('MMM', monthNames[d.getMonth()])
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes);
}

/**
 * Format date to ISO string
 */
function toISOString(date) {
    return new Date(date).toISOString().split('T')[0];
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return formatDate(date);
}

/**
 * Format time in HH:MM format
 */
function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}

/**
 * Get date range for dashboard filters
 */
function getDateRange(days) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    return {
        start: toISOString(start),
        end: toISOString(end),
    };
}

// ============ NUMBER FORMATTING ============

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Format percentage
 */
function formatPercentage(value, decimals = 0) {
    return `${(value).toFixed(decimals)}%`;
}

/**
 * Format large numbers
 */
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// ============ STRING UTILITIES ============

/**
 * Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case
 */
function toTitleCase(str) {
    return str
        .split('_')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Truncate string
 */
function truncate(str, length = 50, suffix = '...') {
    if (str.length <= length) return str;
    return str.substr(0, length - suffix.length) + suffix;
}

/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// ============ VALIDATION ============

/**
 * Validate email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password
 */
function validatePassword(password) {
    const checks = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    };

    return {
        isValid: Object.values(checks).every(v => v),
        checks,
        strength: Object.values(checks).filter(v => v).length,
    };
}

/**
 * Validate username
 */
function validateUsername(username) {
    return {
        isValid: /^[a-zA-Z0-9_-]{3,100}$/.test(username),
        minLength: username.length >= 3,
        maxLength: username.length <= 100,
        validChars: /^[a-zA-Z0-9_-]*$/.test(username),
    };
}

/**
 * Validate URL
 */
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ============ OBJECT UTILITIES ============

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects
 */
function mergeObjects(target, ...sources) {
    return sources.reduce((merged, source) => {
        Object.keys(source).forEach(key => {
            if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                merged[key] = mergeObjects(merged[key] || {}, source[key]);
            } else {
                merged[key] = source[key];
            }
        });
        return merged;
    }, target);
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Get object value by path
 */
function getValueByPath(obj, path) {
    return path.split('.').reduce((current, part) => current?.[part], obj);
}

// ============ ARRAY UTILITIES ============

/**
 * Unique array items
 */
function unique(arr, key = null) {
    if (!key) return [...new Set(arr)];

    const seen = new Set();
    return arr.filter(item => {
        const value = key ? item[key] : item;
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

/**
 * Chunk array
 */
function chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Group array by key
 */
function groupBy(arr, key) {
    return arr.reduce((grouped, item) => {
        const group = item[key];
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(item);
        return grouped;
    }, {});
}

// ============ DEBOUNCE & THROTTLE ============

/**
 * Debounce function
 */
function debounce(func, delay = 300) {
    let timeoutId = null;

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function
 */
function throttle(func, delay = 300) {
    let lastCall = 0;

    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

// ============ LOCAL STORAGE HELPERS ============

/**
 * Set item in localStorage with expiration
 */
function setStorageWithExpiry(key, value, expiryHours = 24) {
    const item = {
        value,
        expiry: Date.now() + (expiryHours * 60 * 60 * 1000),
    };
    localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get item from localStorage with expiration check
 */
function getStorageWithExpiry(key) {
    const item = localStorage.getItem(key);

    if (!item) return null;

    const parsed = JSON.parse(item);

    if (Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return parsed.value;
}

// ============ ERROR HANDLING ============

/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
    if (typeof error === 'string') return error;

    if (error.response?.data?.error) {
        return error.response.data.error;
    }

    if (error.message) return error.message;

    return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error safely
 */
function logError(error, context = '') {
    const message = getErrorMessage(error);
    console.error(`[${context}]`, message, error);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Date utilities
        formatDate,
        toISOString,
        formatRelativeTime,
        formatTime,
        getDateRange,

        // Number formatting
        formatCurrency,
        formatPercentage,
        formatNumber,

        // String utilities
        capitalize,
        toTitleCase,
        truncate,
        generateId,

        // Validation
        validateEmail,
        validatePassword,
        validateUsername,
        validateUrl,

        // Object utilities
        deepClone,
        mergeObjects,
        isEmpty,
        getValueByPath,

        // Array utilities
        unique,
        chunk,
        groupBy,

        // Debounce & throttle
        debounce,
        throttle,

        // Local storage
        setStorageWithExpiry,
        getStorageWithExpiry,

        // Error handling
        getErrorMessage,
        logError,
    };
}
