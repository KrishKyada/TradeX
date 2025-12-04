import { useEffect, useState } from "react"
import axios from "axios"
import PortfolioChart from "../components/PortfolioChart"
import MainLayout from "../layout/MainLayout"
import StatCard from "../components/StatCard"
import TrendingAssets from "../components/TrendingAssets"
import MarketOverview from "../components/MarketOverview"
import AdvancedAnalytics from "../components/AdvancedAnalytics"

function Dashboard() {
  const [assets, setAssets] = useState([])
  const [livePrices, setLivePrices] = useState({})
  const [chartData, setChartData] = useState([])

  const fetchAssets = async () => {
    const token = localStorage.getItem("token")
    const response = await axios.get("http://localhost:5000/api/portfolio/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setAssets(response.data)
  }

  const fetchLivePrices = async () => {
    const prices = {}
    for (const asset of assets) {
      const url =
        asset.type === "crypto"
          ? `http://localhost:5000/api/prices/crypto/${asset.symbol}`
          : `http://localhost:5000/api/prices/stock/${asset.symbol}`

      try {
        const res = await axios.get(url)
        prices[asset.symbol] = res.data.price
      } catch {
        prices[asset.symbol] = 0
      }
    }
    setLivePrices(prices)
  }

  const fetchChart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chart/btc-24h")
      setChartData(res.data)
    } catch (err) {
      console.error("BTC chart fetch error:", err.message)
    }
  }

  useEffect(() => {
    fetchAssets()
    fetchChart()
  }, [])

  useEffect(() => {
    if (assets.length > 0) fetchLivePrices()
  }, [assets])

  let totalInvested = 0
  let totalCurrentValue = 0

  assets.forEach((asset) => {
    const q = Number(asset.quantity) || 0
    const bp = Number(asset.buyPrice) || 0
    const cp = Number(livePrices[asset.symbol]) || 0

    totalInvested += q * bp
    totalCurrentValue += q * cp
  })

  const totalPL = totalCurrentValue - totalInvested
  const plPercent = totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0

  const formatMoney = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 })

  const sparklineData = chartData
    .slice(-10)
    .map((d) => d.price)
    .map((p) => p / 100000)

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
        {/* ROW 1 - STAT CARDS WITH ANIMATIONS */}
        <div
          style={{
            gridColumn: "1 / 7",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "18px",
            height: "165px",
          }}
        >
          <StatCard
            title="Investment"
            value={`₹${formatMoney(totalInvested)}`}
            color1="#00d4ff"
            color2="#0099cc"
            sparklineData={sparklineData}
          />
          <StatCard
            title="Current Value"
            value={`₹${formatMoney(totalCurrentValue)}`}
            color1="#00ff88"
            color2="#00cc6a"
            sparklineData={sparklineData}
          />
          <StatCard
            title="Total P/L"
            value={`₹${formatMoney(totalPL)}`}
            color1={totalPL >= 0 ? "#00ff88" : "#ff4d4d"}
            color2={totalPL >= 0 ? "#00cc6a" : "#ff2a2a"}
            subtitle={`${plPercent}%`}
            sparklineData={sparklineData}
          />
          <StatCard
            title="Holdings"
            value={assets.length}
            color1="#ff8800"
            color2="#ff6f00"
            subtitle="Total Assets"
            sparklineData={sparklineData}
          />
        </div>

        {/* ROW 2 - BITCOIN CHART (LEFT) and TRENDING ASSETS (RIGHT) */}
        <div
          style={{
            gridColumn: "1 / 4",
            gridRow: "2 / 3",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <PortfolioChart data={chartData} />
        </div>

        <div
          style={{
            gridColumn: "4 / 7",
            gridRow: "2 / 3",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <TrendingAssets />
        </div>

        {/* ROW 3 - MARKET OVERVIEW (LEFT) and ADVANCED ANALYTICS (RIGHT) */}
        <div
          style={{
            gridColumn: "1 / 3",
            gridRow: "3 / 4",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <MarketOverview />
        </div>

        <div
          style={{
            gridColumn: "3 / 7",
            gridRow: "3 / 4",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <AdvancedAnalytics />
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
