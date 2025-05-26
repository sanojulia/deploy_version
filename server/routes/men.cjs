const express = require("express");
const router = express.Router();
const Women = require("../models/Product.cjs");
const Product = require("../models/Product.cjs");
const verifyToken = require("../middleware/verifyToken.cjs");

// router.use(verifyToken);

// Get all men products
router.get("/", async (req, res) => {
  try {
    const men = await Product.find({ category: 'men' });
    console.log('Found men products:', men.length);
    res.json(men);
  } catch (error) {
    console.error('Error fetching men products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Women({ ...req.body, uid: req.uid });
    const saved = await newProduct.save();
    res.json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
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