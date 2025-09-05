import React from "react";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5"; // Importing the logout icon

// Assume 'logo' is imported from somewhere like:
// import logo from "../../assets/Ellipse.png";
// For this example, I'll use a placeholder if logoSrc is not provided.

const  AdminNavBar = ({
  adminPanelTitle = "Admin Panel",
  platformName = "E-learning Platform",
  globalAdminButtonText = "Global Admin",
  onLogout, // This will be a function passed from the parent
  logoSrc='../src/assets/Ellipse.png', // Optional: Path to your logo image
}) => {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-xl">
      {/* Left Section: Logo + Titles + Global Admin Button */}
      <div className="flex items-center space-x-12">
        {/* Logo and Titles */}
        <div className="flex items-center space-x-4">
          {logoSrc ? (
            <img className="h-14 w-14" src={logoSrc} alt="Platform Logo" />
          ) : (
            // Placeholder for the logo if logoSrc is not provided
            <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">
              LOGO
            </div>
          )}
          <div>
            <span className="block text-lg font-bold text-gray-800">
              {adminPanelTitle}
            </span>
            <span className="block text-sm font-semibold text-gray-600">
              {platformName}
            </span>
          </div>
        </div>

        {/* Global Admin Button */}
        <Link
          to="#"
          className="bg-slate-200 border border-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-full hover:bg-blue-400 hover:text-white transition duration-300"
        >
          {globalAdminButtonText}
        </Link>
      </div>

      {/* Right Section: Help & Support + Logout Button */}
      <div className="flex items-center space-x-8">
        <Link
          to="#"
          className="text-gray-700 font-medium hover:text-blue-600 transition duration-300"
        >
          Help & Support
        </Link>
        <button
          onClick={onLogout} // Attaching the onLogout prop to the onClick event
          className="flex items-center bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          <span>Log out</span>
          <IoLogOutOutline className="w-5 h-5 ml-2" />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavBar;