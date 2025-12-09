import "./layout.css";
import { Link, useLocation } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  // ✅ Read user from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";

  return (
    <div className="layout">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span style={{ fontSize: "24px", marginRight: "10px" }}>💼</span>
          <strong>FinHub</strong>
        </div>

        <nav className="menu">
          <Link to="/dashboard" className={`menu-item ${path === "/dashboard" ? "active" : ""}`}>
            📊 Dashboard
          </Link>

          <Link to="/analytics" className={`menu-item ${path === "/analytics" ? "active" : ""}`}>
            📈 Analytics
          </Link>

          <Link to="/wallet" className={`menu-item ${path === "/wallet" ? "active" : ""}`}>
            💳 Wallet
          </Link>

          <Link to="/market" className={`menu-item ${path === "/market" ? "active" : ""}`}>
            🌍 Market
          </Link>

          <Link to="/portfolio" className={`menu-item ${path === "/portfolio" ? "active" : ""}`}>
            📁 Portfolio
          </Link>

          <Link to="#" className="menu-item">💬 Chats</Link>
          <Link to="#" className="menu-item">👥 Community</Link>
          <Link to="#" className="menu-item">❓ Help & Support</Link>
          <Link to="#" className="menu-item">⚙ Settings</Link>
          <Link to="#" className="menu-item">👑 Go Premium</Link>
        </nav>

        <div className="logout-btn">🚪 Logout</div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content">
        <div className="header">
          {/* 👇 Dynamic Username */}
          <h2>Welcome, {username}! 👋</h2>

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="profile-pic"
          />
        </div>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
