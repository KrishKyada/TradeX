import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    // Expecting header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user id to request object
    req.userId = decoded.id;

    next(); // go to next middleware / controller
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
