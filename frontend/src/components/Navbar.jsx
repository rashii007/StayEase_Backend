// components/Navbar.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav
      className={`p-4 flex justify-between items-center shadow-sm ${
        darkMode ? "bg-gray-800 text-white" : "bg-blue-600 text-white"
      }`}
    >
      <h1 className="text-xl font-bold">🏨 StayEase</h1>
      <div className="flex items-center gap-4">
       
        <span className="text-sm font-bold opacity-80 hidden sm:inline">
          Manage Bookings, Rooms & Guests
        </span>
      </div>
    </nav>
  );
}
