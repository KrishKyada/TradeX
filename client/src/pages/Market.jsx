import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import AddAssetModal from "../components/AddAssetModal";

function Market() {
  const [crypto, setCrypto] = useState([]);
  const [stocks, setStocks] = useState([]); // USA + NSE merged from backend
  const [search, setSearch] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({
    symbol: "",
    type: "",
    price: 0,
  });

  /* -------------------------------
     OPEN MODAL WITH PRE-FILLED DATA
  -------------------------------- */
  const openAddModal = (symbol, type, price) => {
    setSelected({ symbol, type, price });
    setShowModal(true);
  };

  /* -------------------------------
     FETCH CRYPTO (BINANCE)
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
     FETCH STOCKS (USA + NSE merged)
  -------------------------------- */
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/market/stocks");
      setStocks(res.data); // backend already includes NSE + NASDAQ
    } catch (err) {
      console.error("Stock fetch error:", err.message);
    }
  };

  /* -------------------------------
     AUTO REFRESH LOGIC
  -------------------------------- */
  useEffect(() => {
    fetchCrypto();
    fetchStocks();

    const cryptoInterval = setInterval(fetchCrypto, 5000);
    const stockInterval = setInterval(fetchStocks, 30000);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, []);

  /* -------------------------------
     FILTERS
  -------------------------------- */
  const filteredCrypto = crypto.filter((c) =>
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUSStocks = stocks.filter(
    (s) =>
      s.exchange === "NASDAQ" &&
      s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNSEStocks = stocks.filter(
    (s) =>
      s.exchange === "NSE" &&
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

      {/* ---------------------- CRYPTO MARKET ----------------------- */}
      <h2 style={{ marginTop: "20px" }}>₿ Crypto Market</h2>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "18px", color: "#00d4ff" }}>
                {c.symbol}
              </strong>

              <button
                onClick={() => openAddModal(c.symbol, "crypto", c.price)}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: "#00d4ff",
                  color: "black",
                  fontWeight: "600",
                }}
              >
                + Add
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "15px" }}>
              ${c.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------------- US STOCK MARKET ----------------------- */}
      <h2 style={{ marginTop: "40px" }}>US Stock Market</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {filteredUSStocks.map((s) => (
          <div
            key={s.symbol}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(0,212,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "18px", color: "#00ff88" }}>
                {s.symbol}
              </strong>

              <button
                onClick={() => openAddModal(s.symbol, "stock", s.price)}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: "#00ff88",
                  color: "black",
                  fontWeight: "600",
                }}
              >
                + Add
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "15px" }}>
              ${s.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------------- NSE STOCK MARKET ----------------------- */}
      <h2 style={{ marginTop: "40px" }}>IN Stock Market</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {filteredNSEStocks.map((s) => (
          <div
            key={s.symbol}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(0,212,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "18px", color: "#ffaa00" }}>
                {s.symbol}
              </strong>

              <button
                onClick={() => openAddModal(s.symbol, "stock", s.price)}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: "#ffaa00",
                  color: "black",
                  fontWeight: "600",
                }}
              >
                + Add
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "15px" }}>
              ₹{s.price.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------------- ADD ASSET MODAL ----------------------- */}
      {showModal && (
        <AddAssetModal
          presetSymbol={selected.symbol}
          presetType={selected.type}
          presetPrice={selected.price}
          onClose={() => setShowModal(false)}
          onAdded={() => {}}
        />
      )}
    </MainLayout>
  );
}

export default Market;
