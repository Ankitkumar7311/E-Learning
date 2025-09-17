import React, { useState } from "react";
// Importing the icons we'll need for the menu
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
// You should replace this with the actual path to your logo
import logo from "../../assets/Ellipse.png";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminNavBar = () => {
  // State to manage the mobile menu's open/closed status
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const buttons = {
    "/admin/dashboard": "Global Admin",
    "/admin/dashboard/add-remove-faculty": "Add/Remove Faculty",
    "/admin/dashboard/view-faculty-student": "View Faculty/Student",
    "/admin/dashboard/regulation": "Add regulation",
    "/admin/dashboard/add-remove-student": "Add/Remove Student",
    "/request-report":"Report-request"
  };
  const buttontext = buttons[location.pathname] || "error wrong path";

  return (
    <>
      {/* Set a relative position to anchor the absolute menu panel */}
      <nav className="bg-white shadow-sm sticky top-0 w-full z-50 relative">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Vidya Sarthi Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-gray-800 font-bold text-lg">Admin Panel</h1>
              <p className="text-gray-500 text-[15px]">E-learning</p>
            </div>
          </div>

          {/* Center and Right Sections for Desktop */}
          {/* This container is hidden on mobile (below lg) and shown as a flex container on large screens */}
          {/* CHANGE: Changed justify-center to justify-between to align items to the sides */}
          <div className="hidden lg:flex items-center justify-between flex-1 ml-10">
            {/* Left-aligned Button for Desktop */}
            <div>
              <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-2xl hover:bg-blue-300 transition-colors hover:text-white">
                {buttontext}
              </button>
            </div>

            {/* Right Section: Help and Logout */}
            <div className="flex items-center space-x-8">
              <Link
                to="/request-report"
                className="text-gray-700 font-medium hover:text-blue-600 transition duration-300"
              >
                Help & Support
              </Link>
              <Link to="/login">
                <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition-colors">
                  <span>Log out</span>
                  <FiLogOut className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {/* This button is only visible on mobile screens (below lg) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {/* Show close icon if menu is open, otherwise show menu icon */}
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {/* This panel is shown only on mobile screens when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full right-0 w-64 bg-white shadow-lg rounded-b-lg p-5">
            <div className="flex flex-col items-start space-y-5">
              {/* Mobile version of the center and right sections */}
              <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg w-full text-left">
                {buttontext}
              </button>

              <Link
                to="/request-report"
                className="text-gray-700 font-medium hover:text-blue-600 w-full"
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Help & Support
              </Link>

              <Link to="/login" className="w-full">
                <button className="bg-yellow-400 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-500 w-full">
                  <span>Log out</span>
                  <FiLogOut className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default AdminNavBar;