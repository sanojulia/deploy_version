import axios from 'axios';

// Base URL for all API requests
// Use the deployed URL in production, fallback to localhost for development
// const API_BASE_URL = import.meta.env.PROD ? 'https://deploy-version.onrender.com' : 'http://localhost:5000';

// Use this for testing with your specific deployment URL:
const API_BASE_URL = 'https://deploy-version.onrender.com';

// Service for handling all API requests
export const apiService = {

  // GET request with auth token handling
  async get(url, config = {}) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    try {
      const response = await axios.get(`${API_BASE_URL}${url}`, config);
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error.response || error.message);
      throw error.response ? error.response.data : error;
    }
  },

  // POST request with auth token handling
  async post(url, data, config = {}) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    try {
      const response = await axios.post(`${API_BASE_URL}${url}`, data, config);
      console.log('apiService.js: post - axios response object:', response);
      console.log('apiService.js: post - axios response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error.response || error.message);
      throw error.response ? error.response.data : error;
    }
  },

  async put(url, data, config = {}) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    try {
      const response = await axios.put(`${API_BASE_URL}${url}`, data, config);
      return response.data;
    } catch (error) {
      console.error('API PUT Error:', error.response || error.message);
      throw error.response ? error.response.data : error;
    }
  },

  async delete(url, config = {}) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    try {
      const response = await axios.delete(`${API_BASE_URL}${url}`, config);
      return response.data;
    } catch (error) {
      console.error('API DELETE Error:', error.response || error.message);
      throw error.response ? error.response.data : error;
    }
  },

  async searchProducts(query) {
    return this.get(`/api/products/search?q=${encodeURIComponent(query)}`);
  },

  async getProductsByCategory(category) {   
    try {
      const response = await axios.get(`${API_BASE_URL}/api/${category.toLowerCase()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  },
 
};
