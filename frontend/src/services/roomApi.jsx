// services/roomApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/rooms";

export const getRooms = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error("Get Rooms Error:", error.response?.data || error.message);
    return [];
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Get Room Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(API_BASE_URL, roomData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Create Room Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, roomData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Update Room Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Room Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
