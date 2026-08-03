// pages/Bookings.jsx
import React, { useState, useEffect } from "react";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../services/bookingApi";
import { useTheme } from "../context/ThemeContext";

export default function Bookings() {
  const { darkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    status: "pending",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings();
      console.log("Bookings API Response:", data);

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Bookings data is not an array:", data);
        setError("Invalid data format received from server");
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setError(error.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateBookingStatus(editingId, formData.status);
      } else {
        await createBooking(formData);
      }
      setFormData({
        guestName: "",
        roomNumber: "",
        checkIn: "",
        checkOut: "",
        status: "pending",
      });
      setShowForm(false);
      setEditingId(null);
      fetchBookings();
      alert(
        editingId
          ? "Booking updated successfully!"
          : "Booking created successfully!",
      );
    } catch (error) {
      console.error("Save error:", error);
      setError(error.message || "Failed to save booking");
      alert("Failed to save booking: " + (error.message || ""));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this booking?")) {
      try {
        await deleteBooking(id);
        fetchBookings();
        alert("Booking deleted!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete booking");
      }
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      guestName: booking.guestName,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn
        ? new Date(booking.checkIn).toISOString().split("T")[0]
        : "",
      checkOut: booking.checkOut
        ? new Date(booking.checkOut).toISOString().split("T")[0]
        : "",
      status: booking.status || "pending",
    });
    setEditingId(booking._id);
    setShowForm(true);

    setTimeout(() => {
      const formElement = document.getElementById("booking-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusCounts = bookings.reduce((acc, booking) => {
    const status = booking.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading bookings...
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
          onClick={fetchBookings}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            📅 Bookings
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Manage your guest bookings
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                guestName: "",
                roomNumber: "",
                checkIn: "",
                checkOut: "",
                status: "pending",
              });
            }
          }}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            showForm
              ? darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showForm ? "✕ Cancel" : "+ Add Booking"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search bookings by guest, room, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
            }`}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Form */}
      <div id="booking-form">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className={`p-6 rounded-xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              {editingId ? "✏️ Edit Booking" : "➕ Add New Booking"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Guest Name *"
                value={formData.guestName}
                onChange={(e) =>
                  setFormData({ ...formData, guestName: e.target.value })
                }
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <input
                type="text"
                placeholder="Room Number *"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData({ ...formData, checkIn: e.target.value })
                }
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                required
              />
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData({ ...formData, checkOut: e.target.value })
                }
                className={`border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                required
              />
            </div>
            {editingId && (
              <div className="mt-4">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full md:w-48 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingId ? "💾 Update Booking" : "💾 Save Booking"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    guestName: "",
                    roomNumber: "",
                    checkIn: "",
                    checkOut: "",
                    status: "pending",
                  });
                }}
                className={`px-6 py-2 rounded-lg transition-colors ${
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Bookings
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-yellow-600">
            {statusCounts.pending || 0}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ⏳ Pending
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.confirmed || 0}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ✅ Confirmed
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-red-600">
            {statusCounts.cancelled || 0}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ❌ Cancelled
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div
        className={`rounded-xl shadow-sm border overflow-hidden ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        <div className="overflow-x-auto">
          {filteredBookings.length > 0 ? (
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Guest
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Room
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Check In
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Check Out
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
              >
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {booking.guestName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {booking.roomNumber}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status || "pending"}
                        onChange={(e) =>
                          handleUpdateStatus(booking._id, e.target.value)
                        }
                        className={`border rounded px-2 py-1 text-sm font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {/* ✅ Glassmorphism Edit Button */}
                        <button
                          onClick={() => handleEdit(room)}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 text-slate-500"
                        >
                          ✏️ Edit
                        </button>

                        {/* ✅ Glassmorphism Delete Button */}
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 text-slate-500"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p
                className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                No bookings found
              </p>
              <p
                className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                {searchTerm
                  ? "Try adjusting your search"
                  : "Add your first booking!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`rounded-xl p-4 text-center text-sm ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
      >
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>
    </div>
  );
}
