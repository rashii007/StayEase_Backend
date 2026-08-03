// pages/Hotels.jsx
import React, { useState, useEffect } from "react";
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../services/hotelApi";
import { useTheme } from "../context/ThemeContext";

// Simple hotel images
const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1584132967338-8a3fe6d8eaa6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
];

const getHotelImage = (index) => {
  return hotelImages[index % hotelImages.length];
};

export default function Hotels() {
  const { darkMode } = useTheme();
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pricePerNight: "",
    rating: "",
    description: "",
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getHotels();
      if (Array.isArray(data)) {
        setHotels(data);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error("Failed to load hotels:", error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateHotel(editingId, formData);
      } else {
        await createHotel(formData);
      }
      setFormData({
        name: "",
        location: "",
        pricePerNight: "",
        rating: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchHotels();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save hotel: " + (error.message || ""));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this hotel?")) {
      try {
        await deleteHotel(id);
        fetchHotels();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete hotel");
      }
    }
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      rating: hotel.rating || "",
      description: hotel.description || "",
    });
    setEditingId(hotel._id);
    setShowForm(true);

    setTimeout(() => {
      const formElement = document.getElementById("hotel-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleImageError = (hotelId) => {
    setImageErrors((prev) => ({ ...prev, [hotelId]: true }));
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div
              className={`h-6 sm:h-8 w-24 sm:w-32 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>
            <div
              className={`h-8 sm:h-10 w-24 sm:w-32 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl shadow-sm border overflow-hidden ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div
                  className={`h-40 sm:h-48 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                ></div>
                <div className="p-3 sm:p-4">
                  <div
                    className={`h-5 sm:h-6 w-3/4 rounded mb-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`h-3 sm:h-4 w-1/2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            🏨 Hotels
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Manage your hotel properties
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                name: "",
                location: "",
                pricePerNight: "",
                rating: "",
                description: "",
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
          {showForm ? "✕ Cancel" : "+ Add Hotel"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search hotels by name or location..."
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
      <div id="hotel-form">
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
              {editingId ? "✏️ Edit Hotel" : "➕ Add New Hotel"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Hotel Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Location *"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <input
                type="number"
                placeholder="Price Per Night *"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerNight: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <input
                type="number"
                placeholder="Rating (0-5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="mt-3 sm:mt-4">
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                rows="2"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                {editingId ? "💾 Update Hotel" : "💾 Save Hotel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: "",
                    location: "",
                    pricePerNight: "",
                    rating: "",
                    description: "",
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
            {hotels.length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Hotels
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
            {hotels.filter((h) => h.rating >= 4).length}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ⭐ 4+ Star Hotels
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
            $
            {hotels
              .reduce((sum, h) => sum + (h.pricePerNight || 0), 0)
              .toLocaleString()}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Value
          </p>
        </div>
        <div
          className={`p-3 sm:p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {hotels.length > 0
              ? Math.round(
                  (hotels.reduce((sum, h) => sum + (h.rating || 0), 0) /
                    hotels.length) *
                    10,
                ) / 10
              : 0}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Avg Rating
          </p>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel, index) => (
            <div
              key={hotel._id}
              className={`rounded-xl shadow-sm border transition-all duration-300 overflow-hidden group ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-700/50"
                  : "bg-white border-gray-100 hover:shadow-lg"
              }`}
            >
              {/* Image */}
              <div className="h-40 sm:h-48 w-full overflow-hidden relative bg-gray-200">
                {!imageErrors[hotel._id] ? (
                  <img
                    src={getHotelImage(index)}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(hotel._id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl sm:text-6xl font-bold">
                    {hotel.name.charAt(0)}
                  </div>
                )}
                {/* Rating badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="text-yellow-400 text-sm sm:text-base">
                    ⭐
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    {hotel.rating || 4.5}
                  </span>
                </div>
                {/* Price badge */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-sm">
                  ${hotel.pricePerNight}/night
                </div>
              </div>

              <div className="p-3 sm:p-5">
                <div>
                  <h3
                    className={`text-base sm:text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {hotel.name}
                  </h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    📍 {hotel.location}
                  </p>
                </div>

                {hotel.description && (
                  <p
                    className={`text-xs sm:text-sm mt-2 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {hotel.description}
                  </p>
                )}

                <div
                  className={`flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                >
                  {/* ✅ Glassmorphism Edit Button */}
                  <button
                    onClick={() => handleEdit(hotel)}
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
                    onClick={() => handleDelete(hotel._id)}
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
          <div
            className={`col-span-full text-center py-8 sm:py-12 rounded-xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <span className="text-4xl sm:text-6xl block mb-3 sm:mb-4">🏨</span>
            <p
              className={
                darkMode
                  ? "text-gray-400 text-base sm:text-lg"
                  : "text-gray-500 text-base sm:text-lg"
              }
            >
              No hotels found
            </p>
            <p
              className={
                darkMode
                  ? "text-gray-500 text-xs sm:text-sm"
                  : "text-gray-400 text-xs sm:text-sm"
              }
            >
              {searchTerm
                ? "Try adjusting your search"
                : "Add your first hotel!"}
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
        Showing {filteredHotels.length} of {hotels.length} hotels
      </div>
    </div>
  );
}
