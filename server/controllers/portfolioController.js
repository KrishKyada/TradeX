import Portfolio from "../models/Portfolio.js";

// ADD ASSET
export const addAsset = async (req, res) => {
  try {
    const { type, symbol, quantity, buyPrice } = req.body;

    if (!type || !symbol || !quantity || !buyPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const asset = await Portfolio.create({
      userId: req.userId, // from authMiddleware
      type,
      symbol,
      quantity,
      buyPrice,
    });

    res.status(201).json({
      message: "Asset added to portfolio",
      asset,
    });
  } catch (error) {
    console.error("Add asset error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL ASSETS FOR LOGGED-IN USER
export const getAssets = async (req, res) => {
  try {
    const assets = await Portfolio.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(assets);
  } catch (error) {
    console.error("Get assets error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE ASSET BY ID
export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await Portfolio.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({ message: "Asset deleted" });
  } catch (error) {
    console.error("Delete asset error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
