import "./layout.css"
import { Link, useLocation } from "react-router-dom"

function MainLayout({ children }) {
  const location = useLocation(); // 👈 detect current route
  const path = location.pathname;

  return (
    <div className="layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span style={{ fontSize: "24px", marginRight: "10px" }}>💼</span>
          <strong>FinHub</strong>
        </div>

        <nav className="menu">

          <Link
            to="/dashboard"
            className={`menu-item ${path === "/dashboard" ? "active" : ""}`}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/analytics"
            className={`menu-item ${path === "/analytics" ? "active" : ""}`}
          >
            📈 Analytics
          </Link>

          <Link to="#" className="menu-item">💳 Wallet</Link>

          <Link to="#" className="menu-item">🧾 Invoice</Link>

          <Link
            to="/portfolio"
            className={`menu-item ${path === "/portfolio" ? "active" : ""}`}
          >
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
          <h2>Welcome, Krish! 👋</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search assets..."
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                color: "#fff",
              }}
            />
          </div>

          <img src="https://i.pravatar.cc/40" alt="profile" className="profile-pic" />
        </div>

        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default MainLayout;
