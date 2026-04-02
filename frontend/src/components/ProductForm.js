// frontend/src/components/ProductForm.js
import React, { useState, useEffect } from "react";
import styles from "./ProductForm.module.css"; // ✅ IMPORT CSS MODULE
import {
  createProduct,
  updateProduct,
} from "../services/api";

const ProductForm = ({
  selectedProduct,
  onFormSubmit,
  clearSelection,
}) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (selectedProduct) setForm(selectedProduct);
  }, [selectedProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProduct) {
      await updateProduct(selectedProduct._id, form);
    } else {
      await createProduct(form);
    }

    onFormSubmit();
    clearSelection();
    setForm({ name: "", price: "", quantity: "" });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{selectedProduct ? "Update Product" : "Add Product"}</h2>

      <div className={styles.inputGroup}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">
          {selectedProduct ? "Update" : "Add"}
        </button>

        {selectedProduct && (
          <button
            type="button"
            className={styles.cancel}
            onClick={clearSelection}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;