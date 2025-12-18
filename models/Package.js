import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  day: { type: String, required: true },
  details: { type: String, required: true },
});

const companyDetailsSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { _id: false }
); // _id: false prevents creating separate IDs for subdocuments

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    itinerary: [itinerarySchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    images: [{ type: String }],
    companyDetails: companyDetailsSchema, // 🔵 Added company details

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null, // ✅ bas yahin hona chahiye
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("Package", packageSchema);
