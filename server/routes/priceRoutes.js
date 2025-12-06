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

// GET Stock Price
router.get("/stock/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`
    );

    res.json({ price: response.data.c });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});

export default router;
