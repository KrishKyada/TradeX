import { useState } from "react";
import axios from "axios";
import "../index.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED ERROR LOGIC
  const isError =
    message &&
    (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("wrong") ||
      message.toLowerCase().includes("exist") ||
      message.toLowerCase().includes("failed")
    );

  return (
    <div className="auth-container register-page">

      {/* Animated background */}
      <div className="crypto-bg">
        <div className="floating-coin coin-1">💰</div>
        <div className="floating-coin coin-2">📈</div>
        <div className="floating-coin coin-3">⚡</div>
      </div>

      <div className="grid-background"></div>

      <div className="auth-wrapper">

        {/* LEFT SIDE */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="benefits-section">
              <h2>Start Trading Today</h2>
              <p>Join thousands of investors managing their crypto & stock portfolios</p>

              <div className="benefits-list">
                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <div>
                    <h3>Real-time Analytics</h3>
                    <p>Live market data and portfolio tracking</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <div>
                    <h3>Secure Vault</h3>
                    <p>Bank-level encryption for your assets</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <div>
                    <h3>Smart Alerts</h3>
                    <p>Price notifications and market insights</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <div>
                    <h3>24/7 Support</h3>
                    <p>Dedicated customer service team</p>
                  </div>
                </div>
              </div>

              <div className="market-stats">
                <div className="market-stat">
                  <div className="stat-number">$1.2T</div>
                  <div className="stat-desc">Market Cap</div>
                </div>

                <div className="market-stat">
                  <div className="stat-number">50M+</div>
                  <div className="stat-desc">Coins Tracked</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-form-container">
          <div className="form-card register-card">

            <div className="form-header">
              <h2>Create Your Account</h2>
              <p>Join the investment revolution</p>
            </div>

            {message && (
              <div className={`message ${isError ? "error" : "success"}`}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} className="register-form">

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="password">Create Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
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
                <small className="password-hint">Min. 8 characters with mix of letters & numbers</small>
              </div>

              <div className="terms-check">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to Terms of Service and Privacy Policy</label>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            <div className="form-divider">OR</div>

            <div className="social-login">
              <button type="button" className="social-btn">
                <span>🔗</span> Sign up with Wallet
              </button>
            </div>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <a href="/" className="link">
                  Login here
                </a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
