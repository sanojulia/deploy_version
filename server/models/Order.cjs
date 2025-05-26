const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  color: {
    type: String,
    required: false 
  },
  size: {
    type: String,
    required: false 
  }
}, { _id: false });

const deliveryInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, required: true }
  }
}, { _id: false });

const paymentInfoSchema = new mongoose.Schema({
  method: { type: String, required: true, default: 'Card' }, // e.g., 'Card', 'PayPal'
  status: { type: String, required: true, default: 'Pending' }, // e.g., 'Pending', 'Paid', 'Failed'
  transactionId: { type: String } // Optional: for storing payment gateway transaction ID
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryInfo: {
    type: deliveryInfoSchema,
    required: true
  },
  paymentInfo: {
    type: paymentInfoSchema,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
