import express from "express";
import axios from "axios";

const router = express.Router();

// ⭐ BTC 24-hour price chart
router.get("/btc-24h", async (req, res) => {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";

    const { data } = await axios.get(url);

    // Extract hourly prices
    // Coingecko gives data every few minutes, so we pick 24 evenly spaced points
    const hourly = data.prices.filter((_, index) => index % 2 === 0).slice(0, 24);

    const formatted = hourly.map((item, i) => ({
      time: `Hour ${i + 1}`,
      price: item[1],
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "BTC hourly chart fetch failed" });
  }
});

export default router;
