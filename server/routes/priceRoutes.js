import express from "express";
import axios from "axios";

const router = express.Router();

// GET Crypto Price
router.get("/crypto/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toLowerCase();

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    );

    res.json({ price: response.data[symbol].usd });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch crypto price" });
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
