import { useEffect, useState } from "react";
import axios from "axios";
import PortfolioChart from "../components/PortfolioChart";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import TrendingAssets from "../components/TrendingAssets";
import MarketOverview from "../components/MarketOverview";
import AdvancedAnalytics from "../components/AdvancedAnalytics";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [chartData, setChartData] = useState([]);

  /* ---------------------------
        FETCH USER ASSETS
  ---------------------------- */
  const fetchAssets = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/portfolio/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(response.data);
  };

  /* --------------------------------
        FETCH PRICES (Crypto/Stocks)
  -------------------------------- */
  const fetchCryptoPrices = async () => {
    const cryptoAssets = assets.filter((a) => a.type === "crypto");
    if (cryptoAssets.length === 0) return;

    const symbols = cryptoAssets.map((a) => a.symbol);
    const res = await axios.post("http://localhost:5000/api/prices/crypto/batch", { symbols });

    setLivePrices((prev) => ({ ...prev, ...res.data }));
  };

  const fetchStockPrices = async () => {
    const stockAssets = assets.filter((a) => a.type === "stock");

    let stockLive = {};
    for (const asset of stockAssets) {
      try {
        const res = await axios.get(`http://localhost:5000/api/prices/stock/${asset.symbol}`);
        stockLive[asset.symbol] = res.data.price;
      } catch {
        stockLive[asset.symbol] = 0;
      }
    }

    setLivePrices((prev) => ({ ...prev, ...stockLive }));
  };

  /* ---------------------------
        FETCH BTC CHART
  ---------------------------- */
  const fetchChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chart/btc-24h");
      setChartData(res.data);
    } catch (err) {
      console.error("BTC chart fetch error:", err.message);
    }
  };

  /* ---------------------------
        LOAD ASSETS INITIALLY
  ---------------------------- */
  useEffect(() => {
    fetchAssets();
    fetchChart();
  }, []);

  /* -------------------------------------------------------
        LIVE PRICE AUTO REFRESH (Crypto: 5s, Stocks: 30s)
  -------------------------------------------------------- */
  useEffect(() => {
    if (assets.length === 0) return;

    // Initial fetch
    fetchCryptoPrices();
    fetchStockPrices();

    // Crypto → every 5 seconds
    const cryptoInterval = setInterval(fetchCryptoPrices, 5000);

    // Stocks → every 30 seconds
    const stockInterval = setInterval(fetchStockPrices, 30000);

    // Cleanup when component unmounts
    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, [assets]);

  /* ---------------------------
        CALCULATIONS
  ---------------------------- */
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

  const formatMoney = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const sparklineData = chartData.slice(-10).map((d) => d.price / 100000);

  return (
    <MainLayout>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "minmax(120px, auto) 1fr 1fr",
          gap: "10px",
          overflow: "hidden",
          padding: "0",
        }}
      >
        {/* Stat Cards */}
        <div
          style={{
            gridColumn: "1 / 7",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            height: "165px",
          }}
        >
          <StatCard title="Investment" value={`₹${formatMoney(totalInvested)}`} />
          <StatCard title="Current Value" value={`₹${formatMoney(totalCurrentValue)}`} />
          <StatCard
            title="Total P/L"
            value={`₹${formatMoney(totalPL)}`}
            subtitle={`${plPercent}%`}
            color1={totalPL >= 0 ? "#00ff88" : "#ff4d4d"}
            color2={totalPL >= 0 ? "#00cc6a" : "#ff2a2a"}
          />
          <StatCard title="Holdings" value={assets.length} />
        </div>

        {/* Chart */}
        <div style={{ gridColumn: "1 / 5", gridRow: "2 / 3" }}>
          <PortfolioChart data={chartData} />
        </div>

        {/* Trending */}
        <div style={{ gridColumn: "5 / 7", gridRow: "2 / 3" }}>
          <TrendingAssets />
        </div>

        {/* Market Overview */}
        <div style={{ gridColumn: "1 / 4", gridRow: "3 / 4" }}>
          <MarketOverview />
        </div>

        {/* Analytics */}
        <div style={{ gridColumn: "4 / 7", gridRow: "3 / 4" }}>
          <AdvancedAnalytics />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
