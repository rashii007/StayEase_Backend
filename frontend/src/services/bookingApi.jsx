// services/bookingApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/bookings";

export const getBookings = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    console.log("Raw Bookings Response:", response.data);

    // ✅ FIX: Check for nested data property
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data; // ✅ Return actual array
    }

    // Fallback: if response.data itself is array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.error("Bookings API returned non-array:", response.data);
    return []; // ✅ Always return array
  } catch (error) {
    console.error("Get Bookings Error:", error.response?.data || error.message);
    return [];
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(API_BASE_URL, bookingData);
    return response.data.data || response.data;
  } catch (error) {
    console.error(
      "Create Booking Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, { status });
    return response.data.data || response.data;
  } catch (error) {
    console.error(
      "Update Booking Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Delete Booking Error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};
