import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ProductForm.module.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
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
      await signup(form); // ✅ only call API

      alert("Signup successful! Please login."); // ✅ message
      navigate("/login"); // ✅ redirect to login

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Signup</h2>

      <div className={styles.inputGroup}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">Signup</button>
      </div>

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default Signup;