import express from "express";
import axios from "axios";

const router = express.Router();

/* =====================================================
   1️⃣ CRYPTO (Binance Batch)
===================================================== */
router.post("/crypto/batch", async (req, res) => {
  try {
    const symbols = req.body.symbols; // ["BTC", "ETH"]

    const prices = {};

    for (const sym of symbols) {
      const pair = sym.toUpperCase() + "USDT";

      try {
        const url = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`;
        const response = await axios.get(url);
        prices[sym] = parseFloat(response.data.price);
      } catch (err) {
        prices[sym] = 0;
      }
    }

    res.json(prices);
  } catch (error) {
    console.error("BINANCE BATCH ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch crypto prices" });
  }
});

/* =====================================================
   2️⃣ STOCKS — NSE + US (Yahoo Finance)
===================================================== */

// Mapping NSE symbols to Yahoo format
const NSE_MAP = {
  RELIANCE: "RELIANCE.NS",
  TCS: "TCS.NS",
  INFY: "INFY.NS",
  ITC: "ITC.NS",
  SBIN: "SBIN.NS",
  HDFCBANK: "HDFCBANK.NS",
};

router.get("/stock/:symbol", async (req, res) => {
  try {
    const raw = req.params.symbol.toUpperCase();

    // If NSE stock → convert to Yahoo required format
    const yahooSymbol = NSE_MAP[raw] || raw;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

    const { data } = await axios.get(url);

    const meta = data.chart?.result?.[0]?.meta;

    if (!meta) {
      return res.json({ symbol: raw, price: 0 });
    }

    const price = meta.regularMarketPrice || meta.previousClose || 0;

    res.json({ symbol: raw, price });
  } catch (error) {
    console.error("YAHOO STOCK ERROR:", error.message);
    res.json({ symbol: req.params.symbol, price: 0 });
  }
});

export default router;
