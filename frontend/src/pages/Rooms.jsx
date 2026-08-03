// pages/Rooms.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

// Room images
const roomImages = [
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
];

const getRoomImage = (index) => {
  return roomImages[index % roomImages.length];
};

export default function Rooms() {
  const { darkMode } = useTheme();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Single",
    price: "",
    hotelId: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      console.log("Rooms API Response:", res.data);

      let roomsData = [];
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        roomsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        roomsData = res.data;
      } else {
        console.error("Rooms data is not an array:", res.data);
        setError("Invalid data format received from server");
      }
      setRooms(roomsData);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      setError(error.response?.data?.message || "Failed to load rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/hotels");
      let hotelsData = [];
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        hotelsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        hotelsData = res.data;
      }
      setHotels(hotelsData);
    } catch (error) {
      console.error("Failed to load hotels:", error);
      setHotels([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/rooms/${editingId}`,
          formData,
        );
      } else {
        await axios.post("http://localhost:5000/api/rooms", formData);
      }
      setFormData({
        roomNumber: "",
        type: "Single",
        price: "",
        hotelId: "",
        isAvailable: true,
      });
      setShowForm(false);
      setEditingId(null);
      fetchRooms();
      alert(
        editingId ? "Room updated successfully!" : "Room added successfully!",
      );
    } catch (error) {
      console.error("Save error:", error);
      setError(error.response?.data?.message || "Failed to save room");
      alert(
        "Failed to save room: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        fetchRooms();
        alert("Room deleted!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete room");
      }
    }
  };

  const handleToggleAvailability = async (room) => {
    const newStatus = !room.isAvailable;
    const action = newStatus ? "available" : "booked";

    if (confirm(`Are you sure you want to mark this room as ${action}?`)) {
      try {
        await axios.put(`http://localhost:5000/api/rooms/${room._id}`, {
          ...room,
          isAvailable: newStatus,
        });
        fetchRooms();
        alert(`Room successfully ${action}!`);
      } catch (error) {
        console.error("Toggle availability error:", error);
        alert("Failed to update room status");
      }
    }
  };

  const handleEdit = (room) => {
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      hotelId: room.hotelId?._id || room.hotelId,
      isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
    });
    setEditingId(room._id);
    setShowForm(true);

    setTimeout(() => {
      const formElement = document.getElementById("room-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleImageError = (roomId) => {
    setImageErrors((prev) => ({ ...prev, [roomId]: true }));
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hotelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading rooms...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        <button
          onClick={fetchRooms}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            🛏️ Rooms
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Manage your hotel rooms
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                roomNumber: "",
                type: "Single",
                price: "",
                hotelId: "",
                isAvailable: true,
              });
            }
          }}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            showForm
              ? darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showForm ? "✕ Cancel" : "+ Add Room"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search rooms by number, type, or hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Form */}
      <div id="room-form">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`p-4 sm:p-6 rounded-xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-base sm:text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {editingId ? "✏️ Edit Room" : "➕ Add New Room"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Room Number *"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                required
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Family">Family</option>
              </select>
              <input
                type="number"
                placeholder="Price *"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <select
                value={formData.hotelId}
                onChange={(e) =>
                  setFormData({ ...formData, hotelId: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                required
              >
                <option value="">Select Hotel *</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 sm:mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className={`w-4 h-4 rounded focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
                <span
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Room Available
                </span>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                {editingId ? "💾 Update Room" : "💾 Save Room"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    roomNumber: "",
                    type: "Single",
                    price: "",
                    hotelId: "",
                    isAvailable: true,
                  });
                }}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-3 sm:p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {rooms.length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Rooms
          </p>
        </div>
        <div
          className={`p-3 sm:p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {rooms.filter((r) => r.isAvailable !== false).length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Available Rooms
          </p>
        </div>
        <div
          className={`p-3 sm:p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {rooms.filter((r) => r.isAvailable === false).length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Booked Rooms
          </p>
        </div>
        <div
          className={`p-3 sm:p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {hotels.length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Hotels
          </p>
        </div>
      </div>

      {/* Rooms Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, index) => (
            <div
              key={room._id}
              className={`rounded-xl shadow-sm border transition-all duration-300 overflow-hidden group ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-700/50"
                  : "bg-white border-gray-100 hover:shadow-lg"
              } ${room.isAvailable === false ? "opacity-75" : ""}`}
            >
              {/* Room Image */}
              <div className="h-40 sm:h-48 w-full overflow-hidden relative bg-gray-200">
                {!imageErrors[room._id] ? (
                  <img
                    src={getRoomImage(index)}
                    alt={room.roomNumber}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(room._id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-6xl font-bold">
                    {room.roomNumber.charAt(0)}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm ${
                      room.isAvailable !== false
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {room.isAvailable !== false ? "🟢 Available" : "🔴 Booked"}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-sm ${
                      room.type === "Single"
                        ? "bg-blue-500 text-white"
                        : room.type === "Double"
                          ? "bg-green-500 text-white"
                          : room.type === "Suite"
                            ? "bg-purple-500 text-white"
                            : room.type === "Deluxe"
                              ? "bg-pink-500 text-white"
                              : "bg-gray-500 text-white"
                    }`}
                  >
                    {room.type}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-sm">
                  ${room.price}/night
                </div>

                {/* Book/Unbook Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleToggleAvailability(room)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      room.isAvailable !== false
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {room.isAvailable !== false ? "📕 Book Now" : "📗 Unbook"}
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                  <div>
                    <h3
                      className={`text-base sm:text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Room #{room.roomNumber}
                    </h3>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      🏨 {room.hotelId?.name || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      room.isAvailable !== false
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {room.isAvailable !== false ? "● Available" : "● Booked"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  {/* ✅ Glassmorphism Edit Button */}
                  <button
                    onClick={() => handleEdit(room)}
                    className={`w-full sm:flex-1 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md border shadow-lg hover:shadow-xl hover:scale-105 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-white/30 border-white/40 text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    ✏️ Edit
                  </button>

                  {/* ✅ Glassmorphism Delete Button */}
                  <button
                    onClick={() => handleDelete(room._id)}
                    className={`w-full sm:flex-1 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md border shadow-lg hover:shadow-xl hover:scale-105 ${
                      darkMode
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-white/30 border-white/40 text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 sm:py-12">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p
              className={`mt-2 text-base sm:text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              No rooms found
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              {searchTerm
                ? "Try adjusting your search"
                : "Add your first room!"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`rounded-xl p-3 sm:p-4 text-center text-xs sm:text-sm ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
      >
        Showing {filteredRooms.length} of {rooms.length} rooms
      </div>
    </div>
  );
}
