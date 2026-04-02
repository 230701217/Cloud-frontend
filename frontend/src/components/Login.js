// frontend/src/components/Login.js
import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ProductForm.module.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login(form);

      // ✅ Store token
      localStorage.setItem("token", data.token);

      // ✅ Store full user object (IMPORTANT 🔥)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Store role (optional, you already had this)
      localStorage.setItem("role", data.user.role);

      // ✅ Redirect
      navigate("/user/products");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Login</h2>

      <div className={styles.inputGroup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">Login</button>
      </div>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;