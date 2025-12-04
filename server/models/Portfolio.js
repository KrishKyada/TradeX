import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["stock", "crypto"],
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true, // BTC, ETH, AAPL
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
