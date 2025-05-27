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
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

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
