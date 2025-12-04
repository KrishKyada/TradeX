import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addAsset,
  getAssets,
  deleteAsset,
} from "../controllers/portfolioController.js";

const router = express.Router();

// All portfolio routes are protected with authMiddleware
router.post("/add", authMiddleware, addAsset);
router.get("/", authMiddleware, getAssets);
router.delete("/:id", authMiddleware, deleteAsset);

export default router;
