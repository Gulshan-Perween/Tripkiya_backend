// controllers/hotelController.js
import axios from "axios";

const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_HOTEL_LIST_URL = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city";
const AMADEUS_HOTEL_OFFERS_URL = "https://test.api.amadeus.com/v3/shopping/hotel-offers";

async function getToken() {
  const response = await axios.post(
    AMADEUS_AUTH_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET
    })
  );

  return response.data.access_token;
}

// Helper function to get hotel offers by IDs
async function getHotelOffers(hotelIds, token, checkInDate, checkOutDate, adults = 1) {
  try {
    const response = await axios.get(AMADEUS_HOTEL_OFFERS_URL, {
      params: {
        hotelIds: hotelIds.join(','), // Comma-separated hotel IDs
        adults: adults,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        currency: 'INR',
        bestRateOnly: true,
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching hotel offers:", error.response?.data || error.message);
    // Return empty array instead of throwing, so we can try other hotels
    return [];
  }
}

// Helper function to try multiple batches of hotels
async function getHotelsWithOffers(hotelList, token, checkInDate, checkOutDate, adults = 1) {
  const batchSize = 10; // Smaller batches for better success rate
  const maxBatches = 10; // Try up to 10 batches
  let allHotelsWithOffers = [];

  for (let i = 0; i < maxBatches && i * batchSize < hotelList.length; i++) {
    const startIdx = i * batchSize;
    const endIdx = Math.min(startIdx + batchSize, hotelList.length);
    const batch = hotelList.slice(startIdx, endIdx);
    const hotelIds = batch.map(h => h.hotelId);

    console.log(`   Trying batch ${i + 1}: Hotels ${startIdx + 1}-${endIdx}`);

    const offers = await getHotelOffers(hotelIds, token, checkInDate, checkOutDate, adults);
    
    if (offers.length > 0) {
      console.log(`   ✅ Found ${offers.length} hotels with offers in batch ${i + 1}`);
      allHotelsWithOffers = [...allHotelsWithOffers, ...offers];
      
      // If we have at least 10 hotels, that's enough
      if (allHotelsWithOffers.length >= 10) {
        break;
      }
    } else {
      console.log(`   ⚠️ No offers in batch ${i + 1}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allHotelsWithOffers;
}

// ====================================
//  🔍 SEARCH HOTELS WITH IMAGES & PRICES
// ====================================
export const searchHotels = async (req, res) => {
  try {
    const token = await getToken();
    const { cityCode, adults = 1, checkInDate, checkOutDate } = req.query;

    if (!cityCode) {
      return res.status(400).json({ 
        success: false, 
        message: "City code is required" 
      });
    }

    // Set default dates if not provided
    const today = new Date();
    const defaultCheckIn = new Date(today);
    defaultCheckIn.setDate(today.getDate() + 7);
    const defaultCheckOut = new Date(defaultCheckIn);
    defaultCheckOut.setDate(defaultCheckIn.getDate() + 1);

    const checkIn = checkInDate || defaultCheckIn.toISOString().split('T')[0];
    const checkOut = checkOutDate || defaultCheckOut.toISOString().split('T')[0];

    console.log(`🔍 Step 1: Getting hotel list for ${cityCode}`);

    // Step 1: Get list of hotels in the city
    const hotelListResponse = await axios.get(AMADEUS_HOTEL_LIST_URL, {
      params: {
        cityCode: cityCode,
        radius: 50,
        radiusUnit: 'KM',
        // Remove ratings filter to get more hotels
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    const hotelList = hotelListResponse.data.data || [];
    console.log(`✅ Found ${hotelList.length} hotels in ${cityCode}`);

    if (hotelList.length === 0) {
      return res.json({
        success: true,
        data: [],
        meta: { count: 0, message: "No hotels found in this city" }
      });
    }

    console.log(`🔍 Step 2: Getting offers for hotels (trying multiple batches)`);

    // Try multiple batches to find hotels with availability
    const hotelsWithOffers = await getHotelsWithOffers(hotelList, token, checkIn, checkOut, adults);

    console.log(`✅ Found ${hotelsWithOffers.length} hotels with offers`);

    res.json({
      success: true,
      data: hotelsWithOffers,
      meta: {
        count: hotelsWithOffers.length,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalHotelsInCity: hotelList.length
      }
    });
  } catch (err) {
    console.error("❌ Search error:", err.response?.data || err.message);
    res.status(500).json({ 
      success: false,
      message: err.response?.data?.errors?.[0]?.detail || err.message || "Error searching hotels" 
    });
  }
};

// ======================================
//  🏨 GET ALL HOTELS (Default Delhi)
// ======================================
export const getAllHotels = async (req, res) => {
  try {
    console.log("🔑 Getting Amadeus token...");
    const token = await getToken();
    console.log("✅ Token received");

    // Default to Delhi with dates 7 days from now
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 1);

    const checkInDate = checkIn.toISOString().split('T')[0];
    const checkOutDate = checkOut.toISOString().split('T')[0];

    console.log(`🏨 Step 1: Getting hotel list for Delhi (DEL)`);

    // Step 1: Get list of hotels in Delhi
    const hotelListResponse = await axios.get(AMADEUS_HOTEL_LIST_URL, {
      params: {
        cityCode: 'DEL',
        radius: 50,
        radiusUnit: 'KM',
        // Remove ratings filter to get more results
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    const hotelList = hotelListResponse.data.data || [];
    console.log(`✅ Found ${hotelList.length} hotels in Delhi`);

    if (hotelList.length === 0) {
      return res.json({
        success: true,
        data: [],
        meta: { count: 0, message: "No hotels found" }
      });
    }

    console.log(`🏨 Step 2: Getting offers (trying multiple batches)`);
    console.log(`📅 Check-in: ${checkInDate}, Check-out: ${checkOutDate}`);

    // Try multiple batches to find hotels with availability
    const hotelsWithOffers = await getHotelsWithOffers(hotelList, token, checkInDate, checkOutDate);

    console.log(`✅ Total hotels with available offers: ${hotelsWithOffers.length}`);

    res.json({
      success: true,
      data: hotelsWithOffers,
      meta: {
        count: hotelsWithOffers.length,
        city: 'Delhi',
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalHotelsInCity: hotelList.length
      }
    });
  } catch (err) {
    console.error("❌ Fetch error FULL:", err);
    console.error("❌ Error response:", err.response?.data);
    console.error("❌ Error message:", err.message);
    
    res.status(500).json({ 
      success: false,
      message: err.response?.data?.errors?.[0]?.detail || err.message || "Error fetching hotels",
      error: err.response?.data || err.message
    });
  }
};