import express from "express";
import axios from "axios";

const router = express.Router();

// GET Crypto Price
// GET Crypto Prices (Batch)
router.post("/crypto/batch", async (req, res) => {
  try {
    const symbols = req.body.symbols; // ["BTC", "ETH", "SOL"]

    // Binance symbol mapping: BTC -> BTCUSDT
    const prices = {};

    for (const sym of symbols) {
      const pair = sym + "USDT"; // BTC -> BTCUSDT

      const url = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`;

      try {
        const response = await axios.get(url);
        prices[sym] = parseFloat(response.data.price);
      } catch (err) {
        prices[sym] = 0; // fallback if symbol not found
      }
    }

    res.json(prices);

  } catch (error) {
    console.error("BINANCE BATCH ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch Binance crypto prices" });
  }
});

// GET Stock Price (Yahoo Finance - No API key needed)
router.get("/stock/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`;

    const { data } = await axios.get(url);

    // Check if Yahoo returned valid data
    if (
      !data.chart ||
      !data.chart.result ||
      !data.chart.result[0] ||
      !data.chart.result[0].meta
    ) {
      return res.status(400).json({
        error: `Symbol '${symbol}' not found or not supported.`,
      });
    }

    const meta = data.chart.result[0].meta;

    const price =
      meta.regularMarketPrice ?? meta.previousClose ?? null;

    if (!price) {
      return res.status(400).json({
        error: `Could not fetch price for symbol '${symbol}'.`,
      });
    }

    res.json({ price });

  } catch (error) {
    console.error("YAHOO STOCK ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});



export default router;
