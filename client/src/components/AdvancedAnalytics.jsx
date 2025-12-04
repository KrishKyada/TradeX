function AdvancedAnalytics() {
  const indicators = [
    { name: "RSI", value: 65, status: "Neutral", color: "#ffa500" },
    { name: "MACD", value: "Positive", status: "Bullish", color: "#00ff88" },
    { name: "Moving Avg", value: "Above 200MA", status: "Strong", color: "#00d4ff" },
    { name: "Volatility", value: "15.2%", status: "Moderate", color: "#ff8800" },
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
        height:"203px"
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <h3 style={{ marginTop: "10px", marginBottom: "20px", color: "#00d4ff", fontSize: "18px", fontWeight: "600" }}>
        🔬 Advanced Analytics & Technical Indicators
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {indicators.map((indicator, idx) => (
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
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = `0 8px 24px ${indicator.color}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <p style={{ margin: "0", fontSize: "12px", color: "#aaa", fontWeight: "500" }}>{indicator.name}</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "18px", fontWeight: "700", color: indicator.color }}>
              {indicator.value}
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: indicator.color, fontWeight: "600" }}>
              {indicator.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvancedAnalytics
