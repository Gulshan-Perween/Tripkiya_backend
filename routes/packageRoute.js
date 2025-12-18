// import express from "express";
// import {
//   addPackage,
//   getAllPackages,
//   getPackageById,
//   updatePackage,
//   deletePackage,
//   deleteAllPackages,
// } from "../controllers/packageController.js";


// const router = express.Router();

// router.get("/", getAllPackages);
// router.get("/:id", getPackageById);

// router.post("/", addPackage);
// router.delete("/", deleteAllPackages)
// router.put("/:id", updatePackage);
// router.delete("/:id",  deletePackage);

// export default router;


import express from "express";
import {
  addPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  deleteAllPackages,
} from "../controllers/packageController.js";

import  isAuthenticated  from "../middlewares/isAuthenticated.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🌍 PUBLIC ROUTES (App / Guest / User)
router.get("/", getAllPackages);
router.get("/:id", getPackageById);

// 🛠 ADMIN + MANAGER (Dashboard)
router.post(
  "/",
  isAuthenticated,
  allowRoles("admin", "manager"),
  addPackage
);

router.put(
  "/:id",
  isAuthenticated,
  allowRoles("admin", "manager"),
  updatePackage
);

// 🔥 ADMIN ONLY
router.delete(
  "/:id",
  isAuthenticated,
  allowRoles("admin"),
  deletePackage
);

router.delete(
  "/",
  isAuthenticated,
  allowRoles("admin"),
  deleteAllPackages
);


export default router;
