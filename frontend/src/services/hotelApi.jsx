// services/hotelApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/hotels";

export const getHotels = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    console.log("Raw API Response:", response);

    // ✅ Check if response has data property
    if (response.data && response.data.data) {
      // ✅ If response.data.data is array, return it
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }

    // ✅ Fallback: check if response.data itself is array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.error("API returned non-array data:", response.data);
    return []; // Return empty array
  } catch (error) {
    console.error("Get Hotels Error:", error.response?.data || error.message);
    return [];
  }
};

export const createHotel = async (hotelData) => {
  try {
    const response = await axios.post(API_BASE_URL, hotelData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Create Hotel Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateHotel = async (id, hotelData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, hotelData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Update Hotel Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteHotel = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Hotel Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
