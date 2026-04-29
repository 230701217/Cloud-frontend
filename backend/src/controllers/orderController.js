import Order from "../models/Order.js";
import User from "../models/user.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("USER ID:", userId);
    console.log("CART:", user.cart);

    if (!Array.isArray(user.cart) || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = user.cart.map((item) => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } }
      );
    }

    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const orders = await Order.find({ user: userId });
    
    // Sort in memory to avoid Cosmos DB indexing limitation
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};