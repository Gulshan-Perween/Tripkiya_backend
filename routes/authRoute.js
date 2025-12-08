import express from "express";
import { registerUser, loginUser, logoutUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/users", getAllUsers);

export default router;

