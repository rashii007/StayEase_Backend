// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar toggle function
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  return (
    <nav
      className={`w-full p-2 sm:p-3 md:p-4 flex justify-between items-center shadow-sm ${
        darkMode ? "bg-gray-800 text-white" : "bg-blue-600 text-white"
      }`}
    >
      {/* ✅ Left Side - Hamburger + Brand */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0">
        {/* 3-Line Hamburger - Mobile Only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Brand */}
        <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">
          🏨 StayEase
        </h1>
      </div>

      {/* ✅ Right Side - Tagline + Theme Toggle */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        {/* Tagline - Hidden on small screens */}
        <span className="hidden md:inline text-xs lg:text-sm font-medium opacity-80 truncate max-w-[120px] lg:max-w-[200px]">
          Manage Bookings, Rooms & Guests
        </span>

        {/* Tagline - Short version for tablet */}
        <span className="hidden sm:inline md:hidden text-xs font-medium opacity-80">
          Manage StayEase
        </span>
      </div>
    </nav>
  );
}
