function MarketOverview() {
  const markets = [
    { name: "Crypto Market Cap", value: "$2.34T", change: 3.2, icon: "₿" },
    { name: "24h Volume", value: "$86.5B", change: 5.1, icon: "📊" },
    { name: "BTC Dominance", value: "42.8%", change: -1.2, icon: "👑" },
    { name: "Fear & Greed", value: "68/100", change: 4.5, icon: "🎯" },
  ]

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
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <h3 style={{ marginTop: "-10px", marginBottom: "8px", color: "#00d4ff", fontSize: "18px", fontWeight: "600" }}>
        📈 Market Overview
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", height: "100%" }}>
        {markets.map((market, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(0, 212, 255, 0.05)",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height:"150px"
            }}
          >
            <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>
              {market.icon} {market.name}
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: "16px", fontWeight: "600", color: "#00d4ff" }}>{market.value}</p>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "11px",
                color: market.change >= 0 ? "#00ff88" : "#ff4d4d",
                fontWeight: "600",
              }}
            >
              {market.change >= 0 ? "📈" : "📉"} {market.change >= 0 ? "+" : ""}
              {market.change}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketOverview
