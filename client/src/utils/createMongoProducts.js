import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Replace this with your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/jusastore';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Product data to insert
const products = [
  {
    id: 1,
    name: "Elegant Blouse",
    brand: "JUSA Pro",
    description: "Elevate your wardrobe with the timeless sophistication of the Elegant Blouse...",
    price: 89.99,
    originalPrice: 99.99,
    isSale: true,
    colors: ["Beige"],
    sizes: ["XS", "S", "M", "L"],
    type: "Blouses",
    isNew: true,
    isNewCollection: true,
    image: {
      main: '/images/women/d1-1.jpg',
      hover: '/images/women/d1-2.jpg',
    },
  }

];

// Function to insert products
async function insertProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log('Inserted products:', insertedProducts.length);
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the function
insertProducts();