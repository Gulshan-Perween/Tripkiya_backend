import express from "express";
import { addPackageDetails, getPackageDetails } from "../controllers/packageDetailsController.js";

const router = express.Router();

router.post("/add", addPackageDetails);
router.get("/:id", getPackageDetails);

export default router;
