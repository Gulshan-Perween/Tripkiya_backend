import express from "express";
import {
  partnerSignup,
  partnerLogin,
  partnerProfile,

} from "../controllers/partnerController.js";

import {
  createPartnerPackage,
  updatePartnerPackage,
  deletePartnerPackage,
  getMyPackages,
  getAllMyPackages,
    getPartnerPackageDetails, // ✅ ADD

} from "../controllers/partnerPackageController.js";

import { getPartnerBookings } from "../controllers/partnerBookingController.js";

import { protectPartner } from "../middlewares/partnerAuth.js";


const router = express.Router();

// -------- Auth ----------
router.post("/signup", partnerSignup);
router.post("/login", partnerLogin);
router.get("/me", protectPartner, partnerProfile);



// -------- Packages ----------
router.post("/packages",protectPartner,createPartnerPackage);
router.get(
  "/package-details/:id",
  protectPartner,
  getPartnerPackageDetails
);
router.get("/packages", protectPartner, getMyPackages);
router.get("/:id/packages", protectPartner, getAllMyPackages);
router.put("/packages/:id", protectPartner, updatePartnerPackage);
router.delete("/packages/:id", protectPartner, deletePartnerPackage);



// -------- Bookings ----------
router.get("/bookings", protectPartner, getPartnerBookings);

export default router;
