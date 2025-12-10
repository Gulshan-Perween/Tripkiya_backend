import jwt from "jsonwebtoken";
import Partner from "../models/partner.js";

export const protectPartner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      
      return res.status(401).json({ message: "No token, unauthorized" });
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.partner = await Partner.findById(decoded.id).select("-password");

    if (!req.partner) {
      return res.status(401).json({ message: "Partner not found" });
    }

    next();
  }
  
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
