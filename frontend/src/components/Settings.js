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

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    background: "var(--glass-bg-solid)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "20px",
    boxShadow: "var(--glass-shadow)",
    border: "1px solid var(--glass-border)",
    color: "white",
    animation: "fadeIn 0.5s ease",
  },
  heading: {
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
    textAlign: "center",
  },
  card: {
    marginBottom: "30px",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  logoutBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, var(--danger), #b91c1c)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    transition: "all 0.2s ease",
  },
};