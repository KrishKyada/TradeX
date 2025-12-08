import express from "express";
import Wallet from "../models/walletModel.js";
import Transaction from "../models/Transaction.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   📌 UTIL: Build last 30 days chart
------------------------------------------- */
function generateChartData(history) {
  const days = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayStr = date.toISOString().split("T")[0];

    const dayTx = history.filter(
      (h) => h.date.toISOString().split("T")[0] === dayStr
    );

    const net =
      dayTx.reduce(
        (sum, tx) => sum + (tx.type === "add" ? tx.amount : -tx.amount),
        0
      ) || 0;

    days.push({ date: dayStr, net });
  }

  return days;
}

/* ------------------------------------------
   📌 GET WALLET + HISTORY + CHART
------------------------------------------- */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.userId });

    if (!wallet) {
      wallet = new Wallet({ userId: req.userId });
      await wallet.save();
    }

    const history = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(100);

    const chartData = generateChartData(history);

    const netGrowth = wallet.totalAdded - wallet.totalWithdrawn;

    res.json({
      balance: wallet.balance,
      totalAdded: wallet.totalAdded,
      totalWithdrawn: wallet.totalWithdrawn,
      netGrowth,
      history,
      chartData,
    });
  } catch (err) {
    console.error("WALLET GET ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

/* ------------------------------------------
   📌 ADD MONEY
------------------------------------------- */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ userId: req.userId });
    if (!wallet) wallet = new Wallet({ userId: req.userId });

    wallet.balance += amount;
    wallet.totalAdded += amount;
    await wallet.save();

    await Transaction.create({
      userId: req.userId,
      type: "add",
      amount,
      date: new Date(),
      category: "Wallet Deposit",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("WALLET ADD ERROR:", err.message);
    res.status(500).json({ error: "Failed to add funds" });
  }
});

/* ------------------------------------------
   📌 WITHDRAW MONEY
------------------------------------------- */
router.post("/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ userId: req.userId });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    await wallet.save();

    await Transaction.create({
      userId: req.userId,
      type: "withdraw",
      amount,
      date: new Date(),
      category: "Wallet Withdrawal",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("WALLET WITHDRAW ERROR:", err.message);
    res.status(500).json({ error: "Failed to withdraw funds" });
  }
});

export default router;
