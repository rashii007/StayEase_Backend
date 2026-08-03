# StayEase Backend

Simple REST API for the StayEase hotel booking app. Built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

3. Make sure MongoDB is running locally, or use a MongoDB Atlas connection string in `MONGO_URI`.

4. Run the server:
   ```
   npm run dev
   ```
   Server runs at `http://localhost:5000`

## API Endpoints

### Hotels
| Method | Endpoint          | Description        |
|--------|-------------------|---------------------|
| GET    | /api/hotels       | Get all hotels      |
| GET    | /api/hotels/:id   | Get single hotel    |
| POST   | /api/hotels       | Create new hotel    |
| PUT    | /api/hotels/:id   | Update hotel        |
| DELETE | /api/hotels/:id   | Delete hotel        |

### Bookings
| Method | Endpoint            | Description             |
|--------|---------------------|--------------------------|
| GET    | /api/bookings       | Get all bookings         |
| POST   | /api/bookings       | Create new booking       |
| PUT    | /api/bookings/:id   | Update booking status    |
| DELETE | /api/bookings/:id   | Delete booking            |

## Example: Create a hotel

```
POST /api/hotels
Content-Type: application/json

{
  "name": "Grand Palace Hotel",
  "location": "Lahore, Pakistan",
  "description": "A luxury 5-star hotel in the heart of the city",
  "pricePerNight": 15000,
  "roomsAvailable": 20,
  "amenities": ["WiFi", "Pool", "Breakfast"]
}
```

## Example: Create a booking

```
POST /api/bookings
Content-Type: application/json

{
  "hotel": "<hotel_id_here>",
  "guestName": "Rashid Ali",
  "guestEmail": "rashid@example.com",
  "checkIn": "2026-08-01",
  "checkOut": "2026-08-04",
  "guests": 2
}
```

## Project Structure

```
stayease-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── hotelController.js # Hotel CRUD logic
│   └── bookingController.js
├── middleware/
│   └── errorMiddleware.js # Error handling
├── models/
│   ├── Hotel.js            # Hotel schema
│   └── Booking.js          # Booking schema
├── routes/
│   ├── hotelRoutes.js
│   └── bookingRoutes.js
├── server.js               # Entry point
└── .env.example
```

## Next Steps to Level Up

- Add authentication (JWT) for admin-only hotel creation
- Add pagination and filtering to GET /api/hotels (by location, price range)
- Add image upload (Cloudinary or S3)
- Write tests with Jest + Supertest
- Deploy to Render/Railway and connect MongoDB Atlas
