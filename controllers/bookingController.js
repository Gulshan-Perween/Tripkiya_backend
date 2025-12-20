
import Booking from "../models/bookingSchema.js";
import Package from "../models/Package.js";
import nodemailer from "nodemailer";
import PartnerPackage from "../models/partnerPackage.js";
export const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      destination,
      travelers,
      date,
      checkOut,
      packageId,
      package: packageFromBody,

      
      userId,
      
    } 
    
    = req.body;

    console.log("📝 Request received at:", new Date().toISOString());
    console.log("📦 Package ID:", packageId || packageFromBody);

    const finalPackageId = packageId || packageFromBody;

    if (!finalPackageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    // Validate required fields
    if (!fullName || !email || !phone || !destination || !travelers || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get package
  // 🔍 Get package (normal OR partner)
let pkg = await Package.findById(finalPackageId);
let partnerId = null;

if (!pkg) {
  // Try partner package
  const partnerPkg = await PartnerPackage.findById(finalPackageId);
  if (partnerPkg) {
    pkg = partnerPkg;
    partnerId = partnerPkg.partner; // 🔥 IMPORTANT
  }
}

if (!pkg) {
  return res.status(404).json({
    success: false,
    message: "Package not found",
  });
}

console.log("✅ Package found:", pkg.title);


    // Create booking - THIS HAPPENS FIRST
    const booking = new Booking({
      fullName,
      email,
      phone,
      destination,
      travelers: parseInt(travelers),
      date: new Date(date),
      checkOut: checkOut ? new Date(checkOut) : null,
      package: pkg._id,
       amountPaid: Number(pkg.price),
      user: userId || null,
      partner: partnerId || pkg.partner || null,
      status: "confirmed",
    });

    await booking.save();
    console.log("✅ Booking saved:", booking._id);

    // Populate booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate("package", "title price duration")
      .populate("partner", "companyName email");

    // 🔥 SEND RESPONSE IMMEDIATELY - Don't wait for email
    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully! You will receive a confirmation email shortly.",
      booking: populatedBooking,
    });

    console.log("✅ Response sent to client");

    // 🔥 Send email AFTER response (async, won't block)
    setImmediate(async () => {
      try {
        console.log("📧 Starting email send (async)...");

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
          // Add timeout settings
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });

        const mailOptions = {
          from: `TripKiya <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Booking Confirmation - ${destination} ✈️`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563EB;">Booking Confirmation</h2>
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Your booking has been confirmed! 🎉</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Destination:</strong> ${destination}</p>
                <p><strong>Package:</strong> ${pkg.title}</p>
                <p><strong>Check-in:</strong> ${new Date(date).toLocaleDateString()}</p>
                ${checkOut ? `<p><strong>Check-out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>` : ''}
                <p><strong>Travelers:</strong> ${travelers}</p>
                <p><strong>Price:</strong> ₹${pkg.price}</p>
                <p><strong>Booking ID:</strong> ${booking._id}</p>
              </div>
              
              <p>We will contact you shortly at <strong>${phone}</strong>.</p>
              <p>Thank you for choosing TripKiya!</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", email);

      } catch (emailError) {
        console.error("⚠️ Email failed (but booking is saved):", emailError.message);
        // Email failed, but booking is already successful
        // You could save this to a queue for retry later
      }
    });

  } catch (error) {
    console.error("❌ Booking error:", error);
    
    // Only send error response if we haven't sent success yet
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create booking",
      });
    }
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
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};