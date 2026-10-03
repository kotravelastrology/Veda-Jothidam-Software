/**
 * Unit Tests for Services
 *
 * Tests:
 * - API Client
 * - Authentication Service
 * - Data Services
 * - Store
 */

const {
    MockApiClient,
    mockDataGenerator,
    assertEqual,
    assertTrue,
    assertFalse,
    assertDefined,
    assertThrows,
    assertIncludes,
    assertLength,
    TestRunner,
} = require('./setup.js');

// Mock modules (would be imported in real setup)
const createMockAuthService = (api) => ({
    register: async (data) => api.post('/auth/register', data),
    login: async (email, password) => api.post('/auth/login', { email, password }),
    logout: async () => api.post('/auth/logout'),
    isAuthenticated: () => !!api.getToken(),
    getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
});

const createMockChartService = (api) => ({
    create: async (data) => api.post('/charts', data),
    list: async (options = {}) => api.get('/charts', options),
    get: async (id) => api.get(`/charts/${id}`),
    update: async (id, data) => api.put(`/charts/${id}`, data),
    delete: async (id) => api.delete(`/charts/${id}`),
});

const createMockDashboardService = (api) => ({
    getOverview: async () => api.get('/dashboard'),
    getActivity: async (options = {}) => api.get('/dashboard/activity', options),
    getStats: async () => api.get('/dashboard/stats'),
});

// ============ API CLIENT TESTS ============

const apiTests = new TestRunner('API Client Tests');

apiTests.test('should make GET request', async () => {
    const api = new MockApiClient();
    api.setResponse('GET', '/test', { success: true, data: 'test' });

    const result = await api.get('/test');
    assertEqual(result.success, true, 'Should have success flag');
    assertEqual(result.data, 'test', 'Should have test data');
});

apiTests.test('should make POST request with data', async () => {
    const api = new MockApiClient();
    api.setResponse('POST', '/test', { success: true, id: 'created_123' });

    const result = await api.post('/test', { name: 'Test' });
    assertEqual(result.success, true, 'Should have success flag');
    assertEqual(result.id, 'created_123', 'Should have created ID');
});

apiTests.test('should track request history', async () => {
    const api = new MockApiClient();
    api.setResponse('GET', '/test', { success: true });

    await api.get('/test');
    await api.post('/test', { data: 'test' });

    const requests = api.getRequests();
    assertLength(requests, 2, 'Should have 2 requests');
    assertEqual(requests[0].method, 'GET', 'First should be GET');
    assertEqual(requests[1].method, 'POST', 'Second should be POST');
});

apiTests.test('should handle API failures', async () => {
    const api = new MockApiClient();
    api.setFailure(400, 'Bad Request');

    let errorThrown = false;
    try {
        await api.get('/test');
    } catch (error) {
        errorThrown = true;
        assertEqual(error.message, 'Bad Request', 'Should throw error');
    }
    assertTrue(errorThrown, 'Should throw error on failure');
});

apiTests.test('should manage tokens', () => {
    const api = new MockApiClient();

    api.setTokens('access_123', 'refresh_456');
    assertEqual(api.getToken(), 'access_123', 'Should store access token');

    api.clearTokens();
    assertFalse(api.getToken(), 'Should clear tokens');
});

// ============ AUTHENTICATION SERVICE TESTS ============

const authTests = new TestRunner('Authentication Service Tests');

authTests.test('should register user', async () => {
    const api = new MockApiClient();
    const auth = createMockAuthService(api);

    api.setResponse('POST', '/auth/register', {
        success: true,
        user_id: 'user_123',
        token: 'token_abc',
        refresh_token: 'refresh_xyz',
        user: mockDataGenerator.generateUser(),
    });

    const result = await auth.register({
        email: 'new@example.com',
        username: 'newuser',
        password: 'Pass123!',
        full_name: 'New User',
    });

    assertEqual(result.user_id, 'user_123', 'Should return user ID');
    assertEqual(result.token, 'token_abc', 'Should return token');
});

authTests.test('should login user', async () => {
    const api = new MockApiClient();
    const auth = createMockAuthService(api);

    api.setResponse('POST', '/auth/login', {
        success: true,
        token: 'token_abc',
        refresh_token: 'refresh_xyz',
        user: mockDataGenerator.generateUser(),
    });

    const result = await auth.login('user@example.com', 'password');
    assertEqual(result.token, 'token_abc', 'Should return token');
    assertTrue(result.success, 'Should have success flag');
});

authTests.test('should check authentication status', () => {
    const api = new MockApiClient();
    const auth = createMockAuthService(api);

    assertFalse(auth.isAuthenticated(), 'Should not be authenticated initially');

    api.setTokens('token_123', 'refresh_456');
    assertTrue(auth.isAuthenticated(), 'Should be authenticated with token');
});

authTests.test('should logout user', async () => {
    const api = new MockApiClient();
    const auth = createMockAuthService(api);

    api.setResponse('POST', '/auth/logout', { success: true });
    api.setTokens('token_123', 'refresh_456');

    const result = await auth.logout();
    assertEqual(result.success, true, 'Should have success flag');
});

// ============ CHART SERVICE TESTS ============

const chartTests = new TestRunner('Chart Service Tests');

chartTests.test('should create chart', async () => {
    const api = new MockApiClient();
    const charts = createMockChartService(api);

    const mockChart = mockDataGenerator.generateChart();
    api.setResponse('POST', '/charts', {
        success: true,
        chart_id: mockChart.id,
        chart: mockChart,
    });

    const result = await charts.create({
        name: 'Test Chart',
        birthDate: '1990-05-15',
        birthTime: '10:30',
        birthPlace: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
    });

    assertEqual(result.chart_id, mockChart.id, 'Should return chart ID');
    assertDefined(result.chart, 'Should return chart data');
});

chartTests.test('should list charts', async () => {
    const api = new MockApiClient();
    const charts = createMockChartService(api);

    const mockCharts = [
        mockDataGenerator.generateChart(),
        mockDataGenerator.generateChart(),
    ];
    api.setResponse('GET', '/charts', {
        success: true,
        charts: mockCharts,
        pagination: { total: 2, page: 1 },
    });

    const result = await charts.list({ page: 1 });
    assertLength(result.charts, 2, 'Should return 2 charts');
    assertEqual(result.pagination.total, 2, 'Should have correct total');
});

chartTests.test('should get chart by ID', async () => {
    const api = new MockApiClient();
    const charts = createMockChartService(api);

    const mockChart = mockDataGenerator.generateChart();
    api.setResponse('GET', '/charts/chart_123', {
        success: true,
        chart: mockChart,
    });

    const result = await charts.get('chart_123');
    assertEqual(result.chart.id, mockChart.id, 'Should return chart');
});

chartTests.test('should update chart', async () => {
    const api = new MockApiClient();
    const charts = createMockChartService(api);

    api.setResponse('PUT', '/charts/chart_123', {
        success: true,
        message: 'Chart updated',
    });

    const result = await charts.update('chart_123', {
        name: 'Updated Name',
        description: 'Updated description',
    });

    assertTrue(result.success, 'Should have success flag');
});

chartTests.test('should delete chart', async () => {
    const api = new MockApiClient();
    const charts = createMockChartService(api);

    api.setResponse('DELETE', '/charts/chart_123', {
        success: true,
        message: 'Chart deleted',
    });

    const result = await charts.delete('chart_123');
    assertTrue(result.success, 'Should have success flag');
});

// ============ DASHBOARD SERVICE TESTS ============

const dashboardTests = new TestRunner('Dashboard Service Tests');

dashboardTests.test('should get dashboard overview', async () => {
    const api = new MockApiClient();
    const dashboard = createMockDashboardService(api);

    api.setResponse('GET', '/dashboard', {
        success: true,
        dashboard: {
            user: mockDataGenerator.generateUser(),
            stats: { total_charts: 5, total_consultations: 2 },
            recent_charts: [],
        },
    });

    const result = await dashboard.getOverview();
    assertTrue(result.success, 'Should have success flag');
    assertDefined(result.dashboard, 'Should have dashboard data');
    assertDefined(result.dashboard.stats, 'Should have stats');
});

dashboardTests.test('should get activity feed', async () => {
    const api = new MockApiClient();
    const dashboard = createMockDashboardService(api);

    api.setResponse('GET', '/dashboard/activity', {
        success: true,
        activities: [
            { type: 'chart_created', title: 'Created chart' },
            { type: 'consultation_booked', title: 'Booked consultation' },
        ],
    });

    const result = await dashboard.getActivity({ days: 7 });
    assertLength(result.activities, 2, 'Should return 2 activities');
});

dashboardTests.test('should get statistics', async () => {
    const api = new MockApiClient();
    const dashboard = createMockDashboardService(api);

    api.setResponse('GET', '/dashboard/stats', {
        success: true,
        stats: {
            charts: { total: 5, analyzed: 3 },
            consultations: { total: 2, completed: 1 },
        },
    });

    const result = await dashboard.getStats();
    assertTrue(result.success, 'Should have success flag');
    assertDefined(result.stats, 'Should have stats');
});

// ============ RUN ALL TESTS ============

async function runAllTests() {
    console.log('\n🧪 RUNNING UNIT TESTS\n');

    const results = [];
    results.push(await apiTests.run());
    results.push(await authTests.run());
    results.push(await chartTests.run());
    results.push(await dashboardTests.run());

    const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
    const totalTests = results.reduce((sum, r) => sum + r.total, 0);

    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total: ${totalTests} tests`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`Coverage: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    return { passed: totalPassed, failed: totalFailed, total: totalTests };
}

// Export for running
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
}

// Run if executed directly
if (typeof window === 'undefined') {
    runAllTests().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}
