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
console.log('MongoDB URI (masked):', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/.+@/, '//***:***@') : 'undefined');

// Set up mongoose connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 90000, // Increase socket timeout to 90 seconds
    connectTimeoutMS: 60000, // Increase connection timeout to 60 seconds
    heartbeatFrequencyMS: 30000, // Check server status every 30 seconds
    retryWrites: true, // Enable retryable writes
    maxPoolSize: 10, // Increase connection pool size
    minPoolSize: 5 // Minimum connections in the pool
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Test the connection by listing collections
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('Available collections:', collections.map(c => c.name).join(', '));
      })
      .catch(err => console.error('Error listing collections:', err));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  });
};

// Initial connection attempt
connectWithRetry();

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
  connectWithRetry();
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

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
