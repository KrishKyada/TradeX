import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["add", "withdraw"],
      required: true
    },
    amount: { type: Number, required: true },
    category: { type: String, default: "Wallet" },
    date: { type: Date, default: Date.now },
  }
);

export default mongoose.model("Transaction", transactionSchema);
