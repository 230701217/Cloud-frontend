import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Settings from "./components/Settings";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Orders from "./components/Orders";

import styles from "./App.module.css";
import { FaBars, FaBox, FaClipboardList, FaCog, FaReceipt } from "react-icons/fa";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/user/products" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/user/*"
          element={
            <PrivateRoute>
              <div className={styles.dashboard}>

                {/* ✅ SIDEBAR */}
                <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
                  
                  <div className={styles.top}>
                    <h2>{collapsed ? "CA" : "CloudApp"}</h2>
                    <FaBars className={styles.toggle} onClick={toggleSidebar} />
                  </div>

                  <ul className={styles.menu}>
                    <li>
                      <NavLink to="/user/products" className={({ isActive }) =>
                        `${styles.menuItem} ${isActive ? styles.active : ""}`
                      }>
                        <FaBox />
                        {!collapsed && <span>Products</span>}
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/user/cart" className={({ isActive }) =>
                        `${styles.menuItem} ${isActive ? styles.active : ""}`
                      }>
                        <FaClipboardList />
                        {!collapsed && <span>Cart</span>}
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/user/orders" className={({ isActive }) =>
                        `${styles.menuItem} ${isActive ? styles.active : ""}`
                      }>
                        <FaReceipt />
                        {!collapsed && <span>Orders</span>}
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/user/settings" className={({ isActive }) =>
                        `${styles.menuItem} ${isActive ? styles.active : ""}`
                      }>
                        <FaCog />
                        {!collapsed && <span>Settings</span>}
                      </NavLink>
                    </li>
                  </ul>
                </aside>

                {/* MAIN */}
                <main className={styles.main}>
                  <header className={styles.header}>
                    <h1>Cloud Product Dashboard</h1>
                  </header>

                  <div className={styles.content}>
                    <Routes>
                      <Route path="products" element={<ProductList />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="settings" element={<Settings />} />
                      <Route index element={<Navigate to="products" />} />
                    </Routes>
                  </div>
                </main>

              </div>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;