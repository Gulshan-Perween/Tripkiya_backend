import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);
