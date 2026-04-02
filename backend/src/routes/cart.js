import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ====================== ADD ITEM TO CART ======================
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const qty = Number(quantity);
    const prodId = new mongoose.Types.ObjectId(productId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(prodId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.cart) user.cart = [];

    const existingItem = user.cart.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({
        productId: prodId,
        name: product.name,
        price: product.price,
        quantity: qty,
      });
    }

    await user.save();
    res.json(user.cart);

  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ====================== GET CART ======================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cart || []);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ====================== UPDATE CART ======================
router.put("/update", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (qty === 0) {
      user.cart = user.cart.filter(i => i.productId.toString() !== productId);
    } else {
      item.quantity = qty;
    }

    await user.save();
    res.json(user.cart);

  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ====================== CHECKOUT ======================
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.cart || user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    user.cart = [];
    await user.save();
    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;