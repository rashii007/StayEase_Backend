// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);