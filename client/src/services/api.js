import axios from 'axios';

// Configure Axios instance. Do not hardcode. Use environment variable.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all customers list for the sidebar
 * GET /api/customers
 */
export const getCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

/**
 * Fetch unified single customer profile
 * GET /api/customer/:id
 */
export const getCustomerById = async (id) => {
  const response = await api.get(`/customer/${id}`);
  return response.data;
};

/**
 * Generate AI Customer Insights
 * POST /api/customer/:id/analyze
 */
export const analyzeCustomer = async (id) => {
  const response = await api.post(`/customer/${id}/analyze`);
  return response.data;
};

export default api;
