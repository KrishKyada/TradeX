import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import AddAssetModal from "../components/AddAssetModal";

function Portfolio() {
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* -------------------------------
       Currency Helper
  -------------------------------- */
  const getCurrencySymbol = (symbol, type) => {
    if (type === "crypto") return "$";

    const nseList = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ITC", "SBIN", "HINDUNILVR", "BHARTIARTL", "KOTAKBANK" ,"ICICIBANK"];

    if (nseList.includes(symbol.toUpperCase())) return "₹";

    return "$"; // default for US stocks
  };

  /* -------------------------------
       FETCH USER PORTFOLIO 
  -------------------------------- */
  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(res.data);
  };

  /* -------------------------------
       FETCH CRYPTO PRICES
  -------------------------------- */
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

  /* -------------------------------
       FETCH STOCK PRICES
  -------------------------------- */
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

  /* -------------------------------
       LOAD ASSETS INITIALLY
  -------------------------------- */
  useEffect(() => {
    fetchAssets();
  }, []);

  /* -------------------------------
       REFRESH PRICES
  -------------------------------- */
  useEffect(() => {
    if (assets.length === 0) return;

    fetchCryptoPrices();
    fetchStockPrices();
    setLoading(false);

    const cryptoInterval = setInterval(fetchCryptoPrices, 5000);
    const stockInterval = setInterval(fetchStockPrices, 30000);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, [assets]);

  /* -------------------------------
       DELETE ASSET
  -------------------------------- */
  const deleteAsset = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  /* -------------------------------
       CALCULATIONS
  -------------------------------- */
  let totalInvest = 0;
  let totalCurrent = 0;

  const rows = assets.map((asset) => {
    const invest = asset.quantity * asset.buyPrice;
    const curPrice = prices[asset.symbol] || 0;
    const curValue = curPrice * asset.quantity;
    const pl = curValue - invest;

    totalInvest += invest;
    totalCurrent += curValue;

    return { ...asset, invest, curPrice, curValue, pl };
  });

  const totalPL = totalCurrent - totalInvest;

  const format = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  if (loading) {
    return (
      <MainLayout>
        <h2 style={{ color: "white" }}>Loading Portfolio...</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Portfolio</h1>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <StatCard title="Investment" value={`₹${format(totalInvest)}`} />
        <StatCard title="Current Value" value={`₹${format(totalCurrent)}`} />
        <StatCard title="Total P/L" value={`₹${format(totalPL)}`} />
        <StatCard title="Holdings" value={assets.length} />
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          marginTop: "20px",
          padding: "12px 18px",
          background: "#00d4ff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        + Add Asset
      </button>

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

      {/* PORTFOLIO TABLE */}
      <div
        style={{
          marginTop: "25px",
          background: "rgba(255,255,255,0.05)",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <table style={{ width: "100%", color: "white" }}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Buy Price</th>
              <th>Current</th>
              <th>Value</th>
              <th>P/L</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                <td>{r.symbol}</td>

                <td>{r.quantity}</td>

                <td>
                  {getCurrencySymbol(r.symbol, r.type)} {format(r.buyPrice)}
                </td>

                <td>
                  {getCurrencySymbol(r.symbol, r.type)} {format(r.curPrice)}
                </td>

                <td>
                  {getCurrencySymbol(r.symbol, r.type)} {format(r.curValue)}
                </td>

                <td
                  style={{
                    color: r.pl >= 0 ? "#00ff88" : "#ff4d4d",
                    fontWeight: "600",
                  }}
                >
                  {getCurrencySymbol(r.symbol, r.type)} {format(r.pl)}
                </td>

                <td>
                  <button
                    onClick={() => deleteAsset(r._id)}
                    style={{
                      background: "transparent",
                      color: "red",
                      border: "none",
                      cursor: "pointer",
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
