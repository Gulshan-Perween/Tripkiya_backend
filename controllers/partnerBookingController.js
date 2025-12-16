
// import Booking from "../models/bookingSchema.js";

// export const getPartnerBookings = async (req, res) => {
//   try {
//     const partnerId = req.partner._id;

//     console.log("✅ Partner ID:", partnerId.toString());

//     const bookings = await Booking.find({ partner: partnerId })
//       .populate("package", "title price duration")
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     console.log("📦 Partner bookings count:", bookings.length);

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       bookings
//     });

//   } catch (error) {
//     console.error("❌ Partner bookings error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


import Booking from "../models/bookingSchema.js";
import Package from "../models/Package.js";
import PartnerPackage from "../models/partnerPackage.js";

export const getPartnerBookings = async (req, res) => {
  try {
    const partnerId = req.partner._id;

    let bookings = await Booking.find({ partner: partnerId })
      .populate("package", "title price duration")
      .sort({ createdAt: -1 });

    // 🔥 Manually attach partner package if normal populate failed
    bookings = await Promise.all(
      bookings.map(async (b) => {
        if (!b.package) {
          const partnerPkg = await PartnerPackage.findById(b.package);
          if (partnerPkg) {
            b = b.toObject();
            b.package = {
              title: partnerPkg.title,
              price: partnerPkg.price,
              duration: partnerPkg.duration,
            };
          }
        }
        return b;
      })
    );

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Partner bookings error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
