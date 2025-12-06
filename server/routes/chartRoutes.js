import express from "express";
import axios from "axios";

const router = express.Router();

// ⭐ BTC 24-hour price chart
router.get("/btc-24h", async (req, res) => {
  try {
    const url =
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24";

    const { data } = await axios.get(url);

    const formatted = data.map((item, i) => ({
      time: `Hour ${i + 1}`,
      price: parseFloat(item[4]), // closing price
    }));

    res.json(formatted);

  } catch (error) {
    console.error("BTC CHART ERROR:", error.message);
    res.status(500).json({ error: "BTC chart fetch failed" });
  }
});


export default router;
