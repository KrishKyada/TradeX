import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  /* --------------------------------------------
      FETCH WALLET FROM BACKEND
  -------------------------------------------- */
  const fetchWallet = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      setWallet({
        balance: data.balance ?? 0,
        totalAdded: data.totalAdded ?? 0,
        totalWithdrawn: data.totalWithdrawn ?? 0,
        netGrowth: (data.totalAdded ?? 0) - (data.totalWithdrawn ?? 0),
        history: data.history ?? [],
        chartData: data.chartData ?? [],
      });
    } catch (err) {
      console.error("WALLET GET ERROR:", err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  /* --------------------------------------------
      SMOOTH ADD MONEY (Optimistic UI)
  -------------------------------------------- */
  const addMoney = async () => {
    if (!amount) return;
    const amt = Number(amount);
    if (amt <= 0) return;

    const prevWallet = { ...wallet };

    // INSTANT UI UPDATE
    setWallet((w) => ({
      ...w,
      balance: w.balance + amt,
      totalAdded: w.totalAdded + amt,
      netGrowth: (w.totalAdded + amt) - w.totalWithdrawn,
    }));

    setAmount("");

    try {
      await axios.post(
        "http://localhost:5000/api/wallet/add",
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchWallet(); // background update
    } catch (err) {
      console.error("ADD ERROR:", err);
      setWallet(prevWallet); // revert if failed
    }
  };

  /* --------------------------------------------
      SMOOTH WITHDRAW MONEY (Optimistic UI)
  -------------------------------------------- */
  const withdrawMoney = async () => {
    if (!amount) return;
    const amt = Number(amount);
    if (amt <= 0) return;

    if (wallet.balance < amt) {
      alert("Insufficient balance");
      return;
    }

    const prevWallet = { ...wallet };

    // INSTANT UI UPDATE
    setWallet((w) => ({
      ...w,
      balance: w.balance - amt,
      totalWithdrawn: w.totalWithdrawn + amt,
      netGrowth: w.totalAdded - (w.totalWithdrawn + amt),
    }));

    setAmount("");

    try {
      await axios.post(
        "http://localhost:5000/api/wallet/withdraw",
        { amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchWallet(); // background update
    } catch (err) {
      console.error("WITHDRAW ERROR:", err);
      setWallet(prevWallet); // revert UI on failure
    }
  };

  if (!wallet)
    return (
      <MainLayout>
        <h2 style={{ color: "white" }}>Loading Wallet...</h2>
      </MainLayout>
    );

  const history = wallet.history || [];
  const chart = wallet.chartData || [];

  return (
    <MainLayout>
      <h1>💳 Wallet</h1>

      {/* BALANCE CARD */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "25px",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2 style={{ color: "#00d4ff" }}>
          Balance: ₹{wallet.balance.toLocaleString()}
        </h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <div style={{ display: "flex", marginTop: "15px", gap: "15px" }}>
          <button
            onClick={addMoney}
            style={{
              flex: 1,
              padding: "10px",
              background: "#00ff88",
              color: "#000",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Add
          </button>

          <button
            onClick={withdrawMoney}
            style={{
              flex: 1,
              padding: "10px",
              background: "#ff4d4d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <h2 style={{ marginTop: "40px" }}>📊 Wallet Summary</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <SummaryCard title="Total Added" value={wallet.totalAdded} color="#00ff88" />
        <SummaryCard title="Total Withdrawn" value={wallet.totalWithdrawn} color="#ff4d4d" />
        <SummaryCard title="Net Growth" value={wallet.netGrowth} color="#00d4ff" />
      </div>

      {/* CHART */}
      <h2 style={{ marginTop: "40px" }}>📈 Last 30 Days Activity</h2>
      <div
        style={{
          height: "250px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="net" stroke="#00d4ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* HISTORY */}
      <h2 style={{ marginTop: "40px" }}>📝 Transaction History</h2>

      {history.length === 0 ? (
        <p style={{ color: "gray" }}>No transactions yet.</p>
      ) : (
        <table style={{ width: "100%", color: "white", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((t) => (
              <tr key={t._id}>
                <td style={{ color: t.type === "add" ? "#00ff88" : "#ff4d4d" }}>
                  {t.type.toUpperCase()}
                </td>
                <td>₹{t.amount.toLocaleString()}</td>
                <td>{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
}

const SummaryCard = ({ title, value, color }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      padding: "20px",
      borderRadius: "12px",
      width: "200px",
    }}
  >
    <h4>{title}</h4>
    <h2 style={{ color }}>{`₹${value.toLocaleString()}`}</h2>
  </div>
);

export default Wallet;
