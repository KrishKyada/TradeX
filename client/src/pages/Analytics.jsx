import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import AllocationPieChart from "../components/AllocationPieChart";

const Analytics = () => {
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState({
    totalInvestment: 0,
    totalCurrentValue: 0,
    profitLoss: 0,
    profitLossPercent: 0,
  });
  const [loading, setLoading] = useState(true);

  /* -----------------------------
      STEP 2 — Batch crypto request
  ------------------------------ */
  const fetchCryptoPrices = async (cryptoAssets) => {
    if (cryptoAssets.length === 0) return {};

    const symbols = cryptoAssets.map((a) => a.symbol);

    const res = await axios.post("http://localhost:5000/api/prices/crypto/batch", {
      symbols,
    });

    return res.data; // { BTC: 42000, ETH: 3200, SOL: 150 }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ Fetch user assets
        const { data } = await axios.get("http://localhost:5000/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAssets(data);

        // Separate crypto & stock assets
        const cryptoAssets = data.filter((a) => a.type === "crypto");
        const stockAssets = data.filter((a) => a.type === "stock");

        let totalInvestment = 0;
        let totalCurrentValue = 0;

        // 2️⃣ Fetch crypto prices in ONE request
        const cryptoPrices = await fetchCryptoPrices(cryptoAssets);

        // 3️⃣ Fetch stock prices (Finnhub supports per-symbol)
        const stockPrices = {};
        for (const asset of stockAssets) {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/prices/stock/${asset.symbol}`
            );
            stockPrices[asset.symbol] = res.data.price || 0;
          } catch (err) {
            stockPrices[asset.symbol] = 0;
          }
        }

        // 4️⃣ Calculate totals
        for (const asset of data) {
          const invest = asset.quantity * asset.buyPrice;
          totalInvestment += invest;

          const currentPrice =
            asset.type === "crypto"
              ? cryptoPrices[asset.symbol] || 0
              : stockPrices[asset.symbol] || 0;

          totalCurrentValue += currentPrice * asset.quantity;
        }

        const profitLoss = totalCurrentValue - totalInvestment;
        const profitLossPercent =
          totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

        setStats({
          totalInvestment,
          totalCurrentValue,
          profitLoss,
          profitLossPercent,
        });

        setLoading(false);
      } catch (error) {
        console.error("Analytics Error:", error);
      }
    };

    fetchAnalytics();
  }, []);

  // Pie chart data
  const getPieChartData = () => {
    return assets.map((asset) => ({
      symbol: asset.symbol,
      value: asset.quantity * asset.buyPrice,
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: "20px", color: "white" }}>
          <h2>Loading analytics...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: "20px", color: "white" }}>
        <h1>Analytics</h1>

        {/* Summary Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              padding: "20px",
              borderRadius: "10px",
              width: "250px",
            }}
          >
            <h3>Total Investment</h3>
            <h2>₹{stats.totalInvestment.toLocaleString()}</h2>
          </div>

          <div
            style={{
              background: "#22c55e",
              padding: "20px",
              borderRadius: "10px",
              width: "250px",
            }}
          >
            <h3>Current Value</h3>
            <h2>₹{stats.totalCurrentValue.toLocaleString()}</h2>
          </div>

          <div
            style={{
              background: stats.profitLoss >= 0 ? "#16a34a" : "#dc2626",
              padding: "20px",
              borderRadius: "10px",
              width: "250px",
            }}
          >
            <h3>Total P/L</h3>
            <h2>
              ₹{stats.profitLoss.toLocaleString()} (
              {stats.profitLossPercent.toFixed(2)}%)
            </h2>
          </div>
        </div>

        {/* Pie Chart */}
        <AllocationPieChart data={getPieChartData()} />
      </div>
    </MainLayout>
  );
};

export default Analytics;
