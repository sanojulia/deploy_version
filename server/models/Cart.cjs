const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  color: {
    type: String,
    required: true,
    default: "default"
  },
  size: {
    type: String,
    required: true,
    default: "default"
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
