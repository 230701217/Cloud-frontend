import React, { useEffect, useState } from "react";
import {
  getCart,
  updateCart,
  placeOrder, // ✅ NEW
} from "../services/api";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // 🔄 Fetch cart
  const fetchCart = async () => {
    try {
      const { data } = await getCart(); // ✅ token removed
      setCart(data || []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔄 Update quantity
  const handleQuantity = async (productId, quantity) => {
    try {
      await updateCart({
        productId,
        quantity: Number(quantity),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 🛒 PLACE ORDER (NEW 🔥)
  const handlePlaceOrder = async () => {
    try {
      await placeOrder();

      alert("✅ Order Placed Successfully!");

      fetchCart(); // refresh cart (will be empty)
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  // 💰 Total calculation
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Cart</h2>

      {cart.length === 0 && (
        <p className={styles.empty}>Your cart is empty</p>
      )}

      {cart.map((item) => (
        <div key={item.productId} className={styles.cartItem}>
          <div className={styles.details}>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.price}>₹{item.price}</p>
          </div>

          <input
            className={styles.quantity}
            type="number"
            value={item.quantity}
            min="1"
            onChange={(e) =>
              handleQuantity(item.productId, e.target.value)
            }
          />
        </div>
      ))}

      <h3 className={styles.total}>Total: ₹{total}</h3>

      <button
        className={styles.button}
        onClick={handlePlaceOrder} // ✅ UPDATED
        disabled={cart.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;