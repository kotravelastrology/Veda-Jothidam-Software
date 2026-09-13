/**
 * API Service - Communication with Flask backend
 * Handles all HTTP requests for authentication and chart management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  /**
   * Load token from localStorage
   */
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * Clear token from localStorage
   */
  private clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Make HTTP request with error handling
   */
  private async request(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // Handle errors
      if (!response.ok) {
        // Clear token if unauthorized
        if (response.status === 401) {
          this.clearToken();
        }
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============= AUTHENTICATION ENDPOINTS =============

  /**
   * Sign up new user
   */
  async signup(email: string, password: string, name: string, language: string = 'Tamil'): Promise<any> {
    const data = await this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, language }),
      skipAuth: true,
    });

    if (data.access_token) {
      this.saveToken(data.access_token);
    }

    return data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<any> {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });

    if (data.access_token) {
      this.saveToken(data.access_token);
    }

    return data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    return this.request('/api/auth/profile', {
      method: 'GET',
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: any): Promise<any> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  // ============= CHART ENDPOINTS =============

  /**
   * Create a new chart
   */
  async createChart(chartData: {
    name: string;
    birth_date: string;
    birth_time: string;
    birth_place: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }): Promise<any> {
    return this.request('/api/charts/create', {
      method: 'POST',
      body: JSON.stringify(chartData),
    });
  }

  /**
   * List all charts for current user
   */
  async listCharts(): Promise<any> {
    return this.request('/api/charts', {
      method: 'GET',
    });
  }

  /**
   * Get specific chart with all phases
   */
  async getChart(chartId: string): Promise<any> {
    return this.request(`/api/charts/${chartId}`, {
      method: 'GET',
    });
  }

  /**
   * Update chart information
   */
  async updateChart(chartId: string, updates: any): Promise<any> {
    return this.request(`/api/charts/${chartId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete chart
   */
  async deleteChart(chartId: string): Promise<any> {
    return this.request(`/api/charts/${chartId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Save phase data
   */
  async savePhaseData(
    chartId: string,
    phaseNumber: number,
    phaseName: string,
    data: any
  ): Promise<any> {
    return this.request(`/api/charts/${chartId}/save-phase`, {
      method: 'POST',
      body: JSON.stringify({
        phase_number: phaseNumber,
        phase_name: phaseName,
        data,
      }),
    });
  }

  /**
   * Get all phases for a chart
   */
  async getAllPhases(chartId: string): Promise<any> {
    return this.request(`/api/charts/${chartId}/phases`, {
      method: 'GET',
    });
  }

  /**
   * Get specific phase data
   */
  async getPhase(chartId: string, phaseNumber: number): Promise<any> {
    return this.request(`/api/charts/${chartId}/phase/${phaseNumber}`, {
      method: 'GET',
    });
  }

  /**
   * Search charts by name
   */
  async searchCharts(query: string): Promise<any> {
    return this.request(`/api/charts/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  // ============= HEALTH CHECK =============

  /**
   * Check backend health
   */
  async healthCheck(): Promise<any> {
    return this.request('/api/health', {
      method: 'GET',
      skipAuth: true,
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

export default apiService;
