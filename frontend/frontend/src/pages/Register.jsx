import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const user = { name, email, password, bookings: [] };

    localStorage.setItem("user", JSON.stringify(user));

    // Clear previous user's data
    localStorage.removeItem("bookings");
    localStorage.removeItem("paymentStatus");
    localStorage.removeItem("currentUser");

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-eyebrow">Get started</span>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Book trusted professionals in minutes.
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="sc-btn sc-btn--primary auth-submit">
            Create account
          </button>
        </form>

        <p className="auth-bottom-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;