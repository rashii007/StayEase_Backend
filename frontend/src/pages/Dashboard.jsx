// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { getHotels } from "../services/hotelApi";
import { getBookings } from "../services/bookingApi";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hotels: 0,
    bookings: 0,
    revenue: 0,
    occupancy: 0,
    recentBookings: [],
    popularHotels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hotels = await getHotels();
        const bookings = await getBookings();

        const totalRevenue = bookings.reduce(
          (sum, b) => sum + (b.totalPrice || 0),
          0,
        );
        const occupancyRate =
          hotels.length > 0
            ? Math.round((bookings.length / (hotels.length * 10)) * 100)
            : 0;

        setStats({
          hotels: hotels.length,
          bookings: bookings.length,
          revenue: totalRevenue,
          occupancy: Math.min(occupancyRate, 100),
          recentBookings: bookings.slice(0, 5),
          popularHotels: hotels.slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div
            className={`h-8 w-48 rounded mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          ></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl shadow-sm border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-lg mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`h-4 w-24 rounded mb-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`h-8 w-16 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    trend,
    onClick,
  }) => (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"} bg-${trend > 0 ? "green" : "red"}-50 px-2 py-1 rounded-full`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3
        className={`text-sm font-medium mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {title}
      </h3>
      <p
        className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        {value}
      </p>
      {subtitle && (
        <p
          className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Dashboard
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Welcome back! Here's what's happening with your bookings.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigateTo("/bookings")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              darkMode
                ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            📅 View All Bookings
          </button>
          <button
            onClick={() => navigateTo("/hotels")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Manage Hotels
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hotels"
          value={stats.hotels}
          icon="🏨"
          color="bg-blue-500"
          trend={12}
          onClick={() => navigateTo("/hotels")}
        />
        <StatCard
          title="Total Bookings"
          value={stats.bookings}
          icon="📅"
          color="bg-green-500"
          trend={8}
          onClick={() => navigateTo("/bookings")}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💰"
          color="bg-purple-500"
          subtitle="This month"
          trend={15}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancy}%`}
          icon="📊"
          color="bg-orange-500"
          subtitle={`${stats.bookings} rooms booked`}
          trend={stats.occupancy > 50 ? 5 : -3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div
          className={`p-6 rounded-xl shadow-sm border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Recent Bookings
            </h2>
            <button
              onClick={() => navigateTo("/bookings")}
              className="text-blue-600 text-sm hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking, i) => (
                <div
                  key={i}
                  onClick={() => navigateTo("/bookings")}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-10 rounded-full ${i % 2 === 0 ? "bg-green-500" : "bg-blue-500"}`}
                    ></div>
                    <div>
                      <p
                        className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {booking.guestName}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Room {booking.roomNumber} •{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <p
                className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
              >
                No recent bookings
              </p>
            )}
          </div>
        </div>

        {/* Popular Hotels */}
        <div
          className={`p-6 rounded-xl shadow-sm border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Popular Hotels
            </h2>
            <button
              onClick={() => navigateTo("/hotels")}
              className="text-blue-600 text-sm hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {stats.popularHotels.length > 0 ? (
              stats.popularHotels.map((hotel, i) => (
                <div
                  key={i}
                  onClick={() => navigateTo("/hotels")}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {hotel.name.charAt(0)}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {hotel.name}
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {hotel.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {hotel.rating || 4.5}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p
                className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
              >
                No hotels available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">🚀 Quick Actions</h3>
            <p className="text-blue-100 text-sm">
              Manage your hotels and bookings efficiently
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo("/hotels")}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              🏨 Add Hotel
            </button>
            <button
              onClick={() => navigateTo("/rooms")}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              🛏️ Add Room
            </button>
            <button
              onClick={() => navigateTo("/bookings")}
              className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              📅 New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.hotels}</p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Total Hotels
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{stats.bookings}</p>
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
          <p className="text-2xl font-bold text-purple-600">
            ${stats.revenue.toLocaleString()}
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Revenue
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <p className="text-2xl font-bold text-orange-600">
            {stats.occupancy}%
          </p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Occupancy
          </p>
        </div>
      </div>
    </div>
  );
}
