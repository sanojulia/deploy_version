// Import required modules
const express = require("express");
const router = express.Router();
const Product = require("../models/Product.cjs");

// GET /api/products - Get all products with optional category filtering
router.get("/", async (req, res) => {
  try {
    // Build query based on route path
    let query = {};

    // Filter products based on URL path
    if (req.baseUrl.includes("/women")) {
      query.category = "women";
    } else if (req.baseUrl.includes("/men")) {
      query.category = "men";
    } else if (req.baseUrl.includes("/sale")) {
      query.isSale = true;
    } else if (req.baseUrl.includes("/new-in")) {
      query.isNew = true;
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/search - Search products by query text
router.get("/search", async (req, res) => {
  // Extract search query from request
  const { q } = req.query;

  // Validate search query
  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Please enter search text' });
  }

  try {
    // Search across multiple fields with case-insensitive regex
    const results = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },        // Search in product name
        { brand: { $regex: q, $options: 'i' } },       // Search in brand name
        { type: { $regex: q, $options: 'i' } },        // Search in product type
        { description: { $regex: q, $options: 'i' } }  // Search in description
      ]
    });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk create/update products
router.post("/bulk", async (req, res) => {
  try {
    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Create new products
    const products = await Product.insertMany(req.body);
    console.log(`Successfully created ${products.length} products`);
    
    res.status(201).json({
      message: 'Products created successfully',
      products: products
    });
  } catch (error) {
    console.error('Error creating products:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate key error',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create products',
      details: error.message 
    });
  }
});

module.exports = router;
