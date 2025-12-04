function TrendingAssets() {
  const trending = [
    { symbol: "BTC", name: "Bitcoin", price: 42150, change: 5.2, volume: "28.5B" },
    { symbol: "ETH", name: "Ethereum", price: 2240, change: 3.8, volume: "12.3B" },
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
        height: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .trending-item:hover {
          background: rgba(0, 212, 255, 0.08);
        }
      `}</style>

      <h3 style={{ marginTop: "0", marginBottom: "15px", color: "#00d4ff", fontSize: "18px", fontWeight: "600" }}>
        🔥 Trending Now
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {trending.map((asset) => (
          <div
            key={asset.symbol}
            className="trending-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            <div>
              <p style={{ margin: "0", color: "#fff", fontWeight: "600", fontSize: "14px" }}>{asset.symbol}</p>
              <p style={{ margin: "4px 0 0 0", color: "#aaa", fontSize: "12px" }}>{asset.name}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0", color: "#00d4ff", fontWeight: "600", fontSize: "14px" }}>
                ${asset.price.toLocaleString()}
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: asset.change >= 0 ? "#00ff88" : "#ff4d4d",
                }}
              >
                {asset.change >= 0 ? "+" : ""}
                {asset.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingAssets
