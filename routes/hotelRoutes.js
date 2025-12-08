// routes/hotelRoutes.js
import express from "express";
import { searchHotels, getAllHotels } from "../controllers/hotelController.js";

const router = express.Router();

router.get("/search", searchHotels);   // cityCode parameter
router.get("/all", getAllHotels);      // Default Delhi hotels

export default router;