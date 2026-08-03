// models/Room.js
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Family']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 2
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);