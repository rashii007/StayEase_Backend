// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import hotelRouter from "./src/routes/hotelRoutes.js";
import bookingRouter from "./src/routes/bookingRoutes.js";
import roomRouter from "./src/routes/roomRoutes.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hotels", hotelRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/rooms", roomRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
