// routes/bookingRoutes.js
import express from 'express';
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.route('/').get(getBookings).post(createBooking);
bookingRouter.route('/:id').put(updateBookingStatus).delete(deleteBooking);

export default bookingRouter;