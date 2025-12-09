import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingRoute.js";
import authRoutes from "./routes/authRoute.js";
import packageRoutes from "./routes/packageRoute.js";
import Package from "./models/Package.js";
import packageDetailsRoutes from "./routes/packageDetailsRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import payment from "./routes/payments.js";
import partnerRoute from "./routes/partnerRoute.js";
import partnerBookingRoute from "./routes/partnerBookingRoute.js";
import migrationRoutes from "./routes/migrationRoutes.js";


dotenv.config();

const app = express();

app.use(cookieParser());

app.use(cors()); // allow all origins for testing

connectDB();
// app.use(cors(corsOptions));
app.use(express.json());

/* ------------------------  
   🔹 Amadeus Production API  
---------------------------*/
import axios from "axios";
import partnerPackage from "./models/partnerPackage.js";

// 1️⃣ Get Production Access Token
app.get("/api/amadeus/token", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.AMADEUS_PROD_KEY);
    params.append("client_secret", process.env.AMADEUS_PROD_SECRET);

    const response = await axios.post(
      "https://api.amadeus.com/v1/security/oauth2/token",
      params
    );
    console.log("Token Response:", response.data);

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.log("Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.get("/api/amadeus/city-code", async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Missing ?keyword=Delhi" });
  }

  try {
    // 1️⃣ Get Amadeus Token
    const tokenRes = await axios.get("http://localhost:3000/api/amadeus/token");
    const token = tokenRes.data.access_token;

    // 2️⃣ Call Amadeus CITY Autocomplete API
    const response = await axios.get(
      "https://api.amadeus.com/v1/reference-data/locations",
      {
        params: {
          keyword,
          subType: "CITY",
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const city = response.data.data?.[0];

    if (!city) return res.json({ code: null });

    return res.json({ code: city.iataCode }); // Example: { code: "DEL" }
  } catch (error) {
    console.log("City Code Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 2️⃣ Flight Search (Production)
app.get("/api/amadeus/flight-offers", async (req, res) => {
  const { from, to, date, adults } = req.query;

  try {
    // First Get Token
    const tokenRes = await axios.get("http://localhost:3000/api/amadeus/token");
    const token = tokenRes.data.access_token;

    // Then Fetch Flights
    const response = await axios.get(
      "https://api.amadeus.com/v2/shopping/flight-offers",
      {
        params: {
          originLocationCode: from.toUpperCase(),
          destinationLocationCode: to.toUpperCase(),
          departureDate: date,
          adults,
          currencyCode: "INR",
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log("Flight Search Error:", error.response?.data || error.message);

    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// ⛔ DON'T USE GET — Amadeus needs POST
// app.post("/api/amadeus/flight-price", async (req, res) => {
//   try {
//     const flightOffer = req.body.flight;

//     if (!flightOffer) {
//       return res.status(400).json({ error: "Missing flight offer" });
//     }

//     // 1️⃣ Get Access Token
//     const tokenRes = await axios.get("http://localhost:3000/api/amadeus/token");
//     const token = tokenRes.data.access_token;

//     // 2️⃣ Send REAL Amadeus Pricing Request
//     const response = await axios.post(
//       "https://api.amadeus.com/v1/shopping/flight-offers/pricing",
//       {
//         data: {
//           type: "flight-offers-pricing",
//           flightOffers: [flightOffer],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.log("Flight Price Error:", error.response?.data || error.message);
//     res.status(500).json({ error: error.response?.data || error.message });
//   }
// });

// 🔥 Fixed Flight Pricing Endpoint with Better Error Handling
app.post("/api/amadeus/flight-price", async (req, res) => {
  try {
    console.log("📥 Received request body:", JSON.stringify(req.body, null, 2));

    const flightOffer = req.body.flight;

    // 🔥 Better validation
    if (!flightOffer) {
      console.log("❌ No flight offer in request body");
      return res.status(400).json({ 
        error: "Missing flight offer",
        received: req.body 
      });
    }

    // 🔥 Validate flight offer structure
    if (!flightOffer.id || !flightOffer.itineraries) {
      console.log("❌ Invalid flight offer structure");
      return res.status(400).json({ 
        error: "Invalid flight offer structure",
        received: flightOffer 
      });
    }

    console.log("✅ Valid flight offer received, ID:", flightOffer.id);

    // 1️⃣ Get Access Token
    const tokenRes = await axios.get("http://localhost:3000/api/amadeus/token");
    const token = tokenRes.data.access_token;

    console.log("✅ Token obtained");

    // 2️⃣ Send REAL Amadeus Pricing Request
    const response = await axios.post(
      "https://api.amadeus.com/v1/shopping/flight-offers/pricing",
      {
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flightOffer],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Pricing response received");
    res.json(response.data);

  } catch (error) {
    console.log("❌ Flight Price Error:", error.response?.data || error.message);
    
    // Return more detailed error info
    res.status(500).json({ 
      error: error.response?.data || error.message,
      details: error.response?.data?.errors || []
    });
  }
});

app.use(
  "/api/bookings",
  (req, res, next) => {
    console.log("📩 Booking route hit:", req.method, req.url);
    next();
  },
  bookingRoutes
);
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/payments", payment);
app.use("/api/partner", partnerRoute);
app.use("/api/partner/booking", partnerBookingRoute);
app.use("/api/packages", migrationRoutes);


app.use("/api/package-details", packageDetailsRoutes);

const PORT = process.env.PORT || 3000;
console.log(PORT);
// const findPackages = async(req,res)=>{
//   const packages = await partnerPackage.find({
   
//   })
//   console.log(packages);
// }
// findPackages();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// 192.168.1.44

