import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api";

const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false);
            navigate("/");
        } catch {
            alert("Logout failed");
        }
    };

    return (
        <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fafafa",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#333",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        🐶 Dog Matcher
      </Link>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </header>
    );
}

export default Header;