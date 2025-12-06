import { useEffect, useState } from "react";
import axios from "axios";

function MarketOverview() {
  const [market, setMarket] = useState({
    btcPrice: 0,
    ethPrice: 0,
    totalVolume: 0,
    topPair: "",
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        /* 1️⃣ Fetch BTC price */
        const btcRes = await axios.get(
          "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        );

        /* 2️⃣ Fetch ETH price */
        const ethRes = await axios.get(
          "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
        );

        /* 3️⃣ Fetch all tickers (for volume analysis) */
        const volumeRes = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr"
        );

        let totalVol = 0;
        let topPair = volumeRes.data[0];

        volumeRes.data.forEach((pair) => {
          const vol = parseFloat(pair.quoteVolume);
          totalVol += vol;

          if (vol > parseFloat(topPair.quoteVolume)) {
            topPair = pair;
          }
        });

        setMarket({
          btcPrice: parseFloat(btcRes.data.price),
          ethPrice: parseFloat(ethRes.data.price),
          totalVolume: totalVol.toFixed(0),
          topPair: topPair.symbol,
        });
      } catch (err) {
        console.error("MARKET OVERVIEW ERROR:", err.message);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(0,212,255,0.15)",
        height: "203px",
      }}
    >
      <h3
        style={{
          marginTop: "-10px",
          marginBottom: "8px",
          color: "#00d4ff",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        📈 Market Overview (Binance)
      </h3>

      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "10px",
          scrollbarWidth: "none",
        }}
        className="market-scroll"
      >

        <Item
          label="Bitcoin (BTC)"
          icon="₿"
          value={`$${market.btcPrice.toLocaleString()}`}
        />

        <Item
          label="Ethereum (ETH)"
          icon="Ξ"
          value={`$${market.ethPrice.toLocaleString()}`}
        />

        <Item
          label="Binance 24h Volume"
          icon="📊"
          value={`$${Number(market.totalVolume).toLocaleString()}`}
        />

        <Item
          label="Top Trading Pair"
          icon="🔥"
          value={market.topPair}
        />
      </div>
    </div>
  );
}

function Item({ label, value, icon }) {
  return (
    <div
      style={{
        background: "rgba(0,212,255,0.05)",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(0,212,255,0.2)",
        height: "150px",
      }}
    >
      <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
        {icon} {label}
      </p>
      <p
        style={{
          marginTop: "8px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#00d4ff",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default MarketOverview;
