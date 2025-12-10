import express from "express";
import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/sendingMail.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "All fields required" });

    const saved = await Contact.create({ name, email, message });

    await sendContactMail({ name, email, message });

    return res.json({ success: true, message: "Message sent", data: saved });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
});

export default router;
