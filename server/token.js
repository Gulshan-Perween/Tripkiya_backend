import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/token", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.AMADEUS_PROD_KEY);
    params.append("client_secret", process.env.AMADEUS_PROD_SECRET);

    const response = await axios.post(
      "https://api.amadeus.com/v1/security/oauth2/token",
      params
    );

    res.json({ token: response.data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
