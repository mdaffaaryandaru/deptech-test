const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Auth APIs
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async logout() {
    this.removeToken();
  }

  // Admin APIs
  async getAdminProfile() {
    return this.request('/admin/profile');
  }

  async updateAdminProfile(data) {
    return this.request('/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAdmins(pagination = {}) {
    const params = new URLSearchParams(pagination);
    return this.request(`/admin?${params}`);
  }

  async createAdmin(data) {
    return this.request('/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdmin(id) {
    return this.request(`/admin/${id}`);
  }

  async updateAdmin(id, data) {
    return this.request(`/admin/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAdmin(id) {
    return this.request(`/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Employee APIs
  async getEmployees(pagination = {}) {
    const params = new URLSearchParams(pagination);
    return this.request(`/employee?${params}`);
  }

  async getEmployeesWithLeaveSummary(pagination = {}) {
    const params = new URLSearchParams(pagination);
    return this.request(`/employee/with-leave-summary?${params}`);
  }

  async createEmployee(data) {
    return this.request('/employee', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmployee(id) {
    return this.request(`/employee/${id}`);
  }

  async updateEmployee(id, data) {
    return this.request(`/employee/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/employee/${id}`, {
      method: 'DELETE',
    });
  }

  // Leave APIs
  async getLeaves(pagination = {}) {
    const params = new URLSearchParams(pagination);
    return this.request(`/leave?${params}`);
  }

  async getLeaveStats() {
    return this.request('/leave/stats');
  }

  async getEmployeeLeaves(employeeId, pagination = {}) {
    const params = new URLSearchParams(pagination);
    return this.request(`/leave/employee/${employeeId}?${params}`);
  }

  async createLeave(data) {
    return this.request('/leave', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLeave(id) {
    return this.request(`/leave/${id}`);
  }

  async updateLeave(id, data) {
    return this.request(`/leave/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLeave(id) {
    return this.request(`/leave/${id}`, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
