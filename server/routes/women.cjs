const express = require("express");
const router = express.Router();
const Product = require("../models/Product.cjs");
const verifyToken = require("../middleware/verifyToken.cjs");

// Get all women products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ category: 'women' });
    console.log('Found women products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error fetching women products:', error);
    res.status(500).json({ error: error.message });
  }
});


// Create a new product
router.post("/", async (req, res) => {
  try {
    // Ensure the product has the correct category
    const productData = {
      ...req.body,
      category: 'women'
    };
    
    const newProduct = new Product(productData);
    const saved = await newProduct.save();
    
    console.log('Product created successfully:', saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: error.message,
      details: error 
    });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Women.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Women.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;