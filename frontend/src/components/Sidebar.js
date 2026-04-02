import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBox, FaShoppingCart, FaClipboardList, FaCog, FaBars } from "react-icons/fa";
import "./Sidebar.css";
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menu = [
    { name: "Products", path: "/products", icon: <FaBox /> },
    { name: "Cart", path: "/cart", icon: <FaShoppingCart /> },
    { name: "Orders", path: "/orders", icon: <FaClipboardList /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && <h2>CloudApp</h2>}
        <FaBars className="toggle-btn" onClick={() => setCollapsed(!collapsed)} />
      </div>

      {/* Menu */}
      <div className="menu">
        {menu.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="text">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;