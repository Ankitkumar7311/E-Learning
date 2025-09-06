import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import logo from "../../assets/Ellipse.png";

const TeacherNavBar = () => {
  const location = useLocation();

  // Map routes to titles
  const pageTitles = {
    "/teacher-profile": "Faculty Dashboard",
    "/update-teach": "Update Profile",
    "/request-report": "Report / Request",
    "/edit-material": "Edit Material",
    // add more mappings if needed
  };

  // Pick title based on route
  const pageTitle = pageTitles[location.pathname] || "Teacher Section";

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-xl">
      {/* Left Section: Logo + Title */}
      <div className="flex items-center space-x-12">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img className="h-14 w-14" src={logo} alt="E-learning platform" />
          <div>
            <span className="block text-lg font-bold text-gray-800">
              Teacher Section
            </span>
            <span className="block text-sm font-semibold text-gray-600">
              E-learning Platform
            </span>
          </div>
        </div>

        {/* Page Specific Button */}
        <button
          type="button"
          className="bg-slate-200 border border-slate-300 text-slate-700 font-semibold px-6 py-2.5 rounded-full hover:bg-blue-400 hover:text-white transition duration-300"
        >
          {pageTitle}
        </button>
      </div>

      {/* Right Section: Help + Logout */}
      <div className="flex items-center space-x-8">
        <Link
          to="#"
          className="text-gray-700 font-medium hover:text-blue-600 transition duration-300"
        >
          Help & Support
        </Link>
        <button className="flex items-center bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-600 transition duration-300">
          <span>Log out</span>
          <IoLogOutOutline className="w-5 h-5 ml-2" />
        </button>
      </div>
    </nav>
  );
};

export default TeacherNavBar;
