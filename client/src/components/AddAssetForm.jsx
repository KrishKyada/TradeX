import { useState } from "react";
import axios from "axios";

function AddAssetForm({ fetchAssets }) {
  const [type, setType] = useState("crypto");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/portfolio/add",
      {
        type,
        symbol: symbol.toUpperCase(),
        quantity,
        buyPrice,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAssets();
    setSymbol("");
    setQuantity("");
    setBuyPrice("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      {/* TYPE SELECT */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <option value="crypto">Crypto</option>
        <option value="stock">Stock</option>
      </select>

      {/* SYMBOL INPUT */}
      <input
        type="text"
        placeholder={type === "crypto" ? "BTC" : "AAPL"}
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        required
      />

      {/* QTY */}
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        required
      />

      {/* BUY PRICE */}
      <input
        type="number"
        placeholder="Buy Price"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        required
      />

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add Asset
      </button>
    </form>
  );
}

export default AddAssetForm;
