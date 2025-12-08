import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    price: { type: Number, required: true }, // base per night price
    address: String,
    imageUrl: String,
    description: String,
    amenities: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
