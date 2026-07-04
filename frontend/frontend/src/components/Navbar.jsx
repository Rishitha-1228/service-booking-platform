import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <span>SC</span> SkillConnect Pro
        </Link>
      </div>

      {/* Navigation Links */}
      <div className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/services" onClick={() => setMenuOpen(false)}>
          Services
        </Link>

        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>

        <Link to="/booking" onClick={() => setMenuOpen(false)}>
          Bookings
        </Link>

        <Link to="/profile" onClick={() => setMenuOpen(false)}>
          Profile
        </Link>
      </div>

      {/* Buttons */}
      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>

      {/* Mobile Menu */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>
    </nav>
  );
}

export default memo(Navbar);