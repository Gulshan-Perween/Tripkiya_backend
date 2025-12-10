import { sendEmail } from "./utils/sendingMail.js";

console.log("User:", process.env.EMAIL_USER);
console.log("Pass:", process.env.EMAIL_PASS);

sendEmail(
  "your@gmail.com",
  "Testing email",
  "This is a test message"
);
