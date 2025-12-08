import express from "express";
import booking from "../models/bookingSchema.js";   // ⬅️ FIXED (missing import)

import {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// 🔹 Update payment status
router.post("/update-payment", async (req, res) => {
  try {
    const { bookingId, status, paymentId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId required" });
    }

    await booking.findByIdAndUpdate(bookingId, {
      status,
      paymentId,
    });

    res.json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 Create new booking
router.post("/", createBooking);

// 🔹 Get all bookings
router.get("/", getAllBookings);

// 🔹 Get bookings by user email
router.get("/user/:email", getUserBookings);

// 🔹 Cancel booking
router.delete("/:id", cancelBooking);


export default router;
