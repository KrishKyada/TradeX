// server/controllers/walletController.js
import Wallet from "../models/walletModel.js";
import WalletTransaction from "../models/Transaction.js";

/* ===========================
   Ensure wallet exists
=========================== */
async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      totalAdded: 0,
      totalWithdrawn: 0,
    });
  }
  return wallet;
}

/* ===========================
   GET /api/wallet
   -> wallet + last 20 txns
=========================== */
export const getWallet = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware

    const wallet = await getOrCreateWallet(userId);

    const transactions = await WalletTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ wallet, transactions });
  } catch (err) {
    console.error("WALLET GET ERROR:", err.message);
    res.status(500).json({ error: "Failed to load wallet" });
  }
};

/* ===========================
   POST /api/wallet/add
=========================== */
export const addFunds = async (req, res) => {
  try {
    const userId = req.userId;
    let { amount, category, note } = req.body;

    amount = Number(amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    category = category || "Add";
    note = note || "";

    const wallet = await getOrCreateWallet(userId);

    wallet.balance += amount;
    wallet.totalAdded += amount;
    await wallet.save();

    const tx = await WalletTransaction.create({
      userId,
      type: "add",
      amount,
      category,
      note,
      balanceAfter: wallet.balance,
    });

    res.json({ wallet, transaction: tx });
  } catch (err) {
    console.error("WALLET ADD ERROR:", err.message);
    res.status(500).json({ error: "Failed to add funds" });
  }
};

/* ===========================
   POST /api/wallet/withdraw
=========================== */
export const withdrawFunds = async (req, res) => {
  try {
    const userId = req.userId;
    let { amount, category, note } = req.body;

    amount = Number(amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const wallet = await getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      return res
        .status(400)
        .json({ error: "Insufficient wallet balance for withdrawal" });
    }

    category = category || "Withdraw";
    note = note || "";

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    await wallet.save();

    const tx = await WalletTransaction.create({
      userId,
      type: "withdraw",
      amount,
      category,
      note,
      balanceAfter: wallet.balance,
    });

    res.json({ wallet, transaction: tx });
  } catch (err) {
    console.error("WALLET WITHDRAW ERROR:", err.message);
    res.status(500).json({ error: "Failed to withdraw funds" });
  }
};

/* ===========================
   GET /api/wallet/transactions
   -> optional dedicated endpoint
=========================== */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Number(req.query.limit) || 50;

    const transactions = await WalletTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(transactions);
  } catch (err) {
    console.error("WALLET TXN ERROR:", err.message);
    res.status(500).json({ error: "Failed to load transactions" });
  }
};
