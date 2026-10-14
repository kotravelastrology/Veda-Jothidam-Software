/**
 * Data Service Layer
 *
 * Handles:
 * - Chart operations (create, list, get, update, delete)
 * - Consultation operations (book, list, get, cancel)
 * - Dashboard data (stats, activity, recommendations)
 * - Astrologer directory
 * - Interpretation results
 */

class ChartService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Create new birth chart
     */
    async create(chartData) {
        return this.api.post('/charts', {
            name: chartData.name,
            birth_date: chartData.birthDate,
            birth_time: chartData.birthTime || null,
            birth_place: chartData.birthPlace,
            birth_latitude: chartData.latitude,
            birth_longitude: chartData.longitude,
            description: chartData.description || '',
        });
    }

    /**
     * Get all user charts with pagination
     */
    async list(options = {}) {
        const params = new URLSearchParams({
            page: options.page || 1,
            per_page: options.perPage || 10,
            search: options.search || '',
            sort: options.sort || 'created_at',
            order: options.order || 'desc',
        });

        return this.api.get(`/charts?${params}`);
    }

    /**
     * Get specific chart details
     */
    async get(chartId) {
        return this.api.get(`/charts/${chartId}`);
    }

    /**
     * Update chart metadata
     */
    async update(chartId, updates) {
        return this.api.put(`/charts/${chartId}`, {
            name: updates.name,
            description: updates.description,
            notes: updates.notes,
        });
    }

    /**
     * Delete chart
     */
    async delete(chartId) {
        return this.api.delete(`/charts/${chartId}`);
    }

    /**
     * Save calculated chart data
     */
    async saveData(chartId, data) {
        return this.api.post(`/charts/${chartId}/save`, {
            chart_data: data.chartData,
            strength_data: data.strengthData,
            dasha_data: data.dashaData,
        });
    }

    /**
     * Toggle chart sharing
     */
    async setPublic(chartId, isPublic) {
        return this.api.post(`/charts/${chartId}/share`, {
            is_public: isPublic,
        });
    }

    /**
     * Get public shared charts
     */
    async getShared(options = {}) {
        const params = new URLSearchParams({
            page: options.page || 1,
            per_page: options.perPage || 10,
            search: options.search || '',
        });

        return this.api.get(`/charts/shared?${params}`);
    }

    /**
     * Get chart statistics
     */
    async getStats() {
        return this.api.get('/charts/stats');
    }
}

class ConsultationService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Book new consultation
     */
    async book(consultationData) {
        return this.api.post('/consultations', {
            title: consultationData.title,
            description: consultationData.description || '',
            consultation_type: consultationData.type,
            scheduled_date: `${consultationData.date}T${consultationData.time}`,
            duration_minutes: parseInt(consultationData.duration),
            timezone: consultationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            chart_id: consultationData.chartId || null,
            astrologer_id: consultationData.astrologerId || null,
        });
    }

    /**
     * Get user's consultations
     */
    async list(options = {}) {
        const params = new URLSearchParams({
            page: options.page || 1,
            per_page: options.perPage || 10,
            status: options.status || '',
        });

        return this.api.get(`/consultations?${params}`);
    }

    /**
     * Get specific consultation
     */
    async get(consultationId) {
        return this.api.get(`/consultations/${consultationId}`);
    }

    /**
     * Update consultation
     */
    async update(consultationId, updates) {
        return this.api.put(`/consultations/${consultationId}`, {
            title: updates.title,
            client_notes: updates.clientNotes,
        });
    }

    /**
     * Cancel consultation
     */
    async cancel(consultationId, reason = '') {
        return this.api.post(`/consultations/${consultationId}/cancel`, {
            reason,
        });
    }

    /**
     * Get consultation statistics
     */
    async getStats() {
        return this.api.get('/consultations/stats');
    }
}

class AstrologerService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Get available astrologers
     */
    async getAvailable(filters = {}) {
        const params = new URLSearchParams();

        if (filters.minRating) params.append('min_rating', filters.minRating);
        if (filters.maxPrice) params.append('max_price', filters.maxPrice);
        if (filters.expertise) params.append('expertise', filters.expertise);

        return this.api.get(`/astrologers/available?${params}`);
    }

    /**
     * Get astrologer profile
     */
    async get(astrologerId) {
        return this.api.get(`/astrologers/${astrologerId}`);
    }
}

class DashboardService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Get complete dashboard overview
     */
    async getOverview() {
        return this.api.get('/dashboard');
    }

    /**
     * Get activity feed
     */
    async getActivity(options = {}) {
        const params = new URLSearchParams({
            days: options.days || 30,
            limit: options.limit || 50,
        });

        return this.api.get(`/dashboard/activity?${params}`);
    }

    /**
     * Get detailed statistics
     */
    async getStats() {
        return this.api.get('/dashboard/stats');
    }

    /**
     * Get personalized recommendations
     */
    async getRecommendations() {
        return this.api.get('/dashboard/recommendations');
    }
}

class InterpretationService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Get interpretations for chart
     */
    async getForChart(chartId) {
        return this.api.get(`/interpretations?chart_id=${chartId}`);
    }

    /**
     * Get specific interpretation
     */
    async get(interpretationId) {
        return this.api.get(`/interpretations/${interpretationId}`);
    }

    /**
     * Create/generate interpretation
     */
    async generate(chartId, type) {
        return this.api.post('/interpretations', {
            chart_id: chartId,
            interpretation_type: type,
        });
    }

    /**
     * Share interpretation
     */
    async share(interpretationId, emails = []) {
        return this.api.post(`/interpretations/${interpretationId}/share`, {
            shared_with: emails,
        });
    }
}

class ExportService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    /**
     * Export chart to PDF
     */
    async exportToPdf(chartId) {
        try {
            const response = await fetch(`/api/charts/${chartId}/export/pdf`, {
                headers: {
                    'Authorization': `Bearer ${this.api.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            return blob;
        } catch (error) {
            throw new Error(`PDF export failed: ${error.message}`);
        }
    }

    /**
     * Export chart to JSON
     */
    async exportToJson(chartId) {
        return this.api.get(`/charts/${chartId}/export/json`);
    }

    /**
     * Send chart report via email
     */
    async sendViaEmail(chartId, email) {
        return this.api.post(`/charts/${chartId}/export/email`, {
            email,
        });
    }
}

// Create service instances
const createServices = (apiClient) => {
    return {
        charts: new ChartService(apiClient),
        consultations: new ConsultationService(apiClient),
        astrologers: new AstrologerService(apiClient),
        dashboard: new DashboardService(apiClient),
        interpretations: new InterpretationService(apiClient),
        exports: new ExportService(apiClient),
    };
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChartService,
        ConsultationService,
        AstrologerService,
        DashboardService,
        InterpretationService,
        ExportService,
        createServices,
    };
}
