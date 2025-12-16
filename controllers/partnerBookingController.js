// import Booking from "../models/bookingSchema.js";
// import Package from "../models/Package.js";

// export const getPartnerBookings = async (req, res) => {
//   try {
//     const partnerId = req.partner._id;
    
//     console.log("🔍 Partner ID from auth:", partnerId);
//     console.log("🔍 Partner ID type:", typeof partnerId);
//     console.log("🔍 Partner ID string:", partnerId.toString());
    
//     // Method 1: Direct query on partner field
//     const directBookings = await Booking.find({ partner: partnerId })
//       .populate("package", "title price duration")
//       .populate("user", "name email")
//       .populate("partner", "companyName email")
//       .sort({ createdAt: -1 });
    
//     console.log("📊 Direct bookings found:", directBookings.length);
    
//     // Method 2: Query via packages (backup method)
//     const partnerPackages = await Package.find({ partner: partnerId }).select('_id');
//     const packageIds = partnerPackages.map(p => p._id);
    
//     console.log("📦 Partner's packages:", packageIds.length);
    
//     const packageBookings = await Booking.find({
//       package: { $in: packageIds }
//     })
//       .populate("package", "title price duration")
//       .populate("user", "name email")
//       .populate("partner", "companyName email")
//       .sort({ createdAt: -1 });
    
//     console.log("📊 Package bookings found:", packageBookings.length);
    
//     // Combine and deduplicate
//     const allBookings = [...directBookings];
    
//     packageBookings.forEach(pb => {
//       if (!allBookings.find(b => b._id.toString() === pb._id.toString())) {
//         allBookings.push(pb);
//       }
//     });
    
//     console.log("📊 Total unique bookings:", allBookings.length);
//     console.log("📋 Booking IDs:", allBookings.map(b => b._id));
    
//     res.json({
//       success: true,
//       count: allBookings.length,
//       bookings: allBookings
//     });
    
//   } catch (error) {
//     console.error("❌ Error fetching partner bookings:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

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
