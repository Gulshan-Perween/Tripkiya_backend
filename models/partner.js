import mongoose from "mongoose";
import bcrypt from "bcrypt";


const partnerSchema = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
agencyName: { type: String },
phone: { type: String },
bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
packages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
},
{ timestamps: true }
);



partnerSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
this.password = await bcrypt.hash(this.password, 10);
next();
});



partnerSchema.methods.matchPassword = async function (password) {
return await bcrypt.compare(password, this.password);
};


export default mongoose.model("Partner", partnerSchema);

