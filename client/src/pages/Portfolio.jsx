import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import AddAssetModal from "../components/AddAssetModal";

function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- LOGIC (Unchanged) ---
  const getCurrencySymbol = (symbol, type) => {
    if (type === "crypto") return "$";
    const nseList = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ITC", "SBIN", "HINDUNILVR", "BHARTIARTL", "KOTAKBANK" ,"ICICIBANK"];
    if (nseList.includes(symbol.toUpperCase())) return "₹";
    return "$";
  };

  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCryptoPrices = async () => {
    const crypto = assets.filter((a) => a.type === "crypto");
    if (crypto.length === 0) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/prices/crypto/batch",
        { symbols: crypto.map((a) => a.symbol) }
      );
      setPrices((prev) => ({ ...prev, ...res.data }));
    } catch {
      crypto.forEach((c) =>
        setPrices((prev) => ({ ...prev, [c.symbol]: 0 }))
      );
    }
  };

  const fetchStockPrices = async () => {
    const stocks = assets.filter((a) => a.type === "stock");
    let stockPrices = {};
    for (const stock of stocks) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/prices/stock/${stock.symbol}`
        );
        stockPrices[stock.symbol] = res.data.price;
      } catch {
        stockPrices[stock.symbol] = 0;
      }
    }
    setPrices((prev) => ({ ...prev, ...stockPrices }));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      fetchCryptoPrices();
      fetchStockPrices();
    }
    setLoading(false); // Set loading to false regardless of assets to show empty state

    const cryptoInterval = setInterval(fetchCryptoPrices, 5000);
    const stockInterval = setInterval(fetchStockPrices, 30000);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, [assets]);

  const deleteAsset = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  // --- CALCULATIONS ---
  let totalInvest = 0;
  let totalCurrent = 0;

  const rows = assets.map((asset) => {
    const invest = asset.quantity * asset.buyPrice;
    const curPrice = prices[asset.symbol] || 0;
    const curValue = curPrice * asset.quantity;
    const pl = curValue - invest;
    const plPercent = invest > 0 ? (pl / invest) * 100 : 0;

    totalInvest += invest;
    totalCurrent += curValue;

    return { ...asset, invest, curPrice, curValue, pl, plPercent };
  });

  const totalPL = totalCurrent - totalInvest;
  const totalPLPercent = totalInvest > 0 ? (totalPL / totalInvest) * 100 : 0;
  const format = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  // --- UI RENDER ---

  if (loading && assets.length === 0) {
    return (
      <MainLayout>
        <div style={styles.loaderContainer}>
          <div className="spinner" style={styles.spinner}></div>
          <p style={{ marginTop: 20, color: "#94a3b8" }}>Fetching Portfolio...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* GLOBAL CSS */}
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade { animation: fadeIn 0.5s ease-out forwards; }
          .glass-panel {
            background: rgba(20, 20, 30, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          }
          .glass-panel:hover { border-color: rgba(255, 255, 255, 0.15); }
          /* Custom Scrollbar */
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        `}
      </style>

      <div style={styles.pageContainer} className="animate-fade">
        
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Portfolio</h1>
            <p style={styles.subTitle}>Track your crypto & stock performance</p>
          </div>
          <button style={styles.btnAdd} onClick={() => setShowModal(true)}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>+</span> Add Asset
          </button>
        </header>

        {/* TOP STATS ROW */}
        <div style={styles.statsGrid}>
          <PremiumStatCard title="Invested Value" value={`₹${format(totalInvest)}`} icon="🏦" color="#3b82f6" />
          <PremiumStatCard title="Current Value" value={`₹${format(totalCurrent)}`} icon="📈" color="#8b5cf6" />
          <PremiumStatCard 
            title="Total P/L" 
            value={`₹${format(totalPL)}`} 
            subValue={`${totalPLPercent >= 0 ? "+" : ""}${format(totalPLPercent)}%`}
            isPositive={totalPL >= 0}
            icon="💰" 
          />
          <PremiumStatCard title="Total Holdings" value={assets.length} icon="📦" color="#f59e0b" />
        </div>

        {/* MAIN TABLE */}
        <div className="glass-panel" style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={styles.sectionTitle}>Assets Holdings</h3>
            <span style={styles.badge}>{assets.length} Items</span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tHeadRow}>
                  <th style={styles.th}>Asset</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Holdings</th>
                  <th style={styles.th}>Invested</th>
                  <th style={styles.th}>Current Value</th>
                  <th style={styles.th}>P/L</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.emptyState}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '30px' }}>📭</span>
                        <span>Your portfolio is empty. Add an asset to get started.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const symbol = getCurrencySymbol(r.symbol, r.type);
                    return (
                      <tr key={r._id} style={styles.tr}>
                        {/* ASSET NAME */}
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={styles.assetIcon}>{r.symbol.charAt(0)}</div>
                            <div>
                              <div style={styles.assetSymbol}>{r.symbol}</div>
                              <div style={styles.assetType}>{r.type.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>

                        {/* LIVE PRICE */}
                        <td style={styles.td}>
                          <span style={{ color: "#e2e8f0" }}>{symbol}{format(r.curPrice)}</span>
                        </td>

                        {/* HOLDINGS */}
                        <td style={styles.td}>
                          <span style={{ fontWeight: '500' }}>{r.quantity}</span>
                        </td>

                        {/* INVESTED */}
                        <td style={styles.td}>
                          <span style={styles.secondaryText}>{symbol}{format(r.invest)}</span>
                          <div style={styles.miniLabel}>@ {format(r.buyPrice)}</div>
                        </td>

                        {/* CURRENT VALUE */}
                        <td style={styles.td}>
                          <span style={{ fontWeight: '600', color: 'white' }}>{symbol}{format(r.curValue)}</span>
                        </td>

                        {/* P/L */}
                        <td style={styles.td}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: "700", color: r.pl >= 0 ? "#10b981" : "#ef4444" }}>
                              {r.pl >= 0 ? "+" : ""}{symbol}{format(r.pl)}
                            </span>
                            <span style={{ fontSize: "11px", color: r.pl >= 0 ? "#10b981" : "#ef4444" }}>
                              {r.plPercent >= 0 ? "▲" : "▼"} {format(r.plPercent)}%
                            </span>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td style={styles.td}>
                          <button
                            onClick={() => deleteAsset(r._id)}
                            style={styles.deleteBtn}
                            title="Remove Asset"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL WRAPPER */}
        {showModal && (
          <AddAssetModal
            onClose={() => setShowModal(false)}
            onAdded={() => {
              fetchAssets();
              fetchCryptoPrices();
              fetchStockPrices();
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}

// --- SUB-COMPONENTS ---

const PremiumStatCard = ({ title, value, subValue, icon, color, isPositive }) => {
  // Dynamic color for P/L card based on value, otherwise use prop color
  const accentColor = subValue ? (isPositive ? "#10b981" : "#ef4444") : color;
  
  return (
    <div className="glass-panel" style={styles.statCard}>
      <div style={styles.statTop}>
        <span style={styles.statTitle}>{title}</span>
        <span style={{ fontSize: '20px', opacity: 0.8 }}>{icon}</span>
      </div>
      <div style={styles.statMain}>
        <h2 style={{ ...styles.statValue, background: subValue ? undefined : `linear-gradient(90deg, #fff, ${color})`, WebkitBackgroundClip: subValue ? undefined : "text", WebkitTextFillColor: subValue ? undefined : "transparent", color: subValue ? accentColor : undefined }}>
          {value}
        </h2>
        {subValue && (
          <span style={{ fontSize: "12px", fontWeight: "600", color: accentColor, background: `rgba(${isPositive ? '16, 185, 129' : '239, 68, 68'}, 0.1)`, padding: "2px 6px", borderRadius: "4px" }}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---

const styles = {
  // Layout
  pageContainer: { width:"100%", margin: "0 auto", padding: "5px", color: "#fff", fontFamily: "'Inter', sans-serif" },
  loaderContainer: { height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  spinner: { width: "40px", height: "40px", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" },

  // Header
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" },
  pageTitle: { fontSize: "32px", fontWeight: "800", margin: 0, background: "linear-gradient(90deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subTitle: { color: "#64748b", margin: "5px 0 0 0", fontSize: "14px" },
  
  btnAdd: { 
    display: "flex", 
    alignItems: "center", 
    padding: "12px 24px", 
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
    color: "#fff", 
    border: "none", 
    borderRadius: "12px", 
    fontWeight: "600", 
    cursor: "pointer", 
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)", 
    transition: "transform 0.1s" 
  },

  // Stats Grid
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statTitle: { color: "#94a3b8", fontSize: "13px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" },
  statMain: { display: "flex", alignItems: "baseline", gap: "10px" },
  statValue: { fontSize: "24px", fontWeight: "700", margin: 0 },

  // Table Section
  tableContainer: { padding: "25px", borderRadius: "20px", overflow: "hidden" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", margin: 0, color: "#fff" },
  badge: { background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" },
  
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
  tHeadRow: { textAlign: "left" },
  th: { padding: "16px", color: "#64748b", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  tr: { transition: "background 0.2s" },
  td: { padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "middle", fontSize: "14px" },
  
  // Table Cells
  assetIcon: { width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #475569, #334155)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
  assetSymbol: { fontWeight: "600", color: "#fff" },
  assetType: { fontSize: "10px", color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "2px 4px", borderRadius: "4px", width: "fit-content", marginTop: "2px" },
  secondaryText: { color: "#cbd5e1" },
  miniLabel: { fontSize: "11px", color: "#64748b" },
  
  deleteBtn: { width: "30px", height: "30px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", transition: "background 0.2s" },
  emptyState: { textAlign: "center", padding: "50px", color: "#64748b" },
};

export default Portfolio;