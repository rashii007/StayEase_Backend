// routes/roomRoutes.js
import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.route('/').get(getRooms).post(createRoom);
roomRouter.route('/:id').get(getRoomById).put(updateRoom).delete(deleteRoom);

export default roomRouter;