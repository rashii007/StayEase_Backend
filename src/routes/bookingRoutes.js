import express from "express";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.route("/").get(getBookings).post(createBooking);
router.route("/:id").put(updateBookingStatus).delete(deleteBooking);

export default router;
