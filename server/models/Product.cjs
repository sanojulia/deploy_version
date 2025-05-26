const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  originalPrice: Number,
  isSale: {
    type: Boolean,
    default: false
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    required: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isNewCollection: {
    type: Boolean,
    default: false
  },
  image: {
    main: {
      type: String,
      required: true
    },
    hover: {
      type: String,
      required: true
    }
  },  
  category: {
    type: String,
    required: true
  },
    createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const Product = mongoose.model( 'Product', productSchema);

module.exports = Product;