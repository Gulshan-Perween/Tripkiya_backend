import mongoose from "mongoose";

const PackageDetailsSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true
  },

  heroTitle: String,
  heroSubtitle: String,
  heroImage: String,

  itinerary: [
    {
      dayNumber: Number,
      title: String,
      description: String,
      icon: String,
      color: String,
    }
  ],

  highlights: [
    {
      icon: String,
      text: String
    }
  ],

  attractions: [
    {
      name: String,
      price: Number,
      icon: String
    }
  ],

  hotel: {
    name: String,
    image: String,
    details: String,
    features: [String]
  },

  bestTime: {
    season: String,
    description: String
  },

}, { timestamps: true });

const PackageDetails = mongoose.model("PackageDetails", PackageDetailsSchema);
export default PackageDetails;
