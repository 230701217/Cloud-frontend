import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();

      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 My Orders</h2>

      {loading ? (
        <p style={styles.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={styles.empty}>No orders yet</p>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>

              {/* Header */}
              <div style={styles.header}>
                <h3>Order #{order._id.slice(-5)}</h3>
                <span style={styles.status}>Placed</span>
              </div>

              {/* Date */}
              <p style={styles.date}>
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Items */}
              <div style={styles.items}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.item}>
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={styles.footer}>
                <h3>₹{order.totalAmount}</h3>
                <button style={styles.button}>View</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

/* ---------- STYLES ---------- */
const styles = {
  container: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "gray",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    background: "#4caf50",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },
  date: {
    fontSize: "12px",
    color: "gray",
    margin: "5px 0 10px",
  },
  items: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "6px",
  },
  footer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: "6px 14px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};