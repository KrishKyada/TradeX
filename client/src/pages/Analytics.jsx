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
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
      Batch Crypto Price Fetcher
  ------------------------------ */
  const fetchCryptoPrices = async (cryptoAssets) => {
    if (cryptoAssets.length === 0) return {};

    const symbols = cryptoAssets.map((a) => a.symbol);

    const res = await axios.post("http://localhost:5000/api/prices/crypto/batch", {
      symbols,
    });

    return res.data; // { BTC: 42000, ETH: 3200 }
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

        // Split asset types
        const cryptoAssets = data.filter((a) => a.type === "crypto");
        const stockAssets = data.filter((a) => a.type === "stock");

        let totalInvestment = 0;
        let totalCurrentValue = 0;
        const perfArray = [];

        // 2️⃣ Fetch crypto prices — batch
        const cryptoPrices = await fetchCryptoPrices(cryptoAssets);

        // 3️⃣ Fetch stock prices — one-by-one
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

        // 4️⃣ Calculate everything
        for (const asset of data) {
          const invest = asset.quantity * asset.buyPrice;
          totalInvestment += invest;

          const currentPrice =
            asset.type === "crypto"
              ? cryptoPrices[asset.symbol] || 0
              : stockPrices[asset.symbol] || 0;

          const currentValue = currentPrice * asset.quantity;
          totalCurrentValue += currentValue;

          const pl = currentValue - invest;
          const plPercent = invest > 0 ? (pl / invest) * 100 : 0;

          perfArray.push({
            id: asset._id,
            symbol: asset.symbol,
            quantity: asset.quantity,
            invest,
            currentValue,
            pl,
            plPercent,
          });
        }

        setPerformance(perfArray);

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
    const grouped = {};

    assets.forEach((a) => {
      const value = a.quantity * a.buyPrice;

      if (!grouped[a.symbol]) grouped[a.symbol] = 0;

      grouped[a.symbol] += value; // merge duplicates
    });

    return Object.entries(grouped).map(([symbol, value]) => ({
    symbol,
    value: value < 1 ? 1 : value, // ensures small slices still visible
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

        {/* === PIE CHART (LEFT) + GAINERS / LOSERS (RIGHT) === */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "30px",
            height: "450px",
          }}
        >
          {/* LEFT — TALL PIE CHART */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "20px",
              borderRadius: "15px",
              border: "1px solid rgba(0, 212, 255, 0.15)",
              height: "100%",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2 style={{ marginBottom: "-20px" }}></h2>
            <AllocationPieChart data={getPieChartData()} />
          </div>

          {/* RIGHT SIDE — GAINERS & LOSERS STACKED */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* TOP GAINERS */}
            <div
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid rgba(0, 255, 140, 0.2)",
                backdropFilter: "blur(12px)",
                overflowY: "auto",
              }}
            >
              <h2 style={{ color: "#00ff88", marginBottom: "10px" }}>Top Gainers</h2>

              {performance
                .filter((p) => p.plPercent > 0)
                .sort((a, b) => b.plPercent - a.plPercent)
                .slice(0, 5)
                .map((asset) => (
                  <div
                    key={asset.id}
                    style={{
                      padding: "12px",
                      marginBottom: "12px",
                      borderRadius: "10px",
                      background: "rgba(0, 255, 140, 0.1)",
                      border: "1px solid rgba(0, 255, 140, 0.3)",
                    }}
                  >
                    <h3 style={{ margin: "0 0 5px 0" }}>{asset.symbol}</h3>
                    <p style={{ margin: 0, color: "#aaa" }}>{asset.quantity} units</p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        fontWeight: "700",
                        color: "#00ff88",
                      }}
                    >
                      +{asset.plPercent.toFixed(2)}%
                    </p>
                  </div>
                ))}
            </div>

            {/* TOP LOSERS */}
            <div
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid rgba(255, 80, 80, 0.2)",
                backdropFilter: "blur(12px)",
                overflowY: "auto",
              }}
            >
              <h2 style={{ color: "#ff4d4d", marginBottom: "10px" }}>Top Losers</h2>

              {performance
                .filter((p) => p.plPercent < 0)
                .sort((a, b) => a.plPercent - b.plPercent)
                .slice(0, 5)
                .map((asset) => (
                  <div
                    key={asset.id}
                    style={{
                      padding: "12px",
                      marginBottom: "12px",
                      borderRadius: "10px",
                      background: "rgba(255, 80, 80, 0.1)",
                      border: "1px solid rgba(255, 80, 80, 0.3)",
                    }}
                  >
                    <h3 style={{ margin: "0 0 5px 0" }}>{asset.symbol}</h3>
                    <p style={{ margin: 0, color: "#aaa" }}>{asset.quantity} units</p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        fontWeight: "700",
                        color: "#ff4d4d",
                      }}
                    >
                      {asset.plPercent.toFixed(2)}%
                    </p>
                  </div>
                ))}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
