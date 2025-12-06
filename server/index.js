import authRoutes from "./routes/authRoutes.js";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import cors from "cors";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import chartRoutes from "./routes/chartRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/market", marketRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

connectDB();

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
