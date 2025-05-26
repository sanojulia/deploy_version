import { apiService } from './apiService'; // Assuming apiService is set up for base URL and auth

export const orderService = {
  async createOrder(orderDetails) {
    try {
      // orderDetails contains deliveryInfo and paymentMethod (e.g., { type: 'Card' })
      // Transform paymentMethod to paymentInfo as expected by the backend schema
      const payload = {
        deliveryInfo: orderDetails.deliveryInfo,
        paymentInfo: {
          method: orderDetails.paymentMethod.type, // 'type' from paymentMethod becomes 'method' in paymentInfo
          status: 'Pending' // Default status for payment, as per Order schema
        }
      };
      // The actual cart items will be taken from the server-side session/cart
      const response = await apiService.post('/api/orders', payload);
      console.log('orderService.js: createOrder - response from apiService.post:', response); // Cascade: Added log
      console.log('orderService.js: createOrder - value to be returned (response):', response); // Cascade: Updated log and fix
      return response; // Cascade: Fix - apiService.post already returns the data directly
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
      // Rethrow a more specific error message if available from server response
      throw new Error(error?.error || error?.message || 'Failed to create order. Please try again.');
    }
  },

};
