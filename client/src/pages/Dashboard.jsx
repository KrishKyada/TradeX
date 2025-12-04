import { useEffect, useState } from "react";
import axios from "axios";
import AddAssetForm from "../components/AddAssetForm";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioChart from "../components/PortfolioChart";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [chartData, setChartData] = useState([]);

  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/portfolio/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(response.data);
  };

  const deleteAsset = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/portfolio/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  const fetchLivePrices = async () => {
    const prices = {};
    for (let asset of assets) {
      const url =
        asset.type === "crypto"
          ? `http://localhost:5000/api/prices/crypto/${asset.symbol}`
          : `http://localhost:5000/api/prices/stock/${asset.symbol}`;

      try {
        const res = await axios.get(url);
        prices[asset.symbol] = res.data.price;
      } catch {
        prices[asset.symbol] = 0;
      }
    }
    setLivePrices(prices);
  };

  const fetchChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chart/btc-24h");
      console.log("24H BTC DATA:", res.data);   // <-- ADD THIS
      setChartData(res.data);
    } catch (err) {
      console.error("BTC chart fetch error:", err.message);
    }
  };



  useEffect(() => {
    fetchAssets();
    fetchChart();
  }, []);

  useEffect(() => {
    if (assets.length > 0) fetchLivePrices();
  }, [assets]);

  let totalInvested = 0;
  let totalCurrentValue = 0;

  assets.forEach((asset) => {
    const q = Number(asset.quantity) || 0;
    const bp = Number(asset.buyPrice) || 0;
    const cp = Number(livePrices[asset.symbol]) || 0;

    totalInvested += q * bp;
    totalCurrentValue += q * cp;
  });

  const totalPL = totalCurrentValue - totalInvested;
  const plPercent = totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0;
  const formatMoney = (n) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <MainLayout>
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "auto 1fr auto",
      gap: "15px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      boxSizing: "border-box",
      overflow: "hidden",
    }}
  >

    {/* --------------------------- ROW 1 — STAT CARDS --------------------------- */}
    <StatCard title="Investment" value={`₹${formatMoney(totalInvested)}`} color1="#6a11cb" color2="#2575fc" />
    <StatCard title="Current Value" value={`₹${formatMoney(totalCurrentValue)}`} color1="#f72585" color2="#b5179e" />
    <StatCard title="Total P/L" value={`₹${formatMoney(totalPL)}`} color1="#3a0ca3" color2="#4361ee" />
    <StatCard title="Holdings" value={assets.length} color1="#ff8800" color2="#ff6f00" />



    {/* --------------------------- ROW 2 — CHART + RIGHT COLUMN --------------------------- */}
    <div
      style={{
        gridColumn: "4 / 5", // Left 60%
        gridRow: "2",
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Bitcoin Price</h3>
      <PortfolioChart data={chartData} />
    </div>

    <div
      style={{
        gridColumn: "1 / 4", // Right 40%
        gridRow: "2",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        height: "100%",
      }}
    >

      {/* Add Asset Form */}
      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Add Asset</h3>
        <AddAssetForm fetchAssets={fetchAssets} />
      </div>

      {/* Portfolio Table */}
      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Portfolio</h3>
        <PortfolioTable
          assets={assets}
          deleteAsset={deleteAsset}
          livePrices={livePrices}
        />
      </div>

    </div>

  </div>
</MainLayout>

  );
}

export default Dashboard;