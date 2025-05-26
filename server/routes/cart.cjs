const express = require("express");
const router = express.Router();
const Product = require("../models/Product.cjs");
const Cart = require("../models/Cart.cjs");
const auth = require("../middleware/verifyToken.cjs");

// GET /api/cart - Retrieve user's cart with populated product details
router.get("/", auth, async (req, res) => {
  try {
    // Find user's cart and populate product details
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) {
      // Return empty cart if not found
      return res.json({ items: [], total: 0 });
    }
    // Return populated cart
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart - Add item to cart with product, quantity, color and size
router.post("/", auth, async (req, res) => {
  try {
    // Extract item details with defaults for optional fields
    const { productId, quantity = 1, color = 'default', size = 'default' } = req.body;

    // Find product by ID
    const product = await Product.findById(productId);
    if (!product) {
      // Return error if product not found
      return res.status(404).json({ error: "Product not found" });
    }

    // Find user's cart or create new one if not found
    let cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [], total: 0 });
    }

    // Check if item with same product, color and size already exists in cart
    const existingItem = cart.items.find(item =>
      item.productId.equals(productId) &&
      item.color === color &&
      item.size === size
    );

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity, color, size });
    }

    // Save updated cart
    await cart.save();

    // Recalculate cart total
    const populatedCart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    populatedCart.total = populatedCart.items.reduce((sum, item) => {
      const itemPrice = item.productId?.price || 0;
      const itemQuantity = item.quantity || 0;
      return sum + itemPrice * itemQuantity;
    }, 0);

    // Save updated cart total
    await populatedCart.save();
    // Return updated cart
    res.json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart - Clear all items from user's cart
router.delete("/", auth, async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) {
      // Return empty cart if not found
      return res.json({ items: [], total: 0 });
    }
    // Clear cart items
    cart.items = [];
    cart.total = 0;
    // Save updated cart
    await cart.save();
    // Return updated cart
    res.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart/:productId - Update quantity of specific item in cart
router.put("/:productId", auth, async (req, res) => {
  try {
    // Extract item ID and quantity from request
    const { productId } = req.params;
    const { quantity, color = 'default', size = 'default' } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find(item => {
      const itemProductId = item.productId._id || item.productId;
      return itemProductId.equals(productId) &&
      item.color === color &&
      item.size === size
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/:productId - Remove specific item from cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { color , size } = req.body;

    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(item =>
      !(item.productId.equals(productId) && item.color === color && item.size === size)
    );
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



