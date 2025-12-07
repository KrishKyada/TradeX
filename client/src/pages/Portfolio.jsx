import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import AddAssetModal from "../components/AddAssetModal";

function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  /* ------------------------------
        Fetch User Assets
  ------------------------------ */
  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(res.data);
  };

  /* ------------------------------
        Fetch Live Prices
  ------------------------------ */
  const fetchPrices = async () => {
    const crypto = assets.filter((a) => a.type === "crypto");
    const stocks = assets.filter((a) => a.type === "stock");

    let live = {};

    // Crypto batch request
    if (crypto.length > 0) {
      const res = await axios.post(
        "http://localhost:5000/api/prices/crypto/batch",
        { symbols: crypto.map((a) => a.symbol) }
      );
      Object.assign(live, res.data);
    }

    // Stocks individually
    for (const stock of stocks) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/prices/stock/${stock.symbol}`
        );
        live[stock.symbol] = res.data.price || 0;
      } catch {
        live[stock.symbol] = 0;
      }
    }

    setPrices(live);
  };

  /* ------------------------------
        Delete Asset
  ------------------------------ */
  const deleteAsset = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  /* ------------------------------
        Load Data
  ------------------------------ */
  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      fetchPrices();
      setLoading(false);
    }
  }, [assets]);

  /* ------------------------------
        Calculations
  ------------------------------ */
  let totalInvest = 0;
  let totalCurrent = 0;

  const rows = assets.map((asset) => {
    const quantity = asset.quantity;
    const invest = quantity * asset.buyPrice;
    const curPrice = prices[asset.symbol] || 0;
    const curValue = curPrice * quantity;
    const pl = curValue - invest;

    totalInvest += invest;
    totalCurrent += curValue;

    return {
      ...asset,
      invest,
      curPrice,
      curValue,
      pl,
    };
  });

  const totalPL = totalCurrent - totalInvest;
  const plPercent =
    totalInvest > 0 ? ((totalPL / totalInvest) * 100).toFixed(2) : 0;

  const format = (n) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  if (loading) return <MainLayout><h2 style={{ color: "white" }}>Loading Portfolio...</h2></MainLayout>;

  return (
    <MainLayout>
      <h1 style={{ marginBottom: "20px" }}>Portfolio</h1>

      {/* ==== STAT CARDS ==== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <StatCard title="Investment" value={`₹${format(totalInvest)}`} />
        <StatCard title="Current Value" value={`₹${format(totalCurrent)}`} />
        <StatCard
          title="Total P/L"
          value={`₹${format(totalPL)}`}
          subtitle={`${plPercent}%`}
          color1={totalPL >= 0 ? "#00ff88" : "#ff4d4d"}
          color2={totalPL >= 0 ? "#00cc6a" : "#ff2a2a"}
        />
        <StatCard title="Holdings" value={assets.length} />
      </div>

      {/* ==== ADD BUTTON ==== */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "12px 18px",
          background: "#00d4ff",
          border: "none",
          borderRadius: "8px",
          color: "#000",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        + Add Asset
      </button>
      {showModal && (
        <AddAssetModal
            onClose={() => setShowModal(false)}
            onAdded={() => {
            fetchAssets();
            fetchPrices();
            }}
        />
        )}


      {/* ==== PORTFOLIO TABLE ==== */}
      <div
        className="portfolio-scroll-inner"
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid rgba(0,212,255,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <table style={{ width: "100%", color: "white", borderSpacing: "0 10px" }}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.7 }}>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>P/L</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row._id}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                }}
              >
                <td>{row.symbol}</td>
                <td>{row.type}</td>
                <td>{row.quantity}</td>
                <td>₹{format(row.buyPrice)}</td>
                <td>₹{format(row.curPrice)}</td>
                <td>₹{format(row.curValue)}</td>
                <td
                  style={{
                    color: row.pl >= 0 ? "#00ff88" : "#ff4d4d",
                    fontWeight: "600",
                  }}
                >
                  {row.pl >= 0 ? "+" : ""}
                  {format(row.pl)}
                </td>

                <td>
                  <button
                    onClick={() => deleteAsset(row._id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ff4d4d",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default Portfolio;
