const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// Simplified CORS configuration for debugging
const corsOptions = {
  origin: '*', // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Use the MongoDB URI from environment variables
console.log('Attempting to connect to MongoDB...');

// Try a simpler connection approach
const { MongoClient } = require('mongodb');
let db;

// Function to connect to MongoDB directly
async function connectToMongoDB() {
  try {
    console.log('Connecting to MongoDB with direct driver...');
    const client = new MongoClient(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      // Simplified options
    });
    
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    // Get the database name from the connection string or use default
    const dbName = process.env.MONGO_URI.split('/').pop() || 'jusastore';
    db = client.db(dbName);
    
    // Test the connection
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    // Set up mongoose with the established connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Use minimal options
    });
    
    console.log('Mongoose connected using established connection');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Will retry in 5 seconds...');
    setTimeout(connectToMongoDB, 5000);
    return false;
  }
}

// Start the connection process
connectToMongoDB();

// The products.cjs route file handles filtering by category based on the route path
app.use("/api/women", require("./routes/products.cjs"));
app.use("/api/men", require("./routes/products.cjs"));
app.use("/api/sale", require("./routes/products.cjs"));
app.use("/api/products", require("./routes/products.cjs"));
app.use("/api/new-in", require("./routes/products.cjs"));
app.use("/api/product", require("./routes/productById.cjs"));
app.use("/api/user", require("./routes/user.cjs"));
app.use("/api/cart", require("./routes/cart.cjs"));
app.use("/api/orders", require("./routes/order.cjs"));

// Root route handler
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API. Use /api/products, /api/women, etc. to access data." });
});
// Use PORT from environment variable or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
