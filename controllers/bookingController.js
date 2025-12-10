



// import Booking from "../models/bookingSchema.js";
// import nodemailer from "nodemailer";

// // 📌 Create Booking (with payment email)
// // export const createBooking = async (req, res) => {
// //   try {
// //     const {
// //       fullName,
// //       email,
// //       phone,
// //       destination,
// //       travelers,
// //       date,
// //       packageId,
// //       userId,
// //     } = req.body;

// //     // 1️⃣ Create booking in DB
// //     const booking = new Booking({
// //       fullName,
// //       email,
// //       phone,
// //       destination,
// //       travelers,
// //       date,
// //       package: packageId || null,
// //       user: userId || null,
// //       partner: pkg?.partner || null

// //     });

// //     await booking.save();

// //     // 2️⃣ Populate booking fields
// //     const populatedBooking = await Booking.findById(booking._id)
// //       .populate("package", "title price duration")
// //       .populate("user", "name email");

// //     // 3️⃣ Calculate payment amount
// //     const amount = populatedBooking.package
// //       ? populatedBooking.package.price
// //       : 0;

// //     // 4️⃣ Send confirmation + payment email
// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: `Tripkiya <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: `Your Trip Booking – Payment Pending for ${destination} ✈️`,
// //       html: `
// //       <div style="font-family: Arial; padding: 20px; max-width:600px;margin:auto;">
        
// //         <h2 style="color:#301bb6">Your Trip Booking is Received 🎉</h2>
// //         <p>Hi <strong>${fullName}</strong>, thank you for booking with <strong>Tripkiya</strong>.</p>

// //         <h3>📄 Booking Details</h3>
// //         <p><strong>Destination:</strong> ${destination}</p>
// //         <p><strong>Travel Date:</strong> ${date}</p>
// //         <p><strong>Travelers:</strong> ${travelers}</p>
// //         <p><strong>Phone:</strong> ${phone}</p>

// //         ${
// //           populatedBooking.package
// //             ? `
// //           <h3>🧳 Package Details</h3>
// //           <p><strong>Package:</strong> ${populatedBooking.package.title}</p>
// //           <p><strong>Duration:</strong> ${populatedBooking.package.duration}</p>
// //           <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
// //         `
// //             : ""
// //         }

// //         <hr style="margin:20px 0">

// //         <h3 style="color:#d9534f">⚠ Payment Pending</h3>
// //         <p>Please complete your payment to confirm your booking.</p>

// //         <a href="https://tripkiya.com/payment?booking=${booking._id}&amount=${amount}" 
// //            style="background:#301bb6;color:#fff;padding:12px 18px;text-decoration:none;border-radius:8px;display:inline-block;margin-top:10px;">
// //            Proceed to Pay ₹${amount.toLocaleString()}
// //         </a>

// //         <hr style="margin:25px 0;">

// //         <p style="font-size:13px;color:#666;text-align:center;">
// //           Tripkiya Travels • Your Trusted Travel Partner
// //         </p>

// //       </div>
// //       `,
// //     });

// //     // 5️⃣ Response
// //     res.status(201).json({
// //       success: true,
// //       message: "Booking created & payment email sent",
// //       booking: populatedBooking,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error creating booking:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to create booking",
// //     });
// //   }
// // };

// // 📌 Create Booking (with payment email)
// export const createBooking = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       packageId,
//       userId,
//     } = req.body;

//     // 🔥 get package only if present
//     const pkg = packageId ? await Package.findById(packageId) : null;

//     // 1️⃣ Create booking in DB
//     const booking = new Booking({
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       package: packageId || null,
//       user: userId || null,
//       partner: pkg ? pkg.partner : null   // safe
//     });

//     await booking.save();


// // 📌 Get All Bookings
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email")
//       .populate("package", "title price duration")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Get User Bookings
// export const getUserBookings = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const bookings = await Booking.find({ email });
//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Cancel Booking
// export const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: "cancelled" },
//       { new: true }
//     );

//     if (!booking)
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// import Booking from "../models/bookingSchema.js";
// import Package from "../models/package.js"; // ⬅️ Make sure to import Package
// import nodemailer from "nodemailer";



// export const createBooking = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       packageId,
//       userId,
//     } = req.body;

//     // 🔥 get package only if present
//     let pkg = null;
//     if (packageId) {
//       pkg = await Package.findById(packageId);
//       if (!pkg) {
//         return res.status(404).json({
//           success: false,
//           message: "Package not found",
//         });
//       }
//     }

//     // 1️⃣ Create booking in DB
//     const booking = new Booking({
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       package: pkg ? pkg._id : null,     // link package _id
//       user: userId || null,
//   partner: req.partner?._id   // <- final fix
//     });

//     await booking.save();

//     // 2️⃣ Populate booking fields
//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("package", "title price duration")
//       .populate("user", "name email");

//     // 3️⃣ Calculate payment amount
//     const amount = populatedBooking.package
//       ? populatedBooking.package.price
//       : 0;

//     // 4️⃣ Send confirmation email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `Tripkiya <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Your Trip Booking – Payment Pending for ${destination} ✈️`,
//       html: `<p>Hi ${fullName}, your booking is received. Amount: ₹${amount}</p>`,
//     });

//     // 5️⃣ Response
//     res.status(201).json({
//       success: true,
//       message: "Booking created & payment email sent",
//       booking: populatedBooking,
//     });
//   } catch (error) {
//     console.error("❌ Error creating booking:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create booking",
//     });
//   }
// };
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email")
//       .populate("package", "title price duration")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, bookings });
//     console.log("✅ Fetched all bookings:", bookings);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Get User Bookings
// export const getUserBookings = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const bookings = await Booking.find({ email });
//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Cancel Booking
// export const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: "cancelled" },
//       { new: true }
//     );

//     if (!booking)
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// import Booking from "../models/bookingSchema.js";
// import Package from "../models/package.js";
// import nodemailer from "nodemailer";

// export const createBooking = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       packageId,
//       userId,
//     } = req.body;

//     // 🔥 Get package and extract partner from it
//     let pkg = null;
//     let partnerId = null;

//     if (packageId) {
//       pkg = await Package.findById(packageId);
//       if (!pkg) {
//         return res.status(404).json({
//           success: false,
//           message: "Package not found",
//         });
//       }
//       // Extract partner from the package
//       partnerId = pkg.partner;
//       console.log("📦 Package found, partner ID:", partnerId);
//     }

//     // 1️⃣ Create booking in DB
//     const booking = new Booking({
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       package: pkg ? pkg._id : null,
//       user: userId || null,
//       partner: partnerId, // ← Use partner from package, not from req.partner
//     });

//     await booking.save();
//     console.log("✅ Booking created with partner:", booking.partner);

//     // 2️⃣ Populate booking fields
//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("package", "title price duration")
//       .populate("user", "name email")
//       .populate("partner", "companyName email"); // Also populate partner details

//     // 3️⃣ Calculate payment amount
//     const amount = populatedBooking.package
//       ? populatedBooking.package.price
//       : 0;

//     // 4️⃣ Send confirmation email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `Tripkiya <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Your Trip Booking – Payment Pending for ${destination} ✈️`,
//       html: `<p>Hi ${fullName}, your booking is received. Amount: ₹${amount}</p>`,
//     });

//     // 5️⃣ Response
//     res.status(201).json({
//       success: true,
//       message: "Booking created & payment email sent",
//       booking: populatedBooking,
//     });
//   } catch (error) {
//     console.error("❌ Error creating booking:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create booking",
//     });
//   }
// };

// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email")
//       .populate("package", "title price duration")
//       .populate("partner", "companyName email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, bookings });
//     console.log("✅ Fetched all bookings:", bookings.length);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getUserBookings = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const bookings = await Booking.find({ email })
//       .populate("package", "title price duration")
//       .populate("partner", "companyName email");
//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: "cancelled" },
//       { new: true }
//     );

//     if (!booking)
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// import Booking from "../models/bookingSchema.js";
// import Package from "../models/Package.js"; // Try with capital P
// import nodemailer from "nodemailer";

// // export const createBooking = async (req, res) => {
// //   try {
// //     const {
// //       fullName,
// //       email,
// //       phone,
// //       destination,
// //       travelers,
// //       date,
// //       packageId,
// //       userId,
// //     } = req.body;

// //     console.log("📝 Request body:", req.body);
// //     console.log("📦 Package ID received:", packageId);

// //     // 🔥 Get package and extract partner from it
// //     let pkg = null;
// //     let partnerId = null;

// //     if (packageId) {
// //       pkg = await Package.findById(packageId);
// //       console.log("📦 Package found:", pkg ? "YES" : "NO");
      
// //       if (!pkg) {
// //         return res.status(404).json({
// //           success: false,
// //           message: "Package not found",
// //         });
// //       }

// //       console.log("📦 Full package data:", JSON.stringify(pkg, null, 2));
// //       console.log("👤 Package partner field:", pkg.partner);
      
// //       // Extract partner from the package
// //       partnerId = pkg.partner;
// //       console.log("👤 Partner ID extracted:", partnerId);
// //       console.log("👤 Partner ID type:", typeof partnerId);
// //       console.log("👤 Partner ID is null?:", partnerId === null);
// //       console.log("👤 Partner ID is undefined?:", partnerId === undefined);
// //       console.log("👤 Partner ID toString():", partnerId ? partnerId.toString() : "NO VALUE");
// //     } else {
// //       console.log("⚠️ No packageId provided in request");
// //     }

// //     // 1️⃣ Create booking in DB
// //     const booking = new Booking({
// //       fullName,
// //       email,
// //       phone,
// //       destination,
// //       travelers,
// //       date,
// //       package: pkg ? pkg._id : null,
// //       user: userId || null,
// //       partner: partnerId,
// //     });

// //     await booking.save();
// //     console.log("✅ Booking created with partner:", booking.partner);

// //     // 2️⃣ Populate booking fields
// //     const populatedBooking = await Booking.findById(booking._id)
// //       .populate("package", "title price duration partner")
// //       .populate("user", "name email")
// //       .populate("partner", "companyName email");

// //     console.log("📋 Populated booking:", JSON.stringify(populatedBooking, null, 2));

// //     // 3️⃣ Calculate payment amount
// //     const amount = populatedBooking.package
// //       ? populatedBooking.package.price
// //       : 0;

// //     // 4️⃣ Send confirmation email
// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: `Tripkiya <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: `Your Trip Booking – Payment Pending for ${destination} ✈️`,
// //       html: `<p>Hi ${fullName}, your booking is received. Amount: ₹${amount}</p>`,
// //     });

// //     // 5️⃣ Response
// //     res.status(201).json({
// //       success: true,
// //       message: "Booking created & payment email sent",
// //       booking: populatedBooking,
// //     });
// //   } catch (error) {
// //     console.error("❌ Error creating booking:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: error.message || "Failed to create booking",
// //     });
// //   }
// // };

// export const createBooking = async (req, res) => {
//   try {
//     const { fullName, email, phone, destination, travelers, date, packageId, userId } = req.body;

//     let pkg = null;
//     let partnerId = null;

//     if (packageId) {
//       pkg = await Package.findById(packageId);
//       if (!pkg) {
//         return res.status(404).json({ success: false, message: "Package not found" });
//       }
//       partnerId = pkg.partner; // Get partner from package
//     }

//     const booking = new Booking({
//       fullName,
//       email,
//       phone,
//       destination,
//       travelers,
//       date,
//       package: pkg ? pkg._id : null,
//       user: userId || null,
//       partner: partnerId, // This will auto-assign partner
//     });

//     await booking.save();

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate("package", "title price duration")
//       .populate("user", "name email")
//       .populate("partner", "companyName email");

//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       booking: populatedBooking,
//     });
//   } catch (error) {
//     console.error("❌ Error creating booking:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .populate("user", "name email")
//       .populate("package", "title price duration")
//       .populate("partner", "companyName email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, bookings });
//     console.log("✅ Fetched all bookings:", bookings.length);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getUserBookings = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const bookings = await Booking.find({ email })
//       .populate("package", "title price duration")
//       .populate("partner", "companyName email");
//     res.status(200).json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status: "cancelled" },
//       { new: true }
//     );

//     if (!booking)
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Booking from "../models/bookingSchema.js";
import Package from "../models/Package.js"; // Try with capital P
import nodemailer from "nodemailer";

export const createBooking = async (req, res) => {
  console.log(process.env.EMAIL_USER);

  try {
    const {
      fullName,
      email,
      phone,
      destination,
      travelers,
      date,
      packageId,
      userId,
    } = req.body;

    console.log("📝 Request body:", req.body);
    console.log("📦 Package ID received:", packageId);

    // 🔥 Get package and extract partner from it
    let pkg = null;
    let partnerId = null;

    if (packageId) {
      pkg = await Package.findById(packageId);
      console.log("📦 Package found:", pkg ? "YES" : "NO");
      
      if (!pkg) {
        return res.status(404).json({
          success: false,
          message: "Package not found",
        });
      }

      console.log("👤 Package partner field:", pkg.partner);
      
      // Extract partner from the package
      partnerId = pkg.partner;
      console.log("👤 Partner ID extracted:", partnerId);
    } else {
      console.log("⚠️ No packageId provided in request");
    }

    // 1️⃣ Create booking in DB
    const booking = new Booking({
      fullName,
      email,
      phone,
      destination,
      travelers,
      date,
      package: pkg ? pkg._id : null,
      user: userId || null,
      partner: partnerId,
    });

    await booking.save();
    console.log("✅ Booking created with partner:", booking.partner);

    // 2️⃣ Populate booking fields
    const populatedBooking = await Booking.findById(booking._id)
      .populate("package", "title price duration partner")
      .populate("user", "name email")
      .populate("partner", "companyName email");

    console.log("📋 Populated booking:", JSON.stringify(populatedBooking, null, 2));

    // 3️⃣ Calculate payment amount
    const amount = populatedBooking.package
      ? populatedBooking.package.price
      : 0;

    // 4️⃣ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls:{
        rejectUnauthorized:false,
      }
    });

    await transporter.sendMail({
      from: `Tripkiya <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Trip Booking – Payment Pending for ${destination} ✈️`,
      html: `<p>Hi ${fullName}, your booking is received. Amount: ₹${amount}</p>`,
    });

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      message: "Booking created & payment email sent",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("package", "title price duration")
      .populate("partner", "companyName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
    console.log("✅ Fetched all bookings:", bookings.length);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ email })
      .populate("package", "title price duration")
      .populate("partner", "companyName email");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};