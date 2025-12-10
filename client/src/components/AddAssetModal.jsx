import { useState, useEffect } from "react";
import axios from "axios";

function AddAssetModal({ onClose, onAdded, presetSymbol, presetType, presetPrice }) {
  const [type, setType] = useState(presetType || "crypto");
  const [symbol, setSymbol] = useState(presetSymbol || "");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState(
    presetPrice !== undefined && presetPrice !== null ? presetPrice : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // suggestions dropdown
  const [suggestions, setSuggestions] = useState([]);

  // Full universal searchable list (extend as needed)
  const ALL_ASSETS = [
    // Crypto
    "BTC", "ETH", "BNB", "SOL", "XRP", "DOGE", "ADA", "MATIC",
    // US Stocks
    "AAPL", "AMZN", "MSFT", "GOOGL", "META", "TSLA", "NFLX",
    // NSE Stocks
    "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "BHARTIARTL.NS",
    "BAJAJ-AUTO.NS", "BPCL.NS", "BHEL.NS", "ICICIBANK.NS", "SBIN.NS"
  ];

  /* -------------------------------------------------
      🌟 FULL AUTOCOMPLETE FOR ALL CHARACTERS
  --------------------------------------------------- */
  useEffect(() => {
    if (symbol.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const query = symbol.toLowerCase();

    const matches = ALL_ASSETS.filter((item) =>
      item.toLowerCase().includes(query)
    );

    setSuggestions(matches.slice(0, 10)); // limit results for cleaner UI
  }, [symbol]);

  /* -------------------------------------------------
      🌟 Autofill Price & Type Detection
  --------------------------------------------------- */
  const autoFillPrice = async (selectedSymbol) => {
    setSymbol(selectedSymbol);

    try {
      let price = 0;

      // Crypto (no .NS and is in crypto list)
      const cryptoList = ["BTC", "ETH", "BNB", "SOL", "XRP", "DOGE", "ADA", "MATIC"];

      if (cryptoList.includes(selectedSymbol)) {
        setType("crypto");
        const res = await axios.post("http://localhost:5000/api/prices/crypto/batch", {
          symbols: [selectedSymbol],
        });
        price = res.data[selectedSymbol];
      }

      // NSE stocks
      else if (selectedSymbol.endsWith(".NS")) {
        setType("stock");
        const res = await axios.get(
          `http://localhost:5000/api/prices/stock/${selectedSymbol}`
        );
        price = res.data.price;
      }

      // US stocks
      else {
        setType("stock");
        const res = await axios.get(
          `http://localhost:5000/api/prices/stock/${selectedSymbol}`
        );
        price = res.data.price;
      }

      setBuyPrice(price);
    } catch (err) {
      console.error("Autofill price error:", err);
    }

    setSuggestions([]); // hide dropdown
  };

  /* -------------------------------------------------
      Submit Asset
  --------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!symbol || !quantity || !buyPrice) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/portfolio/add",
        {
          type,
          symbol: symbol.toUpperCase(),
          quantity: Number(quantity),
          buyPrice: Number(buyPrice),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);

      if (onAdded) onAdded();
      onClose();
    } catch (err) {
      console.error("Add asset error:", err.message);
      setError("Failed to add asset");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(0,212,255,0.3)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#00d4ff" }}>Add Asset</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* TYPE SELECT */}
          <div>
            <label style={{ fontSize: "13px", color: "#aaa" }}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.4)",
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                marginTop: "4px",
              }}
            >
              <option value="crypto">Crypto</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          {/* SYMBOL + AUTOCOMPLETE DROPDOWN */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "13px", color: "#aaa" }}>Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.4)",
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                marginTop: "4px",
              }}
              placeholder="Enter Symbol"
            />

            {suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  width: "100%",
                  background: "rgba(30,41,59,0.95)",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,212,255,0.2)",
                  maxHeight: "160px",
                  overflowY: "auto",
                  zIndex: 20,
                }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s}
                    onClick={() => autoFillPrice(s)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      color: "white",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUANTITY */}
          <div>
            <label style={{ fontSize: "13px", color: "#aaa" }}>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.4)",
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                marginTop: "4px",
              }}
              placeholder="Enter quantity"
            />
          </div>

          {/* BUY PRICE */}
          <div>
            <label style={{ fontSize: "13px", color: "#aaa" }}>Buy Price</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.4)",
                background: "rgba(15,23,42,0.9)",
                color: "#fff",
                marginTop: "4px",
              }}
              placeholder="Enter Price"
            />
          </div>

          {error && (
            <p style={{ color: "#ff4d4d", fontSize: "13px", marginTop: "4px" }}>
              {error}
            </p>
          )}

          {/* FOOTER BUTTONS */}
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.6)",
                background: "transparent",
                color: "#e5e7eb",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#00d4ff",
                color: "#000",
                fontWeight: "600",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Adding..." : "Add Asset"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;
