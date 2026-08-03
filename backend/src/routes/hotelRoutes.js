// routes/hotelRoutes.js
import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.route('/').get(getHotels).post(createHotel);
hotelRouter.route('/:id').get(getHotelById).put(updateHotel).delete(deleteHotel);

export default hotelRouter;