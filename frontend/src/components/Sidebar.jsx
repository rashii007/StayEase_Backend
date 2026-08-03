// components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for hamburger click event from Navbar
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(!isOpen);
    };
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, [isOpen]);

  const menuItems = [
    { path: "/", icon: "📊", label: "Dashboard" },
    { path: "/hotels", icon: "🏨", label: "Hotels" },
    { path: "/rooms", icon: "🛏️", label: "Rooms" },
    { path: "/bookings", icon: "📅", label: "Bookings" },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* ✅ Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ✅ Sidebar - Right Side */}
      <div
        className={`fixed lg:static z-50 h-screen bg-gray-800 text-white flex flex-col flex-shrink-0 transition-all duration-300 ${
          isOpen || !isMobile ? "translate-x-0" : "translate-x-full"
        } ${isMobile ? "w-72 right-0" : "w-64 right-0 lg:right-auto"}`}
      >
        {/* ✅ Close Button */}
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        )}

        {/* ✅ Logo */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-center">🏨 StayEase</h2>
          <p className="text-xs text-center text-gray-400">Admin Panel</p>
        </div>

        {/* ✅ Menu Items */}
        <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={closeSidebar}
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

        {/* ✅ Theme Toggle */}
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
    </>
  );
}
