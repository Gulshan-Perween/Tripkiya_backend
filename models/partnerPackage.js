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
  { _id: false } // Prevent separate _id for each subdocument
);

const partnerPackageSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    // 🔹 Same fields you use for admin-created packages
    title: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },

    itinerary: [itinerarySchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    images: [{ type: String }],

    companyDetails: companyDetailsSchema, // 🔵 Same company details block

  },
  { timestamps: true }
);

export default mongoose.model("PartnerPackage", partnerPackageSchema);
