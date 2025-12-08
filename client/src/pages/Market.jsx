import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

function Market() {
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");

  /* -------------------------------
     FETCH CRYPTO (Binance)
  -------------------------------- */
  const fetchCrypto = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/market/crypto");
      setCrypto(res.data);
    } catch (err) {
      console.error("Crypto fetch error:", err.message);
    }
  };

  /* -------------------------------
     FETCH STOCKS (Yahoo Finance)
  -------------------------------- */
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/market/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error("Stock fetch error:", err.message);
    }
  };

  /* -------------------------------
     AUTO REFRESH LOGIC
  -------------------------------- */
  useEffect(() => {
    // Load initially
    fetchCrypto();
    fetchStocks();

    // Auto-refresh crypto every 5 seconds
    const cryptoInterval = setInterval(fetchCrypto, 5000);

    // Auto-refresh stocks every 30 seconds
    const stockInterval = setInterval(fetchStocks, 30000);

    // Cleanup on page leave
    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, []);

  /* -------------------------------
     SEARCH FILTER
  -------------------------------- */
  const filteredCrypto = crypto.filter((c) =>
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStocks = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <h1 style={{ marginBottom: "20px" }}>🌍 Market Explorer</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="🔍 Search crypto or stocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          color: "#fff",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      />

      {/* CRYPTO SECTION */}
      <h2 style={{ marginTop: "20px" }}>🔥 Crypto Market</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {filteredCrypto.map((c) => (
          <div
            key={c.symbol}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(0,212,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <strong style={{ fontSize: "18px", color: "#00d4ff" }}>
              {c.symbol}
            </strong>
            <p style={{ margin: 0, fontSize: "15px" }}>
              ${c.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* STOCKS SECTION */}
      <h2 style={{ marginTop: "40px" }}>📈 Stock Market</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {filteredStocks.map((s) => (
          <div
            key={s.symbol}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(0,212,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <strong style={{ fontSize: "18px", color: "#00ff88" }}>
              {s.symbol}
            </strong>
            <p style={{ margin: 0, fontSize: "15px" }}>
              ${s.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default Market;
    