function PortfolioTable({ assets, deleteAsset, livePrices }) {
  const formatMoney = (num) =>
    num.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div style={{ marginTop: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          fontFamily: "sans-serif",
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", color: "#666", fontSize: "14px" }}>
            <th>Type</th>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>P/L</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a) => {
            const price = livePrices[a.symbol] || 0;
            const pl = price ? (price - a.buyPrice) * a.quantity : 0;
            const value = price * a.quantity;

            return (
              <tr
                key={a._id}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                }}
              >
                <td style={{ padding: "12px 10px" }}>{a.type}</td>
                <td style={{ padding: "12px 10px", fontWeight: "bold" }}>
                  {a.symbol}
                </td>
                <td style={{ padding: "12px 10px" }}>{a.quantity}</td>
                <td style={{ padding: "12px 10px" }}>₹ {formatMoney(a.buyPrice)}</td>

                <td style={{ padding: "12px 10px" }}>
                  ₹ {formatMoney(price)}
                </td>

                <td
                  style={{
                    padding: "12px 10px",
                    color: pl >= 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {formatMoney(pl)}
                </td>

                <td style={{ padding: "12px 10px" }}>
                  ₹ {formatMoney(value)}
                </td>

                <td style={{ padding: "12px 10px" }}>
                  <button
                    onClick={() => deleteAsset(a._id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioTable;
