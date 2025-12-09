import { useState } from "react";
import axios from "axios";
import "../index.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED ERROR LOGIC (same as Register)
  const isError =
    message &&
    (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("wrong") ||
      message.toLowerCase().includes("not") ||
      message.toLowerCase().includes("failed")
    );

  return (
    <div className="auth-container login-page">

      <div className="crypto-bg">
        <div className="floating-coin coin-1">₿</div>
        <div className="floating-coin coin-2">Ξ</div>
        <div className="floating-coin coin-3">◆</div>
      </div>

      <div className="grid-background"></div>

      <div className="auth-wrapper">

        <div className="auth-brand">
          <div className="brand-content">
            <div className="crypto-icon">
              <svg viewBox="0 0 100 100" className="chart-animation">
                <polyline points="10,70 30,40 50,55 70,20 90,35" />
                <circle cx="30" cy="40" r="3" />
                <circle cx="50" cy="55" r="3" />
                <circle cx="70" cy="20" r="3" />
              </svg>
            </div>

            <h1>CryptoVault</h1>
            <p>Your Premium Stock & Crypto Portfolio</p>

            <div className="ticker-list">
              <div className="ticker-item up">BTC ↑ 42,520 USD</div>
              <div className="ticker-item down">ETH ↓ 2,245 USD</div>
              <div className="ticker-item up">AAPL ↑ 185.42</div>
            </div>

            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value">$2.4M</div>
                <div className="stat-label">Total Volume</div>
              </div>
              <div className="stat">
                <div className="stat-value">15.2K</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Access your portfolio instantly</p>
            </div>

            {/* 🔥 FIXED MESSAGE */}
            {message && (
              <div className={`message ${isError ? "error" : "success"}`}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="form-divider">OR</div>

            <div className="social-login">
              <button type="button" className="social-btn">
                <span>🔗</span> Connect Wallet
              </button>
            </div>

            <div className="form-footer">
              <p>
                New to CryptoVault?{" "}
                <a href="/register" className="link">
                  Create Account
                </a>
              </p>
              <a href="#" className="link">
                Forgot Password?
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
