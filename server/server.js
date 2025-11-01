import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/ping", (req, res) => res.json({ status: "ok" }));

// Report endpoint
app.post("/api/report", (req, res) => {
  console.log("Received report:", req.body);
  res.status(201).json({ message: "Report saved" });
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
