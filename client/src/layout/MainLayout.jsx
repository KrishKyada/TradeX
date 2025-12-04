import "./layout.css";
import { Link } from "react-router-dom";

function MainLayout({ children }) {
  return (
    <div className="layout">
      
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">Finance</div>

        <nav className="menu">
          <Link to="/dashboard" className="menu-item active">📊 Dashboard</Link>
          <Link to="#" className="menu-item">📈 Analytics</Link>
          <Link to="#" className="menu-item">💳 Wallet</Link>
          <Link to="#" className="menu-item">🧾 Invoice</Link>
          <Link to="#" className="menu-item">📁 Portfolio</Link>
          <Link to="#" className="menu-item">💬 Chats</Link>
          <Link to="#" className="menu-item">👥 Community</Link>
          <Link to="#" className="menu-item">❓ Help & Support</Link>
          <Link to="#" className="menu-item">⚙ Settings</Link>
        </nav>

        <div className="logout-btn">🚪 Logout</div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content">
        
        {/* TOP HEADER */}
        <div className="header">
          <h2>Welcome, Krish!</h2>

          <div className="search-box">
            <input type="text" placeholder="Search your items..." />
          </div>

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="profile-pic"
          />
        </div>

        {/* MAIN PAGE CONTENT */}
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
