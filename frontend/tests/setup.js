/**
 * Test Setup & Utilities
 *
 * Provides:
 * - Mock API client
 * - Mock data generators
 * - Test helpers
 * - Assertion utilities
 */

// ============ MOCK API CLIENT ============

class MockApiClient {
    constructor() {
        this.token = 'mock_token';
        this.refreshToken = 'mock_refresh_token';
        this.responses = new Map();
        this.requests = [];
        this.shouldFail = false;
        this.failureStatus = 500;
        this.failureMessage = 'API Error';
    }

    /**
     * Set mock response for endpoint
     */
    setResponse(method, path, response) {
        const key = `${method}:${path}`;
        this.responses.set(key, response);
    }

    /**
     * Get mocked request history
     */
    getRequests() {
        return [...this.requests];
    }

    /**
     * Clear request history
     */
    clearRequests() {
        this.requests = [];
    }

    /**
     * Make mock request
     */
    async request(method, url, data = null, options = {}) {
        const key = `${method}:${url}`;

        // Track request
        this.requests.push({
            method,
            url,
            data,
            options,
            timestamp: Date.now(),
        });

        // Handle failures
        if (this.shouldFail) {
            const error = new Error(this.failureMessage);
            error.status = this.failureStatus;
            throw error;
        }

        // Return mock response
        if (this.responses.has(key)) {
            return JSON.parse(JSON.stringify(this.responses.get(key)));
        }

        // Default response
        return { success: true };
    }

    // HTTP methods
    get(url, options) {
        return this.request('GET', url, null, options);
    }

    post(url, data, options) {
        return this.request('POST', url, data, options);
    }

    put(url, data, options) {
        return this.request('PUT', url, data, options);
    }

    delete(url, options) {
        return this.request('DELETE', url, null, options);
    }

    // Token management
    getToken() {
        return this.token;
    }

    setTokens(access, refresh) {
        this.token = access;
        this.refreshToken = refresh;
    }

    clearTokens() {
        this.token = null;
        this.refreshToken = null;
    }

    // Simulate failure
    setFailure(status, message) {
        this.shouldFail = true;
        this.failureStatus = status;
        this.failureMessage = message;
    }

    // Clear failure
    clearFailure() {
        this.shouldFail = false;
    }
}

// ============ MOCK DATA GENERATORS ============

const mockDataGenerator = {
    /**
     * Generate mock user
     */
    generateUser(overrides = {}) {
        return {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email: 'user@example.com',
            username: 'testuser',
            full_name: 'Test User',
            is_premium: false,
            language: 'en',
            timezone: 'UTC',
            created_at: new Date().toISOString(),
            ...overrides,
        };
    },

    /**
     * Generate mock chart
     */
    generateChart(overrides = {}) {
        return {
            id: 'chart_' + Math.random().toString(36).substr(2, 9),
            name: 'Test Chart',
            birth_date: '1990-05-15',
            birth_time: '10:30:00',
            birth_place: 'New York, USA',
            birth_latitude: 40.7128,
            birth_longitude: -74.0060,
            is_public: false,
            created_at: new Date().toISOString(),
            chart_data: { planets: {} },
            strength_data: { shadbala: {} },
            dasha_data: { periods: [] },
            ...overrides,
        };
    },

    /**
     * Generate mock consultation
     */
    generateConsultation(overrides = {}) {
        return {
            id: 'consultation_' + Math.random().toString(36).substr(2, 9),
            title: 'Test Consultation',
            description: 'Test description',
            consultation_type: 'online',
            scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            duration_minutes: 60,
            status: 'pending',
            price: 50,
            created_at: new Date().toISOString(),
            ...overrides,
        };
    },

    /**
     * Generate mock astrologer
     */
    generateAstrologer(overrides = {}) {
        return {
            id: 'astrologer_' + Math.random().toString(36).substr(2, 9),
            name: 'Test Astrologer',
            email: 'astrologer@example.com',
            expertise: ['Vedic', 'Jyotish'],
            rate_per_hour: 50,
            rating: 4.5,
            total_reviews: 10,
            is_available: true,
            ...overrides,
        };
    },

    /**
     * Generate mock interpretation
     */
    generateInterpretation(overrides = {}) {
        return {
            id: 'interpretation_' + Math.random().toString(36).substr(2, 9),
            chart_id: 'chart_123',
            interpretation_type: 'personality',
            title: 'Personality Analysis',
            data: {
                insights: ['Insight 1', 'Insight 2'],
                challenges: ['Challenge 1', 'Challenge 2'],
                recommendations: ['Recommendation 1', 'Recommendation 2'],
            },
            language: 'en',
            created_at: new Date().toISOString(),
            ...overrides,
        };
    },
};

// ============ TEST HELPERS ============

/**
 * Assert equality
 */
function assertEqual(actual, expected, message = '') {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`AssertionError: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
    }
}

/**
 * Assert not equal
 */
function assertNotEqual(actual, expected, message = '') {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        throw new Error(`AssertionError: ${message}\nExpected not equal to: ${JSON.stringify(expected)}`);
    }
}

/**
 * Assert true
 */
function assertTrue(value, message = '') {
    if (value !== true) {
        throw new Error(`AssertionError: ${message}\nExpected true, got ${value}`);
    }
}

/**
 * Assert false
 */
function assertFalse(value, message = '') {
    if (value !== false) {
        throw new Error(`AssertionError: ${message}\nExpected false, got ${value}`);
    }
}

/**
 * Assert defined
 */
function assertDefined(value, message = '') {
    if (value === undefined || value === null) {
        throw new Error(`AssertionError: ${message}\nExpected defined value, got ${value}`);
    }
}

/**
 * Assert error thrown
 */
async function assertThrows(fn, expectedError = null, message = '') {
    try {
        await fn();
        throw new Error(`AssertionError: ${message}\nExpected error to be thrown, but none was`);
    } catch (error) {
        if (expectedError && !error.message.includes(expectedError)) {
            throw new Error(`AssertionError: ${message}\nExpected error message to include "${expectedError}", got "${error.message}"`);
        }
    }
}

/**
 * Assert array includes
 */
function assertIncludes(array, item, message = '') {
    if (!array.includes(item)) {
        throw new Error(`AssertionError: ${message}\nExpected array to include ${item}`);
    }
}

/**
 * Assert array length
 */
function assertLength(array, length, message = '') {
    if (array.length !== length) {
        throw new Error(`AssertionError: ${message}\nExpected length ${length}, got ${array.length}`);
    }
}

// ============ TEST RUNNER ============

class TestRunner {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.before = null;
        this.after = null;
        this.beforeEach = null;
        this.afterEach = null;
    }

    /**
     * Add test
     */
    test(name, fn) {
        this.tests.push({ name, fn });
    }

    /**
     * Set before hook
     */
    beforeAll(fn) {
        this.before = fn;
    }

    /**
     * Set after hook
     */
    afterAll(fn) {
        this.after = fn;
    }

    /**
     * Set before each hook
     */
    beforeEachTest(fn) {
        this.beforeEach = fn;
    }

    /**
     * Set after each hook
     */
    afterEachTest(fn) {
        this.afterEach = fn;
    }

    /**
     * Run all tests
     */
    async run() {
        console.log(`\n📋 ${this.name}`);
        console.log('='.repeat(50));

        let passed = 0;
        let failed = 0;

        try {
            if (this.before) {
                await this.before();
            }

            for (const test of this.tests) {
                try {
                    if (this.beforeEach) {
                        await this.beforeEach();
                    }

                    await test.fn();

                    if (this.afterEach) {
                        await this.afterEach();
                    }

                    console.log(`✅ ${test.name}`);
                    passed++;
                } catch (error) {
                    console.log(`❌ ${test.name}`);
                    console.log(`   ${error.message}`);
                    failed++;
                }
            }

            if (this.after) {
                await this.after();
            }
        } catch (error) {
            console.log(`❌ Setup/Teardown Error: ${error.message}`);
            failed++;
        }

        console.log('='.repeat(50));
        console.log(`Results: ${passed} passed, ${failed} failed\n`);

        return { passed, failed, total: this.tests.length };
    }
}

// ============ EXPORTS ============

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MockApiClient,
        mockDataGenerator,
        assertEqual,
        assertNotEqual,
        assertTrue,
        assertFalse,
        assertDefined,
        assertThrows,
        assertIncludes,
        assertLength,
        TestRunner,
    };
}
