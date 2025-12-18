import express from "express";
import { adminLogin } from "../controllers/partnerController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {allowRoles} from "../middlewares/roleMiddleware.js";
import  {createManager}  from "../controllers/adminController.js";

const router = express.Router();

/* ---------- PUBLIC ---------- */
router.post("/login", adminLogin);


// 🔴 Admin only
router.get(
  "/dashboard",
  isAuthenticated,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin dashboard access" });
  }
);

router.post(
  "/create-manager",
  isAuthenticated,
  allowRoles("admin"),
  createManager
);
// 🟠 Admin + Manager
router.get(
  "/bookings",
  isAuthenticated,
  allowRoles("admin", "manager"),
  (req, res) => {
    res.json({ message: "Bookings access" });
  }
);

// 🟡 Admin + Manager + Employee
router.put(
  "/booking/:id/status",
  isAuthenticated,
  allowRoles("admin", "manager", "employee"),
  (req, res) => {
    res.json({ message: "Booking status updated" });
  }
);



export default router;
