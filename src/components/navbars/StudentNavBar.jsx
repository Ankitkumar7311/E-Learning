import React from "react";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/Ellipse.png";
import { Link, useLocation } from "react-router-dom";

const StudentNavBar = () => {
  const location = useLocation();
  const buttons = {
    "/documents": "College Materials",
  };
  const buttontext = buttons[location.pathname] || "Error: Wrong Path";

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Vidya Sarthi Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-gray-800 font-bold text-lg">Student Panel</h1>
            <p className="text-gray-500 text-[0.9375rem]">E-learning</p>
          </div>
        </div>

        {/* Center Section: Global Admin Button */}
        <div className="flex-1 flex justify-center">
          <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-2xl hover:bg-blue-300 transition-colors hover:text-white mr-[35.25rem]">
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
    </nav>
  );
};

export default StudentNavBar;
