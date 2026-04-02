import express from "express";
import { placeOrder, getMyOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
console.log("✅ orderRoutes file loaded");
const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
console.log("Order route file working");
export default router;