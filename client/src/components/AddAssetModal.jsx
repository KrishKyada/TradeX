import { useState, useEffect } from "react";
import axios from "axios";

function AddAssetModal({ onClose, onAdded }) {
  const [type, setType] = useState("crypto");
  const [symbol, setSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(false);

  /* --------------------------
      Available Options
  -------------------------- */
  const cryptoList = ["BTC", "ETH", "SOL", "XRP", "ADA", "DOGE"];
  const stockList = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA"];

  /* --------------------------
      Autocomplete Suggestions
  -------------------------- */
  useEffect(() => {
    if (symbol.length === 0) return setSuggestions([]);

    const list = type === "crypto" ? cryptoList : stockList;
    const filtered = list.filter((s) =>
      s.toLowerCase().startsWith(symbol.toLowerCase())
    );

    setSuggestions(filtered);
  }, [symbol, type]);

  /* --------------------------
      Auto Fetch Current Price
  -------------------------- */
  const fetchLivePrice = async (sym) => {
    if (!sym) return;

    setLoadingPrice(true);

    try {
      let url =
        type === "crypto"
          ? "http://localhost:5000/api/prices/crypto/batch"
          : `http://localhost:5000/api/prices/stock/${sym}`;

      let price;

      if (type === "crypto") {
        const res = await axios.post(url, { symbols: [sym] });
        price = res.data[sym] || 0;
      } else {
        const res = await axios.get(url);
        price = res.data.price || 0;
      }

      setBuyPrice(price);
    } catch (err) {
      setBuyPrice("");
    }

    setLoadingPrice(false);
  };

  /* --------------------------
      Submit Form
  -------------------------- */
  const addAsset = async () => {
    if (!symbol || !quantity || !buyPrice) return alert("Fill all fields!");

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/portfolio/add",
      {
        type,
        symbol,
        quantity,
        buyPrice,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );


    onAdded(); // refresh portfolio
    onClose(); // close modal
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "420px",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "16px",
          padding: "25px",
          border: "1px solid rgba(0,212,255,0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#00d4ff" }}>
          Add New Asset
        </h2>

        {/* Type Selector */}
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="crypto">Crypto</option>
          <option value="stock">Stock</option>
        </select>

        {/* Symbol Input */}
        <label style={{ marginTop: "10px" }}>Symbol</label>
        <input
          type="text"
          placeholder="BTC / ETH / AAPL / TSLA"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          style={inputStyle}
          onBlur={() => fetchLivePrice(symbol)}
        />

        {/* Suggestions Box */}
        {suggestions.length > 0 && (
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          >
            {suggestions.map((s) => (
              <div
                key={s}
                onClick={() => {
                  setSymbol(s);
                  fetchLivePrice(s);
                  setSuggestions([]);
                }}
                style={{
                  padding: "6px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {/* Quantity */}
        <label style={{ marginTop: "10px" }}>Quantity</label>
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={inputStyle}
        />

        {/* Buy Price */}
        <label style={{ marginTop: "10px" }}>Buy Price</label>
        <input
          type="number"
          placeholder="Auto filled"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          style={inputStyle}
        />

        {loadingPrice && <p style={{ color: "yellow" }}>Fetching price...</p>}

        {/* Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button onClick={addAsset} style={btnPrimary}>
            Add Asset
          </button>
          <button onClick={onClose} style={btnSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
      shared styles
-------------------------- */
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(0,212,255,0.3)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  marginTop: "5px",
  outline: "none",
};

const btnPrimary = {
  flex: 1,
  padding: "10px",
  background: "#00d4ff",
  color: "#000",
  borderRadius: "8px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
};

const btnSecondary = {
  flex: 1,
  padding: "10px",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
};

export default AddAssetModal;
