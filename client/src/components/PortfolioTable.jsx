function PortfolioTable({ assets, deleteAsset, livePrices }) {
  const formatMoney = (num) => num.toLocaleString("en-IN", { maximumFractionDigits: 2 })

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        overflow: "auto",
        maxHeight: "350px",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 8px",
          fontFamily: "sans-serif",
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", color: "#00d4ff", fontSize: "13px", fontWeight: "600" }}>
            <th style={{ paddingBottom: "10px" }}>Type</th>
            <th style={{ paddingBottom: "10px" }}>Symbol</th>
            <th style={{ paddingBottom: "10px" }}>Qty</th>
            <th style={{ paddingBottom: "10px" }}>Buy Price</th>
            <th style={{ paddingBottom: "10px" }}>Current</th>
            <th style={{ paddingBottom: "10px" }}>P/L</th>
            <th style={{ paddingBottom: "10px" }}>Value</th>
            <th style={{ paddingBottom: "10px" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a, i) => {
            const price = livePrices[a.symbol] || 0
            const pl = price ? (price - a.buyPrice) * a.quantity : 0
            const value = price * a.quantity

            return (
              <tr
                key={a._id}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  animation: `slideUp 0.4s ease-out ${i * 0.05}s both`,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 212, 255, 0.15)"
                  e.currentTarget.style.transform = "scale(1.01)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                <style>{`
                  @keyframes slideUp {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>

                <td style={{ padding: "12px 10px", color: "#ccc" }}>{a.type}</td>
                <td style={{ padding: "12px 10px", fontWeight: "bold", color: "#00d4ff" }}>{a.symbol}</td>
                <td style={{ padding: "12px 10px", color: "#ccc" }}>{a.quantity}</td>
                <td style={{ padding: "12px 10px", color: "#ccc" }}>₹ {formatMoney(a.buyPrice)}</td>
                <td style={{ padding: "12px 10px", color: "#00ff88" }}>₹ {formatMoney(price)}</td>
                <td
                  style={{
                    padding: "12px 10px",
                    color: pl >= 0 ? "#00ff88" : "#ff4d4d",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {formatMoney(pl)}
                </td>
                <td style={{ padding: "12px 10px", color: "#ccc" }}>₹ {formatMoney(value)}</td>
                <td style={{ padding: "12px 10px" }}>
                  <button
                    onClick={() => deleteAsset(a._id)}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff2a2a"
                      e.currentTarget.style.transform = "scale(1.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ff4d4d"
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default PortfolioTable
