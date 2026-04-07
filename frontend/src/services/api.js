import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// 🔥 Attach token automatically to ALL requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔐 AUTH
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// 📦 PRODUCTS
export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

// 🛒 CART
export const getCart = () => API.get("/cart");

export const addToCart = (data) =>
  API.post("/cart/add", data);

export const updateCart = (data) =>
  API.put("/cart/update", data);

export const checkoutCart = () =>
  API.post("/cart/checkout");

// 🛍️ ORDERS (NEW 🔥)
export const placeOrder = () =>
  API.post("/orders/place");

export const getMyOrders = () =>
  API.get("/orders/my-orders");

export default API;