// In your routes file (e.g., routes/packageRoutes.js or create routes/migrationRoutes.js)

import express from "express";
import {
  assignPartnerToPackages,
  checkPackagesWithoutPartner,
  getPackageStats
} from "../controllers/packageMigrationController.js";
import { protectPartner } from "../middlewares/partnerAuth.js";

const router = express.Router();

// Migration endpoints (you can protect these or make them admin-only)
router.post("/migrate/assign-partner", assignPartnerToPackages);
router.get("/migrate/check-packages", checkPackagesWithoutPartner);
router.get("/migrate/stats", getPackageStats);

export default router;