// components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const menuItems = [
    { path: "/", icon: "📊", label: "Dashboard" },
    { path: "/hotels", icon: "🏨", label: "Hotels" },
    { path: "/rooms", icon: "🛏️", label: "Rooms" },
    { path: "/bookings", icon: "📅", label: "Bookings" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col flex-shrink-0">

      {/* Menu Items */}
      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ✅ Theme Toggle Button - Bottom Left */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
            darkMode
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 hover:scale-105"
              : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:scale-105"
          }`}
        >
          <span className="text-xl">{darkMode ? "☀️" : "🌙"}</span>
          <span className="text-sm font-medium">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
}
