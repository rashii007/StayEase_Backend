// components/Layout.jsx - With bottom padding for mobile bottom nav
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main
          className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 lg:pb-6 ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
