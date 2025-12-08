// routes/partnerBookingRoute.js
import express from "express";
import { getPartnerBookings } from "../controllers/partnerBookingController.js";
import {  protectPartner } from "../middlewares/partnerAuth.js"; // JWT middleware

const router = express.Router();

router.get("/", protectPartner,getPartnerBookings);

export default router;
