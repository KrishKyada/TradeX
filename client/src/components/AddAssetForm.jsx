import { useState } from "react"
import axios from "axios"

function AddAssetForm({ fetchAssets }) {
  const [formData, setFormData] = useState({
    type: "crypto",
    symbol: "",
    quantity: "",
    buyPrice: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      await axios.post("http://localhost:5000/api/portfolio/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({ type: "crypto", symbol: "", quantity: "", buyPrice: "" })
      fetchAssets()
    } catch (error) {
      console.error("Error adding asset:", error)
      alert("Failed to add asset")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#00d4ff",
              fontWeight: "600",
            }}
          >
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff"
              e.target.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 212, 255, 0.3)"
              e.target.style.boxShadow = "none"
            }}
          >
            <option value="crypto">Crypto</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#00d4ff",
              fontWeight: "600",
            }}
          >
            Symbol
          </label>
          <input
            type="text"
            name="symbol"
            placeholder="BTC, ETH, AAPL"
            value={formData.symbol}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff"
              e.target.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 212, 255, 0.3)"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#00d4ff",
              fontWeight: "600",
            }}
          >
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="0"
            value={formData.quantity}
            onChange={handleChange}
            step="0.001"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff"
              e.target.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 212, 255, 0.3)"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "13px",
              color: "#00d4ff",
              fontWeight: "600",
            }}
          >
            Buy Price
          </label>
          <input
            type="number"
            name="buyPrice"
            placeholder="0"
            value={formData.buyPrice}
            onChange={handleChange}
            step="0.01"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#00d4ff"
              e.target.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 212, 255, 0.3)"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          padding: "12px",
          marginTop: "8px",
          background: "linear-gradient(135deg, #00d4ff, #0099cc)",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontWeight: "600",
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0, 212, 255, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 212, 255, 0.3)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 212, 255, 0.2)"
        }}
      >
        ➕ Add Asset
      </button>
    </form>
  )
}

export default AddAssetForm
