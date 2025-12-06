import { useEffect, useState } from "react";
import axios from "axios";

function AdvancedAnalytics() {
  const [data, setData] = useState(null);

  const fetchBinanceStats = async () => {
    try {
      // You can change BTCUSDT to ETHUSDT or any asset
      const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT";

      const res = await axios.get(url);
      const d = res.data;

      // Calculate volatility
      const volatility =
        ((parseFloat(d.highPrice) - parseFloat(d.lowPrice)) /
          parseFloat(d.lowPrice)) *
        100;

      setData({
        lastPrice: parseFloat(d.lastPrice),
        changePercent: parseFloat(d.priceChangePercent),
        volume: parseFloat(d.volume),
        high: parseFloat(d.highPrice),
        low: parseFloat(d.lowPrice),
        volatility: volatility.toFixed(2),
        trend: d.priceChangePercent >= 0 ? "Bullish" : "Bearish",
      });
    } catch (err) {
      console.error("BINANCE ANALYTICS ERROR:", err.message);
    }
  };

  useEffect(() => {
    fetchBinanceStats();
  }, []);

  if (!data) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        Loading Binance analytics...
      </div>
    );
  }

  const cards = [
    {
      name: "24h Change",
      value: `${data.changePercent}%`,
      status: data.trend,
      color: data.changePercent >= 0 ? "#00ff88" : "#ff4d4d",
    },
    {
      name: "Volatility",
      value: `${data.volatility}%`,
      status: "Calculated from high/low",
      color: "#00d4ff",
    },
    {
      name: "24h High",
      value: `$${data.high.toLocaleString()}`,
      status: "Peak price",
      color: "#ffa500",
    },
    {
      name: "24h Low",
      value: `$${data.low.toLocaleString()}`,
      status: "Lowest price",
      color: "#ff8800",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(0, 212, 255, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 212, 255, 0.08)",
        animation: "fadeIn 0.6s ease-out",
        height: "203px",
      }}
    >
      <h3
        style={{
          marginTop: "10px",
          marginBottom: "20px",
          color: "#00d4ff",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        🔬 Advanced Analytics (Binance Live)
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {cards.map((indicator, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, ${indicator.color}20, ${indicator.color}10)`,
              padding: "16px",
              borderRadius: "12px",
              border: `1px solid ${indicator.color}30`,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${indicator.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <p style={{ margin: "0", fontSize: "12px", color: "#aaa", fontWeight: "500" }}>
              {indicator.name}
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "18px",
                fontWeight: "700",
                color: indicator.color,
              }}
            >
              {indicator.value}
            </p>
            <p
              style={{
                margin: "6px 0 0 0",
                fontSize: "11px",
                color: indicator.color,
                fontWeight: "600",
              }}
            >
              {indicator.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvancedAnalytics;
