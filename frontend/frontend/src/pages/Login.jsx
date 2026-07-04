import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-frame">
        <div className="auth-card">
          <div className="auth-crest">
            <span>SC</span>
          </div>

          <span className="auth-eyebrow">Welcome back</span>
          <h1>Log in to your account</h1>
          <p className="auth-subtitle">
            Pick up right where you left off with your bookings.
          </p>

          <div className="auth-rule" />

          <form onSubmit={handleLogin} className="auth-form">
            <label className="auth-field">
              <span className="auth-field-label">
                <span>Email address</span>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span className="auth-field-label">
                <span>Password</span>
                <Link to="/forgot-password" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </span>
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="sc-btn sc-btn--primary auth-submit">
              Log In
            </button>
          </form>

          <p className="auth-bottom-text">
            New to SkillConnect Pro? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
      <p className="auth-fine-print">Est. 2024 · Trusted by 1,200+ professionals</p>
    </div>
  );
}

export default Login;