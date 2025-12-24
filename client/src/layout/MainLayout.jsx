import "./layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <img
            src="/Logo.png"
            alt="TradeX"
            style={{
              height: "28px",
              width: "28px",
              marginRight: "10px",
              objectFit: "contain",
            }}
          />
          <strong>TradeX</strong>
        </div>

        <nav className="menu">
          <Link to="/dashboard" className={`menu-item ${path === "/dashboard" ? "active" : ""}`}>📊 Dashboard</Link>
          <Link to="/analytics" className={`menu-item ${path === "/analytics" ? "active" : ""}`}>📈 Analytics</Link>
          <Link to="/wallet" className={`menu-item ${path === "/wallet" ? "active" : ""}`}>💳 Wallet</Link>
          <Link to="/market" className={`menu-item ${path === "/market" ? "active" : ""}`}>🌍 Market</Link>
          <Link to="/portfolio" className={`menu-item ${path === "/portfolio" ? "active" : ""}`}>📁 Portfolio</Link>

          <Link to="#" className="menu-item">💬 Chats</Link>
          <Link to="#" className="menu-item">👥 Community</Link>
          <Link to="#" className="menu-item">❓ Help & Support</Link>
          <Link to="#" className="menu-item">⚙ Settings</Link>
          <Link to="#" className="menu-item">👑 Go Premium</Link>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </div>
      </aside>

      <main className="content">
        <div className="header">
          <h2>Welcome, {username}! 👋</h2>
          <img src="https://i.pravatar.cc/40" alt="profile" className="profile-pic" />
        </div>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
