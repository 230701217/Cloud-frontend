// frontend/src/components/ProductList.js

import React, { useState, useEffect } from "react";
import {
  getProducts,
  deleteProduct,
  addToCart,
} from "../services/api";
import ProductForm from "./ProductForm";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const handleAddToCart = async (productId) => {
    if (!token) return alert("Login first");
    try {
      await addToCart({ productId, quantity: 1 }, token);
      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Filter + Sort
  useEffect(() => {
    let temp = [...products];

    if (search) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price-asc") temp.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") temp.sort((a, b) => b.price - a.price);

    setFilteredProducts(temp);
    setCurrentPage(1); // reset page when filtering
  }, [search, sort, products]);

  // ✅ Pagination Logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <ProductForm
        selectedProduct={selectedProduct}
        onFormSubmit={fetchProducts}
        clearSelection={() => setSelectedProduct(null)}
      />

      {/* Controls */}
      <div className={styles.controls}>
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className={styles.grid}>
        {currentProducts.length === 0 ? (
          <div className={styles.noProducts}>
            No products found
          </div>
        ) : (
          currentProducts.map((p) => (
            <div
              key={p._id}
              className={`${styles.card} ${
                p.quantity < 5 ? styles.lowStock : ""
              }`}
            >
              <h3>
                {p.name}
                {p.quantity < 5 && (
                  <span className={styles.badge}>Low</span>
                )}
              </h3>

              <p>₹{p.price}</p>
              <p>Stock: {p.quantity}</p>

              <div className={styles.actions}>
                <button
                  className={styles.edit}
                  onClick={() => setSelectedProduct(p)}
                >
                  Edit
                </button>

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>

                <button
                  className={styles.edit}
                  onClick={() => handleAddToCart(p._id)}
                >
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Pagination UI */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1
                  ? styles.activePage
                  : ""
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;