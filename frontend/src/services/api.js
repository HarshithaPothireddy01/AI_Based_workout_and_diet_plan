import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planService = {
  // Generate a new workout and diet plan
  generatePlan: async (planData) => {
    try {
      const response = await api.post('/generate-plan', planData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate plan');
    }
  },

  // Get all plans with pagination
  getAllPlans: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/plans?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch plans');
    }
  },

  // Get a specific plan by ID
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch plan');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service is not available');
    }
  }
};

export default api;
