import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

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

  const openInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const closeInvoice = () => {
    setShowInvoice(false);
    setSelectedOrder(null);
  };

  const downloadInvoice = () => {
    if (!selectedOrder) return;

    const itemsHtml = selectedOrder.items
      .map(
        (item) => `<tr>
          <td>${item.name}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${formatCurrency(item.price)}</td>
          <td style="text-align:right">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
      )
      .join("");

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice ${selectedOrder._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            .invoice-wrapper { max-width: 800px; margin: auto; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
            .invoice-title { font-size: 28px; margin: 0; }
            .invoice-meta { text-align: right; }
            .invoice-meta p { margin: 4px 0; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px 10px; border-bottom: 1px solid #ddd; }
            th { background: #f6f8fb; text-align: left; }
            .total-row td { border-top: 2px solid #333; font-weight: 700; }
            .status-chip { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #4caf50; color: #fff; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <div class="invoice-header">
              <div>
                <h1 class="invoice-title">Invoice</h1>
                <p>Order #${selectedOrder._id.slice(-5)}</p>
              </div>
              <div class="invoice-meta">
                <p><strong>Date:</strong> ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status-chip">Placed</span></p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center">Qty</th>
                  <th style="text-align:right">Price</th>
                  <th style="text-align:right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colSpan="3">Grand Total</td>
                  <td style="text-align:right">${formatCurrency(selectedOrder.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
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
              <div style={styles.header}>
                <h3>Order #{order._id.slice(-5)}</h3>
                <span style={styles.status}>Placed</span>
              </div>

              <p style={styles.date}>{new Date(order.createdAt).toLocaleString()}</p>

              <div style={styles.items}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.item}>
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} × {formatCurrency(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.footer}>
                <h3>{formatCurrency(order.totalAmount)}</h3>
                <button
                  style={styles.button}
                  onClick={() => openInvoice(order)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showInvoice && selectedOrder && (
        <div style={styles.invoiceOverlay}>
          <div style={styles.invoiceModal}>
            <div style={styles.invoiceHeader}>
              <div>
                <h2>Invoice</h2>
                <p style={styles.invoiceOrder}>Order #{selectedOrder._id.slice(-5)}</p>
              </div>
              <button style={styles.closeButton} onClick={closeInvoice}>
                Close
              </button>
            </div>

            <div style={styles.invoiceBody}>
              <div style={styles.invoiceRow}>
                <div>
                  <p style={styles.label}>Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p style={styles.label}>Status</p>
                  <span style={styles.status}>Placed</span>
                </div>
              </div>

              <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                  <span>Item</span>
                  <span style={styles.tableCenter}>Qty</span>
                  <span style={styles.tableRight}>Price</span>
                  <span style={styles.tableRight}>Total</span>
                </div>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={styles.tableRow}>
                    <span>{item.name}</span>
                    <span style={styles.tableCenter}>{item.quantity}</span>
                    <span style={styles.tableRight}>{formatCurrency(item.price)}</span>
                    <span style={styles.tableRight}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={styles.totalRow}>
                <span>Total</span>
                <span style={styles.totalAmount}>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div style={styles.invoiceFooter}>
              <button style={styles.downloadButton} onClick={downloadInvoice}>
                Download PDF
              </button>
            </div>
          </div>
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
  invoiceOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },
  invoiceModal: {
    width: "100%",
    maxWidth: "780px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  invoiceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "24px",
    borderBottom: "1px solid #eee",
  },
  invoiceOrder: {
    margin: "8px 0 0",
    color: "#555",
  },
  closeButton: {
    background: "transparent",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  invoiceBody: {
    padding: "24px",
  },
  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  label: {
    margin: 0,
    fontSize: "12px",
    color: "#888",
  },
  tableWrapper: {
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    background: "#f6f8fb",
    padding: "14px 18px",
    fontWeight: 700,
    color: "#333",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    padding: "14px 18px",
    borderTop: "1px solid #eee",
    color: "#444",
  },
  tableCenter: {
    textAlign: "center",
  },
  tableRight: {
    textAlign: "right",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    padding: "0 4px 20px",
    fontWeight: 700,
    fontSize: "18px",
  },
  totalAmount: {
    color: "#0b246f",
  },
  invoiceFooter: {
    padding: "20px 24px 24px",
    borderTop: "1px solid #eee",
    textAlign: "right",
  },
  downloadButton: {
    padding: "12px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};