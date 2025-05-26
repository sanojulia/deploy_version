const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use("/api/women", require("./routes/products.cjs"));
app.use("/api/men", require("./routes/products.cjs"));
app.use("/api/sale", require("./routes/products.cjs"));
app.use("/api/products", require("./routes/products.cjs"));
app.use("/api/new-in", require("./routes/products.cjs"));
app.use("/api/product", require("./routes/productById.cjs"));
app.use("/api/user", require("./routes/user.cjs"));
app.use("/api/cart", require("./routes/cart.cjs"));
app.use("/api/orders", require("./routes/order.cjs"));
app.listen(5000, () => console.log("Server running on port 5000"));