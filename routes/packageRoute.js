import express from "express";
import {
  addPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  deleteAllPackages,
} from "../controllers/packageController.js";


const router = express.Router();

router.get("/", getAllPackages);
router.get("/:id", getPackageById);

router.post("/", addPackage);
router.delete("/", deleteAllPackages)
router.put("/:id", updatePackage);
router.delete("/:id",  deletePackage);

export default router;
