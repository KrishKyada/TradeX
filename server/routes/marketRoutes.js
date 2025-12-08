import express from "express";
import axios from "axios";
import { nseStocks } from "../data/indianStocks.js";

const router = express.Router();

/* =====================================================
   🔥 1. CRYPTO (Binance)
===================================================== */
router.get("/crypto", async (req, res) => {
  try {
    const url = "https://api.binance.com/api/v3/ticker/price";
    const { data } = await axios.get(url);

    // Only USDT pairs
    const usdtPairs = data.filter((c) => c.symbol.endsWith("USDT"));

    const top50 = usdtPairs.slice(0, 50).map((c) => ({
      symbol: c.symbol.replace("USDT", ""),
      price: parseFloat(c.price),
      exchange: "CRYPTO",
    }));

    res.json(top50);
  } catch (err) {
    console.error("MARKET CRYPTO ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch Binance crypto data" });
  }
});

/* =====================================================
   🔥 2. NSE LIVE PRICE (India)
===================================================== */
router.get("/nse/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const response = await axios.get(
      `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.nseindia.com/",
        },
      }
    );

    const price = response.data.priceInfo.lastPrice;

    res.json({ symbol, price });
  } catch (err) {
    console.error("NSE ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch NSE stock price" });
  }
});

/* =====================================================
   🔥 3. ALL STOCKS (US + NSE merged)
===================================================== */
router.get("/stocks", async (req, res) => {
  try {
    /* --------------- US STOCKS ---------------- */
    const usSymbols = ["AAPL", "MSFT", "AMZN", "GOOGL", "TSLA", "META"];
    const usResults = [];

    for (const symbol of usSymbols) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        const { data } = await axios.get(url);

        const price =
          data.chart.result[0].meta.regularMarketPrice ||
          data.chart.result[0].meta.previousClose;

        usResults.push({ symbol, price, exchange: "NASDAQ" });
      } catch (e) {
        usResults.push({ symbol, price: 0, exchange: "NASDAQ" });
      }
    }

    /* --------------- NSE STOCKS ---------------- */
    const indianResults = [];

    for (const stock of nseStocks) {
      try {
        const r = await axios.get(
          `http://localhost:5000/api/market/nse/${stock.symbol}`
        );

        indianResults.push({
          symbol: stock.symbol,
          name: stock.name,
          price: r.data.price,
          exchange: "NSE",
        });
      } catch (e) {
        indianResults.push({
          symbol: stock.symbol,
          name: stock.name,
          price: 0,
          exchange: "NSE",
        });
      }
    }

    /* --------------- MERGE BOTH ---------------- */
    const finalList = [...usResults, ...indianResults];

    res.json(finalList);
  } catch (err) {
    console.error("MARKET STOCK ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

/* =====================================================
   🇮🇳 4. INDIAN STOCK LIST (Top NSE Stocks)
===================================================== */
router.get("/indian", async (req, res) => {
  try {
    const list = [];

    for (const stock of nseStocks) {
      try {
        const r = await axios.get(
          `http://localhost:5000/api/market/nse/${stock.symbol}`
        );

        list.push({
          symbol: stock.symbol,
          name: stock.name,
          exchange: "NSE",
          price: r.data.price,
        });
      } catch (e) {
        list.push({
          symbol: stock.symbol,
          name: stock.name,
          exchange: "NSE",
          price: 0,
        });
      }
    }

    res.json(list);
  } catch (err) {
    console.error("INDIAN MARKET ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch Indian stocks" });
  }
});

/* =====================================================
   👍 EXPORT ROUTER
===================================================== */
export default router;
