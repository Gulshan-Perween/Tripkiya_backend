import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookie or header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided", success: false });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};

// ✅ Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }
  } catch (error) {
    console.error("Admin check error:", error.message);
    res.status(500).json({ message: "Error verifying admin" });
  }
};

// ✅ Export both middlewares
export { isAuthenticated, verifyAdmin };
