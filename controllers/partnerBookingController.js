
import Booking from "../models/bookingSchema.js";

export const getPartnerBookings = async (req, res) => {
  try {
    const partnerId = req.partner._id;

    console.log("✅ Partner ID:", partnerId.toString());

    const bookings = await Booking.find({ partner: partnerId })
      .populate("package", "title price duration")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log("📦 Partner bookings count:", bookings.length);

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("❌ Partner bookings error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
