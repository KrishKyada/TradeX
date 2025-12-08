import express from "express";
import axios from "axios";

const router = express.Router();

/* ===============================
   📌 Fetch Top Crypto Prices (Binance)
================================ */
router.get("/crypto", async (req, res) => {
  try {
    const url = "https://api.binance.com/api/v3/ticker/price";
    const { data } = await axios.get(url);

    // Filter for USDT markets only (to avoid BNB/BTC, ETH/BTC etc.)
    const usdtPairs = data.filter((c) => c.symbol.endsWith("USDT"));

    // Take top 50 and clean symbol names
    const top50 = usdtPairs.slice(0, 50).map((c) => ({
      symbol: c.symbol.replace("USDT", ""),
      price: parseFloat(c.price),
    }));

    res.json(top50);
  } catch (err) {
    console.error("MARKET CRYPTO ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch Binance crypto data" });
  }
});

/* ===============================
   📌 Fetch Popular Stock Prices (Yahoo Finance)
================================ */
router.get("/stocks", async (req, res) => {
  try {
    const popularStocks = ["AAPL", "MSFT", "AMZN", "GOOGL", "TSLA", "META"];

    const results = [];

    for (const symbol of popularStocks) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

      try {
        const { data } = await axios.get(url);

        const price =
          data.chart.result[0].meta.regularMarketPrice ||
          data.chart.result[0].meta.previousClose;

        results.push({ symbol, price });
      } catch {
        results.push({ symbol, price: 0 });
      }
    }

    res.json(results);
  } catch (err) {
    console.error("MARKET STOCK ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

/* ===============================
   📌 Export Router (IMPORTANT)
================================ */
export default router;
