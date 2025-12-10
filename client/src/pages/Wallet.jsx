import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const token = localStorage.getItem("token");

  // --- LOGIC (Unchanged) ---
  const fetchWallet = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setWallet({
        balance: data.balance ?? 0,
        totalAdded: data.totalAdded ?? 0,
        totalWithdrawn: data.totalWithdrawn ?? 0,
        netGrowth: (data.totalAdded ?? 0) - (data.totalWithdrawn ?? 0),
        history: data.history ?? [],
        chartData: data.chartData ?? [],
      });
    } catch (err) {
      console.error("WALLET GET ERROR:", err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const addMoney = async () => {
    if (!amount) return;
    const amt = Number(amount);
    if (amt <= 0) return;
    const prev = { ...wallet };
    setWallet((w) => ({
      ...w,
      balance: w.balance + amt,
      totalAdded: w.totalAdded + amt,
      netGrowth: w.totalAdded + amt - w.totalWithdrawn,
    }));
    setAmount("");
    try {
      await axios.post(
        "http://localhost:5000/api/wallet/add",
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
    } catch (err) {
      console.error("ADD ERROR:", err);
      setWallet(prev);
    }
  };

  const withdrawMoney = async () => {
    if (!amount) return;
    const amt = Number(amount);
    if (amt <= 0) return;
    if (wallet.balance < amt) {
      alert("Insufficient balance");
      return;
    }
    const prev = { ...wallet };
    setWallet((w) => ({
      ...w,
      balance: w.balance - amt,
      totalWithdrawn: w.totalWithdrawn + amt,
      netGrowth: w.totalAdded - (w.totalWithdrawn + amt),
    }));
    setAmount("");
    try {
      await axios.post(
        "http://localhost:5000/api/wallet/withdraw",
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
    } catch (err) {
      console.error("WITHDRAW ERROR:", err);
      setWallet(prev);
    }
  };

  if (!wallet)
    return (
      <MainLayout>
        <div style={styles.loaderContainer}>
          <div className="spinner" style={styles.spinner}></div>
        </div>
      </MainLayout>
    );

  const history = wallet.history || [];
  const chart = wallet.chartData || [];

  return (
    <MainLayout>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade { animation: fadeIn 0.6s ease-out forwards; }
          .glass-panel {
            background: rgba(20, 20, 30, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          }
          /* Custom Scrollbar */
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        `}
      </style>

      <div style={styles.pageContainer} className="animate-fade">
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Wallet Overview</h1>
          </div>
          <div style={styles.badge}>Live Net</div>
        </header>

        {/* --- GRID LAYOUT --- */}
        <div style={styles.grid}>
          
          {/* LEFT COLUMN: Card, Action, ANALYTICS */}
          <div style={styles.colLeft}>
            
            {/* 1. DIGITAL CARD */}
            <div style={styles.creditCard}>
              <div style={styles.cardOverlay}></div>
              <div style={styles.cardTop}>
                <span style={{ fontSize: "22px" }}>💳</span>
                <span style={styles.cardChip}></span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.cardLabel}>Balance</span>
                <h2 style={styles.cardBalance}>₹ {wallet.balance.toLocaleString()}</h2>
              </div>
              <div style={styles.cardFooter}>
                <span>**** **** **** 4288</span>
                <span>12/28</span>
              </div>
            </div>

            {/* 2. ACTION PANEL */}
            <div className="glass-panel" style={styles.actionPanel}>
              <div style={styles.tabContainer}>
                <button
                  style={activeTab === "add" ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab("add")}
                >
                  Deposit
                </button>
                <button
                  style={activeTab === "withdraw" ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab("withdraw")}
                >
                  Withdraw
                </button>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                />
              </div>

              <button
                onClick={activeTab === "add" ? addMoney : withdrawMoney}
                style={activeTab === "add" ? styles.btnPrimary : styles.btnDanger}
              >
                {activeTab === "add" ? "Add Funds" : "Withdraw"}
              </button>
            </div>

            {/* 3. ANALYTICS (Moved to Left) */}
            <div className="glass-panel" style={styles.chartPanel}>
              <div style={styles.chartHeader}>
                <h3 style={styles.sectionTitleSmall}>Net Transaction</h3>
                <span style={styles.chartBadge}>30d</span>
              </div>
              <div style={{ width: '100%', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    {/* Simplified Chart for Sidebar */}
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNet)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Stats, HISTORY */}
          <div style={styles.colRight}>
            
            {/* 4. MINI STATS */}
            <div style={styles.statsGrid}>
              <StatCard label="Total Added" value={wallet.totalAdded} color="#10b981" />
              <StatCard label="Withdrawn" value={wallet.totalWithdrawn} color="#ef4444" />
              <StatCard label="Net Growth" value={wallet.netGrowth} color="#3b82f6" />
            </div>

            {/* 5. HISTORY (Moved to Right - Expanded to Table) */}
            <div className="glass-panel" style={styles.historyContainer}>
              <h3 style={styles.sectionTitle}>Transaction History</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tHeadRow}>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                      <th style={{...styles.th, textAlign: 'right'}}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr><td colSpan="4" style={styles.emptyState}>No transactions found.</td></tr>
                    ) : (
                      history.map((t) => (
                        <tr key={t._id} style={styles.tr}>
                          <td style={styles.td}>
                            <span style={t.type === "add" ? styles.badgeSuccess : styles.badgeDanger}>
                              {t.type === "add" ? "DEPOSIT" : "WITHDRAW"}
                            </span>
                          </td>
                          <td style={styles.td}><span style={styles.completed}>Completed</span></td>
                          <td style={styles.tdSub}>{new Date(t.date).toLocaleString()}</td>
                          <td style={{...styles.td, textAlign: 'right', fontWeight: 'bold', color: 'white'}}>
                            {t.type === "add" ? "+" : "-"} ₹{t.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// --- SUB COMPONENTS ---

const StatCard = ({ label, value, color }) => (
  <div className="glass-panel" style={styles.statCard}>
    <p style={styles.statLabel}>{label}</p>
    <p style={{ ...styles.statValue, color }}>₹{value.toLocaleString()}</p>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>Balance</p>
        <p style={styles.tooltipValue}>₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// --- STYLES ---

const styles = {
  pageContainer: { width: "100%", margin: "0 auto", padding: "5px", color: "#fff", fontFamily: "'Inter', sans-serif", height: "calc(100vh - 40px)", display: 'flex', flexDirection: 'column' },
  loaderContainer: { height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" },
  spinner: { width: "40px", height: "40px", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" },
  
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexShrink: 0 },
  pageTitle: { fontSize: "24px", fontWeight: "700", margin: 0, color: "white" },
  subTitle: { color: "#64748b", margin: 0, fontSize: "14px" },
  badge: { background: "rgba(16, 185, 129, 0.2)", color: "#10b981", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", border: "1px solid rgba(16, 185, 129, 0.3)" },

  // THE GRID
  grid: { 
    display: "grid", 
    gridTemplateColumns: "380px 1fr", 
    gap: "24px", 
    flex: 1, 
    minHeight: 0 
  },
  
  colLeft: { display: "flex", flexDirection: "column", gap: "20px", overflowY: "visible", paddingRight: "5px", paddingBottom:"10px", paddingLeft: "-10px" },
  colRight: { display: "flex", flexDirection: "column", gap: "20px", minHeight: 0 },

  // CREDIT CARD
  creditCard: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: "16px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.4)",
    flexShrink: 0
  },
  cardOverlay: { position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)", pointerEvents: "none" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardChip: { width: "35px", height: "25px", background: "linear-gradient(135deg, #fbbf24, #d97706)", borderRadius: "4px" },
  cardBody: { zIndex: 2 },
  cardLabel: { fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  cardBalance: { fontSize: "32px", fontWeight: "700", margin: "5px 0", color: "#fff" },
  cardFooter: { display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "12px", fontFamily: "monospace", marginTop: "10px" },

  // ACTION PANEL
  actionPanel: { padding: "20px", borderRadius: "16px", flexShrink: 0 },
  tabContainer: { display: "flex", background: "rgba(0,0,0,0.3)", padding: "3px", borderRadius: "10px", marginBottom: "15px" },
  tab: { flex: 1, padding: "8px", background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", transition: "all 0.3s", borderRadius: "8px", fontSize: "13px" },
  tabActive: { flex: 1, padding: "8px", background: "#334155", color: "#fff", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "600", fontSize: "13px" },
  inputGroup: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "15px", padding: "0 12px" },
  currencySymbol: { fontSize: "16px", color: "#64748b" },
  input: { width: "100%", padding: "12px", background: "transparent", border: "none", color: "#fff", fontSize: "16px", outline: "none" },
  btnPrimary: { width: "100%", padding: "12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  btnDanger: { width: "100%", padding: "12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },

  // CHART PANEL (Now in Sidebar)
  chartPanel: { padding: "20px", borderRadius: "16px", flexShrink: 0 },
  chartHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  sectionTitleSmall: { fontSize: "16px", fontWeight: "600", margin: 0 },
  chartBadge: { background: "rgba(255,255,255,0.05)", color: "#94a3b8", padding: "2px 8px", borderRadius: "6px", fontSize: "11px" },

  // RIGHT COLUMN STATS
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", flexShrink: 0 },
  statCard: { padding: "20px", borderRadius: "16px", textAlign: "center" },
  statLabel: { fontSize: "13px", color: "#94a3b8", marginBottom: "5px" },
  statValue: { fontSize: "20px", fontWeight: "700", margin: 0 },
  
  // HISTORY PANEL (Now in Right - Fills Height)
  historyContainer: { padding: "24px", borderRadius: "16px", flex: 1, display: 'flex', flexDirection: 'column', minHeight: "300px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", margin: "0 0 20px 0" },
  tableWrapper: { overflowX: "auto", overflowY: "auto", flex: 1 },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" },
  tHeadRow: { textAlign: "left" },
  th: { padding: "0 15px 10px 15px", color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", position: 'sticky', top: 0, background: 'rgba(20, 20, 30, 0.95)', zIndex: 10 },
  tr: { background: "rgba(255,255,255,0.02)", transition: "background 0.2s" },
  td: { padding: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  tdSub: { padding: "15px", color: "#64748b", fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  badgeSuccess: { background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" },
  badgeDanger: { background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" },
  completed: { color: "#94a3b8", fontSize: "12px" },
  emptyState: { textAlign: "center", padding: "30px", color: "#64748b" },

  tooltip: { background: "#1e293b", border: "1px solid #334155", padding: "10px", borderRadius: "8px" },
  tooltipLabel: { color: "#94a3b8", fontSize: "12px", margin: 0 },
  tooltipValue: { color: "#fff", fontSize: "16px", fontWeight: "bold", margin: 0 },
};

export default Wallet;