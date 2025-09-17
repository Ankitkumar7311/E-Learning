import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/Ellipse.png";

const TeacherNavBar = () => {
  const location = useLocation();

  // Map routes to titles - no changes needed here
  const pageTitles = {
    "/teacher/update-profile": "Update Profile",
    "/teacher/dashboard": "Faculty Panel",
    "/request-report": "Report / Request",
    "/edit-material": "Edit Material",
  };

  // Pick title based on route - no changes needed here
  const pageTitle = pageTitles[location.pathname] || "Teacher Section";

  return (
    // --- RESPONSIVE CHANGES to the <nav> element ---
    // 1. `flex-wrap`: Allows items to wrap onto a new line on smaller screens.
    // 2. `gap-y-4`: Adds a vertical gap when items do wrap.
    // 3. `px-4 md:px-6`: Reduces horizontal padding for mobile and restores it for medium screens and up.
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-y-4 bg-white px-4 py-3 shadow-xl md:px-6">
      
      {/* --- Left Section: Logo + Title --- */}
      {/* Reduced horizontal spacing for mobile (`space-x-4`) and restored for larger screens (`md:space-x-12`). */}
      <div className="flex items-center space-x-4 md:space-x-12">
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          {/* Logo is slightly smaller on mobile (`h-12 w-12`) and larger on small screens and up (`sm:h-14 sm:w-14`). */}
          <img className="h-12 w-12 sm:h-14 sm:w-14" src={logo} alt="E-learning platform" />
          <div>
            <span className="block text-base font-bold text-gray-800 sm:text-lg">
              Teacher Panel
            </span>
            {/* The subtitle is hidden on extra-small screens (`hidden`) and becomes visible on small screens and up (`sm:block`) to save space. */}
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">
              E-learning Platform
            </span>
          </div>
        </div>

        {/* Page Specific Button */}
        {/* This button is hidden on mobile (`hidden`) and appears on medium screens and up (`md:flex`) to prevent clutter. */}
        <button
          type="button"
          className="hidden rounded-full border border-slate-300 bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 transition duration-300 hover:bg-blue-400 hover:text-white md:flex"
        >
          {pageTitle}
        </button>
      </div>

      {/* --- Right Section: Help + Logout --- */}
      {/* Reduced spacing for mobile (`space-x-6`) and restored for medium screens (`md:space-x-8`). */}
      <div className="flex items-center space-x-6 md:space-x-8">
        <Link
          to="/request-report"
          className="font-medium text-gray-700 transition duration-300 hover:text-blue-600"
        >
          Help & Support
        </Link>
        <Link to="/login">
          <button className="flex items-center space-x-2 rounded-lg bg-yellow-400 py-2 px-4 font-bold text-white transition-colors hover:bg-yellow-500">
            {/* The "Log out" text is hidden on mobile (`hidden`) and appears on small screens (`sm:inline`) to create an icon-only button. */}
            <span className="hidden sm:inline">Log out</span>
            <FiLogOut className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default TeacherNavBar;