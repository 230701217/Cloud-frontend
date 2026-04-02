import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#4f46e5",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white" }}>Home</Link>
      <Link to="/cart" style={{ color: "white" }}>Cart</Link>

      {!token && (
        <>
          <Link to="/login" style={{ color: "white" }}>Login</Link>
          <Link to="/signup" style={{ color: "white" }}>Signup</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;