// import Partner from "../models/partner.js";
// import jwt from "jsonwebtoken";
 
// // -------------------- Generate JWT --------------------
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // -------------------- Signup --------------------
// export const partnerSignup = async (req, res) => {
//   try {
//     const { name, email, password, agencyName, phone } = req.body;

//     // Check existing partner
//     const exists = await Partner.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const partner = await Partner.create({
//       name,
//       email,
//       password,
//       agencyName,
//       phone,
//     });

//     res.status(201).json({
//       message: "Partner registered successfully",
//       partner,
//       token: generateToken(partner._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // -------------------- Login --------------------
// export const partnerLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const partner = await Partner.findOne({ email });

//     if (!partner) {
//       return res.status(404).json({ message: "Partner not found" });
//     }

//     const isMatch = await partner.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     res.json({
//       message: "Login successful",
//       partner,
//       token: generateToken(partner._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // -------------------- Logout --------------------
// export const partnerLogout = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // -------------------- Partner Profile --------------------
// export const partnerProfile = async (req, res) => {
//   try {
//     // req.partner comes from protectPartner middleware
//     const partner = await Partner.findById(req.partner._id).select("-password");

//     if (!partner) {
//       return res.status(404).json({ message: "Partner not found" });
//     }

//     res.status(200).json({
//       success: true,
//       partner,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import Partner from "../models/partner.js";
import jwt from "jsonwebtoken";

// -------------------- Generate JWT --------------------
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// -------------------- PARTNER SIGNUP --------------------
export const partnerSignup = async (req, res) => {
  try {
    const { name, email, password, agencyName, phone } = req.body;

    const exists = await Partner.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const partner = await Partner.create({
      name,
      email,
      password,
      agencyName,
      phone,
    });

    res.status(201).json({
      message: "Partner registered successfully",
      partner,
      token: generateToken(partner._id, "partner"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- PARTNER LOGIN --------------------
export const partnerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const isMatch = await partner.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      partner,
      token: generateToken(partner._id, "partner"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- ADMIN LOGIN --------------------
// -------------------- ADMIN LOGIN --------------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // using .env values
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }

    // Success
    return res.json({
      success: true,
      message: "Admin login successful",
      admin: { email },
      token: generateToken("admin", "admin"), // static id since no DB
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- PARTNER PROFILE --------------------
export const partnerProfile = async (req, res) => {
  try {
    const partner = await Partner.findById(req.partner._id).select("-password");

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json({
      success: true,
      partner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
