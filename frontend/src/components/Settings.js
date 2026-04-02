import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚙️ Settings</h2>

      <div style={styles.card}>
        <h3>User Info</h3>

        <p><strong>Name:</strong> {user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      </div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Settings;

/* ✅ Simple styles */
const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  card: {
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    background: "#f3f4f6",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};