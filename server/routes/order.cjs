const express = require("express");
const router = express.Router();
const Order = require("../models/Order.cjs");
const Cart = require("../models/Cart.cjs");
const Product = require("../models/Product.cjs");
const auth = require('../middleware/verifyToken.cjs'); // Authentication middleware

// POST /api/order - Create a new order from user's cart
router.post("/", auth, async (req, res) => {
  try {
    // Extract delivery and payment information from request body
    const { deliveryInfo, paymentMethod } = req.body; // paymentMethod might contain type like 'Card'

    // Validate all required delivery information fields
    if (!deliveryInfo || 
        !deliveryInfo.firstName || 
        !deliveryInfo.lastName || 
        !deliveryInfo.phoneNumber || 
        !deliveryInfo.address || 
        !deliveryInfo.address.addressLine1 || 
        !deliveryInfo.address.city || 
        !deliveryInfo.address.postcode || 
        !deliveryInfo.address.country) {
      return res.status(400).json({ error: 'Missing required delivery information.' });
    }

    // Get user's cart with populated product details
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');

    // Verify cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Cannot place order.' });
    }

    // Transform cart items into order items format
    const orderItems = cart.items.map(item => {
      if (!item.productId) {
        // Handle case where product might have been deleted
        throw new Error(`Product details missing for an item in cart. ProductId: ${item.productId_raw || 'unknown'}`);
      }
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price, // Use current price from Product model
        quantity: item.quantity,
        color: item.color,
        size: item.size
      };
    });

    // Calculate total order amount from all items
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryInfo: deliveryInfo,
      paymentInfo: {
        method: (paymentMethod && paymentMethod.type) ? paymentMethod.type : 'Card', // Extract type or default
        status: 'Pending' // Initial payment status
      },
      status: 'Pending' // Initial order status
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Clear the cart after successful order placement
    await Cart.findOneAndUpdate({ userId: req.user.userId }, { $set: { items: [], total: 0 } });

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error('Error creating order:', error);
    // Check for specific error types if needed, e.g., validation errors from Mongoose
    if (error.message.includes('Product details missing')) {
        return res.status(500).json({ error: 'Failed to create order due to inconsistent product data. Please try again or contact support.' });
    }
    res.status(500).json({ error: 'Failed to create order. ' + error.message });
  }
});



module.exports = router;
