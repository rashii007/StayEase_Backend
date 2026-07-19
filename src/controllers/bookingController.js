import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// @desc   Get all bookings
// @route  GET /api/bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("hotel", "name location pricePerNight");
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc   Create new booking
// @route  POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { hotel, checkIn, checkOut, guests } = req.body;

    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: "Invalid check-in/check-out dates" });
    }

    const totalPrice = nights * hotelDoc.pricePerNight;

    const booking = await Booking.create({
      ...req.body,
      totalPrice,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Update booking status
// @route  PUT /api/bookings/:id
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete booking
// @route  DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
