import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { AuthContext, getAuthHeaders} from './AuthContext';

const BagContext = createContext();

const normalizeCartItems = (items) => {
  return items.map(item => {
    const product = item.productId;

    let price = 0;
    if (product?.price !== undefined && product?.price !== null) {
      price = parseFloat(product.price) || 0;
    }
    return {
      id: product?._id || product,
      quantity: item.quantity || 0,
      price: product?.price || 0,
      name: product?.name || 'Unknown Product',
      brand: product?.brand || 'Unknown Brand',
      color: item.color || 'default',
      size: item.size || 'default',
      image: product?.image?.main || product?.image || '',
    };
  });
};

export const BagProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  // Function to fetch cart data
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders(); // Get auth headers
      const cartData = await apiService.get("/api/cart", { headers });

      if (cartData && cartData.items) {
        setBagItems(normalizeCartItems(cartData.items)); // Assuming normalizeCartItems is available
      } else {
        setBagItems([]); // If no items or cart is not as expected, set to empty
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.message || 'Failed to load cart items.'); // Set an error state if available
      setBagItems([]); // Clear items on error to avoid displaying stale data
    } finally {
      setLoading(false);
    }
  };

  // Fetch the cart when the user context changes
  useEffect(() => {
    if (user) { // Only attempt to load cart if user is available
      loadCart();
    } else {
      // If no user, clear bag items and set loading to false
      setBagItems([]);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Effect depends on user

  // Add item to the cart
  const addToBag = async (item) => {
    try {
      console.log("Posting to /api/cart:", item);
      const headers = getAuthHeaders();
      const response = await axios.post("/api/cart", item, { headers });

      const updatedCart = response.data;

      // Sync state with the updated backend response
      if (updatedCart && updatedCart.items) {
        setBagItems(normalizeCartItems(updatedCart.items));
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to bag:', error);
    }
  };

  // Update item quantity in the cart
  const updateQuantity = async (id, newQuantity, color, size) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(`/api/cart/${id}`, { quantity: newQuantity, color, size}, { headers});

      const updatedCart = response.data;
      if (updatedCart && updatedCart.items) {
        setBagItems(normalizeCartItems(updatedCart.items));
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from the cart
  const removeItem = async (id, color, size) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.delete(`/api/cart/${id}`, { headers, data: { color, size } });

      const updatedCart = response.data;

      if (updatedCart && updatedCart.items) {
        setBagItems(normalizeCartItems(updatedCart.items));
        return { success: true };
      }
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

  return (
    <BagContext.Provider value={{ bagItems, setBagItems, addToBag, updateQuantity, removeItem, loadCart, loading, error }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => useContext(BagContext);

