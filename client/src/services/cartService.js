import { apiService } from './apiService';

export const cartService = {
  async addToCart(productId, quantity = 1) {
    try {
      const response = await apiService.post('/api/cart', {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async getCart() {
    try {
      const response = await apiService.get('/api/cart');
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  },

  async updateCart(productId, quantity) {
    try {
      const response = await apiService.put(`/api/cart/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  async removeFromCart(productId) {
    try {
      const response = await apiService.delete(`/api/cart/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
};
