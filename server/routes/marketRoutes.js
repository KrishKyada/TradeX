import express from "express";
import axios from "axios";

const router = express.Router();

// GET Global Market Data from CoinStats
router.get("/global", async (req, res) => {
  try {
    const response = await axios.get("https://api.coinstats.app/public/v1/global");
    res.json(response.data);
  } catch (error) {
    console.error("COINSTATS GLOBAL ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch global market data" });
  }
});

export default router;
