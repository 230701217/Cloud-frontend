import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import auth from "../middleware/auth.js";          // JWT protection
import adminMiddleware from "../middleware/adminMiddleware.js"; // Admin-only

const router = express.Router();

// ====================== ADMIN ONLY ======================
// Create product
router.post("/", auth, adminMiddleware, createProduct);

// Update product
router.put("/:id", auth, adminMiddleware, updateProduct);

// Delete product
router.delete("/:id", auth, adminMiddleware, deleteProduct);

// ====================== PUBLIC ======================
// Get all products
router.get("/", getProducts);

export default router;